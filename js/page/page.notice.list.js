/**   2017/10/9   by alen   **/
define(['page','jquery'], function (page,$) {
    var self = new page('notice-list');
    
    self.param = {
		pending: false,
		page:1,
		size:10
	};
    
	self.onEnter =function (){
		self.qry();
	};
	
	//数据查询列表
	self.qry =function(){
		self.param.pending =true;
		mcm.net.send({
            url: '/api/discover/page.htm',
            type: 'GET',
            data: {
            	pageSize: self.param.size,
            	page: self.param.page
            },
            retry: true
        }, true).then(function (result) {
            console.log(result);
            if(result.success){
            	self.param.pending =false;
            	var data =result.data;
            	var list =new Array();
            	for(var i=0;i<data.length;i++){
            		var obj =new Object();
            		obj.id=data[i].id;
            		obj.day =mcm.tool.formatDate(data[i].time.time,'d');
            		obj.date =mcm.tool.formatDate(data[i].time.time,'y-m');
            		var txt =data[i].content.toString().replace(/<p>/g,'').replace(/<\/p>/g,'');
            		obj.text=txt.length>150?(txt.substr(0,140)+'...'):txt;
            		list.push(obj);
            	}
            	self.chunk('module-notice-list','.notice-list',{list:list});
            	var page={
	            	count:result.total,
	            	now:result.page,
	            	size:result.pageSize
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
	
	//查看详情
	self.detail =function(val,e){
		window.open('#notice-detail?id='+val);
	};
    return self;
});