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

The codebase follows a Domain-Driven (Feature-Based) architecture rooted inside the `src/` directory. Logic is co-located by feature rather than by technical concern.

```text
crypto-trade-mobile/
├── assets/                   # Local images, fonts, and static files
├── docs/                     # Architecture and design documentation
└── src/                      # Application source code root
    ├── app/                  # Thin routing layer (Expo Router entry points)
    │   ├── (auth)/           # Authentication routes
    │   ├── (onboarding)/     # App onboarding routes
    │   ├── (tabs)/           # Main application shell routes
    │   ├── kyc/              # KYC verification routes
    │   ├── _layout.tsx       # Root layout (Redux providers, fonts, splash screen)
    │   └── bootstrap.tsx     # Session checker — routes to (tabs) or (auth)
    │
    ├── core/                 # Infrastructure-only configuration (no business logic)
    │   ├── api/              # Base RTK Query API setup (baseApi.ts, re-auth middleware)
    │   └── config/           # App-wide config (secure storage engine, env vars)
    │
    ├── features/             # Independent feature modules (the heart of the app)
    │   ├── auth/             # Authentication domain
    │   │   ├── api/          # RTK Query endpoints (login, register, 2FA, OTP, KYC upload)
    │   │   ├── components/   # Auth-specific UI (SignInForm, SignUpForm, etc.)
    │   │   ├── schemas/      # Zod validation schemas for auth forms
    │   │   ├── screens/      # Screen components (AuthIndexScreen, OtpScreen, etc.)
    │   │   ├── slices/       # authSlice (credentials, token, user)
    │   │   └── index.ts      # ★ Public API — single entry point for all auth exports
    │   │
    │   ├── kyc/              # KYC verification domain
    │   │   ├── components/   # KYC-specific UI (KycApproved, KycRejected, etc.)
    │   │   ├── screens/      # Screen components (KycHomeScreen, KycDocumentScreen, etc.)
    │   │   ├── slices/       # kycSlice (draft KYC data across multi-step flow)
    │   │   └── index.ts      # ★ Public API
    │   │
    │   ├── wallet/           # Wallet balances, deposits, and withdrawals
    │   │   ├── api/          # RTK Query endpoints (wallets, transactions, deposits)
    │   │   ├── components/   # Wallet-specific UI (WalletAssetRow, WalletTransactionRow)
    │   │   ├── screens/      # Screen components (WalletsScreen, DepositScreen, etc.)
    │   │   └── index.ts      # ★ Public API
    │   │
    │   ├── trading/          # Market charts, trades, and order execution
    │   │   ├── api/          # RTK Query endpoints (marketApi, tradeApi)
    │   │   ├── components/   # Trading-specific UI (MarketCoinRow, TradeActionSheet, etc.)
    │   │   ├── screens/      # Screen components (MarketsScreen, TradingScreen, etc.)
    │   │   └── index.ts      # ★ Public API
    │   │
    │   ├── profile/          # User details, settings, and security
    │   │   ├── api/          # RTK Query endpoints (profileApi — profile, watchlist, alerts)
    │   │   ├── schemas/      # Zod validation schemas for profile forms
    │   │   ├── screens/      # Screen components (ProfileScreen, SecuritySettingsScreen, etc.)
    │   │   └── index.ts      # ★ Public API
    │   │
    │   ├── home/             # Portfolio summary and dashboards
    │   │   ├── components/   # Home-specific UI (CoinCard, GridMenu, ActionMenu)
    │   │   ├── screens/      # Screen components (HomeScreen, QrScanScreen, etc.)
    │   │   └── index.ts      # ★ Public API
    │   │
    │   ├── activity/         # Notifications and activity history
    │   │   ├── components/   # Activity-specific UI (NotificationItem, ActivityItemRow)
    │   │   ├── screens/      # Screen components (NotificationsScreen)
    │   │   └── index.ts      # ★ Public API
    │   │
    │   └── onboarding/       # App walkthrough
    │       ├── screens/      # Screen components (WelcomeScreen)
    │       └── index.ts      # ★ Public API
    │
    ├── shared/               # Cross-feature shared code (no feature-specific logic)
    │   ├── constants/        # App-wide constants (Colors, theme tokens, tab names)
    │   ├── hooks/            # Global custom React hooks (usePushNotifications, etc.)
    │   ├── types/            # Global TypeScript interfaces and models (API response types)
    │   ├── ui/               # Reusable "dumb" UI controls (BaseButton, BaseInput, ScreenContainer, etc.)
    │   └── utils/            # Shared helper functions (formatCompact, toast helpers, etc.)
    │
    └── store/                # Redux store configuration
        ├── store.ts          # combineReducers, persistReducer, configureStore
        ├── hooks.ts          # Typed useAppDispatch / useAppSelector hooks
        └── tempSlice.ts      # Ephemeral in-session state (e.g., recovery codes handoff)
```

