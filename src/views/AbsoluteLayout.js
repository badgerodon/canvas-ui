(function() {

var View = CanvasUI.View;

var AbsoluteLayout = CanvasUI.AbsoluteLayout = function(attrs) {
	View.call(this, attrs);
};
AbsoluteLayout.prototype = new View;
AbsoluteLayout.prototype.measure = function(ctx, width, height) {
	this._measuredWidth = width;
	this._measuredHeight = height;
	
	for (var i=0; i<this._children.length; i++) {
		this._children[i].measure(ctx, width, height);
	}
};
AbsoluteLayout.prototype.draw = function(ctx, left, top, right, bottom) {
	View.prototype.draw.apply(this, arguments);

	for (var i =0; i<this._children.length; i++) {
		var c = this._children[i];
		c.draw(ctx, left, top, right, bottom);
	}
};

})();
