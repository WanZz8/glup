define(function () {
    var connection;

    /**
     * Creates a new WebSocket 对象
     * 创建一个web socket对象
     * @constructor WebSocket
     * @param {String} serverIp 服务器IP
     */
    var WebSocket = function (serverIp) {
        //回调组
        this._requestCalls = [];

        this._serverIp = serverIp;

        this._events = {};

        connection = new WebSocket('ws://' + serverIp);

        connection.onmessage = this.onmessage.bind(this);
        connection.onerror = this.onerror.bind(this);
    };

    var proto = WebSocket.prototype;

    proto.send = function (param) {
        var call = new $.Deferred();

        param.requestId = this._requestCalls.length; // 添加回调ID

        call.requestParam = param; // 将请求参数加入到Defferred对象中

        this.trigger('begin'); // 触发begin事件

        this._requestCalls.push(call);
        this.checkConnectionStatus(param.requestId);

        return call;
    };

    proto.checkConnectionStatus = function (requestId) {
        if (connection.readyState == 1) { // 连接成功
            this.postData(requestId);
        } else if (connection.readyState == 0) { // 等待连接中
            setTimeout(function (id) {
                this.checkConnectionStatus(id);
            }.bind(this, requestId), 500);
        } else {
            this.onerror(); // 连接出错的情况下重试连接
        }
    };

    proto.postData = function(requestId) {
        var param = this._requestCalls[requestId].requestParam;
        var options = param.options;

        delete param.options;

        connection.send(JSON.stringify(param));
    };

    proto.onerror = function () {
        connection = new WebSocket('ws://' + this._serverIp);
        setTimeout(function(id) {
            this.checkConnectionStatus(id);
        }.bind(this, requestId), 500);
    };

    proto.onmessage = function (result) {
        var result = JSON.parse(result.data);
        var data = result.data;
        var requestId = result.requestId;
        var call = this._requestCalls[requestId];
        var options = call.requestParam.options || {};

        if (data.status == 420) { // 用户未登录
            this.trigger('login'); // 触发login事件
        } else {
            if (data.status != 200 && !options.skipError) {
                call.reject(data.status, data.errorMessage);
            } else if (options.skipError) {
                call.resolve(data);
            } else {
                call.resolve(data.data);
            }
        }

        this.trigger('finish'); // 触发login事件

        delete this._requestCalls[requestId]; // 清除回掉函数
    };

    proto.on = function (event, fn) {
        var eventGroup = this._events[event];

        if (!eventGroup) {
            this._events[event] = [fn];
        } else {
            this._events[event].push(fn);
        }
    };

    proto.trigger = function (event, args) {
        var eventGroup = this._events[event];
        var i = 0, fn;

        if (!eventGroup) return false;

        for (; i < eventGroup.length; i++) {
            fn = eventGroup[i];
            fn.apply(window, args);
        }
    };

    return WebSocket;
});