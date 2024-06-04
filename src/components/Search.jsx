// import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
// import { injected } from "../connectors/connectors";
import "./Home.css"

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, } from 'ethers'

import { useMediaQuery } from "react-responsive";
import Mobilemenu from "./Mobilemenu";


export default function Search({selected,setSelected}) {
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const [showMobile,setShowMobile] = useState(false)
//  console.log("acount",account) 
    return (
      <div>
<div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200/10 bg-gray-900/10 px-4 lg:px-0 shadow-sm sm:gap-x-6 sm:pr-6 lg:pr-8">
      {!showMobile && <button 
      onClick={()=>{setShowMobile(true)}}
      type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden">
        <span class="sr-only">Open sidebar</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
          data-slot="icon"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          ></path>
        </svg>
      </button>}
      
      <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"></div>
      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 backdrop-blur-md">
        <label for="search-field" class="sr-only">
          Search
        </label>
       {!isMobile &&  <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
          class="pointer-events-none absolute inset-y-0 left-4 h-full w-5 text-gray-400"
        >
          <path
            fill-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clip-rule="evenodd"
          ></path>
        </svg>}
        <input
          id="search-field"
          class="block h-full w-full border-0 py-0 pl-12 pr-0 text-gray-200 bg-black/25 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          placeholder="Search Token... (hit enter)"
          type="text"
        />
        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <div
            data-tooltip-id="points-tooltip"
            class="flex items-center gap-x-2 text-yellow-400 font-bold"
          >
            <div>⭐</div>
            <div>0</div>
          </div>
          <div
            class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          ></div>
          <div
            class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          ></div>
          <div>
            <button class="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] text-green-400">
              <span class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#FFB921_50%,#E2CBFF_100%)]"></span>
              <span class="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 text-sm font-medium text-white backdrop-blur-3xl  hover:bg-black/50">
              {/* <a
              onMouseEnter={()=>{setHovered(true)}}
              onMouseLeave={()=>{setHovered(false)}}
              onClick={()=>{activate(injected)}}   
              style={{opacity:hovered? "0.5" : "1", background:"black",zIndex:9,height:"95%",width:"95%",borderRadius: "9999px", padding:"10px 16px 0px 12px"}}
              className="p-4 ">{account? `${account.slice(0,4)}...${account.slice(-5)}`: "Connect"}</a> */}
              <w3m-button balance="hide"/>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

{showMobile &&     <Mobilemenu selected={selected} setSelected={setSelected} setShowMobile={setShowMobile} />}
      </div>
    
  );
}
