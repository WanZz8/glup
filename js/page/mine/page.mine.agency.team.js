define(['page', 'jquery'], function (page, $) {

    let self = new page('mine-agency-team');

    Object.assign(self,{
        param:{
            pending: false,
            page: 1,
            size: 10
        },
        input:{
            createTimeGe:mcm.tool.getOneDayBeforeToday(-30,1),
            createTimeLe:mcm.tool.getOneDayBeforeToday(1)
        },
        request() {
            $(".page-setting-tab li").eq(2).addClass('active').siblings().removeClass('active');
        },
        find(){
            self.param.pending = true;
            mcm.net.send({
                url: '/api/mine/unionUser.htm',
                type: 'GET',
                retry: true,
                timeout: 5000,
                delay: 500,
                data: {
                    action: 'profitList',
                    page: self.param.page,
                    size: self.param.size,
                    createTimeGe:this.input.createTimeGe,
                    createTimeLe:this.input.createTimeLe
                }
            }).then(function (result) {
                if (result.success) {
                    self.param.pending = false;
                    self.chunk('module-agency-team', '.common-table', {list: result.data.list});
                    var obj = {
                        event: 'jump',
                        count: result.data.count,
                        now: result.data.page,
                        size: result.data.size
                    };
                    self.chunk('module-page', '#page', {page: obj});
                }
            }.bind(this));
        },
        jump(val){
            if (!self.param.pending) {
                let t = val === 'detailNode' ? this['detailNode'].val() : val;
                if (self.param.page != t && t != '') {
                    self.param.page = t;
                    self.find();
                }
            }
        }
    });

    return self;
});