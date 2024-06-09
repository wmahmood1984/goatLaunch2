import React from "react";

export default function Profile() {
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
                    href="https://basescan.org/address/0xfef5f69FA76f35638Aa3ed77a0644Fa79d31A554"
                  >
                    View in explorer
                  </a>
                  <div class="border-2 border-red-500 p-5 mb-5 rounded-md max-w-[49rem]">
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
                  </div>
                  <label class="block font-bold mb-2">Username:</label>
                  <input
                    class="mb-6 px-3 py-1.5 border rounded-md w-full max-w-[49rem] block"
                    type="text"
                    value=""
                  />
                  <input class="mb-3" type="file" />
                  <div class="basis-auto xl:basis-full">
                  <label class="block font-bold mb-2">Profile pic:</label>
                  <img
                    src="https://www.basejump.pro/_next/static/media/placeholder.b3bdd483.jpg"
                    class="w-64 h-64 object-contain mt-5 mb-5 rounded-md cursor-default"
                    alt="Token Image"
                  />
                </div>
                  <div class="my-5">
                    <button class="mr-5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer">
                      Update
                    </button>
                    <button class="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 cursor-pointer">
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
              <div class="-m-3">
                <div class="@container flex flex-wrap ">
                  <div class="basis-full p-3 text-center">
                    <h1>None</h1>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 my-4 mx-auto max-w-lg min-w-[20rem]">
              <h1 class="text-2xl text-center mb-5">Latest created tokens</h1>
              <div class="-m-3">
                <div class="@container flex flex-wrap ">
                  <div class="basis-full p-3 text-center">
                    <h1>None</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
