var PlayerControl = function (a) {
    this.wsURL = a.wsURL, this.rtspURL = a.rtspURL, this.ws = null, this.decodeMode = a.decodeMode, this.events = {
        ResolutionChanged: function () {
        }, PlayStart: function () {
        }, DecodeStart: function () {
        }, UpdateCanvas: function () {
        }, GetFrameRate: function () {
        }, FrameTypeChange: function () {
        }, Error: function () {
        }, MSEResolutionChanged: function () {
        }, audioChange: function () {
        }, WorkerReady: function () {
        }, IvsDraw: function () {
        }, FileOver: function () {
        }
    }, this.username = a.username, this.password = a.password
};
PlayerControl.prototype = {
    init: function (a, b) {
        this.ws = new WebsocketServer(this.wsURL, this.rtspURL), this.ws.init(a, b), this.ws.setLiveMode(this.decodeMode), this.ws.setUserInfo(this.username, this.password);
        for (var c in this.events) this.ws.setCallback(c, this.events[c]);
        this.events = null
    }, connect: function () {
        this.ws.connect()
    }, play: function () {
        this.controlPlayer("PLAY")
    }, pause: function () {
        this.controlPlayer("PAUSE")
    }, stop: function () {
        this.controlPlayer("TEARDOWN")
    }, close: function () {
        this.ws.disconnect()
    }, playByTime: function (a) {
        this.controlPlayer("PLAY", "video", a)
    }, playFF: function (a) {
        this.controlPlayer("PAUSE"), this.controlPlayer("SCALE", a)
    }, playRewind: function () {
    }, audioPlay: function () {
        this.controlPlayer("audioPlay", "start")
    }, audioStop: function () {
        this.controlPlayer("audioPlay", "stop")
    }, setAudioSamplingRate: function (a) {
        this.controlPlayer("audioSamplingRate", a)
    }, setAudioVolume: function (a) {
        this.controlPlayer("volumn", a)
    }, controlPlayer: function (a, b, c) {
        var d;
        d = "video" === b ? {command: a, range: c ? c : 0} : {command: a, data: b}, this.ws.controlPlayer(d)
    }, setPlayMode: function (a) {
        this.ws.setLiveMode(a)
    }, setPlayPath: function (a) {
        this.ws.setRTSPURL(a)
    }, capture: function (a) {
        this.ws.capture(a)
    }, on: function (a, b) {
        this.events[a] = b
    }
};