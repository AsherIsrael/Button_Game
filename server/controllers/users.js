var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = (function(){
   return{
      login: function(req,callback){
         User.findOne({name: req.name}, function(err, user){
            if(user){
               user.visits += 1;
               user.save(function(err){
                  callback(user);
               })
            }else{
               var user = new User({name: req.name});
               user.save(function(err){
                  if(err){
                     console.log(err);
                  }else{
                     user.visits += 1;
                     user.save();
                     callback(user);
                  }
               })
            }
         })
      }
   }
})();
