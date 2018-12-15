/**
 * Created by wildeChen on 2016/11/21.
 */
define(['engine', 'template', 'config', 'tool', 'app'], function (mcm, template, config, tool, app) {
    /**
     * Creates a new Page
     * @description 创建一个页面对象
     * @constructor page
     * @param {String} url
     */
    var self = function (url) {

        this.exit = null;
        /**
         * @name page#url
         * @description 存储当前页面的url
         * @type {String}
         */
        this.url = url;

        /**
         * @private
         * @description 存储当前渲染父对象的ID
         * @type {String}
         */
        this._parentId = config[this.url] && config[this.url].renderer || null;

        /**
         * @private
         * @description 存储当前界面渲染父对象以原生DOM的形式
         * @type {HTMLElement}
         */
        this._parentNode = null;

        /**
         * @name page#parentNode
         * @description 存储当前界面渲染的父对象
         * @type {*|jQuery}
         */
        this.parentNode = null;

        /**
         * @name page#model
         * @description 存储当前页面的原始模板
         * @type {string}
         */
        this.model = mcm.page[url];

        /**
         * @name page#dom
         * @description 保存当前页面渲染后的页面字符串
         * @type {string}
         */
        this.dom = '';

        /**
         * @name page#data
         * @description 用来保存所有预加载请求返回的数据
         * @type {object}
         */
        this.data = {};

        /**
         * @name page#cache
         * @description 用来保存当前页面需要缓存的所有数据值,在{@link page#onExit}的时候会被清空
         * @type {object}
         */
        this.cache = {};

        /**
         * @name page#param
         * @description 用来对当前页面的DOM节点的显示text进行数据绑定
         * @type {object}
         */
        this.param = {};

        /**
         * @name page#input
         * @description 用来对当前页面的input节点进行双向数据绑定
         * @type {object}
         */
        this.input = {};

        /**
         * @description 当前页面
         * @type {function}
         * @private
         */
        this._initStatus = function () {
            return mcm.cache != undefined ? mcm.cache.getStatus() : null
        };


        /**
         * @description 前置的request事件是否等待通知后延迟请求
         * @type {boolean}
         * @private
         */
        this._delay = false;

        /**
         * @延迟请求的超时事件
         * @type {function}
         * @private
         */
        this._delayBackUp = null;

        /**
         * 延迟请求的超时时间
         * @type {null || Number}
         * @private
         */
        this._delayTimeOut = null;

        /**
         * @description 延迟的前置request用的延迟对象
         * @type {null}
         * @private
         */
        this._delayObj = null;

        /**
         * @name page#_super
         * @description 定义一个_super来保存父类,通过_super访问父类的方法
         * @type {Object}
         */
        this._super = proto;
    };

    var proto = self.prototype;

    //todo 定义一个捕捉查询字符串的事件

    /**
     *
     * @method page#init
     * @this page
     * @description 对页面模板进行渲染,并存储在{@link this.dom}中
     * @example
     * override
     * self.init = function(){
     *   this.dom = 'new String'
     * }
     * @example
     * extend
     * self.init = function(){
     *  self._super.init.call(self)
     *  do something like self.dom = self.dom.replace('','')
     * }
     * @author 2016/11/22 by wildeChen
     */
    proto.init = function () {
        this._parentNode = document.getElementById(this._parentId);
        this.parentNode = $('#' + this._parentId);
        this.dom = template.compile(this.model)(this);
        this.exit = $.Deferred();
    };

    /**
     * @description 绑定带有data-element标记的Dom节点到this对象上.
     * <br>
     * bind the dom Node who have attr data-element to Object this.
     * @function page#bindDomNode
     * @example
     * &lt;div data-element = "submitNode" &gt;submit&lt;/div&gt;
     * ...
     * then
     * use like this.submitNode , you can access the dom Node
     *
     * @author 2016/12/14 by rickyJiang
     */
    proto.bindDomNode = function (node) {
        var self = this;
        node = node || this._parentNode;
        var tags = Array.apply(null, node.querySelectorAll('[data-element]')),
            tagName;

        tags.forEach(function (element) {
            tagName = element.getAttribute('data-element');
            self[tagName] = $(element);
        });
    };

    /**
     * @description 绑定带有data-event标记的Dom节点事件到this对象的函数上
     * <br>
     * bind the dom Node who have attr data-event on Event with the value
     * @function page#bindEvents
     * @example
     * &lt;div data-event = "click:onClick;change:input" /div&gt;
     * ...
     * will work as below
     * dom.addEventListener('click',onClick.bind(self))
     * dom.addEventListener('change',input.bind(self))
     * etc
     * if there has attribute name data-bind
     * will work as below
     * dom.addEventListener('change',input.bind(self,data-bind))
     * @author 2016/12/14 by rickyJiang
     */
    proto.bindEvents = function (node, options) {
        if (!options)
            options = {};

        var self = this;
        node = node || this._parentNode;
        var tags = Array.apply(null, node.querySelectorAll('[data-events]')),
            eventsGroup,
            eventName,
            fnName;

        if (options.dynamic && !options.refresh) {
            node.addEventListener('click', function (e) {
                var target = e.target;
                var cTarget = e.currentTarget;
                var bubble = true;
                while (bubble && target != cTarget) {
                    var event = target.getAttribute('data-events');
                    if (event !== null) {
                        var start = event.indexOf('click');
                        if (start !== -1) {
                            var end = event.indexOf(';', start);
                            var call = event.slice(start, end);
                            call = call.split(':');
                            var bind = target.getAttribute('data-bind');
                            if (bind) {
                                self[call[1]].call(self, bind, target);
                            } else {
                                self[call[1]].call(self, target);
                            }
                            return bubble;
                        }
                    } else {
                        target = target.parentNode;
                    }
                }
            }, true);
        }

        tags.forEach(function (element) {
            eventsGroup = element.getAttribute('data-events').split(';');
            eventsGroup.forEach(function (event) {
                eventName = $.trim(event.split(':')[0]);
                fnName = $.trim(event.split(':')[1]);

                if (!eventName)
                    return;

                if ((options.dynamic || options.refresh) && eventName === 'click')
                    return;

                if (!self[fnName])
                    return console.dir(fnName + '方法不存在,请检查js代码', fnName);

                var bind = element.getAttribute('data-bind');
                if (bind) {
                    element.addEventListener(eventName, self[fnName].bind(self, bind));
                } else {
                    element.addEventListener(eventName, self[fnName].bind(self));
                }
            })
        });

        //todo 实现原生标签拦截
        var a = Array.apply(null, node.querySelectorAll('a'));
        a.forEach(function (element) {
            var pop = element.getAttribute('pop');
            if (pop) {
                var t, url, search;
                if (pop.indexOf(':') !== -1) {
                    t = pop.split(';');
                    url = t[0];
                    search = t[1];
                } else {
                    url = pop;
                    search = pop;
                }
                element.addEventListener('click', function (e) {
                    e.preventDefault();
                    mcm.route.popUp(url, search);
                    return false;
                })
            }

            var key = element.getAttribute('key');
            if (key) {
                element.addEventListener('click', function (e) {
                    e.preventDefault();
                    var url = location.hash.replace('#', '');
                    url = url.split('?')[0];
                    location.hash = '#%s?%s'.splice(url, key);
                    return false;
                })
            }
        })
    };

    /**
     * @description 绑定view事件
     * 绑定 self.param中的参数到v-param标签上
     * 绑定 self.input中的参数到v-input标签上,并反馈v-input的输入值到self.input中
     * @function page#bindView
     * @example
     * self.param.login = '登录';
     * v-param="login"
     * then <div v-param="login">登录</div>
     * @author 2017/03/20 by Wilde
     */
    proto.bindView = function () {
        var self = this;
        if (this.param || typeof this.param === 'object') {
            Object.keys(this.param).forEach(function (key) {
                bindViewParam(self.param, key, self.param[key], self._parentNode);
            })
        }

        if (this.input || typeof this.input === 'object') {
            Object.keys(this.input).forEach(function (key) {
                bindViewInput(self.input, key, self.input[key], self._parentNode);
            })
        }

        this.spreadView();
    };

    /**
     * @description 强制推送view参数至视图
     * @function page#spreadView
     */
    proto.spreadView = function () {
        var self = this;
        if (this.param || typeof this.param === 'object') {
            Object.keys(this.param).forEach(function (key) {
                if (self.param[key] != null) {
                    var list = self._parentNode.querySelectorAll('[v-param=' + key + ']');
                    Array.apply(null, list).forEach(function (element) {
                        element.innerHTML = self.param[key];
                    });
                }
            })
        }

        if (this.input || typeof this.input === 'object') {
            Object.keys(this.input).forEach(function (key) {
                if (self.input[key] != null) {
                    var list = self._parentNode.querySelectorAll('[v-input=' + key + ']');
                    Array.apply(null, list).forEach(function (element) {
                        element.value = self.input[key];
                    });
                }
            })
        }
    };

    /**
     * @description 重置view下双向绑定的数据
     * @param {Array||String} [attributes] 传入key或者key的数组
     * @param {Array||String||Number} [value] 传入每个key对应要重置的值,或者将所有key重置成同一个值,若不传则默认重置为null
     */
    proto.resetView = function (attributes, value) {
        var self = this;
        var list = ['input', 'param'];
        if (arguments.length === 0) {
            Object.keys(self.input).forEach(function (key) {
                self.input[key] = null;
            });
            Object.keys(self.param).forEach(function (key) {
                self.param[key] = null;
            });
        } else {
            if (attributes instanceof Array === true) {
                attributes.forEach(function (attribute, index) {
                    if (list.contains(attribute))
                        Object.keys(self[attribute]).forEach(function (key) {
                            self[attribute][key] = value instanceof Array === true ? value[index] : value || null;
                        })
                })
            } else if (typeof attributes === 'string') {
                if (list.contains(attributes))
                    Object.keys(self[attributes]).forEach(function (key) {
                        self[attributes][key] = typeof value === 'string' || 'Number' ? value : null;
                    });
            } else {
                console.error('传入参数类型错误')
            }
        }
    };

    function bindViewInput(data, key, val, node) {
        var list = node.querySelectorAll('[v-input=' + key + ']');
        var nodeList = Array.apply(null, list);

        Object.defineProperty(data, key, {
            enumerable: true, //可枚举
            get: function () {
                return val;
            },
            set: function (value) {
                if (value === val)
                    return;
                val = value;
                nodeList.forEach(function (element) {
                    if (element.value != val)
                        element.value = val;
                });
            }
        });
        nodeList.forEach(function (element) {
            element.addEventListener('input', spread);
            element.addEventListener('blur', fixed);
        });

        function fixed(e) {
            let value = e.target.value;
            const max = e.target.getAttribute('v-max');
            const min = e.target.getAttribute('v-min');
            if ((max || min) && (!isNaN(Number(max)) || !isNaN(Number(min)))) {
                value = Number(value);
                if (val !== value && (min === null || value >= min) && (max === null || value <= max)) {
                    val = value;
                } else if (min !== null && value < min) {
                    val = min;
                } else if (max !== null && value > max) {
                    val = max;
                }
            }
            nodeList.forEach(function (element) {
                if (element.value != val)
                    element.value = val;
            })
        }

        function spread(e) {
            let value = e.target.value;
            if (val !== value) {
                val = value;
            }
            nodeList.forEach(function (element) {
                if (element.value != val)
                    element.value = val;
            })
        }
    }

    function bindViewParam(data, key, val, node) {
        Object.defineProperty(data, key, {
            enumerable: true, //可枚举
            get: function () {
                return val;
            },
            set: function (value) {
                if (value === val)
                    return;
                val = value;
                var list = node.querySelectorAll('[v-param=' + key + ']');
                Array.apply(null, list).forEach(function (element) {
                    element.innerHTML = value;
                });
            }
        })
    }

    /**
     * @description 插入代码到节点
     * @deprecated since now you could use {@link page.append} instead
     * @method page#appendTemplate
     * @param  {String} template [html模板字符串]
     * @param  {String} node [插入的dom节点]
     * @param  {Boolean} [append] [是否执行插入或者覆盖文本]
     */
    proto.appendTemplate = function (template, node, append) {
        tool.mergeContextTemplate(this, template, node, append);
    };

    proto._append = function (template, node, callback) {
        this._compile(template, node, {
            append: true
        }, callback)
    };

    proto._replace = function (template, node, callback) {
        this._compile(template, node, {}, callback)
    };

    proto._dynamicInit = function (template, node, callback) {
        this._compile(template, node, {
            dynamic: true
        }, callback)
    };

    proto._dynamicUpdate = function (template, node, append, callback) {
        this._compile(template, node, {
            dynamic: true,
            refresh: true,
            append: !!append
        }, callback)
    };

    proto._compile = function (template, node, options, callback) {
        if (!node)
            return;

        if (!options)
            options = {};

        template = template.replace(/[\r\n]/g, '');
        var nodeList;

        if (node.indexOf('.') !== -1) {
            nodeList = document.getElementsByClassName(node.substring(1));
            nodeList = Array.apply(null, nodeList);
        } else if (node.indexOf('#') !== -1) {
            nodeList = document.getElementById(node.substring(1));
            nodeList = [nodeList];
        } else {
            nodeList = document.getElementsByTagName(node);
            nodeList = Array.apply(null, nodeList);
        }

        if (!nodeList)
            return console.dir('无法获取模板要插入的节点 %s', node);

        nodeList.forEach(function (element) {
            if (!element)
                return;

            if (options.append) {
                var newNode = document.createElement('div');
                newNode.innerHTML = template;
                var n = newNode.childNodes[0];
                if (n !== undefined)
                    element.appendChild(n);
            } else {
                element.innerHTML = template;
            }
            this.bindDomNode(element);
            this.bindEvents(element, options);
            this.bindView()
        }.bind(this));
        if (callback)
            callback.resolve();
    };

    /**
     * @function 从request函数中获取预先请求的数据队列，完成每个请求后插入到当前对象的data属性中
     * @method page#insertRequestData
     * @description 从request函数中获取预先请求的数据队列，完成每个请求后插入到当前对象的data属性中
     *
     * @author 2016/12/08 by rickyJiang
     * @return {Object} 返回Deferred异步回调
     */
    proto.insertRequestData = function () {
        var self = this;
        var requestQueue = this.request ? this.request() : false,
            dtd = $.Deferred(),
            count = 0,
            name;

        if (requestQueue) {

            requestQueue = requestQueue instanceof Array ? requestQueue : [requestQueue];
            if (!this._delay || (this._delay && (this._initStatus != null && !this._initStatus()))) {
                for (var i = 0; i < requestQueue.length; i++) {
                    name = requestQueue[i].app;
                    delete requestQueue[i].app;

                    mcm.net.send(requestQueue[i])
                        .then(function (key, result) {
                            this.data[key] = result;
                            count += 1;
                            if (count == requestQueue.length) dtd.resolve();
                        }.bind(this, name)).fail(function () {
                        dtd.reject();
                    });
                }
            } else {
                if (this._initStatus != null) {
                    if (mcm.schedule) {
                        this._delayObj = dtd;
                        this._delayBackUp = setTimeout(function () {
                            mcm.schedule.removeEventListener('loginDelay', self);
                            dtd.reject();
                        }, this._delayTimeOut || mcm.timeout || 5000);
                        mcm.schedule.addEventListener('loginDelay', this.delayRequestData, this);
                    } else {
                        console.warn('未挂载延迟加载所需的 mcm.schedule 组件');
                        dtd.reject();
                    }
                } else {
                    console.warn('未设置延迟加载所需的 _initStatus 方法');
                    dtd.reject();
                }
            }

        } else if (this._delay) {
            if (this._initStatus != null) {
                if (!this._initStatus()) {
                    dtd.resolve();
                } else {
                    if (mcm.schedule) {
                        this._delayObj = dtd;
                        this._delayBackUp = setTimeout(function () {
                            mcm.schedule.removeEventListener('loadingDelay', self);
                            dtd.reject();
                        }, this._delayTimeOut || mcm.timeout || 5000);
                        mcm.schedule.addEventListener('loadingDelay', this.delayLoading, this);
                    } else {
                        console.warn('未挂载延迟加载所需的 mcm.schedule 组件');
                        dtd.reject()
                    }
                }
            } else {
                console.warn('未设置延迟加载所需的 _initStatus 方法');
                dtd.reject()
            }

        } else {
            dtd.resolve();
        }

        return dtd.promise();
    };

    /**
     * 页面等待公共数据的延迟加载事件
     */
    proto.delayLoading = function () {
        clearTimeout(this._delayBackUp);
        mcm.schedule.removeEventListener('loadingDelay', this);
        if (!this._initStatus()) {
            this._delayObj.resolve();
        } else {
            console.error('%s 延迟处理出错', self.url);
        }
    };

    /**
     * @function 延迟处理的页面预加载事件,会等待用户数据都初始化完成再渲染页面
     * @method page#delayRequestData
     * @author 2017/04/24 by WildeChen
     */
    proto.delayRequestData = function () {
        clearTimeout(this._delayBackUp);
        mcm.schedule.removeEventListener('loginDelay', this);
        var self = this;
        if (!this._initStatus()) {
            var requestQueue = this.request(),
                count = 0,
                name;

            requestQueue = requestQueue instanceof Array ? requestQueue : [requestQueue];
            for (var i = 0; i < requestQueue.length; i++) {
                name = requestQueue[i].app;
                delete  requestQueue[i].app;

                mcm.net.send(requestQueue[i])
                    .then(function (key, result) {
                        this.data[key] = result;
                        count += 1;
                        if (count == requestQueue.length) this._delayObj.resolve();
                    }.bind(this, name)).fail(function () {
                    self._delayObj.reject();
                })
            }
        } else {
            console.error('%s 延迟处理出错', self.url);
        }
    };

    /**
     * @function
     * @method page#request
     * @description 预加载方法,返回一个false,通信协议对象或通信协议对象数组
     * <br>
     *
     * @returns {boolean|object|Array} 无预加载时返回false|单个预加载返回一个对象|多个时返回对象数组
     * @example
     * ...
     * if it has not preload event, then you can
     *
     * return false
     *
     * or not do anything
     *
     * @example
     * ...
     * if it have a preload event ,then you can
     *
     * return {
     *  service:'what',
     *  functionName:'what',
     *  data:null
     * }
     * is up to agreement
     *
     * @example
     * ...
     * if it have multiple preload events, then you can
     *
     * return [
     *  {
     *      service:'what',
     *      functionName:'what',
     *      data:null
     *  },
     *  {
     *      service:'what',
     *      functionName:'what',
     *      data:null
     *  }
     * ]
     * as a Array
     */
    proto.request = function () {
        return false;
    };

    /**
     * @method page#onEnter
     * @description 当渲染到浏览器中后,执行的方法,该方法晚于绑定事件执行
     * <br> when the page renderer in to the browser, then will do this method
     * <br> this method will work after {@link page.bindDomNode} and {@link page.bindEvents}
     */
    proto.onEnter = function () {

    };

    /**
     * @method page#onExit
     * @description 当页面从浏览器中移除前,执行的方法
     * <br> when the page will move out of the browser, then will do this method
     * <br> the default method will set this.data
     * @example
     * below is default work;
     * ...
     * this.exit.resolve();
     * this.reset();
     * ...
     * @example
     * if you want do something more than that,you need override like below
     * ...
     * do something like
     *
     * domNode.addClass('show');
     * setTimeout(function(){
     *  self.exit.resolve()
     *  self.reset()
     * },3000)
     *
     * ...
     */
    proto.onExit = function () {
        this.exit.resolve();
        this.reset();
    };

    /**
     * @method page#copy
     * @param fnName
     * @returns {*}
     */
    proto.copy = function (fnName) {
        return this._super[fnName].call(this);
    };

    /**
     * @method page#reset
     * @description 重置所有页面缓存数据
     * @author 2016/12/7 by wildeChen
     */
    proto.reset = function () {
        var self = this;
        if (this.cache) {
            Object.keys(this.cache).forEach(function (value) {
                self.cache[value] = null;
            });
        }

        this.data = {};
        $(this.parentNode).off();
        this.dom = '';
    };

    /**
     * @method page.childNode
     * @description 传入一个父节点名,传入一个子节点名,返回在父节点下的子节点dom对象
     * <br>
     * 子节点为 data-child
     * @param {dom} parent
     * @param {dom||Array} child
     * @returns {*|{}}
     */
    proto.childNode = function (parent, child) {
        if (typeof (child) === 'string') {
            return this[parent].find('[data-child=' + child + ']');
        } else {
            var node = {};
            for (var i = 0, len = child.length; i < len; i++) {
                var key = child[i];
                node[key] = this[parent].find('[data-child=' + key + ']');
            }
            return node;
        }
    };

    /**
     * @method page.formVerify
     * @description 传入一个表单对象,和表单验证对象,返回验证结果,返回空字符串为验证通过,否则返回错误信息
     * @param form
     * @param Verify
     * @example
     *  form = {
     *      name:DOM,
     *      password:DOM
     *  }
     *
     *  Verify:{
     *      name:'nameVerify-姓名',
     *      password:'passVerify-密码'
     *  }
     *
     *  then will work like below
     *  self.nameVerify(form.name,'姓名')
     *
     * @returns {string}
     */
    proto.formVerify = function (form, Verify) {
        if (!form)
            return '传入表单错误';
        var keys = Object.keys(form);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (!Verify[key])
                continue;
            var split = Verify[key].split('-');
            var result = this[split[0]](form[key], split[1]);
            if (result != '')
                return result;
        }
        return '';
    };

    /*
     |--------------------------------------------------------------------------
     |  2017/9/26   by Wilde
     |  新增页面刷新方法
     |  全局刷新  性能浪费
     |--------------------------------------------------------------------------
    */
    /**
     * @method
     * @description 重新渲染当前页面，不会触发预加载,进入以及退出事件
     * @author 2017/9/26 by wildeChen
     */
    proto.rebuild = function () {
        var url = this.url;
        var target = mcm.map[url];
        var temp = document.getElementById(target.renderer);
        var content;
        this.init();
        content = this.dom;
        temp.innerHTML = '';
        temp.innerHTML = content;
        // 绑定dom节点和事件映射
        this.bindDomNode();
        this.bindEvents();
        this.bindView();
    };

    /*
     |--------------------------------------------------------------------------
     | 指定模板局部更新的方法
     |--------------------------------------------------------------------------
    */
    proto.chunk = function (model, node, data, options) {
        if (!model)
            return console.error('未指定模板名');
        if (!config[model])
            return console.error('模板不存在');

        if (!node)
            return console.error('请传入要渲染的节点');

        let finish = $.Deferred();

        if (!data)
            options = false;

        if (typeof options === 'boolean') {
            options = {append: options, normal: true};
        }

        if (options === undefined)
            options = {};

        let next = $.Deferred();

        next.then(function () {

            if (!this.tempModel)
                this.tempModel = {};

            let html;
            if (this.tempModel[model])
                html = this.tempModel[model];
            else
                html = this.tempModel[model] = template.compile(mcm.page[model]);

            let context = html(data);
            if (options.normal) {
                if (options.append) {
                    this._append(context, node, finish)
                } else {
                    this._replace(context, node, finish)
                }
            } else {
                if (options.append) {
                    this._dynamicUpdate(context, node, true, finish)
                } else {
                    if (!options.refresh) {
                        this._dynamicInit(context, node, finish)
                    } else {
                        this._dynamicUpdate(context, node, false, finish)
                    }
                }
            }

        }.bind(this));

        if (!mcm.page[model]) {
            if (mcm.config.LocalMode === 0 && app[config[model].address]) {
                mcm.page[model] = app[config[model].address];
                next.resolve();
            } else if (config.LocalMode === 1 && document.domain !== mcm.config.LocalUrl && document.domain.indexOf(mcm.config.LocalIp) === -1 && app[config[model].address]) {
                mcm.page[model] = app[config[model].address];
                next.resolve();
            } else {
                $.ajax({
                    url: config[model].address,
                    type: 'GET',
                    success: function (data) {
                        mcm.page[model] = data;
                        next.resolve();
                    }
                })
            }
        } else {
            next.resolve();
        }

        return finish;
    };


    return self;
});