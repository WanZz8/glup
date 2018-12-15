/**   2017/10/3   by alen   **/
define(['page', 'jquery'], function (page, $) {
    var self = new page('calendar');
    self.param = {
        datetime: diff(0).val
    }

    self.onEnter = function () {
        $(".on-distance").delegate("li", "click", function () {
            if ($(this).hasClass('week-left')) {
                calendar($(this).attr('data-start') * 1 - 4);
                return;
            } else if ($(this).hasClass('week-right')) {
                calendar($(this).attr('data-end') * 1 - 6 + 4);
                return;
            } else {
                $(this).addClass('active').siblings().removeClass('active');
                self.param.datetime = $(this).attr('data-time');
                self.find();
            }
        });
        calendar(-3);
        self.find();
    };
    
    self.list = function () {
    	self.findEconomics();
    	self.findEvent();
    	self.findHoliday();
    };
    
    //查询财经日历
    self.findEconomics = function () {
    	var param =self.param.datetime.split('#');
        mcm.net.send({
            url: '/rili/datas/'+param[0]+'/'+param[1]+'/economics.json',
            type: 'GET',
            retry: true,
            timeout: 4000
        }, true).then(function (data) {
            console.log(data);
            var list = [];
            if (data.length > 0) {
                var temp = data[0].time_show + "#" + data[0].country;
                var sub = [];
                $.each(data, function (key, item) {
                    var t = item.time_show + "#" + item.country;
                    if (temp != t || data.length - 1 == key) {
                        list.push({key: temp, list: sub});
                        //变更比较key
                        temp = t;
                        //重置下级数据
                        sub = [];
                    }
                    var influence = item.status_name;
                    if (item.status_name === '利空') {
                        influence = '利空 金银 原油'
                    } else if (item.status_name === '利多') {
                        influence = '利多 金银 原油'
                    } else if (item.status_name === '未公布') {
                        influence = '--'
                    }
                    var clazz = '';
                    if (item.status_name === '利空') {
                        clazz = 'calender-style-green'
                    } else if (item.status_name === '利多') {
                        clazz = 'calender-style-red'
                    } else if (item.status_name === '影响较小') {
                        clazz = 'calender-style-yellow'
                    }
                    sub.push({
                        title: item.title,//指标名称
                        star: item.star,//重要性
                        previous: item.unit == '%' ? (item.previous + item.unit) : item.previous,//前值
                        hope: item.consensus == null ? '--' : (item.unit == '%' ? (item.consensus + item.unit) : item.consensus),//预测值
                        open: item.actual == null ? '未公布' : (item.unit == '%' ? (item.actual + item.unit) : item.actual),//公布值
                        influence: influence,//实际影响
                        clazz: clazz//实际影响样式
                    });
                });
            }
            self.chunk('module-calendar-fund', '#fundData', {list: list});
        }.bind(this));
    };
    
    //查询财经事件
    self.findEvent = function () {
    	var param =self.param.datetime.split('#');
        mcm.net.send({
            url: '/rili/datas/'+param[0]+'/'+param[1]+'/event.json',
            type: 'GET',
            retry: true,
            timeout: 10000
        }, true).then(function (result) {
            console.log(result);
            self.chunk('module-calendar-event', '#fundEvent', {list: result});
        }.bind(this));
    };
    
    //查询假期预告
    self.findHoliday = function () {
    	var param =self.param.datetime.split('#');
        mcm.net.send({
            url: '/rili/datas/'+param[0]+'/'+param[1]+'/holiday.json',
            type: 'GET',
            retry: true,
            timeout: 10000
        }, true).then(function (result) {
            console.log(result);
            self.chunk('module-calendar-holiday', '#holidays', {list: result.news.newsHoliday});
        }.bind(this));
    };
    

    //查询财经日历
    self.find = function () {
        mcm.net.send({
            url: '/api/news/calendar.htm?date=' + self.param.datetime,
            type: 'GET',
            retry: true,
            timeout: 10000,
            delay: 500
        }, true).then(function (result) {
            console.log(result);
            //财经数据
            var data = result.news.newsData;
            var list = [];
            if (data.length > 0) {
                var temp = data[0].time_show + "#" + data[0].country;
                var sub = [];
                $.each(data, function (key, item) {
                    var t = item.time_show + "#" + item.country;
                    if (temp != t || data.length - 1 == key) {
                        list.push({key: temp, list: sub});
                        //变更比较key
                        temp = t;
                        //重置下级数据
                        sub = [];
                    }
                    var influence = item.status_name;
                    if (item.status_name === '利空') {
                        influence = '利空 金银 原油'
                    } else if (item.status_name === '利多') {
                        influence = '利多 金银 原油'
                    } else if (item.status_name === '未公布') {
                        influence = '--'
                    }
                    var clazz = '';
                    if (item.status_name === '利空') {
                        clazz = 'calender-style-green'
                    } else if (item.status_name === '利多') {
                        clazz = 'calender-style-red'
                    } else if (item.status_name === '影响较小') {
                        clazz = 'calender-style-yellow'
                    }
                    sub.push({
                        title: item.title,//指标名称
                        star: item.star,//重要性
                        previous: item.unit == '%' ? (item.previous + item.unit) : item.previous,//前值
                        hope: item.consensus == null ? '--' : (item.unit == '%' ? (item.consensus + item.unit) : item.consensus),//预测值
                        open: item.actual == null ? '未公布' : (item.unit == '%' ? (item.actual + item.unit) : item.actual),//公布值
                        influence: influence,//实际影响
                        clazz: clazz//实际影响样式
                    });
                });
            }
            self.chunk('module-calendar-fund', '#fundData', {list: list});
            //财经事件
            self.chunk('module-calendar-event', '#fundEvent', {list: result.news.newsEvent});
            //假期预告
            self.chunk('module-calendar-holiday', '#holidays', {list: result.news.newsHoliday});
        }.bind(this));
    };

    //获取日历
    function calendar(start) {
        if (start * 1 < -7) {
            start = -7;
        }
        if (start * 1 > 1) {
            start = 1;
        }
        var end = start * 1 + 6;
        var html = '<li class="week-left" data-start="' + start + '"><img src="./images/061.png"></li>';
        for (var i = start; i <= end; i++) {
            var t = diff(i);
            if (t.today) {
                html += '<li class="active" data-time="' + t.val + '">';
            } else {
                html += '<li data-time="' + t.val + '">';
            }
            html += '<p>' + t.show + '</p>';
            html += '<p>' + t.week + '</p>';
            html += '</li>';
        }
        html += '<li class="week-right" data-end="' + end + '"><img src="./images/062.png"></li>';
        document.querySelector('.on-distance').innerHTML = html;
    }

    //获取几天差的日期
    function diff(v) {
        var now = new Date();
        var date = new Date(now.getTime() + v * 24 * 3600 * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = mcm.tool.completeNum(month);
        var day = date.getDate();
        day = mcm.tool.completeNum(day);
        var obj = {};
        obj.show = year + '/' + month + '/' + day;
        obj.val = year.toString() + month.toString() + day.toString();
        //obj.val = year.toString() + '#' + month.toString() + (day<10?('0'+day):day);
        var week = ["日", "一", "二", "三", "四", "五", "六"];
        obj.week = '星期' + week[date.getDay()];
        obj.today = v === 0;
        return obj;
    }

    return self;
});