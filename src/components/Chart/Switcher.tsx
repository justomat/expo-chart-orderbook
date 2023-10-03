import React from 'react'
import styled from 'styled-components/native'
import theme from 'styles/theme'

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 12px 0;
`

const Text = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.uiTextSecondary};
  padding: 6px 20px;
`

const Button = styled.TouchableOpacity`
  background: ${(props) => (props.isActive ? 'blue' : 'transparent')};
  border-radius: 8px;
`

export const Switcher = ({ value, onChange }) => (
  <Container>
    {['1DAY', '4HOURS', '1HOUR'].map((type) => {
      return (
        <Button
          key={type}
          isActive={value === type}
          disabled={value === type}
          onPress={() => onChange(type)}
        >
          <Text>{type.slice(0, 2)}</Text>
        </Button>
      )
    })}
  </Container>
)
