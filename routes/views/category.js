var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Get route params
	var page = req.query.page || 1;
	var category = req.params.category;

	// Init locals
	locals.section = category;
	locals.filters = {
		category: category,
		page: page
	};
	locals.data = {
		posts: {},
	};

	// Load the posts
	view.on('init', function(next) {

		Post.model.search(locals.filters)
			.populate('author featuredImage')
			.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			});

	});

	// Render the view
	view.render('category');

};
