import {Anchor, Nav, Header as HeaderBlock} from 'grommet';
import MetamaskButton from './MetamaskButton';
import {useMetaMask} from 'metamask-react';

function Header() {
  const {status} = useMetaMask();
  return (
      <HeaderBlock pad="small">
        <Nav direction="row" gap="medium">
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
