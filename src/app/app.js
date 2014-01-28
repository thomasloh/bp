
/** @jsx React.DOM */

// Import modules
var React = require('react/addons');
var router = require('common.router');

// Import children components

/**
 * React component class definition
 */
var App = React.createClass({

  /**
   * Describes route mappings
   * @return {Object} A mapping of route to callback
   */
  routes: function() {
    return {

    };
  },

  /**
   * Describe what the component should look like
   * @return {Object} React virtual DOM object
   */
  /* jshint ignore:start */
  render() {

    // Route matching
    router.match(this.props.route, this.routes());

    // JSX
    return (


      <div className="app">


      </div>


    );

  }
  /* jshint ignore:end */

});

module.exports = App;
