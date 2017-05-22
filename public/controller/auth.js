/**
 * Created by tevonial on 5/20/2017.
 */

angular.module('quarrel')

    .controller('login', function ($location, $scope, AuthService) {

        $scope.attemptLogin = function () {

            var credentials = {
                email:      $scope.email,
                password:   $scope.password
            };

            AuthService.login(credentials)
                .then(function () {
                    $scope.response = "Log in successful.";
                }, function () {
                    $scope.response = 'Incorrect credentials.';
                });

        }
    })

    .controller('nav', function ($scope, $state, AuthService) {
        $scope.authenticated = AuthService.isLoggedIn();

        if ($scope.authenticated)
            $scope.greeting = AuthService.currentUser().name.first
                + ' ' + AuthService.currentUser().name.last;

        $scope.logout = function () {
            AuthService.logout();
            $state.go('login', {}, {location: 'replace'});
            // $scope.authenticated = false;
        }
    });