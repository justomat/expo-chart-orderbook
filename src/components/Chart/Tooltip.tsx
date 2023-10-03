import { memo } from 'react'
import { View } from 'react-native'
import { AnimatedText, CandlestickChart } from 'react-native-wagmi-charts'
import styled from 'styled-components/native'

const TooltipContainer = styled.View`
  top: -50%;
  left: 8px;
  width: 75px;
  border-radius: 3px;
  background-color: #111;
`

export const Tooltip = memo(function Tooltip({ color }: { color: string }) {
  const price = CandlestickChart.usePrice()
  return (
    <View>
      <TooltipContainer>
        <AnimatedText
          text={price.formatted}
          style={{ padding: 2, color: color + 'CC' }}
        />
      </TooltipContainer>
    </View>
  )
})
