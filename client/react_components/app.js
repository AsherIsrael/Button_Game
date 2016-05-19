import React from "react";
import ReactDOM from "react-dom";
import Login from "./login.js";
import GameController from "./GameController.js";
import io from "socket.io-client";
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var browserHistory = ReactRouter.browserHistory;
var Link = ReactRouter.Link;

export default class App extends React.Component{
	constructor(){
		super();
		console.log("App component loaded");
		this.setState = this.setState.bind(this);
		var socket = io.connect();
		this.state = {
			socket: socket,
			username: null
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
	render(){
		console.log("app rendered");
		return(
			<Router history={browserHistory}>
				<Route path="/" component={Login} socket={this.state.socket}/>
				<Route path="/game" component={GameController} username={this.state.username} socket={this.state.socket}/>
			</Router>
		)
	}
}