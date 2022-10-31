import './App.css';
import {Grommet, Box} from 'grommet';
import {theme} from './util/theme.js';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import MyItems from './pages/my-items'
import Header from './components/Header'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

function App() {
  return (
      <Grommet className="App" theme={theme}>
        <Router>
          <Header />
          <Box
              direction="row"
              pad="medium"
          >
            <Switch>
              <Route path="/marketplace">
                <Marketplace />
              </Route>
              <Route path="/my-items">
                <MyItems />
              </Route>
              <Route path="/">
                <Home/>
              </Route>
            </Switch>
          </Box>
        </Router>
      </Grommet>
  );
}

export default App;
