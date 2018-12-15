/**   2017/10/2   by alen   **/
define(['page','jquery'], function (page,$) {
    var self = new page('news');
    self.param = {
		page:1,
		compare:'',
		list:new Array()
	};
    
	self.onEnter =function (){
		$('#live').scroll(function(){
			var h = $(this).height();
        	var sh = $(this)[0].scrollHeight;
        	var st =$(this)[0].scrollTop;
	        if(h+st>=sh-50){
	        	self.param.page++;
				self.findInformation();
	        }
		});
		self.findInformation();
	};
	
	//数据查询列表
	self.findInformation =function(){
		mcm.net.send({
            url: '/api/news/expressList.htm?page='+self.param.page,
            type: 'GET',
            retry: true,
            timeout:3000,
            delay: 500
        }, true).then(function (result) {
            console.log(result);
            var t = result.newsList;
            var list =t[0].list;
            var data = new Array();
            list.forEach(function (v, k, arr) {
            	if(v!=undefined){
            		var obj= filterData(v);
            		if(self.param.compare==''||obj.daytime!=self.param.compare){
            			obj.title=true;
            		}else{
            			obj.title=false;
            		}
            		data.push(obj);
            		self.param.compare=obj.daytime;
            	}
            });
            $('.market-center').show();
            self.param.list =self.param.list.concat(data);
            this.chunk('module-news-live', '#live', {list:self.param.list});
        }.bind(this));
	};
	
	function filterData(result){
		var obj=[];
		var s=result.split('#');
		if(s.length==12){
			obj.type='short';
			obj.txt=s[3];
			var datetime=s[2];
			var datetime_=datetime.split(' ');
			obj.daytime=datetime_[0];
			obj.time=datetime_[1];
			var daytime=datetime_[0].split('-');
			obj.year =daytime[0];
			obj.month =daytime[1];
			obj.day= daytime[2];
			obj.datetime=obj.year+'-'+obj.month;
		}else if(s.length==14){
			obj.type='long';
			obj.txt=s[2];
			var datetime=s[8];
			var datetime_=datetime.split(' ');
			obj.daytime=datetime_[0];
			obj.time=datetime_[1];
			var daytime=datetime_[0].split('-');
			obj.year =daytime[0];
			obj.month =daytime[1];
			obj.day= daytime[2];
			obj.datetime=obj.year+'-'+obj.month;
			obj.qz ='前值：'+s[3];
			obj.yq ='预期：'+s[4];
			obj.sj ='实际：'+s[5];
			obj.star =s[6];
			obj.country = 'https://res.6006.com/jin10/flag/'+s[9].substr(0,2)+'.png';
			obj.tag =s[7];
			obj.clazz ='style-yellow';
	        if(s[7]=='利空'){
	        	obj.tag ='利空 金银 原油';
	        	obj.clazz ='style-green';
	        } else if(s[7]=='利多'){
	        	obj.tag = '利多 金银 原油';
	        	obj.clazz ='style-red';
	        }
		}
		return obj;
	}
	
    return self;
});