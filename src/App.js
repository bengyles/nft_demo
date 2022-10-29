import './App.css';
import {Grommet, Box} from 'grommet';
import theme from './util/theme';
import Home from './pages/Home';
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
                <p>marketplace</p>
              </Route>
              <Route path="/my-items">
                <p>my items</p>
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
