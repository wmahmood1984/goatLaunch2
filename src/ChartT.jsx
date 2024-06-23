import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Datafeed from './datafeed.js';

function ChartT() {
  const [count, setCount] = useState(0)

  useEffect(()=>{
    if(window){
      window.tvWidget = new TradingView.widget({
        symbol: 'Bitfinex:BTC/USD',            // Default symbol pair
        interval: '1D',                        // Default interval
        fullscreen: true,                      // Displays the chart in the fullscreen mode
        container: 'tv_chart_container',       // Reference to the attribute of the DOM element
        datafeed: Datafeed,
        library_path: '../charting_library/',
    });
    }

  },[window])


  return (
    <div  

    id="tv_chart_container"/>
      
    
  )
}

export default ChartT
