var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	var page = req.query.page || 1;

	// Init locals
	locals.section = 'home';
	locals.filters = {
		home: true,
		page: page
	};
	locals.data = {
		posts: {},
		featuredPosts: []
	};

	// Load the featured posts
	view.on('init', function(next) {

		Post.model.find()
			.where('state', 'published')
			.where('publishedDate').lt(new Date())
			.where('featureOnHomepage', true)
			.limit(3) // Number of featured posts for featured section
			.sort('-publishedDate')
			.populate('author featuredImage')
			.exec(function(err, results) {
				locals.data.featuredPosts = results;
				next(err);
			});

	});

	// Load the normal posts
	view.on('init', function(next) {

		Post.model.search(locals.filters)
			.populate('author featuredImage')
			.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			});

	});

	// Render the view
	view.render('index');

};
