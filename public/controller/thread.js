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

        $scope.reply = {
            thread: $stateParams.id
        };

        var threadId;
        $scope.me = AuthService.currentUser()._id;

        refresh();

        function refresh() {
            $http.get('/api/thread/' + $stateParams.id).then(
                function (response) {
                    threadId = response.data._id;
                    $scope.title = response.data.title;
                    $scope.posts = response.data.posts;
                    $scope.isOwner = response.data.author == $scope.me;
                }, onError);
        }

        $scope.postReply = function () {

            $scope.reply.author = AuthService.currentUser()._id;

            $http.post('/api/thread/' + $stateParams.id, $scope.reply, AuthService.authHeader()).then(
                function () {
                    refresh();
                    $state.go('thread');
                }, onError
            );
        };

        $scope.deletePost = function () {
            if (!$scope.deletePostId)   return;

            $http.delete('/api/thread/post/' + $scope.deletePostId, AuthService.authHeader()).then(
                function () {
                    refresh();
                }, onError
            );
        };

        $scope.deleteThread = function () {
            $http.delete('/api/thread/' + threadId, AuthService.authHeader()).then(
                function () {
                    $state.go('thread-list');
                }, onError
            );
        };

        $scope.renameThread = function () {
            $http.put('/api/thread/' + threadId, {title: $scope.renameThreadTitle}, AuthService.authHeader()).then(
                function () {
                    $scope.title = $scope.renameThreadTitle;
                }, onError
            );
        };

        $scope.editPost = function () {
            $http.put('/api/thread/post/' + $scope.editPostId, {post: $scope.editedPost}, AuthService.authHeader()).then(
                function () {
                    $scope.posts.find(function (item) {
                        return item._id == $scope.editPostId;
                    }).post = $scope.editedPost;
                }, onError
            );
        };

        $('#confirm-delete-post').on('show.bs.modal', function(e) {
            $scope.deletePostId = $(e.relatedTarget).data('id');
        });

        $('#edit-post').on('show.bs.modal', function(e) {
            $scope.editPostId = $(e.relatedTarget).data('id');
            $scope.editedPost = $scope.posts.find(function (item) {
                return item._id == $scope.editPostId;
            }).post;

            document.getElementById('editedPost').textContent = $scope.editedPost;
        });

        $('#rename-thread').on('show.bs.modal', function(e) {
            document.getElementById('renameThreadTitle').value = $scope.title;
        });
    })

    .controller('thread.create', function ($state, $scope, $http, AuthService) {

        $scope.post = $scope.title = '';

        $scope.postThread = function () {

            var thread = {
                author: AuthService.currentUser()._id,
                title: $scope.title,
                post: $scope.post
            };

            $http.post('/api/thread', thread, AuthService.authHeader()).then(
                function () {
                    $state.go('thread-list');
                }, onError
            );

        };

    });