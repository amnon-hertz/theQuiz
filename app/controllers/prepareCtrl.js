app.controller("prepareCtrl", function ($rootScope, $http, $scope, $location, quizService, smartService) {
  $quiz = null;
  $scope.selectedQuiz = null;

  $scope.selectedQuestion = null;
  $scope.quizes = [];
  $scope.questions = [];
  $scope.activateText = 'Activate Quiz';

  $http.get($rootScope.linkJson + '/quiz').then(function (response) {
    for (i = 0; i < response.data.length; i++) {
      var quiz = new quizService.newQuiz(response.data[i].id, response.data[i].name,
        response.data[i].num, response.data[i].status);
      $scope.quizes.push(quiz);
    }
  });

  $scope.selectQuiz = function (quiz) {
    if (quiz === $scope.selectedQuiz) {
      $scope.selectedQuiz = null;
      $rootScope.activeQuiz = null;
    }
    else {
      $scope.selectedQuiz = quiz;
      $rootScope.activeQuiz = quiz;
      if (quiz.status === "OPENED") {
        $scope.activateText = 'Deactivate Quiz';
      }
      else {
        $scope.activateText = 'Activate Quiz';
      }
      // Open this quiz in Json DB        
    }
  };

  $scope.toggleQuizActive = function (quiz) {
    if (quiz === null) {
      alert("no quiz was selected. Please select quiz first by double Click on it");
      return;
    }
    if (quiz.status === "OPENED") {
      quiz.status = "CLOSED";
      $scope.activateText = 'Activate Quiz';
    }
    else {
      quiz.status = "OPENED";
      $scope.activateText = 'Deactivate Quiz';
    }
    $http.put($rootScope.linkJson + '/quiz/' + quiz.id, quiz).then(function (response) {
      if (response.data.status === "OPENED") {
        $rootScope.activeQuiz = response.data;
        smartService.prepareQuiz(quiz, $rootScope.linkJson);
      }
      else $rootScope.activeQuiz = null;
    });
  };

  $scope.selectQuestion = function (question) {
    if (question === $scope.selectedQuestion) $scope.selectedQuestion = null;
    else {
      $scope.selectedQuestion = question;
    }
  };

  $scope.deleteQuiz = function (x) {
    if (x === null) return;
    i = $scope.quizes.indexOf(x);
    $scope.selectedQuiz = null;
    $http.delete($rootScope.linkJson + '/quiz/' + $scope.quizes[i].id).then(function (response) {
      $scope.quizes.splice(i, 1);
    });
  }

  $scope.deleteQuestion = function (x) {
    if (x === null) return;
    i = $scope.questions.indexOf(x);
    $scope.selectedQuestion = null;
    $http.delete($rootScope.linkJson + '/question/' + $scope.questions[i].id).then(function (response) {
      $scope.questions.splice(i, 1);
    })
  }

  $scope.addQuiz = function () {
    numExists = false;
    for (i = 0; i < $scope.quizes.length; i++)
      if ($scope.num === $scope.quizes[i].num) numExists = true;
    if (numExists) alert("Quiz Number Already Exists. Please Chose Another Number. Quiz Was Not Added!");
    else {
      var quiz = new quizService.newQuiz(null, $scope.name, $scope.num, "CLOSED");
      $http.post($rootScope.linkJson + '/quiz/', quiz).then(function (response) {
        $scope.quizes.push(response.data);
      });
    }
  }

  $scope.addQuestion = function () {
    if ($scope.selectedQuiz.id === null) {
      alert("no quiz was selected. Please select quiz first by double Click on it");
      return;
    }
    var question = new quizService.newQuestion(null, $scope.selectedQuiz.id,
      $scope.txt1, $scope.txt2, $scope.img1, $scope.answer, $scope.answerTxt, $scope.img2, "INIT");
    $http.post($rootScope.linkJson + '/question/', question).then(function (response) {
      $scope.questions.push(response.data);
    })
  }
  $scope.getQuestions = function () {
    if ($scope.selectedQuiz === null) return;
    $http.get($rootScope.linkJson + '/question').then(function (response) {
      $scope.questions.splice(0, $scope.questions.length);
      var p = response.data;
      for (i = 0; i < p.length; i++) {
        var question = new quizService.newQuestion(p[i].id, p[i].quizId,
          p[i].txt1, p[i].txt2, p[i].img1, p[i].answer, p[i].answerTxt, p[i].img2, p[i].status);
        if (p[i].quizId === $scope.selectedQuiz.id) $scope.questions.push(question);
      }
    });
  }

  $scope.gotoMain = function () {
    $location.path("/main");
  }
})
app.factory("quizService", function () {
  function Quiz(id, name, num, status) {
    this.id = id;
    this.name = name;
    this.num = num;
    this.status = status;
  }

  function Question(id, quizId, txt1, txt2, img1, answer, answerTxt, img2, status) {
    this.id = id;
    this.quizId = quizId;
    this.txt1 = txt1;
    this.txt2 = txt2;
    this.img1 = img1;
    this.answer = answer;
    this.answerTxt = answerTxt;
    this.img2 = img2;
    this.status = status;
  }

  return {
    newQuiz: Quiz,
    newQuestion: Question
  }

})