/**
 * Created by tevonial on 5/17/2017.
 */

angular.module('quarrel', ['ui.router'])

    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
            rewriteLinks: false
        });

        $urlRouterProvider.otherwise('/thread');

        $stateProvider
            .state('thread-list', {
                url: '/thread',
                templateUrl: 'view/thread.list.html',
                controller: 'thread.list'
            })

            .state('thread-create', {
                url: '/thread/new',
                templateUrl: 'view/thread.create.html',
                controller: 'thread.create'
            })

            .state('thread', {
                url: "/thread/:id",
                templateUrl: 'view/thread.html',
                controller: 'thread'
            })

            .state('thread.reply', {
                url: '/reply',
                templateUrl: 'view/thread.reply.html'
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

            .state('register', {
                url: '/register',
                templateUrl: 'view/register.html',
                controller: 'register'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'view/login.html',
                controller: 'login'
            })

            .state('account', {
                url: '/account',
                templateUrl: 'view/account.html',
                controller: 'account'
            })

            .state('control', {
                url: '/control',
                templateUrl: 'view/control.html',
                controller: 'control'
            })

            .state('setup', {
                url: '/setup'
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
    }])

    .config(function ($httpProvider, $provide) {
        $provide.factory('httpInterceptor', function ($q, $rootScope) {
            return {
                'request': function (config) {
                    // broadcasting 'httpRequest' event
                    // $rootScope.$broadcast('httpRequest', config);
                    dismissError(true);
                    // $('#errorAlert').hide();
                    // $('.error-hide').show();
                    return config;// || $q.when(config);
                }
            };
        });
        $httpProvider.interceptors.push('httpInterceptor');
    });

function showError(msg) {
    $('#errorMsg').html(msg.data.message);
    $('#errorAlert').show();
    $('.error-hide').hide();
}

function dismissError(showHiddenContent) {
    $('#errorAlert').hide();

    if (showHiddenContent)
        $('.error-hide').show();
}