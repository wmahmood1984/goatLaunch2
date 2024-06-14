import React, { useEffect, useState } from "react";
import { useWeb3ModalProvider, useWeb3ModalAccount, useDisconnect } from '@web3modal/ethers/react'
import { LaunchAbi, LaunchAddress, defaultRpc, defualtChain, ethScan } from "../config";
import { getContract } from "./Add";
import Web3 from "web3";
import { writeFunction, wte } from "./writeFun";
import Card from "./Card";
import { useNavigate } from "react-router";

export default function Profile() {
  const navigate = useNavigate()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { disconnect } = useDisconnect()
  const { walletProvider } = useWeb3ModalProvider()
  const [file,setFile] = useState("")
  const [fileName,setFileName] = useState("")
  const [name,setName] = useState("")
  const [nlLoading,setTNLoading] = useState(false)
  const [toggle,setToggle] = useState(false)
  const [index,setIndex] = useState(false)
  const [tokenCreated,setTokenCreated] = useState(false)
  const [latestBuys,setLatestBuys] = useState(false)
  const [ethThreshold, setEthThreshold] = useState(0);
  const [data,setData] = useState()

  const wchain = chainId ? chainId : defualtChain;
  const web3 = new Web3(new Web3.providers.HttpProvider(defaultRpc));
  const contractR = new web3.eth.Contract(LaunchAbi, LaunchAddress);
  const [users, setUsers] = useState();
  const [filteredUser, setFilteredUser] = useState();

  useEffect(() => {
    const abc = async () => {
      const _users = await contractR.methods.getUsers().call();
      setUsers(_users);

      const _ethThreshold = await contractR.methods.ethThreshold().call();
      setEthThreshold(wte(_ethThreshold));

      const _data = await contractR.methods.getTokens().call()
      setData(_data)

     
      if(address){
        const _filtered = _users.filter(e=>e.add==address)
        setFilteredUser(_filtered[0])
        setName(_filtered[0].name)
        setFile(_filtered[0].image)
        

        for(var i = 0; i < _users.length; i++){
          if(_users[i].add==address){
            setIndex(i)
          }
        }

        const _tokensCreated = await contractR.methods.getCreatedTokens(address).call()
        setTokenCreated(_tokensCreated)

        const _latestBuys = await contractR.methods.getLatestBuys(address).call()
        setLatestBuys(_latestBuys)


      }
 





    };

    abc();
  }, [address]);

  console.log("filtered", filteredUser);



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
  return (
    <main 
    style={{marginLeft:"400px"}}
    class="p  y-10 px-4 sm:px-6 lg:px-8 mx-auto relative snipcss-9tRc4">
      <div class="">
        <div class="flex items-start flex-wrap">
          <div class="flex-auto">
            <div class="basis-full xl:flex-1 p-4 my-4 mx-auto">
              <h1 class="text-2xl mb-5">Profile</h1>
              <div class="flex flex-wrap xl:flex-col-reverse gap-x-6">
                
                <div class="flex-1 xl:basis-full">
                  <a
                    class=" block mb-5  text-[#FFB921] hover:underline font-bold  "
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${ethScan}${address}`}
                  >
                    View in explorer
                  </a>
                  {/* <div class="border-2 border-red-500 p-5 mb-5 rounded-md max-w-[49rem]">
                    <div class="px-3 py-1.5 mb-3 text-red-500 font-bold">
                      You did not set a referral code. Set one to enjoy lower
                      trading fees (10% discount, forever). Please note that
                      once set, it cannot be changed
                    </div>
                    <input
                      class="mb-3 px-3 py-1.5 border rounded-md w-full"
                      type="text"
                    />
                    <button class="mr-5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer">
                      Set referral code
                    </button>
                  </div> */}
                  <label class="block font-bold mb-2">Username:</label>
                  <input
                    class="mb-6 px-3 py-1.5 border rounded-md w-full max-w-[49rem] block"
                    type="text"
                    value={name}
                    onChange={(e)=>{setName(e.target.value)}}
                  />
                  <input 
                  onChange={captureFile}
                  class="mb-3" type="file" />
                  <div class="basis-auto xl:basis-full">
                  <label class="block font-bold mb-2">Profile pic:</label>
                  <img
                    src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${file}`}
                    class="w-64 h-64 object-contain mt-5 mb-5 rounded-md cursor-default"
                    alt="Token Image"
                  />
                </div>
                  <div class="my-5">
                    <button 
                                        onClick={async ()=>{
                                          const id = index ? index : users.length
                                          // const checking = validation()
                                          if(true){
                                            const contractW = await getContract(LaunchAddress,LaunchAbi,walletProvider)
                                            writeFunction(
                                              "Update Profile",
                                              contractW,
                                              "UpdateUser",
                                              ()=>{setToggle(false); },
                                              ()=>{setToggle(false)},
                                              setToggle,
                                              id,name,Math.floor(new Date().getTime()/1000),file,
                                              {gasLimit:300000}
                  
                                          )
                                          }
                                          
                                      }}


                    class="mr-5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer">
                      Update
                    </button>
                    <button 
                    onClick={()=>{disconnect();navigate("/")}}
                    class="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 cursor-pointer">
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-auto flex flex-wrap md:flex-nowrap">
            <div class="p-4 my-4 mx-auto max-w-lg min-w-[20rem]">
              <h1 class="text-2xl text-center mb-5">Latest buys</h1>
              {latestBuys && latestBuys.map((v,e)=>
            <div class="-m-3">
            <div class="@container flex flex-wrap ">
              <div class="basis-full p-3 text-center">
                <h1>Token {`${v.token.slice(0,4)}...${v.token.slice(-5)}`}</h1>
                <h1>Buy {Number(wte(v.amount)).toFixed(0)}</h1>
              </div>
            </div>
          </div>
            ) }
            </div>
            <div class="p-4 my-4 mx-auto max-w-lg min-w-[20rem]">
              <h1 class="text-2xl text-center mb-5">Latest created tokens</h1>
              {tokenCreated && tokenCreated.map((v,e)=>{
                  const value = data.filter(item=>item.tokenAdd==v)
                  console.log("v",value[0])
                return (
                   <Card v={value[0]} ethThreshold={ethThreshold}/>
                )
              }
          //   <div class="-m-3">
          //   <div class="@container flex flex-wrap ">
          //     <div class="basis-full p-3 text-center">
          //       <h1>{v}</h1>
                
          //     </div>
          //   </div>
          // </div>

            ) }
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
