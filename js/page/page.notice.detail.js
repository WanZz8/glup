/**   2017/10/9   by alen   **/
define(['page','jquery','common'], function (page,$,common) {
    var self = new page('notice-detail');
    
    self.param = {
		id:null,
		title:null,
		time:null,
		text:null
	}
    
    self.request =function () {
		if(common.getQueryParam('id')==''){
			window.location.href='#home';
		}
		self.param.id =common.getQueryParam('id');
	};
    
	self.onEnter =function (){
		document.querySelector('body').scrollTop = 0;
		mcm.net.send({
            url: '/api/home/notice.htm?id='+self.param.id,
            type: 'GET',
            retry: true,
            timeout:3000,
            delay: 500
        }, true).then(function (result) {
            console.log(result);
            if(result.code==200){
            	self.param.title =result.notice.title;
            	self.param.time =mcm.tool.formatDate(result.notice.time.time,'y-m-d h:i:s');
            	self.param.text =result.notice.content;
            }
        }.bind(this));
	};
    return self;
});