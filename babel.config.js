module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      [
        'module-resolver',
        {
          alias: {
            'react-native': 'react-native-web',
          },
        },
      ],
      // react-native-reanimated/plugin must be the last plugin
      'react-native-reanimated/plugin',
    ],
  };
};