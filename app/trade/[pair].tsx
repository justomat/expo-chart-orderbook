import { HeaderBackButton } from '@react-navigation/elements'
import { useQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { AnimatedText, CandlestickChart } from 'react-native-wagmi-charts'
import styled, { css } from 'styled-components/native'
import theme from 'styles/theme'

const API_HOST = `api.stage.dydx.exchange`

const HStack = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

const Wrapper = styled.SafeAreaView`
  ${({ theme }) => css`
    flex: 1;
    background-color: ${theme.colors.mainBg};
    align-items: center;
  `}
`

const Text = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.uiTextPrimary};
    font-size: 16px;
    font-weight: 300;
  `}
`

const Stats = ({ color }) => (
  <HStack>
    {['open', 'high', 'low', 'close'].map((type) => (
      <View
        key={type}
        style={{
          flex: 1,
          paddingVertical: 12,
          alignItems: 'center',
          minHeight: 24
        }}
      >
        <Text style={{ color, fontSize: 12 }}>{type}</Text>
        <CandlestickChart.PriceText type={type} style={{ color }} />
      </View>
    ))}
  </HStack>
)

const Tooltip = styled.View`
  top: -50%;
  left: 8px;
  width: 75px;
  border-radius: 3px;
  background-color: #111;
`

const DateTime = ({ color }) => (
  <CandlestickChart.DatetimeText
    style={{ color, fontSize: 12 }}
    format={({ value }) => {
      'worklet'
      return new Date(value).toLocaleString('id', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }}
  />
)

const Chart = (props) => {
  const { currentX, currentY } = CandlestickChart.useChart()
  const price = CandlestickChart.usePrice()

  const showOnChartHover = useAnimatedStyle(
    () => ({
      opacity: currentX.value < 0 || currentY.value < 0 ? 0 : 0.8
    }),
    [currentX, currentY]
  )

  const tooltip = (
    <View>
      <Tooltip>
        <AnimatedText
          text={price.formatted}
          style={{ padding: 2, color: props.color + 'CC' }}
        />
      </Tooltip>
    </View>
  )

  return (
    <View>
      <Animated.View style={[{ top: 0 }, showOnChartHover]}>
        <Stats color={props.color} />
      </Animated.View>

      <CandlestickChart {...props} style={{ marginTop: -36 }}>
        <CandlestickChart.Candles />
        <CandlestickChart.Crosshair color={props.color}>
          {tooltip}
        </CandlestickChart.Crosshair>
      </CandlestickChart>

      <Animated.View style={[{ left: 8, bottom: 8 }, showOnChartHover]}>
        <DateTime color={props.color} />
      </Animated.View>
    </View>
  )
}

function Switcher({ value, onChange }) {
  return (
    <HStack>
      {['1DAY', '4HOURS', '1HOUR'].map((type) => (
        <View
          key={type}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            minHeight: 24
          }}
        >
          <View
            style={{
              backgroundColor: value === type ? 'blue' : 'transparent',
              borderRadius: 4
            }}
          >
            <TouchableOpacity onPress={() => onChange(type)}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.colors.uiTextSecondary,
                  paddingVertical: 6,
                  paddingHorizontal: 24
                }}
              >
                {type.slice(0, 2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </HStack>
  )
}

function OrderBook({ data }) {
  return (
    <View style={{ padding: 16, alignItems: 'center', backgroundColor: 'red' }}>
      <Text style={{}}>Order Book</Text>
    </View>
  )
}

function transformCandlesData(data) {
  return data?.candles?.map((candle) => ({
    ...candle,
    timestamp: new Date(candle.startedAt).getTime(),
    open: Number(candle.open),
    high: Number(candle.high),
    low: Number(candle.low),
    close: Number(candle.close)
  }))
}

type Resolution =
  | '1DAY'
  | '4HOURS'
  | '1HOUR'
  | '30MINS'
  | '15MINS'
  | '5MINS'
  | '1MIN'

export default function TradeScreen() {
  const { pair } = useLocalSearchParams()
  const router = useRouter()

  const [resolution, setResolution] = useState<Resolution>('4HOURS')
  const [limit] = useState(50)

  const candles = useQuery({
    queryKey: ['candles', pair, { resolution, limit }],
    queryFn: async () => {
      /**
       * @see https://dydxprotocol.github.io/v3-teacher/?json#get-candles-for-market
       */
      const url =
        `https://${API_HOST}/v3/candles/${pair}?` +
        new URLSearchParams({ resolution, limit: limit.toString() })

      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch candles')
      return res.json()
    },
    keepPreviousData: true,
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

      <ScrollView style={{ width: '100%' }} contentContainerStyle={{}}>
        <CandlestickChart.Provider data={candles.data}>
          <Chart
            color={theme.colors.uiTextSecondary}
            height={Dimensions.get('window').height / 2}
            width={Dimensions.get('window').width}
          />
          <Switcher value={resolution} onChange={setResolution} />
        </CandlestickChart.Provider>
        {[] && <OrderBook data={[]} />}
      </ScrollView>
    </Wrapper>
  )
}
