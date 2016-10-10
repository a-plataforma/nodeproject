// A Plataforma - Angular Routes
//
// Angular.JS Routes.
//

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/Index.html'
        })
        .when('/login', {
            templateUrl: 'views/Login.html'
        })
        .when('/register', {
            templateUrl: 'views/Register.html'
        })
        .when('/about', {
            templateUrl: 'views/About.html'
        })
        .otherwise({redirectTo: '/'});
}])