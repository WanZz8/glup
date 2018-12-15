/**   2017/10/19   by alen   **/
define(['page', 'jquery'], function (page, $) {
    let self = new page('mine-setting-bank');

    self.onEnter = function () {
        mcm.net.send({
            url: '/api/mine/bankCard.htm',
            type: 'GET',
            retry: true,
            timeout: 3000
        }, true).then(({bankCards, info}) => {
            if (info.identityNumberValid) {
                self.chunk('module-mine-setting-card-list', '.bank-cards-wrap', {list: bankCards});
            } else {
                mcm.tool.browserInterceptor('mine-setting-cert');
                mcm.schedule.dispatchEvent('resetSetting',false,true);
                mcm.alert.sp(this.url, '请先进行实名认证', 'normal', [{name:'确定'}]);
            }
        });
    };

    self.list = function () {
        //直接从缓存里面拿卡数据
        self.chunk('module-mine-setting-card-list', '.bank-cards-wrap', {list: mcm.cache._bankInfo});
    };

    self.showDoc = function () {
        $('.mask').show();
        $('#mine-setting-bank').show();
    };

    //设置默认银行卡
    self.setDefault = function (e) {
        mcm.net.send({
            url: '/api/mine/bankCardUpdate.htm?action=setDefault&id=' + e,
            retry: true,
            timeout: 3000,
            delay: 500
        }, false).then(function (result) {
            console.log(result);
            if (result.success) {
                //设置成功更新缓存
                mcm.cache.loadUserInfo();
                mcm.alert.sp(self.url, result.errorMsg, 'normal', [{
                    name: '确定', then: function () {
                        //更新列表数据
                        self.list();
                    }
                }]);
                //mcm.renderer.refresh(self);
            }
        }.bind(this));
    };


    //删除一张银行卡
    self.delCard = function (e) {
        mcm.alert.sp(self.url, '您确定要删除该银行卡吗?', 'normal', [{
            name: '确定', then: function () {
                mcm.net.send({
                    url: '/api/mine/bankCardUpdate.htm?action=del&id=' + e,
                    retry: true,
                    timeout: 3000,
                    delay: 500
                }, true).then(function (result) {
                    console.log(result);
                    if (result.success) {
                        //更新缓存
                        mcm.cache.loadUserInfo();
                        mcm.alert.sp(self.url, result.errorMsg, 'normal', [{
                            name: '确定', then: function () {
                                //更新列表数据
                                self.list();
                            }
                        }]);
                    }
                }.bind(this));
            }
        }, {name: '取消'}]);
    };

    return self;
});