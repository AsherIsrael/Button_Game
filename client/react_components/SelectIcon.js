import React from "react";

export default class SelectIcon extends React.Component{
   redirect(){
      this.context.router.push(this.props.component)
   }

   render(){
      var source = "../static/images/"+ this.props.component +".png";

      return(
         <div className="col-md-5">
            <div className="col-md-2"></div>
            <div className="col-md-8 center-block">
               <button className="btn btn-secondary selectButton" onClick={() => this.redirect()}>
               <img className="selectButton" src={source} alt={this.props.component}/>
               </button>
               <h4>{this.props.name}</h4>
               <br/>
               <p>{this.props.description}</p>
            </div>
            <div className="col-md-2"></div>
         </div>
      )
   }
}
SelectIcon.contextTypes = {
   router: React.PropTypes.object.isRequired
};
