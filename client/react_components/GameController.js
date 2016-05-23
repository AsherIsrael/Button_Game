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
		//this.makeBoard();
	}
	componentDidMount(){
		var that = this;
		this.state.socket.on("logged_in", function(data){
			that.setState({username: data.name});
		})
		var elem = document.querySelector('.grid');
		var pckry = new Packery( elem, {
		  itemSelector: '.grid-item',
		  percentPosition: true
		});
		this.state.socket.on("make_board", function(mainBoard){
			console.log("got board")
			that.setState({board: mainBoard})
		});
		this.state.socket.on("need_board", function(){
			console.log("need board");
			that.makeBoard();
		})
	}
	componentDidUpdate(nextState){
		var elem = document.querySelector('.grid');
		var pckry = new Packery( elem, {
		  itemSelector: '.grid-item',
		  percentPosition: true
		});
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
	makeBoard(){
		var board = [];
		let size = 70;//number of grid-items to fill  the board;
		let wMax = 3;
		let hMax = 5;
		var i = 1;
		while(size>0){
			if(size<30){
				wMax = 2;
				hMax = 3;
			}
			if(size<20){
				wMax = 8;
				hMax = 1;
			}
			var width = this.randomWidth(wMax);
			var height = this.randomHeight(hMax);
			while(size - (width.val*height.val)<0){
				var width = this.randomWidth(wMax);
				var height = this.randomHeight(hMax);
			}
			size = size - (width.val*height.val);
			board.push({
				number: i,
				color: this.randomColor(),
				width: width.class,
				height: height.class
			})
			// board.push(<GameButton number={i} key={i} color={this.randomColor()} width={width.class} height={height.class} recordAct={this.record}/>)
			i++;
		}
		this.state.socket.emit("new_board", board);
		//this.setState({board: board})
	}
	randomHeight(max){
		let picker = Math.floor(Math.random()*(max-1))+1;
		switch(picker){
			case 2:
				return {val: 2, class: "grid-item--height2"};
				break;
			case 3:
				return {val: 3, class: "grid-item--height3"};
				break;
			default:
				return {val: 1, class: ""};
				break;
		}
	}
	randomWidth(max){
		let picker = Math.floor(Math.random()*(max-1))+1;
		switch(picker){
			case 2:
				return {val: 2, class: "grid-item--width2"};
				break;
			default:
				return {val: 1, class: ""};
				break;
		}
	}
	randomColor(){
		return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
	}
	render(){
		console.log("Game rendered");
		var that = this;
		var displayBoard = this.state.board.map(function(item){
			return <GameButton key={item.number} number={item.number} color={item.color} width={item.width} height={item.height} recordAct={that.record}/>
		})
		return(
			<div className="container-fluid">
				<div className="row">
					<h1 className="col-md-1">{this.state.username}</h1>
					<div className="col-md-10"></div>
					<div className="col-md-1"><button className="btn" type="button" onClick={() => this.reset()}>Reset</button></div>
				</div>
				<div className="row board">
					<div className="gameBoard grid">
						{displayBoard}
					</div>
				</div>
			</div>
		)
	}
}
