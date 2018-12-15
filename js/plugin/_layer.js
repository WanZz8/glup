//_layer模块
define(function () {
    var Layer = function (pack) {

        //构成弹出层
        var $inputBox = $(pack['content']);

        var _wakeUp_layer = function () {

            $('body').append($inputBox);
            //弹出层动画
            setTimeout(function () {
                $('#layer-' + pack.eventId).addClass('show');
            }, 100)
        };
        //添加弹出层
        _wakeUp_layer();

        //事件绑定
        var time = pack.clock || 5;
        //定时器
        var timer;

        if (pack.btn != undefined) {
            for (var i = 0, len = pack.btn.length; i < len; i++) {
                (function (x) {
                    var event = pack.btn[x];
                    $('#btn-layer' + event['id']).on('click', function () {
                        if (event['event'])
                            event['event']();
                        //关闭界面
                        $('#layer-' + pack.eventId).removeClass('show');
                        setTimeout(function () {
                            $inputBox.remove();
                        }, 300);
                        if (timer)
                            clearInterval(timer);
                    })
                })(i)
            }
            if (pack.clock && pack.clock > 0) {
                timer = setInterval(function () {
                    if (time === 0) {
                        clearInterval(timer);
                        if (pack['cancel']['event'])
                            pack['cancel']['event']();
                        $('#layer-' + pack.eventId).removeClass('show');
                        setTimeout(function () {
                            $inputBox.remove();
                        }, 300);
                    } else {
                        time--;
                    }
                }, 1000);
            }
        } else if (pack.btn == undefined || pack.clock && pack.clock > 0) {
            timer = setInterval(function () {
                if (time === 0) {
                    if (pack['cancel']['event'])
                        pack['cancel']['event']();
                    $('#layer-' + pack.eventId).removeClass('show');
                    setTimeout(function () {
                        $inputBox.remove();
                    }, 300);
                } else {
                    time--;
                }
            }, 1000);
        }


        $('#' + pack['cancel']['id']).on('click', function () {
            if (pack['cancel']['event'])
                pack['cancel']['event']();
            //关闭界面
            $('#layer-' + pack.eventId).removeClass('show');
            setTimeout(function () {
                $inputBox.remove();
            }, 300);
            if (timer)
                clearInterval(timer);
        });

    };

    return Layer;
});