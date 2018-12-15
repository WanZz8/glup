define([], function () {

    function Ajax(target) {
        this._queue = [];
        this._target = target;
    }

    var proto = Ajax.prototype;

    proto.send = function (buffer, silence, call) {
        call = call || $.Deferred();
        if (this.inQueue(buffer))
            return;

        var self = this;

        if (buffer) {
            $.ajax({
                url: buffer['url'],
                timeout: buffer['timeout'] || 0,
                type: buffer['type'] || 'POST',
                data: buffer['data'],
                beforeSend: function () {
                    self.loadQueue(buffer);
                    if (!silence)
                        self._target.load.openAnimation();
                },
                success: function (data) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                    }

                    var code = data.code || data.errorCode || data.resultCode || null;
                    code = Number(code);
                    var msg = data.resultMsg || data.errorMsg;
                    if (code === undefined)
                        code = null;
                    if (msg === undefined)
                        msg = '未知错误';

                    if (code !== 200 && code !== 0 && !buffer['skipError']) {
                        var error = mcm.cache.error(code);
                        if (error) {
                            call.reject(code, msg || data);
                            if (self._target.communicationError && !silence)
                                self._target.communicationError(msg || null);
                        }
                    } else if (buffer['skipError']) {
                        call.resolve(data)
                    } else {
                        call.resolve(data && data.content || data)
                    }
                },
                complete: function () {
                    if (!silence && self._target.load)
                        self._target.load.closeAnimation();
                    self._queue.remove(buffer);
                },
                error: function (e) {
                    if (buffer['jsonp'] && e.responseText !== undefined && e.responseText !== '') {
                        var text = e.responseText.match(/data:'([\s\S]+)'/);
                        var quote = null;
                        if (text !== null && text.length > 0) {
                            quote = text[1];
                        }
                        call.resolve(quote);
                    } else {
                        if (buffer['retry']) {
                            setTimeout(function () {
                                self._queue.remove(buffer);
                                self.send(buffer, silence, call);
                            }, buffer['delay'] || 5000);
                        } else if (e.statusText === 'timeout') {
                            if (!silence)
                                mcm.cache.error()
                        } else {
                            call.reject(e);
                        }
                    }
                }
            });

            return call;
        }
    };

    proto.load = function (buffer, silence) {
        if (this.inQueue(buffer))
            return;

        var self = this;

        if (buffer) {
            $.ajax({
                url: buffer['url'],
                type: 'POST',
                data: buffer['data'],
                beforeSend: function () {
                    self.loadQueue(buffer);
                    if (!silence && self._target.load)
                        self._target.load.openAnimation();
                },
                success: function (data) {
                    self._target.schedule.dispatchEvent(buffer['response'], false, data);
                },
                complete: function () {
                    if (!silence && self._target.load)
                        self._target.load.closeAnimation();
                    self._queue.remove(buffer);
                },
                error: function () {
                    if (buffer['retry'])
                        setTimeout(function () {
                            self._queue.remove(buffer);
                            self.load(buffer, silence);
                        }, buffer['delay'] || 5000);
                    else
                        self._target.schedule.dispatchEvent(buffer['response'], false, null);
                }
            });
        }
    };

    proto.inQueue = function (buffer) {
        return this._queue.includes(buffer);
    };

    proto.loadQueue = function (buffer) {
        if (!this.inQueue(buffer))
            this._queue.push(buffer);
    };

    return Ajax;
});