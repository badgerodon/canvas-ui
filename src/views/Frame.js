(function() {

var View = CanvasUI.View,
	FILL = CanvasUI.FILL;

var Frame = CanvasUI.Frame = function(attrs) {
	// defaults
	attrs = extend(Frame.defaults, attrs);
	View.call(this, attrs);
};
Frame.prototype = new View;
Frame.defaults = {
	left: function() {
		return this.parent().left();
	},
	top: function() {
		return this.parent().top();
	},
	width: FILL,
	height: FILL
};
Frame.prototype.draw = function(ctx) {
	View.prototype.draw.apply(this, arguments);

	for (var i =0; i<this._children.length; i++) {
		var c = this._children[i];
		c.draw(ctx);
	}
};
Frame.prototype.measure = function() {
	var maxWidth = 0, maxHeight = 0;
	for (var i=0; i<this._children.length; i++) {
		var o = this._children[i].measure();
		maxWidth = Math.max(maxWidth, o.width);
		maxHeight = Math.max(maxHeight, o.height);
	}
	return {
		width: maxWidth,
		height: maxHeight
	};
};

})();
