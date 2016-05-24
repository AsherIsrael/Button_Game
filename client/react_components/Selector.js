import React from "react";
import SelectIcon from "./SelectIcon.js";

export default class Selector extends React.Component{
   constructor(props){
      super(props);
      this.setState = this.setState.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.state = {
         username: null,
         socket: props.socket,
         modes: [
            {
               name: "Speed",
               component: "speed"
            },
            {
               name: "Elimination",
               component: "elimination"
            }
         ],
         activities: []
      }
   }
   componentDidMount(){
      var that = this;
      this.state.socket.on("logged_in", function(data){
			that.setState({username: data.name});
         that.props.setUsername(that.state.username);
		})
      var activity = {
         type: "login",
         data: {
            time: Date.now()
         }
      }
      this.setState({activities: [activity]});
   }
   componentWillUnmount(){
      this.props.passUpLog(this.state.activities);
   }
   handleClick(name){
      console.log("handleclick")
      var activity = {
         type: "choseGame",
         data: {
            name: name,
            time: Date.now()
         }
      }
      console.log(this)
      var activities = this.state.activities.slice();
      activities.push(activity);
      this.setState({activities: activities});
   }
   render(){
      var that = this;
      var games = this.state.modes.map(function(mode, idx){
         return <SelectIcon key={idx} name={mode.name} component={mode.component} logIt={that.handleClick}/>
      })
      return(
         <div className="container-fluid">
            <div className="row">
               <h1 className="col-md-1">{this.state.username}</h1>
               <div className="col-md-11"></div>
            </div>
            <div className="row">
               {games}
            </div>
         </div>
      );
   }
}
