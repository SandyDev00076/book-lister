import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ListPage from './components/ListPage/ListPage';
import CartComponent from './components/Cart/Cart';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ListPage}></Route>
        <Route path="/list" component={ListPage}></Route>
        <Route path="/cart" component={CartComponent}></Route>
      </Switch>
    </Router>
  );
}

export default App;
