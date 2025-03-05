# FileFinder

**FileFinder** is a cross-platform file indexing and management app built using React Native and Expo. It enables users to quickly index, search, and manage files efficiently across Android, iOS, and web platforms.

## Current Features

- **File Indexing** – Automatically scan and organize files on your device.
- **Fast Search** – Quickly find files using a responsive search function.
- **Cross-Platform** – Works on Android, iOS, and web.
- **Custom Themes** – Supports theme customization using React Context API.

## Planned Improvements

- **Enhanced Performance with C++ Integration** – Integrate high-performance C++ modules for file indexing and searching using React Native’s TurboModules and the New Architecture, leveraging JavaScript Interface (JSI) for optimal speed and efficiency in the `FileFinderApp`.

## Prerequisites

- Install [Node.js](https://nodejs.org/) (v16.x LTS or later)
- Install [Expo CLI](https://docs.expo.dev/get-started/installation/)
  ```sh
  npm install -g expo-cli
  ```
- Install Git (if not already installed)
- Install Java 17 LTS (required for Android builds, e.g., OpenJDK 17 from AdoptOpenJDK or Azul)
- Install Android Studio with NDK (for C++ compilation)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Peeyush-04/FileFinder.git
   cd FileFinder
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install Expo Dev Client for native module support:
   ```sh
   npx expo install expo-dev-client
   ```
4. Start the app:
   - **Android:** `npx expo run:android` (requires custom development client)
   - **iOS:** `npx expo run:ios` (requires custom development client)
   - **Web:** `expo start --web` (no native modules required)

## Project Structure

```
FileFinder/
├── assets/               # Static assets (images, icons, fonts)
├── cpp/                  # Native C++ modules for file indexing
│   ├── bridge/           # TurboModule bridge for C++ (e.g., FileSearchModule.cpp)
│   ├── fileindexer/      # File indexing logic in C++ (e.g., FileIndexer.cpp)
│   ├── CMakeLists.txt    # CMake build configuration for C++
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   ├── contexts/         # Context providers (e.g., ThemeContext)
│   ├── screens/          # App screens/pages
│   ├── utils/            # Utility functions
├── android/              # Android-specific configurations and native code
├── ios/                  # iOS-specific configurations and native code
├── app.json              # Expo configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── metro.config.js       # Metro bundler configuration
└── README.md             # Project documentation
```

## Releases & Changelog

Releases follow [semantic versioning](https://semver.org/). Check the [CHANGELOG.md](CHANGELOG.md) for updates and new features.

To create a new release:

1. Update the version in `package.json` and `app.json`.
2. Commit the changes.
3. Tag and push the release:
   ```sh
   git tag -a vX.Y.Z -m "Release notes for version X.Y.Z"
   git push origin vX.Y.Z
   ```
