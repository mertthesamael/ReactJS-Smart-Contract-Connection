import './App.css';
import { ethers } from "ethers";
import erc20abi from "./ERC20abi.json";
import { useEffect, useState } from 'react';

function App() {
  const [contractInfo, setContractInfo] = useState({
    address:"-",
    tokenName:"-",
    tokenSymbol:"-",
    totalSupply:"-"
  });

  const [tsx, setTsx] = useState([])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", [])
    const erc20 = new ethers.Contract(data.get("addr"), erc20abi, provider);

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();
    
    setContractInfo({
      address: data.get("addr"),
      tokenName,
      tokenSymbol,
      totalSupply
    })

  }

  useEffect(() => {
    if (contractInfo.address !== "-"){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        erc20abi,
        provider
      );
        erc20.on("Transfer", (from, to, amount, event) => {
          console.log({from, to, amount, event })

          setTsx((currentTsx) => [
            ...currentTsx,
            {
              txHash: event.transactionHash,
              from,
              to,
              amount: String(amount)
            }
          ])
        });

    }
  },[contractInfo.address])


  return (
    <div className="App">
      <div className='wrapper container flex flex-col mx-auto justify-center items-center'>
        <h1>Hello, World !</h1>
        <form onSubmit={handleSubmit}>
          <input name="addr" type='text'></input>
          <input type='submit'></input>
        </form>
        <div className='tokeninfo'>
        <h1>{contractInfo.tokenName}</h1>
        <h1>{contractInfo.tokenSymbol}</h1>

      
        </div>
        <div className='tsx'>
          {tsx.map(tsx=> <div className='ts'><h1>{'from: ' +tsx.from}</h1><h1>{'to: ' +tsx.to}</h1> <h1>{ 'amount:'+tsx.amount/1000000000000000000 + contractInfo.tokenSymbol} </h1></div>)}
        </div>
      </div>
    </div>
  );
}

export default App;
