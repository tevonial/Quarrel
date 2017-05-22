/**
 * Created by tevonial on 5/21/2017.
 */

(function() {

    angular
        .module('quarrel')
        .controller('settings', function($scope, AccountService, AuthService) {

            $scope.info = {
                auth: 'Bearer '+ AuthService.getToken()
            };

            $scope.settings = {};

            AccountService.getSettings()
                .then(function (response) {
                    $scope.info.response = JSON.stringify(response.data);
                    $scope.settings.name = response.data.name;
                }, function (response) {
                    $scope.info.response = response.data;
                });

            $scope.saveSettings = function () {
                AccountService.saveSettings($scope.settings);
            };

        });

})();