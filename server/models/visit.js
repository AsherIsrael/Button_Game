var mongoose = require("mongoose");

var VisitSchema = new mongoose.Schema({
   _user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
   activities: {type: Array,
      validate: {
         validator: (activities) => {
            return activities.length > 0;
         },
         message: 'Activity log cannot be empty'
      }}
}, {timestamps:true});
mongoose.model("Visit", VisitSchema);
