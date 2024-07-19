import { ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext) => ({
  ...config,
  expo: {
    plugins: [
      [
        'expo-build-properties',
        {
          ios: { flipper: true }
        }
      ],
      'expo-router'
    ],
    scheme: 'boilerplate',
    ios: {
      bundleIdentifier: 'com.ultimateexpoboilerplate.ios'
    },
    android: {
      package: 'com.ultimateexpoboilerplate.android'
    },
    extra: {
      storybookEnabled: process.env.STORYBOOK_ENABLED,
      eas: {
        projectId: '64a70953-9da5-488a-a247-720726f1a5e0'
      }
    }
  }
})
