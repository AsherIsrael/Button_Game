import React from "react"
import io from "socket.io-client"

export default class Display extends React.Component{
   constructor(){
      console.log("made it here")
      super();
      this.setState = this.setState.bind(this);
      var socket = io.connect();
      this.state = {
         allActivities: null,
         socket: socket
      }
   }
   componentDidMount(){
      let that = this;
      this.state.socket.emit("display_records");
      this.state.socket.on("record_data", function(result){
         that.setState({allActivities: result});
      })
   }
   render(){
      return(
         <div className="displayPage">
            {JSON.stringify(this.state.allActivities)}
         </div>
      )
   }
}
