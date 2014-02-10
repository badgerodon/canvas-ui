var UI = {};

(function() {
	var Screen = CanvasUI.Screen,
		Frame = CanvasUI.Frame,
		Tabs = CanvasUI.Tabs,
		Button = CanvasUI.Button,
		Text = CanvasUI.Text,
		EditText = CanvasUI.EditText,
		Tabs = CanvasUI.Tabs,
		Shape = CanvasUI.Shape,
		Spinner = CanvasUI.Spinner;

	var WIDTH = 400;
	var HEIGHT = 300;
	var BAR_HEIGHT = 40;
	var FONT = "Roboto";
		
	UI.title = new Text({
		text: "Chatter",
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
	UI.topBar = new Frame({
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
			UI.title	
		]
	});
	
	UI.loadingFrame = new Frame({
		children: [
			new Spinner({
				left: function() {
					return this.parent().left() + this.parent().width() / 2 - this.width() / 2;
				},
				top: function() {
					return this.parent().top() + this.parent().height() / 2 - this.height() / 2;
				},
				width: 100,
				height: 100
			})
		]
	});
	
	// CONNECT
	UI.connectTitle = new Text({
		text: "Let's Chat",
		fontFamily: FONT,
		fontSize: "20px",
		color: "#333",
		left: function() {
			return this.parent().left() + (this.parent().width() / 2 - this.width() / 2);
		},
		top: function() {
			return this.parent().top() + (this.parent().height() / 2 - this.height() / 2) - 40;
		},
		height: function() {
			return 20;
		}
	});
	UI.connectId = new EditText({
		placeholder: "Enter a Topic",
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
	UI.connectButton = new Button({
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
	UI.connectFrame = new Frame({
		children: [
			UI.connectTitle,
			UI.connectId,
			UI.connectButton
		],
		left: function() {
			return this.parent().left()+10;
		},
		width: function() {
			return this.parent().width()-20;
		},
		top: function() {
			return this.parent().top()+10;
		},
		height: function() {
			return this.parent().height()-20;
		}
	});
	
	// Incoming Connection
	UI.incomingTitle = new Text({
		text: "Incoming",
		fontFamily: FONT,
		fontSize: "20px",
		color: "#333",
		left: function() {
			return this.parent().left() + (this.parent().width() / 2 - this.width() / 2);
		},
		top: function() {
			return this.parent().top() + (this.parent().height() / 2 - this.height() / 2) - 40;
		}
	});
	UI.incomingAcceptButton = new Button({
		text: "Accept",
		fontFamily: FONT,
		fontSize: "16px"
	});
	UI.incomingRejectButton = new Button({
		text: "Reject",
		fontFamily: FONT,
		fontSize: "16px",
		left: function() {
			return this.parent().left() + 2 + UI.incomingAcceptButton.width();
		}
	});
	UI.incomingButtonFrame = new Frame({
		left: function() {
			return this.parent().left() + (this.parent().width() / 2 - this.width() / 2);
		},
		top: function() {
			return this.parent().top() + (this.parent().height() / 2 - this.height() / 2);
		},
		height: function() {
			var max = 0;
			for (var i=0; i<this._children.length; i++) {
				max = Math.max(this._children[i].height(), max);
			}
			return max;
		},
		width: function() {
			var sum = 0;
			for (var i=0; i<this._children.length; i++) {
				sum += this._children[i].width();
			}
			return sum + (this._children.length-1)*2;
		},
		children: [
			UI.incomingAcceptButton,
			UI.incomingRejectButton
		]
	});
	UI.incomingFrame = new Frame({
		children: [
			UI.incomingTitle,
			UI.incomingButtonFrame
		]
	});
	
	// Chat
	UI.chatHistory = new Text({
		width: function() {
			return this.parent().width();
		},
		height: function() {
			return this.parent().height() - UI.chatSendButton.height();
		}
	});
	UI.chatSendButton = new Button({
		text: "Send",
		left: function() {
			return this.parent().left() + this.parent().width() - this.width();
		},
		top: function() {
			return this.parent().top() + this.parent().height() - this.height();
		}
	});
	UI.chatEntry = new EditText({
		placeholder: "Chat",
		left: function() {
			return this.parent().left();
		},
		top: function() {
			return this.parent().top() + this.parent().height() - this.height();
		},
		width: function() {
			return this.parent().width() - UI.chatSendButton.width() - 10;	
		}
	});
	UI.chatFrame = new Frame({
		children: [
			UI.chatHistory,
			UI.chatEntry,
			UI.chatSendButton
		],
		left: function() {
			return this.parent().left()+10;
		},
		width: function() {
			return this.parent().width()-20;
		},
		top: function() {
			return this.parent().top()+10;
		},
		height: function() {
			return this.parent().height()-20;
		}
	});
	
	UI.middleSection = new Frame({
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
		children: [UI.connectFrame]
	});
	
	UI.bottomBar = new Frame({
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
	
	UI.main = new Frame({
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
			UI.topBar,
			UI.middleSection,
			UI.bottomBar
		]
	});
	
	UI.screen = new Screen({
		background: "#FFF",
		children: [UI.main]
	});
	
	CanvasUI.setRoot(UI.screen);
})();
