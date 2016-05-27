import React from "react";
import ReactDOM from "react-dom";
import Login from "./login.js";
import Elimination from "./Elimination.js";
import Selector from "./Selector.js"
import Display from "./Display.js"
import io from "socket.io-client";
import { withRouter } from "react-router";
// import reactMixin from "react-mixin";

export default class App extends React.Component{
	constructor(){
		super();
		console.log("App component loaded");
		this.setState = this.setState.bind(this);
		this.setName = this.setName.bind(this);
		this.logActivities = this.logActivities.bind(this);
		this.eliminationSockets = this.eliminationSockets.bind(this);
		this.clearElimScore = this.clearElimScore.bind(this);
		// this.cleanUp = this.cleanUp.bind(this)
		var socket = io.connect();
		// var socket = io.connect("http://127.0.0.1:6174/", {"force new connection": true});
		this.state = {
			socket: socket,
			username: null,
			activities: [],
			elimHasRun: false,
			elimBoard: [],
			elimTopScore: 0,
			elimScore: 0
		}
	}
	componentDidMount(){
		console.log("app mounted")
		var that = this;
		this.state.socket.on("logged_in", function(data){
			that.setState({username: data.name});
			var activity = {
            type: "login",
            data: {
               time: Date.now()
            }
         }
         that.setState({activities: [activity]});
		})



		// console.log("app", this)
		window.addEventListener("beforeunload", function(event){
			 console.log("leaving");
			 var activity = {
 				type: "logout",
 				data: {
 					time: Date.now()
 				}
 			}
 			var activities = that.state.activities.slice();
 			activities.push(activity);
			console.log(activities)
 			that.state.socket.emit("finish_session", activities);
		})
	}
	// cleanUp(){
	// 	console.log("leaving");
	// 	var activity = {
	// 	  type: "logout",
	// 	  data: {
	// 		  time: Date.now()
	// 	  }
	//   }
	//   var activities = this.state.activities.slice();
	//   activities.push(activity);
	//   console.log(activities)
	//   this.state.socket.emit("finish_session", activities);
	// }
	// routerWillLeave(nextLocation){
	// 	console.log("LEAVING")
	// 	var activity = {
	// 		type: "logout",
	// 		data: {
	// 			time: Date.now()
	// 		}
	// 	}
	// 	var activities = this.state.activities.slice();
	// 	activities.push(activity);
	// 	this.socket.emit("finish_session", activities);
	// 	return "why not"
	// }
	// componentWillUnmount(){
	// 	console.log("leaving");
	// 	var activity = {
	// 		type: "logout",
	// 		data: {
	// 			time: Date.now()
	// 		}
	// 	}
	// 	var activities = this.state.activities.slice();
	// 	activities.push(activity);
	// 	this.socket.emit("finish_session", activities);
	// }












	eliminationSockets(elimination){
		var that = this;
		if(!this.state.elimHasRun){
			this.setState({elimHasRun: true})
			// var elem = document.querySelector('.grid');
			// var pckry = new Packery( elem, {
			//   itemSelector: '.grid-item',
			//   percentPosition: true
			// });

			// window.addEventListener("beforeunload", function(event){
			// 	 console.log("player left the site");
			//
			// 	let activity = {
		// 			type: "gameEnd",
		// 			data: {
		// 				name: "elimination",
		// 				time: Date.now()
		// 			}
		// 		}
		// 		let activities = that.state.activities.slice();
		// 		activities.push(activity);
		// 		that.props.passUpLog(activities);
			// 	that.state.socket.emit("elimination_player_left")
			// 	that.props.cleanup();
			// })

			//socket events
			this.state.socket.on("make_eliminationBoard", function(result){
				console.log("got board")
				console.log(result)
				// elimination.updateIt(result);
				that.setState({elimBoard: result.board})
				that.setState({elimTopScore: result.topScore})
			});
			this.state.socket.on("need_eliminationBoard", function(){
				console.log("need board");
				elimination.makeBoard();
			});
			this.state.socket.on("top_score", function(score){
				that.setState({elimTopScore: score});
			});
			this.state.socket.on("you_scored", function(points){
				console.log(elimination)
				console.log("you scored", points)
				let score = that.state.elimScore+points;
				that.setState({elimScore: score});
				elimination.state.socket.emit("check_score", score);
			});
			this.state.socket.on("game_over", function(winningScore){
				console.log("game over")
				elimination.setState({score: 0});
				// this.state.socket.emit("check_score", 0);
				let replay = confirm("GAME OVER! Highest score: "+winningScore+". Would you like to join the new round? Game begins in 5 seconds.")
				if(replay){
					console.log("replay")
					let activity = {
						type: "gameEnd",
						data: {
							name: "elimination",
							time: Date.now()
						}
					}
					var activities = that.state.activities.slice();
					activities.push(activity);
					activity = {
						type: "gameStart",
						data: {
							name: "elimination",
							time: Date.now()
						}
					}
					activities.push(activity);
					that.setState({activities: activities});
					// this.state.socket.emit("restart_elimination_game")
					// this.state.socket.emit("rejoin_elimination")
				}else{
					console.log("decline")
					elimination.context.router.push("/modes");
				}
			})
		}
	}

	clearElimScore(){
		this.setState({elimScore: 0})
	}





















	logActivities(subLog){
		var activities = this.state.activities.slice();
		activities = activities.concat(subLog);
		this.setState({activities: activities});
	}
	setName(name){
		this.setState({username: name});
	}
	render(){
		console.log("app rendered");
		var that = this;
		var children = React.Children.map(this.props.children, function(child){
			return React.cloneElement(child, {
				socket: that.state.socket,
				username: that.state.username,
				setUsername: that.setName,
				passUpLog: that.logActivities,
				activities: that.state.activities,
				socketControl: that.eliminationSockets,
				elimBoard: that.state.elimBoard,
				elimTopScore: that.state.elimTopScore,
				elimScore: that.state.elimScore,
				clearElimScore: that.clearElimScore
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
// export default withRouter(App)
// reactMixin.onClass(App, Lifecycle);
// export default App;
