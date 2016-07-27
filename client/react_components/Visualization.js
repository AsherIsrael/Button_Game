import React from "react";
import axios from "axios";
import * as Victory from "victory";
import ColorPie from "./ColorPie.js";
import DataDisplay from "./DataDisplay.js";
import HeatMap from "./HeatMap.js"

export default class Visualization extends React.Component{
   render(){
      return(
            <div className="visualizationBox">
               <div className="dataContent">
                  <DataDisplay value={this.props.buttonPresses.length} title={"Buttons pressed"}/>
                  <DataDisplay value={this.props.gamesPlayed} title={"Games played"}/>
                  <DataDisplay value={this.props.visits} title={"User visits"}/>
               </div>
               <div className="centerBlock">
                  <div className="visualComponent">
                     <HeatMap clickLocations={this.props.clickLocations} label="Heatmap of Click Locations"/>
                     <ColorPie hues={this.props.hues} label={"Button Presses Distribution"}/>
                  </div>
                  <div className="spacer"></div>
                  <div className="visualComponent">
                     <HeatMap clickLocations={this.props.firstClickLocations} label="Heatmap of First Click Locations"/>
                     <ColorPie hues={this.props.firstHues} label={"First Button Press Distribution"}/>
                  </div>
               </div>
            </div>
      )
   }
}
