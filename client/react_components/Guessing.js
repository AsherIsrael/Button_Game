import React from "react";
import GameButton from "./GameButton.js"
import ValueBox from "./ValueBox.js"
import { withRouter, Link } from "react-router";
import RandomColor from "randomcolor";
import Packery from "packery"


class Guessing extends React.Component{
   constructor(props){
      super(props);
      this.setState = this.setState.bind(this);
		this.record = this.record.bind(this);
      this.state = {
         board: [],
         correctButton: null,
         guesses: 0
      }
   }
   componentWillMount(){
      if(!this.props.username){
			this.context.router.push("");
		}
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
      let guesses = this.state.guesses+1
      this.setState({guesses: guesses})
      let size = buttonPressed.height*buttonPressed.width;
      var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
		var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      if(buttonPressed.number == this.state.correctButton){
         let activity = {
            type: "buttonPress",
            data: {
               correct: true,
               size: size,
               color: buttonPressed.color,
               time: Date.now(),
               x: buttonPressed.x,
               y: buttonPressed.y,
               windowWidth: width,
   				windowHeight: height
            }
         }
         this.props.socket.emit("log_activity", activity);
         let replay = confirm(`You got it in ${this.state.guesses} guesses! Would you like to play again?`);
         activity = {
   			type: "gameEnd",
   			data: {
   				name: "guessing",
   				time: Date.now()
   			}
   		}
   		this.props.socket.emit("log_activity", activity);
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
               y: buttonPressed.y,
               windowWidth: width,
   				windowHeight: height
            }
         }
         this.props.socket.emit("log_activity", activity);
         var board = this.state.board.slice();
         board[buttonPressed.number-1].display = "X";
         board[buttonPressed.number-1].pressed = true;
         this.setState({board: board});
      }

	}
   render(){
		// var that = this;
		var displayBoard = this.state.board.map((item) => {
			return <GameButton key={item.number} number={item.number} display={item.display} pressed={item.pressed} color={item.color} width={item.width} height={item.height} recordAct={this.record}/>
		})
		return(
			<div className="container-fluid">
				<div className="headbar">
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
