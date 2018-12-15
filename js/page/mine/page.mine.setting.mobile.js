/**   2017/10/19   by alen   **/
define(['page','jquery'], function (page,$) {
    let self = new page('mine-setting-mobile');
    
	self.onEnter =function (){
		var t =mcm.tool.mobileMask(mcm.cache._accountInfo.loginMobile);
		$('input[name=mobile]').val(t);
		//点击更换图片验证码
		$('.image-verify-code').click(function(){
			$(this).attr('src','/api/vf/verifyCode.jpg?_'+(+new Date().getTime()));
		});
	};
	
	//第一步的短信验证码
	self.sendSms4check =function(e){
		var c = $(e.currentTarget);
		var mobile =$('input[name=mobile]').val();
		var imageCode=$('input[name=imageCode]').val();
		if(imageCode==''){
			mcm.alert.sp(self.url, '图片验证码不能为空', 'normal', [{name: '确定'}]);
			return;
		}
		if(!/^\d{4}$/i.test($.trim(imageCode))){
			mcm.alert.sp(self.url, '图片验证码不对', 'normal', [{name: '确定'}]);
			return;
		}
		
		mcm.net.send({
            url: '/api/mine/mobile.htm',
            data: {
                action: 'sendVerify',
                mobile: mobile,
                imageCode: imageCode
            }
        }).then(function (result) {
        	console.log(result);
        	if(result.success){
        		countDown(c);
        	}else{
        		$('input[name=imageCode]').val('')
        		mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name: '确定'}]);
        		$('.image-verify-code').attr('src','/api/vf/verifyCode.jpg?_'+(+new Date().getTime()));
				return;
        	}
        }.bind(this));
	};
	
	//第二步的短信验证码
	self.sendSms4banding =function(e){
		var c = $(e.currentTarget);
		var mobile =$('input[name=number]').val();
		var imageCode=$('input[name=imgCode]').val();
		if(mobile==''){
			mcm.alert.sp(self.url, '手机号码不能为空', 'normal', [{name: '确定'}]);
			return;
		}
		if(!mcm.tool.verify.checkMobile(mobile)){
			mcm.alert.sp(self.url, '手机号码格式不对', 'normal', [{name: '确定'}]);
			return;
		}
		if(imageCode==''){
			mcm.alert.sp(self.url, '图片验证码不能为空', 'normal', [{name: '确定'}]);
			return;
		}
		if(!/^\d{4}$/i.test($.trim(imageCode))){
			mcm.alert.sp(self.url, '图片验证码不对', 'normal', [{name: '确定'}]);
			return;
		}
		mcm.net.send({
            url: '/api/mine/mobile.htm',
            data: {
                action: 'sendVerifyNew',
                mobile: mobile,
                imageCode: imageCode
            }
        }).then(function (result) {
        	console.log(result);
        	if(result.success){
        		countDown(c);
        	}else{
        		$('input[name=code]').val('')
        		mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name: '确定'}]);
				return;
        	}
        }.bind(this));
	};
	
	//验证码验证
	self.check =function(){
		var smsCode=$('input[name=smsCode]').val();
		if(smsCode==''){
			mcm.alert.sp(self.url, '短信验证码不能为空', 'normal', [{name: '确定'}]);
			return;
		}else if(!/^\d{4}$/i.test($.trim(smsCode))){
			mcm.alert.sp(self.url, '请输入4位短信验证码', 'normal', [{name: '确定'}]);
			return;
		}
		mcm.net.send({
            url: '/api/mine/mobile.htm',
            data: {
                action: 'verify',
                type: 1,
                verifyCode: smsCode
            }
        }).then(function (result) {
        	console.log(result);
        	if(result.success){
        		$('.step01').hide();
        		$('.step02').show();
        		$('.image-verify-code').attr('src','/api/vf/verifyCode.jpg?_'+(+new Date().getTime()));
        	}else{
        		mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name: '确定'}]);
        	}
            //mcm.renderer.refresh(this);
        }.bind(this));
		
	};
	
	//保存修改手机号码
	self.banding =function(){
		var smsCode=$('input[name=code]').val();
		if(smsCode==''){
			mcm.alert.sp(self.url, '短信验证码不能为空', 'normal', [{name: '确定'}]);
			return;
		}else if(!/^\d{4}$/i.test($.trim(smsCode))){
			mcm.alert.sp(self.url, '请输入4位短信验证码', 'normal', [{name: '确定'}]);
			return;
		}
		mcm.net.send({
            url: '/api/mine/mobile.htm',
            data: {
                action: 'verify',
                type:2,
                verifyCode: smsCode
            }
        }).then(function (result) {
        	console.log(result);
        	mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name: '确定'}]);
        	mcm.cache._accountInfo.loginMobile =$('input[name=number]').val();
            mcm.renderer.refresh(this);
        }.bind(this));
		
	};
	
	function countDown(e){
		var time =60;
	    var t =window.setInterval(function(){
	    if(time>0){
	        e.text((time--)+'秒');
	    }else{
	        e.text('获取验证码');
	        window.clearInterval(t);
	    }
	    },1000);
	}
	
    return self;
});