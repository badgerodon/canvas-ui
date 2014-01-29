(function() {

var View = CanvasUI.View;

var Screen = CanvasUI.Screen = function(attrs) {
	attrs = extend(Screen.defaults, attrs);
	View.call(this, attrs);
};
Screen.prototype = new View;
Screen.defaults = {
	left: 0,
	top: 0,
	width: function() {
		return CanvasUI.canvas.width;
	},
	height: function() {
		return CanvasUI.canvas.height;
	}
};
Screen.prototype.draw = function(ctx) {
	View.prototype.draw.apply(this, arguments);

	for (var i =0; i<this._children.length; i++) {
		var c = this._children[i];
		c.draw(ctx);
	}
};
Screen.prototype.measure = function() {
	return {
		width: CanvasUI.canvas.width,
		height: CanvasUI.canvas.height
	};
};

})();
