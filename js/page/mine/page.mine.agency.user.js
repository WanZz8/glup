/**   2017/9/28   by alen   **/
define(['page'], function (page) {
    var self = new page('mine-agency-user');

    self.param = {
        pending: false,
        size: 10,
        page: 1
    };

    self.request = function () {
        $(".page-setting-tab li").eq(0).addClass('active').siblings().removeClass('active');
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
                action: 'pc',
                size: self.param.size,
                page: self.param.page
            }
        }).then(function (result) {
            console.log(result);
            self.param.pending = false;
            if (result.success) {
                self.chunk('module-agency-user', '.common-table', {list: result.data.list});
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