define(['page'], function (page) {
    var self = new page('login');

    self.input = {
        phone: '',
        password: ''
    };

    self.onEnter = function () {
    	//验证是否记住密码
        if (mcm.tool.getStorage('fkqh-username')) {
            self.input.phone = mcm.tool.getStorage('fkqh-username');
            self.input.password = mcm.tool.getStorage('fkqh-password');
            $('#rememberPop').attr('checked',true);
        }
        setTimeout(function () {
            self['mainNode'].addClass('show');
        }, 100);
    };

    self.onExit = function () {
        if (!$('#rememberPop').is(':checked')) {
            this.resetView('input', '');
        }
        this.copy('onExit');
    };

    self.close = function () {
        this['mainNode'].removeClass('show');
        mcm.schedule.dispatchEvent('hashChange',false,null);
        setTimeout(function () {
            mcm.renderer.update_out(self.url);
        }, 200)
    };

    self.login = function () {
        if (self.input.phone === null || self.input.phone === '')
            return mcm.alert.sp(this.url, '请输入手机号码', 'alert', [{name: '确定'}]);
        else if (!/^1[3587][0-9]{9}$/.test($.trim(self.input.phone)))
            return mcm.alert.sp(this.url, '请输入11位数字手机号码', 'alert', [{name: '确定'}]);

        if (self.input.password === null || self.input.password === '')
            return mcm.alert.sp(this.url, '请输入密码', 'alert', [{name: '确定'}]);
        else if (!/^[^\s]{6,20}$/i.test($.trim(self.input.password)))
            return mcm.alert.sp(this.url, '请输入6-20位密码', 'alert', [{name: '确定'}]);

        mcm.net.send({
            url: '/api/sso/user_login_check',
            data: {
                mobile: self.input.phone,
                password: self.input.password
            },
            timeout: 5000,
            delay:100,
            retry:true
        }).then(function (result) {
            if (!result.success) {
            	mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name: '确定'}]);
            	return;
            }
            var isRemember = $('#rememberPop').is(':checked');
            if (isRemember) {
		        mcm.tool.setStorage('fkqh-username', self.input.phone);
                mcm.tool.setStorage('fkqh-password', self.input.password);
            } else {
                mcm.tool.clearStorage('fkqh-username');
                mcm.tool.clearStorage('fkqh-password');
            }
            mcm.cache.setLogin();
            if(this.data.reference){
                this.close();
            }else{
                mcm.tool.browserBack();
            }
        }.bind(this)).fail(function (result, msg) {
            mcm.alert.sp(self.url, msg || '登录失败', 'normal', [{name: '确定'}]);
            console.log(result);
        }.bind(this));
    };

    self.switchPass = function (e) {
        var target = $(e.currentTarget);
        target.toggleClass('active');
        this['passHide'].toggle();
        this['passShow'].toggle();
    };

    return self;
});