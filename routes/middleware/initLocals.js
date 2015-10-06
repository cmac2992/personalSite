/**
  Initialises the standard view local

  The included layout depends on the navLinks array to generate
  the navigation in the header, you may wish to change this array
  or replace it with your own templates / logic.
*/

exports = module.exports = function(req, res, next) {

  var locals = res.locals;

  locals.navLinks = [{"label":"projects","key":"projects","href":"/projects"},{"label":"thoughts","key":"thoughts","href":"/thoughts"},{"label":"experiences","key":"experiences","href":"/experiences"}];

  locals.user = req.user;

  // Create Widget class to manage data with widget middleware
  function Widgets () {
    this._keys = {};
    this._data = {};
  }
  Widgets.prototype.add = function (widgetKey, params) {
    this._keys[widgetKey] = params || {};
  }
  Widgets.prototype.data = function (widgetKey) {
    return this._data[widgetKey];
  }
  Widgets.prototype.setData = function (widgetKey, data) {
    this._data[widgetKey] = data
  };
  locals.widgets = new Widgets();

  next();

};