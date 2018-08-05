app.factory("smartService",function($http, $q){
    
    function prepareQuiz(quiz) {
       $http.get('https://json-server-heroku-rzjbusydok.now.sh/question?quizId='+quiz.id).then(function(response) {
         for (i=0;i< response.data.length ; i++){ 
           var question = response.data[i];
           question.status = "INIT";
            $http.put('https://json-server-heroku-rzjbusydok.now.sh/question/'+question.id, question).then(function(resp2) {                           
                })           
           }
       });

       $http.get('https://json-server-heroku-rzjbusydok.now.sh/member?quizId='+quiz.id).then(function(resp3) {
         for (i=0;i< resp3.data.length ; i++){ 
           var member = resp3.data[i];
            $http.delete('https://json-server-heroku-rzjbusydok.now.sh/member/'+member.id).then(function(resp4) {                           
                })           
           }
       });
    }
    
    function getNextQuestion(quiz) {
        async = $q.defer()
        $http.get('https://json-server-heroku-rzjbusydok.now.sh/question?quizId=' + quiz.id + "&status=INIT").then(function(response) {
           if (response.data === null || response.data.length === 0) 
            {  alert("Did Not Succeed To Get Next Question. Is Quiz Ended?");
              async.resolve(null);
            }        
        var question = response.data[0];
        question.status = "QUESTION";
        $http.put('https://json-server-heroku-rzjbusydok.now.sh/question/'+question.id, question).then(function(resp2) {                           
                }) 
        async.resolve(question);                
       })
       return async.promise;
    } 

    function updCurrQuestionToAnswer(question) {
        async = $q.defer()
        question.status = "ANSWER";
        $http.put('https://json-server-heroku-rzjbusydok.now.sh/question/'+question.id, question).then(function(resp2) { 
          async.resolve(question);                           
                })       
        return async.promise
    } 

    function updCurrAnswerToFinished(question) {
        question.status = "FINISHED";
        $http.put('https://json-server-heroku-rzjbusydok.now.sh/question/'+question.id, question).then(function(resp2) {                           
                })       
    }
    
   function getActiveQuiz() {
         $http.get('https://json-server-heroku-rzjbusydok.now.sh/quiz').then(function(response) {
         if (response.data.length === 0 ) return null;
           else return response.data[0] ;
                })           
    }

    function calcSummeries(quiz) {
       var async = $q.defer();
       var totMembers = 0;
       var totQuestions = 0;
       var totFinished = 0;
       var totAnswered = 0;
       $http.get('https://json-server-heroku-rzjbusydok.now.sh/question?quizId='+quiz.id).then(function(response) {
         for (i=0;i< response.data.length ; i++){ 
           var question = response.data[i];
           totQuestions++;
           if (question.status === "FINISHED") totFinished++;
          }
          $http.get('https://json-server-heroku-rzjbusydok.now.sh/member?quizId='+quiz.id).then(function(resp2) {
                for (i=0;i< resp2.data.length ; i++) {
                    totMembers++;
                    if (resp2.data[i].currAns !== -999999) totAnswered++;
                }
                async.resolve([totMembers, totQuestions, totFinished+1, totAnswered]);
          })
       })
       return async.promise;
    }

    function getCurrQuestion(quiz) {
       var async = $q.defer();
       $http.get('https://json-server-heroku-rzjbusydok.now.sh/question?quizId='+quiz.id).then(function(response) {
         var question = null;  
         for (i=0;i< response.data.length ; i++)
           if (response.data[i].status === "QUESTION" || response.data[i].status === "ANSWER") question = response.data[i]; 
         async.resolve(question) ;
       })
         return async.promise;
       }

     function updAnswerOfMember(member) {
        $http.put('https://json-server-heroku-rzjbusydok.now.sh/member/'+member.id, member).then(function(resp2) {                           
                })       
    }

    function calcPoints(quiz, question) {
       memberWide = [];
       var tarNow = new Date();
       $http.get('https://json-server-heroku-rzjbusydok.now.sh/member?quizId='+quiz.id).then(function(resp2) {
                memberWide = resp2.data;
                
                for (i=0; i < memberWide.length ; i++) {
                  memberWide[i].diff = Math.abs(question.answer - memberWide[i].currAns) + (tarNow - memberWide[i].memberDate)/9999999 ; 
                  console.log(memberWide[i].diff);
                }
                for (i = memberWide.length -2 ; i>=0 ; i--)
                   for (j=0 ; j<= i ; j++)
                      if (memberWide[j].diff > result[j+1].diff) {
                         temp = memberWide[j];
                         memberWide[j] = memberWide[j+1];
                         memberWide[j+1] = temp;
                      }
                for (i=0; i< memberWide.length ; i++) {
                  points =  Math.max(3 - i, 0 ); // first = 3 points. second = 2. 3rd = 1. all other = 0
                  memberWide[i].currLocation = i + 1 ;
                  memberWide[i].totPoints+= points; 
                  delete memberWide.diff; 
                  $http.put('https://json-server-heroku-rzjbusydok.now.sh/member/'+memberWide.id, memberWide).then(function(resp2) {                           
                  })                  
                }


               })             
                    

    }
    

     return {
       prepareQuiz : prepareQuiz,
       getNextQuestion : getNextQuestion,
       updCurrQuestionToAnswer : updCurrQuestionToAnswer,
       updCurrAnswerToFinished : updCurrAnswerToFinished,
       calcSummeries : calcSummeries,
       getActiveQuiz : getActiveQuiz,
       getCurrQuestion : getCurrQuestion,
       updAnswerOfMember : updAnswerOfMember,
       calcPoints : calcPoints
     }
})