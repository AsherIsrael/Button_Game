import React from "react";
import GameButton from "./GameButton.js";

export default class GameController extends React.Component{
	constructor(props){
		super(props);
		this.setState = this.setState.bind(this)
		this.state = {
			socket: props.route.socket,
			username: null
		}
	}
	componentDidMount(){
		console.log("game mounted")
		var that = this;
		this.state.socket.on("logged_in", function(data){
			console.log("supposed to be string", typeof data);
			console.log(that);
			that.setState({username: data});
			console.log("game username", that.state.username);
		})
	}
	render(){
		return(
			<div className="container">
				<h1>{this.state.username}</h1>
			</div>
		)
	}
}