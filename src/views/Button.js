(function() {
var View = CanvasUI.View, Shape = CanvasUI.Shape;

var Button = CanvasUI.Button = function(attrs) {
	attrs = extend(Button.defaults, attrs);
  View.call(this, attrs);

  this._text = attrs.text;
  this.fontWeight = attrs.fontWeight;
  this.fontSize = attrs.fontSize;
  this.fontFamily = attrs.fontFamily;
  this.textShadow = attrs.textShadow;
  this.color = attrs.color;
  this.placeholderColor = attrs.placeholderColor;
  
  this.bind("mouseenter", function() {
  	this._background = attrs.hoverBackground;
  	document.documentElement.style.cursor = "pointer";
		this.root().trigger("change");
  });
  this.bind("mouseleave", function() {
  	this._background = attrs.background;
  	document.documentElement.style.cursor = "default";
		this.root().trigger("change");
  });
};
Button.prototype = new View;
Button.defaults = {
	background: new Shape({
		corners: {
			radius: 4
		},
		solid: {
			color: "#ffffff"
		},
		stroke: {
			color: "#adadad"
		}
	}),
	hoverBackground: new Shape({
		corners: {
			radius: 4
		},
		solid: {
			color: "#DDD"
		},
		stroke: {
			color: "#adadad"
		}
	}),
	text: "",
	fontWeight: "normal",
	fontSize: "14px",
	fontFamily: "Arial",
	color: "#333",
	
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
Button.prototype.applyStyles = function(ctx) {
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.font = [this.fontWeight, this.fontSize, this.fontFamily].join(' ');
  ctx.fillStyle = this.color;
};
Button.prototype.draw = function(ctx) {
  View.prototype.draw.apply(this, arguments);

  ctx.save();

  this.applyStyles(ctx);
  ctx.fillText(this._text, this.left() + 10, this.top() + 4, this.width() - 10);

  ctx.restore();
};
Button.prototype.measure = function() {
	var o = CanvasUI.measureText(this, this._text);
	return {
		width: o.width + 20,
		height: o.height + 8
	}
};

})();