// Dynamic Expo config: extends app.json and injects Firebase config from env vars,
// so secrets/service files never need to be committed.
module.exports = ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    bundleIdentifier: process.env.IOS_BUNDLE_ID || 'com.kiddoflux.ios',
    googleServicesFile:
      process.env.GOOGLE_SERVICES_PLIST || './GoogleService-Info.plist',
  },
  android: {
    ...config.android,
    package: 'com.kiddoflux.android',
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON || './google-services.json',
  },
  plugins: [
    ...(config.plugins ?? []),
    '@react-native-firebase/app',
    // Firebase's iOS SDK 13+ ships through Swift Package Manager only and needs
    // dynamic frameworks. See https://rnfirebase.io/ios-spm
    ['expo-build-properties', { ios: { useFrameworks: 'dynamic' } }],
  ],
});
