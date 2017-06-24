/**
 * Created by tevonial on 5/18/2017.
 */

angular.module('quarrel')

    .controller('user', function ($http, $scope, $stateParams, AuthService) {

        $scope.showMod = (AuthService.currentUser().role === "admin");

        $http.get('/api/user/' + $stateParams.id, {timeout: 5000}).then(
            function (response) {
                $scope.user = response.data;
                document.getElementById('selectRole').value = $scope.user.role;
            }, showError);

        $http.get('/api/user/' + $stateParams.id + '/post', {timeout: 5000}).then(
            function (response) {
                $scope.posts = response.data;
            }, showError);

        $scope.modifyUser = function () {
            $http.put('/api/user/' + $stateParams.id, {role: $scope.user.role}, AuthService.authHeader()).then(
                function (response) {
                    $scope.user = response.data;
                }, showError);
        };

    })

    .controller('user.list', function ($http, $scope) {

        $http.get('/api/user', {timeout: 5000}).then(
            function (response) {
                $scope.users = response.data;
            }, showError);

    });