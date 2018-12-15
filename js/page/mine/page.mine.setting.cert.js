/**   2017/10/19   by alen   **/
define(['page','jquery'], function (page,$) {
    let self = new page('mine-setting-cert');
    
	self.onEnter =function (){
		self.isCert();
		//提交认证信息
		$('button[name=cert]').click(function(){
			self.saveCert();
		});
	};
	
	self.isCert =function(){
		mcm.net.send({
            url: '/api/mine/profileAuth.htm',
            type: 'GET',
            retry: true,
            timeout:3000,
            delay: 500
        }, true).then(function (result) {
            if(result.info.identityNumberValid){
            	$("#addBank strong").text(result.info.name);
            	$('input[name=realName]').val(mcm.tool.nameMask(result.info.name)).attr("readonly", true);
            	$('input[name=idCard]').val(mcm.tool.idCardMask(result.info.identityNumber)).attr("readonly", true);
            	$('button[name=cert]').text('已认证').attr("disabled", true);
            }
        }.bind(this));
	};
	
	self.saveCert =function(){
		var realName =$('input[name=realName]').val();
        var idCard =$('input[name=idCard]').val();
        if(realName==''){
        	mcm.alert.sp(self.url, '请输入真实姓名', 'normal', [{name: '确定'}]);
        	return;
        }
        if(idCard==''){
        	mcm.alert.sp(self.url, '请输入身份证号码', 'normal', [{name: '确定'}]);
        	return;
        }
        if(!mcm.tool.verify.checkIdCard(idCard)){
        	mcm.alert.sp(self.url, '请输入身份证格式不对', 'normal', [{name: '确定'}]);
        	return;
        }
		mcm.net.send({
            url: '/api/mine/profileAuth.htm',
            data:{
               	action:'authIdentity',
               	name:realName,
               	identityNumber:idCard
            },
            type: 'POST',
            retry: true,
            timeout:3000
        }, false).then(function (result) {
            console.log(result);
            if(result.success){
            	mcm.alert.sp(self.url, '实名认证成功！', 'normal', [{name:'确定',then:function(){
		            $('input[name=realName]').attr("readonly", true);
            		$('input[name=idCard]').attr("readonly", true);
            		$('button[name=cert]').text('已认证').attr("disabled", true);
			    }}]);
            }
        }.bind(this));
	};
    return self;
});