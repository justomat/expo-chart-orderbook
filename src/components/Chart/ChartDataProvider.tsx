import { useQuery } from '@tanstack/react-query'
import { API_HOST } from 'constants'
import { memo } from 'react'
import { CandlestickChart } from 'react-native-wagmi-charts'

type CandleRequestParams = {
  market: string
  resolution?: string
  limit?: string
  fromISO?: string
  toISO?: string
}

/** @see https://dydxprotocol.github.io/v3-teacher/?json#get-candles-for-market */
function fetchDydxCandleData(params: CandleRequestParams) {
  const url = `https://${API_HOST}/v3/candles/${params.market}`

  return fetch(url + '?' + new URLSearchParams(params)).then((res) =>
    res.ok ? res.json() : Promise.reject(new Error('Failed to fetch candles'))
  )
}

function transformCandleData(data) {
  return data?.candles?.map((candle) => ({
    ...candle,
    timestamp: new Date(candle.startedAt).getTime(),
    open: Number(candle.open),
    high: Number(candle.high),
    low: Number(candle.low),
    close: Number(candle.close)
  }))
}

function useDydxCandleData(params: CandleRequestParams) {
  return useQuery({
    queryKey: ['candles', params],
    queryFn: () => fetchDydxCandleData(params),
    keepPreviousData: true,
    select: transformCandleData
  })
}

export interface ChartDataProviderProps {
  children: React.ReactNode
  market: string
  params: CandleRequestParams
}

export default memo(function ChartDataProvider({
  children,
  params
}: ChartDataProviderProps) {
  const candles = useDydxCandleData(params)

  return (
    <CandlestickChart.Provider data={candles.data}>
      {children}
    </CandlestickChart.Provider>
  )
})
