var keystone = require('keystone');
var Post = keystone.list('Post');
var Tag = keystone.list('Tag');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	var page = req.query.page || 1;
	var tagSlug = req.params.tag;

	// Init locals
	locals.section = tagSlug;
	locals.filters = {
		page: page
	};
	locals.data = {
		posts: {}
	};

	// Get Tag Id
	view.on('init', function (next) {

		Tag.model.findOne()
			.where('slug', tagSlug)
			.exec(function(err, result) {
				if (result) {
					locals.filters.tag = result._id;
				}
				next(err);
			});

	});

	// Load the posts
	view.on('init', function (next) {

		if (!locals.filters.tag) {
			// No tag found
			return next();
		}

		Post.model.search(locals.filters)
			.populate('author featuredImage')
			.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			});

	});

	// Render the view
	view.render('tag');

};
