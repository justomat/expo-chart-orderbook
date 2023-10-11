import { ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext) => ({
  ...config,
  expo: {
    plugins: [
      [
        'expo-build-properties',
        {
          ios: {
            flipper: true
          }
        }
      ]
    ],
    ios: {
      bundleIdentifier: 'com.ultimate-expo-boilerplate.ios'
    },
    extra: {
      storybookEnabled: process.env.STORYBOOK_ENABLED,
      eas: {
        projectId: '64a70953-9da5-488a-a247-720726f1a5e0'
      }
    }
  }
})
