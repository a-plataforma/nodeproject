// A Plataforma - Angular Routes
//
// Angular.JS Routes.
//

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/service/', {
		templateUrl: 'views/Index.html'
	})
	.when('/service/login', {
		templateUrl: 'views/Login.html'
	})
	.when('/service/about', {
		templateUrl: 'views/About.html'
	})
	.otherwise({redirectTo: '/'});
}])