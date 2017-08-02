var app = angular.module('timesheetApp', [ 'ui.router', 'ngResource', 'ui.bootstrap', 'ngRoute', 'satellizer', 'ngStorage']); 
var apiEndpoint = '/';
app.run(run);
 // configure our routes
app.config(function($locationProvider, $authProvider, $stateProvider) {
        
    $authProvider.facebook({
      clientId: ''
    });

    // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
    // $authProvider.facebook({
    //   clientId: '',
    //   responseType: 'token'
    // });

    $authProvider.facebook({
      name: 'facebook',
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.8/dialog/oauth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      oauthType: '2.0',
      popupOptions: { width: 580, height: 400 }
    });

    $stateProvider

    // route for the home page
    .state('Home', {
        url : '/',
        templateUrl : '/templates/home.html',
        controller  : 'HomeController'
    })

    .state('Timesheet', {
        url : '/timesheet',
        templateUrl : '/templates/timesheet.html',
        controller  : 'TimesheetController',
        // resolve: { auth: tokenValidate }
    })

    .state('Login', {
        url: '/login',
        templateUrl : '/templates/login.html',
        controller  : 'LoginController'
    })
    .state('Logout', {
        url: '/logout',
        controller: function($scope, $route, $state, $auth, $localStorage) {
            $auth.logout();
            $auth.removeToken();
            $localStorage.$reset();
            $state.go('Login');
        }
    })

    // route for the contact page
    .state('AdminLogin', {
        url: '/admin/login',
        templateUrl : '/templates/admin-login.html',
        controller  : 'AdminLoginController'
    })
    .state('AdminLogout', {
        url: '/admin/logout',
        controller  : function($scope, $route, $state, $auth, $localStorage){
            console.log('Admin logout');
            $auth.logout();
            $auth.removeToken();            
            $localStorage.$reset();
            $state.go('AdminLogin');
        }
    })
    .state('Admin', {
        url: '/admin',
        templateUrl : '/templates/admin-home.html',
        controller  : 'AdminController'
    });

    // route for the contact page
    // .otherwise({ redirectTo: '/login' });

    $locationProvider.html5Mode(true);
});

    function run($rootScope, $http, $location, $auth) {
        // keep user logged in after page refresh
        if ($auth.isAuthenticated()) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $auth.getToken();
        }

    }

    // function tokenValidate($q, $auth, $state,$timeout){
    //     if($auth.isAuthenticated())
    //     {
    //         return $q.when();
    //     }
    //     else {
    //         $timeout(function() {
    //             // This code runs after the authentication promise has been rejected.
    //             // Go to the log-in page
    //             $state.go('Login');
    //         });
    //         return $q.reject()
    //     }
    // }