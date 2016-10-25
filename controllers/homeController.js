// usersControllers.js
//
// Controller for home business.
//

var homeController = {};

// Call profile route
homeController.home = function (request, response) {
    response.render('home', {message: request.flash('message'), user: request.user});
};

module.exports = homeController;