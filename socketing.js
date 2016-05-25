var users = require("./server/controllers/users.js");
var visits = require("./server/controllers/visits.js");

module.exports = function(io){
	var eliminationBoard = [];
	var currentUser;
	io.on("connection", function(socket){
		console.log("user connected");
		socket.on("user_login", function(username){
			var data = {
				name: username
			}
			users.login(data,function(result){
				currentUser = result;
				socket.emit("logged_in", result);

			})

		})

		socket.on("elimination_game", function(){
			if(eliminationBoard.length === 0){
				console.log("need eliminationBoard");
				eliminationBoard = ["holder"];
				socket.emit("need_eliminationBoard");
			}else{
				console.log("have eliminationBoard");
				if(eliminationBoard.length == 1){
					setTimeout(function(){
						socket.emit("make_eliminationBoard", eliminationBoard);
					}, 1000);
				}else{
					socket.emit("make_eliminationBoard", eliminationBoard);
				}
			}

		})

		socket.on("new_eliminationBoard", function(newBoard){
			eliminationBoard = newBoard;
			console.log("emitting eliminationBoard")
			io.emit("make_eliminationBoard", eliminationBoard);
		})

		socket.on("display_records", function(){
			visits.index(function(activities){
				socket.emit("record_data", activities);
			})
		})

		socket.on("finish_session", function(log){
			var data = {
				user: currentUser,
				activities: log
			}
			console.log("save log")
			visits.create(data);
		})
	})
}
