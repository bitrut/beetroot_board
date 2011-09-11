//TODO: put this in some kind of module -- global object is fine for now

var output;
var clients;

function init() {
    testWebSocket();
}

function testWebSocket() {
	s = new io.Socket('192.168.1.10', {port: 8001, rememberTransport: false});
	s.connect();
	s.addEvent('message', function(data) {
			onMessage(data);
        });
	/*
    websocket.onopen = function(evt) {
        onOpen(evt)
    };

    websocket.onclose = function(evt) {
        onClose(evt)
    };

    websocket.onmessage = function(evt) {
        onMessage(evt)
    };

    websocket.onerror = function(evt) {
        onError(evt)
    };*/
}

function onOpen(evt) {
    writeToScreen("CONNECTED");
    doSend(JSON.stringify({
        "type": "login",
        "ns": "org.jWebSocket.plugins.system",
        "username": "guest1",
        "password": "guest1"
    }));

    doSend(JSON.stringify({
        "type": "getClients",
        "ns": "org.jWebSocket.plugins.system",
        "mode": "0"
    }));
}

function onClose(evt) {
    writeToScreen("DISCONNECTED");
}

function onMessage(data) {
    decodeMessage(data);
}

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function createCoordMessage(x1,y1,x2,y2, strokeStyle){
    doSend(JSON.stringify({
        "type": "broadcast",
        "ns": "org.jWebSocket.plugins.system",
        "data": {
            "x1":x1,
            "y1":y1,
            "x2":x2,
            "y2":y2,
            "strokeStyle":strokeStyle
        }
    }));
}

function doSend(message) {
    s.send(message);
}

function createClearMessage() {
    doSend(JSON.stringify({
        "type": "broadcast",
        "ns": "org.jWebSocket.plugins.system",
        "data": {
            "clear":true
        }
    }));
}

function createPostItMessage() {
    doSend(JSON.stringify({
        "type": "broadcast",
        "ns": "org.jWebSocket.plugins.system",
        "data": {
            "postIt":true
        }
    }));
}

function writeToScreen(message) {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}

function sendMessage() {
    doSend(JSON.stringify({
        "type": "broadcast",
        "ns": "org.jWebSocket.plugins.system",
        "data": "WebSocket are not too bad!",
        "senderIncluded" : "true"
    }));
}

function decodeMessage(message) {
    var a = JSON.parse(message);
    if (a.data !== undefined){
        draw(a.data);
    }    
};

window.addEventListener("load", init, false);
