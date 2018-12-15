/**   2017/10/19   by alen   **/
define(['page', 'jquery'], function (page, $) {

    let self = new page('mine-setting-password');

    self.param = {
        isSetting: false
    };

    self.input = {
        loginOldPawd: '',
        loginNewPawd: '',
        loginNewPawdCfm: '',

        loginPawd: '',
        withdrawNew: '',
        withdrawNewCfm: ''
    };

    self.onEnter = function () {
        //显示设置提现密码框
        $('.no-setting').click(function () {
            $('.withdraw-password label').eq(0).text('登录密码：');
            $('.withdraw-password input').eq(0).attr('placeholder', '请输入登录密码');
            $('.withdraw-setting').hide();
            $('.withdraw-password table').show();
        });
        self.checkWithdraw();
    };
    //登录密码修改
    self.saveLoginPawd = function () {
        if (self.input.loginOldPawd == '') {
            mcm.alert.sp(self.url, '请输入旧密码', 'normal', [{name: '确定'}]);
            return;
        }
        if (self.input.loginNewPawd == '') {
            mcm.alert.sp(self.url, '请输入新密码', 'normal', [{name: '确定'}]);
            return;
        }
        if (self.input.loginNewPawdCfm == '') {
            mcm.alert.sp(self.url, '请输入确认新密码', 'normal', [{name: '确定'}]);
            return;
        }
        if (self.input.loginNewPawdCfm != self.input.loginNewPawd) {
            mcm.alert.sp(self.url, '两次新密码不一致', 'normal', [{name: '确定'}]);
            return;
        }
        if (self.input.loginNewPawd.length < 6) {
            mcm.alert.sp(self.url, '新密码安全性太弱', 'normal', [{name: '确定'}]);
            return;
        }
        if (!mcm.tool.verify.checkPassword(self.input.loginNewPawd)) {
            mcm.alert.sp(self.url, '新密码安全性太弱', 'normal', [{name: '确定'}]);
            return;
        }
        mcm.net.send({
            url: '/api/mine/loginPasswd.htm',
            data: {
                oldPass: self.input.loginOldPawd,
                newPass: self.input.loginNewPawd,
                newPassCfm: self.input.loginNewPawdCfm
            },
            retry: true,
            timeout: 3000,
            delay: 500
        }, false).then(function (result) {
            console.log(result);
            mcm.alert.sp(self.url, result.errorMsg, 'normal', [{
                name: '确定', then: function () {
                    self.input.loginOldPawd = '';
                    self.input.loginNewPawd = '';
                    self.input.loginNewPawdCfm = '';
                    if (result.success) {
                        mcm.cache.setLogout();
                    } else {
                        mcm.renderer.refresh(self);
                    }
                }
            }]);
        }.bind(this));
    };
    //设置提款密码
    self.saveWithdrawPawd = function () {
        var remark = '请输入登录密码';
        if (self.param.isSetting) {
            remark = '请输入旧密码';
        }
        if (self.input.loginPawd == '') {
            mcm.alert.sp(self.url, remark, 'normal', [{name: '确定'}]);
            return;
        }
        if (self.input.withdrawNew == '') {
            mcm.alert.sp(self.url, '请输入提款密码', 'normal', [{name: '确定'}]);
            return;
        }
        if (self.input.withdrawNewCfm == '') {
            mcm.alert.sp(self.url, '请输入确认提款密码', 'normal', [{name: '确定'}]);
            return;
        }
        if (self.input.withdrawNewCfm != self.input.withdrawNew) {
            mcm.alert.sp(self.url, '两次新密码不一致', 'normal', [{name: '确定'}]);
            return;
        }
        if (self.input.withdrawNew.length < 6) {
            mcm.alert.sp(self.url, '提款密码安全性太弱', 'normal', [{name: '确定'}]);
            return;
        }
        if (!mcm.tool.verify.checkPassword(self.input.withdrawNew)) {
            mcm.alert.sp(self.url, '提款密码安全性太弱', 'normal', [{name: '确定'}]);
            return;
        }
        mcm.net.send({
            url: '/api/mine/atmPasswd.htm',
            data: {
                password: self.input.loginPawd,
                withdrawPw: self.input.withdrawNew,
                withdrawPwCfm: self.input.withdrawNewCfm
            },
            retry: true,
            timeout: 3000,
            delay: 500
        }, false).then(function (result) {
            console.log(result);
            mcm.alert.sp(self.url, result.errorMsg, 'normal', [{
                name: '确定', then: function () {
                    self.input.loginPawd = '';
                    self.input.withdrawNew = '';
                    self.input.withdrawNewCfm = '';
                    mcm.renderer.refresh(self);
                }
            }]);
        }.bind(this));
    };
    //验证是否设置提款密码
    self.checkWithdraw = function () {
        mcm.net.send({
            url: '/api/mine/atmPasswd.htm',
            type: 'GET',
            retry: true,
            timeout: 3000,
            delay: 500
        }, true).then(function (result) {
            console.log(result);
            if (result.user.withdrawPw) {
                self.param.isSetting = true;
                $('.withdraw-setting').hide();
                $('.withdraw-password table').show();
            }
        }.bind(this));
    };
    return self;
});