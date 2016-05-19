import React from "react";
var ReactRouter = require("react-router");
var withRouter = ReactRouter.withRouter


class Login extends React.Component{
   constructor(props){
      super(props);
      console.log("login loaded");
      this.setState = this.setState.bind(this);
      this.login = this.login.bind(this);
      this.state = {
         socket: props.route.socket,
         valid: false,
         username: ""
      }
   }
   login(){
      var user = this.refs['username'].value;
      if(this.state.valid){
         this.state.socket.emit("user_login", this.state.username)
         this.props.router.push("/game")
      }
   }
   isValid(){
      var user = this.refs['username'].value;
      if(user.length < 4){
         this.setState({valid: false});
      }else{
         this.setState({valid: true});
      }
      this.setState({username: user})
   }
   render(){
      var errorClass = "text-hide";
      var inputClass = "form-control";
      var btnClass = "btn btn-primary";
      var formClass = "input-group col-md-6";
      if(!this.state.valid && this.state.username.length > 0){
         errorClass = "";
         inputClass = "form-control form-control-danger";
         btnClass = "btn btn-danger";
         formClass = "input-group has-danger col-md-6";
      }else if(this.state.valid){
         inputClass = "form-control form-control-success";
         btnClass = "btn btn-success";
         formClass = "input-group has-success col-md-6";
      }
      return(
         <div className="container">
            <br/><br/><br/><br/><br/><br/>
            <h2>Login</h2>
            <br/>
            <span ref="error" className={errorClass}>Name must be at least 4 characters</span>
            <form name="form">
               <div className="row">
                  <div className={formClass}>
                     <input className={inputClass} type="text" value={this.state.username} onChange={() => this.isValid()} ref="username"/>
                     <span className="input-group-btn"><button type="button" className={btnClass} onClick={() => this.login()}>Enter</button></span>
                  </div>
                  <div className="col-md-6"></div>
               </div>
            </form>
         </div>
      )
   }
}
Login.contextTypes = {
   router: React.PropTypes.any.isRequired
};
export default withRouter(Login)