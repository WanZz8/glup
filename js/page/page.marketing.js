/**   2017/10/30   by alen   **/
define(['page', 'cookie'], function (page, cookie) {
    var self = new page('fk');

    self.onEnter = function () {
        //保存推荐人标识到本地
        var k = mcm.tool.getSearch();
        if (!!k.ru){
            cookie('ru', k.ru);
            mcm.net.send({
                url: '/api',
                type: 'GET',
                data: {
                    ru: k.ru || ''
                }
            }, true)
        }


        //点击大banner跳转到注册页面
        $('.reg').on('click', function () {
            mcm.tool.browserInterceptor('register')
        })
    };

    return self;
});