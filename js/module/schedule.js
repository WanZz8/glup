define(function () {
    /**
     * @constructor schedule
     */
    var schedule = function () {
        /**
         * @desc 监听器存取对象
         * @type {object}
         * @private
         */
        this._listeners = {};

        /**
         * @desc 定时器存取对象
         * @type {object}
         * @private
         */
        this._tickers = {};
    };

    var proto = schedule.prototype;

    /**
     * @method schedule.addTicker
     * @description
     * @param {string} type
     * @param {function} ticker
     * @param {object} target
     * @param {number} interval
     * @param {number} [delay] 延迟N毫秒执行
     */
    proto.addTicker = function (type, ticker, target, interval, delay) {

        if (this._tickers === undefined)
            this._tickers = {};

        var tickers = this._tickers;
        if (tickers[type] === undefined)
            tickers[type] = [];

        if (!this.hasTicker(type, ticker, target)) {
            //激活
            if (delay !== undefined) {
                var tempKey = setTimeout(function () {
                    ticker.call(target);
                    tickers[type].push({callback: ticker, eventTarget: target});
                    var value = tickers[type].length -1;
                    var timer = setInterval(function () {
                        ticker.call(target);
                    }, interval);
                    tickers[type][value]['index'] = timer;
                }, delay);
                tickers[type].push({timeout: tempKey});
            } else {
                tickers[type].push({callback: ticker, eventTarget: target});
                var value = tickers[type].length -1;
                var timer = setInterval(function () {
                    ticker.call(target);
                }, interval);
                tickers[type][value]['index'] = timer;
            }
        }
    };

    /**
     * @method schedule.hasTicker
     * @description
     * @param {string} type
     * @param {function} ticker
     * @param {object} target
     * @returns {boolean} 是否存在该定时器
     */
    proto.hasTicker = function (type, ticker, target) {
        if (this._tickers === undefined)
            return false;

        var tickers = this._tickers;
        if (tickers[type] !== undefined) {
            for (var i = 0, len = tickers[type].length; i < len; i++) {
                var selListener = tickers[type][i];
                if (selListener.callback === ticker && selListener.eventTarget === target) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * @method schedule.clearTicker
     * @description
     * @param {string} type
     */
    proto.clearTicker = function (type) {
        if (this._tickers === undefined)
            return;

        var tickers = this._tickers;
        if (tickers[type] !== undefined) {
            for (var i = 0, lens = tickers[type].length; i < lens; i++) {
                var selTicker = tickers[type][i];
                if (selTicker['timeout'])
                    clearTimeout(selTicker['timeout']);
                if (selTicker['index'])
                    clearInterval(selTicker['index']);
            }
            tickers[type] = undefined;
        }
    };

    /**
     * @method schedule.addEventListener
     * @description
     * @param {string} type
     * @param {function} listener
     * @param {object} target
     */
    proto.addEventListener = function (type, listener, target) {

        if (this._listeners === undefined)
            this._listeners = {};

        var listeners = this._listeners;
        if (listeners[type] === undefined)
            listeners[type] = [];

        if (!this.hasEventListener(type, listener, target))
            listeners[type].push({callback: listener, eventTarget: target});
    };

    /**
     * @method schedule.hasEventListener
     * @description
     * @param {string} type
     * @param {function} listener
     * @param {object} target
     * @returns {boolean}
     */
    proto.hasEventListener = function (type, listener, target) {
        if (this._listeners === undefined)
            return false;

        var listeners = this._listeners;
        if (listeners[type] !== undefined) {
            for (var i = 0, len = listeners[type].length; i < len; i++) {
                var selListener = listeners[type][i];
                if (selListener.callback === listener && selListener.eventTarget === target)
                    return true;
            }
        }
        return false;
    };

    /**
     * @method schedule.removeEventListeners
     * @description
     * @param {object} target
     */
    proto.removeEventListeners = function (target) {
        if (this._listeners === undefined)
            return;

        var listeners = this._listeners;
        for (var key in listeners) {
            var listenerArray = listeners[key];

            if (listenerArray !== undefined) {
                for (var i = 0; i < listenerArray.length;) {
                    var selListener = listenerArray[i];
                    if (selListener.eventTarget === target)
                        listenerArray.splice(i, 1);
                    else
                        i++
                }
            }
        }
    };

    /**
     * @method schedule.removeEventListener
     * @description
     * @param type
     * @param target
     */
    proto.removeEventListener = function (type, target) {
        if (this._listeners === undefined)
            return;

        var listeners = this._listeners;
        var listenerArray = listeners[type];

        if (listenerArray !== undefined) {
            for (var i = 0; i < listenerArray.length;) {
                var selListener = listenerArray[i];
                if (selListener.eventTarget === target)
                    listenerArray.splice(i, 1);
                else
                    i++
            }
        }
    };

    /**
     * @method schedule.clearEventListeners
     * @description
     */
    proto.clearEventListeners = function () {
        if (this._listeners)
            this._listeners = {};
    };

    /**
     * @method schedule.dispatchEvent
     * @description
     * @param event
     * @param clearAfterDispatch
     * @param eventData
     */
    proto.dispatchEvent = function (event, clearAfterDispatch, eventData) {
        if (this._listeners === undefined)
            return;

        if (clearAfterDispatch == null)
            clearAfterDispatch = true;
        var listeners = this._listeners;
        var listenerArray = listeners[event];

        if (listenerArray !== undefined) {
            var array = [];
            var length = listenerArray.length;

            for (var i = 0; i < length; i++) {
                array[i] = listenerArray[i];
            }

            for (i = 0; i < length; i++) {
                array[i].callback.call(array[i].eventTarget, this, eventData);
            }

            if (clearAfterDispatch)
                listenerArray.length = 0;
        }
    };

    return schedule;
});