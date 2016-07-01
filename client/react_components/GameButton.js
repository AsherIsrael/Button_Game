import React from "react";

export default class GameButton extends React.Component{
	// constructor(props){
	// 	super(props);
	// 	this.setState = this.setState.bind(this);
	// 	this.props = {
	// 		color: props.color,
	// 		number: props.number,
	// 		index: props.index,
	// 		width: props.width,
	// 		height: props.height,
	// 		display: props.display
	// 	}
	// }
	// componentWillReceiveProps(nextProps){
	// 	this.setState({color: nextProps.color, width: nextProps.width, height: nextProps.height})
	// }
	handleClick(e){
		var data = {
			color: this.props.color,
			width: this.props.width,
			height: this.props.height,
			number: this.props.number,
			index: this.props.index,
			x: e.pageX,
			y: e.pageY
		}
		this.props.recordAct(data);
	}
	render(){
		var thisClass = "grid-item grid-item--width"+this.props.width+" grid-item--height"+this.props.height;
		return(
			<div className={thisClass}>
				<button className="gameButton" type="button" style={{backgroundColor: this.props.color}} onClick={(e) => this.handleClick(e)} disabled={this.props.pressed}>{this.props.display}</button>
			</div>
		)
	}
}
