/**
 * Copyright 2013 Trapit, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule router
 */

// Grab utilities
var _  = require('common.utils');
var crossroads = require('crossroads');

// Internals
var __main;

/**
* Match a route
* @public
* @param {String} route The route to be processed
* @param {Object} mapping The route mapping to be matched against
* @return {Boolean} True means route handler executed, false means
*                   redirected or non match
*/
function match(route, mapping) {

  // Pre-check
  if (_.isUndefined(mapping)) {
    console.warn("No route mapping for route to be matched against");
    return;
  }

  // Ensure route
  route = route || "";

  // Create a new crossroad instance
  var __crossroads = crossroads.create();

  // Parse routes
  var routeMatched;
  var routeMatchedResult;
  var routeKeys = _.keys(mapping).sort().reverse();
  for (var i = 0, max = routeKeys.length; i < max; i++) {
    var r       = routeKeys[i];
    var routeFn = mapping[r];

    if (_.isFunction(routeFn)) {
      r = _.ensureUnsuffixed(r, '/');
      r = __crossroads.addRoute(r + '/:rest*:');
      if (r.match(route)) {
        routeFn();
        routeMatched = true;
        break;
      }
    }
  }

  // Default route, if any
  if (!routeMatched && mapping.__default__) {
    var defaultRoute = _.ensureTrimmedPrefix(mapping.__default__, '/');
    if (process.browser) {
      // Use history.js to redirect on client side
      var redirectRoute = global.History.root + defaultRoute;
      global.requestAnimFrame(function() {
        global.History.pushState({
          urlPath: _.ensurePrefixed(mapping.__default__, '/')
        }, '', redirectRoute);
      });
    } else {
      // For server redirect later
      global.location.__redirect__ = defaultRoute;
    }
    return false;
  }

  return true;

}

/**
* Navigate to another route
* @public
* @param {String} route The route to navigate to
* @return Invocation of matched function
*/

function navigate(route) {

  if (!global.History) {
    return console.warn("No History object found, navigation failed.");
  }

  if (!route || !_.isString(route)) {
    return console.warn("Route not a valid string, navigation failed.");
  }

  // Always do fresh navigation
  global.History.savedStates = [];

  // Do it
  global.History.pushState({
    urlPath: route
  }, null, _.ensureUnsuffixed(global.History.root, '/') + _.ensurePrefixed(route, '/'));

}

// Constructor
function Router() {

  // Track
  __main = this;

  // Public API
  _.extend(this, {

    /**
     * Match a route
     * @see match()
     */
    'match': match,

    /**
     * Navigate to another route
     * @see navigate()
     */
    'navigate': navigate,

    /**
     * Override
     */
    'redirect': _.noop

  });

}

module.exports = new Router();
