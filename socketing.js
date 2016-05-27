var users = require("./server/controllers/users.js");
var visits = require("./server/controllers/visits.js");

module.exports = function(io){
	var eliminationBoard = [];
	var eliminationPlayers = 0;
	// var activePlayers = 0;
	var eliminationScore = 0;
	var eliminationButtonsPressed = 0;
	var inElimination = false;
	var currentUser;
	io.on("connection", function(socket){
		console.log("user connected");
		socket.on("user_login", function(username){
			console.log("user logged in");
			var data = {
				name: username
			}
			users.login(data,function(result){
				currentUser = result;
				socket.emit("logged_in", result);

			})

		})

		socket.on("disconnect", function(){
			console.log("hello?")
			if(inElimination){
				eliminationPlayers--;
			}
		})

		socket.on("elimination_game", function(){
			console.log("user attempts to join game")
			inElimination = true;
			eliminationPlayers++;
			// activePlayers++;
			startGame();
		})

		// socket.on("restart_elimination_game", function(){
		// 	eliminationPlayers++;
		// 	// activePlayers++;
		// 	// io.emit("game_started")
		// 	if(eliminationBoard.length === 0){
		// 		setTimeout(function(){
		// 			startGame();
		// 		}, 5000)
		// 	}else{
		// 		startGame();
		// 	}
		// })

		socket.on("new_eliminationBoard", function(newBoard){
			eliminationBoard = newBoard;
			let data = {
				board: eliminationBoard,
				topScore: eliminationScore
			}
			console.log("emitting eliminationBoard")
			console.log("board size:", eliminationBoard.length)
			io.emit("make_eliminationBoard", data);
		})

		socket.on("button_pressed", function(index){
			console.log("button pressed")
			if(!eliminationBoard[index].pressed){
				eliminationButtonsPressed++;
				eliminationBoard[index].pressed = true;
				eliminationBoard[index].color = "#000000";
				let data = {
					board: eliminationBoard,
					topScore: eliminationScore
				}
				console.log("board size:", eliminationBoard.length)
				io.emit("make_eliminationBoard", data);
				let points = eliminationBoard[index].width*eliminationBoard[index].height;
				console.log(points);
				socket.emit("you_scored", points)
			}
		})

		socket.on("check_score", function(score){
			console.log("check score", eliminationScore)
			if(score>eliminationScore){
				eliminationScore = score;
				io.emit("top_score", eliminationScore);
			}
			if(eliminationButtonsPressed >= eliminationBoard.length){
				console.log("game over")
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

		// socket.on("rejoin_elimination", function(){
		// 	activePlayers++;
		// 	if(activePlayers==)
		// })

		socket.on("elimination_player_left", function(){
			inElimination = false;
			console.log("player left")
			console.log("current players: ", eliminationPlayers)
			eliminationPlayers--;
			if(eliminationPlayers<0){
				eliminationPlayers = 0;
			}
			if(eliminationPlayers === 0){
				eliminationBoard = [];
				eliminationScore = 0;
			}
			console.log("players left:", eliminationPlayers)
			console.log("board size:", eliminationBoard.length)
			console.log("top score:", eliminationScore)
		})


		socket.on("finish_session", function(log){
			var data = {
				user: currentUser,
				activities: log
			}
			console.log("save log")
			visits.create(data);
		})

		function startGame(){
			console.log("start game called")
			if(eliminationBoard.length === 0){
				console.log("need eliminationBoard");
				console.log("board: ", eliminationBoard.length)
				console.log("players: ", eliminationPlayers)
				// eliminationBoard = ["holder"];
				socket.emit("need_eliminationBoard");
			}else{
				console.log("have eliminationBoard");
				// if(eliminationBoard.length === 1){
				// 	setTimeout(function(){
				// 		let data = {
				// 			board: eliminationBoard,
				// 			topScore: eliminationScore
				// 		}
				// 		console.log("waiting for board to be made elsewhere")
				// 		console.log("board size:", eliminationBoard.length)
				// 		socket.emit("make_eliminationBoard", data);
				// 	}, 1000);
				// }else{
					let data = {
						board: eliminationBoard,
						topScore: eliminationScore
					}
					console.log("board all ready to go")
					console.log("board size:", eliminationBoard.length)
					socket.emit("make_eliminationBoard", data);
				// }
			}
		}
	})
}
