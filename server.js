var express = require("express");
var http = require('http');
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var http = http.Server(app);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./client")));
require("./server/config/mongoose.js");
//require("./server/config/routes.js")(app);


var io = require("socket.io")(http);
require("./socketing.js")(io);

http.listen(6174, function(){
	console.log("SERVER LISTENING");
});
console.log("does this happen")
