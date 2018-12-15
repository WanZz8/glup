/**
 * @namespace
 * @alias renderer
 */
define(['config'], function (config) {

    var map = config;

    var self = {

        /**
         * 等待队列
         */
        _dependentSequence:[],

        /**
         * @method
         * @param {String} url 对应{@link config}中的url
         * @desc 根据url渲染页面模板到指定位置
         * @author 2016/12/14 by wildeChen
         */
        make: function (url) {
            const pageArray = map[url].nexus ? map[url].nexus : [url];

            /**
             * 做一个交叉对比,将渲染的页面中未覆盖的组件从浏览器中移除掉
             *
             * @description 存在隐患 当depend的url不包含他的依赖对象的全部加载时,可能因交叉对比导致部分模块被移除
             */
            if (map[url].nexus) {
                const standard = pageArray.map(function (o) {
                    return map[o].renderer ? map[o].renderer : null
                });

                const clear = Array.minus(Object.keys(mcm.part), standard);
                clear.forEach(function (e) {
                    let target = mcm.part[e] && map[mcm.part[e]].js || '';
                    if (!mcm.part[e])
                        return;
                    require([target], function (og) {
                        if (og && og.onExit) {
                            og.onExit();
                            $.when(og.exit.promise()).then(function () {
                                og.exit = null;
                                var target = document.getElementById(e);
                                if (target)
                                    target.innerHTML = '';
                                mcm.part[e] = null;
                            })
                        } else {
                            var target = document.getElementById(e);
                            if (target)
                                target.innerHTML = '';
                            mcm.part[e] = null;
                        }
                    })
                })
            }

            //渲染页面及其组件
            pageArray.forEach(function (element) {
                if (mcm.part[map[element].renderer] === element)
                    return;

                //用来处理在关系链中加载的附加组件,不对其进行渲染
                if (!map[element].renderer)
                    return;

                var target = map[element];

                // var temp = $('#' + target.renderer);
                var temp = document.getElementById(target.renderer);

                if(target.depend !== undefined){
                    var arr = typeof target.depend === 'string' ? [target.depend] : target.depend;
                    var team = arr.map(function (e) {
                        return mcm.part[map[e].renderer];
                    });
                    team = Array.intersect(team,arr);
                    if(team.length === 0){
                        self._queueIntoDependentSequence(element,'make',arr);
                        return;
                    }
                }
                // if (target.depend && mcm.part[map[target.depend].renderer] != target.depend) {
                //     self._queueIntoDependentSequence(element,'make',target.depend);
                //     return;
                // }

                var origin = mcm.part[target.renderer];
                if (origin) {
                    origin = map[origin].js;
                } else {
                    origin = '';
                }

                var content;
                //判断是否需要模板引擎渲染
                if (target.js) {

                    require([target.js, origin], function (ctr, og) {
                        ctr.insertRequestData().then(function () {
                            if (og && og.onExit) {
                                og.onExit();
                                $.when(og.exit.promise()).then(function () {
                                    og.exit = null;

                                    ctr.init();
                                    content = ctr.dom;

                                    temp.innerHTML = '';
                                    temp.innerHTML = content;

                                    // 绑定dom节点和事件映射
                                    ctr.bindDomNode();
                                    ctr.bindEvents();
                                    ctr.bindView();

                                    if (ctr.bind)
                                        ctr.bind();

                                    ctr.onEnter();
                                    //注销页面委托
                                    mcm.part[target.renderer] = element;
                                    self._awakeDependentSequence(element);
                                })
                            } else {
                                ctr.init();
                                content = ctr.dom;

                                temp.innerHTML = '';
                                temp.innerHTML = content;

                                // 绑定dom节点和事件映射
                                ctr.bindDomNode();
                                ctr.bindEvents();
                                ctr.bindView();

                                if (ctr.bind)
                                    ctr.bind();

                                ctr.onEnter();
                                //注销页面委托
                                mcm.part[target.renderer] = element;
                                self._awakeDependentSequence(element);
                            }
                        }).fail(function () {
                            history.back();
                            //todo 执行加载超时或错误回调
                            if(mcm.timeoutCallback)
                                mcm.timeoutCallback();
                            //todo 抛出错误
                            console.error('%s 预加载请求失败',url)
                        });
                    });

                } else {
                    require([origin], function (og) {
                        if (og && og.onExit) {
                            og.onExit();
                            $.when(og.exit.promise()).then(function () {
                                og.exit = null;
                                content = mcm.page[element];
                                temp.innerHTML = '';
                                temp.innerHTML = content;
                                mcm.part[target.renderer] = element;
                                self._awakeDependentSequence(element);
                            })
                        } else {
                            content = mcm.page[element];
                            temp.innerHTML = '';
                            temp.innerHTML = content;
                            mcm.part[target.renderer] = element;
                            self._awakeDependentSequence(element);
                        }
                    });
                }
            });
        },

        /**
         * @method
         * @param {string} url 要渲染的页面的url
         * @param {object} [eventData] 要传递到对象的init中的参数
         */
        update: function (url, eventData) {
            // var pageArray = map[url].nexus ? map[url].nexus : [url];
            var pageArray = [url];
            
            if (!eventData)
                eventData = null;

            pageArray.forEach(function (element) {

                //限制重复渲染
                // if (mcm.part[map[element].renderer] == element)
                //     return;

                //用来处理在关系链中加载的附加组件,不对其进行渲染
                if (!map[element].renderer)
                    return;

                var target = map[element];

                var temp = document.getElementById(target.renderer);

                if(target.depend !== undefined){
                    var arr = typeof target.depend === 'string' ? [target.depend] : target.depend;
                    var team = arr.map(function (e) {
                        return mcm.part[map[e].renderer];
                    });
                    team = Array.intersect(team,arr);
                    if(team.length === 0){
                        self._queueIntoDependentSequence(element,'update',arr);
                        return;
                    }
                }
                // if (target.depend && mcm.part[map[target.depend].renderer] != target.depend) {
                //     self._queueIntoDependentSequence(element,'update',target.depend);
                //     return;
                // }

                var origin = mcm.part[target.renderer];
                if (origin) {
                    origin = map[origin].js;
                } else {
                    origin = '';
                }

                var content;
                //判断是否需要模板引擎渲染
                if (target.js) {

                    require([target.js, origin], function (ctr, og) {
                        ctr.insertRequestData().then(function () {
                            if (og && og.onExit) {
                                og.onExit();
                                $.when(og.exit.promise()).then(function () {
                                    og.exit = null;

                                    ctr.data['reference'] = eventData;
                                    ctr.init();
                                    content = ctr.dom;

                                    temp.innerHTML = '';
                                    temp.innerHTML = content;

                                    // 绑定dom节点和事件映射
                                    ctr.bindDomNode();
                                    ctr.bindEvents();
                                    ctr.bindView();

                                    if (ctr.bind)
                                        ctr.bind();

                                    ctr.onEnter();
                                    //注销页面委托
                                    mcm.part[target.renderer] = element;
                                    self._awakeDependentSequence(element);
                                })
                            } else {
                                ctr.data['reference'] = eventData;
                                ctr.init();
                                content = ctr.dom;

                                temp.innerHTML = '';
                                temp.innerHTML = content;

                                // 绑定dom节点和事件映射
                                ctr.bindDomNode();
                                ctr.bindEvents();
                                ctr.bindView();

                                if (ctr.bind)
                                    ctr.bind();

                                ctr.onEnter();
                                //注销页面委托
                                mcm.part[target.renderer] = element;
                                self._awakeDependentSequence(element);

                            }
                        }).fail(function () {
                            self.update_out(url);
                            //todo 执行加载超时或错误回调
                            if(mcm.timeoutCallback)
                                mcm.timeoutCallback();
                            //todo 抛出错误
                            console.error('%s 预加载请求失败',url)
                        });
                    });

                } else {
                    require([origin], function (og) {
                        if (og && og.onExit) {
                            og.onExit();
                            $.when(og.exit.promise()).then(function () {
                                og.exit = null;
                                content = mcm.page[element];
                                temp.innerHTML = '';
                                temp.innerHTML = content;
                                mcm.part[target.renderer] = element;
                                self._awakeDependentSequence(element);
                            })
                        } else {
                            content = mcm.page[element];
                            temp.innerHTML = '';
                            temp.innerHTML = content;
                            mcm.part[target.renderer] = element;
                            self._awakeDependentSequence(element);
                        }
                    });
                }
            });
        },

        /**
         * @description 在不退出页面的情况下 刷新页面,禁止使用该方法刷新一个包含子页面的页面
         * @param {object} obj 传入一个页面{@link page}对象
         */
        refresh:function (obj) {
            if(typeof obj !== 'object')
                return console.error('刷新页面传入参数错误');
            var url = obj.url;
            var target = map[url];
            var temp = document.getElementById(target.renderer);
            var content;
            obj.insertRequestData().then(function () {
                obj.init();
                content = obj.dom;

                temp.innerHTML = '';
                temp.innerHTML = content;

                // 绑定dom节点和事件映射
                obj.bindDomNode();
                obj.bindEvents();
                obj.bindView();

                if (obj.bind)
                    obj.bind();

                obj.onEnter();

            }).fail(function () {
                //todo 执行加载超时或错误回调
                if(mcm.timeoutCallback)
                    mcm.timeoutCallback();
                //todo 抛出错误
                console.error('%s 刷新加载失败',url)
            });
        },

        /**
         * @method
         * @param {string} url 要退出的界面url
         * @param {boolean} [all] 是否清除关系链
         */
        update_out: function (url, all) {
            var pageArray = all ? map[url].nexus ? map[url].nexus : [url] : [url];

            pageArray.forEach(function (element) {
                var target = map[element];
                var temp = document.getElementById(target.renderer);
                if (target.js) {
                    require([target.js], function (og) {
                        if (og.onExit) {
                            og.onExit();
                            $.when(og.exit.promise()).then(function () {
                                temp.innerHTML = '';
                                mcm.part[target.renderer] = null;
                            })
                        } else {
                            temp.innerHTML = '';
                            mcm.part[target.renderer] = null;
                        }
                    })
                } else {
                    temp.innerHTML = '';
                    mcm.part[target.renderer] = null;
                }
            });
        },

        /**
         *
         * @param {String} url 等待渲染的url
         * @param {String} fn 渲染执行的事件
         * @param {Array} depend 依赖的url
         * @private
         * @description 将由依赖url添加到等待唤醒队列
         */
        _queueIntoDependentSequence : function (url,fn,depend) {
            let self = this;
            depend.forEach(function (e) {
               if(!self._dependentSequence[e])
                   self._dependentSequence[e] = [];
                self._dependentSequence[e].push([url,fn]);
            });
        },

        /**
         *
         * @param target
         * @private
         */
        _awakeDependentSequence:function (target) {
            let self = this;
            if(this._dependentSequence[target]){
                let list = this._dependentSequence[target];
                let url,fn;
                list.forEach(function (array) {
                    url = array[0];
                    fn = array[1];
                    self[fn](url);
                });
                this._dependentSequence[target] = null;
            }
        }


    };

    return self;
});