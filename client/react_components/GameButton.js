import React from "react";

export default class GameButton extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			color: props.color,
			width: props.width,
			height: props.height,
			delay: props.delay
		}
	}
	render(){
		return(
			<button style={{backgroundColor: this.state.color}} onClick={this.props.recordAct(this.state)}>test</button>
		)
	}
}