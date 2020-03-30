import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Main from "./Main";
import { Route, BrowserRouter as Router } from 'react-router-dom'

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";

import ProgPayETH from "./contracts/ProgPayETH.json";



// let drizzle know what contracts we want
const options = {
  contracts: [ProgPayETH],
  syncAlways:true,
  web3: {

    fallback: {
    type: 'ws',
    url: 'ws://127.0.0.1:8545'
    }
}
 };
//const options = {};

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);// pass in the drizzle instance

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={props => (<Main {...props} drizzle={drizzle} options={options}/>)}/>
      <Route path="/:address" render={props => (<App {...props} drizzle={drizzle} options={options}/>)} />
    </div>
  </Router>
)
ReactDOM.render(routing, document.getElementById("root"));
