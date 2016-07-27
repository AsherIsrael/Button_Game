import React from "react"
import * as Victory from "victory"

export default class HeatMap extends React.Component{
   render(){
      return(
         <svg width={600} height={400} className="dataComponent">
               <Victory.VictoryAxis orientation="bottom" domain={[1, 2]} tickCount={2} tickValues={['', '']} width={600} height={400} standalone={false}/>
               <Victory.VictoryAxis dependentAxis orientation="left" domain={[1, 2]} tickCount={2} tickValues={['', '']} width={600} height={400} standalone={false}/>
               <Victory.VictoryAxis dependentAxis orientation="right" domain={[1, 2]} tickCount={2} tickValues={['', '']} width={600} height={400} standalone={false}/>
               <Victory.VictoryAxis dependentAxis orientation="top" label={this.props.label} domain={[1, 2]} tickCount={2} tickValues={['', '']} width={600} height={400} standalone={false}/>
               <Victory.VictoryScatter data={this.props.clickLocations} style={{data: {fill: "red", opacity: '0.3'}}} domain={[0, 100]} size={4} width={600} height={400} standalone={false}/>
         </svg>
      )
   }
}
