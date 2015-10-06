/**
  Gets data for each registered widget
*/
var keystone = require('keystone');
var importRoutes = keystone.importer(__dirname);

exports = module.exports = function(req, res, next) {

  var locals = res.locals;
  var widgets = locals.widgets;

  var widgetRoutes = importRoutes('./widgets');

  // Run middleware for each widget
  for (var key in widgets._keys) {
    if (!widgets.hasOwnProperty(key)) continue;
    keystone.pre('render', widgetRoutes[key]);
  }

  next();
};