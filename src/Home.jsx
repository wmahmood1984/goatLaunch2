import React, { useState } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers'


export default function Home() {
    const [balance,setbalance] = useState(0)
    const USDTAddress = '0x3993A3cC8E4d914F2a39320b6833BE0781466e68'
    
    // The ERC-20 Contract ABI, which is a common contract interface
    // for tokens (this is the Human-Readable ABI format)
    const USDTAbi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function balanceOf(address) view returns (uint)',
      'function transfer(address to, uint amount)',
      'event Transfer(address indexed from, address indexed to, uint amount)'
    ]
    
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    
    async function getBalance() {
      console.log("first",address)
      if (!isConnected) throw Error('User disconnected')
    
      const ethersProvider = new BrowserProvider(walletProvider)
      const signer = await ethersProvider.getSigner()
      // The Contract object
      const USDTContract = new Contract(USDTAddress, USDTAbi, signer)
      const USDTBalance = await USDTContract.balanceOf(address)
    
      setbalance(formatUnits(USDTBalance, 18))
    }
    
    async function _transfer() {
      console.log("first",address)
      if (!isConnected) throw Error('User disconnected')
    
      const ethersProvider = new BrowserProvider(walletProvider)
      const signer = await ethersProvider.getSigner()
      // The Contract object
      const USDTContract = new Contract(USDTAddress, USDTAbi, signer)
      try {
        const tx1 = await USDTContract.transfer("0x3993A3cC8E4d914F2a39320b6833BE0781466e68",parseUnits("1",18),{gasLimit:300000})
        await tx1.wait()
        if(tx1){
          console.log("first",tx1)
        }
      } catch (error) {
        console.log("error",error)
      }
    
    
    
    }
    
    
    

    return (
    <div>
    <w3m-button/>
    <button onClick={getBalance}>Get User Balance</button>
    <button onClick={_transfer}>Send</button>
    <p>{balance}</p>
    </div>
  )
}
