import { ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext) => ({
  ...config,
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED
  }
})
