/**
 * Created by tevonial on 5/18/2017.
 */

var onError = function (msg) {
    alert(msg.data.message);
};

angular.module('quarrel')

    .controller('user', function ($http, $scope, $stateParams, AuthService) {

        $scope.showMod = (AuthService.currentUser().role !== "reg");

        $http.get('/api/user/' + $stateParams.id, {timeout: 5000}).then(
            function (response) {
                $scope.user = response.data;
                document.getElementById('selectRole').value = $scope.user.role;
            }, onError);

        $http.get('/api/user/' + $stateParams.id + '/post', {timeout: 5000}).then(
            function (response) {
                $scope.posts = response.data;
            }, onError);

        $scope.modifyUser = function () {
            $http.put('/api/user/' + $stateParams.id, {role: $scope.modRole}, AuthService.authHeader()).then(
                function (response) {
                    $scope.user = response.data;
                }, onError);
        };

    })

    .controller('user.list', function ($http, $scope) {

        $http.get('/api/user', {timeout: 5000}).then(
            function (response) {
                $scope.users = response.data;
            }, onError);

    });