import {useMetaMask} from 'metamask-react';
import {Button, TextInput} from 'grommet';
import {ethers} from 'ethers';
import wod from '../abi/wodToken.json';
import {useState} from 'react';

function Home() {
  let {status, chainId, ethereum} = useMetaMask();
  let [loading, setLoading] = useState(false);
  let [receiver, setReceiver] = useState('');

  const buyNFT = async (receiver = '') => {
    if (status === 'connected' && chainId === process.env.REACT_APP_CHAIN_ID) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum, 'any');
        const signer = provider.getSigner();
        const wodTokenContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, wod.abi, signer);
        const initialTokenPrice = await wodTokenContract.INITIAL_PRICE();

        if (receiver === '') {
          // call buy method this way because there are multiple functions with the same name
          let tx = await wodTokenContract['buy()']({value: initialTokenPrice});
          console.log(tx);
        } else {
          let tx = await wodTokenContract['buy(address)'](receiver, {value: initialTokenPrice});
          console.log(tx);
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    } else {
      alert('please switch to Goerli test network and refresh the page');
    }
  };

  return (
      <div>
        <p>Get access to behind-the-scenes content by becoming a virtual band member and get to see some exclusive footage from rehearsals, backstage access, pre-release listening sessions and so on! </p>
        <Button disabled={loading} label="Buy" onClick={()=>buyNFT("")}/>

        <p>... or buy for a friend</p>

        <TextInput
            placeholder="0x..."
            value={receiver}
            onChange={event => setReceiver(event.target.value)}
            style={{marginBottom: "10px"}}
        />
        <Button disabled={loading} label="Buy" onClick={() => buyNFT(receiver)}/>
      </div>
  );
}

export default Home;
