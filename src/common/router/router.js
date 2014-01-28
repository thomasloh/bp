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

 /**
  * Match a route
  * @public
  * @param {String} route The route to be processed
  * @param {Object} mapping The route mapping to be matched against
  * @return Invocation of matched function
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

  // Add all routes
  var routeKeys = _.keys(mapping).sort().reverse();
  _.each(routeKeys, function(r) {
    if (_.isFunction(mapping[r])) {
      r = _.ensureUnsuffixed(r, '/');
      r = __crossroads.addRoute(r + '/:rest*:', mapping[r]);
    }
  });

  // Parse
  return __crossroads.parse(route);
}

// Public API
var facade = {

  /**
   * Match a route
   * @see match()
   */
  'match': match

};


module.exports = facade;
