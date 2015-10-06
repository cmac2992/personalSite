// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();
require('newrelic');

// Require keystone
var keystone = require('keystone');

keystone.init({

	'name': 'personal',
	'brand': 'personal',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'view engine': 'jade',
	'views': 'templates/views',
	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,

	'user model': 'User',

	// WYSIWYG Options
	'wysiwyg cloudinary images': true,
	'wysiwyg additional buttons' : 'styleselect'
});

// Load your project's Models
keystone.import('models');
// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Cloudinary Config Options

keystone.set('cloudinary folders', true);
keystone.set('cloudinary prefix', 'personal');

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'posts': 'posts',
	'media': 'media',
	'media-lists': 'media-lists',
	'tags': 'tags',
	'users': 'users'
});

// Start Keystone to connect to your database and initialise the web server
keystone.start();
