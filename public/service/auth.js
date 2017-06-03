(function () {

    angular
        .module('quarrel')
        .service('AuthService', AuthService);

    AuthService.$inject = ['$http', '$window'];
    function AuthService ($http, $window) {

        var saveToken = function (token) {
            $window.localStorage['mean-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['mean-token'];
        };

        var authHeader = function () {
            return {
                headers: {
                    Authorization: 'Bearer '+ getToken()
                }
            }
        };

        var isLoggedIn = function() {
            var token = getToken();
            var payload;

            if(token){
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if(isLoggedIn()){
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload;
            } else {
                return false;
            }
        };

        register = function(user) {
            return $http.post('/api/auth/register', user).then(function(response) {
                saveToken(response.data.token);
            });
        };

        login = function(user) {
            return $http.post('/api/auth/login', user).then(function(response) {
                saveToken(response.data.token);
            });
        };

        logout = function() {
            $window.localStorage.removeItem('mean-token');
        };

        return {
            currentUser : currentUser,
            saveToken : saveToken,
            getToken : getToken,
            authHeader : authHeader,
            isLoggedIn : isLoggedIn,
            register : register,
            login : login,
            logout : logout
        };
    }

})();