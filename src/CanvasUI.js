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
    CanvasUI.canvas.style.width = window.innerWidth + "px";
    CanvasUI.canvas.style.height = window.innerHeight + "px";

    onDraw(evt);
  }
  
  function onDraw(evt) {
  	var ctx = CanvasUI.ctx;
  	ctx.clearRect(0, 0, CanvasUI.canvas.width, CanvasUI.canvas.height);
  	ctx.save();
  	
    if (CanvasUI.root) {
    	CanvasUI.root.draw(CanvasUI.ctx);
    }
    
    ctx.restore();
  }
  
  function onClick(evt) {
  	var x = evt.pageX;
  	var y = evt.pageY;
  	
  	var matched = [];
  	
  	function testMatch(view) {
  		if (x >= view.left() && 
  			y >= view.top() && 
  			x < view.left() + view.width() && 
  			y < view.top() + view.height()) {
  			matched.push(view);
  			
  			for (var i=0; i<view._children.length; i++) {
  				testMatch(view._children[i]);
  			}
  		}
  	}
  	
  	if (CanvasUI.root) {
  		testMatch(CanvasUI.root);
  	}
  	
  	matched.reverse();
  	for (var i=0; i<matched.length; i++) {
  		matched[i].trigger("click");
  	}
  }
  
  var hovered = {};
  function onMouseMove(evt) {
  	var x = evt.pageX;
  	var y = evt.pageY;
  	
  	var matched = {};
  	
  	function testMatch(view) {
  		if (x >= view.left() && 
  			y >= view.top() && 
  			x < view.left() + view.width() && 
  			y < view.top() + view.height()) {
  			matched[view.id] = view;
  			
  			for (var i=0; i<view._children.length; i++) {
  				testMatch(view._children[i]);
  			}
  		}
  	}
  	
  	if (CanvasUI.root) {
  		testMatch(CanvasUI.root);
  	}
  	
  	var toEnter = [];
  	var toLeave = [];
  	
  	for (var id in matched) {
  		if (!hovered[id]) {
  			hovered[id] = matched[id];
  			toEnter.push(matched[id]);
  		}
  	}
  	for (var id in hovered) {
  		if (!matched[id]) {
  			toLeave.push(hovered[id]);
  		}
  	}
  	
  	toEnter.reverse();
  	toLeave.reverse();
  	
  	for (var i=0; i<toEnter.length; i++) {
  		toEnter[i].trigger("mouseenter");
  	}
  	for (var i=0; i<toLeave.length; i++) {
  		toLeave[i].trigger("mouseleave");
  		delete(hovered[toLeave[i].id]);
  	}
  }
  
  var textHeightCache = {};
  CanvasUI.measureTextHeight = function(view, text) {
    var key = [view.fontWeight, view.fontSize, view.fontFamily].join(' ');
    if (!textHeightCache[key]) {
      var div = document.createElement("div");
          div.innerHTML = text;
          div.style.position = 'absolute';
          div.style.top  = '-9999px';
          div.style.left = '-9999px';
          div.style.fontFamily = view.fontFamily;
          div.style.fontWeight = view.fontWeight;
          div.style.fontSize = view.fontSize;
      document.body.appendChild(div);
      textHeightCache[key] = div.offsetHeight;
      document.body.removeChild(div);
    }
    return textHeightCache[key]
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
  
  var focused = null;
  CanvasUI.blur = function() {
  	if (focused) {
  		focused.trigger("blur");
  	}
  };
  CanvasUI.focus = function(view) {
  	CanvasUI.blur();
  	focused = view;
  	view.trigger("focus");
  };
  
  CanvasUI.init = function() {
    CanvasUI.canvas = document.getElementsByTagName("canvas")[0];
    CanvasUI.ctx = CanvasUI.canvas.getContext("2d");
    window.addEventListener("resize", onResize, false);
    window.addEventListener("click", onClick, false);
    window.addEventListener("mousemove", onMouseMove, false);
    onResize();
  };
  
  CanvasUI.setRoot = function(root) {
  	CanvasUI.root = root;
  	CanvasUI.root.bind("change", onDraw);
  	onDraw();
  };
  
})();