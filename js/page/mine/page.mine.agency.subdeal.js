/**   2017/9/28   by alen   **/
define(['page', 'jquery'], function (page, $) {
    var self = new page('mine-agency-subdeal');
    self.param = {
        pending: false,
        page: 1,
        size: 10
    };
    self.request = function () {
        $(".page-setting-tab li").eq(1).addClass('active').siblings().removeClass('active');
    };

    self.onEnter = function () {
        self.find();
    };

    //数据查询列表
    self.find = function () {
        self.param.pending = true;
        mcm.net.send({
            url: '/api/mine/unionUser.htm',
            type: 'GET',
            retry: true,
            timeout: 5000,
            delay: 500,
            data: {
                action: 'bettingList',
                page: self.param.page,
                size: self.param.size
            }
        }).then(function (result) {
            if (result.success) {
                self.param.pending = false;
                self.chunk('module-agency-subdeal', '.common-table', {list: result.data.list});
                var obj = {
                    event: 'jump',
                    count: result.data.count,
                    now: result.data.page,
                    size: result.data.size
                };
                self.chunk('module-page', '#page', {page: obj});
            }
        }.bind(this));
    };

    self.jump = function (val) {
        if (!self.param.pending) {
            var t = val === 'detailNode' ? this['detailNode'].val() : val;
            if (self.param.page != t && t != '') {
                self.param.page = t;
                self.find();
            }
        }
    };

    return self;
});