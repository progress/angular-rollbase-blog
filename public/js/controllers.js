'use strict';

// This variable is used to store the token that is passed to the server. Only if the token is valid will changes be made.
var sessionId = '';
var homescope;
/* Controllers */
function IndexCtrl($scope, $http) {
    // This is so that the logged in user is shown options that the other users are not.
    $scope.displayType = 'notlogged';
    if (sessionId) {
        $scope.displayType = 'logged'
    };
    $http.get('/api/posts').
    success(function(data, status, headers, config) {
        $scope.posts = data.posts;
        if (sessionId) {
            $scope.displayType = 'logged'
        };
    });
}

function HomeCtrl($scope, $http) {
    // This is so that the logged in user is shown options that the other users are not.
    $scope.displayType = 'notlogged';
    if (sessionId) {
        $scope.displayType = 'logged';
    };
    homescope = $scope;
    console.log(homescope);
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
    // This is so that the view changes when logging multiple times
    $scope.displayType = 'firstLogin';
    $scope.form = {};
    $scope.login = function() {
        $http.post('/api/login', $scope.form).
        success(function(data) {
            sessionId = data.sessionId;
            if (sessionId) {
                $location.path('/');
                homescope.displayType = 'logged';
            };
            $scope.displayType = 'secondLogin';
            $scope.form = {};
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