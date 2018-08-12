
app.controller("homeCtrl", function($rootScope,$scope, $location, $http, $interval, homeService, smartService) {
$rootScope.linkJson = "https://json-server-heroku-zvfntlqjtw.now.sh";

// if (angular.isDefined($rootScope.intrvl)) {
//   $interval.cancel($rootScope.intrvl);
//   $rootScope.intrvl = undefined;
// }


$scope.gotoHome = function(){
 $location.path("/home");
};
$rootScope.activeQuiz = smartService.getActiveQuiz();
$rootScope.isMgrLogin = false;
$rootScope.member = null;

$scope.mgrLogin = function(){
  if ($scope.mgrName === "1" && $scope.mgrPass === "1") 
  {
    $rootScope.isMgrLogin = true;   
    $location.path("/prepare");         
  }
}

$scope.memberLogin = function(){
      if ($rootScope.activeQuiz === null) {
        alert("לא נבחר אף חידון. אשר את מנהל החידון");
        return;
      }
      if ($scope.quizName !== $rootScope.activeQuiz.name || $scope.quizNumber !== $rootScope.activeQuiz.num) {
        alert("שם החידון או קוד החידון אינו תואם. בבקשה נסה שוב");
        return;
      }
      var mmbr = new homeService.newMember(null,$rootScope.activeQuiz.id, $scope.memberName, -999999, "",  0, 0); 
      $http.post($rootScope.linkJson + '/member/',mmbr).then(function(response) {            
          $rootScope.member = response.data;
          $location.path("/main");
               })
}
 $http.get($rootScope.linkJson + '/quiz?status=' + "OPENED").then(function(response) {
     if (response.data.length === 0) return; 
     $rootScope.activeQuiz = response.data[0];     
 });

});

app.factory("homeService",function(){
    function Member(id, quizId, name, currAns, currDate, currPoints, totPoints) {

      this.id = id;
      this.quizId = quizId;
      this.name = name;
      this.currAns = currAns;
      this.currDate = currDate;
      this.currPoints = currPoints;
      this.totPoints = totPoints;
    }
     
     return {
       newMember : Member     
     }
})