import {Anchor, Nav, Header as HeaderBlock, Box} from 'grommet';
import MetamaskButton from './MetamaskButton';
import {useMetaMask} from 'metamask-react';

function Header() {
  const {status} = useMetaMask();
  return (
      <HeaderBlock  pad="small">
        <Nav direction="row" gap="medium" alignSelf="stretch" flex={true}>
          <Anchor label="Home" href="/"/>
          <Anchor label="Marketplace" href="/marketplace"/>
          <Anchor label="Vault" href="/vault"/>
          {status === "connected"?<Anchor label="My items" href="/my-items"/>: null}
        </Nav>
        <Box align="end">
          <MetamaskButton/>
        </Box>
      </HeaderBlock>
  );
}

export default Header;
