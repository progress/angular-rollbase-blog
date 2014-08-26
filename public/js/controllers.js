'use strict';

// This variable is used to store the token that is passed to the server. Only if the token is valid will changes be made.
var sessionId = '';
/* Controllers */
function IndexCtrl($scope, $http) {
    $http.get('/api/posts').
    success(function(data, status, headers, config) {
        $scope.posts = data.posts;
    });
}

function AddPostCtrl($scope, $http, $location) {
    if (!sessionId) {
        $location.path('/login');
    };
    $scope.form = {};
    $scope.form.sessionId = sessionId;
    $scope.submitPost = function() {
        $http.post('/api/post/', $scope.form).
        success(function(data) {
            $location.path('/');
        });
    };
}

function LoginCtrl($scope, $http, $location) {
    $scope.form = {};
    $scope.login = function() {
        $http.post('/api/login', $scope.form).
        success(function(data) {
            sessionId = data.sessionId;
            $location.path('/');
        });
    };
}

function ReadPostCtrl($scope, $http, $routeParams) {
    $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
        $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
    if (!sessionId) {
        $location.path('/login');
    };
    $scope.form = {};
    $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
        $scope.form = data.post;
    });

    $scope.editPost = function() {
        if (!sessionId) {
            $location.path('/login');
        };
        $scope.form.sessionId = sessionId;
        $http.put('/api/post/' + $routeParams.id, $scope.form).
        success(function(data) {
            $location.url('/readPost/' + $routeParams.id);
        });
    };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
    if (!sessionId) {
        $location.path('/login');
    };
    $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
        $scope.post = data.post;
    });

    $scope.deletePost = function() {
        if (!sessionId) {
            $location.path('/');
        };
        var idInfo = {};
        idInfo.sessionId = sessionId;
        $http.post('/api/post/' + $routeParams.id, idInfo).
        success(function(data) {
            $location.url('/');
        });
    };

    $scope.home = function() {
        $location.url('/');
    };
}