import { Contract, formatEther, parseEther,  } from "ethers"

export const writeFunction = async (name,contract,functionName,callBack,callBackError,setToggle,...args)=>{
    console.log("first",...args)
    setToggle(true)
    try {
        const tx1 = await contract[`${functionName}`](...args)
        await tx1.wait()
        if(tx1){
            callBack()
        }        
    } catch (error) {
        console.log(`Error in ${name}`,error)
        callBackError()
    }
}


export const getContract = (library, account,add,abi) => {
	const signer = library?.getSigner(account).connectUnchecked();
	var contract = new Contract(add,abi, signer);
	return contract;
};

export const etw = (v)=>{
    return parseEther(v.toString())
}

export const wte = (v)=>{
    return formatEther(v.toString())
}

export const fN = (x,d)=> {

    var y = Number(x).toFixed(d)

    var z =  y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return z
}




const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

export const formatDate = (v)=>{


    const month = new Date(v*1000).getMonth()
    const lMonth = months[month]

    const date = new Date(v*1000).getDate()
    const _year = new Date(v*1000).getFullYear()


    return `${lMonth} ${date} ${_year}`
}


export const timePassed = (_time) => {
    const now = new Date().getTime() / 1000;
    const diff = now - _time;
    // console.log("diff",diff,now,_time)
    // console.log("seconds",diff/60)
    // console.log("minutes",diff/(60*60))
    // console.log("hours",diff/(60*60*24))
    if (diff / 60 < 1) {
      return "less than a minute ago";
    } else if (diff / (60 * 60) < 1) {
      return `${Math.floor(diff / 60)} minutes ago`;
    } else if (diff / (60 * 60 * 24) < 1) {
      return `${Math.floor(diff / (60 * 60))} hours ago`;
    } else {
      return `${Math.floor(diff / (60 * 60 * 24))} days ago`;
    }
  };