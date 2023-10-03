import { HeaderBackButton } from '@react-navigation/elements'
import { SortedMap, Stream } from '@rimbu/core'
import Chart from 'components/Chart'
import { API_HOST } from 'constants'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  FlatList,
  InteractionManager,
  ListRenderItem,
  Platform,
  StyleProp,
  View,
  ViewStyle
} from 'react-native'
import { runOnJS, runOnUI } from 'react-native-reanimated'
import styled, { css } from 'styled-components/native'
import theme from 'styles/theme'
import { Order } from 'types/Orderbook'

const Mono = styled.Text`
  color: white;
  font-family: ${Platform.select({
    ios: 'Courier New',
    android: 'monospace'
  })};
  font-weight: 500;
`

interface OrderProps {
  price: Order['price']
  size: Order['size']
  offset?: Order['offset']
  style?: StyleProp<ViewStyle>
}

const OrderView = memo(
  function Order({ price, size, style }: OrderProps) {
    return (
      <View style={[style, { justifyContent: 'space-between' }]}>
        <Mono>${Number(price)}</Mono>
        <Mono>{Number(size)}</Mono>
      </View>
    )
  },
  // Only re-render if there's no previous offset or next offset is greater than previous offset
  (prev, next) => !(!prev.offset || Number(next.offset) > Number(prev.offset))
)

type OrderMap = SortedMap<number, Order>

const sizeIsEmpty = ({ size }) => size === '0'

function merge(
  current: OrderMap,
  updates: [Order['price'], Order['size']],
  offset: Order['offset']
) {
  return current.addEntries(
    updates.map(([price, size]) => [price, { price, size, offset }])
  )
}

const delay = (fn) => {
  return setTimeout(() => {
    InteractionManager.runAfterInteractions(() => {
      startTransition(fn)
    })
  }, 1000)
}

const toEntry = (x) => [Number(x.price), x]

function useOrderbook(market: string) {
  const [bids, setBids] = useState<OrderMap>(SortedMap.empty())
  const [asks, setAsks] = useState<OrderMap>(SortedMap.empty())

  const handleMessage = useCallback(async (event) => {
    const { type, contents = {} } = JSON.parse(event.data)

    switch (type) {
      case 'subscribed': {
        const bidStream = Stream.fromArray(contents.bids).filterNot(sizeIsEmpty)
        const askStream = Stream.fromArray(contents.asks).filterNot(sizeIsEmpty)

        // dont let user see empty orderbook, show 5 initial rows
        const [initialBids, tailBids] = bidStream.splitWhere((_, i) => i === 5)
        const [initialAsks, tailAsks] = askStream.splitWhere((_, i) => i === 5)

        // high priority state update
        setBids(SortedMap.from(initialBids.map(toEntry)))
        setAsks(SortedMap.from(initialAsks.map(toEntry)))

        // low priority state update
        delay(() => {
          setBids((prev) => prev.addEntries(tailBids.map(toEntry)))
          setAsks((prev) => prev.addEntries(tailAsks.map(toEntry)))
        })

        return
      }
      case 'channel_data': {
        if (!contents.offset) return

        const { bids, asks } = contents

        startTransition(() => {
          // cheat a little by offloading work to the UI thread, which
          // should be pretty idle since we're not running any heavy animation
          if (bids.length) {
            runOnUI((set) => {
              set((prev) => merge(prev, bids, contents.offset))
            })(setBids)
          }
          if (asks.length) {
            runOnUI((set) => {
              set((prev) => merge(prev, asks, contents.offset))
            })(setAsks)
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    const ws = new WebSocket(`wss://${API_HOST}/v3/ws`)
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'subscribe',
          channel: 'v3_orderbook',
          id: market,
          includeOffsets: true
        })
      )
    }
    ws.onmessage = handleMessage
    return () => ws.close()
  }, [market, handleMessage])

  return useMemo(() => ({ bids, asks }), [bids, asks])
}

const Wrapper = styled.SafeAreaView`
  ${({ theme }) => css`
    flex: 1;
    background-color: ${theme.colors.mainBg};
    align-items: center;
  `}
`

type Resolution =
  | '1DAY'
  | '4HOURS'
  | '1HOUR'
  | '30MINS'
  | '15MINS'
  | '5MINS'
  | '1MIN'

const OrderViewWrapper = memo(function OrderViewWrapper({
  data,
  reverse
}: {
  data: Order | undefined
  reverse?: boolean
}) {
  if (!data) return null
  return (
    <OrderView
      key={`${data.price}`}
      style={{ flexDirection: reverse ? 'row' : 'row-reverse' }}
      price={data.price}
      size={data.size}
    />
  )
})

const OrderbookRow: ListRenderItem<Array<Order | undefined>> = ({
  item: [bid, ask]
}) => (
  <View style={{ flexDirection: 'row', gap: 8 }}>
    <View style={{ flex: 1 }}>
      <OrderViewWrapper data={bid} reverse />
    </View>
    <View style={{ flex: 1 }}>
      <OrderViewWrapper data={ask} />
    </View>
  </View>
)

export default function TradeScreen() {
  const { pair } = useLocalSearchParams()
  const router = useRouter()

  const [resolution, setResolution] = useState<Resolution>('4HOURS')
  const changeResolution = useCallback(
    (r: Resolution) => startTransition(() => setResolution(r)),
    []
  )

  const [limit] = useState(50)

  const { bids, asks } = useOrderbook(pair)
  const rows = useMemo(
    () =>
      Stream.zip(
        bids.streamValues(true).filterNot(sizeIsEmpty),
        asks.streamValues().filterNot(sizeIsEmpty)
      ).toArray(),
    [bids, asks]
  )

  const color = theme.colors.uiTextSecondary

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
                onPress={() => router.back()}
              />
            )
          }
        }}
      />

      <Chart.Provider params={{ market: pair, limit, resolution }}>
        <FlatList
          ListHeaderComponent={
            <>
              <Chart.Stats color={color} />
              <Chart color={color} style={{ marginTop: -36 }} />
              <Chart.DateTime color={color} />
              <Chart.Switcher value={resolution} onChange={changeResolution} />
            </>
          }
          data={rows}
          keyExtractor={([bid, ask]) => `${bid?.price}|${ask?.price}`}
          renderItem={OrderbookRow}
        />
      </Chart.Provider>
    </Wrapper>
  )
}
