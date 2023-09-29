import { useQuery } from '@tanstack/react-query'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native'
import styled, { css } from 'styled-components/native'

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
    ).toFixed(2)}%`}</Text>
  )
}

const Pair = styled.View`
  padding: 12px 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

function transformMarketsData(data) {
  return Object.values(data?.markets).sort((a, b) => b.volume24H - a.volume24H)
}

export default function App() {
  const markets = useQuery({
    queryKey: ['markets'],
    queryFn: async () =>
      fetch(`https://api.stage.dydx.exchange/v3/markets`).then((res) =>
        res.json()
      ),
    select: transformMarketsData
  })

  const renderPair = ({ item }) => (
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
            <PriceText style={{ fontSize: 12 }}>
              {item.priceChange24H}
            </PriceText>
          </View>
        </Pair>
      </Pressable>
    </Link>
  )

  return (
    <Wrapper>
      <Stack.Screen
        options={{
          title: 'Markets',
          headerTitle: () => <Title>Trading Pairs</Title>
        }}
      />
      <StatusBar style="light" />

      <FlatList
        style={{ width: '100%' }}
        data={markets.data || []}
        renderItem={renderPair}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: 'white'
            }}
          />
        )}
      />
    </Wrapper>
  )
}
