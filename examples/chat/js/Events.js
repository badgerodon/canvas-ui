Events = {};

(function() {
	var lastFrom, lastDescription;
	
	Events.onClickConnect = function() {
		var id = UI.connectId.value();
		if (!id) {
			alert("Please enter an ID");
			return;
		}
		UI.middleSection.children()[0].replaceWith(UI.loadingFrame);
		chatter.subscribe(id);
	};
	Events.onClickAcceptIncoming = function() {
		chatter.acceptOffer(lastFrom, lastDescription);
		UI.middleSection.children()[0].replaceWith(UI.chatFrame);
	};
	Events.onClickRejectIncoming = function() {
		alert("Not Implemented");
	};
	Events.onClickChatSend = function() {
		chatter.sendMessage({
			type: "MESSAGE",
			data: UI.chatEntry.value()
		});
		UI.chatEntry.value("");
	};
	
	Events.onOpen = function(id) {
		UI.title.text("Welcome " + id + "!");
	};
	Events.onOffer = function(from, description) {
		lastFrom = from;
		lastDescription = description;
		UI.middleSection.children()[0].replaceWith(UI.incomingFrame);
	};
	Events.onAnswer = function(from, description) {
		chatter.acceptAnswer(from, description);
		UI.middleSection.children()[0].replaceWith(UI.chatFrame);
	};
	Events.onMessage = function(from, message) {
		UI.chatHistory.text(UI.chatHistory.text() + "\n" + message);
	};
	Events.onConnect = function(to) {
		UI.middleSection.children()[0].replaceWith(UI.chatFrame);
	};
	Events.onDisconnect = function(to) {
		alert("Disconnected");
		UI.middleSection.children()[0].replaceWith(UI.connectFrame);
	};
	
	UI.connectButton.bind("click", Events.onClickConnect);
	UI.incomingAcceptButton.bind("click", Events.onClickAcceptIncoming);
	UI.incomingRejectButton.bind("click", Events.onClickRejectIncoming);
	UI.chatSendButton.bind("click", Events.onClickChatSend);
})();