//_layer模块
define(function () {
    var Float = function (pack) {

        //构成弹出层
        var $inputBox = $(pack['content']);

        var uid = '#' + pack.id;

        var _wakeUp_layer = function () {

            $('body').prepend($inputBox);
            //弹出层动画
            setTimeout(function () {
                $(uid).addClass('floatUp');
            }, 100)
        };
        //添加弹出层
        _wakeUp_layer();

        //事件绑定
        var time = pack.clock || 5;
        //定时器
        var timer;
        var inClose = false;

        timer = setInterval(function () {
            if (time === 0) {
                clearInterval(timer);
                inClose = true;
                $(uid).removeClass('floatUp');
                setTimeout(function () {
                    if (pack['cancel']['event'])
                        pack['cancel']['event']();
                    $inputBox.remove();
                }, 1000);

            } else {
                time--;
            }
        }, 1000);


        $('#' + pack['cancel']['id']).on('click', function () {
            if (inClose)
                return;

            inClose = true;
            if (timer)
                clearInterval(timer);
            $(uid).removeClass('floatUp');
            setTimeout(function () {
                if (pack['cancel']['event'])
                    pack['cancel']['event']();
                //关闭界面
                $inputBox.remove();
            }, 1000);


        });

    };

    return Float;
});