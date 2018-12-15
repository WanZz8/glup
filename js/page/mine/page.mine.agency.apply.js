/**   2017/9/28   by alen   **/
define(['page','jquery'], function (page,$) {
    var self = new page('mine-agency-apply');
    
    self.request =function () {
		$(".page-setting-tab li").eq(3).addClass('active').siblings().removeClass('active');
	};
	
	self.onEnter =function (){
		mcm.net.send({
            url: '/api/agent/getAgentInfo.htm',
            type: 'GET',
            retry: true
        }, true).then(function (result) {
            console.log(result);
            if (result.success) {
            	show(result.data.commonRatio);
            }
        }.bind(this));
	};
	
	function show(val){
		var t =$('.leaderboard tr');
		if(val>0){
			t.eq(1).find('th').eq(0).text('普通经纪');
			t.eq(1).find('th').eq(1).text('1-10人');
			t.eq(1).find('th').eq(2).text('5%');
			t.eq(1).find('th').eq(3).text('半年');
		}
		if(val>=0.1){
			t.eq(2).find('th').eq(0).text('铜牌经纪');
			t.eq(2).find('th').eq(1).text('10人及以上');
			t.eq(2).find('th').eq(2).text('10%');
		}
		if(val>=0.2){
			t.eq(3).find('th').eq(0).text('银牌经纪');
			t.eq(3).find('th').eq(1).text('30人及以上');
			t.eq(3).find('th').eq(2).text('20%');
		}
		if(val>=0.3){
			t.eq(4).find('th').eq(0).text('金牌经纪');
			t.eq(4).find('th').eq(1).text('50人及以上');
			t.eq(4).find('th').eq(2).text('30%');
		}
		if(val>=0.4){
			t.eq(5).find('th').eq(0).text('钻石经纪');
			t.eq(5).find('th').eq(1).text('100人及以上');
			t.eq(5).find('th').eq(2).text('40%');
		}
	}
	
    return self;
});