module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      'expo-router/babel',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx'
          ]
        }
      ],
      'react-native-reanimated/plugin'
    ]
  }
}
