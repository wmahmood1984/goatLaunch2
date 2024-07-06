import React, { useEffect, useState } from "react";
import "./Details.css";
import { useLocation, useParams } from "react-router";
import Search from "./Search";
import { Contract, ethers, formatEther, parseEther } from "ethers";
import { etw, fN, timePassed, writeFunction, wte } from "./writeFun";
// import { useWeb3React } from "@web3-react/core";
import {
  LaunchAbi,
  LaunchAddress,
  chatAbi,
  chatAddress,
  defaultRpc,
  defualtChain,
  ethScan,
  ethScanTx,
  tokenAbi,
} from "../config";
import Web3 from "web3";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers";

import { useMediaQuery } from "react-responsive";
import ChartT from "../ChartT";


// export const getContract = (library, account, add, abi) => {
//   const signer = library?.getSigner(account).connectUnchecked();
//   var contract = new Contract(add, abi, signer);
//   return contract;
// };

export const getContract = async (conAdd, conAbi, walletProvider) => {
  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  // The Contract object
  const contract = new Contract(conAdd, conAbi, signer);
  return contract;
};

export default function Details({ selected, setSelected }) {
  const { id } = useParams();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { state } = useLocation();

  const [amount, setAmount] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [buySale, setBuySale] = useState("Buy");
  const [text, setText] = useState();
  const [chatTrade, setChatTrade] = useState("chat");
  const [users, setUsers] = useState();

  // const { account, library, chainId } = useWeb3React();
  // const contractW = getContract(library, account, LaunchAddress, LaunchAbi);
  // const tokenContract = getContract(library, account, state.data[10], tokenAbi);

  const wchain = chainId ? chainId : defualtChain;
  const web3 = new Web3(new Web3.providers.HttpProvider(defaultRpc));
  const contractR = new web3.eth.Contract(LaunchAbi, LaunchAddress);
  const tokenContractR = new web3.eth.Contract(tokenAbi, id);
  const chatcontract = new web3.eth.Contract(chatAbi, chatAddress);
  const wallet = web3.eth.accounts.wallet.add(import.meta.env.VITE_SOME_KEY);

  const [data, setData] = useState();
  const [holders, setHolders] = useState();
  const [supply, setsupply] = useState();
  const [chatData, setChatData] = useState([]);
  const [tokensToMint, setTokenstoMint] = useState("0");
  const [expectedEth, setExpectedEth] = useState("0");
  const [ethThreshold, setEthThreshold] = useState("0");
  const [tokenName, setTokenName] = useState("");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [Events, setEvents] = useState();
  const [saleEvents, setSaleEvents] = useState();

  const updateChat = async () => {
    setToggle(true);
    try {
      const tx1 = await chatcontract.methods
        .update(text, address, id)
        .send({ from: wallet.address, gasLimit: 500000 })
        .on("confirmation", (e, r) => {
          setToggle(false);
          setText("");
        });
    } catch (error) {
      console.log("error in update", error);
      setToggle(false);
    }
  };

  useEffect(() => {
    const abc = async () => {
      const _data = await contractR.methods.getTokens().call();
      setData(_data[state.data[11]]);

      const _users = await contractR.methods.getUsers().call()
      setUsers(_users)

      const _holders = await contractR.methods
        .getTokenHolders(state.data[10])
        .call();
      setHolders(_holders);

      const _totalSupply = await tokenContractR.methods.totalSupply().call();
      setsupply(formatEther(_totalSupply));

      const _ethThreshold = await contractR.methods.ethThreshold().call();

      setEthThreshold(formatEther(_ethThreshold));

      const _block = await web3.eth.getBlockNumber();
      const _events = await contractR.getPastEvents("TokensPurchased", {
        fromBlock: `${_block - 5000}`,
        toBlock: `${_block}`,
      });

      const _eventsF = _events.map((v, e) => {
        const mainData = [..._data].filter(
          (e) => e.tokenAdd == v.returnValues.tokenAddress
        );
        return {
          data: v.returnValues,
          blockNumber: v.blockNumber,
          mainData,
          txHash: v.transactionHash,
        };
      });
      setEvents(_eventsF);

      const _Saleevents = await contractR.getPastEvents("TokensSold", {
        fromBlock: `${_block - 5000}`,
        toBlock: `${_block}`,
      });
      const _seventsF = _Saleevents.map((v, e) => {
        const mainData = [..._data].filter(
          (e) => e.tokenAdd == v.returnValues.tokenAddress
        );
        return {
          data: v.returnValues,
          blockNumber: v.blockNumber,
          mainData,
          txHash: v.transactionHash,
        };
      });
      setSaleEvents(_seventsF);

      const _tokenName = await tokenContractR.methods.name().call();
      setTokenName(_tokenName);
      if (address) {
        const _tokenBalance = await tokenContractR.methods
          .balanceOf(address)
          .call();
        setTokenBalance(formatEther(_tokenBalance));
      }

      const _chatData = await chatcontract.methods
        .getchats(state.data[10])
        .call();
      setChatData(_chatData);
    };

    abc();
  }, [address, toggle]);

  useEffect(() => {
    const abc = async () => {
      const _tokensToMint = await contractR.methods
        .getEthToTokens(etw(amount), state.data[10])
        .call();
      setTokenstoMint(wte(_tokensToMint));

      const _expectedEth = await contractR.methods
        .getTokenToEth(etw(amount), state.data[10])
        .call();
      setExpectedEth(wte(_expectedEth));
    };

    abc();
  }, [amount]);

  const validation = () => {
    if (!address) {
      toast.error("Please connect wallet first");
      return false;
    } else if (amount < 0.001) {
      toast.error("The amount must be more than 0.001");
      return false;
    } else {
      return true;
    }
  };

  const saleFunc = async () => {
    const check = validation();
    const tokenContract = await getContract(id, tokenAbi, walletProvider);
    const contractW = await getContract(
      LaunchAddress,
      LaunchAbi,
      walletProvider
    );
    if (check) {
      writeFunction(
        "approve",
        tokenContract,
        "approve",
        () => {
          writeFunction(
            "Sale",
            contractW,
            "sellTokens",
            () => {
              setToggle(false);
              setAmount(0);
            },
            () => {
              setToggle(false);
              setAmount(0);
            },
            setToggle,
            data[10],
            parseEther(amount.toString()),
            {
              gasLimit: 3000000,
            }
          );
        },
        () => {
          setToggle(false);
        },
        setToggle,
        LaunchAddress,
        parseEther(amount.toString()),
        { gasLimit: 300000 }
      );
    }
  };

  const buyFunc = async (e) => {
    e.preventDefault();
    const check = validation();
    const contractW = await getContract(
      LaunchAddress,
      LaunchAbi,
      walletProvider
    );
    if (check) {
      writeFunction(
        "Buy",
        contractW,
        "buyTokens",
        () => {
          setToggle(false);
          //          setAmount(0);
        },
        () => {
          setToggle(false);
          setAmount(0);
        },
        setToggle,
        data[10],
        {
          gasLimit: 3000000,
          value: parseEther(amount.toString()),
        }
      );
    }
  };

  const formatTime = (_time) => {
    const now = new Date().getTime() / 1000;
    const diff = now - _time;
    // console.log("diff",diff,now,_time)
    // console.log("seconds",diff/60)
    // console.log("minutes",diff/(60*60))
    // console.log("hours",diff/(60*60*24))
    if (diff / 60 < 1) {
      return "less than a minute";
    } else if (diff / (60 * 60) < 1) {
      return `${Math.floor(diff / 60)} minutes`;
    } else if (diff / (60 * 60 * 24) < 1) {
      return `${Math.floor(diff / (60 * 60))} hours`;
    } else {
      return `${Math.floor(diff / (60 * 60 * 24))} days`;
    }
  };

  const divStyle = {
    backgroundImage: `url("./assets/backg.png") !important`,
  };

  const combinedArray1 = Events && saleEvents && [...Events, ...saleEvents];
  const combinedArray =
    Events &&
    saleEvents &&
    combinedArray1.filter((e) => e.mainData[0][10] === id);

  // const chartData =
  //   Events &&
  //   saleEvents &&
  //   combinedArray.map((e, index) => {
  //     console.log("inside", e);
  //     var _time = 0;
  //     var _arr = [];
  //     if (index == 0) {
  //       _time = Number(e.data.time);
  //       _arr[0] = Number(e.data.time);
  //       _arr[1] = Number(e.data.price);
  //       _arr[2] = Number(e.data.price);
  //       _arr[3] = Number(e.data.price);
  //       _arr[4] = Number(e.data.price);
  //       _arr[5] = Number(wte(e.data.amount)).toFixed(0);
  //     }

  //     if(index==combinedArray.length){
  //       _arr[4] = Number(e.data.price);
  //       return _arr;
  //     }

  //     if (Number(e.data.time) < _time + 60) {
  //       if (Number(e.data.price) > _arr[2]) {
  //         _arr[2] = Number(e.data.price);
  //       }

  //       if (Number(e.data.price) < _arr[3]) {
  //         _arr[3] = Number(e.data.price);
  //       }

  //       _arr[5] += Number(wte(e.data.amount)).toFixed(0);
  //     }

  //     if (Number(e.data.time) > _time + 60) {
  //       _arr[4] = Number(e.data.price)
  //       const duplicate = [..._arr]
  //       _time = Number(e.data.time);
  //       _arr[0] = Number(e.data.time);
  //       _arr[1] = Number(e.data.price);
  //       _arr[2] = Number(e.data.price);
  //       _arr[3] = Number(e.data.price);
  //       _arr[4] = Number(e.data.price);
  //       _arr[5] = Number(wte(e.data.amount)).toFixed(0);
  //       return duplicate
  //     }

  //   });

  //   const chartData = [];

  // if (Events && saleEvents && combinedArray) {
  //   let _arr;
  //   let _time = 0;
  //   let lastTime = 0; // Initialize lastTime to track the last processed minute

  //   combinedArray.forEach((e, index) => {
  //     const currentTime = Number(e.data.time) * 1000;
  //     const currentPrice = Number(wte(e.data.price));
  //     const currentAmount = Math.floor(Number(wte(e.data.amount)));

  //     if (index === 0) {
  //       // Initialize the first array
  //       _time = currentTime;
  //       lastTime = _time; // Initialize lastTime
  //       _arr = [currentTime,
  //         currentPrice, currentPrice, currentPrice, currentPrice,currentAmount] // [open, high, low, close]
  //       ;
  //     } else {
  //       // Check for missing minutes
  //       while (currentTime >= _time + 120000) { // Check for more than 2 minutes to ensure gap
  //         _time += 60000; // Move to the next minute
  //         chartData.push([
  //           currentTime,
  //           _arr[1], _arr[2], _arr[3], _arr[4],currentAmount // Use correct indices
  //         ]); // Insert a new entry with volume = 0
  //       }

  //       if (currentTime < _time + 60000) {
  //         // Within the same minute interval
  //         _arr[2] = Math.max(_arr[2], currentPrice); // Update high price
  //         _arr[3] = Math.min(_arr[3], currentPrice); // Update low price
  //         _arr[4] = currentPrice; // Update closing price
  //       } else {
  //         // Outside the minute interval, finalize the current array
  //         chartData.push(_arr);

  //         // Initialize new array for the new minute
  //         _time = currentTime;
  //         _arr = [
  //           currentTime,currentPrice, currentPrice, currentPrice, currentPrice,currentAmount // New minute data
  //         ];
  //       }

  //       lastTime = _time; // Update lastTime to the current processed minute
  //     }

  //     // Handle the last element case
  //     if (index === combinedArray.length - 1) {
  //       chartData.push(_arr);
  //     }
  //   });

  //   // Fill in any remaining minutes up to the last known time
  //   let finalTime = lastTime;
  //   const endTime = combinedArray.length > 0 ? combinedArray[combinedArray.length - 1].data.time * 1000 : 0;
  //   while (finalTime < endTime) {
  //     finalTime += 60000;
  //     chartData.push([finalTime,_arr[4], _arr[4], _arr[4], _arr[4],_arr[5]] // Use the last known prices
  //     );
  //   }
  // }

  // chartData.sort((a, b) => a.x - b.x); // Sort based on the 'x' (date)

 console.log("before",holders)
  //   // console.log("after",combinedArray)

  const _name = users && users.map((v,e)=>{if(v.add==address){return v.name}})
 // users && console.log("id", _name[0]);
  return (
    //data &&
    //combinedArray && 
    (
      <div
        //cz-shortcut-listen="true"
        class="snipcss-qdNqy"
      >
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

          <div class="lg:pl-72">
            <Search selected={selected} setSelected={setSelected} />

            <main
              style={{
                backgroundImage: `url("./assets/backg.png") !important`,
                marginLeft: isMobile ? "-23px" : "",
              }}
              class="py-10 relative"
            >
              <div 
              
              style={{height:"200px"}} 
              //class="px-4 sm:px-6 lg:px-8 mx-auto"
              >
                <ChartT />
                <div class="flex flex-col xl:flex-row gap-4 p-4 relative">
                  <div class="flex-grow">
                    <div class=" opacity-80">
                      {/* <iframe
                        src="https://dexscreener.com/base/0xbE90C8602e710156f45Cc046BE4256a312Fe882a?embed=1&amp;theme=dark&amp;info=0"
                        allowfullscreen=""
                        class="w-full"
                      >
                        {" "}
                      </iframe> */}
                    </div>
                    <div
                      style={{
                        width: "80%",
                        borderBottom: "1px solid white",
                        marginTop: "35px",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <ul
                        style={{
                          display: "flex",
                          listStyle: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <li
                          onClick={() => {
                            setChatTrade("chat");
                          }}
                          style={{
                            marginRight: "20px",
                            color: chatTrade == "chat" ? "#F76F0B" : "white",
                          }}
                        >
                          Chat
                        </li>
                        <li
                          style={{
                            color: chatTrade == "trade" ? "#F76F0B" : "white",
                          }}
                          onClick={() => {
                            setChatTrade("trade");
                          }}
                        >
                          Trades
                        </li>
                      </ul>
                    </div>

                    {chatTrade == "chat" ? (
                      <div class="mt-5 max-w-[600px]">
                        <div>
                          {chatData &&
                            chatData.map((v, e) => (
                              <div class="mt-5 border border-gray-600 p-3 rounded-md">
                                <div class="flex items-center justify-left">
                                  <img
                                    src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${state.data[9][4]}`}
                                    class="rounded-full h-8 w-8"
                                    alt="Token Image"
                                  />
                                  <div class="ml-3 bg-green-300 rounded-md pl-1 pr-1 text-black">
                                    <a href={`${ethScan}${v._user}`}>
                                      {`${v._user.slice(
                                        0,
                                        4
                                      )}...${v._user.slice(-5)}`}
                                    </a>
                                  </div>
                                  <div class="ml-3 text-xs">
                                    {formatTime(v.time)}
                                  </div>
                                </div>
                                <div class="flex items-center">
                                  <div class="mt-3 text-sm font-mono overflow-hidden break-words">
                                    {v._msg}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                        <textarea
                          value={text}
                          onChange={(e) => {
                            setText(e.target.value);
                          }}
                          class="w-full h-20 mt-5 p-2 rounded-md border border-gray-300"
                          placeholder="Add a comment"
                        ></textarea>
                        <div class="flex">
                          <button
                            onClick={updateChat}
                            disabled=""
                            class="mr-5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer"
                          >
                            {toggle ? (
                              <CircularProgress sx={{ color: "white" }} />
                            ) : (
                              "Send"
                            )}
                          </button>
                          {/* <div class="mt-2">
                        <input class="mb-3" type="file" />
                      </div> */}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width:isMobile? "120%":"80%",

                          marginTop: "35px",
                          display: "block", // Changed from flex to block to stack vertically
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          <ul
                            style={{
                              width: "100%",
                              display: "flex",
                              borderBottom: "1px solid white",
                              listStyle: "none",
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            <li
                              style={{ width: "25%", boxSizing: "border-box" }}
                            >
                              Maker
                            </li>
                            <li
                              style={{ width: "10%", boxSizing: "border-box" }}
                            >
                              Type
                            </li>
                            <li
                              style={{ width: "10%", boxSizing: "border-box" }}
                            >
                              Eth
                            </li>
                            <li
                              style={{ width: "10%", boxSizing: "border-box" }}
                            >
                              Token
                            </li>
                           {!isMobile &&  <li
                              style={{ width: "20%", boxSizing: "border-box" }}
                            >
                              Date
                            </li>}
                            <li
                              style={{ width: "30%", boxSizing: "border-box",marginLeft:isMobile? "25px":"0px" }}
                            >
                              Tx
                            </li>
                          </ul>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            listStyle: "none",
                            backgroundColor: "black",
                            padding: 0,
                            margin: 0,
                            marginTop: "10px", // Add some space between the two ULs if desired
                          }}
                        >
                          {combinedArray &&
                            combinedArray.map((v, e) => {
                              return (
                                <ul
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                  }}
                                >
                                  <li
                                    style={{
                                      width: "25%",
                                      boxSizing: "border-box",
                                    }}
                                  >{`${
                                    v.data.buyer
                                      ? v.data.buyer.slice(0, 4)
                                      : v.seller.buyer.slice(0, 4)
                                  }...${
                                    v.data.buyer
                                      ? v.data.buyer.slice(-5)
                                      : v.seller.buyer.slice(-5)
                                  }`}</li>
                                  <li
                                    style={{
                                      width: "10%",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    {v.data.buyer ? "Buy" : "Sell"}
                                  </li>
                                  <li
                                    style={{
                                      width: "10%",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    {Number(wte(v.data.ethPaid)).toFixed(isMobile? 2 : 4)}
                                  </li>
                                  <li
                                    style={{
                                      width: "10%",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    {Number(wte(v.data.amount)).toFixed(0)}
                                  </li>
                                 {!isMobile && <li
                                    style={{
                                      width: "20%",
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    {timePassed(v.data.time)}
                                  </li>}
                                  <li
                                    style={{
                                      width: "30%",
                                      boxSizing: "border-box",
                                      marginLeft: isMobile? "25px" : "0px"
                                    }}
                                  ><a
                                  target="_blank"
                                  href={`${ethScanTx}${v.txHash}`}
                                  >
                                    {`${v.txHash.slice(0,6)}..${v.txHash.slice(-3)}`}
                                  </a>

                                  </li>
                                </ul>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div class="bg-white/5 px-6 py-16 ring-1 ring-white/10 sm:rounded-3xl sm:p-8 relative lg:max-w-[25rem]">
                    Created by:
                    <div class="mt-1 mb-1 text-sm">{data && users &&  _name.length>0? _name[0] : data?.owner}</div>
                    <div class="flex justify-between gap-x-6 py-5">
                      <div class="flex gap-x-4">
                        <img
                          src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${data &&  data[9][4]}`}
                          class="h-12 w-12 flex-none rounded-full bg-gray-800"
                          alt="Token Image"
                        />
                        <div class="min-w-0 flex-auto">
                          <p class="text-sm font-semibold leading-6 text-white">
                            Token:
                          </p>
                          <div class="mt-1 truncate text-xs leading-5 text-gray-400 flex gap-2">
                            <p>
                              <strong>{data &&  data[0]}</strong> ({ data && data[1]})
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="hidden sm:flex sm:flex-col sm:items-end flex-shrink-0">
                        <p class="text-sm leading-6 text-white font-semibold">
                          Socials:
                        </p>
                        <div class="mt-1 flex justify-start space-x-2">
                          <a
                            class=" text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
                            target="_blank"
                            rel="noopener noreferrer"
                            href={data &&  data[9][0]}
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
                            class="  text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
                            target="_blank"
                            rel="noopener noreferrer"
                            href={data &&  data[9][2]}
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
                            class=" text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
                            target="_blank"
                            rel="noopener noreferrer"
                            href={data &&  data[9][1]}
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
                    <p class="text-sm block mb-5 overflow-hidden break-words">
                      {data &&  data[9][3]}
                    </p>
                    <div class="mb-5">
                      Total bought:{" "}
                      {data &&  Number(formatEther(data.ethCollected)).toFixed(4)} /{" "}
                      {ethThreshold} ETH
                    </div>
                    <div class="w-full bg-neutral-600/25 rounded-md overflow-hidden shrink-0 mb-4">
                      <div
                        style={{
                          width: `${
                            (data &&  formatEther(data.ethCollected) / ethThreshold) *
                            100
                          }%`,
                        }}
                        class="bg-blue-700 p-1.5 text-center text-xs font-medium leading-none text-white style-Ff8Mx"
                        id="style-Ff8Mx"
                      >
                        {data &&  `${Number(
                          (formatEther(data.ethCollected) / ethThreshold) * 100
                        ).toFixed(2)}%`}
                      </div>
                    </div>
                    {data &&  formatEther(data.firstBuyer) == 0 ||
                    data && formatEther(data.ethCollected) >=
                      formatEther(data.firstBuyer) ||
                    data && address == data?.owner ? (
                      <div class="mt-10 bg-white/5 px-6 py-16 ring-1 ring-white/10 rounded-3xl sm:p-8 relative">
                        <div class="flex items-center justify-between gap-5">
                          <button
                            style={isMobile ? { width: "45%" } : {}}
                            onClick={() => {
                              setBuySale("Buy");
                              setExpectedEth(0);
                            }}
                            class={`btn btn-wide bg-green-500 p-2 rounded-md text-black font-bold w-32 ${
                              buySale == "Sale" ? "opacity-20" : ""
                            } `}
                          >
                            Buy
                          </button>
                          <button
                            style={isMobile ? { width: "45%" } : {}}
                            onClick={() => {
                              setBuySale("Sale");
                              setTokenstoMint(0);
                            }}
                            class={`btn btn-wide bg-red-500 p-2 rounded-md text-black font-bold w-32 ${
                              buySale == "Buy" ? "opacity-20" : ""
                            } `}
                          >
                            Sell
                          </button>
                        </div>
                        <div class="flex items-center w-full max-w-xs mt-5 bg-[#282c33] border border-gray-300 rounded">
                          <input
                            style={isMobile ? { width: "40%" } : {}}
                            placeholder="0.00"
                            class="input input-bordered flex-grow p-2 rounded-l focus:outline-none"
                            type="text"
                            value={amount}
                            onChange={(e) => {
                              setAmount(e.target.value);
                            }}
                          />
                          <span class="p-2 bg-[#282c33] rounded-r border-l">
                            {buySale == "Buy" ? "ETH" : `${tokenName}`}
                          </span>
                        </div>
                        {buySale == "Sale" ? (
                          <div>
                            <button
                              onClick={() => {
                                setAmount(tokenBalance * 0.25);
                              }}
                              style={{ marginLeft: "10%", fontWeight: "bold" }}
                            >
                              25%
                            </button>
                            <button
                              onClick={() => {
                                setAmount(tokenBalance * 0.5);
                              }}
                              style={{ marginLeft: "10%", fontWeight: "bold" }}
                            >
                              50%
                            </button>
                            <button
                              onClick={() => {
                                setAmount(tokenBalance * 0.75);
                              }}
                              style={{ marginLeft: "10%", fontWeight: "bold" }}
                            >
                              75%
                            </button>
                            <button
                              onClick={() => {
                                setAmount(tokenBalance * 1);
                              }}
                              style={{ marginLeft: "10%", fontWeight: "bold" }}
                            >
                              100%
                            </button>
                          </div>
                        ) : null}
                        <div class="ml-2 mt-2 text-sm font-bold ">
                          {buySale == "Buy"
                            ? `You will get ${fN(tokensToMint, 2)} tokens`
                            : `you will get ${Number(expectedEth).toFixed(
                                6
                              )} eth`}
                        </div>
                        <button
                          style={isMobile ? { width: "100%" } : {}}
                          onClick={buySale == "Buy" ? buyFunc : saleFunc}
                          class={`btn btn-wide w-full max-w-xs mt-4 text-black ${
                            buySale == "Buy"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          } `}
                          disabled=""
                        >
                          {toggle ? (
                            <CircularProgress
                              sx={{ color: "white" }}
                            ></CircularProgress>
                          ) : (
                            buySale
                          )}
                        </button>
                      </div>
                    ) : (
                      <p>The Deployer is the first buyer</p>
                    )}
                    <div class="flex justify-center pt-10 w-full">
                      <div class="w-full max-w-2xl px-4">
                        <h1 class="text-center text-xl font-bold mb-4">
                          Holders
                        </h1>
                        <div>
                          {holders &&
                            holders.map((v, e) => (
                              <div class="text-sm flex justify-between pb-2 pt-2 border-gray-600 border-b last:border-b-0">
                                <div class="text-left flex items-center">
                                  <img
                                    src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${state.data[9][4]}`}
                                    class="rounded-full h-8 w-8 mr-2"
                                    alt="Token Image"
                                  />
                                  <a
                                    target="_blank"
                                    href={`${ethScan}${v.holder}`}
                                    class="   text-[#FFB921] hover:underline font-bold  "
                                  >
                                    {`${v.holder.slice(
                                      0,
                                      4
                                    )}...${v.holder.slice(-5)}`}
                                  </a>
                                </div>
                                <div class="text-yellow-400 font-bold text-left">
                                  {v.balance == "0"
                                    ? "0"
                                    : (
                                        Number(
                                          formatEther(v.balance) / supply
                                        ) * 100
                                      ).toFixed(2)}{" "}
                                  %
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div
                      class="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
                      aria-hidden="true"
                    >
                      <div
                        class="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25 style-LvWI6"
                        id="style-LvWI6"
                      ></div>
                    </div>
                  </div>
                  <div
                    class="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
                    aria-hidden="true"
                  >
                    <div
                      class="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25 style-7XatY"
                      id="style-7XatY"
                    ></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  );
}
