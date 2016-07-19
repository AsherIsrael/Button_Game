import React from "react";


export default class Login extends React.Component{
   constructor(){
      super();
      this.setState = this.setState.bind(this);
      this.login = this.login.bind(this);
      this.state = {
         valid: false,
         username: ""
      }
   }
   login(e){
      e.preventDefault();
      var user = this.refs['username'].value;
      if(this.state.valid){
         this.props.socket.emit("user_login", this.state.username)
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
            <form name="form" onSubmit={this.login}>
               <div className="row">
                  <div className={formClass}>
                     <input className={inputClass} type="text" value={this.state.username} onChange={() => this.isValid()} ref="username"/>
                     <span className="input-group-btn"><button type="submit" className={btnClass}>Enter</button></span>
                  </div>
                  <div className="col-md-6"></div>
               </div>
            </form>
         </div>
      )
   }
}
