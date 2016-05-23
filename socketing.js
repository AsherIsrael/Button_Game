var users = require("./server/controllers/users.js")

module.exports = function(io){
	var board = [];
	io.on("connection", function(socket){
		console.log("user connected");
		socket.on("user_login", function(username){
			var data = {
				name: username
			}
			users.login(data,function(result){
				socket.emit("logged_in", result);
				if(board.length === 0){
					console.log("need board");
					board = ["holder"];
					socket.emit("need_board");
				}else{
					console.log("have board");
					if(board.length == 1){
						setTimeout(function(){
							socket.emit("make_board", board);
						}, 1000);
					}else{
						socket.emit("make_board", board);
					}
				}
			})

		})

		socket.on("new_board", function(newBoard){
			board = newBoard;
			console.log("emitting board")
			io.emit("make_board", board);
		})
	})
}
