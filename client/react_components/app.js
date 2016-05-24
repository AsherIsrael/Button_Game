import React from "react";
import ReactDOM from "react-dom";
import Login from "./login.js";
import Elimination from "./Elimination.js";
import Selector from "./Selector.js"
import io from "socket.io-client";
import { Router, Route, browserHistory } from "react-router";

export default class App extends React.Component{
	constructor(){
		super();
		console.log("App component loaded");
		this.setState = this.setState.bind(this);
		this.setName = this.setName.bind(this);
		this.logActivities = this.logActivities.bind(this);
		var socket = io.connect();
		this.state = {
			socket: socket,
			username: null,
			activities: []
		}
	}
	// componentDidMount(){
	// 	console.log("app mounted")
	// 	var that = this;
	// 	this.state.socket.on("logged_in", function(data){
	// 		that.setState({username: data});
	// 		console.log("app username", that.state.username);
	// 	})
	// }
	logActivities(subLog){
		var activities = this.state.activities.slice();
		activities = activities.concat(subLog);
		this.setState({activities: activities});
	}
	setName(name){
		console.log(this)
		this.setState({username: name});
	}
	render(){
		console.log("app rendered");
		var that = this;
		var children = React.Children.map(this.props.children, function(child){
			return React.cloneElement(child, {
				socket: that.state.socket,
				username: that.state.username,
				setUsername: that.setName,
				passUpLog: that.logActivities
			})
		})
		return(
			<div>
				{children}
			</div>
			// <Router history={browserHistory}>
			// 	<Route path="/" component={Login} socket={this.state.socket}/>
			// 	<Route path="/elimination" component={Elimination} socket={this.state.socket} username={username}/>
			// 	<Route path="/modes" component={Selector} socket={this.state.socket} setUsername={this.setName}/>
			// </Router>
		)
	}
}
