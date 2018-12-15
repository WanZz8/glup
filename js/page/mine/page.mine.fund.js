/**   2017/9/29   by alen   **/
define(['page','jquery'], function (page,$) {
    var self = new page('mine-fund');
    
    self.param = {
    	pending: false,
		type:0,
		page:1
	}
    
	self.onEnter =function (){
		//切换菜单栏选中样式
		$(".tab li").click(function(){
			if(!self.param.pending){
				$(this).addClass('active').siblings().removeClass('active');
				self.param.page=1;
				self.param.type=$(this).index();
				self.qry();
			}
		});
		self.qry();
	};
	self.qry =function(){
		self.param.pending =true;
		mcm.net.send({
            url: '/api/mine/funds.htm',
            type: 'GET',
            data:{
            	action: "pc",
            	type: self.param.type,
            	page: self.param.page
            },
            retry: true,
            timeout:5000
        }).then(function (result) {
            console.log(result);
            self.param.pending =false;
            if(result.success){
            	self.chunk('module-mine-fund','.mine-table',{list:result.data.list});
            	var page={
	            	count:result.data.count,
	            	now:result.data.page,
	            	size:result.data.size
	            };
	            self.chunk('module-page','#page',{page:page});
            }
        }.bind(this));
	};
	
	self.jump = function (val) {
		if(!self.param.pending){
			var t=val==='detailNode'?this['detailNode'].val():val;
    		if(self.param.page!=t&&t!=''){
    			self.param.page=t;
        		self.qry();
    		}
		}
    };
	
    return self;
});