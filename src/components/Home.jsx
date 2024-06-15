import React, { useEffect, useState } from "react";
import "./Home.css";
import Sidebar from "./Sidebar";
import Search from "./Search";

import { LaunchAbi, LaunchAddress, defaultRpc, defualtChain, ethScan } from "../config";
import Web3 from "web3";
import { ethers, formatEther } from "ethers";
import { Link } from "react-router-dom";
import { wte } from "./writeFun";
import Card from "./Card";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers";

import { useMediaQuery } from "react-responsive";

export default function Home({selected,setSelected }) {
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  // const { activate, deactivate, account, library, chainId } = useWeb3React();
  const wchain = chainId ? chainId : defualtChain;
  const web3 = new Web3(new Web3.providers.HttpProvider(defaultRpc));
  const contractR = new web3.eth.Contract(LaunchAbi, LaunchAddress);
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [ethThreshold, setEthThreshold] = useState(0);
  const [Events, setEvents] = useState();
  const [saleEvents, setSaleEvents] = useState();
  const [showFilter, setshowFilter] = useState(false);
  const [filled, setFilled] = useState(0);
  const [sorted, setSorted] = useState();
  const [users, setUsers] = useState();

  useEffect(() => {
    const abc = async () => {
      const _data = await contractR.methods.getTokens().call();
      setData(_data);
      setFilteredData(_data);
      
      const sorted = [..._data].sort(
        (a, b) => {


          return Number(formatEther(b.ethCollected)) - Number(formatEther(a.ethCollected))
        })
      ;

 
      setSorted(sorted);
      const _ethThreshold = await contractR.methods.ethThreshold().call();
      setEthThreshold(formatEther(_ethThreshold));

      const _block = await web3.eth.getBlockNumber();

      const _events = await contractR.getPastEvents("TokensPurchased", {
        fromBlock: `${_block - 50000}`,
        toBlock: `${_block}`,
      });

      console.log("block ",_events);

      const _eventsF = _events.map((v, e) => {
        const mainData = [..._data].filter(e=>e.tokenAdd==v.returnValues.tokenAddress)
        return { data: v.returnValues, blockNumber: v.blockNumber,mainData };
      });
      setEvents(_eventsF);

      const _Saleevents = await contractR.getPastEvents("TokensSold", {
        fromBlock: `${_block - 5000}`,
        toBlock: `${_block}`,
      });
      const _seventsF = _Saleevents.map((v, e) => {
        const mainData = [..._data].filter(e=>e.tokenAdd==v.returnValues.tokenAddress)
        return { data: v.returnValues, blockNumber: v.blockNumber,mainData };
      });
      setSaleEvents(_seventsF);
    };

    abc();
  }, [address]);

  const combinedArray = Events && saleEvents && [...Events, ...saleEvents];

  Events &&
    saleEvents &&
    combinedArray.sort(
      (a, b) => parseFloat(a.blockNumber) - parseFloat(b.blockNumber)
    );



  const findname = (add) => {
    const item = data.filter((e) => e[10].toLowerCase() == add.toLowerCase());

    return {
      pic: `https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${item[0][9][4]}`,
      name: item[0][0],
    };
    //return {pic:`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${item[9][4]}`, name:item[0]}
  };

  function handleChange(event) {
    const selectedValue = parseInt(event.target.value);

    sort(selectedValue);
  }

  const sort = (v) => {

    const cloned = [...data];
    const filtered =
      v == 1
        ? cloned.sort((a, b) => {
            return Number(a.tokenCreated) - Number(b.tokenCreated);
          })
        : cloned.sort(
            (a, b) => Number(b.tokenCreated) - Number(a.tokenCreated)
          );
    // const filteredIndex = filtered.map((e) => e.index);

    // const filteredData1 = filteredIndex.map(e=>data[e])
    setFilteredData(filtered);
  };

  const filterByFilled = (v) => {
    const cloned = [...data];
    if (v == 0) {
      setFilteredData(cloned);
    } else if (v == 1) {
      const filtered = cloned.filter((e) => e.launched == true);
      setFilteredData(filtered);
    } else if (v == 2) {
      const filtered = cloned.filter((e) => e.launched == false);
      setFilteredData(filtered);
    }
  };



  return (
    data &&
    sorted && (
      <div
        style={{ backgroundImage: `url("./assets/backg.png")` }}
        class="relative h-full snipcss-oFsOI"
      >
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

        <div class="lg:pl-72">
          <Search selected={selected} setSelected={setSelected} />
          <main class="py-10 relative">
            <div class="px-4 sm:px-6 lg:px-8 mx-auto">
              <div
                style={{ overflow: "hidden" }}
                class="flex flex-col gap-y-4 text-xs mb-5 text-black items-center"
              >
                <div class="flex gap-x-4">
                  {Events &&
                    saleEvents &&
                    combinedArray.map((v, e) => {
                      if((!isMobile &&  e<4) || ((isMobile &&  e<1)) ){
                        if (v.data.buyer) {
                          return (
                            <div
                              style={{ color:"white", borderLeft:"1px solid white", borderRight:"1px solid white" }}
                              class="items-center flex gap-2  p-1 pl-2 pr-3"
                            >
                              <img
                                src={findname(v.data.tokenAddress).pic}
                                class="rounded-full h-8 w-8"
                                alt="Token Image"
                              />
                              <div>
                                <a
                                                                target="_blank"
                                  class="font-semibold mr-1  text-[#FFB921] hover:underline font-bold  "
                                  href={`${ethScan}${v.data.buyer}`}
                                >
                                  {`${v.data.buyer.slice(
                                    0,
                                    4
                                  )}...${v.data.buyer.slice(-5)}`}
                                </a>
                                <span class="font-semibold">
                                  {wte(v.data.ethPaid)}
                                </span>{" "}
                                ETH of
                                <Link
                                  class="font-semibold ml-1  text-[#FFB921] hover:underline font-bold  "
                                  to={`details/${v.data.tokenAddress}`}
                                  state={{ data: v.mainData[0] }}  
                                >
                                  {findname(v.data.tokenAddress).name}
                                </Link>
                              </div>
                              <img
                                src={findname(v.data.tokenAddress).pic}
                                class="rounded-full h-8 w-8"
                                alt="Token Image"
                              /> 
                            </div>
                          );
                        } else {
                          return (
                            <div
                            style={{ color:"white", borderLeft:"1px solid white", borderRight:"1px solid white" }}
                              class="items-center flex gap-2 p-1 pl-2 pr-3"
                            >
                              <img
                                src={findname(v.data.tokenAddress).pic}
                                class="rounded-full h-8 w-8"
                                alt="Token Image"
                              />
                              <div>
                                <a
                                  target="_blank"
                                  class="font-semibold mr-1  text-[#FFB921] hover:underline font-bold  "
                                  href={`${ethScan}${v.data.seller}`}
                                >
                                  {`${v.data.seller.slice(
                                    0,
                                    4
                                  )}...${v.data.seller.slice(-5)}`}
                                </a>
                                <span class="font-semibold">
                                  {wte(v.data.ethReceived)}
                                </span>{" "}
                                ETH of
                                <Link
                                              to={`details/${v.data.tokenAddress}`}
                                              state={{ data: v.mainData[0] }}
                                  class="font-semibold ml-1  text-[#FFB921] hover:underline font-bold  "
  
                                >
                                  {findname(v.data.tokenAddress).name}
                                </Link>
                              </div>
                              <img
                                src={findname(v.data.tokenAddress).pic}
                                class="rounded-full h-8 w-8"
                                alt="Token Image"
                              />
                            </div>
                          );
                        }
                      }

                    })}
                </div>
              </div>

              <div class="flex items-center justify-center gap-20">
                {sorted.map((v, e) => {
                  if (e < 2) {
                    return (
                      <div>
                        <h2 
                        style={{fontSize:"20px"}}
                        class="text-2xl mb-4 font-bold tracking-tight text-white sm:text-2xl mt-6 text-center">
                          🐐 G.O.A.T 🐐
                        </h2>
                        <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-6">
                          <div
                            style={isMobile ? { width: "100%" } : {}}
                            className={
                              isMobile
                                ? ""
                                : "block bg-neutral-600/25 rounded-3xl overflow-hidden shrink-0 flex-1 p-4 sm:min-w-[20rem] style-cGSC2"
                            }
                            id="style-cGSC2"
                          >
                            <div class="flex gap-x-4 mt-1 justify-center">
                              <Link
                                class="  truncate text-3xl text-green-400  text-[#FFB921] hover:underline font-bold  "
                                to={`details/${v[10]}`}
                                state={{ data: v }}
                              >
                                {v[0]}
                              </Link>
                              {/* <div class="text-yellow-400 text-xs">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="comment"
                                class="svg-inline--fa fa-comment "
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
                                ></path>
                              </svg>
                              <span class="ml-1">13</span>
                            </div> */}
                            </div>
                            <img
                              src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${v[9][4]}`}
                              class="rounded-full h-20 w-20 m-auto mt-4"
                              alt="Token Image"
                            />
                            <div class="flex justify-between mb-5">
                              <div class="flex gap-x-4">
                                <div class="min-w-0 flex-auto">
                                  <div class="mt-1">
                                    <div class="text-sm">
                                      {" "}
                                      {Number(
                                        formatEther(v.ethCollected)
                                      ).toFixed(4)}{" "}
                                      / {ethThreshold} ETH
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div 
                              
 //                             class="flex flex-col sm:items-end flex-shrink-0"
                              >
                                <div 
                                
                                class="mt-1 flex justify-start space-x-2"
                                >
                                  <a
                                    class=" text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={v[9][0]}
                                  >
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fas"
                                      data-icon="window-maximize"
                                      class="svg-inline--fa fa-window-maximize "
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 512 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM96 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
                                      ></path>
                                    </svg>
                                  </a>
                                  
                                  <a
                                    style={{cursor:"pointer"}}
                                    class="  text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
                                    target="_blank"
                                     href={v[9][2]}
                                  >
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fab"
                                      data-icon="telegram"
                                      class="svg-inline--fa fa-telegram "
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 496 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"
                                      ></path>
                                    </svg>
                                  </a>
                                  <a
                                                                      style={{cursor:"pointer"}}
                                    class=" text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={v[9][1]}
                                  >
                                    <svg
                                      aria-hidden="true"
                                      focusable="false"
                                      data-prefix="fab"
                                      data-icon="x-twitter"
                                      class="svg-inline--fa fa-x-twitter "
                                      role="img"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 512 512"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                                      ></path>
                                    </svg>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div class="w-full bg-neutral-600/25 rounded-md overflow-hidden shrink-0 mb-4">
                              <div
                                style={{
                                  width: `${
                                    (formatEther(v.ethCollected) /
                                      ethThreshold) *
                                    100
                                  }%`,
                                }}
                                class="bg-blue-700 p-1.5 text-center text-xs font-medium leading-none text-white style-O1xiV"
                                id="style-O1xiV"
                              >
                                {`${Number(
                                  (formatEther(v.ethCollected) / ethThreshold) *
                                    100
                                ).toFixed(4)}%`}
                              </div>
                            </div>
                            <Link
                                          to={`details/${v[10]}`}
                                          state={{ data: v }}
                              class=" mt-1 truncate text-xs leading-5 text-gray-400  text-[#FFB921] hover:underline font-bold  "

                            ></Link>
                            <Link
                              class=" flex text-lg text-white font-bold bg-black/25 hover:bg-black/50 p-3 rounded-md mt-5 w-full text-center justify-center undefined "
                              to={`details/${v[10]}`}
                              state={{ data: v }}
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              <div class="mb-5">
                <section
                  aria-labelledby="filter-heading"
                  class="grid items-center border-b border-t border-gray-200/10"
                  data-headlessui-state=""
                >
                  {/* <h2 id="filter-heading" class="sr-only">
                    Filters
                  </h2> */}
                  <div class="relative col-start-1 row-start-1 py-4">
                    <div class="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <button
                          onClick={() => {
                            setshowFilter(true);
                          }}
                          class="group flex items-center font-medium text-white"
                          id="headlessui-disclosure-button-:Raimkda:"
                          type="button"
                          aria-expanded="false"
                          data-headlessui-state=""
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                            class="mr-2 h-5 w-5 flex-none text-white group-hover:text-blue-500"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          Filter
                        </button>
                        {showFilter && (
                          <button
                            style={{ marginLeft: "25px" }}
                            onClick={() => {
                              setshowFilter(false);
                            }}
                          >
                            close all
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div class="col-start-1 row-start-1 py-4">
                    <div class="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
                      <div
                        class="relative inline-block"
                        data-headlessui-state=""
                      >
                        <div class="flex">
                          <label>Sort:</label>
                          <select
                            onChange={handleChange}
                            style={{
                              background: "transparent",
                              fontSize: "20px",
                            }}
                            class="group inline-flex justify-center text-sm font-medium text-white hover:text-blue-500"
                            id="headlessui-menu-button-:Rcimkda:"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            data-headlessui-state=""
                          >
                            <option value={"0"}> Recent Activity</option>
                            <option value={"1"}>Newest</option>
                            <option value={"2"}>Oldest</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  {showFilter && (
                    <div
                      class="border-t border-gray-200/10 py-10 snipcss-HIm3r"
                      id="headlessui-disclosure-panel-:R3imkda:"
                      data-headlessui-state="open"
                    >
                      <div class="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
                        <div class="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                          <fieldset>
                            <legend class="block font-medium">Filled</legend>
                            <div class="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                              <div class="flex items-center text-base sm:text-sm">
                                <input
                                  onChange={() => {
                                    setFilled(0);
                                    filterByFilled(0);
                                  }}
                                  class="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  type="checkbox"
                                  value="all"
                                  checked={filled == 0}
                                  name="filled"
                                />
                                <label class="ml-3 min-w-0 flex-1 text-white">
                                  All
                                </label>
                              </div>
                              <div class="flex items-center text-base sm:text-sm">
                                <input
                                  onChange={() => {
                                    setFilled(1);
                                    filterByFilled(1);
                                  }}
                                  class="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  type="checkbox"
                                  value="filled"
                                  name="filled"
                                  checked={filled == 1}
                                />
                                <label class="ml-3 min-w-0 flex-1 text-white">
                                  Filled
                                </label>
                              </div>
                              <div class="flex items-center text-base sm:text-sm">
                                <input
                                  onChange={() => {
                                    setFilled(2);
                                    filterByFilled(2);
                                  }}
                                  class="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  type="checkbox"
                                  value="unfilled"
                                  name="filled"
                                  checked={filled == 2}
                                />
                                <label class="ml-3 min-w-0 flex-1 text-white">
                                  Unfilled
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>
              <div
                style={
                  isMobile ? { display: "flex", flexDirection: "column" } : {}
                }
                className={
                  isMobile
                    ? ""
                    : "relative z-10 flex flex-wrap justify-center gap-6 sm:flex-row sm:justify-between"
                }
              >
                {filteredData &&
                  filteredData.map((v, e) => (
                    <Card v={v} ethThreshold={ethThreshold} />
                    //     <div class="block bg-neutral-600/25 rounded-3xl overflow-hidden shrink-0 flex-1 p-8 sm:min-w-[20rem]">
                    //       <div class="flex gap-x-4 mt-1 justify-center">
                    //         <Link
                    //           to={`details/${v[10]}`}
                    //           state={{ data: v }}
                    //           class="  truncate text-3xl text-green-400  text-[#FFB921] hover:underline font-bold  "
                    //           href="viewpresale?tokenAddress=0x91DeB06aA91d13A5ab572e62495FeceA2c8053Ac"
                    //         >
                    //           {v[0]}
                    //         </Link>
                    //         {/* <div class="text-yellow-400 text-xs">
                    //   <svg
                    //     aria-hidden="true"
                    //     focusable="false"
                    //     data-prefix="fas"
                    //     data-icon="comment"
                    //     class="svg-inline--fa fa-comment "
                    //     role="img"
                    //     xmlns="http://www.w3.org/2000/svg"
                    //     viewBox="0 0 512 512"
                    //   >
                    //     <path
                    //       fill="currentColor"
                    //       d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
                    //     ></path>
                    //   </svg>
                    //   <span class="ml-1">13</span>
                    // </div> */}
                    //       </div>
                    //       <div class="flex justify-between mb-5">
                    //         <div class="flex gap-x-4">
                    //           <div class="min-w-0 flex-auto">
                    //             <div class="mt-1">
                    //               <div class="text-sm">
                    //                 {formatEther(v.ethCollected)} /{" "}
                    //                 {ethThreshold} ETH
                    //               </div>
                    //             </div>
                    //           </div>
                    //         </div>
                    //         <div class="flex flex-col sm:items-end flex-shrink-0">
                    //           <div class="mt-1 flex justify-start space-x-2">
                    //             <a
                    //               class=" text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
                    //               target="_blank"
                    //               rel="noopener noreferrer"
                    //               href={v[9][0]}
                    //             >
                    //               <svg
                    //                 aria-hidden="true"
                    //                 focusable="false"
                    //                 data-prefix="fas"
                    //                 data-icon="window-maximize"
                    //                 class="svg-inline--fa fa-window-maximize "
                    //                 role="img"
                    //                 xmlns="http://www.w3.org/2000/svg"
                    //                 viewBox="0 0 512 512"
                    //               >
                    //                 <path
                    //                   fill="currentColor"
                    //                   d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM96 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
                    //                 ></path>
                    //               </svg>
                    //             </a>
                    //             <a
                    //               class="  text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
                    //               target="_blank"
                    //               rel="noopener noreferrer"
                    //               href={v[9][2]}
                    //             >
                    //               <svg
                    //                 aria-hidden="true"
                    //                 focusable="false"
                    //                 data-prefix="fab"
                    //                 data-icon="telegram"
                    //                 class="svg-inline--fa fa-telegram "
                    //                 role="img"
                    //                 xmlns="http://www.w3.org/2000/svg"
                    //                 viewBox="0 0 496 512"
                    //               >
                    //                 <path
                    //                   fill="currentColor"
                    //                   d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"
                    //                 ></path>
                    //               </svg>
                    //             </a>
                    //             <a
                    //               class=" text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
                    //               target="_blank"
                    //               rel="noopener noreferrer"
                    //               href={v[9][1]}
                    //             >
                    //               <svg
                    //                 aria-hidden="true"
                    //                 focusable="false"
                    //                 data-prefix="fab"
                    //                 data-icon="x-twitter"
                    //                 class="svg-inline--fa fa-x-twitter "
                    //                 role="img"
                    //                 xmlns="http://www.w3.org/2000/svg"
                    //                 viewBox="0 0 512 512"
                    //               >
                    //                 <path
                    //                   fill="currentColor"
                    //                   d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                    //                 ></path>
                    //               </svg>
                    //             </a>
                    //           </div>
                    //         </div>
                    //       </div>
                    //       <div class="w-full bg-neutral-600/25 rounded-md overflow-hidden shrink-0 mb-4">
                    //         <div
                    //           style={{
                    //             width: `${
                    //               (formatEther(v.ethCollected) /
                    //                 ethThreshold) *
                    //               100
                    //             }%`,
                    //           }}
                    //           class="bg-blue-700/50 p-1.5 text-center text-xs font-medium leading-none text-white style-8UWQr"
                    //           id="style-8UWQr"
                    //         >
                    //           {`${
                    //             (formatEther(v.ethCollected) /
                    //               ethThreshold) *
                    //             100
                    //           }%`}
                    //         </div>
                    //       </div>
                    //       <a
                    //         class=" mt-1 truncate text-xs leading-5 text-gray-400  text-[#FFB921] hover:underline font-bold  "
                    //         //href="/viewpresale?tokenAddress=0x91DeB06aA91d13A5ab572e62495FeceA2c8053Ac"
                    //       >
                    //         <div class="relative p-[2px] group flex flex-1 shrink-0">
                    //           <div
                    //             class="absolute inset-0 rounded-lg z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)] style-GVGEc"
                    //             id="style-GVGEc"
                    //           ></div>
                    //           <div
                    //             class="absolute inset-0 rounded-lg z-[1] will-change-transform bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)] style-PS196"
                    //             id="style-PS196"
                    //           ></div>
                    //           <div class="z-10 relative w-full rounded-lg bg-black/75 overflow-hidden h-[15rem]">
                    //             <img
                    //               src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${v[9][4]}`}
                    //               class="absolute left-0 top-0 right-0 bottom-0 m-auto rounded-lg w-1/2 z-index-1"
                    //               alt="Token Image"
                    //             />
                    //             <img
                    //               src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${v[9][4]}`}
                    //               class="absolute left-0 top-0 right-0 bottom-0 m-auto rounded-lg -z-index-10 opacity-5"
                    //               alt="Token Image"
                    //             />
                    //           </div>
                    //         </div>
                    //       </a>
                    //       <Link
                    //         class=" flex text-lg text-white font-bold bg-black/25 hover:bg-black/50 p-3 rounded-md mt-5 w-full text-center justify-center undefined "
                    //         to={`details/${v[10]}`}
                    //         state={{ data: v }}
                    //       >
                    //         View
                    //       </Link>
                    //     </div>
                  ))}
              </div>
              {/* <div>
                <div class="flex justify-center mt-6 mb-6 text-2xl">
                  <button
                    class="text-green-400 hover:underline font-bold p-4 style-9eDX5"
                    id="style-9eDX5"
                  >
                    1
                  </button>
                  <button
                    class="text-green-400 hover:underline font-bold p-4 style-3SKCo"
                    id="style-3SKCo"
                  >
                    2
                  </button>
                  <button
                    class="text-green-400 hover:underline font-bold p-4 style-gsWaJ"
                    id="style-gsWaJ"
                  >
                    3
                  </button>
                  <button
                    class="text-green-400 hover:underline font-bold p-4 style-NtD9z"
                    id="style-NtD9z"
                  >
                    4
                  </button>
                  <button
                    class="text-green-400 hover:underline font-bold p-4 style-MqHKf"
                    disabled=""
                    id="style-MqHKf"
                  >
                    ...
                  </button>
                  <button
                    class="text-green-400 hover:underline font-bold p-4 style-AhRV1"
                    id="style-AhRV1"
                  >
                    54
                  </button>
                  <button
                    class="text-green-400 hover:underline font-bold p-4 style-xij9h"
                    id="style-xij9h"
                  >
                    55
                  </button>
                  <button
                    class="text-green-400 hover:underline font-bold p-4 style-52jqS"
                    id="style-52jqS"
                  >
                    56
                  </button>
                </div>
              </div> */}
            </div>
          </main>
        </div>
      </div>
    )
  );
}
