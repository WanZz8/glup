//模块名
define(function () {
    function Ws(url,trigger) {
        this._client = new WebSocket(url);
        this._queue = [];
        this._callback = {};
        this._delayQueue = [];
        this._currentURL = url;
        this._client.onopen = this.onOpenCallback.bind(this);
        this._client.onerror = this.onErrorCallback.bind(this);
        this._client.onclose = this.onCloseCallback.bind(this);
        this._client.onmessage = this.onMessageCallback.bind(this);
        this._count = 0;
        this._tryCount = 0;
        this._maxTryCount = 10;
        this._tryInterval = 5;
        this._trying = false;

        this.trigger = trigger;
    }

    var proto = Ws.prototype;

    proto.onOpenCallback = function () {
        console.log('The server connect success');
        console.log('服务器连接成功...');
        this._trying = false;
        this._tryCount = 0;
        var len = this._delayQueue.length;
        //发送延迟的请求
        if (len > 0) {
            while (len > 0) {
                var buffer = this._delayQueue.shift();
                this.load(buffer);
                len = this._delayQueue.length;
            }
        }
    };

    proto.onErrorCallback = function (event) {
        console.log("The server connection has an error: ", event);
        console.log('服务器连接发生错误', event);

    };

    proto.onCloseCallback = function () {

        var self = this;
        this._trying = false;
        console.log("The server connection has been closed.");
        console.log("服务器连接已关闭");

        if (this._tryCount > this._maxTryCount)
            return;
        setTimeout(function () {
            self.reOpen();
        }, self._tryInterval * 1000); //wait n second to retry.
    };

    proto.onMessageCallback = function (msg) {
        var data = JSON.parse(msg.data);
        if (!data || data.length === 0)
            return;
        this.messageResponse(data);
    };

    proto.messageResponse = function (respData) {
        if (!respData)
            return;

        if(!respData['cmd'])
            return;
        this.trigger.schedule.dispatchEvent(respData['cmd'], false, respData);
    };

    /**
     * 重连webSocket端口
     * reopen the webSocket connect
     * @method reOpen
     * @author 2016/9/23 by Wilde.Chen
     */
    proto.reOpen = function () {
        if (this._trying)
            return;

        if (this._client && this._client.readyState === WebSocket.OPEN)
            return;

        try {
            this._trying = true;
            this._tryCount++;
            this._client = new WebSocket(this._currentURL);
            this._client.onopen = this.onOpenCallback.bind(this);
            this._client.onerror = this.onErrorCallback.bind(this);
            this._client.onclose = this.onCloseCallback.bind(this);
            this._client.onmessage = this.onMessageCallback.bind(this);
        } catch (e) {
            console.log('The server is down for maintenance,please try again later');
            console.log('服务器正在维护,请稍后重试');
        }
    };

    proto.load = function (buffer) {
        if (this._client.readyState === WebSocket.CLOSED || this._client.readyState === WebSocket.CLOSING) {
            this.delayQueue(buffer);
            console.log('The server is closed...\nmessage will be send,when the server is reconnect.');
            console.log('webSocket已经关闭...\n消息将会再重连后发送');
            return;
        }
        if (this._client.readyState === WebSocket.CONNECTING) {
            this.delayQueue(buffer);
            console.log('The server is connecting...\nmessage will be send delay');
            console.log('webSocket正在连接中...\n消息将会延迟发送');
            return;
        }
        if (this._client.readyState === WebSocket.OPEN) {
            if (buffer) {
                this._count++;
                console.log('发送消息', buffer);
                this._client.send(JSON.stringify(buffer));
            }
        }
    };

    proto.delayQueue = function (buffer) {
        if (!this._delayQueue.contains(buffer))
            this._delayQueue.push(buffer);
    };

    return Ws;
});