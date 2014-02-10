(function() {

var View = CanvasUI.View;

var Text = CanvasUI.Text = function(attrs) {
	attrs = extend(Text.defaults, attrs);
  View.call(this, attrs);

  this._text = attrs.text;
  this.fontWeight = attrs.fontWeight || "normal";
  this.fontSize = attrs.fontSize || "12px";
  this.fontFamily = attrs.fontFamily || "Arial";
  this.textShadow = attrs.textShadow || null;
  this.color = attrs.color || "#000000";
};
Text.prototype = new View;
Text.defaults = {
	text: "",
	color: "#000",
	
	left: function() {
		return this.parent().left();
	},
	top: function() {
		return this.parent().top();
	},
	width: function() {
		return this.measure().width;
	},
	height: function() {
		return this.measure().height;
	}
};
Text.prototype.applyStyles = function(ctx) {
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.font = [this.fontWeight, this.fontSize, this.fontFamily].join(' ');
  ctx.fillStyle = this.color;
};
Text.prototype._drawShadow = function(ctx, left, top, offsetX, offsetY, color, blur) {
  var w = this._measuredWidth + blur * 2;
  var h = this._measuredHeight + blur * 2;
  ctx.save();

  ctx.beginPath();
  ctx.fillStyle = "#000000";
  ctx.rect(left - blur, top - blur, w, h);
  ctx.clip();

  ctx.beginPath();
  ctx.shadowColor = color;
  ctx.shadowOffsetX = offsetX - w;
  ctx.shadowOffsetY = offsetY;
  ctx.shadowBlur = blur;
  ctx.fillText(this._text, left + w, top);

  ctx.restore();
};
Text.prototype.draw = function(ctx) {
  View.prototype.draw.apply(this, arguments);

  ctx.save();
  
	var left = Math.round(this.left());
	var top = Math.round(this.top());
	var width = Math.round(this.width());
	var height = Math.round(this.height());

  this.applyStyles(ctx);
  if (this.textShadow) {
    var offsetX = this.textShadow.offsetX || 0;
    var offsetY = this.textShadow.offsetY || 0;
    var color = this.textShadow.color || "#000000";
    var blur = this.textShadow.blur || 0;
    this._drawShadow(ctx, left, top, offsetX, offsetY, color, blur);
  }
  var lines = this._text.split("\n");
  for (var i=0; i<lines.length; i++) {
  	ctx.fillText(lines[i], left, top+i*20, width);
  }

  ctx.restore();
};
Text.prototype.measure = function() {
	return CanvasUI.measureText(this, this._text);
};
Text.prototype.text = function(value) {
	if (arguments.length) {
		this._text = value;
		this.root().trigger("change");
	} else {
		return this._text;
	}
};

})();