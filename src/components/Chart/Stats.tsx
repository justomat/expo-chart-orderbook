import Animated from 'react-native-reanimated'
import { CandlestickChart } from 'react-native-wagmi-charts/'
import styled, { css } from 'styled-components/native'
import { useShowOnHover } from './useShowOnHover'

const Text = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.uiTextPrimary};
    font-size: 16px;
    font-weight: 300;
  `}
`
const StatContainer = styled.View`
  flex: 1;
  padding: 0 12px;
  min-height: 24px;
  align-items: center;
`

export const Stats = ({ color }) => {
  const showOnHover = useShowOnHover()
  return (
    <Animated.View
      style={[
        { top: 0, flexDirection: 'row', justifyContent: 'space-around' },
        showOnHover
      ]}
    >
      {['open', 'high', 'low', 'close'].map((type) => (
        <StatContainer key={type}>
          <Text style={{ color, fontSize: 12 }}>{type}</Text>
          <CandlestickChart.PriceText type={type} style={{ color }} />
        </StatContainer>
      ))}
    </Animated.View>
  )
}
