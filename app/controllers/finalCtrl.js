app.controller("finalCtrl", function($rootScope,$scope, $location, $http, $interval, smartService) {

    smartService.loadMembers($rootScope.activeQuiz).then(function(m) {
           $scope.members = m;
        
      })


    })