import React from 'react'
import { sampleOHLCV, tradeData } from "./tradeX/15min_btc";
import { CHART_OPTIONS } from "./tradeX/utils";
import useTheme from "../components/hooks/useTheme";
const TokenChart = React.lazy(() => import('./tradeX/Wrapper'));

export default function Chart({symbol}) {
    const { isLightTheme, theme, switchTheme } = useTheme();
    return (
    <div className={`full-size ${theme}`}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <TokenChart
          symbol={symbol}
          config={{
            toolbar: {
              timeframe: true,
              indicators: true,
              typeSelector: true,
              fullscreenButton: true,
            },
            generalTokenChart: true,
            defaults: {
              timeframe: "1h",
              chartType: "candlestick", // Assuming "candlestick" is the CHART_OPTIONS[0]
            },
          }}
          chartData={sampleOHLCV}
          tradeData={tradeData}
        />
      </React.Suspense>
    
    </div>
  );
}
