import { useLocalSearchParams } from 'expo-router'
import styled, { css } from 'styled-components/native'
import { ScrollView, View } from 'react-native'
import { useRouter, Link, Stack } from 'expo-router'
import { HeaderBackButton } from '@react-navigation/elements'
import theme from 'styles/theme'
import { CandlestickChart } from 'react-native-wagmi-charts'
import { useQuery } from '@tanstack/react-query'

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

function Chart({ data }) {
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

function transformCandlesData(data) {
  return data?.candles?.map((candle) => ({
    ...candle,
    timestamp: new Date(candle.startedAt).getTime()
  }))
}

export default function TradeScreen() {
  const { pair } = useLocalSearchParams()
  const router = useRouter()

  const candles = useQuery({
    queryKey: ['candles', pair],
    queryFn: () =>
      fetch(
        `https://api.stage.dydx.exchange/v3/candles/${pair}?resolution=1HOUR&limit=30`
      ).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(JSON.stringify(data, null, 2))
    },
    select: transformCandlesData
  })

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

      <ScrollView>{candles.data && <Chart data={candles.data} />}</ScrollView>
    </Wrapper>
  )
}
