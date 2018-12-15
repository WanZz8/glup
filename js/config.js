/**
 * @namespace config
 */
define(function () {
    let DOM = {
        HEAD: 'head',
        FOOT: 'foot',
        RIGHT:'right',
        MAIN: 'main',
        SCHOOL: 'school',
        MINE: 'mine',
        SETTING: 'setting',
        AGENCY: 'agency',
        RECHARGE: 'recharge',
        POPUP: 'popUp'
    };

    return {
        'home':{
            address:'js/model/agent.html',
            renderer:DOM.MAIN,
            js:'../js/page/page.agent'
        },

        /*首页模块*/
        'noticeModel': {
            address: 'js/model/homeModel/notice.html'
        },

        'head': {
            address: 'js/model/head.html',
            renderer: DOM.HEAD,
            js: '../js/page/page.head'
        },


        /*
         |--------------------------------------------------------------------------
         | 登录窗口
         |--------------------------------------------------------------------------
        */
        'login': {
            address: 'js/model/login.html',
            renderer: DOM.POPUP,
            js: '../js/page/page.login'
        },

        /*英雄学院*/
        'mine': {
            address: 'js/model/mine/mine.html',
            renderer: DOM.MAIN,
            js: '../js/page/mine/page.mine'
        },

        /*我的交易*/
        'mine-deal': {
            address: 'js/model/mine/mine-deal.html',
            renderer: DOM.MINE,
            nexus: ['head','mine', 'mine-deal'],
            js: '../js/page/mine/page.mine.deal',
            depend: 'mine'
        },
        /*资金明细*/
        'mine-fund': {
            address: 'js/model/mine/mine-fund.html',
            renderer: DOM.MINE,
            nexus: ['head','head','mine', 'mine-fund'],
            js: '../js/page/mine/page.mine.fund',
            depend: 'mine'
        },

        /*个人设置*/
        'mine-setting': {
            address: 'js/model/mine/mine-setting.html',
            renderer: DOM.MINE,
            nexus: ['head','mine', 'mine-setting'],
            js: '../js/page/mine/page.mine.setting',
            depend: 'mine'
        },

        /*基本信息*/
        'mine-setting-info': {
            address: 'js/model/mine/mine-setting-info.html',
            renderer: DOM.SETTING,
            nexus: ['head','mine', 'mine-setting', 'mine-setting-info'],
            js: '../js/page/mine/page.mine.setting.info',
            depend: 'mine-setting'
        },
        /*实名认证*/
        'mine-setting-cert': {
            address: 'js/model/mine/mine-setting-cert.html',
            renderer: DOM.SETTING,
            nexus: ['head','mine', 'mine-setting', 'mine-setting-cert'],
            js: '../js/page/mine/page.mine.setting.cert',
            depend: 'mine-setting'
        },
        /*修改手机号*/
        'mine-setting-mobile': {
            address: 'js/model/mine/mine-setting-mobile.html',
            renderer: DOM.SETTING,
            nexus: ['head','mine', 'mine-setting', 'mine-setting-mobile'],
            js: '../js/page/mine/page.mine.setting.mobile',
            depend: 'mine-setting'
        },
        /*密码设置*/
        'mine-setting-password': {
            address: 'js/model/mine/mine-setting-password.html',
            renderer: DOM.SETTING,
            nexus: ['head','mine', 'mine-setting', 'mine-setting-password'],
            js: '../js/page/mine/page.mine.setting.password',
            depend: 'mine-setting'
        },
        /*银行卡管理*/
        'mine-setting-bank': {
            address: 'js/model/mine/mine-setting-bank.html',
            renderer: DOM.SETTING,
            nexus: ['head','mine', 'mine-setting', 'mine-setting-bank'],
            js: '../js/page/mine/page.mine.setting.bank',
            depend: 'mine-setting'
        },
        /*支付宝管理*/
        'mine-setting-alipay': {
            address: 'js/model/mine/mine-setting-alipay.html',
            renderer: DOM.SETTING,
            nexus: ['head','mine', 'mine-setting', 'mine-setting-alipay'],
            js: '../js/page/mine/page.mine.setting.alipay',
            depend: 'mine-setting'
        },

        /*新增银行卡*/
        'mine-setting-bank-add': {
            address: 'js/model/mine/mine-setting-bank-add.html',
            js: '../js/page/mine/page.mine.setting.bank.add',
            renderer: 'mine-setting-bank'
        },

        /*下级充提*/
        'mine-agency': {
            address: 'js/model/mine/mine-agency.html',
            renderer: DOM.MINE,
            nexus: ['head','mine', 'mine-agency'],
            js: '../js/page/mine/page.mine.agency',
            depend: 'mine'
        },
        /*我的用户*/
        'mine-agency-user': {
            address: 'js/model/mine/mine-agency-user.html',
            renderer: DOM.AGENCY,
            nexus: ['head','mine', 'mine-agency', 'mine-agency-user'],
            js: '../js/page/mine/page.mine.agency.user',
            depend: 'mine-agency'
        },
        /*团队盈亏*/
        'mine-agency-team':{
            address:'js/model/mine/mine-agency-team.html',
            renderer:DOM.AGENCY,
            nexus: ['head','mine', 'mine-agency', 'mine-agency-team'],
            js: '../js/page/mine/page.mine.agency.team',
            depend: 'mine-agency'
        },
        /*佣金报表*/
        // 'mine-agency-report': {
        //     address: 'js/model/mine/mine-agency-report.html',
        //     renderer: DOM.AGENCY,
        //     nexus: ['head','mine', 'mine-agency', 'mine-agency-report'],
        //     js: '../js/page/mine/page.mine.agency.report',
        //     depend: 'mine-agency'
        // },
        /*申请代理*/
        // 'mine-agency-apply': {
        //     address: 'js/model/mine/mine-agency-apply.html',
        //     renderer: DOM.AGENCY,
        //     nexus: ['head','mine', 'mine-agency', 'mine-agency-apply'],
        //     js: '../js/page/mine/page.mine.agency.apply',
        //     depend: 'mine-agency'
        // },
        /*下级开户*/
        'mine-subaccount': {
            address: 'js/model/mine/mine-subaccount.html',
            renderer: DOM.MINE,
            nexus: ['head','mine', 'mine-subaccount'],
            js: '../js/page/mine/page.mine.subaccount',
            depend: 'mine'
        },
        /*下级交易*/
        'mine-agency-subdeal': {
            address: 'js/model/mine/mine-agency-subdeal.html',
            renderer: DOM.AGENCY,
            nexus: ['head','mine', 'mine-agency', 'mine-agency-subdeal'],
            js: '../js/page/mine/page.mine.agency.subdeal',
            depend: 'mine-agency'
        },
        //提款
        'withdraw': {
            address: 'js/model/withdraw.html',
            renderer: DOM.MAIN,
            js: '../js/page/page.withdraw',
            nexus: ['head','withdraw']
        },

        /*个人设置-银行卡模块*/
        'module-mine-setting-card-list': {
            address: 'js/model/module/module-mine-setting-card-list.html'
        },
        //分页模块
        'module-page': {
            address: 'js/model/module/module-page.html'
        },
        //资金明细
        'module-mine-fund': {
            address: 'js/model/module/module-mine-fund.html'
        },
        //代理中心我的用户
        'module-agency-user': {
            address: 'js/model/module/module-agency-user.html'
        },
        //代理中心下级交易
        'module-agency-subdeal': {
            address: 'js/model/module/module-agency-subdeal.html'
        },
        //佣金报表
        'module-agency-report': {
            address: 'js/model/module/module-agency-report.html'
        },
        //团队盈亏
        'module-agency-team':{
            address: 'js/model/module/module-agency-team.html'
        },

        /*
         |--------------------------------------------------------------------------
         | 模块文件
         |--------------------------------------------------------------------------
        */
        // 'ui-alert': {
        //     address: 'js/model/layer/alert.html'
        // },
        'ui-normal': {
            address: 'js/model/layer/normal.html'
        },

        /*
         |--------------------------------------------------------------------------
         | 零件
         |--------------------------------------------------------------------------
        */
        'stocksLoading': {
            address: 'js/model/component/stockLoading.html'
        },
        'pageController': {
            address: 'js/model/component/pageController.html'
        }

    }
});