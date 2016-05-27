import React from "react";

export default class ValueBox extends React.Component{
   render(){
      return(
         <div className="col-md-2">
            <div className="input-group">
               <span className="input-group-addon">{this.props.label}</span>
               <input className="form-control" type="text" value={this.props.data} disabled/>
            </div>
         </div>
      )
   }
}
