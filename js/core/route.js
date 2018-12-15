/**
 * @namespace
 * @alias route
 * @desc 路由模块
 */
define(['config', 'renderer', 'app', 'tool'], function (map, render, app, tool) {

    var self = {

        /**
         * @method
         * @desc hashChange事件,禁止主动调用,通过浏览器的hashChange来触发该事件
         * @param {Object} [event] hashChange的事件对象
         */
        hashChange: function (event) {

            var self;
            if (event && event.data && event.data['sender']) {
                self = event.data['sender'];
            } else {
                self = this;
            }

            self.getHash().then(function (value) {
                if (value == '')
                    return;
                console.log('触发页面加载事件...');
                if (value instanceof Array) {
                    for (var i = 0; i < value.length; i++) {
                        if (value[i].indexOf('?') != -1)
                            self.changeUrl(value[i]);
                    }
                } else {
                    self.changeUrl(value);
                }
            }).fail(function (callback) {
                callback();
            });

        },

        /**
         * @function
         * @desc 路由分析方法
         * @returns {String|Array} 返回单个url,或以数组形式返回多个url
         * @example
         * about String
         * if the location is 'localhost#home' then
         * return 'home'
         * @example
         * about Array
         * if the location is 'localhost#home/login' then
         * return ['home','login']
         */
        getHash: function () {
            var self = this;

            var call = $.Deferred();

            //提取url
            var value = location.hash;

            //提取查询字符串
            var search = value.split('?')[1];

            //todo 返回首页
            if (value == '') {
                call.resolve('home');
            }

            value = value.replace('#', '');

            if (value.indexOf('/') == 0)
                value = value.substr(1);

            if (value.indexOf('?') != -1) {
                value = value.split('?');
                value = value[0];
            }

            if (value.indexOf('/') != -1) {
                value = value.split('/');
            }

            var check = blackListLoop(value),
                status,
                verify,
                callback,
                pass = false;
            if (typeof (check) == 'boolean') {
                if (check)
                    pass = check;
                status = mcm.loginStatus || (mcm.cache && function () {
                    return mcm.cache.isLogin();
                });
                verify = mcm.loginVerify || (mcm.cache && function (callback) {
                    return mcm.cache.getLogin(callback);
                });
                callback = mcm.blackListCallback;
            } else {
                status = (mcm.loginStatus && mcm.loginStatus[check]) || (mcm.cache && function () {
                    return mcm.cache.isLogin();
                });
                verify = (mcm.loginVerify && mcm.loginVerify[check]) || (mcm.cache && function (callback) {
                    return mcm.cache.getLogin(callback);
                });
                callback = mcm.blackListCallback && mcm.blackListCallback[check] || mcm.blackListCallback;
            }

            if (pass) {
                call.resolve(value);
            } else {
                /**
                 * 登录验证
                 */
                if (!mcm.cache) {
                    console.warn('尚未挂载 mcm.cache 缓存组件,无法进行登录验证判断');
                } else if (status()) {
                    call.resolve(value);
                } else {
                    var result = verify(function () {
                        if (status()) {
                            call.resolve(value)
                        } else {
                            call.reject(function () {
                                if (callback)
                                    callback.apply(self, [value, search]);
                            })
                        }
                    });
                    if (result !== '') {
                        call.reject(function () {
                            if (callback)
                                callback.apply(self, [value, search]);
                        })
                    }
                }
            }
            // if (tool.blackListValid(value, mcm.blackList)) {
            //     call.resolve(value);
            // } else {
            //     //登录验证
            //     if (!mcm.cache) {
            //         console.warn('尚未挂载 mcm.cache 缓存组件,无法进行登录验证判断');
            //         call.resolve(value);
            //     } else if (mcm.cache.isLogin()) {
            //         call.resolve(value)
            //     } else {
            //         var result = mcm.cache.getLogin(function () {
            //             if (mcm.cache.isLogin()) {
            //                 call.resolve(value)
            //             } else {
            //                 call.reject(function () {
            //                     if (mcm.blackListCallback)
            //                         mcm.blackListCallback.apply(self, [value, search]);
            //                 });
            //             }
            //         });
            //         if (result !== '') {
            //             call.reject(function () {
            //                 if (mcm.blackListCallback)
            //                     mcm.blackListCallback.apply(self, [value, search]);
            //             });
            //         }
            //
            //     }
            // }
            return call.promise();
        },

        /**
         * @method
         * @param {String} url
         * @desc 通过url来获取页面的模板,并通过{@link renderer.make}来进行渲染
         * @returns {*} 当要请求的url不存在时,返回一个history.back事件
         * @example
         * when the url is not exist will return a history.back function
         */
        changeUrl: function (url) {
            if (!map[url]) {
                if (history.length == 1) {
                    return mcm.tool.browserInterceptor('home', '');
                } else {
                    return history.back();
                }
            }

            mcm.initialization = true;

            var pageArray = map[url].nexus ? map[url].nexus : [url];

            //判断整个组件的缓存
            var noCache = pageArray.some(function (element) {
                return mcm.page[element] == undefined || mcm.page[element] == 'loading';
            });

            //存在页面缓存时,直接渲染
            if (!noCache)
                return render.make(url);

            var i;
            for (i = 0; i < pageArray.length; i++) {
                if (!mcm.page[pageArray[i]]) {
                    console.log('加载: ' + pageArray[i]);
                    mcm.page[pageArray[i]] = 'loading';
                    (function (target) {
                        if (mcm.config.LocalMode == 0 && app[map[target].address]) {
                            // 加载记录器
                            if (mcm.load)
                                mcm.load.addFile(true);

                            mcm.page[target] = app[map[target].address];
                            if (mcm.load)
                                mcm.load.loadedFile(true);
                            self.changeUrl(url);
                        } else if (mcm.config.LocalMode == 1 && document.domain != mcm.config.LocalUrl && document.domain.indexOf(mcm.config.LocalIp) == -1 && app[map[target].address]) {
                            // 加载记录器
                            if (mcm.load)
                                mcm.load.addFile(true);

                            mcm.page[target] = app[map[target].address];
                            if (mcm.load)
                                mcm.load.loadedFile(true);
                            self.changeUrl(url);
                        } else {
                            //加载记录器
                            if (mcm.load)
                                mcm.load.addFile(true);
                            $.ajax({
                                url: map[target].address,
                                type: 'GET',
                                success: function (data) {
                                    //加载记录器
                                    if (mcm.load)
                                        mcm.load.loadedFile(true);
                                    mcm.page[target] = data;
                                    self.changeUrl(url);
                                }
                            })
                        }
                    })(pageArray[i]);
                }
            }
        }
        ,

        /**
         * @method
         * @desc 在不改变hash的情况下，使用一个url来弹出一个界面,该url不允许使用关系链,若页面没有缓存时将会加载页面缓存再渲染页面
         * <br>
         * render a page with a url without changing the hash,the url not allow has a nexus,the page will ajax cache before render
         * @param {string} url 弹窗的路由地址
         * @param {object} [eventData] 携带的数据
         * @example
         * ...
         * mcm.route.popUp('login')
         * can popUp a login page
         * ...
         * @example
         * ...
         * mcm.route.popUp('login',{account:'111222',pass:'1122'})
         * can popUp a login page with some data
         * ...
         */
        popUp: function (url, eventData) {

            if (!eventData)
                eventData = null;

            var pageArray = map[url].nexus ? map[url].nexus : [url];

            //判断整个组件的缓存
            var noCache = pageArray.some(function (element) {
                return mcm.page[element] == undefined || mcm.page[element] == 'loading';
            });

            //存在页面缓存时,直接渲染
            if (!noCache)
                return render.update(url, eventData);

            var i;
            for (i = 0; i < pageArray.length; i++) {
                if (!mcm.page[pageArray[i]]) {
                    console.log('加载: ' + pageArray[i]);
                    mcm.page[pageArray[i]] = 'loading';
                    (function (target) {
                        if (mcm.config.LocalMode == 0 && app[map[target].address]) {
                            // 加载记录器
                            if (mcm.load)
                                mcm.load.addFile(true);
                            mcm.page[target] = app[map[target].address];
                            if (mcm.load)
                                mcm.load.loadedFile(true);
                            self.popUp(url, eventData);
                        } else if (mcm.config.LocalMode == 1 && document.domain != mcm.config.LocalUrl && document.domain.indexOf(mcm.config.LocalIp) == -1 && app[map[target].address]) {
                            // 加载记录器
                            if (mcm.load)
                                mcm.load.addFile(true);
                            mcm.page[target] = app[map[target].address];
                            if (mcm.load)
                                mcm.load.loadedFile(true);
                            self.popUp(url, eventData);
                        } else {
                            //加载记录器
                            if (mcm.load)
                                mcm.load.addFile(true);
                            $.ajax({
                                url: map[target].address,
                                type: 'GET',
                                success: function (data) {
                                    //加载记录器
                                    if (mcm.load)
                                        mcm.load.loadedFile(true);
                                    mcm.page[target] = data;
                                    self.popUp(url, eventData);
                                }
                            })
                        }
                    })(pageArray[i]);
                }
            }
        }
    };

    /**
     * 黑名单轮询
     */
    function blackListLoop(list) {
        var target = mcm.blackList;
        if (mcm.blackList.length > 0 && mcm.blackList[0] instanceof Array) {
            for (var i = 0, len = mcm.blackList.length; i < len; i++) {
                if (list instanceof Array) {
                    if (Array.intersect(list, mcm.blackList[i]).length != 0) {
                        return i;
                    }
                } else {
                    if (mcm.blackList[i].contains(list))
                        return i;
                }
            }
            return true;
        } else {
            if (list instanceof Array)
                return Array.intersect(list, target).length == 0;
            else
                return !mcm.blackList.contains(list)
        }
    }

    return self;
});