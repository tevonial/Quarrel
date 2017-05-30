/**
 * Created by tevonial on 5/21/2017.
 */

(function() {

    angular
        .module('quarrel')
        .service('AccountService', accountService);

    accountService.$inject = ['$http', 'AuthService'];
    function accountService ($http, AuthService) {

        var getSettings = function () {
            return $http.get('/api/account', AuthService.authHeader());
        };

        var saveSettings = function (settings) {
            return $http.put('/api/account', {settings: settings}, AuthService.authHeader())
                .then(function (response) {
                    // Save new token
                    AuthService.saveToken(response.data.token);
                });
        };

        return {
            getSettings : getSettings,
            saveSettings: saveSettings
        };
    }

})();