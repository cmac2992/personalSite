var keystone = require('keystone');
var Post = keystone.list('Post');
var Media = keystone.list('Media');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Get URL Params
	var postSlug = req.params.post;
	var itemNumber = req.params.itemNumber;

	// Set locals
	locals.filters = {
		post: postSlug,
		itemNumber: itemNumber
	};
	locals.data = {};

	// Load the current post
	view.on('init', function (next) {

		Post.model.findOnePublished(postSlug, req.user)
			.populate('author featuredImage allTags')
			.exec(function(err, post) {
				locals.data.post = post;
				next(err);
			});

	});

	// Get Media Items
	view.on('init', function (next) {
		var post = locals.data.post;

		if (!(post && post.medialist)) {
			// Post not found or post doesn't have a medialist
			return next();
		}


		Media.model.find()
			.where('mediaList', post.mediaList)
			.sort('sortOrder')
			.exec(function (err, results) {
				var mediaList = results
				locals.data.mediaList = mediaList;

				if (itemNumber && mediaList && mediaList.length > 0) {
					// Is media item slide

					// Get next and previous slide routes
					var currentItem  = mediaList[itemNumber - 1];
					locals.data.currentItem = currentItem;
					// Next Item Route
					if (mediaList[itemNumber]) {
						var nextItemNumber = parseInt(itemNumber) + 1
						locals.data.nextItem = '/medialist/'+postSlug+'/'+nextItemNumber;
					}
					// Prev Item Route
					if (mediaList[itemNumber - 2]) {
						var prevItemNumber = parseInt(itemNumber) - 1;
						locals.data.prevItem = '/medialist/'+postSlug+'/'+prevItemNumber;
					}

					// Set data to render in template
					locals.headline = currentItem.headline;
					locals.caption = currentItem.caption;
					locals.mediaItem = currentItem;
					if (currentItem.image.exists) {
						locals.image = currentItem._.image;
					}

				} else if (mediaList && mediaList.length > 0) {
					// Is Starting Slide, post view
					locals.data.nextItem = '/medialist/'+postSlug+'/1';

					// Set data to render in template
					locals.caption = post.content;
					locals.mediaItem = post.featuredImage;
					if (post.featuredImage && post.featuredImage.exists) {
						locals.image = post.featuredImage._.image;
					}

				}
				next(err);
			});
	});

	// Get Next Post For Infinite Slideshow
	view.on('init', function (next) {
		if (locals.data.nextItem) {
			// Not last slide, continue
			return next();
		}

		Post.model.findOne()
			.where('slug').ne(postSlug)
			.where('mediaList').exists(true)
			.sort('-uniquePageviews')
			.exec(function(err, result) {
				if (result) {
					locals.data.nextItem = '/medialist/'+result.slug;
				}
				next(err);
			})
	});

	// Render the view
	view.render('mediaList');

};