import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { connectWallet, initialize } from './ethereum/web3';
//import contractLottery from "./ethereum/abis/Lottery.json"
import contractMain from "./ethereum/abis/Main.json";

function App() {

  const [contract,setContract]= useState<any>('')

  const [address,setAddress] = useState<any>('')
  const [message, setMessage] = useState<any>('')

  const [Add1,setAdd1] = useState<any>('')
  const [TokQuan1,setTokQuan1] = useState<any>('')
  const [EthQuant1,setEthQuan1] = useState<any>('')

  const [Add2,setAdd2] = useState<any>('')

  const [TokQuan4,setTokQuan4] = useState<any>('')

  const [TokQuan6,setTokQuan6] = useState<any>('')

  const [supply,setSupply] = useState<any>('')


  useEffect(() => {
    //@ts-ignore
    if(window.web3) {
      initialize()
      loadBlockChainData()
    }
  },[])

  const loadBlockChainData = async () => {
    //@ts-ignore
    const Web3 = window.web3
    //const contractDeployed = new Web3.eth.Contract(contractMain,address)
    // This is for testing
    // const networkData = contractMain.networks['5777'];
    // if(networkData){
    //   const abi = contractMain.abi
    //   const address = networkData.address;

    //   const contractDeployed = new Web3.eth.Contract(abi, address);
    //   setAddress(await contractDeployed.methods.getContractAddress().call())
    //   setMessage("Bienvenido!")
    //   setContract(contractDeployed)
    // }

    const abi = contractMain.abi;
    const contractDeployed = new Web3.eth.Contract(abi, '0x4F9Ba49Ad55d0f5E46E67B88c000b466a5F58C5B');
    setAddress(await contractDeployed.methods.getContractAddress().call())
    setMessage("Bienvenido!")
    setContract(contractDeployed)

  }

  const onBuyTokens = async () => {
    // @ts-ignore
    const Web3 = window.web3;
    const accounts = await Web3.eth.getAccounts()
    setMessage("Compra en progreso...")
    await contract.methods.buyTokens(Add1,TokQuan1).send({
      from:accounts[0],
      value:Web3.utils.toWei(EthQuant1,"ether")
    })
    setMessage("Compra Exitosa!")

  }

  const onGenerateTokens = async () => {
    // @ts-ignore
    const Web3 = window.web3;
    const accounts = await Web3.eth.getAccounts()
    setMessage("Creando más tokens...")
    await contract.methods.generetaTokens(TokQuan4).send({
      from:accounts[0],
    })
    setMessage("Se añadieron NATY-COINS Exitosamente!")
  }

  const onGetSupply = async () => {
    setMessage("Consiguiendo el balance de NATY-COINS en total...")
    setSupply(await contract.methods.getTotalSupply().call())
    setMessage("Balance total obtenido")
  }

  const onGetAccountBalance = async () => {
    setMessage("Consiguiendo el balance de la cuenta...")

    setMessage("El balance de esa cuenta es: "+await contract.methods.balanceAccount(Add2).call())
  }

  const onGetPrice = async () =>{
    setMessage("El precio de "+TokQuan6+" NATY-COINS es de "+await contract.methods.priceTokens(TokQuan6).call()/1000000000000000000+" ETH")
  }


  return (
      <div className="App">
        <header className="App-header">
          <h1>NATY-COIN</h1>
          <button className="btn btn-primary" onClick={()=>connectWallet()}>Connect</button>
          <img src={logo} className="App-logo" alt="logo" />
          {/*1.*/}
          <p>{message}</p>
          <h2>Comprar NATY-COIN</h2>
          <div className="form-group" >

            <input type="text" className="form-control" id="buyAdd" placeholder="Dirección de destino" value={Add1} onChange={ (event) => { setAdd1(event.target.value) } }/>
            <input type="text" className="form-control" id="buyToken" placeholder="Tokens a comprar" value={TokQuan1} onChange={ (event) => { setTokQuan1(event.target.value) } }/>
            <input type="text" className="form-control" id="buyToken" placeholder="Eth a pagar 1Toke=1Eth" value={EthQuant1} onChange={ (event) => { setEthQuan1(event.target.value) } }/>
          </div>
          <button type="button" className="btn btn-danger" onClick={()=>onBuyTokens()}>COMPRAR NATY-COIN</button>
          {/*2.*/}
          <div>---------------------------------------------</div>
          <h2>Balance de NATY-COIN de un usuario</h2>
          <div className="form-group" >
            <input type="text" className="form-control" id="balanceAdd" placeholder="Dirección del usuario" value={Add2} onChange={ (event) => { setAdd2(event.target.value) } }/>
          </div>
          <button type="button" className="btn btn-danger" onClick={()=>onGetAccountBalance()}>BALANCE DE NATY-COIN</button>

          {/*3.*/}
          <div>---------------------------------------------</div>
          <h2>Balance total de NATY-COIN del Smart Contract: {supply}</h2>
          <button type="button" className="btn btn-danger" onClick={()=>onGetSupply()}>BALANCE DE NATY-COIN</button>
          {/*4.*/}
          <div>---------------------------------------------</div>
          <h2>Añadir nuevos NATY-COINS</h2>
          <div className="form-group" >
            <input type="text" className="form-control" id="balanceAdd" placeholder="Cantidad a aumentar" value={TokQuan4} onChange={ (event) => { setTokQuan4(event.target.value) } }></input>
          </div>
          <button type="button" className="btn btn-danger"  onClick={()=>onGenerateTokens()}>INCREMENTAR NATY-COINS</button>
          {/*5.*/}
          <div>---------------------------------------------</div>
          <h2>Dirección del Smart Contract en RINKEBY</h2>
          <h4>{address}</h4>
          {/*6.*/}
          <div>---------------------------------------------</div>
          <h2>Calcular precio de NATY-COINS en ETH</h2>
          <div className="form-group" >
            <input type="text" className="form-control" id="balanceAdd" placeholder="Cantidad de NATY-COINS" value={TokQuan6} onChange={ (event) => { setTokQuan6(event.target.value) } }></input>
          </div>
          <button type="button" className="btn btn-danger" onClick={()=>onGetPrice()}>CALCULAR PRECIO</button>

          {/* <button type="button" className="btn btn-primary" onClick={()=>onPickWinner()}>Pick Winner</button> */}
        </header>
      </div>
  );
}
export default App;