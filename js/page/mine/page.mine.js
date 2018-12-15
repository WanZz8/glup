/**   2017/9/28   by alen   **/
define(['page'], function (page) {
    let self = new page('mine');

    self._delay = true;

    self.init = function () {
        const url = location.hash.replace('#', '');
        this.selected = url.split('?')[0];
        this.copy('init');
    };

    self.switch = function (v, e) {
        const target = $(e.currentTarget || e);
        if (target.hasClass('active'))
            return;
        target.addClass('active').siblings('li').removeClass('active');
        mcm.tool.browserInterceptor(v);
    };

    return self;
});