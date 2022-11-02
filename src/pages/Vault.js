import {useMetaMask} from 'metamask-react';
import {Spinner, Text, Box, Page} from 'grommet';
import {ethers} from 'ethers';
import wod from '../abi/wodToken.json';
import {useEffect, useState} from 'react';

function Home() {
  let {status, chainId, ethereum, account} = useMetaMask();
  let [loading, setLoading] = useState(true);
  let [permission, setPermission] = useState(false);

  useEffect(() => {
    // load the NFTs once connected because metamask is not initialized yet on initial page load
    if (status === 'connected') {
      loadPermission();
    }
  }, [status]);

  const loadPermission = async () => {
    setLoading(true);
    if (status === 'connected' && chainId === process.env.REACT_APP_CHAIN_ID) {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any');
        const wodTokenContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, wod.abi, provider);

        // get the amount of tokens belonging to the current user
        const numTokens = await wodTokenContract.balanceOf(account);

        if(numTokens > 0){
          setPermission(true);
        }

      } catch (e) {
        console.log(e);
      }
    } else {
      alert('please switch to Goerli test network and refresh the page');
    }

    setLoading(false);
  };

  return (
      <Page>
        {status !== "connected" && <Text>Please to connect metamask</Text>}
        {loading ? <Box align="center" pad="large"><Spinner size="large"/></Box> :
            permission ?
                <div>
                  <p>Welcome to our vault! You have special permissions to view our behind-the-scenes extras, keep an eye out for new content because we will be adding more soon. For now checkout our music video for "The Hurricane (Of Life)". Thank you for supporting us and enjoy!</p>
                  <Box align="center">
                    <iframe width="640" height="390" src="https://www.youtube.com/embed/qFVNJUQMLLo" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></Box>
                </div>
                : <Text>You don't have permission to view our insider club extras :( </Text>
        }
      </Page>
  );
}

export default Home;
