import React from "react";
import GameButton from "./GameButton.js";

export default class GameController extends React.Component{
	constructor(props){
		super(props);
		console.log("Game loaded");
		this.setState = this.setState.bind(this);
		this.record = this.record.bind(this);
		this.state = {
			socket: props.route.socket,
			username: null,
			activities: []
		}
	}
	componentDidMount(){
		var that = this;
		this.state.socket.on("logged_in", function(data){
			that.setState({username: data});
		})
	}
	record(buttonPressed){
		var activities = this.state.activities.slice();
		activities.push(buttonPressed);
		this.setState({activities: activities});
	}
	render(){
		console.log("Game rendered");
		return(
			<div className="container">
				<h1>{this.state.username}</h1>
			</div>
		)
	}
}