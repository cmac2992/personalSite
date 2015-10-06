/**
 * Creates all of the meta tags for the head
 */
exports = module.exports = function (req, res, next) {
  var locals = res.locals;
  var meta = locals.meta = {};

  // Tag Defaults
  meta.siteName = "personal";
  meta.title = "personal";
  meta.description = "Chris MacPherson's personal site";
  meta.fbAppId = '$$FB_APP_ID$$';
  meta.type = 'website';

  // Create Url
  var hostname = req.hostname;
  var path = req.path;
  meta.url = 'http://' + hostname + path;

  // Default image
  meta.image = {};
  meta.image.url = 'http://' + hostname + '/images/og-image.jpg';
  meta.image.width = '1200';
  meta.image.height = '630';

  if (locals.data && locals.data.post) {
    var post = locals.data.post;

    meta.type = 'article';

    // For urls explicitly set as /:category/:postSlug
    //   so canonical urls for medialist point
    //   to the original article
    meta.url = 'http://'+ hostname + post.url;

    // Post page, use post data
    if (post.featuredImage &&
        post.featuredImage.image &&
        post.featuredImage.image.exists) {
      meta.image.url = post.featuredImage._.image.fill(1200, 630);
    }

    meta.title = post.title;
    if (post.content) {
      var utils = keystone.utils;
      meta.description = utils.cropString(utils.htmlToText(post.content), 300, '...', true);
    }

    meta.article = {};
    meta.article.publisher = 'http://facebook.com/$$SITE_FACEBOOK_PAGE_ID$$';
    // meta.article.author = '';
  }

  next();
};