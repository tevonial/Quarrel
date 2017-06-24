/**
 * Created by tevonial on 6/22/2017.
 */

angular.module('quarrel')

    .controller('control', function ($http, $scope, AuthService) {

        if (AuthService.currentUser().role !== 'admin') {
            showError({data: {message: 'Unauthorized access'}});
        } else {
            $http.get('/api/control').then(
                function (response) {
                    $scope.name = response.data.filter(function (item) {
                        return item.name === 'name';
                    })[0].value;
                    $scope.config2 = response.data.filter(function (item) {
                        return item.name === 'setting';
                    })[0].value;

                    $scope.mods = response.data.filter(function (item) {
                        return item.name === 'mods';
                    })[0].value;
                }, showError
            );
        }

        $scope.save = function () {
            var request = [
                {
                    name: 'name',
                    value: $scope.name
                },{
                    name: 'setting',
                    value: $scope.config2
                }
            ];

            $http.put('/api/control', request, AuthService.authHeader()).then(
            function (response) {

            }, showError);
        }

    });