# Migrate this repo to React Native CLI

This project currently contains plain React Native + TypeScript source under `src/`. The following steps will create a new React Native CLI project and copy the `src` folder into it.

> The script below is for Windows (PowerShell). If you prefer macOS/Linux, run analogous commands.

## Prerequisites
- Node.js (16+ recommended)
- Yarn or npm
- React Native CLI: `npm install -g react-native-cli` (optional; `npx` works without global install)
- Android Studio / Xcode (for running on device/emulator)

## Quick commands (manual)

1. Create RN-CLI template app (TypeScript):

```powershell
npx react-native init reFindNative --template react-native-template-typescript
cd reFindNative
```

2. Install dependencies used by this repo (example list):

```powershell
# from project root (reFindNative)
yarn add @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens react-native-vector-icons react-native-linear-gradient react-native-sqlite-storage react-native-receive-sharing-intent react-native-reanimated react-native-gesture-handler

# If you use CocoaPods (iOS):
cd ios
pod install
cd ..
```

3. Copy current `src` into the new project (from this repo folder):

```powershell
# from parent folder containing both repos
robocopy .\reFind\src .\reFindNative\src /E
robocopy .\reFind\assets .\reFindNative\assets /E
```

4. Add any custom files from this repo (e.g., `App.tsx`) or merge manually. Update `App.tsx` in new project to match this repo's `App.tsx` (ensure imports resolve).

5. Run Metro and app:

```powershell
# Android
npx react-native run-android
# iOS (macOS)
npx react-native run-ios
```

## Automated PowerShell script
I included `scripts/migrate_to_rn_cli.ps1` that automates steps 1–3. Review before running.

## Notes & adjustments
- Avoid `expo` packages; use `react-native-linear-gradient` instead of `expo-linear-gradient`.
- `react-native-sqlite-storage` requires native setup; follow its README for linking/pods.
- `react-native-reanimated` and `react-native-gesture-handler` require some native config (see their install docs).
- After migration test on device/emulator and fix any native linking issues.

If you want, I can run the automatic script here (if you permit) or walk you through running it locally. If you want me to run commands on your machine now, say "Run migration" and I'll execute the script (you may be prompted for environment input).