/**
 * Created by tevonial on 5/17/2017.
 */

var onError = function (msg) {
    alert(msg.data);
};

angular.module('quarrel')

    .controller('thread.list', function ($http, $scope) {
        $http.get('/api/thread', {timeout: 5000}).then(
            function (response) {
                $scope.threads = response.data;
            }, onError);
    })

    .controller('thread', function ($state, $http, $scope, $stateParams, AuthService) {

        $scope.post = '';

        refresh();

        function refresh() {
            $http.get('/api/thread/' + $stateParams.id).then(
                function (response) {
                    $scope.title = response.data.title;
                    $scope.posts = response.data.posts;
                }, onError);
        }

        $scope.postReply = function () {

            var reply = {
                thread: $stateParams.id,
                author: AuthService.currentUser()._id,
                post: $scope.post
            };

            $http.post('/api/thread/' + $stateParams.id, reply).then(
                function () {
                    refresh();
                }, function () {
                    // Fail
                }
            );

        };
    })

    .controller('thread.create', function ($state, $scope, $http, AuthService) {

        $scope.post = $scope.title = '';

        $scope.postThread = function () {

            var thread = {
                author: AuthService.currentUser()._id,
                title: $scope.title,
                post: $scope.post
            };

            $http.post('/api/thread', thread).then(
                function () {
                    $state.go('thread-list');
                }, function () {
                    // Fail
                }
            );

        }

    });