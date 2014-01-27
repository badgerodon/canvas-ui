var Chatter = function() {
	this._peers = {};
	this._startWebSocket();
};
Chatter.prototype = {
	_acceptAnswer: function(from, description) {
		var connection = this._peers[from].connection;

		trace("Received Answer from " + from);

		connection.setRemoteDescription(new RTCSessionDescription(description));
	},
	_acceptOffer: function(from, description) {
		var self = this;

		trace("Received Offer from " + from);

		this._startPeerConnection(from);

		var connection = this._peers[from].connection;

		connection.setRemoteDescription(new RTCSessionDescription(description));
		connection.createAnswer(function(description) {
			connection.setLocalDescription(description);
			self._send(from, "ANSWER:" + JSON.stringify(description));
		});
	},
	_addCandidate: function(from, candidate) {
		var self = this;

		trace("Received Candidate from " + from);

		var connection = this._peers[from].connection;
		connection.addIceCandidate(new RTCIceCandidate(candidate));
	},
	_startWebSocket: function() {
		var self = this;
		var first = true;
		trace("Establishing Web Socket");
		this._webSocket = new WebSocket("ws://" + location.host + ":9000/connect");
		this._webSocket.onopen = function(evt) {
			trace("Web Socket Connected");
			console.log("WS OPEN", evt);
		};
		this._webSocket.onerror = function(evt) {
			console.log("WS ERROR", evt);
		};
		this._webSocket.onmessage = function(evt) {
			console.log("WS MESSAGE", evt.data);
			if (first) {
				self._id = evt.data;
				first = false;

				document.getElementById("session-id").textContent = self._id;
			}
			var parts = evt.data.split(':');
			var from = parts[0];
			var to = parts[1];
			var action = parts[2];
			var data = parts.slice(3).join(":");

			if (to !== self._id) {
				return;
			}

			switch(action) {
			case "OFFER":
				self._acceptOffer(from, JSON.parse(data));
				break;
			case "ANSWER":
				self._acceptAnswer(from, JSON.parse(data));
				break;
			case "CANDIDATE":
				self._addCandidate(from, JSON.parse(data));
				break;
			}
		};
		this._webSocket.onclose = function(evt) {
			console.log("WS CLOSE", evt);
		};
	},
	_startPeerConnection: function(to) {
		var self = this;

		if (this._peers[to]) {
			return;
		}

		trace("Establishing Peer Connection to " + to);

		var pc = new RTCPeerConnection({
			iceServers: [{
				url: "stun:stun.l.google.com:19302"
			}]
		}, {
			optional: [{
		        RtpDataChannels: true
		    }]
		});
		pc.onicecandidate = function(evt) {
			console.log("PC ICECANDIDATE:", evt);
			if (evt.candidate) {
				self._send(to, "CANDIDATE:" + JSON.stringify(evt.candidate));
			}
		};
		pc.onaddstream = function(evt) {
			console.log("PC ADDSTREAM:", evt);
		};
		pc.onremovestream = function(evt) {
			console.log("PC REMOVESTREAM:",evt);
		};
		pc.onsignalingstatechange = function(evt) {
			console.log("PC SIGNALINGSTATECHANGE", pc.signalingState);
		};
		pc.oniceconnectionstatechange = function(evt) {
			console.log("PC ICECONNECTIONSTATECHANGE", evt);
		};

		var dc = pc.createDataChannel('RTCDataChannel', {
		    reliable: true
		});
		dc.onmessage = function (evt) {
			console.log("DC MESSAGE:", evt.data);

			var parts = evt.data.split(":");
			var action = parts[0];
			var data = parts.slice(1).join(":");

			switch(action) {
			case "MESSAGE":
				trace("Received Message from " + to + ": " + data);
				break;
			}
	    };
	    dc.onopen = function () {
	    	console.log("DC OPEN");

	    	trace("Data Channel Open with " + to);
	    };
	    dc.onclose = function (e) {
	        console.log("DC CLOSE");
	    };
	    dc.onerror = function (e) {
	        console.log("DC ERROR");
	    };

	    this._peers[to] = {
	    	connection: pc,
	    	dataChannel: dc
	    };
	},
	_send: function(to, msg) {
		this._webSocket.send(this._id+":"+to+":"+msg);
	},
	_trace: function(msg) {
	},

	connectTo: function(to) {
		var self = this;

		this._startPeerConnection(to);

		var connection = this._peers[to].connection;

		var mediaConstraints = {
		    optional: [],
		    mandatory: {
		        OfferToReceiveAudio: false, // Hmm!!
		        OfferToReceiveVideo: false // Hmm!!
		    }
		};
		connection.createOffer(function(description) {
			connection.setLocalDescription(description);
			self._send(to, "OFFER:" + JSON.stringify(description));
		}, null, mediaConstraints);
	},

	sendMessage: function(message) {
		var self = this;

		for (var to in this._peers) {
			var dc = this._peers[to].dataChannel;

			dc.send("MESSAGE:"+message);
		}
	},

};