var Chatter = function(attrs) {
	attrs = attrs || {};
	
	this._topics = [];
	this._peers = {};
	
	this.ws = null;
	this.pc = null;
	this.dc = null;
	this.from = null;
	this.to = null;
	this.candidates = [];
	
	this._onOpen = attrs.onOpen || function() {};
	this._onConnect = attrs.onConnect || function() {};
	this._onDisconnect = attrs.onDisconnect || function() {};
	this._onMessage = attrs.onMessage || function() {};
	/*
	this._onConnect = attrs.onConnect || function(id) {};
	this._onOffer = attrs.onOffer || function() {};
	this._onAnswer = attrs.onAnswer || function() {};*/
};
Chatter.prototype = {
	 addCandidates: function(/* 0 or more candidates */) {
	  this.candidates.push.apply(this.candidates, arguments);
	 
	  // only actually add the candidates if the remote description has been set
	  if (this.pc.remoteDescription) {
	    for (var i=0; i<this.candidates.length; i++) {
	      this.pc.addIceCandidate(new RTCIceCandidate(this.candidates[i]));
	    }
	    this.candidates = [];
	  }
	},
	sendAnswer: function() {
		var self = this;
	  self.pc.createAnswer(function(description) {
	    self.pc.setLocalDescription(description);
	    self.ws.send(JSON.stringify({
	      topic: self.topic,
	      type: "ANSWER",
	      to: self.to,
	      data: description
	    }));
	  });
	},
	sendOffer: function() {
		var self = this;
	  self.pc.createOffer(function(description) {
	    self.pc.setLocalDescription(description);
	    self.ws.send(JSON.stringify({
	      topic: self.topic,
	      type: "OFFER",
	      to: self.to,
	      data: description
	    }));
	  }, null, {
	    optional: [],
	    mandatory: {
	      OfferToReceiveAudio: false,
	      OfferToReceiveVideo: false
	    }
	  });
	},
	setRemoteDescription: function(description) {
	  this.pc.setRemoteDescription(new RTCSessionDescription(description));
	  this.addCandidates();
	},
	startWebSocket: function() {
		var self = this;
		self.ws = new WebSocket("ws://prod-do.badgerodon.com:9000/channel");
	  self.ws.onopen = function() {
	    trace("     web socket | opened");
	    self.ws.send(JSON.stringify({
	      topic: self.topic,
	      type: "SUBSCRIBE"
	    }));
	  };
	  self.ws.onerror = function() {
	  	trace("web socket | error");
	  };
	  self.ws.onclose = function() {
	    trace("web socket | closed");
	  };
	  self.ws.onmessage = function(evt) {
	    var msg = JSON.parse(evt.data);
	    switch (msg.type) {
	    // (1) the server tells us our id
	    case "ID":
	      trace("     web socket | your id: " + msg.to);
	    	self._onOpen(msg.to);
	      self.from = msg.to;
	      break;
	    // (2a) the first user to show up will be told when the second user shows up
	    case "SUBSCRIBED":
	      trace("     web socket | joined: " + msg.from);
	      self.to = msg.from;
	      // start the connection
	      self.startPeerConnection();
	      // send an offer to the other user
	      self.sendOffer();
	      break;
	    case "UNSUBSCRIBED":
	      trace("     web socket | left: " + msg.from);
	      break;
	    // (2b) the second user receives the first user's offer
	    case "OFFER":
	      trace("     web socket | offer from: " + msg.from + ", " + JSON.stringify(msg.data));
	      self.to = msg.from;
	      // start the connection
	      self.startPeerConnection();
	      // accept the offer
	      self.setRemoteDescription(msg.data);
	      // send an answer to the first user
	      self.sendAnswer();
	      break;
	    // (3a) the first user receives the answer from the second user
			case "ANSWER":
	      trace("     web socket | answer from: " + msg.from + ", " + JSON.stringify(msg.data));
	      self.setRemoteDescription(msg.data);
				break;
	    // (4) both users receive ICE candidates from each other
			case "CANDIDATE":
	      trace("     web socket | candidate from: " + msg.from + ", " + JSON.stringify(msg.data));
	      self.addCandidates(msg.data);
				break;
	    }
	  };
	},
	startPeerConnection: function(userId) {
		var self = this;
	  if (self.dc) {
	    self.dc.close();
	    self.dc = null;
	  }
	  if (self.pc) {
	    self.pc.close();
	    self.pc = null;
	  }
	 
	  self.pc = new RTCPeerConnection({
	    iceServers: [{
	      // stun allows NAT traversal
	      url: "stun:stun.l.google.com:19302"
	    }]
	  }, {
	    // we are going to communicate over a data channel
	    optional: [{
	      RtpDataChannels: true
	    }]
	  });
	  // send all ice candidates to our peer
	  self.pc.onicecandidate = function(evt) {
	    if (evt.candidate) {
	      self.ws.send(JSON.stringify({
	        topic: self.topic,
	        type: "CANDIDATE",
	        to: self.to,
	        data: evt.candidate
	      }));
	    }
	  };
	  self.pc.onclose = function() {
	  	self.pc = null;
	  };
	  // close on disconnect
	  self.pc.oniceconnectionstatechange = function(evt) {
	    trace("peer connection | ice connection state: " + (self.pc && self.pc.iceConnectionState));
	    if (self.pc && self.pc.iceConnectionState === 'disconnected') {
	      self.pc.close();
	    }
	  };
	 
	  // create the data channel, use TCP
	  self.dc = self.pc.createDataChannel("RTCDataChannel", {
	    reliable: true
	  });
	  self.dc.onopen = function(evt) {
	    trace("   data channel | opened");
    	self._onConnect(userId);
	  };
	  self.dc.onclose = function(evt) {
	    trace("   data channel | closed");
    	self._onDisconnect(userId);
    	self.dc = null;
	  };
	  self.dc.onerror = function(evt) {
	    trace("   data channel | error: " + JSON.stringify(evt));
	  }
	  self.dc.onmessage = function(evt) {
	    var msg = JSON.parse(evt.data);
	    switch (msg.type) {
	    case "MESSAGE":
	      trace("   data channel | message from: " + msg.from + ", " + msg.data);
	      self._onMessage(msg.from, msg.data);
	      break;
	    }
	  };
	},
	subscribe: function(topic) {
		this.topic = topic;
		this.startWebSocket();
	},
	sendMessage: function(message) {
		message.from = this.from;
		message.to = this.to;
		this.dc.send(JSON.stringify(message));
	},

};