var Chatter = function(attrs) {
	attrs = attrs || {};
	
	this._topics = [];
	this._peers = {};
	
	this._startWebSocket();
	
	this._onOpen = attrs.onOpen || function(id) {};
	this._onConnect = attrs.onConnect || function(id) {};
	this._onDisconnect = attrs.onDisconnect || function(id) {};
	this._onOffer = attrs.onOffer || function() {};
	this._onAnswer = attrs.onAnswer || function() {};
	this._onMessage = attrs.onMessage || function() {};
};
Chatter.prototype = {
	_acceptRemote: function(from, description) {
		if (!this._peers[from]) {
			this._startPeerConnection(from);
		}
		var peer = this._peers[from];
		peer.connection.setRemoteDescription(new RTCSessionDescription(description));
		for (var i=0; i<peer.candidates.length; i++) {
			peer.connection.addIceCandidate(peer.candidates[i]);
		}
		peer.candidates = [];
		
		this._onConnect(from);
	},
	_acceptCandidate: function(from, candidate) {
		var peer = this._peers[from];
		if (peer.connection.remoteDescription) {
			peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
		} else {
			peer.candidates.push(candidate);
		}
	},
	_sendAnswer: function(to) {
		var self = this;
		var peer = this._peers[to];
		peer.connection.createAnswer(function(description) {
			peer.connection.setLocalDescription(description);
			self._send({
				type: "ANSWER",
				data: description,
				to: to
			});
		});
	},
	_sendOffer: function(to) {
		var self = this;
		var peer = this._peers[to];
		peer.connection.createOffer(function(description) {
			peer.connection.setLocalDescription(description);
			self._send({
				to: to,
				type: "OFFER",
				data: description
			});
		}, null, {
			optional: [],
			mandatory: {
				OfferToReceiveAudio: false, 
				OfferToReceiveVideo: false 
			}
		});
	},
	_startWebSocket: function() {
		var self = this;
		this._webSocket = new WebSocket("ws://" + location.host + ":9000/channel");
		this._webSocket.onopen = function(evt) {
			console.log("WS OPEN", evt);
		};
		this._webSocket.onerror = function(evt) {
			console.log("WS ERROR", evt);
		};
		this._webSocket.onmessage = function(evt) {
			var msg = JSON.parse(evt.data);
			
			console.log(msg.type, msg.from, msg.data);
			
			switch (msg.type) {
			case "ID":
				if (msg.from === 0) {
					self._id = msg.to;
					self._onOpen(self._id);
				}
				break;
			case "ANSWER":
				self._acceptRemote(msg.from, msg.data);
				break;
			case "CANDIDATE":
				self._acceptCandidate(msg.from, msg.data);
				break;
			case "OFFER":
				self._acceptRemote(msg.from, msg.data);
				self._sendAnswer(msg.from);
				break;
			case "SUBSCRIBED":
				self._startPeerConnection(msg.from);
				self._sendOffer(msg.from);
				break;
			}
		};
		this._webSocket.onclose = function(evt) {
			console.log("WS CLOSE", evt);
		};
	},
	_startPeerConnection: function(userId) {
		var self = this;
		
		var peer = this._peers[userId] = {
			id: userId,
			connection: null,
			candidates: [],
			hasRemote: false
		};

		peer.connection = new RTCPeerConnection({
			iceServers: [{
				url: "stun:stun.l.google.com:19302"
			}]
		}, {
			optional: [{
				RtpDataChannels: true
		  }]
		});
		peer.connection.onicecandidate = function(evt) {
			if (evt.candidate) {
				self._send({
					to: userId,
					type: "CANDIDATE",
					data: evt.candidate
				});
			}
		};
		peer.connection.onaddstream = function(evt) {
			console.log("PC ADDSTREAM:", evt);
		};
		peer.connection.onremovestream = function(evt) {
			console.log("PC REMOVESTREAM:",evt);
		};
		peer.connection.onsignalingstatechange = function(evt) {
			console.log("PC SIGNALINGSTATECHANGE", peer.connection.signalingState);
		};
		peer.connection.oniceconnectionstatechange = function(evt) {
			console.log("PC ICECONNECTIONSTATECHANGE", peer.connection.iceConnectionState);
			if (peer.connection.iceConnectionState === 'disconnected') {
				delete(self._peers[userId])
				peer.connection.close();
				self._onDisconnect(userId);
			}
		};
		
		peer.dataChannel = peer.connection.createDataChannel('RTCDataChannel', {
			reliable: true
		});
		peer.dataChannel.onmessage = function (evt) {
			console.log("DC MESSAGE:", evt.data);
			var msg = JSON.parse(evt.data);
			switch (msg.type) {
			case "MESSAGE":
				self._onMessage(userId, msg.data);
				break;
			}
    };
    peer.dataChannel.onopen = function () {
			console.log("DC OPEN");
    };
    peer.dataChannel.onclose = function (e) {
        console.log("DC CLOSE");
    };
    peer.dataChannel.onerror = function (e) {
        console.log("DC ERROR");
    };
	},
	_send: function(msg) {
		if (msg.topic) {
			this._webSocket.send(JSON.stringify(msg));
		} else {
			for (var i=0; i<this._topics.length; i++) {
				msg.topic = this._topics[i];
				this._webSocket.send(JSON.stringify(msg));
			}
		}
	},
	_trace: function(msg) {
	},

	subscribe: function(topic) {
		this._send({
			topic: topic,
			type: "SUBSCRIBE"
		});
		this._topics.push(topic);
	},

	sendMessage: function(message) {
		var self = this;

		for (var to in this._peers) {
			var dc = this._peers[to].dataChannel;

			dc.send(JSON.stringify(message));
		}
	},

};