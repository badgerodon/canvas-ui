(function() {

var textHeightCache = {};

var View = CanvasUI.View;

var Text = CanvasUI.Text = function(attrs) {
  View.call(this, attrs);

  this.text = attrs.text || "";
  this.fontWeight = attrs.fontWeight || "normal";
  this.fontSize = attrs.fontSize || "12px";
  this.fontFamily = attrs.fontFamily || "Arial";
  this.textShadow = attrs.textShadow || null;
  this.color = attrs.color || "#000000";
};
Text.prototype = new View;
Text.prototype.measure = function(ctx) {
  ctx.save();

  this.applyStyles(ctx);
  var metrics = ctx.measureText(this.text);
  this._measuredWidth = metrics.width
  if (metrics.emHeightAscent || metrics.emHeightDescent) {
    this._measuredHeight = metrics.emHeightAscent + metrics.emHeightDescent;
  } else {
    var key = [this.fontWeight, this.fontSize, this.fontFamily].join(' ');
    if (!textHeightCache[key]) {
      var div = document.createElement("div");
          div.innerHTML = this.text;
          div.style.position = 'absolute';
          div.style.top  = '-9999px';
          div.style.left = '-9999px';
          div.style.fontFamily = this.fontFamily;
          div.style.fontWeight = this.fontWeight;
          div.style.fontSize = this.fontSize;
      document.body.appendChild(div);
      textHeightCache[key] = div.offsetHeight;
      document.body.removeChild(div);
    }
    this._measuredHeight = textHeightCache[key];
  }

  ctx.restore();
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
  ctx.fillText(this.text, left + w, top);

  ctx.restore();
};
Text.prototype.draw = function(ctx) {
  View.prototype.draw.apply(this, arguments);

  ctx.save();
  
	var left = Math.round(this.left());
	var top = Math.round(this.top());
	var width = Math.round(this.width());

  this.applyStyles(ctx);
  if (this.textShadow) {
    var offsetX = this.textShadow.offsetX || 0;
    var offsetY = this.textShadow.offsetY || 0;
    var color = this.textShadow.color || "#000000";
    var blur = this.textShadow.blur || 0;
    this._drawShadow(ctx, left, top, offsetX, offsetY, color, blur);
  }
  ctx.fillText(this.text, left, top, width);

  ctx.restore();
};

})();