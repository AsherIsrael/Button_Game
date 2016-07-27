import React from "react";
import GameButton from "./GameButton.js";
import ValueBox from "./ValueBox.js";
import { Link } from "react-router";
import Packery from "packery"

export default class Elimination extends React.Component{
	constructor(){
		super();
		this.record = this.record.bind(this);
	}
	componentWillMount(){
      if(!this.props.username){
			this.context.router.push("");
		}
   }
	componentDidMount(){
		var activity = {
			type: "gameStart",
			data: {
				name: "elimination",
				time: Date.now()
			}
		}
		this.props.socket.emit("log_activity", activity)
		this.props.socket.emit("elimination_game");
	}
	componentDidUpdate(nextState){
		var elem = document.querySelector('.grid');
		var pckry = new Packery( elem, {
		  itemSelector: '.grid-item',
		  percentPosition: true
		});
	}
	componentWillUnmount(){
		let activity = {
			type: "gameEnd",
			data: {
				name: "elimination",
				time: Date.now()
			}
		}
		this.props.socket.emit("elimination_player_left");
		this.props.socket.emit("log_activity", activity);
	}
	record(buttonPressed){
		this.props.socket.emit("button_pressed", buttonPressed.index);
		var size = buttonPressed.height*buttonPressed.width
		var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
		var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		let activity = {
			type: "buttonPress",
			data: {
				size: size,
				color: buttonPressed.color,
				time: Date.now(),
				x: buttonPressed.x,
				y: buttonPressed.y,
				windowWidth: width,
				windowHeight: height
			}
		}
		this.props.socket.emit("log_activity", activity);
	}
	render(){
		var displayBoard = this.props.elimBoard.map((item, idx) => {
			return <GameButton key={item.number} pressed={item.pressed} index={idx} color={item.color} width={item.width} height={item.height} recordAct={this.record}/>
		})
		return(
			<div className="container-fluid">
				<div className="headbar">
					<h1 className="col-md-4 col-xs-12">Now playing: {this.props.username}</h1>
					<ValueBox label="Buttons:" data={this.props.elimScore}/>
					<div className="col-md-1 col-xs-0"></div>
					<ValueBox label="Current Leader:" data={this.props.elimTopScore}/>
					<div className="col-md-2 col-xs-0"></div>
					<div className="col-md-1 col-xs-4"><Link className="endButton" to="modes"><button className="btn endButton" type="button">End Game</button></Link></div>
				</div>
				<div className="row grid gameBoard">
					{displayBoard}
				</div>
			</div>
		)
	}
}
Elimination.contextTypes = {
   router: React.PropTypes.object.isRequired
};
