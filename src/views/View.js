(function() {

var nextId = 1;

var View = CanvasUI.View = function(attrs) {
	if (attrs) {
		this.id = nextId++;
		this._children = [];
		this._parent = null;
		this._background = attrs.background || null;
		this._left = attrs.left;
		this._right = attrs.right;
		this._top = attrs.top;
		this._bottom = attrs.bottom;
		this._width = attrs.width;
		this._height = attrs.height;
		this._bound = {};
		
		if (attrs.children) {
			for (var i=0; i<attrs.children.length; i++) {
				this.append(attrs.children[i]);
			}
		}
	}
};
View.prototype.left = function() {
	if (isSet(this._left)) {
		if (isFunction(this._left)) {
			return +this._left.call(this);
		} else {
			return +this._left;
		}
	} else {
		return 0;
	}
};
View.prototype.top = function() {
	if (isSet(this._top)) {
		if (isFunction(this._top)) {
			return +this._top.call(this);	
		} else {
			return +this._top;
		}
	} else {
		return 0;
	}
};
View.prototype.width = function() {
	if (isSet(this._width)) {
		if (isFunction(this._width)) {
			return +this._width.call(this);
		} else {
			return +this._width;
		}
	} else {
		return 0;
	}
};
View.prototype.height = function() {
	if (isSet(this._height)) {
		if (isFunction(this._height)) {
			return +this._height.call(this);
		} else {
			return +this._height;
		}
	} else {
		return 0;
	}
};
View.prototype.append = function(/* children */) {
	for (var i=0; i<arguments.length; i++) {
		var child = arguments[i];
		if (child._parent) {
			child._parent.remove(child);
		}

		child._parent = this;
		this._children.push(child);
	}
	this.root().trigger("change");
};
View.prototype.bind = function(name, handler) {
	if (!this._bound[name]) {
		this._bound[name] = [];
	}
	this._bound[name].push(handler);
};
View.prototype.trigger = function(name) {
	if (this._bound[name]) {
		for (var i=0; i<this._bound[name].length; i++) {
			this._bound[name][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}
};
View.prototype.root = function() {
	var p =this;
	while (p._parent) {
		p = p._parent;
	}
	return p;
};
View.prototype.parent = function() {
	return this._parent;
};
View.prototype.remove = function(child) {
	for (var i=0; i<this._children.length; i++) {
		if (this._children[i] === child) {
			this._children.splice(i, 1);
			i--;
		}
	}
	child._parent = null;
	this.root().trigger("change");
};
View.prototype.setLeft = function(obj) {
	this._left = obj;
	this.root().trigger("change");
};
View.prototype.setTop = function(obj) {
	this._top = obj;
	this.root().trigger("change");
}
View.prototype.draw = function(ctx) {
	CanvasUI.renderBackground(ctx, this, this._background);
};

})();