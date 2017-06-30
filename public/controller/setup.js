/**
 * Created by tevonial on 6/29/2017.
 */

angular.module('quarrel')

    .controller('setup', function ($scope, $http, $window, AuthService) {

        $scope.finishSetup = function () {

            var user = {
                name: {
                    first: $scope.name.first,
                    last: $scope.name.last
                },
                email: $scope.email,
                password: $scope.password,
                role: 'admin'
            };

            AuthService.register(user)
                .then(function () {

                    var request = [
                        {
                            name: 'name',
                            value: $scope.forumName
                        }
                    ];

                    $http.put('/api/control', request, AuthService.authHeader()).then(
                        function (response) {
                            $window.location.href = '/';
                        }, showError);

                }, showError);
        };

    });