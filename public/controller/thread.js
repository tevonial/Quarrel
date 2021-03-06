/**
 * Created by tevonial on 5/17/2017.
 */


angular.module('quarrel')

    .controller('thread.list', function ($http, $scope) {
        $http.get('/api/thread', {timeout: 5000}).then(
            function (response) {
                $scope.threads = response.data;
            }, showError);
    })

    .controller('thread', function ($state, $http, $scope, $stateParams, AuthService) {

        $scope.reply = {
            thread: $stateParams.id
        };

        var threadId;
        $scope.me = AuthService.currentUser()._id;
        if (!$scope.me) $scope.me = ' ';

        refresh();

        function refresh() {
            $http.get('/api/thread/' + $stateParams.id).then(
                function (response) {
                    threadId = response.data._id;
                    $scope.title = response.data.title;
                    $scope.posts = response.data.posts;
                    $scope.isOwner = response.data.author === $scope.me;
                }, showError);
        }

        $scope.postReply = function () {

            $http.post('/api/thread/' + $stateParams.id, $scope.reply, AuthService.authHeader()).then(
                function () {
                    refresh();
                    $state.go('thread');
                }, showError
            );
        };

        $scope.deletePost = function () {
            if (!$scope.deletePostId)   return;

            $http.delete('/api/thread/post/' + $scope.deletePostId, AuthService.authHeader()).then(
                function () {
                    refresh();
                }, showError
            );
        };

        $scope.deleteThread = function () {
            $http.delete('/api/thread/' + threadId, AuthService.authHeader()).then(
                function () {
                    $state.go('thread-list');
                }, showError
            );
        };

        $scope.renameThread = function () {
            $http.put('/api/thread/' + threadId, {title: $scope.renameThreadTitle}, AuthService.authHeader()).then(
                function () {
                    $scope.title = $scope.renameThreadTitle;
                }, showError
            );
        };

        $scope.editPost = function () {
            $http.put('/api/thread/post/' + $scope.editPostId, {post: $scope.editedPost}, AuthService.authHeader()).then(
                function () {
                    $scope.posts.find(function (item) {
                        return item._id == $scope.editPostId;
                    }).post = $scope.editedPost;
                }, showError
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
                title: $scope.title,
                post: $scope.post
            };

            $http.post('/api/thread', thread, AuthService.authHeader()).then(
                function () {
                    $state.go('thread-list');
                }, showError
            );

        };

    });