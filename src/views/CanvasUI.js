var CanvasUI = {};

function isFunction(x) {
	return Object.prototype.toString.call(x) == '[object Function]';
}
function isString(o) {
	return o !== null && o !== undefined && (typeof o == "string" || (typeof o == "object" && o.constructor === String));
}
function isSet(x) {
	return x !== undefined && x !== null;
}
function extend(obj1, obj2) {
	var obj3 = {};
	for (var i=0; i<arguments.length; i++) {
		for (var k in arguments[i]) {
			obj3[k] = arguments[i][k];	
		}
	}
	return obj3;
}

(function() {
  CanvasUI.VERTICAL = 1;
  CanvasUI.HORIZONTAL = 2;

  function onResize(evt) {
    CanvasUI.canvas.width = window.innerWidth;
    CanvasUI.canvas.height = window.innerHeight;

    onDraw(evt);
  }
  
  function onDraw(evt) {
  	CanvasUI.ctx.clearRect(0, 0, CanvasUI.canvas.width, CanvasUI.canvas.height);
    if (CanvasUI.root) {
    	CanvasUI.root.draw(CanvasUI.ctx);
    }
  }

  CanvasUI.renderBackground = function(ctx, view, drawable) {
    ctx.save();

    if (isString(drawable)) {
      ctx.fillStyle = drawable;
      ctx.fillRect(view.left(), view.top(), view.width(), view.height());
    } else if (drawable instanceof CanvasUI.Drawable) {
      drawable.draw(ctx, view.left(), view.top(), view.width(), view.height());
    }

    ctx.restore();
  };
  
  CanvasUI.init = function() {
    CanvasUI.canvas = document.getElementsByTagName("canvas")[0];
    CanvasUI.ctx = CanvasUI.canvas.getContext("2d");
    window.addEventListener("resize", onResize, false);
    onResize();
  };
  
  CanvasUI.setRoot = function(root) {
  	CanvasUI.root = root;
  	CanvasUI.root.bind("change", onDraw);
  	onDraw();
  };
  
})();