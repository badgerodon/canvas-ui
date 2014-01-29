(function() {

var View = CanvasUI.View;

Spinner = CanvasUI.Spinner = function(attrs) {
	attrs = extend(Spinner.defaults, attrs);
	View.call(this, attrs);
	
	this.start = new Date();
	this.lines = attrs.lines;
};
Spinner.prototype = new View;
Spinner.defaults = {
	lines: 16,
	
	left: function() {
		return this.parent().left()+1;
	},
	top: function() {
		return this.parent().top()+1;
	},
	width: function() {
		return this.parent().width()-2;
	},
	height: function() {
		return this.parent().height()-2;
	}
};
Spinner.prototype.draw = function(ctx) {
	ctx.save();
	
	var left = this.left(), top = this.top(), width = this.width(), height = this.height();
	var rotation = parseInt(((new Date() - this.start) / 1000) * this.lines) / this.lines;
	
	ctx.clearRect(left, top, width, height);
	ctx.translate(left + width/2, top + height/2);
	ctx.rotate(Math.PI*2*rotation);
	for (var i=0; i<this.lines; i++) {
	  ctx.beginPath();
    ctx.rotate(Math.PI * 2 / this.lines);
    ctx.moveTo(width / 10, 0);
    ctx.lineTo(width / 4, 0);
    ctx.lineWidth = width / 30;
    ctx.strokeStyle = "rgba(0,0,0," + i / this.lines + ")";
    ctx.stroke();
	}
	
	ctx.restore();
};
Spinner.prototype.animate = function(ctx) {
	this.draw(ctx);
};
	
})();