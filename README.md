# 📈 Crypto Trade Mobile

Welcome to **Crypto Trade Mobile**, a modern, high-performance cryptocurrency trading and portfolio management application built with **React Native**, **Expo SDK 54**, and **Redux Toolkit**.

---

## 🚀 Key Features

*   **Real-time Portfolio Tracking:** Monitor balance history, wallet allocations, and transactional activities.
*   **Live Market Data:** Interactive charts and detailed order books leveraging `react-native-wagmi-charts`.
*   **State-of-the-Art State Management:** Integrated cache invalidation and automatic token refresh mechanism using Redux Toolkit Query (RTK Query) with Mutex locks.
*   **Secure Authentication:** Flow for sign-in, signup, session persistence via `redux-persist`, and secure PIN codes.
*   **KYC Verification:** Seamless multi-step identity verification including selfie and document uploads.
*   **Price Alerting:** Create, edit, and delete threshold notifications.

---

## 🛠️ Prerequisites

Before you start, ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
*   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
*   [Expo CLI](https://docs.expo.dev/more/expo-cli/) (`npm install -g expo-cli`)
*   **For iOS emulation (macOS only):** Xcode installed with simulator command-line tools.
*   **For Android emulation:** Android Studio with an Android Virtual Device (AVD) configured.
*   **For physical device testing:** Download the [Expo Go](https://expo.dev/go) app on your mobile device.

---

## ⚙️ Getting Started & Installation

Follow these steps to set up the project locally:

### 1. Install Dependencies
Navigate to the root directory of the project and install all required packages:
```bash
npm install
```

### 2. Configure Environment Variables
The application relies on environment variables for API configuration. A template file has been provided in the root directory:
*   Open the [env.example](file:///c:/Users/JT/Documents/Rise/crypto-trade-mobile/env.example) file.
*   Create a `.env` file in the root directory and copy the contents of `env.example` to it:

**On macOS/Linux:**
```bash
cp env.example .env
```

**On Windows (PowerShell):**
```powershell
Copy-Item env.example .env
```

*   By default, the `.env` points to the hosted API server:
    ```env
    EXPO_PUBLIC_API_URL=https://crypto-api-guwm.onrender.com
    ```
    If you are running the API backend locally, update this variable to point to your local backend server (e.g., `http://10.0.2.2:5000` for Android emulator or `http://localhost:5000` for iOS simulator/web).

---

## 🏃 Run the Application

You can start the development server using the following commands:

### Start Metro Bundler
Start the Metro development server:
```bash
npm run start
```
*Once Metro starts, you can scan the QR code displayed in the terminal using your camera app (iOS) or the Expo Go app (Android).*

### Run on Emulator / Simulator
To launch directly on a virtual device, run:
*   **Android Emulator:** `npm run android`
*   **iOS Simulator:** `npm run ios`
*   **Web Browser:** `npm run web`

---

## 📐 Architecture & Core Concepts

This application utilizes clean, modular design patterns to keep components decoupled from the underlying API and store configuration:
*   **State Management & Re-Authentication:** The network layer utilizes RTK Query with a custom re-authentication base query (`baseQueryWithReAuth`). If a request fails with `401 Unauthorized`, a mutex locks subsequent requests while a token refresh is performed seamlessly. See [reauth-flow.md](file:///c:/Users/JT/Documents/Rise/crypto-trade-mobile/reauth-flow.md) for a detailed control flow.
*   **Detailed Architecture Guide:** For a deep dive into the routing structure (Expo Router), folder layouts, state slices, and UI paradigms, refer to the [architecture.md](file:///c:/Users/JT/Documents/Rise/crypto-trade-mobile/docs/architecture.md) file in the `docs` folder.

---

## 📦 EAS Build & Deployment

Building and submitting the application is configured through Expo Application Services (EAS). The configuration parameters are detailed in `eas.json`.
*   **Install EAS CLI:** `npm install -g eas-cli`
*   **Log in to Expo:** `eas login`
*   **Build Development Client (Android):** `eas build --profile development --platform android`
*   **Build Production Bundle:** `eas build --profile production`
