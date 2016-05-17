var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./client")));
require("./server/config/mongoose.js");
require("./server/config/routes.js")(app);

var server = app.listen(6174, function(){});

var io = require("socket.io").listen(server);
io.sockets.on("connection", function(socket){

})
