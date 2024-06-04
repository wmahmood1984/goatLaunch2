import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
// import { useWeb3React } from '@web3-react/core'
import { LaunchAbi, LaunchAddress, defaultRpc, defualtChain } from "../config";
import Web3 from "web3";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers";
import { SimpleDialog } from "./Modal";

export default function Sidebar({ selected, setSelected }) {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const wchain = chainId ? chainId : defualtChain;
  const web3 = new Web3(new Web3.providers.HttpProvider(defaultRpc));
  const contractR = new web3.eth.Contract(LaunchAbi, LaunchAddress);
  const [admin, setAdmin] = useState();
  const [showmodal,setshowmodal] = useState(false)

  useEffect(() => {
    const abc = async () => {
      const _admin = await contractR.methods.owner().call();
      setAdmin(_admin);
    };

    abc();
  }, [address]);
  //  console.log("data",data)

  //   console.log("sele",selected)
  const _selec =
    "bg-blue-700 text-white group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold";
  const _nonSelect =
    "text-gray-400 hover:text-white hover:bg-black/25 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold";
  return (
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 pb-4">
        <div class="flex h-32 shrink-0 items-center">
          <a href="/">
            <img
              style={{ width: "200px", height: "auto" }}
              class="h-16"
              src={logo}

            />
          </a>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li>
                  <Link
                    to="/"
                    onClick={() => {
                      setSelected(0);
                    }}
                    className={selected == 0 ? `${_selec}` : `${_nonSelect}`}
                  >
                    <span class="h-6 w-6 shrink-0" aria-hidden="true">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="house"
                        class="svg-inline--fa fa-house "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path
                          fill="currentColor"
                          d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                        ></path>
                      </svg>
                    </span>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/add"
                    onClick={() => {
                      setSelected(1);
                    }}
                    className={selected == 1 ? `${_selec}` : `${_nonSelect}`}
                  >
                    <span class="h-6 w-6 shrink-0" aria-hidden="true">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="plus"
                        class="svg-inline--fa fa-plus "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path
                          fill="currentColor"
                          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                        ></path>
                      </svg>
                    </span>
                    Create Token
                  </Link>
                </li>
                <li>
                  <Link
                    to="leaderboard"
                    className={selected == 2 ? `${_selec}` : `${_nonSelect}`}
                    onClick={() => {
                      setSelected(2);
                    }}
                    class="text-gray-400 hover:text-white hover:bg-black/25 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <span class="h-6 w-6 shrink-0" aria-hidden="true">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="trophy"
                        class="svg-inline--fa fa-trophy "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path
                          fill="currentColor"
                          d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"
                        ></path>
                      </svg>
                    </span>
                    GOATboard
                  </Link>
                </li>
                {admin && admin == address && (
                  <li>
                    <Link
                      to="/adminpanel"
                      className={selected == 3 ? `${_selec}` : `${_nonSelect}`}
                      onClick={() => {
                        setSelected(3);
                      }}
                      class="text-gray-400 hover:text-white hover:bg-black/25 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    >
                      <span class="h-6 w-6 shrink-0" aria-hidden="true">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="trophy"
                          class="svg-inline--fa fa-trophy "
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                        >
                          <path
                            fill="currentColor"
                            d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"
                          ></path>
                        </svg>
                      </span>
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
            </li>
            <li class="mt-auto">
              <ul role="list" class="-mx-2 space-y-1">
              <li>
                  <button
                    onClick={()=>{setshowmodal(true)}}
                    style={{background:"#F76F0B",marginLeft:"5%",marginBottom:"10%",borderRadius:"25px",color:"white",fontWeight:"bold",width:"150px"}}
                  >

                    How it Works
                  </button>
                </li>
                
                
                <li>
                  <a
                    href="https://x.com/goatpad_?s=11"
                    class="text-gray-400 hover:text-white hover:bg-black/25 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <span class="h-6 w-6 shrink-0" aria-hidden="true">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="twitter"
                        class="svg-inline--fa fa-twitter "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                        ></path>
                      </svg>
                    </span>
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/+PpZPlFZB4ItmODIx"
                    class="text-gray-400 hover:text-white hover:bg-black/25 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <span class="h-6 w-6 shrink-0" aria-hidden="true">
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
                    </span>
                    Telegram
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <SimpleDialog open={showmodal} onClose={()=>{setshowmodal(false)}}></SimpleDialog>
    </div>
  );
}
