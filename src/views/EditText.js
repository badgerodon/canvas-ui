(function() {
var View = CanvasUI.View, Shape = CanvasUI.Shape;

var EditText = CanvasUI.EditText = function(attrs) {
	attrs = extend(EditText.defaults, attrs);
  View.call(this, attrs);

  this.placeholder = attrs.placeholder;
  this.fontWeight = attrs.fontWeight;
  this.fontSize = attrs.fontSize;
  this.fontFamily = attrs.fontFamily;
  this.textShadow = attrs.textShadow;
  this.color = attrs.color;
  this.placeholderColor = attrs.placeholderColor
  
  this.bind("click", function() {
  	CanvasUI.focus(this);
  });
  var textarea = null;
  this.focused = false;
  this.bind("focus", function() {
  	if (!textarea) {
	  	var self = this;
	  	textarea = document.createElement("textarea");
	  	textarea.style.position = 'absolute';
	  	textarea.style.left = "-999px";
	  	textarea.style.top = "-999px";
	  	textarea.style.width = "2px";
	  	textarea.style.height = "2px";
	  	textarea.addEventListener("blur", function() {
	  		CanvasUI.blur();
	  	}, false);
	  	textarea.addEventListener("keyup", function() {
	  		self.value(textarea.value);
	  	}, false);
	  	textarea.addEventListener("keydown", function() {
	  		self.value(textarea.value);
	  	}, false);
	  	document.documentElement.appendChild(textarea);
	  	textarea.focus();
  	}
  	this.focused = true;
		this.root().trigger("change");
  });
  this.bind("blur", function() {
  	if (textarea) {
	  	document.documentElement.removeChild(textarea);
	  	textarea = null;
  	}
  	this.focused = false;
		this.root().trigger("change");
  });
};
EditText.prototype = new View;
EditText.defaults = {
	background: new Shape({
		corners: {
			radius: 5
		},
		solid: {
			color: "#FFFFFF"
		},
		stroke: {
			color: "#CCC"
		}
	}),
	placeholder: "",
	fontWeight: "normal",
	fontSize: "14px",
	fontFamily: "Arial",
	color: "#555",
	placeholderColor: "#999",
	
	left: function() {
		return this.parent().left();
	},
	top: function() {
		return this.parent().top();
	},
	width: function() {
		return CanvasUI.measureText(this, this._value ? this._value : this.placeholder).width + 10;
	},
	height: function() {
		return CanvasUI.measureText(this, this._value ? this._value : this.placeholder).height + 8;
	}
};
EditText.prototype.applyStyles = function(ctx) {
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.font = [this.fontWeight, this.fontSize, this.fontFamily].join(' ');
  ctx.fillStyle = this._value ? this.color : this.placeholderColor;
};
EditText.prototype.draw = function(ctx) {
  View.prototype.draw.apply(this, arguments);

  ctx.save();

	var left = Math.round(this.left() + 5);
	var top = Math.round(this.top() + 4);
	var width = Math.round(this.width() - 10);

  this.applyStyles(ctx);
  var text = this._value ? this._value : this.placeholder;
  ctx.fillText(text, left, top, width);
  if (this.focused) {
  	ctx.fillRect(left + (this._value ? (this.measure().width-10) : 0), top, 1, this.measure().height-8);
  }

  ctx.restore();
};
EditText.prototype.value = function(value) {
	if (arguments.length === 1) {
		this._value = value;
		this.root().trigger("change");
	} else {
		return this._value || "";
	}
};
EditText.prototype.measure = function() {
	var o = CanvasUI.measureText(this, this._value ? this._value : this.placeholder);
	return {
		width: o.width + 10,
		height: o.height + 8
	};
};

})();