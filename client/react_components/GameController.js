import React from "react";
import GameButton from "./GameButton.js";

export default class GameController extends React.Component{
	constructor(props){
		super(props);
		console.log("Game loaded");
		this.setState = this.setState.bind(this);
		this.record = this.record.bind(this);
		this.randomWidth = this.randomWidth.bind(this);
		this.randomHeight = this.randomHeight.bind(this);
		this.randomColor = this.randomColor.bind(this);
		this.makeBoard = this.makeBoard.bind(this);
		this.state = {
			socket: props.route.socket,
			username: null,
			activities: [],
			board: []
		}
	}
	componentWillMount(){
		this.makeBoard();
	}
	componentDidMount(){
		var that = this;
		this.state.socket.on("logged_in", function(data){
			that.setState({username: data.name});
		})
		var elem = document.querySelector('.grid');
		var msnry = new Masonry( elem, {
		  itemSelector: '.grid-item',
		  columnWidth: ".grid-sizer",
		  percentPosition: true
		});
	}
	componentDidUpdate(nextState){
		var elem = document.querySelector('.grid');
		var msnry = new Masonry( elem, {
		  itemSelector: '.grid-item',
		  columnWidth: ".grid-sizer",
		  percentPosition: true
		});
	}
	makeBoard(){
		var board = [];
		for(var i=0;i<20;i++){
			board.push(<GameButton key={i} color={this.randomColor()} width={this.randomWidth()} height={this.randomHeight()} recordAct={this.record}/>)
		}
		this.setState({board: board})
	}
	randomHeight(){
		let picker = Math.floor(Math.random()*(6-1))+1;
		switch(picker){
			case 1:
				return "";
				break;
			case 2:
				return "grid-item--height2";
				break;
			case 3:
				return "grid-item--height3";
				break;
			default:
				return "";
				break;
		}
	}
	randomWidth(){
		let picker = Math.floor(Math.random()*(6-1))+1;
		switch(picker){
			case 1:
				return "";
				break;
			case 2:
				return "grid-item--width2";
				break;
			case 3:
				return "grid-item--width3";
				break;
			default:
				return "";
				break;
		}
	}
	randomColor(){
		return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
	}
	record(buttonPressed){
		var activities = this.state.activities.slice();
		activities.push(buttonPressed);
		this.setState({activities: activities});
	}
	reset(){
		this.setState({board: []});
		this.makeBoard();
	}
	render(){
		console.log("Game rendered");
		return(
			<div className="container-fluid">
				<div className="row">
					<h1 className="col-md-1">{this.state.username}</h1>
					<div className="col-md-10"></div>
					<div className="col-md-1"><button className="btn" type="button" onClick={() => this.reset()}>Reset</button></div>
				</div>
				<div className="row board">
					<div className="gameBoard grid">
						<div className="grid-sizer"></div>
						{this.state.board}
					</div>
				</div>
			</div>
		)
	}
}
