angular.module('Authentication')

.controller('loginController',
    ['$scope', 
    '$rootScope', 
    '$location', 
    '$localStorage', 
    'AuthenticationService',

    function ($scope, $rootScope, $location, $localStorage, AuthenticationService) {
      $scope.username = "";
      $scope.password = "";
      $scope.info = "";
      $scope.logout;

      $scope.login = function() {
        var formData = {
            username: $scope.username,
            password: $scope.password
        }
 
        AuthenticationService.login(formData, function (response) {
          $scope.info = "Logging in ...";
          if (response.type == false) {
              $scope.info = response.data;    
          } else {
              $scope.info = "Authenticated";
              $localStorage.token = response.data.token;
              $localStorage.username = $scope.username;
              window.location = "#/feeds";    
          }
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
      };  

    $scope.register = function() {
        var formData = {
            username: $scope.username,
            password: $scope.password,
        }

        AuthenticationService.save(formData, function (response) {
            $scope.info = "Processing request ...";
            if (response.type == false) {
                $scope.info = response.data;
            } else {
                $scope.info = "Account created successfully.";
                $localStorage.token = response.data.token;
                $localStorage.username = $scope.username;
                window.location = "#/home";   
            }
          }, 
          function() {
            $rootScope.error = 'Failed to signup';
          })
    };

    $scope.me = function() {
      AuthenticationService.me(function(response) {
        $scope.myDetails = response;
      },
      function() {
          $rootScope.error = 'Failed to fetch details';
      })
    };

    $scope.token = $localStorage.token;

}]);