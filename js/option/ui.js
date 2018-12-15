//模块名
var mcm = mcm || {};
define(['template'], function (template) {

    /**
     * @description 弹窗中心
     * @constructor
     */
    function AlertManager() {
        this.alert = null;
        this.floatList = [];
        this.floatSwitch = false;
    }

    var alertProto = AlertManager.prototype;

    /**
     * @method
     * @param {String} tip 弹窗的标签,用于制止相同来源的弹窗重复出现
     * @param {String} content 弹窗的内容
     * @param {String} type 弹窗的类型
     * @param {Object} btn 弹窗的按钮对象 例:[{name:'确定',then:function}]
     * @param {Object||Number} [clock] 定时关闭,单位是秒 或 参数对象 (向下兼容传定时关闭时间)
     * @author 2016/9/29 by Wilde.Chen
     */
    alertProto.sp = function (tip, content, type, btn, clock) {
        if (!tip)
            return console.warn('弹窗分类错误');
        if (!content)
            return console.warn('请输入弹窗内容');
        if (!type)
            return console.warn('弹窗类型错误');

        var self = this;

        if (self.alert === tip)
            return;

        self.alert = tip;
        var options = {};
        if (typeof clock === 'number') {
            options.clock = clock;
        } else {
            options = clock;
        }

        switch (type) {
            case 'normal':
                self.layer(type, content, btn, options);
                break;
            case 'alert':
                self.layer(type, content, btn, options);
                break;
            case 'sim':
                self.layer(type, content, btn, options);
                break;
            case 'warn':
                self.layer(type, content, btn, options);
                break;
            default:
                console.warn('%s 弹窗类型不存在', type);
        }
    };

    alertProto.layer = function (image, content, btn, options) {
        var self = this;


        btn = btn.map(function (e) {
            e.id = (Math.random() * 10000).toFixed(0);
            e.event = function () {
                e.then && e.then();
                self.alert = null;
            };
            return e
        });
        var cancel = (Math.random() * 10000).toFixed(0);
        var eventId = (Math.random() * 10000).toFixed();
        var model = template.compile(mcm.page['ui-normal'])({
            image:image,
            cancel: cancel,
            eventId:eventId,
            content:content,
            btn:btn
        });

        require(['_layer'], function (layer) {
            layer({
                eventId: eventId,
                content: model,
                btn: btn,
                cancel: {
                    id: 'btn-layer-cancel' + cancel,
                    event: function () {
                        self.alert = null;
                    }
                },
                clock: options && options.clock
            })
        })
    };


    //错误弹窗
    // alertProto.alertLayer = function (content, btn, options) {
    //     var self = this;
    //
    //     var model = mcm.page['ui-alert'];
    //     var match = model.match(/%btn%(.*)?%btn%/);
    //     var txt = match[1];
    //     var _btn = '';
    //     var eventId = 'event' + (Math.random() * 10000).toFixed();
    //     //todo 为显示层增加事件ID
    //     model = model.replace('%layer%', 'layer-' + eventId);
    //     //todo 替换显示文本
    //     model = model.replace('%content%', content);
    //     var cancel = (Math.random() * 10000).toFixed(0);
    //     model = model.replace('%cancel%', 'btn-layer-cancel' + cancel);
    //     //替换按钮
    //     if (!!btn) {
    //         for (var i = 0, len = btn.length; i < len; i++) {
    //             (function (x) {
    //                 var t = txt.replace('%name%', btn[x].name);
    //                 var id = (Math.random() * 10000).toFixed(0);
    //                 t = t.replace('%uid%', 'btn-layer' + id);
    //                 btn[x].id = 'btn-layer' + id;
    //                 btn[x].event = function () {
    //                     if (btn[x].then)
    //                         btn[x].then();
    //                     self.alert = null;
    //                 };
    //                 _btn += t;
    //             })(i)
    //         }
    //     }
    //     model = model.replace(match[0], _btn);
    //
    //     require(['_layer'], function (layer) {
    //         layer({
    //             eventId: eventId,
    //             content: model,
    //             btn: btn,
    //             cancel: {
    //                 id: 'btn-layer-cancel' + cancel,
    //                 event: function () {
    //                     self.alert = null;
    //                 }
    //             },
    //             clock: options && options.clock
    //         })
    //     })
    // };
    //
    // //通用弹窗
    // alertProto.normalLayer = function (content, btn, options) {
    //     var self = this;
    //
    //     var model = mcm.page['ui-normal'];
    //     var match = model.match(/%btn%(.*)?%btn%/);
    //     var txt = match[1];
    //     var _btn = '';
    //     var eventId = 'event' + (Math.random() * 10000).toFixed();
    //     //todo 为显示层增加事件ID
    //     model = model.replace('%layer%', 'layer-' + eventId);
    //     //todo 替换显示文本
    //     model = model.replace('%content%', content);
    //     var cancel = (Math.random() * 10000).toFixed(0);
    //     model = model.replace('%cancel%', 'btn-layer-cancel' + cancel);
    //     //替换按钮
    //     if (!!btn) {
    //         for (var i = 0, len = btn.length; i < len; i++) {
    //             (function (x) {
    //                 var t = txt.replace('%name%', btn[x].name);
    //                 var id = (Math.random() * 10000).toFixed(0);
    //                 t = t.replace('%uid%', 'btn-layer' + id);
    //                 btn[x].id = 'btn-layer' + id;
    //                 btn[x].event = function () {
    //                     if (btn[x].then)
    //                         btn[x].then();
    //                     self.alert = null;
    //                 };
    //                 _btn += t;
    //             })(i)
    //         }
    //     }
    //     model = model.replace(match[0], _btn);
    //
    //     require(['_layer'], function (layer) {
    //         layer({
    //             eventId: eventId,
    //             content: model,
    //             btn: btn,
    //             cancel: {
    //                 id: 'btn-layer-cancel' + cancel,
    //                 event: function () {
    //                     self.alert = null;
    //                 }
    //             },
    //             clock: options && options.clock
    //         })
    //     })
    // };
    //
    // //错误弹窗
    // alertProto.customLayer = function (content, btn, options) {
    //     var self = this;
    //
    //     var model = mcm.page['ui-alert'];
    //     if(options && options.img){
    //         var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    //         var img = model.match(srcReg);
    //         model = model.replace(img[1],options.img);
    //     }
    //     var match = model.match(/%btn%(.*)?%btn%/);
    //     var txt = match[1];
    //     var _btn = '';
    //     var eventId = 'event' + (Math.random() * 10000).toFixed();
    //     //todo 为显示层增加事件ID
    //     model = model.replace('%layer%', 'layer-' + eventId);
    //     //todo 替换显示文本
    //     model = model.replace('%content%', content);
    //     var cancel = (Math.random() * 10000).toFixed(0);
    //     model = model.replace('%cancel%', 'btn-layer-cancel' + cancel);
    //     //替换按钮
    //     if (btn != undefined) {
    //         for (var i = 0, len = btn.length; i < len; i++) {
    //             (function (x) {
    //                 var t = txt.replace('%name%', btn[x].name);
    //                 var id = (Math.random() * 10000).toFixed(0);
    //                 t = t.replace('%uid%', 'btn-layer' + id);
    //                 btn[x].id = 'btn-layer' + id;
    //                 btn[x].event = function () {
    //                     if (btn[x].then)
    //                         btn[x].then();
    //                     self.alert = null;
    //                 };
    //                 _btn += t;
    //             })(i)
    //         }
    //     }
    //     model = model.replace(match[0], _btn);
    //
    //     require(['_layer'], function (layer) {
    //         layer({
    //             eventId: eventId,
    //             content: model,
    //             btn: btn,
    //             cancel: {
    //                 id: 'btn-layer-cancel' + cancel,
    //                 event: function () {
    //                     self.alert = null;
    //                 }
    //             },
    //             clock: options && options.clock
    //         })
    //     })
    // };

    // //浮动提示中心
    // alertProto.ft = function (content, time) {
    //     this.floatList.push([content, time]);
    //     this.ftShow();
    // };
    //
    // //浮动提示调用
    // alertProto.ftShow = function () {
    //     if (this.floatList.length === 0)
    //         return;
    //
    //     if (!this.floatSwitch) {
    //         var obj = this.floatList.shift();
    //         var self = this;
    //
    //         self.floatSwitch = true;
    //         var model = mcm.page['floatUp_normal'];
    //         //替换显示文本
    //         model = model.replace('%content%', obj[0]);
    //         var cancel = (Math.random() * 10000).toFixed(0);
    //         model = model.replace('%cancel%', 'btn-layer-cancel' + cancel);
    //         model = model.replace('%float%', 'floatUp' + cancel);
    //
    //         require(['_float'], function (float) {
    //             float({
    //                 content: model,
    //                 id: 'floatUp' + cancel,
    //                 cancel: {
    //                     id: 'btn-layer-cancel' + cancel,
    //                     event: function () {
    //                         self.ftEnd();
    //                     }
    //                 },
    //                 clock: obj[1]
    //             })
    //         })
    //     }
    // };
    //
    // //浮动结束
    // alertProto.ftEnd = function () {
    //     var self = this;
    //     self.floatSwitch = false;
    //     self.ftShow();
    // };

    return {alert: AlertManager};
});