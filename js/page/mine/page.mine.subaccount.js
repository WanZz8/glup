/**   2017/10/25   by alen   **/
define(['page', 'clipboard'], function (page, clipboard) {
    var self = new page('mine-subaccount');

    self.param = {
        visitCount: 0,
        link:''
    };

    self.request = function () {
        $(".page-setting-tab li").eq(3).addClass('active').siblings().removeClass('active');
    };

    self.onEnter = function () {
        mcm.net.send({
            url:'/api/mine/union.htm',
            type:'GET'
        },true).then(function (result) {
            if(!!result && !!result.union && !!result.union.visitCount)
                this.param.visitCount = result.union.visitCount;
        }.bind(this));

        var userInfo = mcm.cache.getUserInfo().accountInfo;
        this.param.link = window.location.origin + '/#home?ru=' + userInfo.id;
        $('.copy').attr('data-clipboard-text', self.param.link);

        var c = new clipboard('.copy');

        c.on('success', function (e) {
            mcm.alert.sp(self.url, '复制成功', 'normal', [{name: '确定'}]);
        });

        c.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    };

    return self;
});