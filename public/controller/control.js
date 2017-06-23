/**
 * Created by tevonial on 6/22/2017.
 */

var onError = function (msg) {
    alert(msg.data);
};

angular.module('quarrel')

    .controller('control', function ($http, $scope) {


        $http.get('/api/control').then(
            function (response) {
                $scope.name = response.data.filter(function(item) { return item.config === 'name'; })[0].value;
            }, onError
        );

    });