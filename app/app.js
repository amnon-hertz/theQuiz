var app = angular.module("quizApp",["ngRoute", "ngSanitize"]);
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
  .when ('/final',{
    templateUrl: "views/final.html",
    controller: "finalCtrl"
  })

})
