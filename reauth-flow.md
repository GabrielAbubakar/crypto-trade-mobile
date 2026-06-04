# Authentication Control Flow Diagram

This document contains the control flow diagram for the Redux Toolkit Query (`rtk-query`) custom automatic re-authentication logic (`baseQueryWithReAuth`), including the Mutex logic to handle race conditions during token refresh.

## Flowchart Overview

```text
       [ Outgoing API Request ]
                  │
                  ▼
       Attach Access Token? (prepareHeaders)
         ├── No  ──► Send without Authorization header
         └── Yes ─► Add "Authorization: Bearer <token>"
                  │
                  ▼
        [ Wait for Mutex Unlock ]  <── Ensures requests wait if refresh is in progress
                  │
                  ▼
          [ Execute Request ]
                  │
                  ▼
         Is HTTP Status 401?
         ├── No  ──► Return API data/error to component (Done)
         └── Yes ─► [ Intercept 401 Error ]
                  │
                  ▼
          Is Mutex Locked by another request?
          ├── Yes ─► [ Wait for Mutex to Unlock ]
          │            │
          │            ▼
          │          [ Retry Original Request ]
          │            │
          │            ▼
          │          Return final retry result to component
          │
          └── No  ─► [ Lock Mutex ]
                       │
                       ▼
             Does Refresh Token Exist?
             ├── No  ──► Dispatch logout() ──► [ Release Mutex ] ──► Return 401 error
             └── Yes ─► [ Execute Token Refresh Request ]
                              │
                              ▼
                 Was Refresh Token Request Successful?
                   ├── No  ──► Dispatch logout() ──► [ Release Mutex ] ──► Return 401 error
                   └── Yes ─► [ Process New Tokens ]
                                    │
                                    ▼
                               Save New Credentials
                               (Dispatch setCredentials)
                                    │
                                    ▼
                             [ Retry Original Request ]
                                    │
                                    ▼
                               [ Release Mutex ]
                                    │
                                    ▼
                               Return final retry result
                               (Success or Error) to component
```

