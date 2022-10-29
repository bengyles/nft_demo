import { useMetaMask } from "metamask-react";

function MetamaskButton(){
  const { status, connect, account, chainId } = useMetaMask();

  if (status === "unavailable") return <div><a target="_blank" href="https://metamask.io/">Install Metamask</a></div>

  if (status === "notConnected") return <button onClick={connect}>Connect to MetaMask</button>

  if (status === "connecting" || status === "initializing") return <div>Loading...</div>

  if (status === "connected"){
    return <div>Connected account {account} on chain ID {chainId}</div>
  }

  return null;
}

export default MetamaskButton;
