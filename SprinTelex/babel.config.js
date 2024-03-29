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
      'react-native-reanimated/plugin',
    ],
  };
};