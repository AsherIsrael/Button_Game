import redux from "redux";
import reactRedux from "react-redux";
import io from "socket.io-client";

var socket = io.connect();

var initialState = {
   socket: socket,
   username: null,
   activities: [],
   elimBoard: [],
   elimTopScore: 0,
   elimScore: 0
}

function reducer(state, action){
   return state;
}

function mapStateToProps(state){
   return{
      socket: state.socket,
      username: state.username,
      activities: state.activities,
      elimBoard: state.elimBoard,
      elimTopScore: state.elimTopScore,
      elimScore: state.elimScore
   }
}

var store = redux.createStore(reducer, initialState);
var reduxConnection = reactRedux.connect(mapStateToProps);

module.exports = {store: store, reduxConnection: reduxConnection}
