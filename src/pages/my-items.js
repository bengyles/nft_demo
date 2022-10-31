import {useMetaMask} from 'metamask-react';
import {Button, Box, DataTable, Text, Spinner, Layer, TextInput} from 'grommet';
import {ethers} from 'ethers';
import wod from '../abi/wodToken.json';
import {useEffect, useState} from 'react';

function MyItems() {
  let {status, chainId, ethereum, account} = useMetaMask();
  let [txLoading, setTxLoading] = useState(false);
  let [itemsLoading, setItemsLoading] = useState(false);
  let [items, setItems] = useState([]);
  let [sellModalOpen, setSellModalOpen] = useState(false);
  let [askPrice, setAskPrice] = useState("0");
  let [currentToken, setCurrentToken] = useState(0);
  const columns = [
    {property: 'tokenId', primary: true, header: <Text>Token ID</Text>, size: 'small'},
    {property: 'askPrice', header: <Text>Price</Text>, size: 'small'},
    {property: 'forSale', header: <Text></Text>, size: 'small', render: (item) => item.forSale?<Button label="Cancel sale" onClick={()=> cancelSell(item)} />:<Button label="Sell" onClick={()=>openModal(item)} /> },
    {property: '', header: <Text></Text>, render: (item)=> <Text></Text>}
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
      const provider = new ethers.providers.Web3Provider(ethereum, 'any');
      const wodTokenContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, wod.abi, provider);
      const supply = await wodTokenContract.balanceOf(account);

      for (let i = 0; i < supply; i++) {
        const tokenId = await wodTokenContract.tokenOfOwnerByIndex(account, i);
        const {askPrice, forSale, lastPrice} = await wodTokenContract.properties(tokenId);
        tokens.push({tokenId: parseInt(tokenId), askPrice: ethers.utils.formatEther(askPrice), forSale, lastPrice});
      }

      setItems(tokens);
      console.log(tokens);

    } catch (e) {
      console.log(e);
    }
    setItemsLoading(false);
  };

  const openModal = async(token)=>{
    setCurrentToken(token);
    setSellModalOpen(true);
    setAskPrice(token.askPrice.toString());

  }

  const sellNFT = async (token) => {
    if (status === 'connected' && chainId === process.env.REACT_APP_CHAIN_ID) {
      try {
        setTxLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum, 'any');
        const signer = provider.getSigner();
        const wodTokenContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, wod.abi, signer);
        let newPrice = ethers.utils.parseEther(askPrice);
        let tx = await wodTokenContract.sell(token.tokenId, newPrice);
        console.log(tx);
        setSellModalOpen(false);
      } catch (e) {
        console.log(e);
      }
      setTxLoading(false);
    }
  };

  const cancelSell = async (token) => {
    if (status === 'connected' && chainId === process.env.REACT_APP_CHAIN_ID) {
      try {
        setTxLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum, 'any');
        const signer = provider.getSigner();
        const wodTokenContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, wod.abi, signer);
        let tx = await wodTokenContract.setForSale(token.tokenId, false);
        console.log(tx);
      } catch (e) {
        console.log(e);
      }
      setTxLoading(false);
    }
  };

  return (
      <div>
        {status === "connected" ? <div>
          <Text>These passes are yours, you can sell them or remove from sale. When you put them up for sale you can also set the price, though it has to be less than 110% of your buy price.</Text>
          {items.length > 0?<Box pad={{top: "medium"}}>
            {itemsLoading?<Spinner />: <DataTable size="small" columns={columns} data={items}/>}
          </Box>:<Text>You don't have any passes yet</Text>}
        </div> : <Text>Connect Metamask to see your NFTs</Text>}
        {sellModalOpen && (
            <Layer onEsc={()=>setSellModalOpen(false)} onClickOutside={()=>setSellModalOpen(false)}>
              <TextInput
                  value={askPrice}
                  onChange={event => setAskPrice(event.target.value)}
              />
              <Button label="Submit" onClick={() => sellNFT(currentToken)} />
              <Button label="Cancel" onClick={() => setSellModalOpen(false)} />
            </Layer>
        )}
      </div>
  )
}

export default MyItems;
