import React from "react";
import GameButton from "./GameButton.js"
import ValueBox from "./ValueBox.js"
import { withRouter, Link } from "react-router";
import RandomColor from "randomcolor";


class Guessing extends React.Component{
   constructor(props){
      super(props);
      this.setState = this.setState.bind(this);
		this.record = this.record.bind(this);
		// this.randomWidth = this.randomWidth.bind(this);
		// this.randomHeight = this.randomHeight.bind(this);
		// this.makeBoard = this.makeBoard.bind(this);
      this.state = {
         // socket: props.socket,
         // username: props.username,
         board: [],
         correctButton: null,
         guesses: 0
      }
   }
   componentWillMount(){
      let board = this.props.makeBoard();
      this.setState({board: board});
      let correct = Math.floor(Math.random()*(board.length-1))+1;
      this.setState({correctButton: correct});
   }
   componentDidMount(){
		let that = this;
		let activity = {
			type: "gameStart",
			data: {
				name: "guessing",
				time: Date.now()
			}
		}
      this.props.socket.emit("log_activity", activity);
		// this.setState({activities: [activity]});
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
				name: "guessing",
				time: Date.now()
			}
		}
		// var activities = this.state.activities.slice();
		// activities.push(activity);
		this.props.socket.emit("log_activity", activity);
	}
   componentDidUpdate(nextState){
		var elem = document.querySelector('.grid');
		var pckry = new Packery( elem, {
		  itemSelector: '.grid-item',
		  percentPosition: true
		});
	}
   record(buttonPressed){
      var guess = this.state.guesses+1
      this.setState({guesses: guess})
      var size = buttonPressed.height*buttonPressed.width;
      if(buttonPressed.number==this.state.correctButton){
         let activity = {
            type: "buttonPress",
            data: {
               correct: true,
               size: size,
               color: buttonPressed.color,
               time: Date.now(),
               x: buttonPressed.x,
               y: buttonPressed.y
            }
         }
         // var activities = this.state.activities.slice();
         // activities.push(activity);
   		// this.props.passUpLog(activities);
         this.props.socket.emit("log_activity", activity);
         var replay = confirm("You got it in "+this.state.guesses+" guesses! Would you like to play again?");
         if(replay){
            let activity = {
               type: "gameStart",
               data: {
                  name: "guessing",
                  time: Date.now()
               }
            }
            this.props.socket.emit("log_activity", activity);
            this.setState({guesses: 0});
            let board = this.props.makeBoard();
            this.setState({board: board});
            let correct = Math.floor(Math.random()*(board.length-1))+1;
            this.setState({correctButton: correct});
         }else{
            this.props.router.push("/modes");
         }
      }else{
         let activity = {
            type: "buttonPress",
            data: {
               correct: false,
               size: size,
               color: buttonPressed.color,
               time: Date.now(),
               x: buttonPressed.x,
               y: buttonPressed.y
            }
         }
         this.props.socket.emit("log_activity", activity);
         // var activities = this.state.activities.slice();
         // activities.push(activity);
         // this.setState({activities: activities});
         var board = this.state.board.slice();
         board[buttonPressed.number-1].display = "X";
         this.setState({board: board});
      }

	}
   // makeBoard(){
	// 	var board = [];
	// 	let size = 70;//number of grid-items to fill  the board;
	// 	let wMax = 3;
	// 	let hMax = 5;
	// 	var i = 1;
	// 	while(size>0){
	// 		if(size<30){
	// 			wMax = 2;
	// 			hMax = 3;
	// 		}
	// 		if(size<20){
	// 			wMax = 8;
	// 			hMax = 1;
	// 		}
	// 		var width = this.randomWidth(wMax);
	// 		var height = this.randomHeight(hMax);
	// 		while(size - (width.val*height.val)<0){
	// 			width = this.randomWidth(wMax);
	// 			height = this.randomHeight(hMax);
	// 		}
	// 		size = size - (width.val*height.val);
	// 		var points = (width.val*height.val)
	// 		board.push({
	// 			number: i,
	// 			points: points,
	// 			color: RandomColor({luminosity: "bright"}),
	// 			width: width.class,
	// 			height: height.class
	// 		})
	// 		i++;
	// 	}
	// 	this.setState({board: board})
   //    var correct = Math.floor(Math.random()*(board.length-1))+1;
   //    this.setState({correctButton: correct});
	// }
	// randomHeight(max){
	// 	let picker = Math.floor(Math.random()*(max-1))+1;
	// 	switch(picker){
	// 		case 2:
	// 			return {val: 2, class: "2"};
	// 			break;
	// 		case 3:
	// 			return {val: 3, class: "3"};
	// 			break;
	// 		default:
	// 			return {val: 1, class: "1"};
	// 			break;
	// 	}
	// }
	// randomWidth(max){
	// 	let picker = Math.floor(Math.random()*(max-1))+1;
	// 	switch(picker){
	// 		case 2:
	// 			return {val: 2, class: "2"};
	// 			break;
	// 		default:
	// 			return {val: 1, class: "1"};
	// 			break;
	// 	}
	// }
   render(){
		var that = this;
		var displayBoard = this.state.board.map(function(item){
			return <GameButton key={item.number} number={item.number} display={item.display} color={item.color} width={item.width} height={item.height} recordAct={that.record}/>
		})
		return(
			<div className="container-fluid">
				<div className="row">
					<h1 className="col-md-4">Now Playing: {this.props.username}</h1>
               <ValueBox label="guesses:" data={this.state.guesses}/>
					<div className="col-md-5"></div>
					<div className="col-md-1"><Link to="/modes"><button className="btn" type="button">End Game</button></Link></div>
				</div>
				<div className="row grid gameBoard">
					{displayBoard}
				</div>
			</div>
		)
	}
}
Guessing.contextTypes = {
   router: React.PropTypes.object.isRequired
};
export default withRouter(Guessing)
