/**
 * Created by tevonial on 5/20/2017.
 */

angular.module('quarrel')

    .controller('register',function ($state, $scope, AuthService) {

        $scope.attemptRegister = function () {

            var user = {
                name: {
                    first: $scope.name.first,
                    last: $scope.name.last
                },
                email: $scope.email,
                password: $scope.password
            };

            AuthService.register(user)
                .then(function () {
                    $state.go('account');
                });
        }

    })

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

                    $scope.greeting = user.name.first + ' ' + user.name.last;
                    $scope.admin = user.role === "admin";
                }
            }
        );

        $scope.logout = function () {
            AuthService.logout();
            $state.go('login', {}, {location: 'replace'});
        }
    });