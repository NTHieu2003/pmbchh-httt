module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src',
        },
      },
    ],
    // react-native-worklets (used by reanimated / keyboard-controller)
    // must always be the last plugin in the list.
    'react-native-worklets/plugin',
  ],
};
