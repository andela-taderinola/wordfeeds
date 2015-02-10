angular.module('Questions')

.controller('feedsController', [
  '$scope',
  '$http',
  '$location',
  '$localStorage',
  'feedsService',
  function ($scope, $http, $location, $localStorage, feedsService) {

  $scope.presentDate = new Date();
  $scope.info = "";
  $scope.currentUser = $localStorage.username;
  $scope.author = $scope.currentUser;
  $scope.currentQuestionId = $localStorage.currentQuestionId;

  console.log("currentUser", $scope.currentUser);
  var temp = [];
  $scope.edit = [];
    
    $scope.postQuestion = function() {
      if (!$scope.currentUser) {
        $scope.author = "Anonymous";
      }
      var formData = {
        content: $scope.questionContent,
        author: $scope.author
      };

        $scope.info = "Posting question ...";

      feedsService.postQuestion($scope.currentUser, formData, function (response) {
        
        if(response.type === false) {
          $scope.info = response.data;
        } else {
          $scope.info = "Question posted";
          $scope.sent = true;
          $scope.questionContent = "";
        }
      });
    };

    $scope.showAllQuestions = function() {
      $scope.info = "Loading questions ...";
      feedsService.getAllQuestions(function (data) {
        if(data.type === false) {
          $scope.info = data.data;
        }
        console.log("info", $scope.info);
        $scope.questions = data;
        for(i=0; i<$scope.questions.length; i++) {
          temp.push($scope.questions[i]._id);
          $scope.idArray = temp;
        }
        $scope.info = "Done";
        $scope.info = "";
      });
    };

    $scope.storeId = function (currentId) {
      $scope.currentQuestionId = currentId;
      $localStorage.currentQuestionId = currentId;
    };

    $scope.showAnswers = function() {
      $scope.info = "Fetching contributions ...";
      feedsService.getQuestionById($scope.currentQuestionId, function (data) {
        $scope.question = data;
          $scope.info = data.data;
        feedsService.getAnswers($scope.question._id, function (data) {
          $scope.info = data.data;
          $scope.answers = data;
          for(i=0; i<$scope.answers.length; i++) {
            temp.push($scope.answers[i]._id);
            $scope.answer_idArray = temp;
          }
        });
      });
      $scope.info = "";
    };

    $scope.postAnswer = function() {
      var formData = {
        content: $scope.answerContent,
        author: $scope.currentUser
      };
      $scope.info = "Please wait ...";
      feedsService.postAnswer($scope.currentQuestionId, formData, function (response) {
        if(response.type === false) {
          $scope.info = response.data;
        } else {
          $scope.info = "Contribution posted.";
        }
      });
      $scope.info = "";
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
        $scope.info = "Removing contribution ...";
        if(response.type === false) {
          $scope.info = response.data;
        } else {
          $scope.info = "Contribution removed.";
          $scope.showAnswers();
        }
      });
      $scope.info = "";
      $scope.answer_idArray = [];
      $scope.showAnswers();
    };

    $scope.deleteQuestion = function(questionId) {
      alert("Delete this post?");
      feedsService.deleteQuestion($scope.currentUser,questionId, function (response) {
        $scope.info = "Removing question ...";
        if(response.type === false) {
          $scope.info = response.data;
        } else {
          $scope.info = "Question removed.";
          $scope.showAllQuestions(); 
        }
      });
      $scope.info = "";
      $scope.idArray = [];
      $scope.showAllQuestions();
    };

    $scope.logout = function() {
        feedsService.logout();
        $scope.currentUser = "";
        delete $localStorage.username;
    };

}]);