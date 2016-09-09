// A Plataforma - Login Service
//
// Angular.JS Service to handle login, signup and password reset.
//

app.factory('$loginService', ['$http','$rootScope', function($http,$rootScope) {
	
	var f = {};

	f.userLogin = function(){
		$http.get('/login').success(function (response){$rootScope.$broadcast('eventLogin', response)});
	}

	return f;

}]);