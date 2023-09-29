import { StatusBar } from 'expo-status-bar'
import { FlatList, TouchableHighlight } from 'react-native'
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

const Pair = styled.View`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
`
export default function App() {
  const pairs = [
    { name: 'BTC/USD', price: 50000 },
    { name: 'ETH/USD', price: 3000 },
    { name: 'LINK/USD', price: 500 }
  ]

  const renderPair = ({ item }) => (
    <TouchableHighlight
      style={{ width: '100%' }}
      onPress={() => console.log(`Pressed ${item.name}`)}
    >
      <Pair>
        <Text>{item.name}</Text>
        <Text>{item.price}</Text>
      </Pair>
    </TouchableHighlight>
  )

  return (
    <Wrapper>
      <StatusBar style="light" />
      <Title>Trading Pairs</Title>

      <FlatList
        style={{ width: '100%' }}
        contentContainerStyle={{}}
        data={pairs}
        renderItem={renderPair}
      />
    </Wrapper>
  )
}
