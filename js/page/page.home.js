/**
 * Created by wildeChen on 2016/11/23.
 */
define(['page', 'swiper', 'cookie'], function (page, swiper, cookie) {



    let self = new page('home');

    self.param = {
        buy: '0.0',
        buyVolume: '0',
        sell: '0.0',
        sellVolume: '0',
        quote: '0.0',
        rate: '+0',
        percent: '0%'
    };

    self.input = {
        mobile: '',
        password: ''
    };

    self.cache.quoteList = null;

    self.onEnter = function () {
        if (mcm.cache.isLogin()) {
            this['loginNode'].hide();
        }

        const k = mcm.tool.getSearch();
        if (!!k.ru)
            cookie('ru', k.ru);


        //todo swiper
        /**
         * banner
         */
        new swiper('.imgList', {
            speed: 500,
            autoplay: 3000,
            loop: true,
            grabCursor: true,
            disableOnInteraction: false,
            pagination: '.swiper-pagination'
        });

        /**
         * 首页行情列表
         */
        this.cache.quoteList = new swiper('.quoteList', {
            slidesPerView: 7,
            prevButton: '.button-prev',
            nextButton: '.button-next'
            // observer: true,
            // observeParents: true
        });
        if (!mcm.state.isInitialized()) {
            mcm.schedule.addEventListener('quotesInitial', this.quotesInit, this);
        } else {
            this.quotesInit();
        }

        mcm.net.send({
            url: '/api/index.htm',
            type: 'GET',
            data: {
                action: 'carousel'
            }
        }, true).then((result) => {
            this.chunk('noticeModel', '.noticeModel', {list: result.notices})
        });
        //英雄学院标题点击跳转
        $('.guide li').click(function () {
            const t = $(this).parents('.list').siblings('.subTitle').text();
            window.location.href = `#school-detail?t=${t}&&s=${$(this).text()}`;
        });
        //原油/金银切换
        self.listNews(0);
        $('.goods span').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            self.listNews($(this).index());
        });
        //资讯直播
        self.listLive();

        // mcm.schedule.addEventListener('quoteUpdate', this.quotesUpdate, this);
        mcm.schedule.addEventListener('simpleUpdateHome', this.simpleUpdate, this);
        mcm.schedule.addEventListener('loginStatus', this.loginCallback, this);
        //验证是否记住密码
        if (mcm.tool.getStorage('fkqh-username')) {
            self.input.mobile = mcm.tool.getStorage('fkqh-username');
            self.input.password = mcm.tool.getStorage('fkqh-password');
            this['rememberNode'].attr('checked', true);
        }
    };

    //原油、金银列表数据
    self.listNews = function (t) {
        mcm.net.send({
            url: '/api/news/newsList.htm?page=1&type=' + t,
            type: 'GET',
            retry: true,
            timeout: 3000,
            delay: 500
        }, true).then(function (result) {
            var data = result.newsList;
            this.chunk('module-home-new', '.goods-news', {list: data[0].list});
        }.bind(this));
    };

    //资讯直播数据
    self.listLive = function () {
        mcm.net.send({
            url: '/api/news/expressList.htm?page=1',
            type: 'GET',
            retry: true,
            timeout: 3000,
            delay: 500
        }, true).then(function (result) {
            var t = result.newsList;
            var list = t[0].list;
            var data = new Array();
            list.forEach(function (v, k, arr) {
                if (v != undefined) {
                    var obj = {};
                    obj = filterData(v);
                    data.push(obj);
                }
            });
            this.chunk('module-home-live', '.news', {list: data})
        }.bind(this));
    };

    self.onExit = function () {
        mcm.chart.exit();
        mcm.state.endMultipleInquiry('simpleUpdateHome');
        mcm.schedule.removeEventListeners(this);
        this.copy('onExit');
    };

    //提交登录信息
    self.login = function () {
        if (self.input.mobile === null || self.input.mobile === '')
            return mcm.alert.sp(this.url, '请输入手机号码', 'alert', [{name: '确定'}]);
        else if (!/^1[3587][0-9]{9}$/.test($.trim(self.input.mobile)))
            return mcm.alert.sp(this.url, '请输入11位数字手机号码', 'alert', [{name: '确定'}]);

        if (self.input.password === null || self.input.password === '')
            return mcm.alert.sp(this.url, '请输入密码', 'alert', [{name: '确定'}]);
        else if (!/^[^\s]{6,20}$/i.test($.trim(self.input.password)))
            return mcm.alert.sp(this.url, '请输入6-20位密码', 'alert', [{name: '确定'}]);


        mcm.net.send({
            url: '/api/sso/user_login_check',
            data: {
                mobile: self.input.mobile,
                password: self.input.password
            },
            timeout: 3000
        }).then(function (result) {
            if (result.success) {
                // mcm.alert.sp(this.url,'登录成功','normal',[{name:'确定'}],3);
                mcm.cache.setLogin();
                var isRemember = this['rememberNode'].is(':checked');
                if (isRemember) {
                    mcm.tool.setStorage('fkqh-username', self.input.mobile);
                    mcm.tool.setStorage('fkqh-password', self.input.password);
                } else {
                    this.resetView('input', '');
                    mcm.tool.clearStorage('fkqh-username');
                    mcm.tool.clearStorage('fkqh-password');
                }
            }
        }.bind(this));
    };

    self.loginCallback = function () {
        if (mcm.cache.isLogin()) {
            this['loginNode'].hide();
        } else {
            this['loginNode'].show();
        }
    };

    self.quotesInit = function () {
        const code = mcm.tool.getSearch().code;
        const item = code && mcm.state.map[code] || mcm.state.getDefault();
        mcm.chart.init({
            dom: 'trend',
            frequency: 2000,
            code: item
        });
        // const contract = mcm.state.total[item].contract;
        // mcm.state.startSingleInquiry(contract,'quoteUpdate');
        mcm.state.startMultipleInquiry('simpleUpdateHome')

    };

    self.simpleUpdate = function () {
        const {code} = mcm.tool.getSearch();
        const list = mcm.state.getHot();
        self.chunk('quoteModel', '.quoteNav', {
            list: list,
            search: code
        }, {normal: true}).then(() => {
            this.cache.quoteList.update();
        });
    };

    // self.quotesUpdate = function (sender, item) {
    //     const q = mcm.state.getQuote(item);
    //     const {priceDigit:unit} = mcm.state.getContract(item);
    //     if (q !== null) {
    //         const total = q.wt_buy_volume + q.wt_sell_volume;
    //         this.param.buy = q.wt_sell_price;
    //         this.param.buyVolume = q.wt_buy_volume;
    //         const rise = parseInt(q.wt_buy_volume.div(total).mul(200));
    //         this['riseVolume'].css('width', rise + 'px');
    //         this.param.sell = q.wt_buy_price;
    //         this.param.sellVolume = q.wt_sell_volume;
    //         const fall = parseInt(q.wt_sell_volume.div(total).mul(200));
    //         this['fallVolume'].css('width', fall + 'px');
    //         /**
    //          * 更新行情图上的价格动态
    //          */
    //         this.param.quote = q.price.toFixed(unit);
    //         let rate = q.price.sub(q.settle_price_yes);
    //         if (rate >= 0)
    //             rate = '+' + rate;
    //         this.param.rate = rate;
    //         let percent = b.percent;
    //         if (percent >= 0)
    //             percent = '+' + percent;
    //         this.param.percent = percent + '%';
    //     }
    // };

    self.switchQuote = function (e, target) {
        let c = $(target.currentTarget || target);
        if (c.hasClass('active'))
            return;

        $('.nav .btn').removeClass('active').first().addClass('active');
        c.addClass('active').siblings('.quote').removeClass('active');
        mcm.chart.swap({
            code: e
        })
    };

    function splitData(line) {
        let item = null;
        const l = line.split('#');
        if (l.length === 12) {
            item = {
                content: l[3],
                date: l[2],
                id: l[l.length - 1]
            }
        } else if (l.length === 14) {
            item = {
                content: l[2],
                date: l[8],
                id: l[l.length - 1]
            }
        }
        return item
    }

    function filterData(result) {
        let obj = [], datetime, datetime_, daytime;
        const s = result.split('#');
        if (s.length === 12) {
            obj.txt = s[3];
            datetime = s[2];
            datetime_ = datetime.split(' ');
            obj.daytime = datetime_[0];
            obj.time = datetime_[1];
            daytime = datetime_[0].split('-');
            obj.year = daytime[0];
            obj.month = daytime[1];
            obj.day = daytime[2];
            obj.datetime = obj.year + '-' + obj.month;
        } else if (s.length === 14) {
            obj.txt = s[2];
            datetime = s[8];
            datetime_ = datetime.split(' ');
            obj.daytime = datetime_[0];
            obj.time = datetime_[1];
            daytime = datetime_[0].split('-');
            obj.year = daytime[0];
            obj.month = daytime[1];
            obj.day = daytime[2];
            obj.datetime = obj.year + '-' + obj.month;
        }
        return obj;
    }


    return self;
});