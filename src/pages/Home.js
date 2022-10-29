import {useMetaMask} from 'metamask-react';
import {Button} from 'grommet';
import {ethers} from 'ethers';
import wod from '../abi/wodToken.json'
import {useState} from 'react';

function Home() {
  let {status, chainId, ethereum} = useMetaMask();
  let [loading, setLoading] = useState(false);
  const buyNFT = async () =>{
    if(status === "connected" && chainId === process.env.REACT_APP_CHAIN_ID){
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const wodTokenContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, wod.abi, signer);
        const initialTokenPrice = await wodTokenContract.INITIAL_PRICE();
        let tx = await wodTokenContract['buy()']({value: initialTokenPrice});
        console.log(tx);
      }catch(e){
        console.log(e);
      }
      setLoading(false);
    }
  }

  return (
      <div>
        <p>Buy our backstage pass</p>
        <Button disabled={loading} primary label="Buy!" onClick={buyNFT}/>
      </div>
  );
}

export default Home;
