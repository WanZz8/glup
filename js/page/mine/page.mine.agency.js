/**   2017/9/28   by alen   **/
define(['page'], function (page) {
    var self = new page('mine-agency');

    self.param = {
        lev: '普通经纪',
        income: '￥0.00',
        proportion: '0%',
        users: '0',
        period: '0年'
    };

    self.onEnter = function () {
        self.find();
        //切换菜单栏选中样式
        $(".page-setting-tab li").click(function () {
            const url = $(this).attr('data-src');
            $(this).addClass('active').siblings().removeClass('active');
            window.location.href = url;
        });
    };

    //数据查询列表
    self.find = function () {
        mcm.net.send({
            url: '/api/agent/getAgentInfo.htm',
            type: 'GET',
            retry: true,
            timeout: 3000
        }, true).then(function (result) {
            console.log(result);
            if (result.success) {
                var obj = result.data;
                self.param.income = '￥' + obj.comm;
                self.param.proportion = obj.commonRatio * 100 + '%';
                self.param.users = obj.count;
                self.param.period = obj.commTime + '天';
                var _src = obj.commonRatio == 0 ? 'lev5.png' : ('lev' + (obj.commonRatio * 100) + '.png');
                $('.lev img').attr('src', './images/level/' + _src);
                self.param.lev = obj.commonRatio == 0.4 ? '钻石经纪' : (obj.commonRatio == 0.3 ? '金牌经纪' : (obj.commonRatio == 0.2 ? '银牌经纪' : (obj.commonRatio == 0.1 ? '铜牌经纪' : '普通经纪')));
            }
        }.bind(this));
    };

    return self;
});