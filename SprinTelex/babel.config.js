module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          "@env": "./src/config/env.js"
        }
      }],
      'module:react-native-dotenv',
      'react-native-reanimated/plugin', // This plugin is necessary for Reanimated v2 which requires special setup for Hermes
    ],
  };
};