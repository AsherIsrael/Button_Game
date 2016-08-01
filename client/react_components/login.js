import React from "react";
import { Link } from "react-router"


export default class Login extends React.Component{
   constructor(){
      super();
      this.setState = this.setState.bind(this);
      // this.login = this.login.bind(this);
      this.state = {
         // valid: false,
         username: ""
      }
   }
   login(e){
      e.preventDefault();
      if(this.state.username.langth > 3){
         this.props.socket.emit("user_login", this.state.username)
      }
   }
   handleChange(){
      var user = this.refs['username'].value;
      // if(user.length < 4){
      //    this.setState({valid: false});
      // }else{
      //    this.setState({valid: true});
      // }
      this.setState({username: user})
   }
   render(){
      var errorClass = "invisible";
      var inputClass = "form-control";
      var btnClass = "btn btn-primary";
      var formClass = "input-group";
      if(this.state.username.length < 4 && this.state.username.length > 0){
         errorClass = "";
         inputClass = "form-control form-control-danger";
         btnClass = "btn btn-danger";
         formClass = "input-group has-danger";
      }else if(this.state.username.length >= 4){
         inputClass = "form-control form-control-success";
         btnClass = "btn btn-success";
         formClass = "input-group has-success";
      }
      return(
         <div className="container-fluid" id="loginPage">
            <div className="col-md-3 col-xs-1"></div>
            <div className="contentBox col-md-6 col-xs-10">
               <div className="col-md-1"></div>
               <span className="jukeBox">|Color Clickers¬</span>
               <div className="col-md-1"></div>
               <div className="row">
                  <div className="col-md-1"></div>
                  <div className="col-md-10">
                     <h2>Login</h2>
                     <span ref="error" className={errorClass}>Name must be at least 4 characters</span>
                     <form name="form" onSubmit={() => this.login()}>
                           <div className={formClass}>
                              <input className={inputClass} type="text" value={this.state.username} onChange={() => this.handleChange()} ref="username"/>
                              <span className="input-group-btn"><button type="submit" className={btnClass}>Enter</button></span>
                           </div>
                     </form>
                  </div>
                  <div className="col-md-1"></div>
               </div>
               <div className="row">
                  <div className="col-md-10"></div>
                  <div className="col-md-2">
                     <Link to="/visualize"><button className="btn">Data Analysis</button></Link>
                  </div>
               </div>
            </div>
            <div className="col-md-3 col-xs-1"></div>
         </div>
      )
   }
}

Login.contextTypes = {
   router: React.PropTypes.object.isRequired
};
