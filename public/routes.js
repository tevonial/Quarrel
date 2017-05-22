/**
 * Created by tevonial on 5/17/2017.
 */

angular.module('quarrel', ['ui.router'])

    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/thread');

        $stateProvider
            .state('thread-list', {
                url: '/thread',
                templateUrl: 'view/thread.list.html',
                controller: 'thread.list'
            })

            .state('thread', {
                url: "/thread/:id",
                templateUrl: 'view/thread.html',
                controller: 'thread.view'
            })

            .state('user-list', {
                url: '/user',
                templateUrl: 'view/user.list.html',
                controller: 'user.list'
            })

            .state('user', {
                url: '/user/:id',
                templateUrl: 'view/user.html',
                controller: 'user'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'view/login.html',
                controller: 'login'
            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'view/account.html',
                controller: 'settings'
            });
    })

    .directive('loadableIndicator', ['$http', function ($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };
                scope.$watch(scope.isLoading, function (value) {
                    if (value) {
                        element.removeClass('ng-hide');
                    } else {
                        element.addClass('ng-hide');
                    }
                });
            }
        };
    }])

    .directive('loadable', ['$http', function ($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };
                scope.$watch(scope.isLoading, function (value) {
                    if (value) {
                        element.addClass('ng-hide');
                    } else {
                        element.removeClass('ng-hide');
                    }
                });
            }
        };
    }]);
