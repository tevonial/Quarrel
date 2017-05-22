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
            return $http.get('/api/account', {
                headers: {
                    Authorization: 'Bearer '+ AuthService.getToken()
                }
            });
        };

        var saveSettings = function (settings) {
            return $http.put('/api/account', {settings: settings}, {
                headers: {
                    Authorization: 'Bearer '+ AuthService.getToken()
                }
            });
        };

        return {
            getSettings : getSettings,
            saveSettings: saveSettings
        };
    }

})();