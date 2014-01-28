// Modules
var cacheify = require('cacheify');
var level = require('level');
var db = level('./cache');

var o = {
  reactify: cacheify(require('reactify'), db),
  es6ify: cacheify(require('es6ify'), db),
  deamdify: cacheify(require('deamdify'), db),
  db: db
};

module.exports = o;
