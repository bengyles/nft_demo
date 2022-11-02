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

  // set the columns for the grid
  const columns = [
    {property: 'tokenId', primary: true, header: <Text>Token ID</Text>, size: 'small'},
    {property: 'owner', header: <Text>Owner</Text>, size: 'large'},
    {property: 'askPrice', header: <Text>Price</Text>, size: 'small'},
    {property: 'forSale', header: <Text></Text>, size: 'small', render: (item) => <Button disabled={item.forSale == false} label="buy" onClick={()=> tradeNFT(item)}/>},
    {property: '', header: <Text></Text>, render: (item)=> <Text></Text>}
  ];

  useEffect(() => {
    // load the NFTs once connected because metamask is not initialized yet on initial page load
    if (status === 'connected') {
      loadTokens();
    }
  }, [status]);

  const loadTokens = async () => {
    setItemsLoading(true);
    let tokens = [];
    try {
      if (status === 'connected' && chainId === process.env.REACT_APP_CHAIN_ID) {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any');
        const wodTokenContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, wod.abi, provider);

        // get the amount of tokens in existance
        const supply = await wodTokenContract.totalSupply();

        // loop through all the tokens and get their information
        for (let i = 0; i < supply; i++) {
          const {askPrice, forSale, lastPrice} = await wodTokenContract.properties(i);
          const owner = await wodTokenContract.ownerOf(i);
          tokens.push({tokenId: i, askPrice: ethers.utils.formatEther(askPrice), forSale, lastPrice, owner});
        }

        setItems(tokens);
        console.log(tokens);
      }else{
        alert("please switch to Goerli test network and refresh the page");
      }

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
    }else{
      alert("please switch to Goerli test network and refresh the page");
    }
  };

  return (
      <div>
        <Text>You can purchase passes from our community, when you do a small fee will go to the band for extra support.</Text>
        {items.length > 0?<Box pad={{top: "medium"}}>
          {itemsLoading?<Spinner />: <DataTable size="small" columns={columns} data={items}/>}
        </Box>:<p>No passes available yet</p>}
      </div>
  );
}

export default Marketplace;
