# Authentication Control Flow Diagram & Re-Authentication Logic

This document details the control flow and architecture for the Redux Toolkit Query (`rtk-query`) custom automatic re-authentication logic (`baseQueryWithReAuth`), including Mutex concurrency handling, header suppression, payload normalization, and user notifications.

## Flowchart Overview

```text
       [ Outgoing API Request ]
                  │
                  ▼
     Check for 'x-no-auth' header in prepareHeaders
       ├── Present ──► Remove 'x-no-auth' header & skip Authorization header
       └── Absent  ──► Attach "Authorization: Bearer <accessToken>" (if token exists)
                  │
                  ▼
       [ Wait for Mutex Unlock ]  <── Ensures concurrent requests wait if refresh is in progress
                  │
                  ▼
         [ Execute Request ]
                  │
                  ▼
      Is HTTP Status 401 & Request URL != '/auth/refresh'?
       ├── No  ──► Return API data/error to component (Done)
       └── Yes ─► Intercept 401 Unauthorized Error
                  │
                  ▼
         Is Mutex Locked by another request?
         ├── Yes ─► [ Wait for Mutex to Unlock ]
         │            │
         │            ▼
         │          [ Retry Original Request with New Credentials ]
         │            │
         │            ▼
         │          Return final retry result to component
         │
         └── No  ─► [ Lock Mutex ] (acquire lock)
                      │
                      ▼
            Does Refresh Token Exist in State?
            ├── No  ──► Dispatch logout() ──► [ Release Mutex ] ──► Return 401 Error
            └── Yes ─► [ Execute Token Refresh Request ]
                       POST /auth/refresh with { refreshToken } & 'x-no-auth: true'
                            │
                            ▼
                Was Refresh Request Successful?
                  ├── No / Throws Error ──► Show error toast ("Token refresh failed")
                  │                         Dispatch logout()
                  │                         [ Release Mutex ] ──► Return 401 Error
                  │
                  └── Yes ───────────────► [ Normalize Response Payload ]
                                            Extract accessToken/token, user, refreshToken
                                                 │
                                                 ▼
                                            Show success toast ("Token Refresh Successful")
                                            Dispatch setCredentials(newTokens)
                                                 │
                                                 ▼
                                            [ Retry Original Request ]
                                                 │
                                                 ▼
                                            [ Release Mutex in finally block ]
                                                 │
                                                 ▼
                                            Return final retry result to component
```

## Key Architectural Principles & Features

### 1. Header Suppression (`x-no-auth`)
When sending a token refresh request (`/auth/refresh`), attaching an expired `Bearer` access token can cause server-side validation conflicts or unexpected 401 responses.
- `prepareHeaders` checks for the custom header `x-no-auth`.
- If detected, `prepareHeaders` strips `x-no-auth` from headers and returns without attaching the `Authorization` header.

### 2. Infinite Loop Prevention
- The 401 interceptor specifically checks that `requestUrl !== "/auth/refresh"`.
- If `/auth/refresh` itself returns a `401 Unauthorized`, it bypasses the re-auth interceptor, avoiding recursive refresh loops.

### 3. Concurrency & Race Condition Mitigation (`async-mutex`)
When multiple API calls fail simultaneously with `401 Unauthorized` (e.g. initial app load or screen hydration):
- **First failing request**: Acquires the Mutex lock (`mutex.acquire()`), sends POST `/auth/refresh`, updates the Redux store, and retries the original request.
- **Subsequent requests**: Detect the locked Mutex and wait (`await mutex.waitForUnlock()`). Once released, they automatically retry using the newly stored access token.

### 4. Payload Normalization
Backend payload structures can vary across responses. Token refresh response processing extracts fields dynamically:
- Payload root: `(refreshResult.data as any).data || refreshResult.data`
- Access Token: `rawPayload.accessToken || rawPayload.token`
- User & Refresh Token fallbacks preserve existing store state if omitted in the payload.

### 5. Error Recovery & Toast Feedback
- **Success**: Displays a success toast notification (`showSuccessToast`) and updates Redux state via `setCredentials`.
- **Failure / Expiration**: Displays error toast ("Token refresh failed"), dispatches `logout()`, clears state, and safely releases the Mutex inside a `finally` block to guarantee lock cleanup.


