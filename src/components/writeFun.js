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
    return parseEther(v)
}

export const wte = (v)=>{
    return formatEther(v)
}

export const fN = (x,d)=> {

    var y = Number(x).toFixed(d)

    var z =  y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return z
}




