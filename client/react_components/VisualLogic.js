import React from "react";
import axios from "axios";
import * as Victory from "victory";
import Visualization from "./Visualization.js"

export default class VisualLogic extends React.Component{
   constructor(){
      super();
      this.state = {
         data: null,
         buttonPresses: [],
         gamesPlayed: 0,
         firstButtonsPressed: [],
         visitLengths: [],
         visits: 0,
         clickLocations: [],
         firstClickLocations: [],
         hues: [],
         firstHues: []
      }
   }
   componentWillMount(){
      axios.get('/display').then( (res) => {
                  console.log("Got this: ", res);
                  this.processData(res.data)
      })
      // fetch('http://localhost:6174/display', {method: 'get', origin: 'localhost:6174', mode: 'no-cors', 'content-type': 'json'})
      //    .then( (res) => {
      //          // this.setState({data: res.data})
      //    })



      // axios.get('colorclickers.com/display')

   }
   processData(data){
      // console.log(data);
      let buttonPresses = [];
      let gamesPlayed = 0;
      let firstButtonsPressed = [];
      let visitLengths = [];
      let visits = 0;
      let firstButtonPress = true;
      let clickLocations = [];
      let firstClickLocations = [];
      for(let visit of data){
         visits++;
         let arrivalTime = visit.activities[0].data.time;
         for(let action of visit.activities){
            switch(action.type){
               case "buttonPress":
                  buttonPresses.push(action);
                  let headbar;
                  if(action.data.windowWidth > 767){
                     headbar = action.data.windowHeight*.09
                  }else{
                     headbar = action.data.windowHeight/5
                  }
                  let x = action.data.x/action.data.windowWidth * 100;
                  let y = 100 - ((action.data.y-headbar)/(action.data.windowHeight-headbar) * 100);
                  let location = {
                     x: x,
                     y: y
                  }
                  clickLocations.push(location);
                  if(firstButtonPress){
                     firstButtonsPressed.push(action);
                     firstClickLocations.push(location);
                     }
                  firstButtonPress = false;
                  break;
               case "gameStart":
                  gamesPlayed++;
                  firstButtonPress = true
                  break;
               case "logout":
                  let visitLength = action.data.time - arrivalTime;
                  visitLengths.push(visitLength);
                  break;
               default:
                  console.log(action.type);
                  break;
            }
         }
      }
      this.setState({buttonPresses: buttonPresses,
         gamesPlayed: gamesPlayed,
         firstButtonsPressed: firstButtonsPressed,
         visitLengths: visitLengths,
         visits: visits,
         clickLocations: clickLocations,
         firstClickLocations: firstClickLocations});
      let averageVisit = this.state.visitLengths.reduce( (sum, visit) => sum + visit ) / this.state.visitLengths.length / 1000
      console.log(`${averageVisit} seconds`);
      let hues = this.hueHistogram(this.state.buttonPresses);
      this.setState({hues: hues});
      let firstHues = this.hueHistogram(this.state.firstButtonsPressed);
      this.setState({firstHues: firstHues});
   }
   hueHistogram(buttonData){
      let colors = buttonData.map( (item) => item.data.color );
      let hues = ([{x: 'red', y: []}, {x: 'orange', y: []}, {x: 'yellow', y: []}, {x: 'lime', y: []}, {x: 'green', y: []}, {x: 'spring green', y: []}, {x: 'teal', y: []}, {x: 'cerulean', y: []}, {x: 'blue', y: []}, {x: 'purple', y: []}, {x: 'fuschia', y: []}, {x: 'pink', y: []}]);
      for(let color of colors){
         var hex = color.substring(1);

         var r = parseInt(hex.substring(0,2),16)/255;
         var g = parseInt(hex.substring(2,4),16)/255;
         var b = parseInt(hex.substring(4,6),16)/255;

         var max = Math.max.apply(Math, [r,g,b]);
         var min = Math.min.apply(Math, [r,g,b]);

         var chr = max-min;
         var hue = 0;
         var val = max;
         var sat = 0;

         if (val > 0) {
            sat = chr/val;
            if (sat > 0) {
               if (r == max) {
                  hue = 60*(((g-min)-(b-min))/chr);
                  if (hue < 0) {hue += 360;}
               } else if (g == max) {
                  hue = 120+60*(((b-min)-(r-min))/chr);
               } else if (b == max) {
                  hue = 240+60*(((r-min)-(g-min))/chr);
               }
            }
         }

         // color = hue;
         // color.sat = sat;
         // color.val = val;
         console.log(hue);
         switch(true){
            case (hue > 340 || hue <= 10):
               console.log('red');
               hues[0].y.push(color);
               break;
            case (hue > 10 && hue <= 40):
               console.log('orange');
               hues[1].y.push(color);
               break;
            case (hue > 40 && hue <= 70):
               console.log('yellow');
               hues[2].y.push(color);
               break;
            case (hue > 70 && hue <= 100):
               console.log('lime');
               hues[3].y.push(color);
               break;
            case (hue > 100 && hue <= 130):
               console.log('green');
               hues[4].y.push(color);
               break;
            case (hue > 130 && hue <= 160):
               console.log('spring green');
               hues[5].y.push(color);
               break;
            case (hue > 160 && hue <= 190):
               console.log('teal');
               hues[6].y.push(color);
               break;
            case (hue > 190 && hue <= 220):
               console.log('cerulean');
               hues[7].y.push(color);
               break;
            case (hue > 220 && hue <= 250):
               console.log('blue');
               hues[8].y.push(color);
               break;
            case (hue > 250 && hue <= 280):
               console.log('purple');
               hues[9].y.push(color);
               break;
            case (hue > 280 && hue <= 310):
               console.log('fuschia');
               hues[10].y.push(color);
               break;
            case (hue > 310 && hue <= 340):
               console.log('pink');
               hues[11].y.push(color);
               break;
         }
      }
      return hues;
   }
   render(){
      let firstColors = this.state.firstButtonsPressed.map((item) => item.data.color );
      // console.log(this.state.firstButtonsPressed);

      return(
         <Visualization buttonPresses={this.state.buttonPresses} firstClickLocations={this.state.firstClickLocations} gamesPlayed={this.state.gamesPlayed} visits={this.state.visits} visitLengths={this.state.visitLengths} clickLocations={this.state.clickLocations} hues={this.state.hues} firstHues={this.state.firstHues}/>
      )
   }
}
