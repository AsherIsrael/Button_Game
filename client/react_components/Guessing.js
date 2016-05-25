import React from "react";
import GameButton from "./GameButton.js"
import { withRouter, Link } from "react-router";

export default class Guessing extends React.Component{
   constructor(props){
      super(props);
      this.setState = this.setState.bind(this);
		this.record = this.record.bind(this);
		this.randomWidth = this.randomWidth.bind(this);
		this.randomHeight = this.randomHeight.bind(this);
		this.randomColor = this.randomColor.bind(this);
		this.makeBoard = this.makeBoard.bind(this);
      this.state = {
         socket: props.socket,
         username: props.username,
         activities: [],
         board: [],
         correctButton: null
      }
   }
   componentWillMount(){
      this.makeBoard();
   }
   componentDidMount(){
		var that = this;
		// this.state.socket.on("logged_in", function(data){
		// 	that.setState({username: data.name});
		// })
		var activity = {
			type: "gameStart",
			data: {
				name: "guessing",
				time: Date.now()
			}
		}
		this.setState({activities: [activity]});
		// this.state.socket.emit("elimination_game");
		var elem = document.querySelector('.grid');
		var pckry = new Packery( elem, {
		  itemSelector: '.grid-item',
		  percentPosition: true
		});
		// this.state.socket.on("make_eliminationBoard", function(mainBoard){
		// 	console.log("got board")
		// 	that.setState({board: mainBoard})
		// });
		// this.state.socket.on("need_eliminationBoard", function(){
		// 	console.log("need board");
		// 	that.makeBoard();
		// })
	}
   componentWillUnmount(){
		var activity = {
			type: "gameEnd",
			data: {
				name: "guessing",
				time: Date.now()
			}
		}
		var activities = this.state.activities.slice();
		activities.push(activity);
		this.props.passUpLog(activities);
	}
   componentDidUpdate(nextState){
		var elem = document.querySelector('.grid');
		var pckry = new Packery( elem, {
		  itemSelector: '.grid-item',
		  percentPosition: true
		});
	}
   record(buttonPressed){
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
         var activities = this.state.activities.slice();
         activities.push(activity);
         // this.setState({activities: activities});
         // var activity = {
   		// 	type: "gameEnd",
   		// 	data: {
   		// 		name: "guessing",
   		// 		time: Date.now()
   		// 	}
   		// }
   		// // var activities = this.state.activities.slice();
   		// activities.push(activity);
   		this.props.passUpLog(activities);
         var replay = confirm("You got it! Would you like to play again?");
         if(replay){
            let activity = {
               type: "gameStart",
               data: {
                  name: "guessing",
                  time: Date.now()
               }
            }
            this.makeBoard();
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
         var activities = this.state.activities.slice();
         activities.push(activity);
         this.setState({activities: activities});
         var board = this.state.board.slice();
         board[buttonPressed.number-1].display = "X";
         this.setState({board: board});
      }

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
			var points = (width.val*height.val)
			board.push({
				number: i,
				points: points,
				color: this.randomColor(),
				width: width.class,
				height: height.class,
            display: "O"
			})
			//board.push(<GameButton number={i} key={i} color={this.randomColor()} width={width.class} height={height.class} recordAct={this.record}/>)
			i++;
		}
		// this.state.socket.emit("new_eliminationBoard", board);
		this.setState({board: board})
      var correct = Math.floor(Math.random()*(board.length-1))+1;
      this.setState({correctButton: correct});
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
	randomColor(){
      return '#'+Math.floor(Math.random()*16777215).toString(16);
		// return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
	}
   render(){
		console.log("Guessing game rendered");
		var that = this;
		var displayBoard = this.state.board.map(function(item){
			return <GameButton key={item.number} number={item.number} display={item.display} color={item.color} width={item.width} height={item.height} recordAct={that.record}/>
		})
		return(
			<div className="container-fluid">
				<div className="row">
					<h1 className="col-md-1">{this.state.username}</h1>
					<div className="col-md-10"></div>
					<div className="col-md-1"><Link to="/modes"><button className="btn" type="button">End Game</button></Link></div>
					{/*<div className="col-md-1"></div>*/}
					{/*<div className="col-md-1"><button className="btn" type="button" onClick={() => this.reset()}>Reset</button></div>*/}
				</div>
				<div className="row grid gameBoard">
					{/*<div className="gameBoard grid">*/}
						{displayBoard}
					{/*</div>*/}
				</div>
			</div>
		)
	}
}
Guessing.contextTypes = {
   router: React.PropTypes.object.isRequired
};
export default withRouter(Guessing)
