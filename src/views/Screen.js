(function() {

var View = CanvasUI.View;

var Screen = CanvasUI.Screen = function(attrs) {
	View.call(this, extend(attrs, {
		left: 0,
		top: 0,
		width: function() {
			return CanvasUI.canvas.width;
		},
		height: function() {
			return CanvasUI.canvas.height;
		}
	}));
};
Screen.prototype = new View;
Screen.prototype.draw = function(ctx) {
	View.prototype.draw.apply(this, arguments);

	for (var i =0; i<this._children.length; i++) {
		var c = this._children[i];
		c.draw(ctx);
	}
};

})();
