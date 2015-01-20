'use strict';

angular.module('Bible')

.controller('bibleController', [
  '$scope',
  '$http',
  '$localStorage',
  '$location',

  function ($scope, $http, $location, $localStorage) {
  $scope.key = "517d06fdbe90e270534625197ed15845";

  //check if user had already opened a passage or search. If so, repopulate the page with the last acticity
  //search or passage
  if($scope.lastActivity === "search") {
    $scope.showSearchResults($localStorage.searchResponse);
  } else if($scope.lastActivity === "bible") {
    $scope.showPassage($localStorage.biblePassage);
  }
  
  $scope.username = $localStorage.username;
  console.log('welcome',$localStorage.username);

  $scope.showSearch = function() {
    $("#searchForm").fadeIn(1000);
  };

  $scope.open = function () {
    $scope.searchBible();
  }

  $scope.searchBible = function() {
    if(!$scope.inputText.trim()) {
      $scope.info = "Input field must not be empty";
      return;
    }

    $scope.info = "Please wait...";
    $http({url: 'http://api.biblia.com/v1/bible/search/DARBY.js', method: 'GET', params: {query: $scope.inputText, sort: "passage", key: $scope.key}}).
        success(function (data) {
          $scope.info = "Done";
          if(data.hitCount > 0) {
            $scope.info = "";
            $scope.lastActivity = "search";
            $scope.searchResponse = data;
            $localStorage.searchResponse = $scope.searchResponse;
            $scope.showSearchResults(data);
          } else {
            $scope.info = "Checking in Bible...";
            $scope.openBible();
          }
    }).
        error(function (data, status) {
          $scope.failEvent(status);
    });  
} //end of function openBible

$scope.openBible = function (status){
  $http({url: 'http://api.biblia.com/v1/bible/content/DARBY.html.json', method: 'GET', params: {passage: $scope.inputText, style: "fullyFormattedWithFootnotes", key: $scope.key}}).
      success(function (data) {
        $scope.info = "Done";
        $scope.lastActivity = "bible";
        $localStorage.biblePassage = data;
        $scope.showPassage(data);
    }).
      error(function (data, status) {
        $scope.failEvent(status);
        return;
    });
}

$scope.showPassage = function (passage) {
  var verse = passage.text;
  var display = '<div id="content">' + verse + '</div>';
  $("#bible").html(display);
  $("#bible").fadeIn(1000);
  $("#search").fadeOut(800);
  $scope.info = "";
};

$scope.showSearchResults = function (data) {
  $scope.searchResult = data.results;
  $scope.searchItem = $scope.inputText;
  $("#search").show();
  $("#bible").fadeOut(1000);
  $("#searchListContainer").fadeIn(1500);
  $(".toReveal").fadeIn(1000);
};

// $scope.rollUp = function() {
//   $("#navbar").fadeOut(1000);

//   $( "div" ).hover(
//     function() {
//       $("#navbar").fadeIn(500);
//     }, function() {
//       $("#navbar").fadeOut(1000);
//     }
//   );
// }

$scope.failEvent = function(status) {
  if(status === 0) {
    $scope.info = "There seems to be a problem with your internet connection.";
  }
  else if (status === 404) {
    $scope.info = "Sorry, didn't get that.";
  }
  else if (status === 500) {
    $scope.info = "Server error. Please try again.";
  }
  else {
    $scope.info = "Looks like there's a little hiccup: (" + status + ")";
  }

  // $("#navbar").css("top", "0");
  // $( "div" ).hover(
  // function() {
  //   $("#navbar").css({"top": "0"});
  // }, function() {
  //   $("#navbar").css({"top": "0"});
  // }
}
}]);