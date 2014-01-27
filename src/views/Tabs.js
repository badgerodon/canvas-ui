(function() {

var View = CanvasUI.View;

var Tabs = CanvasUI.Tabs = function(attrs) {
	attrs = extend(Tabs.defaults, attrs);
	View.call(this, attrs);
};
Tabs.defaults = {
	
};
Tabs.prototype = new View;
Tabs.prototype.draw = function(ctx) {
	View.prototype.draw.apply(this, arguments);

	for (var i =0; i<this._children.length; i++) {
		var c = this._children[i];
		c.draw(ctx);
	}
};

})();
