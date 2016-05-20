var users = require("./server/controllers/users.js")

module.exports = function(io){
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
	})
}
