/**   2017/10/4   by alen   **/
define(['page', 'jquery'], function (page, $) {
    var self = new page('notice');
    self.onEnter = function () {
        self.qry();
    };

    self.spread = function (v) {
        mcm.schedule.dispatchEvent('tagChange',false,v);
    };

    //数据查询列表
    self.qry = function () {
        mcm.net.send({
            url: '/api/discover/index.htm',
            type: 'GET',
            retry: true,
            timeout: 3000,
            delay: 500
        }, true).then(function (result) {
            console.log(result);
            var html = '';
            if (result.success) {
                var list = result.notices;
                for (var i = 0; i < list.length; i++) {
                    var title = list[i].title;
                    if (title.length > 16) {
                        title = title.substr(0, 16) + '...';
                    }
                    var title = (i + 1) + '、' + title;
                    html += '<li><a href="#notice-detail?id=' + list[i].id + '" target="_blank">' + title + '</a></li>';
                }
            }
            document.querySelector('.rank ul').innerHTML = html;
        }.bind(this));
    };
    return self;
});