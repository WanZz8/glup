/**   2017/10/9   by alen   **/
define(['page','jquery','common'], function (page,$,common) {
    var self = new page('news-detail');
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
		mcm.net.send({
            url: '/api/news/newsDetail.htm?id='+self.param.id,
            type: 'GET',
            retry: true,
            timeout:3000,
            delay: 500
        }, true).then(function (result) {
            console.log(result);
            if(result.code==200){
            	self.param.title =result.news.title;
            	self.param.time =result.news.date;
            	self.param.text =result.news.content;
            	window.setTimeout(function(){
			      	var imgs =document.querySelectorAll('.conn img');
				  	imgs.forEach(function(value, index, array){
				  		value.style.width='100%';
				  	});
			    },500);
            }
        }.bind(this));
	};
    return self;
});