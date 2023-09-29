import { useLocalSearchParams } from 'expo-router'
import styled, { css } from 'styled-components/native'
import { View } from 'react-native'
import { useRouter, Link, Stack } from 'expo-router'
import { HeaderBackButton } from '@react-navigation/elements'
import theme from 'styles/theme'
import { CandlestickChart } from 'react-native-wagmi-charts'

const Wrapper = styled.SafeAreaView`
  ${({ theme }) => css`
    flex: 1;
    background-color: ${theme.colors.mainBg};
    align-items: center;
  `}
`

const Title = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.uiTextPrimary};
    text-align: center;
    font-size: 52px;
    font-weight: 700;

    margin-bottom: 24px;
  `}
`

const Text = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.uiTextPrimary};
    font-size: 16px;
    margin-bottom: 8px;
    font-weight: 300;
  `}
`

const data = [
  {
    timestamp: 1625945400000,
    open: 33575.25,
    high: 33600.52,
    low: 33475.12,
    close: 33520.11
  },
  {
    timestamp: 1625946300000,
    open: 33545.25,
    high: 33560.52,
    low: 33510.12,
    close: 33520.11
  },
  {
    timestamp: 1625947200000,
    open: 33510.25,
    high: 33515.52,
    low: 33250.12,
    close: 33250.11
  },
  {
    timestamp: 1625948100000,
    open: 33215.25,
    high: 33430.52,
    low: 33215.12,
    close: 33420.11
  }
]

function Chart() {
  return (
    <CandlestickChart.Provider data={data}>
      <CandlestickChart>
        <CandlestickChart.Candles />
        <CandlestickChart.Crosshair color="white">
          <CandlestickChart.Tooltip textStyle={{ color: 'white' }} />
        </CandlestickChart.Crosshair>
      </CandlestickChart>
    </CandlestickChart.Provider>
  )
}

export default function TradeScreen() {
  const { pair } = useLocalSearchParams()
  const router = useRouter()

  return (
    <Wrapper>
      <Stack.Screen
        options={{
          headerTitle: (pair || '') as string,
          headerTintColor: theme.colors.uiTextPrimary,
          headerLeft: () => {
            return (
              <HeaderBackButton
                tintColor={theme.colors.uiTextPrimary}
                onPress={router.back}
              />
            )
          }
        }}
      />

      <Chart />
    </Wrapper>
  )
}
