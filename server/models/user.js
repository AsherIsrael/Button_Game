var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
   name: {type: String, required: true},
   visits: {type: Number, default: 0}
}, {timestamps:true});
mongoose.model("User", UserSchema);
