app.controller("mainCtrl", function($rootScope,$http, $scope, $location, quizService, smartService) {


//setInterval(function(){ document.getElementById('refreshButton').click() }, 9000);


$scope.dontShow = true;
$scope.currQuestion = null;
$scope.bestCurrQuestion = [];
$scope.bestOfQuiz = [];
$scope.members = [];
results = [-1,-2,-3,-4];
var mgrStat = "INIT";
$scope.mgrRefresh = function() {
    if (mgrStat === "INIT") {
        smartService.getNextQuestion($rootScope.activeQuiz).then(function(q) {
           $scope.currQuestion = q;
           $scope.dontShow = true;
        })
      }
    if (mgrStat === "QUESTION") {
            smartService.updCurrQuestionToAnswer($scope.currQuestion).then(function(q) {
             $scope.currQuestion = q;  
             $scope.dontShow = false;
             $scope.answer = null;
             smartService.calcPoints($rootScope.activeQuiz,$scope.currQuestion);
      })
    }
    if (mgrStat === "ANSWER") {
            mgrStat === "QUESTION";
            smartService.updCurrAnswerToFinished($scope.currQuestion);
            smartService.getNextQuestion($rootScope.activeQuiz).then(function(q) {
               $scope.currQuestion = q;
               $scope.dontShow = true;
              })
            smartService.clnMembersFields($rootScope.activeQuiz);
      }
    if (mgrStat === "QUESTION") mgrStat = "ANSWER";
       else mgrStat = "QUESTION";
 }

 $scope.refresh = function() {
     
     smartService.getCurrMember($rootScope.activeQuiz, $rootScope.member).then(function(m) {
        $rootScope.member = m;
     })

     smartService.calcSummeries($rootScope.activeQuiz).then(function(results) {
       $scope.totMembers = results[0];
       $scope.totQuestions = results[1];
       $scope.questionNumber = results[2];
       $scope.totAnswers = results[3];
      });
      smartService.getCurrQuestion($rootScope.activeQuiz).then(function(q) {
        $scope.currQuestion = q;
        if ($scope.currQuestion === null) {
          alert("no question was selected. Quiz End? (or Error)");
          return;
        }
        if ($scope.currQuestion.status === "ANSWER") {
          $scope.dontShow = false;
          $scope.txtV = "";
          if ($scope.members.length === 0) {
             smartService.loadMembers($rootScope.activeQuiz).then(function(m) {
               $scope.members = m;
             })
          }
        }
         else  {
           $scope.dontShow = true;
           $scope.members.splice(0,$scope.members.length);
         }
      })
      
 }

 $scope.checkPoints = function (member) {
   if(member.currPoints > 0) {
     console.log("this user is shown - " + member.name);
     return true;
   }
   console.log("this user is NOT shown - " + member.name + "score: 0");
   return false;
 }

 $scope.sendAnswer = function() {
      $rootScope.member.currAns = $scope.answer;
      $rootScope.member.currDate = new Date();
      $scope.txtV = "V";
      smartService.updAnswerOfMember($rootScope.member);
 }

 $scope.showOption = function(){ 
       if ($rootScope.isMgrLogin) return {"showOn":true};
       else return {"showOff":true};
       }
    
     
})

app.factory("mainService",function(){

   
})