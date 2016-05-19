var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = (function(){
   return{
      login: function(req,callback){
         User.findOne({name: req.name}, function(err, user){
            if(user){
               console.log("found user");
               callback(user);
            }else{
               var user = new User({name: req.name, visitTime: req.vistTime});
               user.save(function(err){
                  if(err){
                     console.log(err);
                  }else{
                     console.log("new user");
                     callback(user);
                  }
               })
            }
         })
      }
   }
})();
