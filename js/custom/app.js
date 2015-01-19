(function () {
  //declare modules
  angular.module('Authentication', []);
  angular.module('Questions', []);
  angular.module('Bible', []);
  //main app module
  angular.module('wordFeeds', [
    'Authentication',
    'Questions',
    'Bible',
    'ngRoute',
    'ngStorage',
    'ngAnimate'
  ])

  .config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
      $routeProvider.
        when('/bible', {
          templateUrl: 'partials/bible.html',
          controller: 'bibleController'
        }).
        when('/search', {
          templateUrl: 'partials/bible.html',
          controller: 'bibleController'
        }).
        when('/post', {
          templateUrl: 'partials/newQuestion.html',
          controller: 'feedsController'
        }).
        when('/register', {
          templateUrl: 'partials/signup.html',
          controller: 'loginController'
        }).
        when('/login', {
          templateUrl: 'partials/login.html',
          controller: 'loginController'
        }).
        when('/logout', {
          templateUrl: 'partials/login.html',
          controller: 'loginController'
        }).
        when('/feeds', {
          templateUrl: 'partials/feeds.html',
          controller: 'feedsController'
        }).
        when('/answers', {
          templateUrl: 'partials/answers.html',
          controller: 'feedsController'
        }).
        when('/home', {
          templateUrl: 'partials/home.html',
          controller: 'bibleController'
        }).
        otherwise({
          redirectTo: '/home'
        });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);

  }]);
})();