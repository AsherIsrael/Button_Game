import React from "react";

export default class GameButton extends React.Component{
	constructor(props){
		super(props);
		this.setState = this.setState.bind(this);
		this.state = {
			color: props.color,
			number: props.number,
			index: props.index,
			width: props.width,
			height: props.height,
			display: props.display
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({color: nextProps.color, width: nextProps.width, height: nextProps.height})
	}
	handleClick(e){
		var data = {
			color: this.state.color,
			width: this.state.width,
			height: this.state.height,
			number: this.state.number,
			index: this.state.index,
			x: e.pageX,
			y: e.pageY
		}
		this.props.recordAct(data);
	}
	render(){
		var thisClass = "grid-item grid-item--width"+this.state.width+" grid-item--height"+this.state.height;
		return(
			<div className={thisClass}>
				<button className="gameButton" type="button" style={{backgroundColor: this.state.color}} onClick={(e) => this.handleClick(e)} disabled={this.props.pressed}>{this.props.display}</button>
			</div>
		)
	}
}
