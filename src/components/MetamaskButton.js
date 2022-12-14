import { useMetaMask } from "metamask-react";
import {Button, Text} from 'grommet';
import {ethers} from 'ethers';
import {useState} from 'react';

function MetamaskButton(){
  const { status, connect, account, chainId, ethereum, switchChain} = useMetaMask();
  const[balance, setBalance] = useState(0);

  if (status === "unavailable") return <Text size="16px"><a target="_blank" href="https://metamask.io/">Install Metamask</a></Text>

  if (status === "notConnected") return <Button onClick={connect} label="Connect to MetaMask"/>

  if (status === "connecting" || status === "initializing") return <Text size="16px">Loading...</Text>

  if (status === "connected"){
    if(chainId === process.env.REACT_APP_CHAIN_ID) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");

      // get balance in ETH
      provider.getBalance(account).then(result=> setBalance(ethers.utils.formatEther(result)));
      return <Text size="16px">Connected to {account}, balance: {balance} ETH</Text>
    }else{
      return <Text size="16px">Wrong chain! <Button label="switch to goerli network" onClick={()=>switchChain(process.env.REACT_APP_CHAIN_ID)} /></Text>
    }
  }

  return null;
}

export default MetamaskButton;
