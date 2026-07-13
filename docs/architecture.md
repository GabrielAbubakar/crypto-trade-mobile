# Application Architecture

This document outlines the architectural patterns, technology stack, directory structure, and state management flows used in the **Crypto Trade Mobile** application.

---

## 1. High-Level Overview

**Crypto Trade Mobile** is a cross-platform mobile application built using **React Native** and the **Expo SDK**. It provides users with a comprehensive suite of crypto-trading features, including:
- Real-time and historical market charts (Wagmi Charts).
- Multi-currency portfolio tracking and wallet transactions.
- Asset watchlist management.
- Price alerting systems.
- Multi-step Know Your Customer (KYC) verification flow.
- Push notification settings.

The application follows a modular, feature-oriented structure with a separation of concerns between state management (Redux Toolkit), side effects (RTK Query), and presentation layers (Expo Router & UI Components).

---

## 2. Technology Stack

*   **Framework:** Expo SDK (v54.x) / React Native (v0.81.x)
*   **Language:** TypeScript (v5.9.x) for static typing and type safety
*   **Routing & Navigation:** Expo Router (v6.x) utilizing file-based routing and native stacks
*   **State Management:** Redux Toolkit (v2.x) & React Redux (v9.x)
*   **Data Fetching & Caching:** RTK Query for declarative, cached API integrations
*   **Local Storage:** AsyncStorage (via Redux Persist) for persistent user authentication
*   **Form Management:** TanStack React Form & Zod for schema-based type-safe validation
*   **Gestures & UI Interactions:** React Native Gesture Handler, Reanimated, and Gorhom Bottom Sheet
*   **Charts & Visualization:** React Native Wagmi Charts (SVG-based sparklines and candle charts)
*   **Alerting & Notifications:** React Native Toast Message & Expo Notifications

---

## 3. Directory Layout

The codebase follows a Domain-Driven (Feature-Based) architecture. Logic is co-located by feature rather than by technical concern.

```text
crypto-trade-mobile/
├── app/                  # Thin Routing directory (Expo Router entry points)
│   ├── (auth)/           # Authentication routes
│   ├── (onboarding)/     # App onboarding routes
│   ├── (tabs)/           # Main application shell routes
│   ├── kyc/              # KYC verification routes
│   ├── _layout.tsx       # Root layout defining Redux and context providers
│   └── bootstrap.tsx     # Session checker routing to (tabs) or (auth)
├── assets/               # Local images, fonts, and static files
├── core/                 # Global, cross-feature configuration and logic
│   ├── api/              # Base RTK Query API setup (baseApi.ts)
│   ├── store/            # Redux store configuration and global hooks
│   ├── hooks/            # Global custom React hooks
│   ├── utils/            # Shared helper functions
│   ├── config/           # App-wide configs
│   ├── constants/        # Style constants, theme colors
│   └── types/            # Global TypeScript models
├── features/             # Independent feature modules containing api, components, schemas, etc.
│   ├── auth/             # Authentication domain
│   ├── kyc/              # KYC verification domain
│   ├── wallet/           # Wallet balances, deposits, and withdrawals
│   ├── trading/          # Market charts, trades, and order execution
│   ├── profile/          # User details, settings, and security
│   ├── home/             # Portfolio summary and dashboards
│   ├── activity/         # Transaction and activity history
│   └── onboarding/       # Walkthrough components
└── components/           
    └── ui/               # Reusable, "dumb" UI controls (BaseButton, BaseInput, etc.)
```

---

## 4. Key Architectural Patterns

### A. Navigation & Routing (Expo Router)
Navigation uses Expo's file-based router. Route groups like `(auth)`, `(onboarding)`, and `(tabs)` separate logical sections of the app without adding extra segments to URLs or linking schemes.
- **Bootstrapping (`app/bootstrap.tsx`):** Acts as the gatekeeper route. It listens to the global authentication state from Redux. If the user is logged in, it redirects them instantly to `/(tabs)/home`; otherwise, it redirects to the authentication entry `/(auth)`.
- **Root Layout (`app/_layout.tsx`):** Preloads resources (e.g., the *Neue Montreal* typography), handles native splash screen behavior, and nests essential providers (Redux Provider, PersistGate, Gesture Handler, and Bottom Sheet Modal).

### B. State Management Architecture
The global state is split into two primary paradigms:
1.  **Client-Side Redux Slices (`features/*/slices/`):**
    -   `authSlice`: Stores the current user profile, `accessToken`, `refreshToken`, and login status. This is persistence-enabled using `redux-persist` with `AsyncStorage` to keep users logged in across application relaunches.
    -   `kycSlice`: Houses draft KYC registration data across multiple screens so that the user's progress is preserved until they upload documents and selfies.
2.  **Server-Side RTK Query Services (`features/*/api/`):**
    -   Handles all HTTP queries and mutations.
    -   Utilizes tag-based caching (`providesTags`, `invalidatesTags`) to automatically update cached resource listings (such as refreshing the Wallet balance after executing a buy/sell trade).

### C. Automatic Re-Authentication (RTK Query Mutex Flow)
All API endpoints inherit from a unified `baseApi` defined in `core/api/baseApi.ts`. To handle token expiration gracefully, a custom query wrapper (`baseQueryWithReAuth`) acts as an interceptor:

1.  **Token Attachment:** Before dispatching an outgoing request, the query retrieves the `accessToken` from the Redux `auth` slice and attaches it to the request as a `Bearer` token inside the `Authorization` header.
2.  **401 Interception:** If a query receives an HTTP `401 Unauthorized` status code, the application halts the request queue.
3.  **Mutex Lock:** An `async-mutex` is acquired.
    -   If the Mutex is already locked, it means another concurrent request is currently refreshing the token. The current request waits until the Mutex unlocks, then automatically retries with the new token.
    -   If the Mutex is free, it locks, extracts the `refreshToken` from the Redux state, and makes a POST request to `/auth/refresh`.
4.  **Token Refresh Result:**
    -   **Success:** The new `accessToken` and `refreshToken` are saved to the store (via `setCredentials`), the Mutex is released, and all pending requests are retried.
    -   **Failure (or expired refresh token):** The client dispatches a `logout` action, clearing user credentials and automatically redirecting the user back to the sign-in page.

> [!NOTE]
> The full sequential flow diagram of this re-authentication process is documented in [reauth-flow.md](file:///c:/Users/JT/Documents/Rise/crypto-trade-mobile/reauth-flow.md).

### D. Form Management & Validation
Forms are controlled using `@tanstack/react-form` coupled with `@tanstack/zod-form-adapter`. 
- Input fields are validated dynamically using **Zod schemas** defined within each feature's `schemas/` directory (e.g., `features/auth/schemas/`).
- This configuration ensures type safety from the UI input fields to the network request payloads.
