/**   2017/10/11   by alen   **/
/**   2017/11/21   rewrite by Wilde   **/
define(['page'], function (page) {
    var self = new page('live-chat');

    self.init = function () {
        self.isLogin = mcm.cache.isLogin();
        self.copy('init');
    };

    self.cache = {
        isScroll: true,
        openTime: new Date()
    };

    self.close = function () {
        mcm.renderer.update_out(self.url);
    };

    self.onEnter = function () {
        self.cache.isScroll = true;
        mcm.schedule.addTicker(this.url, this.history, this, 2000)
    };

    self.onExit = function () {
        mcm.schedule.clearTicker(this.url);
        this.copy('onExit');
    };

    self.history = function () {
        mcm.net.send({
            url: '/api/home/kefu.htm?action=more&size=50&_=' + new Date().getTime(),
            type: 'GET',
            retry: true,
            timeout: 3000,
            delay: 500
        }, true).then(function (result) {
            if (result.success && result.isLogin) {
                self.chunk('module-live-chat', '.live-chat-main', {list: result.data, openTime: (new Date())});
                setTimeout(function () {
                    if (self.cache.isScroll) {
                        $(".live-chat-main").animate({scrollTop: $(".live-chat-main").prop("scrollHeight")});
                        self.cache.isScroll = false;
                    }
                }, 100);
            }
        }.bind(this));
    };

    self.send = function () {
        var txt = $('.chat-box-text').val();
        if (txt === '') {
            return;
        }
        $('.chat-send').attr('disabled', true);
        mcm.net.send({
            url: '/api/home/kefu.htm',
            data: {
                action: 'send',
                content: txt
            },
            retry: true,
            timeout: 3000,
            delay: 500
        }, true).then(function (result) {
            $('.chat-send').attr('disabled', false);
            if (result.success) {
                $('.chat-box-text').val('');
                self.cache.openTime = new Date();
                self.history();
            }
        }.bind(this));
    };

    return self;
});