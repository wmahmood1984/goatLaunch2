import React, { useEffect, useState } from "react";
import { LaunchAbi, LaunchAddress, defaultRpc, defualtChain } from "../config";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import Web3 from "web3";
import { formatEther } from "ethers";
import { Link } from "react-router-dom";

export default function LeaderBoard() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const wchain = chainId ? chainId : defualtChain;
  const web3 = new Web3(new Web3.providers.HttpProvider(defaultRpc));
  const contractR = new web3.eth.Contract(LaunchAbi, LaunchAddress);
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  useEffect(() => {
    const abc = async () => {
      const _data = await contractR.methods.getTokens().call();
      setData(_data);

      const sorted = _data.sort(
        (a, b) => Number(b.ethCollected) - Number(a.ethCollected)
      );
      setFilteredData(sorted);
    };

    abc();
  }, [address]);

  console.log("leader", filteredData);
  return (
    filteredData && (
      <main class="py-10 px-4 sm:px-6 lg:px-8 mx-auto relative snipcss-L6HsX">
        <div class="">
          <div class="flex justify-center pt-10 w-full">
            <div class="w-full max-w-2xl px-4">
              <h1 class="text-center text-2xl font-bold mb-4">Leaderboard</h1>
              <div>
                {filteredData.map((v, e) => (
                  <div class="flex justify-between px-2 py-4 border-b last:border-b-0">
                    <div class="text-left flex items-center">
                      <img
                        src={`https://aquamarine-confident-planarian-104.mypinata.cloud/ipfs/${v[9][4]}`}
                        class="rounded-full h-8 w-8 mr-2 cursor-default"
                        alt="Token Image"
                      />
                      🥇{" "}
                      <Link
                                to={`details/${v[10]}`}
                        class="   text-[#FFB921] hover:underline font-bold  "
                        href="profile?address=0x9f2F31d1d4cba2D61F457378EFD9F082307949eD"
                      >
                        {v[0]}
                      </Link>
                    </div>
                    <div class="text-yellow-400 font-bold text-left">
                      {Number(formatEther(v.ethCollected)).toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  );
}
