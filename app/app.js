var app = angular.module("quizApp",["ngRoute"]);
app.config(function ($routeProvider) {
  $routeProvider
  .when ('/',{
    templateUrl: "views/home.html",
    controller: "homeCtrl"
  })
  .when ('/prepare',{
    templateUrl: "views/prepare.html",
    controller: "prepareCtrl"
  }) 
  .when ('/main',{
    templateUrl: "views/main.html",
    controller: "mainCtrl"
  })
  // .when ('/login',{
  //   templateUrl: "views/login.html",
  //   controller: "loginCtrl"
  // })
  //  .when ('/breedDetail/:breedNameLink',{
  //   templateUrl: "views/breedDetail.html",
  //   controller: "breedDetailCtrl"
  // })


})
