/**   2017/9/29   by alen   **/
define(['page'], function (page) {
    var self = new page('mine-deal');

    var modelList = [
        '',
        'trade-storeList',
        'trade-settleList',
        'trade-failureList'
    ];

    var st = {
        1: '持仓',
        2: '结算',
        3: '流单'
    };

    self.param = {
        sortType: '持仓',
        holdIncome: 0,
        stopProfit: '0.00',
        stopLoss: '0.00'
    };

    self.onEnter = function () {
        this.tradeType = 1;
        this.sortType = 1;
        this.initStore();

        mcm.schedule.addEventListener('storeUpdate', this.storeUpdate, this);

    };

    self.onExit = function () {
        mcm.schedule.removeEventListeners(this);
        mcm.state.stopStoreUpdate();
        this.copy('onExit');
    };

    /**
     * 初始化持仓列表
     */
    self.initStore = function (eventData) {
        if (eventData)
            mcm.state.stopStoreUpdate();


        this.cache.holdIncome = 0;
        this.param.holdIncome = 0;


        mcm.state.getStore(this.sortType, this.tradeType).then(function (data, tradeType) {
            if (tradeType !== this.tradeType) {
                mcm.state.fixedStoreUpdate(1, this.tradeType);
                return;
            }
            if (this.sortType === 1) {
                this['soldAllNode'].show();
                this['incomeNode'].show();
                data = dealStore(data);
                if (this.cache.holdIncome >= 0)
                    this.param.holdIncome = '<i>&#43;%s</i>'.splice(this.cache.holdIncome);
                else
                    this.param.holdIncome = '<b>&#8722;%s</b>'.splice(Math.abs(this.cache.holdIncome));

                if (data.length === 0)
                    this['soldAllNode'].addClass('disabled');
                else
                    this['soldAllNode'].removeClass('disabled');
            }

            this.cache.store = data;

            if (this.sortType === 1)
                data = this.cache.store.slice(0, 10);

            this.chunk(modelList[this.sortType], '.tableArea', {list: data}, {refresh: !!eventData});
            this.chunk('pageController', '.tableArea', {
                count: 1,
                each: 10,
                total: this.cache.store.length,
                event: 'flipStore',
                sort: this.sortType
            }, {refresh: true, append: true})
        }.bind(this));
        if (this.sortType === 1)
            mcm.state.startStoreUpdate(this.sortType, this.tradeType);
    };

    /**
     * 切换交易类型
     * @param v
     * @param e
     */
    self.switchTradeType = function (v, e) {
        var target = $(e.currentTarget || e);
        if (target.hasClass('active'))
            return;

        target.addClass('active').siblings('li').removeClass('active');

        this.tradeType = parseInt(v);
        this.initStore(true);
    };

    /**
     * 切换仓库类型
     * @param sort
     * @param e
     */
    self.switchStore = function (sort, e) {
        var target = $(e.currentTarget || e);
        if (target.hasClass('on'))
            return;

        mcm.state.stopStoreUpdate();
        sort = parseInt(sort);
        this.sortType = sort;
        this.param.sortType = st[this.sortType];

        target.addClass('on').siblings('span').removeClass('on');
        if (sort === 1) {
            this['soldAllNode'].show();
            this['incomeNode'].show();
        } else {
            this['soldAllNode'].hide();
            this['incomeNode'].hide();
        }
        mcm.state.getStore(sort, this.tradeType).then(function (data, tradeType, count, total) {
            if (sort === 1) {
                if (data.length === 0)
                    this['soldAllNode'].addClass('disabled');
                else
                    this['soldAllNode'].removeClass('disabled');

                data = dealStore(data);
                if (this.cache.holdIncome >= 0)
                    this.param.holdIncome = '<i>&#43;%s</i>'.splice(this.cache.holdIncome);
                else
                    this.param.holdIncome = '<b>&#8722;%s</b>'.splice(Math.abs(this.cache.holdIncome));
            } else {
                this.param.holdIncome = '';
            }

            this.cache.store = data;
            this.chunk(modelList[sort], '.tableArea', {list: data}, {refresh: true});
            this.chunk('pageController', '.tableArea', {
                count: count,
                each: 10,
                total: total,
                event: 'flipStore',
                sort: sort
            }, {refresh: true, append: true})
        }.bind(this));
        if (sort === 1)
            mcm.state.startStoreUpdate(sort, this.tradeType);
    };

    /**
     * 仓库翻页
     * @param bind
     */
    self.flipStore = function (bind) {
        var info = bind.split(':');
        var count = parseInt(info[0]);
        var sort = parseInt(info[1]);
        if (sort === 1) {
            /**
             * @todo 持仓列表在本地处理翻页问题
             */
            this.cache.count = count;
            var data = this.cache.store.slice((count - 1) * 10, count.mul(10));
            this.chunk(modelList[sort], '.tableArea', {list: data}, {refresh: true});
            this.chunk('pageController', '.tableArea', {
                count: count,
                each: 10,
                total: this.cache.store.length,
                event: 'flipStore',
                sort: sort
            }, {refresh: true, append: true})
        } else {
            this.cache.count = 1;
            mcm.state.getStore(sort, this.tradeType, count).then(function (data, tradeType, count, total) {
                this.cache.store = data;
                this.chunk(modelList[sort], '.tableArea', {list: data}, {refresh: true});
                this.chunk('pageController', '.tableArea', {
                    count: count,
                    each: 10,
                    total: total,
                    event: 'flipStore',
                    sort: sort
                }, {refresh: true, append: true})
            }.bind(this))
        }
    };


    /**
     * 持仓更新
     * @param sender
     * @param eventData
     */
    self.storeUpdate = function (sender, eventData) {
        if (eventData.tradeType !== this.tradeType) {
            mcm.state.fixedStoreUpdate(eventData.sort, this.tradeType);
            return;
        }

        mcm.state.updateAll();

        var data = eventData.list;
        data = dealStore(data);
        if (data.length === 0)
            this['soldAllNode'].addClass('disabled');
        else
            this['soldAllNode'].removeClass('disabled');

        if (this.cache.holdIncome >= 0)
            this.param.holdIncome = '<i>&#43;%s</i>'.splice(this.cache.holdIncome);
        else
            this.param.holdIncome = '<b>&#8722;%s</b>'.splice(Math.abs(this.cache.holdIncome));
        this.cache.store = data;
        var count = this.cache.count || 1;
        while (count.sub(1).mul(10) > data.length && count !== 1) {
            count--;
        }
        this.cache.count = count;
        data = this.cache.store.slice((count - 1) * 10, count.mul(10));
        this.chunk(modelList[eventData.sort], '.tableArea', {list: data}, {refresh: true});
        this.chunk('pageController', '.tableArea', {
            count: count,
            each: 10,
            total: this.cache.store.length,
            event: 'flipStore',
            sort: eventData.sort
        }, {refresh: true, append: true});
    };

    /**
     * 结算列表订单详情
     * @param v
     */
    self.orderInfo = function (v) {
        var o = this.cache.store.find(function (element) {
            return element.id == v;
        });
        mcm.route.popUp('orderInfo', o);
    };

    /**
     * 平仓
     * @param id
     */
    self.sold = function (id) {
        mcm.net.send({
            url: '/api/trade/close.htm',
            data: {
                bettingId: id,
                tradeType: this.tradeType,
                source: '下单'
            }
        }).then(function (result) {
            mcm.alert.sp(this.url, result.errorMsg || '卖出成功', 'normal', [{name: '确定'}])
        }.bind(this))
    };

    self.soldAllConfirm = function () {
        if (!this.cache.store || this.cache.store.length <= 0)
            return;

        mcm.alert.sp(this.url, '您确定要卖出全部持仓吗', 'normal', [{
            name: '确定', then: function () {
                self.soldAll().then(function (total, success, failure) {
                    mcm.alert.sp(self.url, '总共卖出%s单,成功%s单,失败%s单'.splice(total, success, failure), 'normal', [{name: '确定'}])
                }).fail(function (result) {
                    mcm.alert.sp(self.url, result || '未知错误', 'alert', [{name: '确定'}])
                })
            }
        }, {name: '取消'}])
    };
    /**
     * 一键平仓
     */
    self.soldAll = function () {
        var call = $.Deferred();
        var list = [];
        if (!this.cache.store || this.cache.store.length <= 0)
            call.reject('当前没有持仓可卖出');
        this.cache.store.forEach(function (e) {
            if (e.tradeStatus === 8 || e.tradeStatus === 11)
                list.push(e.id)
        });
        if (list.length > 0) {
            var target = list.length;
            var current = 0;
            var success = 0;
            var failure = 0;
            mcm.load.openAnimation();
            list.forEach(function (e) {
                mcm.net.send({
                    url: '/api/trade/close.htm',
                    data: {
                        bettingId: e,
                        tradeType: this.tradeType,
                        source: '下单'
                    }
                }, true).then(function (result) {
                    current++;
                    success++;
                    if (target === current) {
                        mcm.load.closeAnimation();
                        call.resolve(current, success, failure)
                    }
                }.bind(this)).fail(function () {
                    current++;
                    failure++;
                    if (target === current) {
                        mcm.load.closeAnimation();
                        call.resolve(current, success, failure)
                    }
                }.bind(this))
            }.bind(this))
        } else {
            call.reject('当前没有可卖出的合约');
        }

        return call;
    };

    /**
     * 设置止盈止损
     */
    self.setProfit = function (id) {
        var selected = this.cache.store.find(function (e) {
            return e.id == id;
        });
        if (selected === undefined || selected === null)
            return;
        this.cache.selected = selected;
        var contract = mcm.state.getContract(selected.contCode);
        this.cache.unit = contract.priceUnit.mul(contract.priceChange).mul(selected.volume);
        var profitRange = selected.stopProfitBegin.div(this.cache.unit);
        var profitStep = selected.stopProfit.div(this.cache.unit);
        var lossRange = Math.abs(selected.stopLossBegin).div(this.cache.unit);
        var lossStep = Math.abs(selected.stopLoss).div(this.cache.unit);
        this['profitNode'].attr('max',profitRange).val(profitStep);
        this['lossNode'].attr('max',lossRange).val(lossStep);
        this.param.stopProfit = selected.stopProfit;
        this.param.stopLoss = Math.abs(selected.stopLoss);
        this['mainNode'].addClass('step');
        setTimeout(function () {
            self['mainNode'].addClass('show');
        }, 1)
    };

    /**
     * 增加止盈
     */
    self.addProfit = function () {
        var result = this.param.stopProfit.add(this.cache.unit);
        if (result > this.cache.selected.stopProfitBegin)
            return;

        var val = this['profitNode'].val();
        val++;
        this['profitNode'].val(val);
        this.param.stopProfit = result;
    };

    /**
     * 减少止盈
     */
    self.subProfit = function () {
        var result = this.param.stopProfit.sub(this.cache.unit);
        if (result < this.cache.unit)
            return;

        var val = this['profitNode'].val();
        val--;
        this['profitNode'].val(val);
        this.param.stopProfit = result;
    };

    /**
     * 止盈设置滚动条
     * @param e
     */
    self.scrollProfit = function (e) {
        var target = $(e.currentTarget);
        this.param.stopProfit = this.cache.unit.mul(target.val())
    };

    /**
     * 增加止损
     */
    self.addLoss = function () {
        var result = this.param.stopLoss.add(this.cache.unit);
        if (result > Math.abs(this.cache.selected.stopLossBegin))
            return;

        var val = this['lossNode'].val();
        val++;
        this['lossNode'].val(val);
        this.param.stopLoss = result;
    };

    /**
     * 减少止损
     */
    self.subLoss = function () {
        var result = this.param.stopLoss.sub(this.cache.unit);
        if (result < this.cache.unit)
            return;

        var val = this['lossNode'].val();
        val--;
        this['lossNode'].val(val);
        this.param.stopLoss = result;
    };

    /**
     * 止损设置滚动条
     * @param e
     */
    self.scrollLoss = function (e) {
        var target = $(e.currentTarget);
        this.param.stopLoss = this.cache.unit.mul(target.val())
    };

    /**
     * 关闭止盈止损设置窗口
     */
    self.closeProfit = function () {
        self['mainNode'].removeClass('show');
        setTimeout(function () {
            self['mainNode'].removeClass('step');
        }, 300)
    };

    /**
     * 提交止盈止损设置
     */
    self.applyProfit = function () {
        this.closeProfit();
        mcm.net.send({
            url: '/api/trade/spsl.htm',
            data: {
                bettingId: this.cache.selected.id,
                tradeType: this.tradeType,
                stopProfit: this.param.stopProfit,
                stopLoss: this.param.stopLoss > 0 ? -this.param.stopLoss : this.param.stopLoss,
                source: '下单'
            }
        }).then(function (result) {
            mcm.alert.sp(this.url, result.errorMsg || '设置成功', 'normal', [{name: '确定'}])
        }.bind(this))
    };

    /**
     * 处理持仓明细中的盈亏金额
     * @param data
     */
    function dealStore(data) {
        self.cache.holdIncome = 0;
        return data.map(function (e) {
            const code = e.contract;
            const contract = mcm.state.getContract(code);
            const quote = mcm.state.getBrief(code);
            if (contract === null || quote === null) {
                e.state = null;
            } else {
                if (quote.price !== 0) {
                    if (e.isBuy) {
                        e.income = quote.price.sub(e.opPrice).mul(contract.priceUnit).mul(e.volume);
                    } else {
                        e.income = e.opPrice.sub(quote.price).mul(contract.priceUnit).mul(e.volume);
                    }

                    // 兼容角模式
                    if (e.moneyType === 1) {
                        e.income = e.income.mul(0.1);
                    }
                    self.cache.holdIncome += e.income;
                }
            }
            return e;
        })
    }

    return self;
});