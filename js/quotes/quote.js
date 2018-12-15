define(['deploy'], function (config) {
    function Contracts() {
        this.status = false;
        this.rule = false;

        this.quoteList = [];
        this.foreign = null;
        this.domestic = null;
        this.stock = null;
        this.digital = null;
        this.total = {};
        this.set = {};
        this.map = {};
        this.brief = {};

        this.updateStore = null;
        this.updateStoreSwitch = false;

        /**
         * 单体查询的合约号
         * @type {null}
         */
        this.singleCode = null;
        this.singlePlan = null;
        this.singleCallback = null;
        this.multipleCode = null;
        this.multiplePlan = null;
        this.multipleCallback = [];


        this.hot = ['CL', 'GC', 'IF', 'IH', 'IC', 'HSI', 'MHI'];
        // this.hot = ['CL', 'GC', 'HSI', 'MHI']
    }

    let proto = Contracts.prototype;

    /**
     * 通过合约列表进行初始化
     * @param data
     */
    proto.init = function (data) {
        if (!data)
            return console.error('合约初始化失败');

        if (!!data.foreign) {
            this.foreign = {};
            data.foreign.forEach(function (e) {
                this.foreign[e.code] = e;
                this.total[e.code] = e;
                this.set[e.code] = null;
                this.brief[e.code] = null;
            }.bind(this));
        } else {
            return console.error('缺少外盘数据参数,%s,foreign', data);
        }

        if (!!data.domestic) {
            this.domestic = {};
            data.domestic.forEach(function (e) {
                this.domestic[e.code] = e;
                this.total[e.code] = e;
                this.set[e.code] = null;
                this.brief[e.code] = null;
            }.bind(this));
        }

        if (!!data.stock) {
            this.stock = {};
            data.stock.forEach(function (e) {
                this.stock[e.code] = e;
                this.total[e.code] = e;
                this.set[e.code] = null;
                this.brief[e.code] = null;
            }.bind(this));
        }

        if (!!data.digital) {
            this.digital = {};
            data.digital.forEach(function (e) {
                this.digital[e.code] = e;
                this.total[e.code] = e;
                this.set[e.code] = null;
                this.brief[e.code] = null;
            }.bind(this));
        }

        if (data.contracts !== undefined) {
            this.quoteList = data.contracts;

            let contract;
            if (this.foreign !== null) {
                for (let f of Object.keys(this.foreign)) {
                    contract = null;
                    contract = this.quoteList.find(function (c) {
                        return c.startsWith(f);
                    }.bind(this));
                    if (contract !== null && contract !== false && contract !== undefined) {
                        this.foreign[f].contract = contract;
                        this.total[f].contract = contract;
                        this.map[contract] = f;
                    }
                }
            }

            if (this.domestic !== null) {
                for (let d in this.domestic) {
                    contract = null;
                    contract = this.quoteList.find(function (c) {
                        return c.startsWith(d);
                    }.bind(this));
                    if (contract !== null && contract !== false && contract !== undefined) {
                        this.domestic[d].contract = contract;
                        this.total[d].contract = contract;
                        this.map[contract] = d;
                    }
                }
            }

            if (this.stock !== null) {
                for (let s in this.stock) {
                    contract = null;
                    contract = this.quoteList.find(function (c) {
                        return c.startsWith(s);
                    }.bind(this));
                    if (contract !== null && contract !== false && contract !== undefined) {
                        this.stock[s].contract = contract;
                        this.total[s].contract = contract;
                        this.map[contract] = s;
                    }
                }
            }

            if (this.digital !== null) {
                for (let t in this.digital) {
                    contract = null;
                    contract = this.quoteList.find(function (c) {
                        return c.startsWith(t);
                    }.bind(this));
                    if (contract !== null && contract !== false && contract !== undefined) {
                        this.digital[t].contract = contract;
                        this.total[t].contract = contract;
                        this.map[contract] = t;
                    }
                }
            }

        } else {
            return console.error('缺少合约数据参数,%s,contracts', data);
        }

        this.getRule();

        this.status = true;
        /**
         * 通知页面初始化完成
         */
        mcm.schedule.dispatchEvent('quotesInitial', true, true);
    };

    /**
     * 判断是否初始化完成
     * @returns {boolean}
     */
    proto.isInitialized = function () {
        return this.status;
    };

    proto.isRule = function () {
        return this.rule;
    };

    /**
     * 获取交易规则
     */
    proto.getRule = function () {
        if (mcm.cache.isLogin() && !this.rule)
            mcm.net.send({
                url: '/api/trade/scheme.htm',
                type: 'GET',
                retry: true,
                timeout: 3000,
                delay: 500,
                data: {
                    schemeSort: 0, // 1 holding, 2 history, 3 failure
                    tradeType: 1, // 1 standard, 2 simulation
                    beginTime: '',
                    _: new Date().getTime()
                }
            }, true).then(function (result) {
                let tradeList = result['tradeList'];
                if (tradeList !== undefined) {
                    tradeList.forEach(function (e) {
                        let code = e['commCode'];
                        if (!!this.total[code]) {
                            $.extend(this.total[code], e)
                        }
                        if (!!this.domestic[code]) {
                            $.extend(this.domestic[code], e)
                        }
                        if (!!this.foreign[code]) {
                            $.extend(this.foreign[code], e)
                        }
                    }.bind(this));
                    this.rule = true;
                    mcm.schedule.dispatchEvent('ruleInitial', true, null);
                }
            }.bind(this));
    };

    /**
     * 获取用户订单
     * @param sort
     * @param tradeType
     * @param [count]
     * @return {*}
     */
    proto.getStore = function (sort, tradeType, count) {
        var call = $.Deferred();
        if (mcm.cache.isLogin()) {
            var data = {
                schemeSort: sort, // 1 holding, 2 history, 3 failure
                tradeType: tradeType, // 1 standard, 2 simulation
                beginTime: '',
                _: new Date().getTime()
            };
            if (sort !== 1) {
                data.client = 1;
                data.pageCount = count || 1;
                data.pageSize = 10;
            }
            mcm.net.send({
                url: '/api/trade/scheme.htm',
                type: 'GET',
                retry: true,
                timeout: 3000,
                delay: 500,
                data: data
            }, true).then(function (result) {
                if (result && result.data) {
                    call.resolve(result.data, tradeType, count || 1, result.total || result.data.length)
                } else {
                    call.reject()
                }
            })
        } else {
            call.reject()
        }
        return call;
    };

    /**
     * 持续获取用户订单更新
     * @param sort
     * @param tradeType
     */
    proto.getStoreUpdate = function (sort, tradeType) {
        if (this.updateStoreSwitch === true)
            if (mcm.cache.isLogin()) {
                mcm.net.send({
                    url: '/api/trade/scheme.htm',
                    type: 'GET',
                    retry: true,
                    timeout: 3000,
                    delay: 500,
                    data: {
                        schemeSort: sort, // 1 holding, 2 history, 3 failure
                        tradeType: tradeType, // 1 standard, 2 simulation
                        beginTime: '',
                        _: new Date().getTime()
                    }
                }, true).then(function (result) {
                    if (result && result.data && this.updateStoreSwitch === true) {
                        var asset = result.asset;
                        mcm.cache.setOverage(asset.money || 0);
                        mcm.cache.setSimBalance(asset.game || 0);
                        mcm.schedule.dispatchEvent('storeUpdate', false, {
                            sort: sort,
                            tradeType: tradeType,
                            list: result.data
                        });
                    }
                    this.updateStore = setTimeout(function () {
                        this.getStoreUpdate(sort, tradeType)
                    }.bind(this), 1000)
                }.bind(this))
            }
    };

    /**
     * 开启用户订单更新广播
     * @param sort
     * @param tradeType
     */
    proto.startStoreUpdate = function (sort, tradeType) {
        this.updateStoreSwitch = true;
        this.getStoreUpdate(sort, tradeType);
    };

    /**
     * 修正用户订单更新广播类型
     * @param sort
     * @param tradeType
     */
    proto.fixedStoreUpdate = function (sort, tradeType) {
        if (!this.updateStoreSwitch)
            this.updateStoreSwitch = !this.updateStoreSwitch;
        clearTimeout(this.updateStore);
        this.getStoreUpdate(sort, tradeType);
    };

    /**
     * 关闭用户订单更新广播
     */
    proto.stopStoreUpdate = function () {
        this.updateStoreSwitch = false;
        clearTimeout(this.updateStore);
    };

    /**
     * 获取所有合约用于请求
     * @return {string}
     */
    proto.getList = function () {
        return this.quoteList.join(',')
    };

    /**
     * 获取合约
     * @param code
     * @return {*}
     */
    proto.getContract = function (code) {
        const map = this.map[code];
        if (map !== undefined)
            return this.total[map] || null;
        return null
    };

    /**
     * 获取瞬时行情
     * @param code
     * @return {*}
     */
    proto.getQuote = function (code) {
        const map = this.map[code];
        if (map !== undefined)
            return this.set[map] || null;
        return null;
    };

    /**
     * 获取简报
     * @param code
     * @return {*|null}
     */
    proto.getBrief = function (code) {
        const map = this.map[code];
        if (map !== undefined)
            return this.brief[map] || null;
    };

    proto.getDefault = function () {
        if (this.foreign === null)
            return false;
        const [l] = Object.keys(this.foreign);
        return l;
    };

    proto.getContracts = function () {
        return Object.entries(this.total);
    };

    proto.getForeign = function () {
        return !!this.foreign ? Object.entries(this.foreign) : null;
    };

    proto.getDomestic = function () {
        return !!this.domestic ? Object.entries(this.domestic) : null;
    };

    proto.getStock = function () {
        return !!this.stock ? Object.entries(this.stock) : null;
    };

    proto.getDigital = function () {
        return !!this.digital ? Object.entries(this.digital) : null;
    };

    proto.isHot = function (code) {
        return this.hot.contains(code);
    };

    proto.getHot = function () {
        let c = [];
        this.hot.forEach(function (t) {
            c.push(this.total[t]);
        }.bind(this));
        return c;
    };

    proto.getHotString = function () {
        let c = [];
        this.hot.forEach(function (t) {
            c.push(this.total[t].contract);
        }.bind(this));
        return c.join(',');
    };

    proto.startSingleInquiry = function (code, callback) {
        if (!code)
            return console.error('缺少商品合约号');

        if (!callback)
            return console.error('缺少回调字符串');

        this.singleCode = code;
        this.singleCallback = callback;
        this.updateQuote(this.singleCode, this.singleCallback);
    };

    proto.endSingleInquiry = function () {
        this.singleCode = null;
        this.singCallback = null;
        clearTimeout(this.singlePlan);
        this.singlePlan = null;
    };

    proto.switchSingleInquiry = function (code) {
        this.singleCode = code;
    };

    proto._singleInquiryCallback = function (code, callback) {
        if (this.singleCallback === callback) {
            let distance = 1000;
            if (this.singleCode === code) {
                mcm.schedule.dispatchEvent(this.singleCallback, false, this.singleCode);
            }else{
                distance = 0;
            }
            this.singlePlan = setTimeout(this.updateQuote.bind(this, this.singleCode, this.singleCallback), distance);

        }
    };

    proto.startMultipleInquiry = function (callback) {
        if (!callback)
            return console.error('缺少回调字符串');

        if (this.multipleCallback.length > 0) {
            if (this.multipleCallback.includes(callback))
                return;
            this.multipleCallback.push(callback);
        } else {
            this.multipleCallback.push(callback);
            this.updateAll();
        }
    };

    proto.endMultipleInquiry = function (callback) {
        if (!callback)
            return;

        this.multipleCallback.remove(callback);
        if (this.multipleCallback.length === 0) {
            clearTimeout(this.multiplePlan);
            this.multiplePlan = null;
        }
    };

    proto._multipleInquiryCallback = function () {
        if (this.multipleCallback.length > 0) {
            for (let v of this.multipleCallback) {
                mcm.schedule.dispatchEvent(v, false, null);
            }
            this.multiplePlan = setTimeout(this.updateAll.bind(this), 2000);
        }
    };

    /**
     * 查询单个行情
     * @param {string|null} code 商品合约号
     * @param {string|null} callback 回调字符串
     */
    proto.updateQuote = function (code, callback) {
        mcm.net.send({
            url: config.quoteHost + '/quote.jsp',
            type: 'GET',
            jsonp: true,
            retry: true,
            timeout: 1000,
            delay: 100,
            data: {
                callback: '?',
                code: code,
                _: new Date().getTime()
            }
        }, true).then((result) => {
            quoteAnalysis(this.set, this.map, result, this.total);
            this._singleInquiryCallback(code, callback);
        })
    };

    /**
     * 查询所有行情
     */
    proto.updateAll = function (code) {
        let self = this;
        mcm.net.send({
            url: config.quoteHost + '/quote.jsp',
            type: 'GET',
            jsonp: true,
            retry: true,
            timeout: 1500,
            delay: 100,
            data: {
                callback: '?',
                code: code || self.quoteList.join(','),
                _: new Date().getTime(),
                simple: true
            }
        }, true).then((result) => {
            generateBrief(this.brief, this.map, result, this.total);
            this._multipleInquiryCallback();
        });
    };

    /**
     * 生成行情简报
     * @param obj
     * @param data
     * @param contracts
     * @param map
     */
    function generateBrief(obj, map, data, contracts) {
        if (!data)
            return;
        const list = data.split(';');
        list.forEach((t) => {
            const o = t.split(',');
            const code = map[o[0]];
            const isUp = o[1] > 0;
            const price = Number(o[2]);
            let cent = Number(percent(isUp, price, o[3]));
            if (!isUp) {
                cent = 0 - cent;
            }
            const c = contracts[code];
            if (!c)
                return;

            let tradingTime = getTradingTime(c);
            if (tradingTime !== 0) {
                tradingTime = tradingTime.split(' ');
            }
            obj[code] = {
                isUp: isUp,
                price: price,
                percent: cent,
                isTrading: isQuoting(c),
                tradingTime: tradingTime,
                priceDigit: c.priceDigit
            }
        });

        function percent(isUp, up, end) {
            if (isUp) {
                return (((up - end) / end) * 100).toFixed(2);
            } else {
                return (((end - up ) / up) * 100).toFixed(2);
            }
        }
    }

    /**
     * 详细数据分析
     * @param obj
     * @param map
     * @param string
     * @param total
     */
    function quoteAnalysis(obj, map, string, total) {
        if (!string)
            return;
        let list = string.split(';'), quote, date, code, contract;
        list.forEach(function (each) {
            quote = each.split(',');
            date = new Date(parseInt(quote.last()));
            code = map[quote[0]];
            contract = total[code];
            obj[code] = {
                'item': code,
                'code': quote[0],
                'time': mcm.tool.formatDate(date, 'h:i'),
                'timestamp': quote.last(),
                'price': parseFloat(quote[9]),
                'volume': parseInt(quote[12]),
                'lastVolume': parseInt(quote[12]),
                'wt_sell_price': parseFloat(quote[1]),
                'wt_sell_volume': parseInt(quote[2]),
                'wt_buy_price': parseFloat(quote[3]),
                'wt_buy_volume': parseInt(quote[4]),
                'close': parseFloat(quote[5]),
                'open': parseFloat(quote[6]),
                'max': parseFloat(quote[7]),
                'min': parseFloat(quote[8]),
                'settle_price': parseFloat(quote[11]),
                'settle_price_yes': parseFloat(quote[16]),
                'amount': parseFloat(quote[13]),
                'hold_volume': parseInt(quote[14]),
                'hold_yes': parseInt(quote[15]),
                'high_limit': parseFloat(quote[17]),
                'low_limit': parseFloat(quote[18])
            };
        }.bind(this))
    }

    /**
     * 获取离当前时间点最近的时间
     *  @deprecated since now
     */
    function getCloseTime() {
        var timeList = [];
        for (var i = 0, len = arguments.length; i < len; i++) {
            var m = arguments[i];
            if (m instanceof Array)
                timeList.concat(m);
            else
                timeList.push(m);
        }
        var now = Date.now();
        var t = null;
        timeList.forEach(function (e, i) {
            if (e instanceof Date === false) {
                e = mcm.tool.fabricateDate(e);
            }
            if (now < e && t === null)
                t = timeList[i];
        });
        if (t === null) {
            t = timeList[0]
        }
        return t;
    }

    /**
     * 检查是否开市
     * @param contract
     * @return {boolean}
     */
    function isQuoting(contract) {
        const allPoints = getAllPoints(contract);
        const today = new Date();
        const timeStr = mcm.tool.formatDate(today, 'h:i');
        const amTimeStr = contract.amOpenTime.removeSecond();
        // var pmCloseTimeStr = comm.pmCloseTime.removeSecond();
        const niteCloseTimeStr = contract.niteCloseTime.removeSecond();

        // check holiday
        const holiday = isHoliday(contract);
        if (holiday) {
            return false
        }
        // check weekend
        if(contract.classifyName !== '数字货币'){
            if (today.getDay() === 0) {
                return false
            }
            if (today.getDay() === 6) {
                if (niteCloseTimeStr > '12:00' || timeStr > niteCloseTimeStr) {
                    return false
                }
            }
        }

        // Fix Monday
        if (today.getDay() === 1 && timeStr < amTimeStr) {
            return false
        }
        return allPoints.indexOf(timeStr.trim()) >= 0
    }

    /**
     * 获取交易时间,若返回0则表示正在交易
     * @param comm
     * @return {*}
     */
    function getTradingTime(comm) {
        var allPoints = getAllPoints(comm, true);
        var date = new Date();
        var timeStr = mcm.tool.formatDate(date, 'h:i');
        var amTimeStr = comm.amTradeTime.removeSecond();
        var pmTimeStr = comm.pmTradeTime.removeSecond();
        var niteTimeStr = comm.niteTradeTime.removeSecond();
        var niteCloseTimeStr = comm.niteCloseTime.removeSecond();

        if (comm.amOpenTime === comm.amCloseTime) {
            amTimeStr = pmTimeStr;
            if (comm.pmOpenTime === comm.pmCloseTime) {
                amTimeStr = niteTimeStr
            }
        }

        // check holiday
        var holiday = isHoliday(comm);
        if (holiday) {
            date = new Date(holiday);
            timeStr = mcm.tool.formatDate(date, 'h:i');
        }

        // check weekend
        if (date.getDay() === 0) {
            date.setDate(date.getDate() + 1);
            timeStr = amTimeStr;
            return getNearOpenTime(date, timeStr)
        } else if (date.getDay() === 6) {
            // fix saturday morning
            if (niteCloseTimeStr < '12:00' && timeStr < niteCloseTimeStr) {
                return 0
            } else {
                date.setDate(date.getDate() + 2);
                timeStr = amTimeStr
            }
            return getNearOpenTime(date, timeStr)
        }

        // Fix Monday
        if (date.getDay() === 1 && timeStr < amTimeStr) {
            timeStr = amTimeStr;
            return getNearOpenTime(date, timeStr)
        }

        if (allPoints.indexOf(timeStr.trim()) >= 0) {
            // on trading time
            return 0
        } else {
            // find next open time
            if (timeStr < amTimeStr) {
                timeStr = amTimeStr
            } else if (timeStr < pmTimeStr) {
                timeStr = pmTimeStr
            } else if (timeStr < niteTimeStr) {
                timeStr = niteTimeStr
            } else if (niteTimeStr.startsWith("0") && timeStr < "24:00") {
                timeStr = niteTimeStr
            } else {
                date.setDate(date.getDate() + 1);
                timeStr = amTimeStr
            }
            return getNearOpenTime(date, timeStr)
        }
    }

    /**
     * 获取最近的开市时间
     * @param date
     * @param timeStr
     * @return {string}
     */
    function getNearOpenTime(date, timeStr) {
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (date.getDate() === today.getDate()) {
            return '今天 ' + timeStr
        } else if (date.getDate() === tomorrow.getDate()) {
            return '明天 ' + timeStr
        } else {
            return '%s %s'.splice(mcm.tool.formatDate(date, 'm月d日'), timeStr);
        }
    }

    /**
     * 判断是否假期中,并获取假期结束的时间
     * @param contract
     * @return {*}
     */
    function isHoliday(contract) {
        var result = null, holiday = contract.holiday, data = new Date();
        var timeScope, arr, start, end;
        if (holiday !== "" && holiday !== undefined) {
            holiday = holiday.split(';');
            result = holiday.find(function (e) {
                timeScope = e.trim();
                if (timeScope !== '') {
                    arr = timeScope.split(',');
                    start = new Date(arr[0].trim());
                    end = new Date(arr[1].trim());
                    return data.getTime() > start.getTime() && data.getTime() < end.getTime()
                }
                return false;
            });
        }
        if (result === undefined)
            result = false;

        if (result === null)
            result = false;

        if (result !== false)
            result = result.trim().split(',').shift();

        return result;
    }

    let rest = {};
    let work = {};

    function getAllPoints(contract, isTrade) {
        if (isTrade) {
            if (!!work[contract['contract']]){
                return work[contract['contract']]
            }
        } else {
            if (!!rest[contract['contract']]){
                return rest[contract['contract']]
            }
        }

        let start, end;
        let amTradeTime = null;
        let amClearingTime = null;

        let pmTradeTime = null;
        let pmClearingTime = null;

        let niteTradeTime = null;
        let niteClearingTime = null;

        if (isTrade) {
            amTradeTime = contract.amTradeTime.removeSecond();
            amClearingTime = contract.amClearingTime.removeSecond();

            pmTradeTime = contract.pmTradeTime.removeSecond();
            pmClearingTime = contract.pmClearingTime.removeSecond();

            niteTradeTime = contract.niteTradeTime.removeSecond();
            niteClearingTime = contract.niteClearingTime.removeSecond();
        } else {
            amTradeTime = contract.amOpenTime.removeSecond();
            amClearingTime = contract.amCloseTime.removeSecond();

            pmTradeTime = contract.pmOpenTime.removeSecond();
            pmClearingTime = contract.pmCloseTime.removeSecond();

            niteTradeTime = contract.niteOpenTime.removeSecond();
            niteClearingTime = contract.niteCloseTime.removeSecond();
        }

        let totalPoints = [];
        let allPoints = [];
        let timeStr = '', hour, minute;
        // 60 * 24 minutes
        for (let i = 0; i < 1440; i++) {
            hour = 0;
            minute = 0;
            if (i >= 60) {
                hour = parseInt(i / 60);
                minute = i - 60 * hour
            } else {
                minute = i
            }
            timeStr = '%s:%s'.splice(mcm.tool.completeNum(hour), mcm.tool.completeNum(minute));
            totalPoints.push(timeStr)
        }

        if (amTradeTime !== null && amClearingTime !== null) {
            start = totalPoints.indexOf(amTradeTime);
            end = totalPoints.indexOf(amClearingTime);
            allPoints = allPoints.concat(totalPoints.slice(start, end + 1))
        }

        if (pmTradeTime !== null && pmClearingTime !== null) {
            start = totalPoints.indexOf(pmTradeTime);
            end = totalPoints.indexOf(pmClearingTime);
            allPoints = allPoints.concat(totalPoints.slice(start, end + 1))
        }

        if (niteTradeTime !== null && niteClearingTime !== null) {
            start = totalPoints.indexOf(niteTradeTime);
            end = totalPoints.indexOf(niteClearingTime);
            if (end >= start) {
                allPoints = allPoints.concat(totalPoints.slice(start, end + 1))
            } else {
                allPoints = allPoints.concat(totalPoints.slice(start, totalPoints.length + 1));
                allPoints = allPoints.concat(totalPoints.slice(0, end + 1))
            }
        }

        if (isTrade) {
            return work[contract['contract']] = allPoints.uniquely()
        } else {
            return rest[contract['contract']] = allPoints.uniquely();
        }
    }

    return Contracts;
});