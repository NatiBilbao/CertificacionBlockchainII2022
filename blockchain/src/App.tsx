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
  const [value,setValue] = useState<any>('')
  const [message, setMessage] = useState<any>('')


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
     
      
     
      const manager = await contractDeployed.methods.manager().call()
      setManager(manager)
      const players = await contractDeployed.methods.getPlayers().call();
      setPlayers(players)
      const balance = await Web3.eth.getBalance(contractDeployed.options.address)
      setBalance(balance)
      

      setContract(contractDeployed)
    }
  }

  const loadBalance = async () =>{
    //@ts-ignore
    const Web3 = window.web3
    const balance = await Web3.eth.getBalance(contract.options.address)
      setBalance(balance)
  }

  const loadPlayers = async () =>{
    const players = await contract.methods.getPlayers().call();
      setPlayers(players)
  }

  const onEnter = async () =>{
    //@ts-ignore
    const Web3 = window.web3
    const accounts = await Web3.eth.getAccounts()

    setMessage("waiting on transaction success...")

    await contract.methods.enter().send({
      from:accounts[0],
      value:Web3.utils.toWei(value,"ether")
    })

    setMessage("You've entered the game...")
    loadBalance()
    loadPlayers()
  }

  const onPickWinner= async ()=>{
    //@ts-ignore
    const Web3 = window.web3
    const accounts = await Web3.eth.getAccounts()
    setMessage("And the winner is...")
    await contract.methods.pickWinner().send({
      from:accounts[0]
    })

    setMessage("A winner has been picked!")
    loadBalance()
    loadPlayers()
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Truffle, Firebase, React
        </p>
        <button type="button" className="btn btn-warning" onClick={()=>connectWallet()}>Connect</button>
        <button type="button"  className="btn btn-primary" onClick={()=>onPickWinner()}>Pick Winner</button>
        <p>Players: {players.length}</p>
        <p>Balance: {balance}</p>
        <p>Manager: {manager}</p>
        <p>Monto Minimo 2 ETH</p>
        <input type="text" value={value} onChange={ (event) => {setValue(event.target.value)}}></input>
        <button  className="btn btn-primary" onClick={ () => {onEnter()}}>Enter</button>
        <p>{message}</p>
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
