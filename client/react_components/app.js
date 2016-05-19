import React from "react";
import ReactDOM from "react-dom";
import Login from "./login.js";
import GameController from "./GameController.js";
import io from "socket.io-client";
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var Link = ReactRouter.Link;

export default class App extends React.Component{
	constructor(){
		super();
		this.redirect = this.redirect.bind(this);
		this.setState = this.setState.bind(this);
		this.state = {
			socket: io.connect(),
			username: null
		}
	}
	// componentDidMount(){
	// 	console.log("app mounted")
	// 	var that = this;
	// 	this.state.socket.on("logged_in", function(data){
	// 		console.log("supposed to be string", typeof data);
	// 		console.log(that);
	// 		that.setState({username: data});
	// 		console.log("app username", that.state.username);
	// 	})
	// }
	redirect(){
		console.log("redirect");
		// hashHistory.push("/game");
	}
	render(){
		console.log("app state", this.state);
		return(
			<Router history={hashHistory}>
				<Route path="/" component={Login} socket={this.state.socket} redirect={this.redirect}/>
				<Route path="/game" component={GameController} socket={this.state.socket} username={this.state.username}/>
			</Router>
		)
	}
}
	
