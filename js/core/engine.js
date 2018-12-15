/**
 * @namespace mcm
 */
define(['config', 'route', 'renderer', 'tool', 'app'], function (config, route, renderer, tool, app) {
    var self = {

        /**
         * @name mcm.map
         * @description 路由配置表 {@link config}
         * @example
         * 'home':{
         *      address:'js/model/home.html',
         *      renderer:DOM.MAIN,
         *      js:'../js/page/page.home'
         *  }
         */
        map: null,

        /**
         * @name mcm.route
         * @description 路由模块
         */
        route: null,

        /**
         * @name mcm.renderer
         * @description 渲染模块
         */
        renderer: null,

        /**
         * @name mcm.tool
         * @description 工具模块
         */
        tool: null,

        /**
         * @name mcm.page
         * @description 页面缓存模块,通过url来获取页面模板缓存
         * @example
         * console.log(mcm.page['home'])
         * '&lt;div&gt;首页&lt;/div&gt'
         */
        page: {},

        /**
         * @name mcm.part
         * @description 页面部件标记,通过标记来判断对应部分当前渲染的url
         * @example
         * console.log(mcm.part['main'])
         * 'home'
         * @author 2016/11/21 by wildeChen
         */
        part: {},

        /**
         * @name mcm.resources
         * @description 初始化加载的页面缓存
         */
        resources: [],

        /**
         * @name mcm.DOM
         * @description 根页面的节点
         */
        DOM: {},

        /**
         * @name mcm.loginStatus
         * @description 路由黑名单使用的登录状态参数
         * @type [null||function||Array]
         */
        loginStatus: null,

        /**
         * @name mcm.loginVerify
         * @description 路由的验证事件
         * @type [null||function||Array]
         */
        loginVerify: null,

        /**
         * @name mcm.blackList
         * @description 路由黑名单,用来控制必须登录以后才能访问的页面
         */
        blackList: [],

        /**
         * @name mcm.blackListCallback
         * @description 路由黑名单的回调事件,用来处理需要登录的页面验证登录失败以后的事件
         */
        blackListCallback: null,

        /**
         * @name mcm.alert
         * @description 弹窗组件
         */
        alert: null,

        /**
         * @name mcm.net
         * @description 通讯组件 {@link WebSocket}
         */
        net: null,

        /**
         * @name mcm.cache
         * @description 缓存管理器
         */
        cache: null,

        /**
         * @name mcm.load
         * @description 加载管理器
         */
        load: null,

        /**
         * @name mcm.initialization
         * @description 初始化参数,页面第一次hashChange以后变为true
         */
        initialization: false,

        /**
         * @name mcm.timeout
         * @description 页面预加载超时时间
         */
        timeout: null,

        /**
         * @name mcm.timeoutCallback
         * @description 页面预加载超时或者失败回调
         */
        timeoutCallback: null,

        /**
         * @name mcm.communicationError
         * @param {Object} data
         * @description webSocket通信中的的通用错误回调
         */
        communicationError: null,

        /**
         * @name mcm.config
         * @description 框架默认配置
         */
        config: {
            /**
             * @description 是否启用本地模式,在本地模式下运行时,若网页运行在 {@link mcm.config.LocalUrl} 下将会默认不从app.js中读取合并的文件
             * @example
             * 0 关闭  1 开启
             */
            LocalMode: 0,

            /**
             * @description 本地模式的Url
             */
            LocalUrl: 'localhost',

            /**
             * @description 本地模式的Ip段
             */
            LocalIp: '192.168'
        },

        /**
         * @method
         * @description 初始化全局对象,并挂载所有方法
         */
        init: function () {
            tool.extend();

            //todo 挂载工具模块
            self.tool = tool;

            //todo 挂载路由功能
            self.route = route;

            //todo 渲染器
            self.renderer = renderer;

            //todo 挂载路由配置
            self.map = config;

            //todo 初始化组件标签
            // var keys = Object.keys(self.DOM);
            // keys.forEach(function (element) {
            //     self.part[self.DOM[element]] = null;
            // });

            //todo 绑定hashChange事件
            $(window).on('hashchange', {sender: route}, route.hashChange);



            var go = $.Deferred();

            go.then(function () {
                //todo 初始化当前页面
                route.hashChange();
                this._argumentsChecking();
            }.bind(this));

            //预加载资源
            if (this.resources.length !== 0){
                var max = this.resources.length;
                var count = 0;
                this.resources.forEach(function (element) {
                    if (!self.page[element]) {
                        if (mcm.config.LocalMode === 0 && app[config[element].address]) {
                            self.page[element] = app[config[element].address];
                            count++;
                            if(count === max)
                                go.resolve();
                        } else if (mcm.config.LocalMode === 1 && document.domain !== mcm.config.LocalUrl && document.domain.indexOf(mcm.config.LocalIp) === -1 && app[config[element].address]) {
                            self.page[element] = app[config[element].address];
                            count++;
                            if(count === max)
                                go.resolve();
                        } else {
                            $.ajax({
                                url: config[element].address,
                                type: 'GET',
                                success: function (data) {
                                    self.page[element] = data;
                                    count++;
                                    if(count === max)
                                        go.resolve();
                                }
                            })
                        }
                    }
                });
            }else{
                go.resolve()
            }
        },

        //todo 对所有可重设的属性进行检查
        _argumentsChecking: function () {
            if (!this.cache)
                console.warn('未挂载缓存管理器,相关功能可能会受到影响');

            if (!this.schedule)
                console.warn('未挂载任务管理器,相关功能可能会受到影响');

            if (!this.net)
                console.warn('未挂载通信组件');

            if (!this.loginStatus)
                console.warn('未设置登录状态参数');

            if (!this.loginVerify)
                console.warn('未设置登录验证事件');

            if (this.blackList.length === 0)
                console.warn('未增加黑名单列表');

            if (!this.timeout)
                console.warn('未设置公共页面加载超时时间');

            if (!this.timeoutCallback)
                console.warn('未设置公共页面加载超时回调');

            if (!this.communicationError)
                console.warn('未设置公共通信错误回调');
        }
    };

    return self;
});