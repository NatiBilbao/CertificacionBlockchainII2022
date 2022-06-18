import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { connectWallet, initialize } from './ethereum/web3';
import contractLottery from "./ethereum/abis/Lottery.json"

function App() {

  const [contract,setContract]= useState<any>('')
  const [manager,setManager]= useState<any>('')
  const [players,setPlayers]= useState<any>([])
  const [balance,setBalance]= useState<any>('')


  useEffect(() => {
    //@ts-ignore
    if(window.web3) {
      initialize()
      loadBlockChainData()
    }
  },[])

  const loadBlockChainData = async ()=> {
    //@ts-ignore
    const Web3 = window.web3
    const networkData = contractLottery.networks['5777']
    console.log("Network Data: ",networkData)

    if(networkData){
      const abi = contractLottery.abi
      const address = networkData.address
      console.log('address: ', address)
      const contractDeployed = new Web3.eth.Contract(abi,address)
      console.log(contractDeployed.methods.getPlayers().call())
     
      const players = await contractDeployed.methods.getPlayers().call();
      setPlayers(players)

      const manager = await contractDeployed.methods.manager().call()
      setManager(manager)

      const balance = await Web3.eth.getBalance(contractDeployed.options.address)
      setBalance(balance)

      setContract(contractDeployed)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Truffle, Firebase, React
        </p>
        <button onClick={()=>connectWallet()}>Connect</button>
        <p>Players: {players.length}</p>
        <p>Balance: {balance}</p>
        <p>Manager: {manager}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Truffle, Firebase, React
        </a>
      </header>
    </div>
  );



}

export default App;
