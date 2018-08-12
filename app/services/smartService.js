app.factory("smartService", function ($http, $q, homeService) {

  function prepareQuiz(quiz,linkJson) {
    $http.get('https://json-server-heroku-xutgonzgbe.now.sh/question?quizId=' + quiz.id).then(function (response) {
      for (i = 0; i < response.data.length; i++) {
        var question = response.data[i];
        question.status = "INIT";
        $http.put('https://json-server-heroku-xutgonzgbe.now.sh/question/' + question.id, question).then(function (resp2) {
        })
      }
    });

    $http.get('https://json-server-heroku-xutgonzgbe.now.sh/member?quizId=' + quiz.id).then(function (resp3) {
      for (i = 0; i < resp3.data.length; i++) {
        var member = resp3.data[i];
        $http.delete('https://json-server-heroku-xutgonzgbe.now.sh/member/' + member.id).then(function (resp4) {
        })
      }
    });
    var textDate = new Date();
    var async = $q.defer();
    var mmbr = new homeService.newMember(null, quiz.id, "מנהל החידון", -9999999, textDate,  0, 0); 
    $http.post(linkJson + '/member/',mmbr).then(function(response) {  
      async.resolve(response.data)  ;    
           })
   return async.promise;
  }

  function getNextQuestion(quiz) {
    async = $q.defer()
    $http.get('https://json-server-heroku-xutgonzgbe.now.sh/question?quizId=' + quiz.id + "&status=INIT").then(function (response) {
      if (response.data === null || response.data.length === 0) {
        alert("לא מצליח לקבל את השאלה הבאה. האם החידון הסתיים?");
        async.resolve(null);
      }
      var question = response.data[0];
      question.status = "QUESTION";
      $http.put('https://json-server-heroku-xutgonzgbe.now.sh/question/' + question.id, question).then(function (resp2) {
      })
      async.resolve(question);
    })
    return async.promise;
  }

  function updCurrQuestionToAnswer(question) {
    async = $q.defer()
    question.status = "ANSWER";
    $http.put('https://json-server-heroku-xutgonzgbe.now.sh/question/' + question.id, question).then(function (resp2) {
      async.resolve(question);
    })
    return async.promise
  }

  function getCurrMember(quiz, member) {
    async = $q.defer()
    $http.get('https://json-server-heroku-xutgonzgbe.now.sh/member?quizId=' + quiz.id + "&id="+ member.id).then(function (response) {
      async.resolve(response.data[0]);
    })
    return async.promise;
  }

  function updCurrAnswerToFinished(question) {
    async = $q.defer();
    question.status = "FINISHED";
    $http.put('https://json-server-heroku-xutgonzgbe.now.sh/question/' + question.id, question).then(function (resp2) {
      async.resolve(resp2.data[0]);
    })
    return async.promise;
  }

  function getActiveQuiz() {
    $http.get('https://json-server-heroku-xutgonzgbe.now.sh/quiz').then(function (response) {
      if (response.data.length === 0) return null;
      else return response.data[0];
    })
  }

  function calcSummeries(quiz) {
    var async = $q.defer();
    var totMembers = 0;
    var totQuestions = 0;
    var totFinished = 0;
    var totAnswered = 0;
    $http.get('https://json-server-heroku-xutgonzgbe.now.sh/question?quizId=' + quiz.id).then(function (response) {
      for (i = 0; i < response.data.length; i++) {
        var question = response.data[i];
        totQuestions++;
        if (question.status === "FINISHED") totFinished++;
      }
      $http.get('https://json-server-heroku-xutgonzgbe.now.sh/member?quizId=' + quiz.id).then(function (resp2) {
        for (i = 0; i < resp2.data.length; i++) {
          totMembers++;
          if (resp2.data[i].currAns > -999999) totAnswered++;
        }
        async.resolve([totMembers - 1, totQuestions, totFinished + 1, totAnswered]);
      })
    })
    return async.promise;
  }

  function getCurrQuestion(quiz) {
    var async = $q.defer();
    $http.get('https://json-server-heroku-xutgonzgbe.now.sh/question?quizId=' + quiz.id).then(function (response) {
      var question = null;
      for (i = 0; i < response.data.length; i++)
        if (response.data[i].status === "QUESTION" || response.data[i].status === "ANSWER") question = response.data[i];
      async.resolve(question);
    })
    return async.promise;
  }

  function updAnswerOfMember(member) {
    $http.put('https://json-server-heroku-xutgonzgbe.now.sh/member/' + member.id, member).then(function (resp2) {
    })
  }

  function calcPoints(quiz, question) {
    memberWide = [];
    var tarNow = new Date();
    $http.get('https://json-server-heroku-xutgonzgbe.now.sh/member?quizId=' + quiz.id).then(function (resp2) {
      console.log(resp2.data);
      memberWide = resp2.data;
      for (i = 0; i < memberWide.length; i++) {
        
        memberWide[i].diff = Math.abs(question.answer - memberWide[i].currAns) + 0.001/(tarNow - new Date(memberWide[i].currDate)) ;
        console.log( memberWide[i].name + " - "+  memberWide[i].diff);
      }
      for (i = memberWide.length - 2; i >= 0; i--)
        for (j = 0; j <= i; j++)
          if (memberWide[j].diff > memberWide[j + 1].diff) {
            temp = memberWide[j];
            memberWide[j] = memberWide[j + 1];
            memberWide[j + 1] = temp;
          }
      console.log(memberWide);
      for (i = 0; i < memberWide.length; i++) {
        points = 0;
        if (question.model === "1" && memberWide[i].currAns === question.answer) points = 1;
        if (question.model === "2" && memberWide[i].currAns === question.answer) points = 2;
        if (question.model === "3") points = Math.max(3 - i, 0); // first = 3 points. second = 2. 3rd = 1. all other = 0
        //memberWide[i].currLocation = i + 1;
        memberWide[i].currPoints = points;
        memberWide[i].totPoints += points;
        if (points > 0){
          $http.put('https://json-server-heroku-xutgonzgbe.now.sh/member/' + memberWide[i].id, memberWide[i]).then(function (resp2) {
          })
        }
      }
    })
  }

   function loadMembers(quiz) {
     var async = $q.defer();
     $http.get('https://json-server-heroku-xutgonzgbe.now.sh/member?quizId=' + quiz.id).then(function (response) {
         for (i = 0; i < response.data.length; i++) 
                 if (response.data[i].name === "מנהל החידון") response.data.splice(i,1);

         async.resolve(response.data);
       })
     return async.promise;
   }


  function clnMembersFields(quiz) {
   $http.get('https://json-server-heroku-xutgonzgbe.now.sh/member?quizId=' + quiz.id).then(function (resp3) {
    var member = resp3.data;
    for (i = 0; i < member.length; i++) {
      member[i].currAns = member[i].name === "מנהל החידון" ?  -999999 * 10 : -999999 ;
      member[i].currDate = new Date(2000,1,1);
      member[i].currPoints = 0;
      member[i].currLocation = 999;
      
      $http.put('https://json-server-heroku-xutgonzgbe.now.sh/member/' + member[i].id,member[i]).then(function (resp4) {
       })
      }
    })
  }

  return {
    prepareQuiz: prepareQuiz,
    getNextQuestion: getNextQuestion,
    updCurrQuestionToAnswer: updCurrQuestionToAnswer,
    updCurrAnswerToFinished: updCurrAnswerToFinished,
    calcSummeries: calcSummeries,
    getActiveQuiz: getActiveQuiz,
    getCurrQuestion: getCurrQuestion,
    updAnswerOfMember: updAnswerOfMember,
    calcPoints: calcPoints,
    loadMembers: loadMembers,
    clnMembersFields: clnMembersFields,
    getCurrMember : getCurrMember
  }
})