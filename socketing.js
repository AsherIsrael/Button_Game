var users = require("./server/controllers/users.js");
var visits = require("./server/controllers/visits.js");

module.exports = function(io){
	var eliminationBoard = [];
	var eliminationPlayers = 0;
	var currentTopScore = 0;
	var eliminationButtonsPressed = 0;
	io.on("connection", function(socket){
		var currentUser;
		var activities = [];
		var inElimination = false;

		socket.on("user_login", function(username){
			var data = {
				name: username
			}
			users.login(data,function(result){
				currentUser = result;
				socket.emit("logged_in", result);
			})

		})


		socket.on("log_activity", function(activity){
			activities.push(activity);
		})

		socket.on("elimination_game", function(){
			inElimination = true;
			eliminationPlayers++;
			socket.join('elimination')
			console.log("player joined, total players: ", eliminationPlayers);
			startGame();
		})

		socket.on("new_eliminationBoard", function(newBoard){
			if(eliminationBoard.length === 0){
				eliminationBoard = newBoard;
				var data = {
					board: eliminationBoard,
					topScore: currentTopScore
				}
				io.to('elimination').emit("make_eliminationBoard", data);
			}
		})

		socket.on("button_pressed", function(index){
			if(!eliminationBoard[index].pressed){
				eliminationButtonsPressed++;
				eliminationBoard[index].pressed = true;
				eliminationBoard[index].color = "#000000";
				var data = {
					board: eliminationBoard,
					topScore: currentTopScore
				}
				io.to('elimination').emit("make_eliminationBoard", data);
				socket.emit("you_scored", 1)
			}
		})

		socket.on("check_score", function(score){
			if(score>currentTopScore){
				currentTopScore = score;
				io.to('elimination').emit("top_score", currentTopScore);
			}

			if(eliminationButtonsPressed >= eliminationBoard.length || currentTopScore >= 10){
				eliminationBoard = [];
				io.to('elimination').emit("game_over", currentTopScore);
				currentTopScore = 0;
				eliminationButtonsPressed = 0;
				setTimeout(function(){
					console.log("starting game");
					startGame();
				}, 4000)
			}
		})

		socket.on("elimination_player_left", function(){
			ifGameOver();
			inElimination = false;
			socket.leave('elimination');
		})

		socket.on("disconnect", function(){
			ifGameOver();
			if(activities.length > 0){
				console.log("did something");
				var data = {
					user: currentUser,
					activities: activities
				}
				visits.create(data);
			}
		})

		function startGame(){
			if(eliminationBoard.length === 0){
				io.to('elimination').emit("need_eliminationBoard");
			}else{
					var data = {
						board: eliminationBoard,
						topScore: currentTopScore
					}
					socket.emit("make_eliminationBoard", data);
			}
		}

		function ifGameOver(){
			if(inElimination){
				eliminationPlayers--;
				console.log("player left, total players: ", eliminationPlayers);
				if(eliminationPlayers <= 0){
					eliminationBoard = [];
					currentTopScore = 0;
					eliminationButtonsPressed = 0;
					eliminationPlayers = 0;
				}
			}
		}
	})
}
