var app = angular.module('myApp', [ 'ui.router', 'ngResource', 'ui.bootstrap', 'ngRoute', 'satellizer', 'ngStorage']); 
var apiEndpoint = '/';
app.run(run);
 // configure our routes
app.config(function($locationProvider, $authProvider, $stateProvider) {
        
    $authProvider.facebook({
      clientId: '1954920324534262'
    });

    // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
    // $authProvider.facebook({
    //   clientId: '1954920324534262',
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
app.controller('NavigationController', function($scope, $auth, $localStorage) {
    $scope.isUserLoggedIn = false;
    $scope.isAdminLoggedIn = false;
    if($auth.isAuthenticated)    {
        $scope.isUserLoggedIn = !$scope.isUserLoggedIn;
    }
    else{
        if($localStorage.token)
            $scope.isAdminLoggedIn = !$scope.isAdminLoggedIn;
    }
    //$scope.$apply();
});
app.controller('TimesheetController', function($scope, $http, $localStorage, $state, $auth) {
    // if (!$auth.isAuthenticated()) {
    //     $state.go('Login');
    // }
    $scope.timesheets=[];
    $scope.errors=[];
    $scope.dt = new Date();
    $scope.allTimesheets = false;
    // $scope.timesheetClone = null;
    // $scope.displayForm = false;

    // $http.get( apiEndpoint + 'timesheet?user=' + $localStorage.currentUser.id).then(function(resp){
    //     $scope.timesheets = resp.data;
    // });
    $scope.filterTimesheet = function(){
        $scope.allTimesheets = false;
        var date = $scope.dt;
        date = encodeURIComponent(date);
        // date = date.setHours(0,0,0,0);
        // date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        console.log(encodeURIComponent(date));
        var filterEndpoint = apiEndpoint + 'timesheet?user=' + $localStorage.currentUser.id + '&date=' + date;
        $http.get( filterEndpoint ).then(function(resp){
            $scope.timesheets = resp.data;
        });
    };
    
    $scope.filterTimesheet();
    $scope.saveTimesheet = function() {
        var timesheet = $scope.timesheet;
        // var copyTimesheet = $scope.timesheet;
        // 
        if (timesheet.taskName == undefined || timesheet.taskName == null) {
            timesheet.userNameValidity = true;
        };
        var data = { 
            taskName : timesheet.taskName,
            startTime : timesheet.startTime,
            endTime : timesheet.endTime,
            user: $localStorage.currentUser.id
        };

        if( timesheet.id == undefined || timesheet.id == null || timesheet.id.length == 0)
        {
            $http.post(apiEndpoint + 'timesheet', data).then(function(resp){
                console.log("add timesheets post result " + resp);
                $scope.timesheets.push(data);
                $('.modal').modal('hide');
                 $scope.dt = new Date();
                 $scope.filterTimesheet();
            }, function(err){
                
            });
        }
        else
        {
            data.id = timesheet.id;
            $http.put(apiEndpoint + 'timesheet/' + data.id , data).then(function(resp){
                console.log("update timesheet " + resp);
                $('.modal').modal('hide');
            }, function(err){
                
            });            
        }

        

        //$scope.todoInput = ""; //reset the input text field
    };

    $scope.editTimesheet = function(timesheet){
        //console.log(timesheet.id);
        // $scope.timesheetClone = timesheet;
        // $scope.displayForm = true;
        $scope.timesheet = timesheet;
        $('.modal').modal('show');

    };
    //For Removing Task From List 
    $scope.timesheetEdit = function() {
       var data = { 
            taskName : $scope.taskName,
            startTime : $scope.startTime,
            endTime : $scope.endTime,
            user: $localStorage.currentUser.id
        };        
        $http.patch(apiEndpoint + 'timesheet', data).then(function(resp){
            console.log('PATCH timesheet resp ' +  resp);
        });
    };

    $scope.showAllTImesheets = function(){
        if($scope.allTimesheets)
        {
            $http.get( apiEndpoint + 'timesheet?user=' + $localStorage.currentUser.id).then(function(resp){
                $scope.timesheets = resp.data;
            });
        }
        else {
            $scope.filterTimesheet();
        }
    };

    $scope.editEnabled = function(timesheet, $moment){
        return !moment(moment(timesheet.startTime).format('DD-MM-YYYY')).isSame(moment().format('DD-MM-YYYY'));
    };

    $scope.resetModel = function(){
        // $scope.timesheet = $scope.timesheetClone;
    };

    //Date related field
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };
    $scope.format = 'dd-MMMM-yyyy';
    $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        startingDay: 1
    }; 
    
    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }       
});

app.controller('HomeController', function($scope, $http) {
    
});


app.controller('LoginController', function($scope, $http, $auth, $localStorage, $state) {
    $auth.isAuthenticated() ? $state.go('Timesheet') : "";
    $scope.authenticate = function(provider) {
        var a = $auth.authenticate(provider);
        a.then(function(tokenObj){
            console.log('above success');
            console.log(tokenObj);
            $localStorage.currentUser = tokenObj.data.user;
            $state.go('Timesheet');
        })
    };
});

app.controller('AdminLoginController', function($scope, $http, $localStorage, $state) {
    $scope.isLoggedIn = function(){
        return $localStorage.token && $localStorage.token.split(' ')[0] == 'Admin' ? true : false;
            
    };
    if($scope.isLoggedIn())
        $state.go('Admin');

    $scope.getToken = function(){
        return $localStorage.token && $localStorage.token.split(' ')[0] == 'Admin' ? $localStorage.token.split(' ')[1] : null;
            
    };
    $scope.adminLogin =function(){
        var data ={ 
            email : $scope.login.email,
            password : $scope.login.password
        };

        $http.post(apiEndpoint + 'admin-login', data).then(function(resp){
            $localStorage.token = 'Admin ' + resp.data.token;
            $state.go('Admin');
        }, function(err){
            console.log(err);
        });
    };
});

app.controller('AdminController', function($scope, $http, $localStorage) {
    $scope.timesheets=[];

    $scope.getToken = function(){
        return $localStorage.token && $localStorage.token.split(' ')[0] == 'Admin' ? $localStorage.token.split(' ')[1] : null;
            
    }    
    $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.getToken();

    $http.get( apiEndpoint + 'admin/timesheets').then(function(resp){
        $scope.timesheets = resp.data;
    });    
});


    function run($rootScope, $http, $location, $auth) {
        // keep user logged in after page refresh
        if ($auth.isAuthenticated()) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $auth.getToken();
        }

    }

    function tokenValidate($q, $auth, $state,$timeout){
        if($auth.isAuthenticated())
        {
            return $q.when();
        }
        else {
            $timeout(function() {
                // This code runs after the authentication promise has been rejected.
                // Go to the log-in page
                $state.go('Login');
            });
            return $q.reject()
        }
    }

    function validationMessageFormatter(err){
        
    }