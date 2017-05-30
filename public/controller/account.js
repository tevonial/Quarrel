/**
 * Created by tevonial on 5/21/2017.
 */

(function() {

    angular
        .module('quarrel')
        .controller('account', function($scope, AccountService, AuthService) {

            function parseJwt (token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse(window.atob(base64));
            }

            $scope.token = parseJwt(AuthService.getToken());

            $scope.info = {
                auth: 'Bearer '+ AuthService.getToken()
            };

            $scope.settings = {};

            AccountService.getSettings()
                .then(function (response) {
                    $scope.info.response = JSON.stringify(response.data);
                    $scope.settings.email = response.data.email;
                    $scope.settings.name = response.data.name;
                }, function (response) {
                    $scope.info.response = response.data;
                });

            $scope.saveSettings = function () {
                AccountService.saveSettings($scope.settings);
            };

        });

})();