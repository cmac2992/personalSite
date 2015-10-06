var keystone = require('keystone');
var Post = keystone.list('Post');
var Media = keystone.list('Media');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Get URL Params
	var postSlug = req.params.post;
	var category = req.params.category;

	// Set locals
	locals.section = category;
	locals.filters = {
		post: postSlug
	};
	locals.data = {
		posts: {}
	};

	// Load the current post
	view.on('init', function (next) {

		Post.model.findOnePublished(postSlug, req.user)
			.populate('author featuredImage allTags')
			.exec(function(err, post) {
				locals.data.post = post;
				if (post) {
					locals.title= post.title;
				}
				countUniquePageview(req, post);
				next(err);
			});

	});

	// Get Media Items
	view.on('init', function (next) {
		var post = locals.data.post;

		if (!(post && post.mediaList)) {
			// post doesn't have a medialist
			return next();
		}

		Media.model.find()
			.where('mediaList', post.mediaList)
			.sort('sortOrder')
			.exec(function (err, results) {
				locals.data.mediaList = results;
				next(err);
			});

	});

	// Render the view
	view.render('post');

};

var countUniquePageview = function (req, post) {
	// Don't count admin user pageviews
	if (!(req.user && req.user.isAdmin)) {
		if (post && post._id) {
			Post.model.update({
				_id: post._id
			}, {
				$inc: {
					uniquePageviews: 1
				}
			}).exec();
		}
	}
};
