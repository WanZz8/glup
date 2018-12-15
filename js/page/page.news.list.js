/**   2017/10/9   by alen   **/
define(['page','jquery'], function (page,$) {
	
    var self = new page('news-list');
    
	self.param = {
		pending: false,
		page:1,
		size:10,
		type:0//【0：原油 /1：黄金】
	};
	
	self.onEnter =function (){
		//黄金原油切换
		$(".tab-nav li").click(function(){
			if(!self.param.pending){
				$(this).addClass('active').siblings().removeClass('active');
				self.param.type=$(this).index();
				self.param.page =1;
				self.findNews();
			}
		});
		self.findNews();
	};
	
	//数据查询列表
	self.findNews =function(){
		self.param.pending =true;
		mcm.net.send({
            url: '/api/news/newsList.htm',
            type: 'GET',
            data: {
            	size: self.param.size,
            	type: self.param.type,
            	page: self.param.page
            },
            retry: true,
            timeout:3000,
            delay: 500
        }, false).then(function (result) {
        	self.param.pending =false;
        	var data =result.newsList;
            self.chunk('module-news-list','.content-body',{list:data[0].list});
            var page={
            	count:data[0].count,
            	now:data[0].page,
            	size:data[0].size
            };
            self.chunk('module-page','#page',{page:page});
        }.bind(this));
	};
	
	//查看详情
	self.detail =function(val){
		window.open('#news-detail?id='+val);
	};
	
	self.jump =function(val){
		//self.param.page=val;
		//if(val==='detailNode'){
		//	self.param.page= this['detailNode'].val();
			//self.param.page=$(e.target).parent().prev().find('input').val();
		//}
		if(!self.param.pending){
    		var t=val==='detailNode'?this['detailNode'].val():val;
    		if(self.param.page!=t&&t!=''){
    			self.param.page=t;
        		self.findNews();
    		}
    	}
	};
	
    return self;
});