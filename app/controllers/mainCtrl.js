app.controller("mainCtrl", function($rootScope,$http, $scope, $location, quizService, smartService) {

$scope.dontShow = true;
$scope.currQuestion = null;
$scope.bestCurrQuestion = [];
$scope.bestOfQuiz = [];
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
            //clnMembersFields($rootScope.activeQuiz);
      }
    if (mgrStat === "QUESTION") mgrStat = "ANSWER";
       else mgrStat = "QUESTION";
 }

 $scope.refresh = function() {
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
        }
         else  $scope.dontShow = true;

      })
      smartService.get3best($rootScope.activeQuiz).then(function(m) {
        $scope.best3Curr = m;
        
      })
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
    // function Quiz(id, name, num, status) {
    //   this.id = id;
    //   this.name = name;
    //   this.num = num;
    //   this.status = status;
    // }
    
    // function Question(id, quizId, txt1, txt2, img1, answer, answerTxt, img2, status) {
    //   this.id = id;
    //   this.quizId = quizId;
    //   this.txt1 = txt1; 
    //   this.txt2 = txt2; 
    //   this.img1 = img1;
    //   this.answer = answer;
    //   this.answerTxt = answerTxt;
    //   this.img2 = img2;
    //   this.status = status;    
    // }
     
    //  return {
    //    newQuiz : Quiz,
    //    newQuestion: Question      
    //  }
   
})