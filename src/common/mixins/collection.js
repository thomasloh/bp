/**
 * React mixins for collection
 */

module.exports = {
  _bindModels: function() {
    var _this = this;
    this.props.collection.each(function(m) {
      m.on('add remove change', _this.forceUpdate.bind(_this, null), _this);
    });
  },

  _unbindModels: function() {
    var _this = this;
    this.props.collection.each(function(m) {
      m.off(null, null, _this);
    });
  },

  componentDidMount: function() {

    var _this = this;

    // Pre-check
    if (!this.props.collection) {
      return;
    }

    // Fetch data
    this.props.collection.fetch({
      success: function() {
        _this._bindModels();
        _this.forceUpdate();
      }
    });

  },

  componentWillUnmount: function() {

    // Pre-check
    if (!this.props.collection) {
      return;
    }

    // Cleanups
    this._unbindModels();

  }
};
