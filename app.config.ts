import { ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext) => ({
  ...config,
  owner: 'gsu',
  slug: 'expo-chart-orderbook',
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
    eas: {
      projectId: 'a90aa7f3-2978-43af-b8aa-50791ee20111'
    }
  }
})
