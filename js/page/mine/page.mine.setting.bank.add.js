/**   2017/10/19   by alen   **/
define(['page','address','template','jquery'], function (page,address,template,$) {
	
    var self = new page('mine-setting-bank-add');
    
    self.province = address.getList();
    self.city = address.getList(0);
    
	self.onEnter =function (){
		mcm.net.send({
            url: '/api/mine/bankCardAdd.htm',
            type: 'GET',
            retry: true,
            timeout:3000,
            delay: 500
        }, true).then(function (result) {
            console.log(result);
            $('.title span').text('为确保资金安全，只能添加"'+result.userInfo.name+'"的银行卡');
            $('strong').text(result.userInfo.name);
        }.bind(this));
	};
	
	/**
     * 切换开户省份
     * @param e
     */
    self.switchProvince = function (e) {
        var target = $(e.currentTarget).val();
        var city = '<% for(var i = 0,len = city.length;i < len;i++){ %> <option value="<%=i%>"><%=city[i]%></option> <% } %>';
        self['cityNode'].html(template.compile(city)({city: address.getList(target)}));
    };
	
	self.saveBank =function(){
		var bank =$('select[name=bank]').val();
		var province=$('select[name=province]').find("option:selected").text();
		var city=$('select[name=city]').find("option:selected").text();
		var bankName =$('input[name=bankName]').val();
		var cardNo =$('input[name=cardNo]').val();
		var cardNoCfm =$('input[name=cardNoCfm]').val();
		
		if(bankName==''){
			//$('input[name=bankName]').css('border','1px solid #fa3448');
			mcm.alert.sp(self.url, '开户支行不能为空', 'normal', [{name: '确定'}]);
			return;
		}
		if(cardNo==''){
			mcm.alert.sp(self.url, '银行卡号不能为空', 'normal', [{name:'确定'}]);
			return;
		}
		if(cardNoCfm==''){
			mcm.alert.sp(self.url, '确认卡号不能为空', 'normal', [{name:'确定'}]);
			return;
		}
		if(cardNo!=cardNoCfm){
			mcm.alert.sp(self.url, '两次输入银行卡不一致', 'normal', [{name:'确定'}]);
			return;
		}
		mcm.net.send({
            url: '/api/mine/bankCardAdd.htm',
            data: {
                action: 'add',
                bank: bank,
                cardNumber: cardNo,
                cardNumberCfm:cardNoCfm,
                province:province,
                city:city,
                subbranch:bankName
            },
            type: 'POST',
            retry: true,
            timeout:3000,
            delay: 500
        }, false).then(function (result) {
            console.log(result);
            if(result.success){
            	mcm.cache.loadUserInfo();
            	mcm.renderer.refresh(self);
            	$('.mask').hide();
            	$('#mine-setting-bank').hide();
            }
            mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name:'确定',then:function(){
            	self.chunk('module-mine-setting-card-list','.bank-cards-wrap',{list:mcm.cache._bankInfo});
            }}]);
        }.bind(this));
	};
	
	self.cancel =function(){
		$('#mine-setting-bank').hide();
		$('.mask').hide();
	};
	
	self.change =function(s){
		var t ="input[name="+s+"]";
		if($(t).val()!=''){
			$(t).css("border","1px solid #d3d3d3");
		}
	};
	
    return self;
});