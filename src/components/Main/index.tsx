import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@tanstack/react-query'
import { Link, Stack } from 'expo-router'
import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native'
import styled, { css } from 'styled-components/native'
import orderBy from 'lodash/orderBy'

const Wrapper = styled.SafeAreaView`
  ${({ theme }) => css`
    flex: 1;
    background-color: ${theme.colors.mainBg};
  `}
`

const Title = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.uiTextPrimary};
    font-weight: 700;
  `}
`

const Text = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.uiTextPrimary};
    font-size: 16px;
    font-weight: 300;
  `}
`

const PriceText = (props) => {
  const up = props.children > 0
  const color = up ? 'palegreen' : 'crimson'
  // const arrow = up ? '▲' : '▼'
  const arrow = up ? '↑' : '↓'
  return (
    <Text {...props} style={{ ...props.style, color }}>{`${arrow} ${Number(
      props.children
    ).toFixed(2)}`}</Text>
  )
}

const Pair = styled.View`
  padding: 12px 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Separator = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: white;
`

const transformMarketsData = (data) => {
  const values = Object.values(data?.markets)
  return orderBy(values, (market) => Number(market['volume24H']), 'desc')
}

const Market = ({ item }) => (
  <Link
    href={{
      pathname: '/trade/[pair]',
      params: { pair: item.market }
    }}
    asChild
  >
    <Pressable>
      <Pair>
        <Text
          style={{
            fontFamily: Platform.select({
              ios: 'Courier New',
              android: 'monospace',
              default: ''
            }),
            fontSize: 24,
            fontWeight: 500
          }}
        >
          {item.market}
        </Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 16, letterSpacing: 0.7 }}>
            ${Number(item.indexPrice)}
          </Text>
          <PriceText style={{ fontSize: 12 }}>{item.priceChange24H}</PriceText>
        </View>
      </Pair>
    </Pressable>
  </Link>
)

const fetchMarkets = async () => {
  const res = await fetch(`https://api.stage.dydx.exchange/v3/markets`)
  return res.json()
}

function useMarkets() {
  return useQuery({
    queryKey: ['markets'],
    queryFn: fetchMarkets,
    select: transformMarketsData
  })
}

export default function App() {
  const markets = useMarkets()

  return (
    <Wrapper>
      <Stack.Screen
        options={{
          title: 'Markets',
          headerTitle: () => <Title>Trading Pairs</Title>
        }}
      />

      <FlashList
        data={markets.data || []}
        renderItem={Market}
        ItemSeparatorComponent={() => <Separator />}
        estimatedItemSize={58}
      />
    </Wrapper>
  )
}