---

## 4. Feature Public API Pattern

Each feature exposes a single `index.ts` barrel file at its root that acts as its **Public API** — the only entry point external code should use to access the feature's screens, hooks, actions, or components.

```typescript
// ✅ Correct — import from the feature's Public API
import { useLoginMutation, AuthIndexScreen } from '@/features/auth';
import { WalletsScreen, useGetWalletsQuery } from '@/features/wallet';

// ❌ Incorrect — deep imports break encapsulation
import { useLoginMutation } from '@/features/auth/api/authApi';
import { WalletsScreen } from '@/features/wallet/screens/WalletsScreen';
```

**Why this matters:**
- **Encapsulation:** Internal folder structure (api/, screens/, slices/) is private to the feature. External consumers have no dependency on where files live internally.
- **Refactoring safety:** Moving, splitting, or renaming internal files does not break consumers — only the barrel file needs updating.
- **Discoverability:** Developers can inspect `features/<name>/index.ts` to understand everything a feature exposes.

---

## 5. Routing Architecture

Route files in `src/app/` are **thin wrappers** only. They import a feature-owned screen component and render it, optionally passing route parameters:

```typescript
// src/app/(tabs)/wallets/deposit.tsx
import { DepositScreen } from "@/features/wallet";

export default function DepositRoute() {
  return <DepositScreen />;
}
```

This ensures:
- **All screen logic** lives inside its feature (`src/features/<name>/screens/`).
- **Routes are semantically named** (e.g., `DepositRoute`, `OtpRoute`) for clearer stack traces and React DevTools inspection.
- **`src/app/`** remains a pure routing concern with no business logic.

Key route files:
- **`src/app/bootstrap.tsx`:** Gatekeeper route. Reads Redux auth state — redirects authenticated users to `/(tabs)/home` and unauthenticated users to `/(auth)`.
- **`src/app/_layout.tsx`:** Root layout. Preloads fonts, renders Redux `Provider`, `PersistGate`, Gesture Handler, and Bottom Sheet providers.

---

## 6. State Management Architecture

The global state is split into two primary paradigms:

1. **Client-Side Redux Slices (`features/*/slices/` and `store/`):**
   - `authSlice`: Stores the current user profile, `accessToken`, `refreshToken`, and login status. Persisted via `redux-persist` with a dual-storage engine (tokens in SecureStore, non-sensitive data in AsyncStorage).
   - `kycSlice`: Houses draft KYC registration data across multiple screens so the user's progress is preserved until they upload documents and selfies.
   - `tempSlice`: Holds ephemeral in-session data (e.g., newly generated recovery codes passed between screens).

2. **Server-Side RTK Query Services (`features/*/api/`):**
   - Handles all HTTP queries and mutations.
   - Utilizes tag-based caching (`providesTags`, `invalidatesTags`) to automatically refresh affected resource listings (e.g., refreshing the wallet balance after executing a trade).

---

## 7. Automatic Re-Authentication (RTK Query Mutex Flow)

All API endpoints inherit from a unified `baseApi` defined in `src/core/api/baseApi.ts`. To handle token expiration gracefully, a custom query wrapper (`baseQueryWithReAuth`) acts as an interceptor:

1. **Token Attachment:** Before dispatching an outgoing request, the query retrieves the `accessToken` from the Redux `auth` slice and attaches it as a `Bearer` token in the `Authorization` header.
2. **401 Interception:** If a query receives an HTTP `401 Unauthorized` status, the application halts the request queue.
3. **Mutex Lock:** An `async-mutex` is acquired.
   - If the Mutex is already locked, another concurrent request is refreshing the token. The current request waits until it unlocks, then retries with the new token.
   - If the Mutex is free, it locks, extracts the `refreshToken` from Redux state, and makes a POST to `/auth/refresh`.
4. **Token Refresh Result:**
   - **Success:** The new tokens are saved via `setCredentials`, the Mutex releases, and all pending requests retry.
   - **Failure:** The client dispatches `logout`, clearing credentials and redirecting the user to sign-in.

> [!NOTE]
> The full sequential flow diagram of this re-authentication process is documented in [reauth-flow.md](./reauth-flow.md).

---

## 8. Form Management & Validation

Forms are controlled using `@tanstack/react-form` coupled with `@tanstack/zod-form-adapter`.
- Input fields are validated dynamically using **Zod schemas** defined within each feature's `schemas/` directory (e.g., `features/auth/schemas/`).
- This configuration ensures type safety from the UI input fields to the network request payloads.
