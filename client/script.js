// require("angular");
// var myApp = angular.module("myApp", [require('angular-route')]);
//
// console.log("front end script")
//
// myApp.config(function($routeProvider){
//    $routeProvider
//    .when("/", {
//       templateUrl: "static/partials/landing.html"
//    })
//    .when("/game", {
//       templateUrl: "static/partials/game.html"
//    })
//    .otherwise({
//       redirectTo: "/"
//    })
// })
//
// myApp.factory("userFactory", function($http){
//    var factory = {};
//    var currentUser = null;
//
//    factory.login = function(user, callback){
//       $http.post("/users", user).then(function(result){
//          currentUser = result.data;
//          callback(currentUser);
//       })
//    }
//
//    factory.currentUser = function(callback){
//       callback(currentUser);
//    }
//
//    return factory;
// })
//
// myApp.factory("gameFactory", function($http){
//    var factory = {};
//    var actions = [];
//
//    factory.logAction = function(action, callback){
//       actions.push(action);
//       callback();
//    }
// })

// myApp.controller("usersController", function(userFactory, $location){
//    var that = this;
//
//    userFactory.currentUser(function(user){
//       if(user){
//          userFactory.logout();
//       }
//    })
//
//    this.login = function(){
//       userFactory.login(this.userInfo, function(loggedIn){
//          that.userInfo = {};
//          $location.url("/game");
//       })
//    }
// })

// myApp.controller("gamesController", function(userFactory, gameFactory, $location){
//    var that = this;
//
//    userFactory.currentUser(function(user){
//       if(!user){
//          $location.url("/");
//       }else{
//          that.currentUser = user;
//       }
//    })
//
//
// })
