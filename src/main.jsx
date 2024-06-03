import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'



import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import { defaultRpc, defualtChain } from './config.js'

// 1. Get projectId
const projectId = 'b27a2874021a4091a9123942dd0b075f'

// 2. Set chains
const mainnet = {
  chainId: Number(defualtChain),
  name: '',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
//  rpcUrl: 'https://cloudflare-eth.com'
rpcUrl : defaultRpc
}

// 3. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://goatlaunch2.netlify.app/', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 1 // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeVariables: {
    '--w3m-color-mix': '#00BB7F',
    '--w3m-color-mix-strength': 40,
    '--w3m-accent': "black"
  }
})





ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
    <App />
    </Router>

  </React.StrictMode>,
)
