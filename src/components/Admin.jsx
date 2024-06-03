import React, { useEffect, useState } from "react";
import "./Add.css";
import Sidebar from "./Sidebar";
import Search from "./Search";
import { writeFunction } from "./writeFun";
// import { useWeb3React } from "@web3-react/core";
import { LaunchAbi, LaunchAddress, defaultRpc, defualtChain } from "../config";
import { Contract, ethers } from "ethers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Web3 from "web3";
import { CircularProgress } from "@mui/material";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, } from 'ethers'

export const getContract = async (conAdd,conAbi,walletProvider)=>{
  const ethersProvider = new BrowserProvider(walletProvider)
  const signer = await ethersProvider.getSigner()
  // The Contract object
  const contract = new Contract(conAdd, conAbi, signer)
  return contract
}

export default function Admin() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const wchain = chainId ? chainId : defualtChain;
  const web3 = new Web3(new Web3.providers.HttpProvider(defaultRpc));
  const contractR = new web3.eth.Contract(LaunchAbi, LaunchAddress);
  const navigate = useNavigate();
  const [devFee, setDevFee] = useState(0);
  const [launchFee, setLaunchFee] = useState(0);
  const [ethThreshold, setEthThreshold] = useState(0);
  const [platFormFee, setPlatFormFee] = useState(0);
  const [owner, setOwner] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const abc = async () => {
      const _devFee = await contractR.methods.feeDeployer().call();
      console.log("in between", _devFee);
      setDevFee((_devFee / 10000) * 100);

      const _launchFee = await contractR.methods.feeOnLaunch().call();
      setLaunchFee((_launchFee / 10000) * 100);

      const _ethThreshold = await contractR.methods.ethThreshold().call();
      setEthThreshold(ethers.utils.formatEther(_ethThreshold));

      const _platFormFee = await contractR.methods.feePlatform().call();
      setPlatFormFee((_platFormFee / 10000) * 100);

      const _owner = await contractR.methods.owner().call();
      setOwner(_owner);
    };

    abc();
  }, [address, toggle]);
  console.log("admin panel", devFee, launchFee);

 

  const validation = () => {
    if (!account) {
      toast.error("Please connect wallet first");
      return false;
    } else if (!owner.includes("0x")) {
      toast.error("Please add valid wallet address in owner field");
      return false;
    } else {
      return true;
    }
  };

  //console.log("data",file)
  return (
    <div 
    style={{backgroundImage:`url("./assets/backg.png")`}}
    cz-shortcut-listen="true" class="snipcss-D9VLI">
      <div class="relative h-full">
        <div class="fixed -z-10 pointer-events-none inset-0 overflow-hidden">
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
        </div>

        <div class="lg:pl-72 snipcss0-0-0-1">
          <Search />
          <main class="py-10 relative snipcss0-1-1-22">
            <div class="px-4 sm:px-6 lg:px-8 mx-auto snipcss0-2-22-23">
              <div class="mx-auto max-w-7xl snipcss0-3-23-24">
                <div class="space-y-12 snipcss0-4-24-25">
                  <div class="border-b border-white/10 pb-12 snipcss0-5-25-26">
                    <div class="flex gap-x-6 items-center snipcss0-6-26-27">
                      <div class="snipcss0-7-27-28">
                        <h2 class="text-base font-semibold leading-7 text-white snipcss0-8-28-29">
                          Admin Panel
                        </h2>
                        <p class="mt-1 text-sm leading-6 text-gray-400 snipcss0-8-28-30">
                          Admin tool to make changes in the contract
                        </p>
                      </div>
                    </div>
                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 snipcss0-6-26-31">
                      <div class="sm:grid-span-6 snipcss0-7-31-32">
                        <label class="block text-sm font-medium leading-6 text-white snipcss0-8-32-33">
                          Change Dev Fee (%)
                        </label>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          class="mt-2 snipcss0-8-32-34"
                        >
                          <input
                            type="text"
                            class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-9-34-35"
                            placeholder="%"
                            value={devFee}
                            onChange={(e) => {
                              setDevFee(e.target.value);
                            }}
                          />
                          <button
                            onClick={async () => {
                              const check = validation();
                              const contractW = await getContract(LaunchAddress, LaunchAbi,walletProvider);
                              if (check) {
                                writeFunction(
                                  "update",
                                  contractW,
                                  "changeDevFee",
                                  () => {
                                    setToggle(false);
                                  },
                                  () => {
                                    setToggle(false);
                                  },
                                  setToggle,
                                  devFee * 100,
                                  { gasLimit: 30000 }
                                );
                              }
                            }}
                            style={{ marginLeft: "10px" }}
                            className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm cursor-pointer bg-blue-700 hover:bg-gray-400 focus-visible:outline-gray-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 snipcss0-5-77-79"
                          >
                            {toggle ?<CircularProgress sx={{color:"white"}}/> :"Update"}
                          </button>
                        </div>
                      </div>
                      <div class="sm:grid-span-6 snipcss0-7-31-36">
                        <label class="block text-sm font-medium leading-6 text-white snipcss0-8-36-37">
                          Change Launch Fee (%)
                        </label>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          class="mt-2 snipcss0-8-36-38"
                        >
                          <input
                            type="text"
                            class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-9-38-39"
                            placeholder="%"
                            value={launchFee}
                            onChange={(e) => {
                              setLaunchFee(e.target.value);
                            }}
                          />
                          <button
                            onClick={async () => {
                              const check = validation();
                              const contractW = await getContract(LaunchAddress, LaunchAbi,walletProvider);
                              if (check) {
                                writeFunction(
                                  "update",
                                  contractW,
                                  "changeLaunchFee",
                                  () => {
                                    setToggle(false);
                                  },
                                  () => {
                                    setToggle(false);
                                  },
                                  setToggle,
                                  launchFee * 100,
                                  { gasLimit: 30000 }
                                );
                              }
                            }}
                            style={{ marginLeft: "10px" }}
                            className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm cursor-pointer bg-blue-700 hover:bg-gray-400 focus-visible:outline-gray-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 snipcss0-5-77-79"
                          >
                            {toggle ?<CircularProgress sx={{color:"white"}}/> :"Update"}
                          </button>
                        </div>
                      </div>
                      <div class="sm:grid-span-6 snipcss0-7-31-36">
                        <label class="block text-sm font-medium leading-6 text-white snipcss0-8-36-37">
                          Change Launch Threshold (in eth)
                        </label>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          class="mt-2 snipcss0-8-36-38"
                        >
                          <input
                            type="text"
                            class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-9-38-39"
                            placeholder="ETH"
                            value={ethThreshold}
                            onChange={(e) => {
                              setEthThreshold(e.target.value);
                            }}
                          />
                          <button
                            onClick={async () => {
                              const check = validation();
                              const contractW = await getContract(LaunchAddress, LaunchAbi,walletProvider);
                              if (check) {
                                writeFunction(
                                  "update",
                                  contractW,
                                  "changeLaunchThreshold",
                                  () => {
                                    setToggle(false);
                                  },
                                  () => {
                                    setToggle(false);
                                  },
                                  setToggle,
                                  ethers.utils.parseEther(ethThreshold),
                                  { gasLimit: 30000 }
                                );
                              }
                            }}
                            style={{ marginLeft: "10px" }}
                            className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm cursor-pointer bg-blue-700 hover:bg-gray-400 focus-visible:outline-gray-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 snipcss0-5-77-79"
                          >
                            {toggle ?<CircularProgress sx={{color:"white"}}/> :"Update"}
                          </button>
                        </div>
                      </div>

                      <div class="sm:grid-span-6 snipcss0-7-31-36">
                        <label class="block text-sm font-medium leading-6 text-white snipcss0-8-36-37">
                          Change platform Fee (%)
                        </label>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          class="mt-2 snipcss0-8-36-38"
                        >
                          <input
                            type="text"
                            class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-9-38-39"
                            placeholder="%"
                            value={platFormFee}
                            onChange={(e) => {
                              setPlatFormFee(e.target.value);
                            }}
                          />
                          <button
                            onClick={async () => {
                              const check = validation();
                              const contractW = await getContract(LaunchAddress, LaunchAbi,walletProvider);
                              if (check) {
                                writeFunction(
                                  "update",
                                  contractW,
                                  "changePlatFee",
                                  () => {
                                    setToggle(false);
                                  },
                                  () => {
                                    setToggle(false);
                                  },
                                  setToggle,
                                  platFormFee * 100,
                                  { gasLimit: 30000 }
                                );
                              }
                            }}
                            style={{ marginLeft: "10px" }}
                            className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm cursor-pointer bg-blue-700 hover:bg-gray-400 focus-visible:outline-gray-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 snipcss0-5-77-79"
                          >
                            {toggle ?<CircularProgress sx={{color:"white"}}/> :"Update"}
                          </button>
                        </div>
                      </div>

                      <div class="sm:grid-span-6 snipcss0-7-31-36">
                        <label class="block text-sm font-medium leading-6 text-white snipcss0-8-36-37">
                          Change owner (address)
                        </label>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          class="mt-2 snipcss0-8-36-38"
                        >
                          <input
                            type="text"
                            class="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 snipcss0-9-38-39"
                            value={owner}
                            onChange={(e) => {
                              setOwner(e.target.value);
                            }}
                          />
                          <button
                            onClick={async () => {
                              const check = validation();
                              const contractW = await getContract(LaunchAddress, LaunchAbi,walletProvider);
                              if (check) {
                                writeFunction(
                                  "update",
                                  contractW,
                                  "transferOwnership",
                                  () => {
                                    setToggle(false);
                                  },
                                  () => {
                                    setToggle(false);
                                  },
                                  setToggle,
                                  owner,
                                  { gasLimit: 30000 }
                                );
                              }
                            }}
                            style={{ marginLeft: "10px" }}
                            className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm cursor-pointer bg-blue-700 hover:bg-gray-400 focus-visible:outline-gray-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 snipcss0-5-77-79"
                          >
                            {toggle ?<CircularProgress sx={{color:"white"}}/> :"Update"}
                          </button>
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
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="Toastify"></div>
      <div id="loom-companion-mv3" ext-id="liecbddmkiiihnedobmlmillhodjkdmb">
        <section id="shadow-host-companion"></section>
      </div>
      <w3m-modal></w3m-modal>
      <next-route-announcer
        id="style-MbWEH"
        class="style-MbWEH"
      ></next-route-announcer>
      <iframe
        id="verify-api"
        src="https://verify.walletconnect.com/e7ba0da4ac18303153e8cf4f2e34b2ad"
        class="style-SO5q3"
      ></iframe>
      <div
        class="snipcss-modal snipcss-micromodal-slide"
        id="modal-pick-resolution"
      ></div>
      <div
        class="edge_builder edge_builder_top style-yjVgy"
        id="style-yjVgy"
      ></div>
      <div
        class="edge_builder edge_builder_right style-jegbH"
        id="style-jegbH"
      ></div>
      <div
        class="edge_builder edge_builder_bottom style-7blPB"
        id="style-7blPB"
      ></div>
      <div
        class="edge_builder edge_builder_left style-RhXvk"
        id="style-RhXvk"
      ></div>
      <div
        class="edge_builder2 edge_builder_top style-n8d6b"
        id="style-n8d6b"
      ></div>
      <div
        class="edge_builder2 edge_builder_right style-SZmGz"
        id="style-SZmGz"
      ></div>
      <div
        class="edge_builder2 edge_builder_bottom style-v2cjq"
        id="style-v2cjq"
      ></div>
      <div
        class="edge_builder2 edge_builder_left style-sgjMU"
        id="style-sgjMU"
      ></div>
      <div data-tether-id="1" id="style-jz6nT" class="style-jz6nT"></div>

      <div
        class="snipcss-modal snipcss-micromodal-slide"
        id="modal-pick-resolution"
      ></div>
      <div
        class="edge_builder edge_builder_top style-HMzv6"
        id="style-HMzv6"
      ></div>
      <div
        class="edge_builder edge_builder_right style-H8A3y"
        id="style-H8A3y"
      ></div>
      <div
        class="edge_builder edge_builder_bottom style-HqV3E"
        id="style-HqV3E"
      ></div>
      <div
        class="edge_builder edge_builder_left style-exqlk"
        id="style-exqlk"
      ></div>
      <div
        class="edge_builder2 edge_builder_top style-THHfK"
        id="style-THHfK"
      ></div>
      <div
        class="edge_builder2 edge_builder_right style-MCWbL"
        id="style-MCWbL"
      ></div>
      <div
        class="edge_builder2 edge_builder_bottom style-BcFUS"
        id="style-BcFUS"
      ></div>
      <div
        class="edge_builder2 edge_builder_left style-BWlIe"
        id="style-BWlIe"
      ></div>
      <div data-tether-id="1" id="style-yrnmL" class="style-yrnmL"></div>
      <canvas
        width="70"
        height="70"
        id="snipcss-kiwi"
        class="style-mTQGN"
      ></canvas>
    </div>
  );
}
