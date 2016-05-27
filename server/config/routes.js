var visits = require("./../controllers/visits.js");


module.exports = function(app){
   app.get("/display", function(req, res){
      console.log("display")
      visits.index(req,res);
   });
}
