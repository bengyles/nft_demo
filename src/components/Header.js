import {Anchor, Nav, Header as HeaderBlock} from 'grommet';
import MetamaskButton from './MetamaskButton';

function Header() {
  return (
      <HeaderBlock background="light-3" pad="small">
        <Nav direction="row" gap="medium" pad={{horizontal: 'large'}}>
          <Anchor label="Home" href="/"/>
          <Anchor label="Marketplace" href="/marketplace"/>
          <Anchor label="My items" href="/my-items"/>
          <div>
            <MetamaskButton/>
          </div>
        </Nav>
      </HeaderBlock>
  );
}

export default Header;
