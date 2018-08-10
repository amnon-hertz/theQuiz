app.controller("mainCtrl", function($rootScope,$http, $scope, $interval, $location, smartService) {

$rootScope.intrvl = setInterval(function(){ document.getElementById('refreshButton').click() }, 6000);

// $rootScope.intrvl = $interval(  function() {
//       document.getElementById('refreshButton').click()} ,6000);

$scope.dontShow = true;
$scope.currQuestion = null;
$scope.answer = null;
$scope.bestCurrQuestion = [];
$scope.bestOfQuiz = [];
$scope.members = [];
results = [-1,-2,-3,-4];
var mgrStat = "INIT";
$scope.sendText = "שלח התשובה";

$scope.totMembers = 0;
$scope.totQuestions = 0;
$scope.questionNumber = 0;
$scope.totAnswers = 0;

counter = 0;


window.onbeforeunload = function() {
  return 'לצאת מדף זה?';
}

$scope.mgrRefresh = function() {
    if ($scope.currQuestion !== null && $scope.totQuestions === $scope.questionNumber && $scope.currQuestion.status === "ANSWER") 
    {
       alert("חידון הסתיים. מייד יועברו כולם למסך סיום");
       return;
    }

    if (mgrStat === "INIT") {
        smartService.getNextQuestion($rootScope.activeQuiz).then(function(q) {
           $scope.currQuestion = q;
           $rootScope.member.name = "מנהל החידון";
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
            smartService.updCurrAnswerToFinished($scope.currQuestion).then(function(q) {  
            
              smartService.getNextQuestion($rootScope.activeQuiz).then(function(q) {
                 $scope.currQuestion = q;
                 $scope.dontShow = true;
              })
          });
          smartService.clnMembersFields($rootScope.activeQuiz);
      }
    if (mgrStat === "QUESTION") mgrStat = "ANSWER";
       else mgrStat = "QUESTION";
 }

 $scope.refresh = function() {
     
    if (!$rootScope.isMgrLogin) {
         smartService.getCurrMember($rootScope.activeQuiz, $rootScope.member).then(function(m) {
            $rootScope.member = m;
         })
      }
         smartService.calcSummeries($rootScope.activeQuiz).then(function(results) {
         $scope.totMembers = results[0];
         $scope.totQuestions = results[1];
         $scope.questionNumber = results[2];
         $scope.totAnswers = results[3];
        });
        if ($scope.totQuestions === $scope.questionNumber && $scope.currQuestion.status === "ANSWER") 
        {
           counter++;
           if (counter >= 4)  $location.path("/final"); 
        }
    
      smartService.getCurrQuestion($rootScope.activeQuiz).then(function(q) {
        $scope.currQuestion = q;
        if ($scope.currQuestion === null) {
          //alert("לא נבחרה אף שאלה. סוף החידון/שגיאה?");
          console.log("לא נבחרה אף שאלה. סוף החידון/שגיאה?");
          return;
        }
        if ($scope.currQuestion.status === "ANSWER") {
          $scope.answer = null;
          $scope.dontShow = false;
          $scope.sendText = "שלח התשובה";
          // if ($scope.members.length === 0) {
             smartService.loadMembers($rootScope.activeQuiz).then(function(m) {
               $scope.members.splice(0,$scope.members.length);
               for (i=0 ; i< m.length ; i++){
                  $scope.members.push(m[i]);
               }
             })
          // }
        }
         else  {
           $scope.dontShow = true;
           $scope.members.splice(0,$scope.members.length);
         }
      })
      
 }

 $scope.checkPoints = function (member) {
  if(member.currPoints > 0) {
    return true;
  }
  return false;
}

$scope.checkPoints2 = function (ind) {
  if(ind > 5) {
    return false;
  }
  return true;
}

 $scope.sendAnswer = function() {
      $rootScope.member.currAns = $scope.answer;
      $rootScope.member.currDate = new Date();
      $scope.sendText = "שלח תיקון";
      smartService.updAnswerOfMember($rootScope.member);
 }

 $scope.showOption = function(){ 
       if ($rootScope.isMgrLogin) return {"showOn":true};
       else return {"showOff":true};
       }
    
     
})

app.factory("mainService",function(){

   
})