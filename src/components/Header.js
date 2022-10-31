import {Anchor, Nav, Header as HeaderBlock} from 'grommet';
import MetamaskButton from './MetamaskButton';
import {useMetaMask} from 'metamask-react';

function Header() {
  const {status} = useMetaMask();
  return (
      <HeaderBlock background="light-3" pad="small">
        <Nav direction="row" gap="medium" pad={{horizontal: 'large'}}>
          <Anchor label="Home" href="/"/>
          <Anchor label="Marketplace" href="/marketplace"/>
          {status === "connected"?<Anchor label="My items" href="/my-items"/>: null}
          <div>
            <MetamaskButton/>
          </div>
        </Nav>
      </HeaderBlock>
  );
}

export default Header;
