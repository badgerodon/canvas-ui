(function() {

var View = CanvasUI.View,
	HORIZONTAL = CanvasUI.HORIZONTAL,
	VERTICAL = CanvasUI.VERTICAL;

var LinearLayout = CanvasUI.LinearLayout = function(attrs) {
	View.call(this, attrs);

	this._orientation = attrs.orientation || VERTICAL;
};
LinearLayout.prototype = new View;
LinearLayout.prototype.measure = function(ctx) {
	this._measuredWidth = 0;
	this._measuredHeight = 0;
	for (var i=0; i<this._children.length; i++) {
		var c = this._children[i];
		c.measure(ctx);

		if (this._orientation === HORIZONTAL) {
			this._measuredWidth += c.getMeasuredWidth();
			this._measuredHeight = Math.max(this._measuredHeight, c.getMeasuredHeight());
		} else {
			this._measuredWidth = Math.max(this._measuredWidth, c.getMeasuredWidth());
			this._measuredHeight += c.getMeasuredHeight();
		}
	}
};
LinearLayout.prototype.draw = function(ctx, left, top, right, bottom) {
	View.prototype.draw.apply(this, arguments);

	for (var i =0; i<this._children.length; i++) {
		var c = this._children[i];
		c.draw(ctx, left, top, right, bottom);

		if (this._orientation === HORIZONTAL) {
			left += c.getMeasuredWidth();
		} else {
			top += c.getMeasuredHeight();
		}
	}
};

})();
