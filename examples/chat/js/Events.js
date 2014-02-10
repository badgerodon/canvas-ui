Events = {};

(function() {
	var lastFrom, lastDescription;
	
	Events.onClickConnect = function() {
		var topic = UI.connectId.value();
		if (!topic) {
			alert("Please enter a topic");
			return;
		}
		UI.middleSection.children()[0].replaceWith(UI.loadingFrame);
		chatter.subscribe(topic);
	};
	Events.onClickAcceptIncoming = function() {
		chatter.acceptOffer(lastFrom, lastDescription);
		UI.middleSection.children()[0].replaceWith(UI.chatFrame);
	};
	Events.onClickRejectIncoming = function() {
		alert("Not Implemented");
	};
	Events.onClickChatSend = function() {
		var text = UI.chatEntry.value();
		UI.chatEntry.value("");
		chatter.sendMessage({
			type: "MESSAGE",
			data: text
		});
		Events.onMessage(chatter.from, text);
	};
	
	Events.onOpen = function(id) {
		UI.title.text("Welcome " + id + "!");
	};
	Events.onMessage = function(from, message) {
		UI.chatHistory.text(UI.chatHistory.text() + from + ": " + message + "\n");
	};
	Events.onConnect = function(to) {
		UI.middleSection.children()[0].replaceWith(UI.chatFrame);
	};
	Events.onDisconnect = function(to) {
		UI.middleSection.children()[0].replaceWith(UI.connectFrame);
	};
	
	UI.connectButton.bind("click", Events.onClickConnect);
	UI.incomingAcceptButton.bind("click", Events.onClickAcceptIncoming);
	UI.incomingRejectButton.bind("click", Events.onClickRejectIncoming);
	UI.chatSendButton.bind("click", Events.onClickChatSend);
})();