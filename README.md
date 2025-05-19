# Social Feed App (React Native)

A responsive and interactive social media feed aggregator built with React Native, Expo Router, and NativeWind (Tailwind CSS). This app simulates a personalized social media feed aggregating posts from multiple influencers.

---

## Features

- Simulated user authentication (login, signup, logout) using mock APIs
- Aggregated posts from multiple influencers with text, image, and video content using mock APIs
- Infinite scrolling with smooth loading placeholders using FlashList from "@shopify/flash-list"" (instead of Flatlist) for high-performance feed rendering
- Mobile-app design using Tailwind CSS with NativeWind
- Animations with react-native-reanimated
- Dark/Light theme support
- Navigation with Expo Router
- Modular, reusable components
- State management and Error Management with Redux Toolkit
- Nice Error Message display to user with "Alert" from React Native
- API interactions with Axios
- Authentication state persistence with user stored using AsyncStorage ("@react-native-async-storage/async-storage")
- Picking videos or images from the device gallery or camera using "expo-image-picker"
- Previewing selected media using "expo-video" and "expo-image"
- Use of "react-native-safe-area-context" to keep your UI properly positioned and unobstructed on devices with notches, curved edges, or home indicators.

---

## Tech Stack

- React
- React Native
- Expo & Expo Router
- NativeWind (Tailwind CSS for React Native)
- Redux Toolkit for state management
- Axios for API calls
- JSON-server for mock REST API
- AsyncStorage for persistent login state

---

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- Expo CLI (`npm install -g expo-cli`)
- Yarn or npm
- JSON-server installed globally (`npm install -g json-server`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yommexg/energy-funding-service-social-feed-mobile-app.git
   cd social-feed-app
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the mock API server:

   Make sure your `db.json` is at the root or update the path accordingly.

   ```bash
   json-server --watch db.json --port 3001
   ```

   > **Important:** If testing on a physical device, replace `localhost` with your computer’s local IP address (e.g., `http://192.168.x.x:3001`).

4. Start the Expo development server:

   ```bash
   npm start
   ```

---

## Usage

- Use the app on iOS simulator, Android emulator, or physical device.
- Register a new user via the Register screen.
- Login with existing credentials. (Case Sensitive).
- Browse the aggregated social media feed with infinite scroll.
- Toggle between dark and light themes based on system device settings.

---

## Project Structure

```
/src
│
├── /app
│   ├── /(auth)               # Authentication flow
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx       # Auth layout (AuthenticationLayout.tsx)
│   │
│   ├── /(user)               # Authenticated area with bottom tabs
│   │   ├── _layout.tsx       # Tab layout (UserLayout.tsx)
│   │   ├── index.tsx         # Home tab
│   │   ├── explore.tsx       # Explore tab
│   │   ├── post.tsx          # Post tab  (Logic Not Implemented because of backend Limitation)
│   │   └── profile.tsx       # Profile tab (Some Logic Not Implemented because of backend Limitation)
│   │
│   └── _layout.tsx           # Root layout (wrap with ThemeProvider, Redux Provider, etc.)
│
├── /assets                   # Static assets (icons, images)
│   ├── images/
│   └── others/               # Upcoming Assets (Prevents Folder Collapse)
│
├── /components               # Reusable UI components
│   ├── Header.tsx
│   ├── IndiviudalPostItem.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   ├── Spinner.tsx
│   └── VideoPlayer.tsx
│
├── /constants               # Theme, colors, bLurhash for expo image etc.
│   └── Colors.ts
│   └── BlurHash.ts
│
├── /redux                   # Redux Toolkit setup
│   ├── slices/
│   │   ├── loginSlice.ts
│   │   ├── registerSlice.ts
│   │   └── feedSlice.ts
│   ├── store.ts
│   └── baseApi.ts
│
├── /hooks                          # Custom hooks
│   ├── useColorScheme.ts           # Returns "light" or "dark"
│   ├── useColorScheme.web.ts
│   ├── useDebounce.ts              # Improves performance and prevents filtering on every keystroke.
│   └── useThemeColor.ts
│
├── /utils                    # Utility functions/helpers
│   ├── types/                # Handles General Interfaces for typescript(Users, Posts)
│   │   ├── user.ts
│   │   ├── post.ts
|   └── others/               # Upcoming Utils (Prevents Folder Collapse)
│
├── /styles
    └── global.css            # Imports tailwind functionlaity to the app
```

---

## Redux Slices

- **loginSlice:** Manages authentication state with actions for login, logout, and stores user data.
  (The stored user is meant to be on a seperate slice but no way to validate token on a mock api.)
- **registerSlice:** Handles user registration including async API calls.
- **feedSlice:** Manages social post data fetching and loading state.

---

## Troubleshooting

- **API not reachable:** Ensure the JSON-server is running and IP address is correctly set for physical devices.
- **Tailwind classes not working:** Ensure NativeWind and Tailwind is installed and configured Properly
- **Redux errors:** Confirm Redux Toolkit and react-redux are installed and store is correctly provided.

---

**Enjoy building your social feed app!**
