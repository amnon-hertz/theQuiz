app.controller("finalCtrl", function ($rootScope, $scope, $location, $http, $interval, smartService) {
  
  if ($rootScope.intrvl) {clearInterval($rootScope.intrvl);
    $rootScope.intrvl = undefined;
  }

 
  var i = 0;
  var intrvl2 = setInterval(function () { 
    smartService.loadMembers($rootScope.activeQuiz).then(function (m) {
    $scope.members = m;
    i++;
    if (i === 4) clearInterval(intrvl2);
  })

}, 6000);


  // smartService.loadMembers($rootScope.activeQuiz).then(function (m) {
  //   $scope.members = m;
  // })
})