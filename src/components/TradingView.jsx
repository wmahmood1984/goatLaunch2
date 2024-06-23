import TradingViewWidget, { Themes } from 'react-tradingview-widget';

export const TradingViewChart = () => {
    console.log("Theme",Themes)
  return  (

  <TradingViewWidget
    symbol="NASDAQ:AAPL"
    theme={Themes.DARK}
    locale="fr"
    autosize
    
  />
)};