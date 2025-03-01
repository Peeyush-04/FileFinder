# FileFinder

**FileFinder** is a cross-platform file indexing and management app built using React Native and Expo. It enables users to quickly index, search, and manage files efficiently across Android, iOS, and web platforms.

## Features

- **File Indexing** – Automatically scan and organize files on your device.
- **Fast Search** – Quickly find files using a responsive search function.
- **Cross-Platform** – Works on Android, iOS, and web.
- **Custom Themes** – Supports theme customization using React Context API.

## Getting Started

### Integrating C++ with React Native
FileFinder supports integration of C++ modules for performance-intensive operations. The `cpp/` directory houses all native C++ files, including source code and React Native bridge bindings.

#### Folder Structure for C++
```
cpp/
├── bridge/         # React Native bridge for C++ modules
├── fileindexer/    # File indexing logic in C++
├── CMakeLists.txt  # CMake build configuration
```

#### Steps to Add C++ Integration:
1. **Set Up Native Modules:**
   - Create a `cpp` folder in the project root.
   - Organize the code into `bridge/` and `fileindexer/`.
2. **Bridge C++ with React Native:**
   - Use `react-native-mmkv` or `react-native-vision-camera` as examples of C++-powered modules.
   - Modify the `android/app/build.gradle` and `ios/Podfile` to include necessary dependencies.
3. **Linking Native Modules:**
   ```sh
   npx react-native run-android
   ```
   or for iOS:
   ```sh
   cd ios && pod install && cd ..
   ```
4. **Call C++ Methods from JavaScript:**
   - Use `NativeModules.YourModule.methodName()` in React Native components.

### Prerequisites

- Install [Node.js](https://nodejs.org/) (v16.x LTS or later)
- Install [Expo CLI](https://docs.expo.dev/get-started/installation/)
  ```sh
  npm install -g expo-cli
  ```
- Install Git (if not already installed)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Peeyush-04/FileFinder.git
   cd FileFinder
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the app:
   - **Android:** `expo start --android`
   - **iOS:** `expo start --ios`
   - **Web:** `expo start --web`

## Project Structure

```
FileFinder/
├── assets/               # Static assets (images, icons, fonts)
├── cpp/                  # Native C++ modules
│   ├── bridge/           # React Native bridge for C++ modules
│   ├── fileindexer/      # File indexing logic in C++
│   ├── CMakeLists.txt    # CMake build configuration
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

