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
 * @providesModule utils
 */

var _  = require('underscore');
var _s = require('underscore.string');

// Useful string functions
_.mixin(_s.exports());

// Customs...
_.mixin({

  noop: function() {

  },

  ensureUnprefixed: function(string, prefix) {
    var r = new RegExp('^' + prefix);
    return string.replace(r, '');
  },

  ensureUnsuffixed: function(string, suffix) {
    var r = new RegExp(suffix + '$');
    return string.replace(r, '');
  },

  ensureSuffixed: function(string, suffix) {

    if (_.endsWith(string, suffix)) {
      return string;
    } else {
      return string + suffix;
    }

  },

  ensureTrimmedPrefix: function(string, prefix) {
    return _.ltrim(string, prefix);
  }

});

module.exports = _;
