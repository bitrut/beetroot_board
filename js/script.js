function init() {
    s = new io.Socket('piotrkowalski.info', {
        port: 8001,
        rememberTransport: false
    });
    s.connect();
    s.addEvent('message', function(data) {
        decodeMessage(data);
    });
}

function createCoordMessage(x1,y1,x2,y2, strokeStyle){
    doSend(JSON.stringify({
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
        "data": {
            "clear":true
        }
    }));
}

function decodeMessage(message) {
    var a = JSON.parse(message);
    if (a.data !== undefined){
        draw(a.data);
    }    
};

window.addEventListener("load", init, false);
