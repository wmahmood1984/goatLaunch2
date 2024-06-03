import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";
import { ethers, formatEther } from "ethers";
import { useMediaQuery } from 'react-responsive'

export default function Card({ v, ethThreshold }) {
  
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  return (
    <div 
    style={isMobile? {maxWidth:"100%",marginRight:"2%",marginTop:"2%"}:{}}
    className={isMobile ? "":"block bg-neutral-600/25 rounded-3xl overflow-hidden shrink-0 flex-1 p-8 sm:min-w-[20rem] snipcss-t3jpt"}
    >
      <div class="flex gap-x-4 mt-1 justify-center">
        <Link
          to={`details/${v[10]}`}
          state={{ data: v }}
          class="  truncate text-3xl text-green-400  text-[#FFB921] hover:underline font-bold  "
          href="viewpresale?tokenAddress=0x91DeB06aA91d13A5ab572e62495FeceA2c8053Ac"
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
          <span class="ml-1">19</span>
        </div> */}
      </div>
      <div class="flex justify-between mb-5">
        <div class="flex gap-x-4">
          <div class="min-w-0 flex-auto">
            <div class="mt-1">
              <div class="text-sm">
                {formatEther(v.ethCollected)} / {ethThreshold} ETH
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:items-end flex-shrink-0">
          <div class="mt-1 flex justify-start space-x-2">
            <a
              class="  text-white hover:text-blue-500  text-[#FFB921] hover:underline font-bold  "
              target="_blank"
              rel="noopener noreferrer"
              href={v[9][0]}
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
              href={v[9][2]}
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
              (formatEther(v.ethCollected) / ethThreshold) * 100
            }%`,
          }}
          class="bg-blue-700 p-1.5 text-center text-xs font-medium leading-none text-white style-HciqI"
          id="style-HciqI"
        >
          {`${
            (formatEther(v.ethCollected) / ethThreshold) * 100
          }%`}
        </div>
      </div>
      <a
        class=" mt-1 truncate text-xs leading-5 text-gray-400  text-[#FFB921] hover:underline font-bold  "
        href="/viewpresale?tokenAddress=0xff13b7C5342d1540DF5BFb8Ad9e0f852Ef459520"
      >
        <div class="relative p-[2px] group flex flex-1 shrink-0">
          <div
            class="absolute inset-0 rounded-lg z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)] style-fdXqC"
            id="style-fdXqC"
          ></div>
          <div
            class="absolute inset-0 rounded-lg z-[1] will-change-transform bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)] style-D9jZy"
            id="style-D9jZy"
          ></div>
          <div class="z-10 relative w-full rounded-lg bg-black/75 overflow-hidden h-[15rem]">
            <img
              src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${v[9][4]}`}
              class="absolute left-0 top-0 right-0 bottom-0 m-auto rounded-lg w-1/2 z-index-1"
              alt="Token Image"
            />
            <img
              src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${v[9][4]}`}
              class="absolute left-0 top-0 right-0 bottom-0 m-auto rounded-lg -z-index-10 opacity-5"
              alt="Token Image"
            />
          </div>
        </div>
      </a>
      <Link
        class=" flex text-lg text-white font-bold bg-black/25 hover:bg-black/50 p-3 rounded-md mt-5 w-full text-center justify-center undefined "
        to={`details/${v[10]}`}
        state={{ data: v }}
      >
        View
      </Link>
    </div>
  );
}
