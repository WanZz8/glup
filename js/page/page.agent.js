define(['page'], function (page) {
    let self = new page('home');

    Object.assign(self, {
        input: {
            mobile: '',
            password: ''
        },
        onExit() {
            this.resetView('input', '');
            this.copy('onExit');
        },
        submit() {
            if (this.input.mobile === null || this.input.mobile === '')
                return mcm.alert.sp(this.url, '请输入手机号码', 'alert', [{name: '确定'}]);
            else if (!/^1[3587][0-9]{9}$/.test($.trim(self.input.mobile)))
                return mcm.alert.sp(this.url, '请输入11位数字手机号码', 'alert', [{name: '确定'}]);

            if (this.input.password === null || this.input.password === '')
                return mcm.alert.sp(this.url, '请输入密码', 'alert', [{name: '确定'}]);
            else if (!/^[^\s]{6,20}$/i.test($.trim(self.input.password)))
                return mcm.alert.sp(this.url, '请输入6-20位密码', 'alert', [{name: '确定'}]);

            mcm.net.send({
                url: '/api/sso/user_login_check',
                data: {
                    mobile: this.input.mobile,
                    password: this.input.password
                },
                timeout: 5000,
                delay: 100,
                retry: true
            }).then((result) => {
                if (!result.success) {
                    mcm.alert.sp(this.url, result.errorMsg, 'normal', [{name: '确定'}]);
                    return;
                }
                mcm.cache.setLogin();
                mcm.tool.browserInterceptor('mine-setting-info');

            }).fail((result, msg) => {
                console.log(this.url);
            });
        }
    });

    return self;
});
