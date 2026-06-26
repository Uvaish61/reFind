const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: {
      ...(defaultConfig.resolver.extraNodeModules || {}),
      'react-native-paper': path.resolve(__dirname, 'node_modules/react-native-paper/lib/commonjs'),
    },
  },
};
