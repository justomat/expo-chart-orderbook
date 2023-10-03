import { CandlestickChart } from 'react-native-wagmi-charts';

export const DateTime = ({ color }) => (
  <CandlestickChart.DatetimeText
    style={{ color, fontSize: 12 }}
    format={({ value }) => {
      'worklet';
      return new Date(value).toLocaleString('id', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    }} />
);
