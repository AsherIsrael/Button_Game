import React from "react";

export default class DataDisplay extends React.Component{
   render(){
      return(
         <div className="dataDisplay">
            <h1>{this.props.value} {this.props.title}</h1>
         </div>
      )
   }
}
