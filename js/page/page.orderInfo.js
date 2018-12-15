define(['page'], function (page) {
    var self = new page('orderInfo');

    self.init = function () {
        self.copy('init');
    };

    self.onEnter = function () {
        setTimeout(function () {
            self['mainNode'].addClass('show');
        }, 1)
    };

    self.close = function () {
        this['mainNode'].removeClass('show');
        setTimeout(function () {
            mcm.renderer.update_out(self.url);
        }, 200)
    };

    return self;
});