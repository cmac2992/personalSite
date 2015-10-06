var keystone = require('keystone');
var Post = keystone.list('Post');
var Tag = keystone.list('Tag');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Route params
	var page = req.query.page || 1;
	var searchQuery = req.query.q || '';

	// Init locals
	locals.section = 'search';
	locals.filters = {
		page: page
	};
	locals.data = {
		posts: {}
	};

	// Load the posts
	view.on('init', function (next) {

		if (!searchQuery) {
			// No Search query
			return next();
		}

		locals.filters.search = searchQuery;

		Post.model.search(locals.filters)
			.populate('author featuredImage')
			.exec(function(err, response) {
				locals.data.posts = response;
				next(err);
			});
	});

	// Render the view
	view.render('search');
};
