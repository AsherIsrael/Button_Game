import React from "react";
import SelectIcon from "./SelectIcon.js";
import { withRouter, Link } from "react-router";
// import io from "socket.io-client";


export default class Selector extends React.Component{
   constructor(props){
      super(props);
      this.setState = this.setState.bind(this);
      this.handleClick = this.handleClick.bind(this);
      // var socket = io.connect();

      this.state = {
         username: props.username,
         socket: props.socket,
         modes: [
            // {
            //    name: "Display Activities",
            //    component: "display"
            // },
            {
               name: "Elimination",
               component: "elimination",
               description: "Compete with other players to earn the most points! The bigger the button, the more points it's worth!"
            },
            {
               name: "Guessing",
               component: "guessing",
               description: "Can you guess which button is the correct one? How many tries will it take?"
            }
         ]
      }
   }
   // componentDidMount(){
   //    var that = this;
   //    window.addEventListener("beforeunload", function(event){
   //       console.log("selector leaving page")
   //       that.props.passUpLog(activities);
   //       that.props.cleanup();
   //    })
   // }
   // componentWillUnmount(){
   //    this.props.passUpLog(this.state.activities);
   // }
   handleClick(name){
      console.log("handleclick")
      var activity = {
         type: "choseGame",
         data: {
            name: name,
            time: Date.now()
         }
      }
      // var activities = this.state.activities.slice();
      // activities.push(activity);
      // this.setState({activities: activities});
      this.props.passUpLog([activity]);
   }
   render(){
      var that = this;
      var games = this.state.modes.map(function(mode, idx){
         return <SelectIcon key={idx} name={mode.name} component={mode.component} description={mode.description} logIt={that.handleClick}/>
      })
      return(
         <div className="container-fluid">
            <div className="row">
               <h1 className="col-md-4">Welcome: {this.props.username}</h1>
               <div className="col-md-8"></div>
            </div>
            <div className="row">
               {games}
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <p>Icons made by FreePik from <a href="/www.flaticon.com">www.flaticon.com</a></p>
         </div>
      );
   }
}
// Selector.contextTypes = {
//    router: React.PropTypes.object.isRequired
// };
// export default withRouter(Selector)
