function onClickConnect() {
	chatter.connectTo(id);
}
function onClickSend() {
	var el = document.getElementById("input-message");
	var message = el.value;
	el.value = "";

	chatter.sendMessage(message);
}
function trace(msg) {
	console.log(msg);
}

window.chatter = new Chatter({
	onOpen: Events.onOpen,
	onOffer: Events.onOffer,
	onAnswer: Events.onAnswer,
	onMessage: Events.onMessage,
	onConnect: Events.onConnect,
	onDisconnect: Events.onDisconnect
});

(function() {
	CanvasUI.init();
})();
