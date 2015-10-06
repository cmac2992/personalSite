var keystone = require('keystone');
var User = keystone.list('User');
var Post = keystone.list('Post');
var _ = require('underscore');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	var page = req.query.page || 1;

	// Get URL Params
	var authorSlug = req.params.author;

	// Init locals
	locals.section = 'authors';
	locals.filters = {
		page: page
	};
	locals.data = {
		posts: {}
	};

	// Get Author object from slug in url
	view.on('init', function (next) {

		User.model.findOne()
			.where('slug', authorSlug)
			.exec(function(err, author) {
				if (author) {
					locals.data.author = author;
					// Add filter for post search api
					locals.filters.author = author._id;
					next();
				} else {
					next(err);
				}
			});

	});

	// Get Posts for author
	view.on('init', function (next) {
		if (!locals.data.author) {
			// No author found
			return next();
		}

		Post.model.search(locals.filters)
			.populate('author featuredImage')
			.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			});
	});

	view.render('authors');
}