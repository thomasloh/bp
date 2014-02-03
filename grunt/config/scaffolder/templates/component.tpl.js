
/** @jsx React.DOM */

// Import modules
var React = require('react/addons');
var router = require('common.router');

// Import children components

/**
 * React component class definition
 */
var <%= constructorName %> = React.createClass({

  /**
   * Describes route mappings
   * @return {Object} A mapping of route to callback
   */
  routes: function() {
    return {

    };
  },

  /**
   * Describe types of properties that can be passed in
   * @type {Object}
   * Available types:
   * - React.PropTypes.array
   * - React.PropTypes.bool
   * - React.PropTypes.func
   * - React.PropTypes.number
   * - React.PropTypes.object
   * - React.PropTypes.string
   * - React.PropTypes.oneOf(Array)
   * - React.PropTypes.instanceOf(SomeClass)
   *
   * *All above chainable with .isRequired.
   * or a function(props, propName, componentName)
   */
  propTypes: {
    // Route to be processed by this component
    route: React.PropTypes.string
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


      <div className="<%= className %>">


      </div>


    );

  }
  /* jshint ignore:end */

});

module.exports = <%= constructorName %>;
