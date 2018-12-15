/**   2017/10/19   by alen   **/
define(['page','jquery'], function (page,$) {
    var self = new page('mine-setting-info');
    
	self.onEnter =function (){
		mcm.net.send({
	        url: '/api/mine/profile.htm',
	        type: 'GET',
	        retry: true,
	        timeout:3000,
	        delay: 500
	    }, true).then(function (result) {
	        console.log(result);
	        $('.nickname').text(result.user.username);
	        $('.mark').text(result.info.identityNumberValid?'已认证':'未认证');
	        $('.lev').eq(result.level*1-1).show();
	        $('.local').text('上次登录IP：'+result.user.loginIp);
	        var userinfo =mcm.cache.getUserInfo().accountInfo;
	        $('.money').text(userinfo.money);
	    }.bind(this));
	    
	};
    return self;
});