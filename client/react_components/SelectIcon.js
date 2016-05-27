import React from "react";
// var ReactRouter = require("react-router");
// var withRouter = ReactRouter.withRouter
// import { withRouter } from "react-router";

export default class SelectIcon extends React.Component{
   constructor(props){
      super(props);
      this.state = {
         name: props.name,
         component: props.component,
         description: props.description
      }
   }
   redirect(){
      this.props.logIt(this.state.name);
      console.log("redirecting")
      this.context.router.push(this.props.component)
   }

   render(){
      var source = "../static/images/"+ this.state.component +".png";

      return(
         <div className="col-md-5">
            <div className="col-md-2"></div>
            <div className="col-md-8 center-block">
               <button className="btn btn-secondary selectButton" onClick={() => this.redirect()}>
               <img className="selectButton" src={source} alt={this.state.component}/>
               </button>
               <h4>{this.state.name}</h4>
               <br/>
               <p>{this.state.description}</p>
            </div>
            <div className="col-md-2"></div>
         </div>
      )
   }
}
SelectIcon.contextTypes = {
   router: React.PropTypes.object.isRequired
};
// export default withRouter(SelectIcon)
