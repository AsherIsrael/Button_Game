import React from "react";

export default class GameButton extends React.Component{
	handleClick(e){
		let data = {
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
		let thisClass = `grid-item grid-item--width${this.props.width} grid-item--height${this.props.height}`;
		return(
			<div className={thisClass}>
				<button className="gameButton" type="button" style={{backgroundColor: this.props.color}} onClick={(e) => this.handleClick(e)} disabled={this.props.pressed}>{this.props.display}</button>
			</div>
		)
	}
}
