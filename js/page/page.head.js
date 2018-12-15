/**   2017/9/22   by Wilde   **/
define(['page'], function (page) {

    var self = new page('head');

    self.param = {
        hello: '',
        username: '',
        money: 0.0
    };

    self.init = function () {
        var url = location.hash.replace('#', '');
        this.selected = url.split('?')[0];
        this.copy('init');
    };

    self.onEnter = function () {
        mcm.cache.getLogin();
        mcm.schedule.addEventListener('loginStatus', this.loginCallback, this);
        mcm.schedule.addEventListener('hashChange', this.selectedChange, this);
        mcm.schedule.addEventListener('getOverage', this.getOverage, this);
        mcm.schedule.addEventListener('tagChange', this.tagChange, this);
    };

    self.onExit = function () {
        mcm.state.endMultipleInquiry('headSimpleUpdate');
        mcm.schedule.removeEventListeners(this);
        self.copy('onExit');
    };

    self.switch = function (e) {
        var parent = $(e.currentTarget);
        var target = $(e.target);
        if (target[0].tagName !== 'A')
            return;
        if (target.hasClass('selected'))
            return;
        parent.find('a').removeClass('selected');
        target.addClass('selected');
    };

    self.selectedChange = function () {
        this.rebuild();
    };

    self.tagChange = function (sender, href) {
        this['toolBarNode'].find('a').removeClass('selected');
        this['toolBarNode'].find('[href=#' + href + ']').addClass('selected');
    };

    self.noticeChange = function (type) {
        if(type === 'simulate'){
            this['toolBarNode'].find('li>a').removeClass('selected');
            this['headSim'].addClass('selected');
        }else if(type === 'trade'){
            this['toolBarNode'].find('li>a').removeClass('selected');
            this['headReal'].addClass('selected');
        }
        setTimeout(()=> {
            mcm.schedule.dispatchEvent('noticeChange', false, true)
        }, 1);
    };


    self.loginCallback = function () {
        if (mcm.cache.isLogin()) {
            this['userInfoNode'].show();
            var info = mcm.cache.getAccountInfo();
            mcm.tool.insertObject(this.param, info);
        } else {
            this['userInfoNode'].hide();
        }
    };

    self.logout = function () {
        mcm.cache.setLogout();
    };

    self.getOverage = function (sender,value) {
        this.param.money = value;
    };

    return self;
});