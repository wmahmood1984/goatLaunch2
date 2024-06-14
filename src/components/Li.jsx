import React, { useEffect, useState } from 'react'

export default function Li({web3,num}) {
    const [tx,setTx] = useState("")

    useEffect(()=>{
        
        const abc = async ()=>{
            const _tx = await web3.eth.getTransactionFromBlock(num)
            setTx(_tx)
        }

        abc()

 

    },[])

    // console.log("transaction",tx)
    return (
    <li
    style={{
      width: "30%",
      boxSizing: "border-box",
    }}
  >


  </li>
  )
}
