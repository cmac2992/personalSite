var keystone = require('keystone');
var Post = keystone.list('Post');
var _ = require('underscore');

module.exports.search = function (req, res) {
	// Filters, page, search query, category, tag, homepage
	var options = req.query;

	Post.model.search(options)
		.populate('author featuredImage', '-email, -password') // Exclude email and password
		.exec(function(err, response) {
			if (err) return res.apiError('Error', err);

			var apiResponse = {
				posts: response.results,
				next: response.next
			};

			var template = req.query.template;
			if (!template) {
				// No template, return json response
				return res.apiResponse(apiResponse);
			}

			// Render template HTML and return response
			var templateOptions = req.query.templateOptions || {};
			templateOptions = _.extend(templateOptions, {posts: response});
			res.render('api/' + template, templateOptions,
			 	function (err, html) {
					if (err) return res.apiError('Error ', err);

					apiResponse.html = html;
					res.apiResponse(apiResponse);
				});
		});
};