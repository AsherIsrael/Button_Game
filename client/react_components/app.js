import React from "react";
import RandomColor from "randomcolor";
import io from "socket.io-client";

export default class App extends React.Component{
	constructor(){
		super();
		console.log("app initialized");
		this.setState = this.setState.bind(this)
		var socket = io.connect();
		this.state = {
			socket: socket,
			username: undefined,
			elimBoard: [],
			elimTopScore: 0,
			elimScore: 0
		}
	}
	componentDidMount(){
		this.state.socket.on("logged_in", (data) => {
			this.setState({username: data.name});
			let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
			let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
			let activity = {
            type: "login",
            data: {
               time: Date.now(),
					windowWidth: width,
					windowHeight: height
            }
         }
			this.logActivity(activity)
			this.context.router.push("modes")
		})



		this.state.socket.on("make_eliminationBoard", (result) => {
			this.setState({elimBoard: result.board})
			this.setState({elimTopScore: result.topScore})
		});
		this.state.socket.on("need_eliminationBoard", () => {
			this.makeElimBoard((board) => {
				this.state.socket.emit("new_eliminationBoard", board);
			});
		});
		this.state.socket.on("top_score", (score) => {
			this.setState({elimTopScore: score});
		});
		this.state.socket.on("you_scored", (points) => {
			let score = this.state.elimScore+points;
			this.setState({elimScore: score});
			this.state.socket.emit("check_score", score);
		});
		this.state.socket.on("game_over", (winningScore) => {
			this.setState({elimScore: 0});
			let board = this.state.elimBoard;
			for(let button of board){
				button.pressed = true;
			}
			this.setState({elimBoard: board});
			let replay = confirm(`GAME OVER! Highest score: ${winningScore}. Would you like to join the new round? Game begins in 4 seconds.`)
			if(replay){
				let activity = {
					type: "gameEnd",
					data: {
						name: "elimination",
						time: Date.now()
					}
				}
				this.logActivity(activity);
				activity = {
					type: "gameStart",
					data: {
						name: "elimination",
						time: Date.now()
					}
				}
				this.logActivity(activity)
			}else{
				this.context.router.push("/modes");
			}
		})

		var that = this;
		window.addEventListener("beforeunload", () => {
			if(this.state.username){
				let activity = {
					type: "logout",
					data: {
						time: Date.now()
					}
				}
				that.logActivity(activity)
			}
		})
	}
	reset(){
		this.setState({elimTopScore: 0, elimScore: 0});
	}
	makeElimBoard(callback){
		callback(this.makeBoard());
	}
	makeBoard(){
		var board = [];
		let boardSize = 70; //number of grid-items to fill  the board;
		let wMax = 3;
		let hMax = 3;
		var i = 1;
		while(boardSize>0){
			if(boardSize<30){
				wMax = 5;
				hMax = 3;
			}
			if(boardSize<20){
				wMax = 2;
				hMax = 8;
			}
			if(boardSize<15){
				wMax = 1;
				hMax = 2;
			}
			if(boardSize<7){
				wMax = 1;
				hMax = 1;
			}
			var width = this.randomWidth(wMax);
			var height = this.randomHeight(hMax);
			while(boardSize - (width.val*height.val)<0){
				width = this.randomWidth(wMax);
				height = this.randomHeight(hMax);
			}
			boardSize = boardSize - (width.val*height.val);
			board.push({
				number: i,
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
			case 3:
				return {val: 3, class: "3"};
				break;
			default:
				return {val: 1, class: "1"};
				break;
		}
	}
	logActivity(activity){
		this.state.socket.emit("log_activity", activity)
	}
	setName(name){
		this.setState({username: name});
	}
	render(){
		var children = React.Children.map(this.props.children, (child) => {
			return React.cloneElement(child, {
				socket: this.state.socket,
				username: this.state.username,
				elimBoard: this.state.elimBoard,
				elimTopScore: this.state.elimTopScore,
				elimScore: this.state.elimScore,
				makeBoard: () => this.makeBoard(),
				reset: () => this.reset()
			})
		})
		return(
			<div id="noOverflow">
				{children}
			</div>
		)
	}
}
App.contextTypes = {
   router: React.PropTypes.object.isRequired
};
