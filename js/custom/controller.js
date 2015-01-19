angular.module('Questions')

.controller('feedsController', [
  '$scope',
  '$http',
  '$location',
  '$localStorage',
  'feedsService',
  function ($scope, $http, $location, $localStorage, feedsService) {

  $("a.answersLink").click(function() {
    console.log('clicked');
    var text = $(this).next().text();
    console.log('innerText id', text);
  });

  $scope.presentDate = new Date();
  console.log("working...");
  $scope.currentUser = $localStorage.username;
  $scope.currentQuestionId = $localStorage.currentQuestionId;
  
  if(!$scope.currentUser) {
    $scope.author = "Anonymous";
    console.log('author', $scope.author);
  } else {
    $scope.author = $scope.currentUser;
  }

  console.log("currentUser", $scope.currentUser);
  var temp = [];
  $scope.edit = [];
    
    $scope.postQuestion = function() {
      var formData = {
        content: $scope.questionContent,
        author: $scope.author
      };

      feedsService.postQuestion($scope.currentUser, formData, function (response) {
        if(response.type === false) {
          alert(response.data);
        } else {
          $scope.sent = true;
          $scope.questionContent = "";
        }
      });
    };

    $scope.showAllQuestions = function() {
      feedsService.getAllQuestions(function (data) {
        $scope.questions = data;
        for(i=0; i<$scope.questions.length; i++) {
          temp.push($scope.questions[i]._id);
          $scope.idArray = temp;
        }
      });
    };

    $scope.storeId = function (currentId) {
      $scope.currentQuestionId = currentId;
      $localStorage.currentQuestionId = currentId;
    };

    $scope.showAnswers = function() {
      feedsService.getQuestionById($scope.currentQuestionId, function (data) {
        $scope.question = data;
        feedsService.getAnswers($scope.question._id, function (data) {
          $scope.answers = data;
          for(i=0; i<$scope.answers.length; i++) {
            temp.push($scope.answers[i]._id);
            $scope.answer_idArray = temp;
          }
        });
      });
    };

    $scope.postAnswer = function() {
      var formData = {
        content: $scope.answerContent,
        author: $scope.currentUser
      };

      feedsService.postAnswer($scope.currentQuestionId, formData, function (response) {
        if(response.type === false) {
          alert(response.data);
        } else {
          
        }
      });
      $scope.showAnswers();
      $scope.answerContent = "";
    };

    // $scope.showUpdateForm = function(formIndex) {
    //   console.log('clicked');
    //   $scope.edit[formIndex] = true;
      
    //   console.log('updateAnswer with', $scope.updateContent);
    // };

    // $scope.updateAnswer = function(answerIndex) {
    //   $scope.updateContent = $("#update").text();
    //   var formData = {
    //     content: $scope.updateContent,
    //     dislikes: 0,
    //     likes: 0,
    //     okays: 0
    //   };

    //   feedsService.updateAnswer($scope.answer_idArray[answerIndex], formData, function (response) {
    //     if(response.type === false) {
    //       alert(response.data);
    //     } else {
          
    //     }
    //   });
    //   $scope.answer_idArray = [];
    //   $scope.showAnswers();
    // };

    $scope.deleteAnswer = function(answerId) {
      alert("Delete this post?");
      feedsService.deleteAnswer($scope.currentQuestionId,answerId, function (response) {
        if(response.type === false) {
          alert(response.data);
        } else {
            $scope.showAnswers();
        }
      });
      $scope.answer_idArray = [];
      $scope.showAnswers();
    };

    $scope.deleteQuestion = function(questionId) {
      alert("Delete this post?");
      feedsService.deleteQuestion($scope.currentUser,questionId, function (response) {
        if(response.type === false) {
          alert(response.data);
        } else {
          $scope.showAllQuestions(); 
        }
      });
      $scope.idArray = [];
      $scope.showAllQuestions();
    };

    $scope.logout = function() {
        feedsService.logout();
        $scope.currentUser = "";
        delete $localStorage.username;
    };

}]);