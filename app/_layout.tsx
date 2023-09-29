import React from 'react'

import { ThemeProvider } from 'styled-components/native'

import theme from 'styles/theme'

import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

// Use this file to wrap your global providers.
const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Stack screenOptions={{ headerTransparent: true }} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default RootLayout
