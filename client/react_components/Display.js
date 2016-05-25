import React from "react"

export default class Display extends React.Component{
   constructor(props){
      super(props);
      this.setState = this.setState.bind(this);
      this.state = {
         allActivities: null,
         socket: props.socket
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
