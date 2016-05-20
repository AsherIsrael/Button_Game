import React from "react";

export default class GameButton extends React.Component{
	constructor(props){
		super(props);
		this.setState = this.setState.bind(this);
		this.state = {
			color: props.color,
			width: props.width,
			height: props.height,
			delay: props.delay
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({color: nextProps.color, width: nextProps.width, height: nextProps.height})
	}
	handleClick(e){
		console.log(e.pageX);
		var data = {
			color: this.state.color,
			width: this.state.width,
			height: this.state.height,
			x: e.pageX,
			y: e.pageY
		}
		this.props.recordAct(data);
	}
	render(){
		var thisClass = "grid-item "+this.state.width+" "+this.state.height;
		return(
			<div className={thisClass}>
				<button className="gameButton" type="button" style={{backgroundColor: this.state.color}} onClick={(e) => this.handleClick(e)}></button>
			</div>
		)
	}
}
