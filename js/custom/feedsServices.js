'use strict';

angular.module('Questions')

.factory('feedsService',[
  '$http', 
  '$rootScope', 
  '$localStorage',

  function ($http, $rootScope, $localStorage) {
          
      var baseUrl = "https://bibleforum.herokuapp.com";
      // function changeUser(user) {
      //     angular.extend(currentUser, user);
      // }


      var token = $localStorage.token;
      var authorName = $localStorage.username;
      if(!authorName) {
        authorName = "Anonymous";
      };
      // function getUserFromToken() {
      //     var token = $localStorage.token;
      //     var user = {};
      //     if (typeof token !== 'undefined') {
      //         var encoded = token.split('.')[1];
      //         user = JSON.parse(urlBase64Decode(encoded));
      //     }
      //     return user;
      // }

      // var currentUser = getUserFromToken();
      var config = {headers:  {
        'Authorization': 'Bearer ' + token
        }
      };

      return {
          postQuestion: function(username, data, success) {
              $http.post(baseUrl + '/api/users/' + username + '/questions', data, config).success(success)
          },
          getUserQuestions: function(username, success) {
            $http.delete(baseUrl + '/api/users/' + username + '/questions', config).success(success)
          },
          deleteQuestion: function(username, question_id, success) {
            $http.delete(baseUrl + '/api/users/' + username + '/questions/' + question_id, config).success(success)
          },
          updateQuestion: function(username, question_id, data, success) {
            $http.put(baseUrl + '/api/users/' + username + '/questions/' + question_id, data, config).success(success)
          },
          getAllQuestions: function(success) {
              $http.get(baseUrl + '/api/questions').success(success)
          },
          getQuestionById: function(question_id, success) {
            $http.get(baseUrl + '/api/questions/' + question_id).success(success)
          },
          getAnswers: function(question_id, success) {
            $http.get(baseUrl + '/api/questions/' + question_id + '/answers').success(success)
          },
          postAnswer: function(question_id, data, success) {
            $http.post(baseUrl + '/api/questions/' + question_id + '/answers', data, config).success(success)
          },
          deleteAnswer: function(question_id, answer_id, success) {
            $http.delete(baseUrl + '/api/questions/' + question_id + '/answers/' + answer_id, config).success(success)
          },
          updateAnswer: function(answer_id, data, success) {
            $http.put(baseUrl + '/api/answers/' + answer_id, data, config).success(success)
          },
          getUserAnswers: function(question_id, success) {
            $http.get(baseUrl + '/users/' + username + '/answers', data, config).success(success)
          },
          logout: function(success) {
            delete $localStorage.token;
            delete $localStorage.username;
          }


          // me: function(success, error) {
          //     $http.get(baseUrl + '/me').success(success).error(error)
          // },
          // logout: function(success) {
          //     changeUser({});
          //     delete $localStorage.token;
          //     success();
          // }
      };
}]);