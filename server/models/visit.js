var mongoose = require("mongoose");

var VisitSchema = new mongoose.Schema({
   _user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
   activities: []
}, {timestamps:true});
mongoose.model("Visit", VisitSchema);
