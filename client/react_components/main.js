import React from "react";
import ReactDOM from "react-dom";
import App from "./app.js";
import Login from "./login.js";
import Elimination from "./Elimination.js";
import Selector from "./Selector.js"
import Display from "./Display.js"
import Guessing from "./Guessing.js"

import { Router, Route, browserHistory, IndexRoute } from "react-router";
function handleLeave(){
   console.log('LEAVING')
}
var Routes = (
   <Router history={browserHistory}>
      <Route path="/" component={App}>
         <IndexRoute component={Login}/>
         <Route path="elimination" component={Elimination}/>
         <Route path="modes" component={Selector}/>
         <Route path="display" component={Display}/>
         <Route path="guess" component={Guessing}/>
      </Route>
   </Router>
)

ReactDOM.render(Routes, document.getElementById("content"))
