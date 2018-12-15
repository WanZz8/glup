/**   2017/10/2   by alen   **/
define(['page','jquery'], function (page,$) {
    var self = new page('activity');
    self.param = {
		type:0
	}
	self.onEnter =function (){
		$('.tab-nav li').click(function(){
			$(this).addClass('tab-nav-active').siblings().removeClass('tab-nav-active');
		});
	};
	
	self.detail =function (t){
		if(t=='tgjsj'){
			this['tgjsj'].toggle();
		}
		if(t=='cbrmb'){
			this['cbrmb'].toggle();
		}
		if(t=='topup'){
			this['topup'].toggle();
		}
	};
    return self;
});