var mongoose = require("mongoose");
var Visit = mongoose.model("Visit");

module.exports = (function(){
   return{
      index: function(req,res){
         Visit.find({}, function(err, result){
            if(err){
               console.log(err);
            }else{
               res.json(result);
            }
         })
      },
      create: function(req){
         console.log("saving log")
         var visit = new Visit({
            _user: req.user,
            activities: req.activities
         })
         visit.save();
      }
   }
})();
