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

    .controller('thread.view', function ($http, $scope, $stateParams) {
        $http.get('/api/thread/' + $stateParams.id).then(
            function (response) {
                $scope.title = response.data.title;
                $scope.posts = response.data.posts;
            }, onError);
    });