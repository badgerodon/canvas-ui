(function() {

  var Drawable = CanvasUI.Drawable;

  var Shape = CanvasUI.Shape = function(attrs) {
    Drawable.call(this, attrs);

    this._shape = attrs.shape || "rectangle";
    // "rectangle" | "oval" | "line" | "ring
    this._corners = attrs.corners || null;
    // { radius, topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius }
    this._gradient = attrs.gradient || null;
    // { angle, startColor, endColor }
    this._size = attrs.size || null;
    this._solid = attrs.solid || null;
    // { color }
    this._stroke = attrs.stroke || null;
    // { color }
  };
  Shape.prototype = new Drawable;
  Shape.prototype._buildPath = function(ctx, left, top, width, height) {
  	
    	left = Math.round(left - 0.5) + 0.5;
    	top = Math.round(top - 0.5) + 0.5;
    	width = Math.round(width);
    	height = Math.round(height);
  	
		var right = left + width;
		var bottom = top + height;
		
    switch (this._shape) {
    case "rectangle":
      if (this._corners) {
        var r = this._corners.radius || 0;
        var tlr = this._corners.topLeftRadius || r;
        var trr = this._corners.topRightRadius || r;
        var brr = this._corners.bottomRightRadius || r;
        var blr = this._corners.bottomLeftRadius || r;
        ctx.beginPath();
        ctx.moveTo(left, top+tlr);
        ctx.arcTo(left, top, left+tlr, top, tlr);
        ctx.lineTo(right-trr, top);
        ctx.arcTo(right, top, right, top+trr, trr);
        ctx.lineTo(right, bottom-brr);
        ctx.arcTo(right, bottom, right-brr, bottom, brr);
        ctx.lineTo(left+blr, bottom);
        ctx.arcTo(left, bottom, left, bottom-blr, blr);
        ctx.lineTo(left, top + tlr);
        ctx.closePath();
      } else {
        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(right, top);
        ctx.lineTo(right, bottom);
        ctx.lineTo(left, bottom);
        ctx.lineTo(left, top);
        ctx.closePath();
      }
      break;
    default:
      throw "unknown shape: " + this._shape;
    }
  }
  Shape.prototype.draw = function(ctx, left, top, width, height) {
    ctx.save();
    
    if (this._solid || this._gradient) {
    	this._buildPath(ctx, left, top, width, height);
    	
	    if (this._solid) {
	      ctx.fillStyle = this._solid.color;
	      ctx.fill();
	    } else if (this._gradient) {
				var right = left + width;
				var bottom = top + height;
	      var x1, y1, x2, y2;
	      var a = (this._gradient.angle || 0) % 360;
	      if (a === 0) {
	        x1 = left;
	        x2 = right;
	        y1 = top;
	        y2 = top;
	      } else if (a === 45) {
	        x1 = left;
	        x2 = right;
	        y1 = bottom;
	        y2 = top;
	      } else if (a === 90) {
	        x1 = left;
	        x2 = left;
	        y1 = bottom;
	        y2 = top;
	      } else if (a === 135) {
	        x1 = right;
	        x2 = left;
	        y1 = bottom;
	        y2 = top;
	      } else if (a === 180) {
	        x1 = right;
	        x2 = left;
	        y1 = top;
	        y2 = top;
	      } else if (a === 225) {
	        x1 = right;
	        x2 = left;
	        y1 = top;
	        y2 = bottom;
	      } else if (a === 270) {
	        x1 = left;
	        x2 = left;
	        y1 = top;
	        y2 = bottom;
	      } else if (a === 315) {
	        x1 = left;
	        x2 = right;
	        y1 = top;
	        y2 = bottom;
	      } else {
	        throw "only increments of 45 degrees are supported for the gradient angle: " + a
	      }
	      var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
	      gradient.addColorStop(0, this._gradient.startColor);
	      gradient.addColorStop(1, this._gradient.endColor);
	      ctx.fillStyle = gradient;
	      ctx.fill();
	    }
    }

    if (this._stroke) {
  		//ctx.translate(0.5, 0);
  		//width--;
  		//height--;
    	this._buildPath(ctx, left, top, width, height);
      ctx.strokeStyle = this._stroke.color;
      ctx.lineWidth=1;
      ctx.stroke();
    }
    ctx.restore();
  };

})();