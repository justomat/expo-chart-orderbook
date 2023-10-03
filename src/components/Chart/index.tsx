import { Switcher } from 'components/Chart/Switcher'
import { ComponentPropsWithoutRef } from 'react'
import { CandlestickChart } from 'react-native-wagmi-charts'

export { ChartDataProviderProps } from './ChartDataProvider'

type CandlestickChartProps = ComponentPropsWithoutRef<typeof CandlestickChart>

export interface ChartProps extends Omit<CandlestickChartProps, 'children'> {
  color: string
}

const Chart = ({ color, style, ...props }: ChartProps) => (
  <CandlestickChart {...props} style={style}>
    <CandlestickChart.Candles />
    <CandlestickChart.Crosshair color={color}>
      <Tooltip color={color} />
    </CandlestickChart.Crosshair>
  </CandlestickChart>
)

import { default as Provider } from './ChartDataProvider'
import { DateTime } from './DateTime'
import { Stats } from './Stats'
import { Tooltip } from './Tooltip'

Chart.Provider = Provider
Chart.Stats = Stats
Chart.Switcher = Switcher
Chart.DateTime = DateTime

export default Chart
