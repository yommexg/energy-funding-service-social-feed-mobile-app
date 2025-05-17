# Social Feed App (React Native)

A responsive and interactive social media feed aggregator built with React Native, Expo Router, and NativeWind (Tailwind CSS). This app simulates a personalized social media feed aggregating posts from multiple influencers.

---

## Features

- Simulated user authentication (login, signup, logout) using mock APIs
- Aggregated posts from multiple influencers with text, image, and video content
- Infinite scrolling with smooth loading placeholders
- Mobile-first design using Tailwind CSS with NativeWind
- Dark/Light theme support
- Navigation with Expo Router
- Modular, reusable components
- State management with Redux Toolkit
- API interactions with Axios
- Authentication state persistence using AsyncStorage

---

## Tech Stack

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
   json-server --watch ../db.json --port 3001
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
- Login with existing credentials.
- Browse the aggregated social media feed with infinite scroll.
- Toggle between dark and light themes based on system settings.

---

## Project Structure

```
/src
  /components    # Reusable UI components (ThemedText, ThemedView, Spinner, etc.)
  /hooks         # Custom hooks (e.g., useColorScheme)
  /redux         # Redux slices, store, and async thunks
  /screens       # Screen components (Login, Register, Feed, etc.)
  /constants     # Colors, theme definitions, etc.
  /assets        # Images and other static assets
```

---

## Redux Slices

- **authSlice:** Manages authentication state with actions for login, logout, and loading.
- **registerSlice:** Handles user registration including async API calls.
- **feedSlice:** Manages social feed data fetching and loading state.

---

## Troubleshooting

- **API not reachable:** Ensure the JSON-server is running and IP address is correctly set for physical devices.
- **Tailwind classes not working:** Ensure NativeWind v2.0.0 is installed and configured.
- **Redux errors:** Confirm Redux Toolkit and react-redux are installed and store is correctly provided.

---

**Enjoy building your social feed app!**
