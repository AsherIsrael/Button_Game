import React from "react";
// var ReactRouter = require("react-router");
// var withRouter = ReactRouter.withRouter
// import { withRouter } from "react-router";

export default class SelectIcon extends React.Component{
   constructor(props){
      super(props);
      this.state = {
         name: props.name,
         component: props.component
      }
   }
   redirect(){
      this.props.logIt(this.state.name);
      console.log("redirecting")
      this.context.router.push(this.props.component)
   }

   render(){
      return(
         <div className="col-md-3">
            <div className="col-md-2"></div>
            <button className="btn btn-primary" onClick={() => this.redirect()}>
               {this.state.name}
            </button>
            <div className="col-md-2"></div>
         </div>
      )
   }
}
SelectIcon.contextTypes = {
   router: React.PropTypes.object.isRequired
};
// export default withRouter(SelectIcon)
