import React from 'react'
import Constants from 'expo-constants'

import Main from 'components/Main'

import Storybook from '../.storybook'

const index = () => {
  return <Main />
}

let AppEntryPoint = index

if (Constants.expoConfig?.extra?.storybookEnabled === 'true') {
  AppEntryPoint = Storybook
}

export default AppEntryPoint
