import React from "react";
import GameButton from "./GameButton.js";
import ValueBox from "./ValueBox.js";
import { Link } from "react-router";
import RandomColor from "randomcolor";
// import io from "socket.io-client";
//
// var socket = io.connect();

export default class Elimination extends React.Component{
	constructor(props){
		super(props);
		console.log("Game loaded");
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
		console.log("enter game")
		this.state.socket.emit("elimination_game");
	}

	componentWillMount(){
	// 	var that = this;
	// 	// var elem = document.querySelector('.grid');
	// 	// var pckry = new Packery( elem, {
	// 	//   itemSelector: '.grid-item',
	// 	//   percentPosition: true
	// 	// });
	//
	// 	// window.addEventListener("beforeunload", function(event){
	// 	// 	 console.log("player left the site");
	// 	//
	// 	// 	let activity = {
 // 	// 			type: "gameEnd",
 // 	// 			data: {
 // 	// 				name: "elimination",
 // 	// 				time: Date.now()
 // 	// 			}
 // 	// 		}
 // 	// 		let activities = that.state.activities.slice();
 // 	// 		activities.push(activity);
 // 	// 		that.props.passUpLog(activities);
	// 	// 	that.state.socket.emit("elimination_player_left")
	// 	// 	that.props.cleanup();
	// 	// })
	//
	// 	//socket events
	// 	this.state.socket.on("make_eliminationBoard", function(result){
	// 		console.log("got board")
	// 		console.log(result)
	// 		that.setState({board: result.board})
	// 		that.setState({topScore: result.topScore})
	// 	});
	// 	this.state.socket.on("need_eliminationBoard", function(){
	// 		console.log("need board");
	// 		that.makeBoard();
	// 	});
	// 	this.state.socket.on("top_score", function(score){
	// 		that.setState({topScore: score});
	// 	});
	// 	this.state.socket.on("you_scored", function(points){
	// 		console.log(that)
	// 		console.log("you scored", points)
	// 		let score = that.state.score+points;
	// 		that.setState({score: score});
	// 		that.state.socket.emit("check_score", score);
	// 	});
	// 	this.state.socket.on("game_over", function(winningScore){
	// 		console.log("game over")
	// 		that.setState({score: 0});
	// 		// that.state.socket.emit("check_score", 0);
	// 		let replay = confirm("GAME OVER! Highest score: "+winningScore+". Would you like to join the new round? Game begins in 5 seconds.")
	// 		if(replay){
	// 			console.log("replay")
	// 			let activity = {
	// 				type: "gameEnd",
	// 				data: {
	// 					name: "elimination",
	// 					time: Date.now()
	// 				}
	// 			}
	// 			var activities = that.state.activities.slice();
	// 			activities.push(activity);
   //          activity = {
   //             type: "gameStart",
   //             data: {
   //                name: "elimination",
   //                time: Date.now()
   //             }
   //          }
	// 			activities.push(activity);
	// 			that.setState({activities: activities});
	// 			// that.state.socket.emit("restart_elimination_game")
	// 			// that.state.socket.emit("rejoin_elimination")
   //       }else{
	// 			console.log("decline")
   //          that.context.router.push("/modes");
   //       }
	// 	})
	}
	// checkInactivity(){
	//
	// }
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
		console.log("player left")
		var activity = {
			type: "gameEnd",
			data: {
				name: "elimination",
				time: Date.now()
			}
		}
		// this.setState({score: 0});
		this.state.socket.emit("elimination_player_left")
		// var activities = this.state.activities.slice();
		// activities.push(activity);
		this.props.passUpLog([activity]);
		this.props.clearElimScore();
	}
	record(buttonPressed){
		this.state.socket.emit("button_pressed", buttonPressed.index);
		var size = buttonPressed.height*buttonPressed.width
		var activity = {
			type: "buttonPress",
			data: {
				size: size,
				color: buttonPressed.color,
				time: Date.now(),
				x: buttonPressed.x,
				y: buttonPressed.y
			}
		}
		// var activities = this.state.activities.slice();
		// activities.push(activity);
		// this.setState({activities: activities});
		this.props.passUpLog([activity]);
	}
	updateIt(data){
		console.log(data)
		this.setState({board: data.board})
		this.setState({topScore: data.topScore})
	}
	// reset(){
	// 	this.setState({board: []});
	// 	this.makeBoard();
	// }
	makeBoard(){
		console.log("make board called")
		// this.setState({score: 0});
		// this.setState({topScore: 0});
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
		console.log("makeboard done")
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
		console.log("Game rendered");
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
					{/*<div className="col-md-1"><button className="btn" type="button" onClick={() => this.reset()}>Reset</button></div>*/}
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
