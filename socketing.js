var users = require("./server/controllers/users.js")

module.exports = function(io){
	var eliminationBoard = [];
	io.on("connection", function(socket){
		console.log("user connected");
		socket.on("user_login", function(username){
			var data = {
				name: username
			}
			users.login(data,function(result){
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
	})
}
