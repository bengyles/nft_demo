import {useMetaMask} from 'metamask-react';
import {Button, Box, DataTable, Text, Spinner} from 'grommet';
import {ethers} from 'ethers';
import wod from '../abi/wodToken.json';
import {useEffect, useState} from 'react';

function Marketplace() {
  let {status, chainId, ethereum} = useMetaMask();
  let [txLoading, setTxLoading] = useState(false);
  let [itemsLoading, setItemsLoading] = useState(false);
  let [items, setItems] = useState([]);
  const columns = [
    {property: 'tokenId', primary: true, header: <Text>Token ID</Text>},
    {property: 'owner', header: <Text>Owner</Text>},
    {property: 'askPrice', header: <Text>Price</Text>},
    {property: 'forSale', header: <Text></Text>, render: (item) => <Button disabled={item.forSale == false} label="buy" onClick={()=> tradeNFT(item)}/>},
  ];

  useEffect(() => {
    if (status === 'connected') {
      loadTokens();
    }
  }, [status]);

  const loadTokens = async () => {
    setItemsLoading(true);
    let tokens = [];
    try {
      //ToDo: load items even when metamask is not connected, use configured web3 endpoint instead
      const provider = new ethers.providers.Web3Provider(ethereum, 'any');
      const wodTokenContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, wod.abi, provider);
      const supply = await wodTokenContract.totalSupply();

      for (let i = 0; i < supply; i++) {
        const {askPrice, forSale, lastPrice} = await wodTokenContract.properties(i);
        const owner = await wodTokenContract.ownerOf(i);
        tokens.push({tokenId: i, askPrice: ethers.utils.formatEther(askPrice), forSale, lastPrice, owner});
      }

      setItems(tokens);
      console.log(tokens);

    } catch (e) {
      console.log(e);
    }
    setItemsLoading(false);
  };

  const tradeNFT = async (token) => {
    if (status === 'connected' && chainId === process.env.REACT_APP_CHAIN_ID) {
      try {
        setTxLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum, 'any');
        const signer = provider.getSigner();
        const wodTokenContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, wod.abi, signer);
        let price = ethers.utils.parseEther(token.askPrice);
        let tx = await wodTokenContract.trade(token.tokenId, {value: price});
        console.log(tx);
      } catch (e) {
        console.log(e);
      }
      setTxLoading(false);
    }
  };

  return (
      <div>
        <p>Buy a pass from someone else</p>
        {items.length > 0?<Box align="center" pad="large">
          {itemsLoading?<Spinner />: <DataTable columns={columns} data={items}/>}
        </Box>:<Text>No tokens minted yet</Text>}
      </div>
  );
}

export default Marketplace;
