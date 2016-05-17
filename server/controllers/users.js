var mongoose = require("mongoose");
var User = mongoose.model("User");
module.exports = (function(){
   return{
      login: function(req,res){
         User.findOne({name: req.body.name}, function(err, user){
            if(user){
               res.json(user);
            }else{
               var user = new User({name: req.body.name});
               user.save(function(err){
                  if(err){
                     console.log(err);
                  }else{
                     res.json(user);
                  }
               })
            }
         })
      }
   }
})();
