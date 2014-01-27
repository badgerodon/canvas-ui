(function() {

var View = CanvasUI.View;

var Frame = CanvasUI.Frame = function(attrs) {
	// defaults
	attrs = extend({
		left: function() {
			return this.parent().left();
		},
		top: function() {
			return this.parent().top();
		},
		width: function() {
			return this.parent().width();
		},
		height: function() {
			return this.parent().height();
		}
	}, attrs);
	View.call(this, attrs);
};
Frame.prototype = new View;
Frame.prototype.draw = function(ctx) {
	View.prototype.draw.apply(this, arguments);

	for (var i =0; i<this._children.length; i++) {
		var c = this._children[i];
		c.draw(ctx);
	}
};

})();
