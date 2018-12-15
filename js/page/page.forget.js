/**   2017/10/7   by alen   **/
define(['page','jquery'], function (page,$) {
    var self = new page('forget');
    
    self.param = {
        num: 60
    };
    
    self.input = {
    	username: '',
        idCard: '',
        mobile: '',
        dtm: '',
        pawd: '',
        pawdCfm: '',
        code: ''
    };
    
	self.onEnter =function (){
		//点击获取验证码
		$('.input03').click(function(){
			if($(this).val()!='获取验证码'){
				return;
			}
			if(self.input.mobile==''){
				mcm.alert.sp(self.url, '请输入手机号码', 'normal', [{name: '确定'}]);
				return;
			}
			if(!mcm.tool.verify.checkMobile(self.input.mobile)){
				mcm.alert.sp(self.url, '手机号码格式不对', 'normal', [{name: '确定'}]);
				return;
			}
			if(self.input.dtm==''){
				mcm.alert.sp(self.url, '图片验证码不能为空', 'normal', [{name: '确定'}]);
				return;
			}
			if(self.input.dtm.length!=4){
				mcm.alert.sp(self.url, '图片验证码不对', 'normal', [{name: '确定'}]);
				return;
			}
			mcm.net.send({
	            url: '/api/sso/findback.htm',
	            data: {
	                action: 'sendCode',
	                mobile: self.input.mobile,
	                imageCode: self.input.dtm
	            }
	        }).then(function (result) {
	        	console.log(result);
	        	self.input.code='';
	        	if (!result.success) {
	        		$('.dtm').attr('src','/api/vf/verifyCode.jpg?_'+new Date().getTime());
	        		$('.tips').text(result.resultMsg || result.errorMsg);
	        		return;
	        	}
	            $('.tips').text('验证码发送成功，请注意查收短信');
	            var t =window.setInterval(function(){
	            	self.param.num--;
					$('.input03').val(self.param.num+'S后重新发送');
	            	if(self.param.num==1){
	            		$('.input03').val('获取验证码');
	            		self.param.num =60;
	            		window.clearInterval(t);
	            	}
	            },1000);
	        }.bind(this));
		});
		//刷新验证码
		$('.dtm').click(function(){
			self.input.dtm='';
			$('.tips').text('');
			$('.dtm').attr('src','/api/vf/verifyCode.jpg?_'+new Date().getTime());
		});
	};
	
	//下一步
	self.next =function (){
		if(self.input.mobile==''){
			mcm.alert.sp(self.url, '请输入手机号码', 'normal', [{name: '确定'}]);
			return;
		}
		if(self.input.dtm==''){
			mcm.alert.sp(self.url, '请输入图片验证码不能为空', 'normal', [{name: '确定'}]);
			return;
		}
		if(self.input.code==''){
			mcm.alert.sp(self.url, '请输入短信验证码不能为空', 'normal', [{name: '确定'}]);
			return;
		}
		if(self.input.code.length!=4){
			mcm.alert.sp(self.url, '短信验证码不对', 'normal', [{name: '确定'}]);
			return;
		}
		mcm.net.send({
            url: '/api/sso/findback.htm',
            data: {
                action: 'verifyCode',
                verifyCode: self.input.code
            }
        }).then(function (result) {
        	console.log(result);
        	if (!result.success) {
        		mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name: '确定'}]);
        		return;
        	}
        	this['tab01'].hide();
        	if(result.redirectUrl=='/sso/findback.htm?step=1'){
        		this['tab02'].show();
        	}else{
        		this['tab03'].show();
        	}
        	
        }.bind(this));
	};
	
	//验证真实信息
	self.auth =function (){
		if(self.input.username==''){
			mcm.alert.sp(self.url, '请输入真实姓名', 'normal', [{name: '确定'}]);
			return;
		}
		if(self.input.idCard==''){
			mcm.alert.sp(self.url, '请输入身份证号码', 'normal', [{name: '确定'}]);
			return;
		}
		if(!mcm.tool.verify.checkIdCard(self.input.idCard)){
			mcm.alert.sp(self.url, '身份证号码不对', 'normal', [{name: '确定'}]);
			return;
		}
		mcm.net.send({
            url: '/api/sso/findback.htm',
            data: {
                action: 'auth',
                name: self.input.username,
                identityNumber: self.input.idCard
            }
        }).then(function (result) {
        	console.log(result);
        	if (!result.success) {
        		mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name: '确定'}]);
        		return;
        	}
        	this['tab02'].hide();
        	this['tab03'].show();
        }.bind(this));
		
	};
	
	//保存
	self.save =function (){
		if(self.input.pawd==''){
			mcm.alert.sp(self.url, '新密码不能为空', 'normal', [{name: '确定'}]);
			return;
		}
		if(self.input.pawdCfm==''){
			mcm.alert.sp(self.url, '确认密码不能为空', 'normal', [{name: '确定'}]);
			return;
		}
		if(self.input.pawd!=self.input.pawdCfm){
			mcm.alert.sp(self.url, '两次密码不一致', 'normal', [{name: '确定'}]);
			return;
		}
		mcm.net.send({
            url: '/api/sso/findback.htm',
            data: {
                action: 'passwd',
                newPass: self.input.pawd,
                newPassCfm: self.input.pawdCfm
            }
        }).then(function (result) {
        	console.log(result);
        	if(!result.success){
        		mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name: '确定'}]);
        		return;
        	}
        	this['tab03'].hide();
        	this['tab04'].show();
        	var s=3,tt =window.setInterval(function(){
				$('.result strong').text(s--);
	            if(s<0){
	            	window.clearInterval(tt);
	            	window.location.href='#home';
	            }
	        },1000);
        }.bind(this));
	};
	
	//联系客服
	self.kf =function (){
		mcm.alert.sp(self.url, '请联系人工客服QQ：800837618', 'normal', [{name: '确定'}]);
	};
	
	//一键清空
	self.clean =function (v){
		if(v==='mobile'){
			self.input.mobile ='';
		}else if(v==='pawd'){
			self.input.pawd ='';
		}else if(v==='pawdCfm'){
			self.input.pawdCfm ='';
		}else if(v==='username'){
			self.input.username ='';
		}else if(v==='idCard'){
			self.input.idCard ='';
		}
	};
	
    return self;
});