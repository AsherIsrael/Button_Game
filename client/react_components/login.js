import React from "react";
import io from "socket.io";

export default class Login extends React.Component{
   constructor(){
      this.state = {
         socket: io.connect(),
         valid: true
      }
   }
   login(){
      var user = this.refs["username"];
      if(user.length < 4){
         this.setState({valid: false})
      }else{
         this.state.socket.emit("user_login")
      }
   }
   isValid(){
      var user = this.refs["username"];
      if(user.length < 4){
         this.setState({valid: false});
      }else{
         this.setState({vlaid: true});
      }
   }
   render(){
      var errorClass = "text-hide";
      if(!this.state.valid){
         errorClass = "";
      }
      return{
         <div className="container">
            <br/><br/><br/><br/><br/><br/>
            <h2>Login</h2>
            <br/>
            <span ref="error" className={errorClass}>Name must be at least 4 characters</span>
            <form name="form">
               <div className="row">
                  <div className="input-group col-md-6">
                     <input className="form-control" type="text" onChange={this.isValid()} ref="username"/>
                     <span className="input-group-btn"><button className="btn btn-primary" onClick={this.login}>Enter</button></span>
                  </div>
                  <div className="col-md-6"></div>
               </div>
            </form>
         </div>
      }
   }
}
