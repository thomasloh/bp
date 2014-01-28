// Grab utilities
var _ = require('common.utils');
var React = require('react/addons');
var History = global.History = require('html5-history');

// Grab app
var App = require('./app/app');

// Apply es5 shim
require('es5-shim-sham');

function Client(options) {

  options = options || {};

  /**
   * Internal variables
   * @internal
   */

  var __client, __App, __options, __env;


  /**
   * Reference variables
   */
  var self = this;

  /**
   * Constants
   */

  /**
   * Helpers
   */

  var slice = Array.prototype.slice.apply;


  /**
   * Constructor function
   * @private
   * @internal
   */
  function _constructor() {

    /**
     * Preprocesss options that are passed in
     * @private
     * @internal
     */
    function _preprocessOptions() {
      // Track
      __options = options.options || {};
      __options.App = options.App;

      // Validate
      if (!__options.App) {
        throw new Error('Expecting an `App` class that represents the top level view of the app');
      }
    }

    /**
     * Processs options that are passed in
     * @private
     * @internal
     */
    function _processOptions() {

      /////////////////////////
      // Application options //
      /////////////////////////

      // Initialise app
      __App = __options.App;

    }

    /**
     * Kickstart history.js
     * @private
     * @internal
     */
    function _startHistory() {

      var document = global.document;

      function query() {
        return document.querySelectorAll.apply(document, arguments);
      }

      // Detect state changes
      History.Adapter.bind(global, 'statechange', function() {
        // Grab current history state
        var state = History.getState();
        // Render app
        React.renderComponent(__App({
          route: state.data.urlPath
        }), global.document.body);
      });

      // Init detection of state changes
      document.addEventListener('DOMContentLoaded', function() {

        function isAnchor(t) {
          return t.nodeName === 'A' && t.tagName === 'A';
        }

        function stateChangeEvent(o) {
          History.pushState({
            urlPath: o.urlPath
          }, o.title, o.urlPath);
        }

        // At this point, it is assumed "body" is ready, which is true
        // most of the time.
        // Rely on event-bubbling to capture clicks on anchor tags
        query('body')[0].addEventListener('click', function(e) {

          // Detect anchors only
          if (e.target && isAnchor(e.target)) {

            // Prevent server request
            e.preventDefault();

            // Extract url
            var urlPath = e.target.getAttribute('href');

            if (_.startsWith(urlPath, '#')) {
              return true;
            }

            // Delegate
            stateChangeEvent({
              urlPath: urlPath,
              title: e.target.text
            });
          }

        }, false);


      }, false);
    }

    // Preprocess options
    _preprocessOptions();

    // Process options
    _processOptions();

    // Start history.js
    _startHistory();

    // Render app
    document.addEventListener('DOMContentLoaded', function() {
      React.renderComponent(__App({
        route: global.location.pathname
      }), global.document.body);
    }, false);

  }

  // Initialises
  _constructor();

  // Public APIs
  _.extend(self, {

  });

  return self;

}


var client = new Client({
  App: App
});
