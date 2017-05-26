/**
 * Created by tevonial on 5/20/2017.
 */

angular.module('quarrel')

    .controller('login', function ($state, $scope, AuthService) {

        $scope.attemptLogin = function () {

            var credentials = {
                email:      $scope.email,
                password:   $scope.password
            };

            AuthService.login(credentials)
                .then(function () {
                    $scope.response = "Log in successful.";
                    $state.go('thread-list');
                }, function () {
                    $scope.response = 'Incorrect credentials.';
                });

        }
    })

    .controller('nav', function ($rootScope, $scope, $state, AuthService) {

        $scope.$watch(function () { return AuthService.isLoggedIn(); },
            function (authenticated) {
                $rootScope.authenticated = authenticated;

                if ($rootScope.authenticated) {
                    var user = AuthService.currentUser();

                    $scope.greeting = user.name.first
                        + ' ' + user.name.last;
                }
            }
        );

        $scope.logout = function () {
            AuthService.logout();
            $state.go('login', {}, {location: 'replace'});
        }
    });