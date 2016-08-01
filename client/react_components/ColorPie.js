import React from "react";
import * as Victory from "victory";

export default class ColorPie extends React.Component{
   render(){
      return(
         <svg width={600} height={400} className="dataComponent">
            <Victory.VictoryLabel textAnchor={"middle"} verticalAnchor={"start"} x={300} style={{fill: "grey", fontSize: "17px", fontFamily: "Helvetica", stroke: "transparent"}}>{this.props.label}</Victory.VictoryLabel>
            <g transform={"translate(100, 0)"}>
               <Victory.VictoryPie data={this.props.hues} x={(data) => data.y.length} y={(data) => data.y.length} colorScale={['#FF0015', '#FF6B00', '#FFEB00', '#95FF00', '#15FF00', '#00FF95', '#00FFEB', '#0095FF', '#0015FF', '#6B00FF', '#EB00FF', '#FF0095']} width={600} height={400} cornerRadius={100} innerRadius={3} standalone={false}/>
            </g>
         </svg>
      )
   }
}
