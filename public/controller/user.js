/**
 * Created by tevonial on 5/18/2017.
 */

var onError = function (msg) {
    alert(msg.data);
};

angular.module('quarrel')

    .controller('user', function ($http, $scope, $stateParams) {

        $http.get('/api/user/' + $stateParams.id, {timeout: 5000}).then(
            function (response) {
                $scope.user = response.data;
            }, onError);

        $http.get('/api/user/' + $stateParams.id + '/post', {timeout: 5000}).then(
            function (response) {
                $scope.posts = response.data;
            }, onError);


    })

    .controller('user.list', function ($http, $scope) {

        $http.get('/api/user', {timeout: 5000}).then(
            function (response) {
                $scope.users = response.data;
            }, onError);

    });