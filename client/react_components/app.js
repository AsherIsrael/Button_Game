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
		var socket = io.connect();
		this.state = {
			socket: socket,
			username: null,
			activities: []
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
		// const { router } = this.context;
		// router.setRouteLeaveHook(this.props.route, this.routerWillLeave)



		// console.log("app", this)
		window.addEventListener("beforeunload", function(event){
		    // do stuff here
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
				activities: that.state.activities
			})
		})
		return(
			<div>
				{children}
			</div>
			// <Router history={browserHistory}>
			// 	<Route path="/" component={Login} socket={this.state.socket}/>
			// 	<Route path="/elimination" component={Elimination} socket={this.state.socket} username={username}/>
			// 	<Route path="/modes" component={Selector} socket={this.state.socket} setUsername={this.setName}/>
			// </Router>
		)
	}
}
App.contextTypes = {
   router: React.PropTypes.object.isRequired
};
// export default withRouter(App)
// reactMixin.onClass(App, Lifecycle);
// export default App;
