/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var importRoutes = keystone.importer(__dirname);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
	middleware: importRoutes('./middleware')
};

// Common Middleware
keystone.pre('routes', routes.middleware.initLocals);

keystone.pre('render', routes.middleware.metatags);
keystone.pre('render', routes.middleware.widgets);

// Setup Route Bindings
exports = module.exports = function(app) {

	// Views
	app.get('/', routes.views.index);
  app.get('/search', routes.views.search);
  app.get('/tag/:tag', routes.views.tag);
  app.get('/medialist/:post', routes.views.mediaList);
  app.get('/medialist/:post/:itemNumber', routes.views.mediaList);
  app.get('/authors/:author', routes.views.authors);
  app.get('/:category', routes.views.category);
  app.get('/:category/:post', routes.views.post);

  // API Routes
  app.get('/api/post/search', keystone.middleware.api, routes.api.post.search);
  app.post('/api/emailsubscribe', keystone.middleware.api, routes.api.emailSubscribe);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
};
