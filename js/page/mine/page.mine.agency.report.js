/**   2017/9/28   by alen   **/
define(['page','jquery'], function (page,$) {
    var self = new page('mine-agency-report');
    
    self.param = {
    	pending: false,
        page: 1,
        size:10
    };
    
    self.request =function () {
		$(".page-setting-tab li").eq(2).addClass('active').siblings().removeClass('active');
	};
	
	self.onEnter =function (){
		self.find();
	};
	
	//数据查询列表
    self.find = function () {
    	self.param.pending =true;
        mcm.net.send({
            url: '/api/agent/getCommissionPage.htm',
            type: 'GET',
            retry: true,
            timeout: 3000,
            data: {
                page: self.param.page,
                size: self.param.size
            }
        }, true).then(function (result) {
            console.log(result);
            if (result.success) {
            	self.param.pending=false;
            	self.chunk('module-agency-report', '.common-table', {list: result.data});
                var obj = {
                    count: result.total,
                    now: result.page,
                    size: result.pageSize
                };
                self.chunk('module-page','#page',{page:obj});
            }
        }.bind(this));
    };
    
    self.jump = function (val) {
    	if(!self.param.pending){
    		var t=val==='detailNode'?this['detailNode'].val():val;
    		if(self.param.page!=t&&t!=''){
    			self.param.page=t;
        		self.find();
    		}
    	}
    };
	
    return self;
});