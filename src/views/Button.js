(function() {
var View = CanvasUI.View, Shape = CanvasUI.Shape;

var Button = CanvasUI.Button = function(attrs) {
	attrs = extend(Button.defaults, attrs);
  View.call(this, attrs);

  this.text = attrs.text;
  this.fontWeight = attrs.fontWeight;
  this.fontSize = attrs.fontSize;
  this.fontFamily = attrs.fontFamily;
  this.textShadow = attrs.textShadow;
  this.color = attrs.color;
  this.placeholderColor = attrs.placeholderColor;
  
  this.bind("mouseenter", function() {
  	this._background = attrs.hoverBackground;
		this.root().trigger("change");
  });
  this.bind("mouseleave", function() {
  	this._background = attrs.background;
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
		var ctx = CanvasUI.ctx;
		ctx.save();
		this.applyStyles(ctx);
		var width = CanvasUI.ctx.measureText(this.text).width;
		ctx.restore();
		return width + 20;
	},
	height: function() {
		return CanvasUI.measureTextHeight(this, this.text) + 8;
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
  ctx.fillText(this.text, this.left() + 10, this.top() + 4, this.width() - 10);

  ctx.restore();
};

})();