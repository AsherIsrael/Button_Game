import React from "react";
// import ReactDOM from "react-dom";
// import Login from "./login.js";
// import Elimination from "./Elimination.js";
// import Selector from "./Selector.js"
import RandomColor from "randomcolor";
import io from "socket.io-client";

export default class App extends React.Component{
	constructor(){
		super();
		this.setState = this.setState.bind(this);
		this.setName = this.setName.bind(this);
		this.logActivity = this.logActivity.bind(this);
		// this.eliminationSockets = this.eliminationSockets.bind(this);
		this.randomWidth = this.randomWidth.bind(this);
		this.randomHeight = this.randomHeight.bind(this);
		this.makeBoard = this.makeBoard.bind(this);
		this.makeElimBoard = this.makeElimBoard.bind(this);
		this.clearElimScore = this.clearElimScore.bind(this);
		var socket = io.connect();
		this.state = {
			socket: socket,
			username: null,
			elimBoard: [],
			elimTopScore: 0,
			elimScore: 0
			// guessBoard: []
		}
	}
	componentDidMount(){
		var that = this;
		this.state.socket.on("logged_in", function(data){
			that.setState({username: data.name});
			var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
			var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
			var activity = {
            type: "login",
            data: {
               time: Date.now(),
					windowWidth: width,
					windowHeight: height
            }
         }
			that.logActivity(activity)
         // that.setState({activities: [activity]});
		})



		this.state.socket.on("make_eliminationBoard", function(result){
			that.setState({elimBoard: result.board})
			that.setState({elimTopScore: result.topScore})
		});
		this.state.socket.on("need_eliminationBoard", function(){
			that.makeElimBoard((board)=>{
				that.state.socket.emit("new_eliminationBoard", board);
			});
		});
		this.state.socket.on("top_score", function(score){
			that.setState({elimTopScore: score});
		});
		this.state.socket.on("you_scored", function(points){
			let score = that.state.elimScore+points;
			that.setState({elimScore: score});
			that.state.socket.emit("check_score", score);
		});
		this.state.socket.on("game_over", function(winningScore){
			that.setState({elimScore: 0});
			let replay = confirm("GAME OVER! Highest score: "+winningScore+". Would you like to join the new round? Game begins in 5 seconds.")
			if(replay){
				let activity = {
					type: "gameEnd",
					data: {
						name: "elimination",
						time: Date.now()
					}
				}
				that.logActivity(activity);
				// var activities = that.state.activities.slice();
				// activities.push(activity);
				activity = {
					type: "gameStart",
					data: {
						name: "elimination",
						time: Date.now()
					}
				}
				that.logActivity(activity)
				// activities.push(activity);
				// that.setState({activities: activities});
			}else{
				that.context.router.push("/modes");
			}
		})




		window.addEventListener("beforeunload", function(){
			let activity = {
				type: "logout",
				data: {
					time: Date.now()
				}
			}
		// 	var activities = that.state.activities.slice();
		// 	activities.push(activity);
		// 	that.state.socket.emit("finish_session", activities);
			that.logActivity(activity)
		})
	}
	// eliminationSockets(elimination){
	// 	var that = this;
	// 	if(!this.state.elimHasRun){
	// 		this.setState({elimHasRun: true})
	// 		this.state.socket.on("make_eliminationBoard", function(result){
	// 			that.setState({elimBoard: result.board})
	// 			that.setState({elimTopScore: result.topScore})
	// 		});
	// 		this.state.socket.on("need_eliminationBoard", function(){
	// 			elimination.makeBoard();
	// 		});
	// 		this.state.socket.on("top_score", function(score){
	// 			that.setState({elimTopScore: score});
	// 		});
	// 		this.state.socket.on("you_scored", function(points){
	// 			let score = that.state.elimScore+points;
	// 			that.setState({elimScore: score});
	// 			elimination.state.socket.emit("check_score", score);
	// 		});
	// 		this.state.socket.on("game_over", function(winningScore){
	// 			that.setState({elimScore: 0});
	// 			let replay = confirm("GAME OVER! Highest score: "+winningScore+". Would you like to join the new round? Game begins in 5 seconds.")
	// 			if(replay){
	// 				let activity = {
	// 					type: "gameEnd",
	// 					data: {
	// 						name: "elimination",
	// 						time: Date.now()
	// 					}
	// 				}
	// 				var activities = that.state.activities.slice();
	// 				activities.push(activity);
	// 				activity = {
	// 					type: "gameStart",
	// 					data: {
	// 						name: "elimination",
	// 						time: Date.now()
	// 					}
	// 				}
	// 				activities.push(activity);
	// 				that.setState({activities: activities});
	// 			}else{
	// 				elimination.context.router.push("/modes");
	// 			}
	// 		})
	// 	}
	// }
	makeElimBoard(callback){
		callback(this.makeBoard());
	}
	// makeGuessBoard(){
	// 	board = this.makeBoard();
	// 	this.setState({guessBoard: board});
	// }
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
		return board;
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
	clearElimScore(){
		this.setState({elimScore: 0})
	}

	logActivity(activity){
		// var activities = this.state.activities.slice();
		// activities = activities.concat(subLog);
		// this.setState({activities: activities});
		this.state.socket.emit("log_activity", activity)
	}
	setName(name){
		this.setState({username: name});
	}
	render(){
		var that = this;
		var children = React.Children.map(this.props.children, function(child){
			return React.cloneElement(child, {
				socket: that.state.socket,
				username: that.state.username,
				setUsername: that.setName,
				activities: that.state.activities,
				elimBoard: that.state.elimBoard,
				elimTopScore: that.state.elimTopScore,
				elimScore: that.state.elimScore,
				clearElimScore: that.clearElimScore,
				// guessBoard: that.state.guessBoard,
				makeBoard: that.makeBoard
			})
		})
		return(
			<div>
				{children}
			</div>
		)
	}
}
App.contextTypes = {
   router: React.PropTypes.object.isRequired
};
App.contextTypes = {
   router: React.PropTypes.object.isRequired
};
