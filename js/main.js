var mcm = mcm || {};

require.config({

    urlArgs: "v=" + (new Date().getTime() / 60000).toFixed(),

    waitSeconds: 0,

    paths: {

        //配置文件
        'deploy': '../config',

        //路由配置文件
        'config': 'config',

        //html打包文件
        'app': 'app',

        //core文件
        'engine': 'core/engine',
        'page': 'core/page',
        'renderer': 'core/renderer',
        'route': 'core/route',
        'tool': 'core/tool',

        //lib文件
        'jquery': 'lib/jquery',
        'template': 'lib/artTemplate',
        // 'swiper': 'lib/swiper',
        'swiper': 'lib/swiper-3.4.2.jquery.min',
        'lazyload': 'lib/lazyload',
        'address': 'lib/address',
        'clipboard': 'lib/clipboard.min',

        // 'mock': 'lib/mock',
        // 'api': 'lib/api',

        //module文件
        'schedule': 'module/schedule',
        'cache': 'module/cache',

        //语言文件
        'lang': 'lang/lang',

        //扩展文件
        'ui': 'option/ui',
        'load': 'option/load',
        'ajax': 'option/ajax',
        // 'validateForm': 'option/validate',

        //插件
        '_layer': 'plugin/_layer',
        'common': 'plugin/common',
        'cookie': 'plugin/cookie',
        'md5': 'plugin/md5',
        'qrcode':'plugin/llqrcode',
        'encode':'plugin/jquery-qrcode.min',

        // 'highcharts':'https://cdn.hcharts.cn/highstock/highstock',
        // 'highcharts': '../highstock',

        //可选插件
        'webSocket': 'option/webSocket',

        //行情业务模块
        'quote': 'quotes/quote',
        'chart':'quotes/chart',
        // 'chart': 'quotes/chart',
        // 'sline': 'quotes/sline',
        // 'kline': 'quotes/kline',
        // 'mkline': 'quotes/mkline',
        // 'tick': 'quotes/tick',
        'TradingView': 'lib/charting_library.min',
        'dataFeeds': 'lib/datafeed',


        //虚拟行情
        // 'virtual': 'lib/virtualQuotes'
    },

    shim: {
        'template': {
            exports: 'template'
        },
        'highcharts': {
            exports: 'Highcharts'
        },
        'TradingView': {
            exports: 'TradingView'
        },
        'dataFeeds': {
            exports: 'Datafeeds'
        },
        'encode':['jquery'],
        'lang': ['jquery'],
        'swiper': ['jquery']
    }
});

require(['jquery', 'engine', 'load', 'ui', 'schedule', 'ajax', 'template', 'cache', 'common', 'lang'], function ($, root, load, ui, schedule, net, template, cache, common, lang) {
    $(function () {
        // api();
        // let cnzz_s_tag = document.createElement('script');
        // cnzz_s_tag.type = 'text/javascript';
        // cnzz_s_tag.async = true;
        // cnzz_s_tag.charset = "utf-8";
        // cnzz_s_tag.src = "https://s13.cnzz.com/z_stat.php?id=1271290713&web_id=1271290713";
        // let root_s = document.getElementsByTagName('script')[0];
        // root_s.parentNode.insertBefore(cnzz_s_tag, root_s);
        // var _czc = _czc || [];
        // _czc.push(["_setAccount", "1271290713"]);
        //
        // let wqa = document.createElement('script');
        // wqa.charset = 'utf-8';
        // wqa.async = true;
        // wqa.src = "http://wpa.b.qq.com/cgi/wpa.php";
        // root_s.parentNode.insertBefore(wqa, root_s);

        mcm = root;

        //todo 版本号
        mcm.version = 'v1.0.0';

        // mcm.config.LocalMode = 1;

        mcm.resources = [
            // 'ui-alert',
            'ui-normal',
            'stocksLoading'
        ];

        mcm.blackList = [
            'trade',
            'simulate',
            'mine',
            'mine-setting',
            'mine-setting-info',
            'mine-setting-cert',
            'mine-setting-bank',
            'mine-setting-mobile',
            'mine-setting-password',
            'mine-agency',
            'mine-agency-user',
            'mine-agency-subdeal',
            'mine-agency-apply',
            'mine-deal',
            'mine-fund'
        ];

        //todo 复写路由黑名单的回调事件
        mcm.blackListCallback = function (value, search) {
            if (!mcm.initialization)
                return mcm.tool.browserInterceptor('home');
            mcm.tool.browserInterceptor('login', '', 2, {url: value, search: search});
        };

        //todo 设置公共通信错误处理
        mcm.communicationError = function (result) {
            mcm.alert.sp('common', result || '未知错误', 'alert', [{name: '确定'}], 3);
        };

        //todo 挂载加载管理器
        mcm.load = new load();
        //todo 挂载弹窗组件
        mcm.alert = new ui.alert();
        //todo 挂载缓存组件
        mcm.cache = new cache();
        //todo 挂载任务管理组件
        mcm.schedule = new schedule();
        // todo 挂载socket数据交互组件
        mcm.net = new net(mcm);

        template.helper('$win', function () {
            return window
        });

        template.helper('$q', function () {
            return mcm.state;
        });

        template.helper('$ln', function (key) {
            return mcm.lang && mcm.lang(key) || '语言包错误';
        });

        template.helper('$tool', function () {
            return mcm.tool;
        });

        template.helper('$Math', function () {
            return Math;
        });

        template.helper('$console', function (data) {
            console.log(data)
        });

        template.helper('$isEmpty', function (obj) {
            return mcm.tool.isOwnEmpty(obj);
        });

        template.helper('$contain', function (index, array) {
            return array.contains(index);
        });

        template.helper('$createDate', function (days, type) {
            if (arguments.length === 1) {
                type = days;
                days = 0;
            }
            var today = new Date();
            today.setDate(today.getDate() + days);
            return mcm.tool.transferDateToString(today, type);
        });

        //挂在金钱转换到模板中
        template.helper('$transformCurrency', function (t) {
            if (t)
                return common.formatCurrency(t);
            else
                return '0.00';
        });

        //返回用户信息
        template.helper('$userInfo', function () {
            return mcm.cache.getAccountInfo();
        });

        template.helper('$currency', function () {
            return {
                USD: {
                    name: '美元',
                    symbol: '$'
                },

                CNY: {
                    name: '人民币',
                    symbol: '¥'
                },

                HKD: {
                    name: '港币',
                    symbol: 'HK$'
                },

                EUR: {
                    name: '欧元',
                    symbol: '€'
                }
            }
        });

        lang().then(function (translate) {
            mcm.lang = translate;
            mcm.init();
        });
    })
});