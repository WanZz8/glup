//模块名
define(function () {
    function Ws(url, trigger) {
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
                this.load(buffer[0], buffer[1], buffer[2]);
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
            //断线重连
            // this.trigger.ram.getLogin();
        }, self._tryInterval * 1000); //wait n second to retry.
    };

    proto.onMessageCallback = function (msg) {
        var data = JSON.parse(msg.data);
        if (!data || data.length === 0)
            return;
        this.messageResponse(data);

        //通信中的登录验证,单独过滤
        if (data['data']['status'] == 420) {
            this.trigger.cache.setLogout();
        }
    };

    proto.messageResponse = function (respData) {
        if (!respData)
            return;

        var name = respData['requestId'];
        if (!this.hasCallbackByName(name))
            return;
        if (!this.queryAnimation(name) && this.trigger.load)
            this.trigger.load.closeAnimation();
        var request = this.queryData(name);
        if (!request)
            return;
        var callback = this.queryCallback(name);
        if (!callback)
            return;
        this.removeQueue(request);
        if (typeof callback == 'string') {
            this.trigger.schedule.dispatchEvent(callback, false, respData['data']);
        } else {
            if (respData['data']['status'] == 200) {
                callback.resolve(respData['data']['data'])
            } else {
                callback.reject(respData['data'])
            }
        }
        this.deleteCallback(name);
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

    proto.load = function (buffer, tag, silence) {
        if (this.inQueue(buffer))
            return;

        if (this._client.readyState === WebSocket.CLOSED || this._client.readyState === WebSocket.CLOSING) {
            this.delayQueue(buffer, tag, silence);
            console.log('The server is closed...\nmessage will be send,when the server is reconnect.');
            console.log('webSocket已经关闭...\n消息将会再重连后发送');
            return;
        }
        if (this._client.readyState === WebSocket.CONNECTING) {
            this.delayQueue(buffer, tag, silence);
            console.log('The server is connecting...\nmessage will be send delay');
            console.log('webSocket正在连接中...\n消息将会延迟发送');
            return;
        }
        if (this._client.readyState === WebSocket.OPEN) {
            if (buffer) {
                this._count++;
                this.loadQueue(buffer, tag, silence);
                var sender = $.extend(buffer, {});
                if (!sender['data'])
                    sender['data'] = {};
                sender['data']['platformId'] = this.trigger.platformId;
                sender['data']['requestId'] = 'RQ' + this._count;
                console.log('发送消息', sender);
                if (!silence && this.trigger.load)
                    this.trigger.load.openAnimation();
                this._client.send(JSON.stringify(sender));
            }
        }
    };

    proto.send = function (buffer, silence, tag) {
        if (this.inQueue(buffer))
            return;

        tag = tag || $.Deferred();

        if (this._client.readyState === WebSocket.CLOSED || this._client.readyState === WebSocket.CLOSING) {
            this.delayQueue(buffer, tag, silence);
            console.log('The server is closed...\nmessage will be send,when the server is reconnect.');
            console.log('webSocket已经关闭...\n消息将会再重连后发送');
            return tag;
        }
        if (this._client.readyState === WebSocket.CONNECTING) {
            this.delayQueue(buffer, tag, silence);
            console.log('The server is connecting...\nmessage will be send delay');
            console.log('webSocket正在连接中...\n消息将会延迟发送');
            return tag;
        }
        if (this._client.readyState === WebSocket.OPEN) {
            if (buffer) {
                this._count++;
                this.loadQueue(buffer, tag, silence);
                var sender = $.extend(buffer, {});
                if (!sender['data'])
                    sender['data'] = {};
                sender['data']['platformId'] = this.trigger.platformId;
                sender['data']['requestId'] = 'RQ' + this._count;
                console.log('发送消息', sender);
                if (!silence && this.trigger.load)
                    this.trigger.load.openAnimation();
                this._client.send(JSON.stringify(sender));

                return tag;
            }
        }
    };

    proto.inQueue = function (buffer) {
        return this._queue.contains(buffer);
    };

    proto.removeQueue = function (buffer) {
        this._queue.remove(buffer);
    };

    proto.loadQueue = function (buffer, tag, silence) {
        this._queue.push(buffer);
        var index = 'RQ' + this._count;
        this._callback[index] = {};
        this._callback[index]['cb'] = tag;
        this._callback[index]['data'] = buffer;
        this._callback[index]['silence'] = silence;
    };

    proto.delayQueue = function (buffer, tag, silence) {
        if (!this._delayQueue.contains([buffer, tag, silence]))
            this._delayQueue.push([buffer, tag, silence]);
    };

    proto.queryAnimation = function (name) {
        return this._callback[name]['silence'];
    };

    proto.queryData = function (name) {
        return this._callback[name]['data'];
    };

    proto.hasCallbackByName = function (name) {
        return this._callback[name] ? true : false;
    };

    proto.queryCallback = function (name) {
        return this._callback[name]['cb'];
    };

    proto.deleteCallback = function (name) {
        delete this._callback[name];
    };


    return Ws;
});