import React from "react";
import GameButton from "./GameButton.js";
import ValueBox from "./ValueBox.js";
import { Link } from "react-router";
import RandomColor from "randomcolor";

export default class Elimination extends React.Component{
	constructor(props){
		super(props);
		this.setState = this.setState.bind(this);
		this.record = this.record.bind(this);
		this.randomWidth = this.randomWidth.bind(this);
		this.randomHeight = this.randomHeight.bind(this);
		this.makeBoard = this.makeBoard.bind(this);
		this.state = {
			socket: props.socket,
			username: props.username,
			activities: [],
			board: props.elimBoard,
			score: 0,
			topScore: props.elimScore
		}
	}

	componentDidMount(){
		this.props.socketControl(this);
		var activity = {
			type: "gameStart",
			data: {
				name: "elimination",
				time: Date.now()
			}
		}
		this.props.passUpLog([activity])
		this.state.socket.emit("elimination_game");
	}
	componentDidUpdate(nextState){
		var elem = document.querySelector('.grid');
		var pckry = new Packery( elem, {
		  itemSelector: '.grid-item',
		  percentPosition: true
		});
	}
	componentWillReceiveProps(nextProps){
		this.setState({board: nextProps.elimBoard})
		this.setState({topScore: nextProps.elimTopScore})
		this.setState({score: nextProps.elimScore})

	}
	componentWillUnmount(){
		var activity = {
			type: "gameEnd",
			data: {
				name: "elimination",
				time: Date.now()
			}
		}
		this.state.socket.emit("elimination_player_left")
		this.props.passUpLog([activity]);
		this.props.clearElimScore();
	}
	record(buttonPressed){
		this.state.socket.emit("button_pressed", buttonPressed.index);
		var size = buttonPressed.height*buttonPressed.width
		var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
		var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		var activity = {
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
		this.props.passUpLog([activity]);
	}
	updateIt(data){
		this.setState({board: data.board})
		this.setState({topScore: data.topScore})
	}
	makeBoard(){
		var board = [];
		let boardSize = 70;//number of grid-items to fill  the board;
		let wMax = 3;
		let hMax = 5;
		var i = 1;
		while(boardSize>0){
			if(boardSize<30){
				wMax = 2;
				hMax = 3;
			}
			if(boardSize<20){
				wMax = 8;
				hMax = 1;
			}
			if(boardSize<6){
				wMax = 1;
				hMax = 1;
			}
			var width = this.randomWidth(wMax);
			var height = this.randomHeight(hMax);
			while(boardSize - (width.val*height.val)<0){
				var width = this.randomWidth(wMax);
				var height = this.randomHeight(hMax);
			}
			boardSize = boardSize - (width.val*height.val);
			var points = (width.val*height.val)
			board.push({
				number: i,
				points: points,
				pressed: false,
				color: RandomColor({luminosity: "bright"}),
				width: width.class,
				height: height.class,
				display: null
			})
			i++;
		}
		this.state.socket.emit("new_eliminationBoard", board);
	}
	randomHeight(max){
		let picker = Math.floor(Math.random()*(max-1))+1;
		switch(picker){
			case 2:
				return {val: 2, class: "2"};
				break;
			case 3:
				return {val: 3, class: "3"};
				break;
			default:
				return {val: 1, class: "1"};
				break;
		}
	}
	randomWidth(max){
		let picker = Math.floor(Math.random()*(max-1))+1;
		switch(picker){
			case 2:
				return {val: 2, class: "2"};
				break;
			default:
				return {val: 1, class: "1"};
				break;
		}
	}
	render(){
		var that = this;
		var displayBoard = this.state.board.map(function(item, idx){
			return <GameButton key={item.number} pressed={item.pressed} index={idx} color={item.color} width={item.width} height={item.height} recordAct={that.record}/>
		})
		return(
			<div className="container-fluid">
				<div className="row">
					<h1 className="col-md-4">Now playing: {this.state.username}</h1>
					<ValueBox label="Your score:" data={this.state.score}/>
					<div className="col-md-1"></div>
					<ValueBox label="Current Leader:" data={this.state.topScore}/>
					<div className="col-md-2"></div>
					<div className="col-md-1"><Link to="/modes"><button className="btn" type="button">End Game</button></Link></div>
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
