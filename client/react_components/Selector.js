import React from "react";
import SelectIcon from "./SelectIcon.js";
import { Link } from "react-router";


export default class Selector extends React.Component{
   constructor(){
      super();
      this.state = {
         modes: [
            {
               name: "Elimination",
               component: "elimination",
               description: "Compete with other players to click 10 buttons first!"
            },
            {
               name: "Guessing",
               component: "guessing",
               description: "Can you guess which button is the correct one? How many tries will it take?"
            }
         ]
      }
   }
   componentWillMount(){
      if(!this.props.username){
			this.context.router.push("");
		}
   }
   render(){
      var games = this.state.modes.map((mode, idx) => {
         return <SelectIcon key={idx} name={mode.name} component={mode.component} description={mode.description}/>
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
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <p>Icons made by FreePik from <a href="/www.flaticon.com">www.flaticon.com</a></p>
         </div>
      );
   }
}
Selector.contextTypes = {
   router: React.PropTypes.object.isRequired
};
