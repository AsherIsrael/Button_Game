import React from "react";
import ReactDOM from "react-dom";
import Login from "./login.js";
import Elimination from "./Elimination.js";
import Selector from "./Selector.js"
import io from "socket.io-client";

export default class App extends React.Component{
	constructor(){
		super();
		this.setState = this.setState.bind(this);
		this.setName = this.setName.bind(this);
		this.logActivities = this.logActivities.bind(this);
		this.eliminationSockets = this.eliminationSockets.bind(this);
		this.clearElimScore = this.clearElimScore.bind(this);
		var socket = io.connect();
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
         that.setState({activities: [activity]});
		})
		window.addEventListener("beforeunload", function(event){
			 var activity = {
 				type: "logout",
 				data: {
 					time: Date.now()
 				}
 			}
 			var activities = that.state.activities.slice();
 			activities.push(activity);
 			that.state.socket.emit("finish_session", activities);
		})
	}
	eliminationSockets(elimination){
		var that = this;
		if(!this.state.elimHasRun){
			this.setState({elimHasRun: true})
			this.state.socket.on("make_eliminationBoard", function(result){
				that.setState({elimBoard: result.board})
				that.setState({elimTopScore: result.topScore})
			});
			this.state.socket.on("need_eliminationBoard", function(){
				elimination.makeBoard();
			});
			this.state.socket.on("top_score", function(score){
				that.setState({elimTopScore: score});
			});
			this.state.socket.on("you_scored", function(points){
				let score = that.state.elimScore+points;
				that.setState({elimScore: score});
				elimination.state.socket.emit("check_score", score);
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
				}else{
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
