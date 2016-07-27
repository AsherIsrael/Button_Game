import React from "react";
import ReactDOM from "react-dom";
import App from "./app.js";
import Login from "./login.js";
import Elimination from "./Elimination.js";
import Selector from "./Selector.js"
import Guessing from "./Guessing.js"
import VisualLogic from "./VisualLogic.js"
import { Router, Route, browserHistory, IndexRoute } from "react-router";

var Routes = (
   <Router history={browserHistory}>
      <Route path="/" component={App}>
         <IndexRoute component={Login}/>
         <Route path="elimination" component={Elimination}/>
         <Route path="modes" component={Selector}/>
         <Route path="guessing" component={Guessing}/>
      </Route>
      <Route path="/visualize" component={VisualLogic}/>
   </Router>
)

ReactDOM.render(Routes, document.getElementById("content"))
