var users = require("./server/controllers/users.js");
var visits = require("./server/controllers/visits.js");

module.exports = function(io){
	var eliminationBoard = [];
	var eliminationPlayers = 0;
	var eliminationScore = 0;
	var eliminationButtonsPressed = 0;
	var inElimination = false;
	var currentUser;
	io.on("connection", function(socket){
		socket.on("user_login", function(username){
			var data = {
				name: username
			}
			users.login(data,function(result){
				currentUser = result;
				socket.emit("logged_in", result);

			})

		})

		socket.on("disconnect", function(){
			if(inElimination){
				eliminationPlayers--;
				if(eliminationPlayers<0){
					eliminationPlayers = 0;
				}
				if(eliminationPlayers === 0){
					eliminationBoard = [];
					eliminationScore = 0;
					eliminationButtonsPressed = 0;
				}
			}
		})

		socket.on("elimination_game", function(){
			inElimination = true;
			eliminationPlayers++;
			startGame();
		})

		socket.on("new_eliminationBoard", function(newBoard){
			eliminationBoard = newBoard;
			var data = {
				board: eliminationBoard,
				topScore: eliminationScore
			}
			io.emit("make_eliminationBoard", data);
		})

		socket.on("button_pressed", function(index){
			if(!eliminationBoard[index].pressed){
				eliminationButtonsPressed++;
				eliminationBoard[index].pressed = true;
				eliminationBoard[index].color = "#000000";
				var data = {
					board: eliminationBoard,
					topScore: eliminationScore
				}
				io.emit("make_eliminationBoard", data);
				var points = eliminationBoard[index].width*eliminationBoard[index].height;
				socket.emit("you_scored", points)
			}
		})

		socket.on("check_score", function(score){
			if(score>eliminationScore){
				eliminationScore = score;
				io.emit("top_score", eliminationScore);
			}
			if(eliminationButtonsPressed >= eliminationBoard.length){
				eliminationBoard = [];
				eliminationPlayers = 0;
				io.emit("game_over", eliminationScore);
				eliminationScore = 0;
				eliminationButtonsPressed = 0;
				if(eliminationBoard.length === 0){
					setTimeout(function(){
						startGame();
					}, 5000)
				}else{
					startGame();
				}
			}
		})

		socket.on("elimination_player_left", function(){
			inElimination = false;
			eliminationPlayers--;
			if(eliminationPlayers<0){
				eliminationPlayers = 0;
			}
			if(eliminationPlayers === 0){
				eliminationBoard = [];
				eliminationScore = 0;
				eliminationButtonsPressed = 0;
			}
		})


		socket.on("finish_session", function(log){
			var data = {
				user: currentUser,
				activities: log
			}
			visits.create(data);
		})

		function startGame(){
			if(eliminationBoard.length === 0){
				socket.emit("need_eliminationBoard");
			}else{
					var data = {
						board: eliminationBoard,
						topScore: eliminationScore
					}
					socket.emit("make_eliminationBoard", data);
				// }
			}
		}
	})
}
