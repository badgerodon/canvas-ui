function onClickConnect() {
	var el = document.getElementById("input-to");
	var id = el.value;
	el.value = "";

	chatter.connectTo(id);
}
function onClickSend() {
	var el = document.getElementById("input-message");
	var message = el.value;
	el.value = "";

	chatter.sendMessage(message);
}
function trace(msg) {
	document.getElementById("status").textContent += msg + "\n";
}

(function() {
	var Screen = CanvasUI.Screen,
		Frame = CanvasUI.Frame,
		Tabs = CanvasUI.Tabs,
		Button = CanvasUI.Button,
		Text = CanvasUI.Text,
		EditText = CanvasUI.EditText,
		Tabs = CanvasUI.Tabs,
		Shape = CanvasUI.Shape;
		
	var WIDTH = 400;
	var HEIGHT = 300;
	var BAR_HEIGHT = 40;
	var FONT = "Roboto";
		
	var title = new Text({
		text: "Hello",
		width: 100,
		left: function() {
			return this.parent().left() + 10;
		},
		top: function() {
			return this.parent().top() + 7;
		},
		fontFamily: FONT,
		fontSize: "20px",
		color: "#333333"
	});
	
	var incomingFrame = new Frame({
	});
	
	
	var connectId = new EditText({
		placeholder: "Enter an ID",
		fontFamily: FONT,
		fontSize: "16px",
		left: function() {
			return this.parent().left() + (this.parent().width() / 2 - this.width() / 2);
		},
		top: function() {
			return this.parent().top() + (this.parent().height() / 2 - this.height() / 2);
		},
		width: 150
	});
	var connectButton = new Button({
		text: "Connect",
		fontFamily: FONT,
		fontSize: "16px",
		left: function() {
			return this.parent().left() + (this.parent().width() / 2 - this.width() / 2);
		},
		top: function() {
			return this.parent().top() + (this.parent().height() / 2 - this.height() / 2) + 40;
		}
	});
	connectButton.bind("click", function() {
		alert("Connect!");
	});
	var connectFrame = new Frame({
		children: [
			new Text({
				text: "Chat With Someone",
				fontFamily: FONT,
				fontSize: "20px",
				color: "#FFFFFF",
				left: function() {
					return this.parent().left() + (this.parent().width() / 2 - this.width() / 2);
				},
				top: function() {
					return this.parent().top() + (this.parent().height() / 2 - this.height() / 2) - 40;
				},
				width: function() {
					return 150;
				},
				height: function() {
					return 20;
				}
			}),
			connectId,
			connectButton
		]
	});
	
	var chatFrame = new Frame({
		
	})
		
	var topBar = new Frame({
		background: new Shape({
			solid: {
				color: "#f5f5f5"
			},
			corners: {
				topLeftRadius: 10,
				topRightRadius: 10
			},
			stroke: {
				color: "#DDD"
			}
		}),
		height: function() {
			return BAR_HEIGHT;
		},
		children: [
			title	
		]
	});
	
	var middleSection = new Frame({
		background: new Shape({
			solid: {
				color: "#FFFFFF"
			},
			stroke: {
				color: "#DDD"
			}
		}),
		left: function() {
			return this.parent().left();
		},
		top: function() {
			return this.parent().top() + BAR_HEIGHT;
		},
		width: function() {
			return this.parent().width();
		},
		height: function() {
			return this.parent().height() - BAR_HEIGHT*2;
		},
		children: [connectFrame]
	});
	
	var bottomBar = new Frame({
		background: new Shape({
			solid: {
				color: "#F5F5F5"
			},
			stroke: {
				color: "#DDDDDD"
			},
			corners: {
				bottomLeftRadius: 10,
				bottomRightRadius: 10
			}
		}),
		top: function() {
			return this.parent().top() + this.parent().height() - this.height();
		},
		height: BAR_HEIGHT
	});
	
	var main = new Frame({
		background: new Shape({
			solid: {
				color: "#333333"
			},
			corners: {
				radius: 10
			}
		}),
		left: function() {
			return this.parent().width() / 2 - this.width() / 2;
		},
		top: function() {
			return this.parent().height() / 2 - this.height() / 2;
		},
		width: function() {
			return Math.min(this.parent().width(), 400);
		},
		height: function() {
			return Math.min(this.parent().height(), 300);
		},
		children: [
			topBar,
			middleSection,
			bottomBar
		]
	});
	
	var screen = new Screen({
		background: "#FFF",
		children: [main]
	});
	
	CanvasUI.init();
	CanvasUI.setRoot(screen);
})();
