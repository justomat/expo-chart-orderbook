import { useAnimatedStyle } from 'react-native-reanimated'
import { CandlestickChart } from 'react-native-wagmi-charts'

export function useShowOnHover() {
  const { currentX, currentY } = CandlestickChart.useChart()
  return useAnimatedStyle(
    () => ({
      opacity: currentX.value < 0 || currentY.value < 0 ? 0 : 0.8
    }),
    [currentX, currentY]
  )
}
