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
      $scope.logout;

      $scope.login = function() {
        var formData = {
            username: $scope.username,
            password: $scope.password
        }
 
        AuthenticationService.login(formData, function (response) {
          if (response.type == false) {
              alert(response.data);    
          } else {
              $localStorage.token = response.data.token;
              $localStorage.username = $scope.username;
              window.location = "#/home";    
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
            if (response.type == false) {
                alert(response.data);
            } else {
                $localStorage.token = response.data.token;
                $localStorage.username = $scope.username;
                $("#signupInfo").text("Account created successfully.");
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