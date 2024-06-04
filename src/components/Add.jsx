import React, { useState } from "react";
import "./Add.css";
import Sidebar from "./Sidebar";
import Search from "./Search";
import { writeFunction } from "./writeFun";
// import { useWeb3React } from "@web3-react/core";
import { LaunchAbi, LaunchAddress } from "../config";
import { Contract, parseEther } from "ethers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { CircularProgress } from "@mui/material";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, } from 'ethers'

// export const getContract = (library, account,add,abi) => {
// 	const signer = library?.getSigner(account).connectUnchecked();
// 	var contract = new Contract(add,abi, signer);
// 	return contract;
// };

export const getContract = async (conAdd,conAbi,walletProvider)=>{
  const ethersProvider = new BrowserProvider(walletProvider)
  const signer = await ethersProvider.getSigner()
  // The Contract object
  const contract = new Contract(conAdd, conAbi, signer)
  return contract
}

export default function Add({selected,setSelected}) {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const navigate = useNavigate()
  const [name,setname] = useState("")
  const [ticker,setTicker] = useState("")
  const [launchAmount,setLaunchAmount] = useState("")
  const [website,setWebsite] = useState("")
  const [XX,setXX] = useState("")
  const [telegram,setTelegram] = useState("")
  const [description,setDescription] = useState("")
  const [nlLoading,setTNLoading] = useState(false)
  const [file,setFile] = useState("")
  const [fileName,setFileName] = useState("")
  const [toggle,setToggle] = useState(false)
  const [firstBuyer,setBuyer] = useState(0)

  // const {account,library,chainId} = useWeb3React()


  const captureFile = async (e) => {
    setTNLoading(true)
    try {
      var _file = e.target.files[0];

      setFileName(e.target.files[0].name);
      const formData = new FormData();
      formData.append("file", _file);
      const metadata = JSON.stringify({
        name: "file name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4YTg4YWE0Yy0xZWM0LTRiODMtYjk4Mi0xNTYxZWM5MjA0ZmYiLCJlbWFpbCI6IndhcWFzbml6YW1hbmkzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5ZmY1NWM1ZWNiMjU1ZDliN2U4YSIsInNjb3BlZEtleVNlY3JldCI6IjlhNjcwNjhjYTBjMmI2Yjk0Yzk0MWE4ODBkYWRiMmNhYjA5N2QyMDljYzIwZmU4MWExZTM2YzdkODMxZTZkZDMiLCJpYXQiOjE3MTYzMTc5Njd9.Hum8KDR_Lism_NFlyj-AE8mw1F4XjN_7MSFn7TlefK0`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setFile(
        resData.IpfsHash
      );
      setTNLoading(false)
      console.log(resData);
    } catch (error) {
      console.log(error);
      setTNLoading(false)
    }
  };

  const cancel = ()=>{
    setname("")
    setTicker("")
    setLaunchAmount("")
    setWebsite("")
    setXX("")
    setTelegram("")
    setDescription("")
    setFile("")

}

const validation = ()=>{
    if(!address){
      toast.error("Please connect wallet first")
      return false
    }else if(name==""){
      toast.error("Please fill the name field")
      return false
    }else if(ticker==""){
      toast.error("Please fill the ticker field")
      return false
    }else if(website==""){
      toast.error("Please fill the website field")
      return false
    }else if(XX==""){
      toast.error("Please fill the XX field")
      return false
    }else if(telegram==""){
      toast.error("Please fill the telegram field")
      return false
    }else if(description==""){
      toast.error("Please fill the description field")
      return false
    }else if(file==""){
      toast.error("Please fill the Token Image field")
      return false
    }else if(nlLoading==true){
      toast.error("Please wait while Token image is being uploaded")
      return false
    }else{
      return true;
    }
}

//console.log("data",file)
    return (
    <div 
    style={{backgroundImage:`url("./assets/backg.png")`}}
    cz-shortcut-listen="true" class="snipcss-D9VLI">
      <div class="relative h-full">
        {/* <div class="fixed -z-10 pointer-events-none inset-0 overflow-hidden">
          <div class="absolute top-0 left-0 right-0 -u-z-10">
            <img
              src="https://www.basejump.pro/blur-02.svg"
              alt="blur"
              class="w-full"
            />
          </div>
          <div class="fixed top-0 left-0 right-0 -u-z-10">
            <img
              src="https://www.basejump.pro/blur-01.svg"
              alt="blur"
              class="w-full"
            />
          </div>
        </div> */}

        <div class="lg:pl-72 snipcss0-0-0-1">
        <Search selected={selected} setSelected={setSelected}/>
          <main class="py-10 relative snipcss0-1-1-22">
            <div class="px-4 sm:px-6 lg:px-8 mx-auto snipcss0-2-22-23">
              <div class="mx-auto max-w-7xl snipcss0-3-23-24">
                <div class="space-y-12 snipcss0-4-24-25">
                  <div class="border-b border-white/10 pb-12 snipcss0-5-25-26">
                    <div class="flex gap-x-6 items-center snipcss0-6-26-27">
                      <div class="snipcss0-7-27-28">
                        <h2 class="text-base font-semibold leading-7 text-white snipcss0-8-28-29">
                          Create Token
                        </h2>
                        <p class="mt-1 text-sm leading-6 text-gray-400 snipcss0-8-28-30">
                          Your token will get listed immediately after
                          submission
                        </p>
                      </div>
                    </div>
                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 snipcss0-6-26-31">
                      <div class="sm:grid-span-6 snipcss0-7-31-32">
                        <label class="block text-sm font-medium leading-6 text-white snipcss0-8-32-33">
                          Token Name
                        </label>
                        <div class="mt-2 snipcss0-8-32-34">
                          <input
                            type="text"
                            class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-9-34-35"
                            placeholder="Ethereum"
                            value={name}
                            onChange={(e)=>{setname(e.target.value)}}
                          />
                        </div>
                      </div>
                      <div class="sm:grid-span-6 snipcss0-7-31-36">
                        <label class="block text-sm font-medium leading-6 text-white snipcss0-8-36-37">
                          Ticker
                        </label>
                        <div class="mt-2 snipcss0-8-36-38">
                          <input
                            type="text"
                            class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-9-38-39"
                            placeholder="ETH"
                            value={ticker}
                            onChange={(e)=>{setTicker(e.target.value)}}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div class="mt-8 snipcss0-6-26-40">
                      <label class="block text-sm font-medium leading-6 text-white snipcss0-7-40-41">
                        Launch amount (in ETH). This token will be tradeable in
                        Uniswap when this amount is reached
                      </label>
                      <div class="mt-2 snipcss0-7-40-42">
                        <input
                          type="text"
                          class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-8-42-43"
                          placeholder="5"
                          value={launchAmount}
                            onChange={(e)=>{setLaunchAmount(e.target.value)}}
                        />
                      </div>
                    </div> */}
                    <div class="mt-8 snipcss0-6-26-44">
                      <label class="block text-sm font-medium leading-6 text-white snipcss0-7-44-45">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="link"
                          class="svg-inline--fa fa-link snipcss0-8-45-46"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path
                            fill="currentColor"
                            d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
                          ></path>
                        </svg>{" "}
                        Website
                      </label>
                      <div class="mt-2 snipcss0-7-44-47">
                        <input
                          type="text"
                          class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-8-47-48"
                          placeholder="https://example.com"
                          value={website}
                            onChange={(e)=>{setWebsite(e.target.value)}}
                        />
                      </div>
                    </div>
                    <div class="mt-8 snipcss0-6-26-49">
                      <label class="block text-sm font-medium leading-6 text-white snipcss0-7-49-50">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="x-twitter"
                          class="svg-inline--fa fa-x-twitter snipcss0-8-50-51"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="currentColor"
                            d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                          ></path>
                        </svg>{" "}
                        X
                      </label>
                      <div class="mt-2 snipcss0-7-49-52">
                        <input
                          type="text"
                          class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-8-52-53"
                          placeholder="https://x.com/example"
                          value={XX}
                            onChange={(e)=>{setXX(e.target.value)}}
                        />
                      </div>
                    </div>
                    <div class="mt-8 snipcss0-6-26-54">
                      <label class="block text-sm font-medium leading-6 text-white snipcss0-7-54-55">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="telegram"
                          class="svg-inline--fa fa-telegram snipcss0-8-55-56"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 496 512"
                        >
                          <path
                            fill="currentColor"
                            d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"
                          ></path>
                        </svg>{" "}
                        Telegram
                      </label>
                      <div class="mt-2 snipcss0-7-54-57">
                        <input
                          type="text"
                          class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-8-57-58"
                          placeholder="https://t.me/example"
                          value={telegram}
                            onChange={(e)=>{setTelegram(e.target.value)}}
                        />
                      </div>
                    </div>
                    <div class="mt-8 snipcss0-6-26-59">
                      <label class="block text-sm font-medium leading-6 text-white snipcss0-7-59-60">
                        Description
                      </label>
                      <div class="mt-2 snipcss0-7-59-61">
                        <textarea
                          class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-8-61-62"
                          placeholder="Description"
                          value={description}
                            onChange={(e)=>{setDescription(e.target.value)}}
                        ></textarea>
                      </div>
                    </div>
                    <div class="mt-8 snipcss0-6-26-59">
                      <label class="block text-sm font-medium leading-6 text-white snipcss0-7-59-60">
                        First Buyer - Put 0 if you don't want to be the first buyer
                      </label>
                      <div class="mt-2 snipcss0-7-59-61">
                        <input
                          class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-8-61-62"
                          placeholder="Description"
                          value={firstBuyer}
                            onChange={(e)=>{setBuyer(e.target.value)}}
                        ></input>
                      </div>
                    </div>
                    <div class="mt-8 snipcss0-6-26-63">
                      <label class="block text-sm font-medium leading-6 text-white snipcss0-7-63-64">
                        Token Image
                      </label>
                      <div class="mt-2 snipcss0-7-63-65">
                        <div class="snipcss0-8-65-66">
                          <input 
                          onChange={captureFile}
                          type="file" class="mb-3 snipcss0-9-66-67" />
                        </div>
                      </div>
                    </div>
                    {/* <div class="mt-8 snipcss0-6-26-68">
                      <label class="block text-sm font-medium leading-6 text-white snipcss0-7-68-69">
                        Token total supply (min: 100k, max: 1T)
                      </label>
                      <div class="mt-2 snipcss0-7-68-70">
                        <input
                          type="text"
                          class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-8-70-71"
                          placeholder="1000000000"
                        />
                      </div>
                    </div>
                    <div class="mt-8 snipcss0-6-26-72">
                      <label class="block text-sm font-medium leading-6 text-white snipcss0-7-72-73">
                        First Buy on Deploy (in ETH)
                      </label>
                      <div class="mt-2 snipcss0-7-72-74">
                        <div class="mt-2 mb-2 text-sm font-bold snipcss0-8-74-75"></div>
                        <input
                          type="text"
                          class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-8-74-76"
                          placeholder="0.1"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
                <div class="mt-6 flex items-center justify-end gap-x-6 snipcss0-4-24-77">
                  <a
                    class="text-sm font-semibold leading-6 text-white text-[#FFB921] hover:underline font-bold snipcss0-5-77-78"
                    onClick={cancel}
                  >
                    Cancel
                  </a>
                  <button
                    
                    onClick={async ()=>{
                        const checking = validation()
                        if(checking){
                          const contractW = await getContract(LaunchAddress,LaunchAbi,walletProvider)
                          writeFunction(
                            "create Token",
                            contractW,
                            "createToken",
                            ()=>{setToggle(false); cancel();navigate("/");setSelected(0) },
                            ()=>{setToggle(false)},
                            setToggle,
                            name,
                            ticker,
                            [website,XX,telegram,description,file],
                            parseEther(firstBuyer),
                            {gasLimit:1300000}

                        )
                        }
                        
                    }}
                    class="rounded-md px-3 py-2 text-sm font-semibold shadow-sm cursor-pointer bg-blue-700 hover:bg-gray-400 focus-visible:outline-gray-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 snipcss0-5-77-79"
                  >
                    {toggle ?  <CircularProgress sx={{color:"white"}}></CircularProgress> : "Create Token"}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="Toastify"></div>
      <div id="loom-companion-mv3" ext-id="liecbddmkiiihnedobmlmillhodjkdmb">
        <section id="shadow-host-companion"></section>
      </div>

    </div>
  );
}
