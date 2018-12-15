/**
 * Created by wildeChen on 2017/2/9.
 */

define(['cookie'], function (cookie) {

    var cache = function () {
        this._accountInfo = null;
        this._bankInfo = null;
        this._isLogin = null;
        this._init = true;
    };

    var proto = cache.prototype;

    proto.setLogin = function () {
        this._isLogin = true;
        cookie('login', true);
        this.loadUserInfo();
    };

    proto.setLogout = function () {
        this._isLogin = false;
        this._init = true;
        this._bankInfo = null;
        this._accountInfo = null;
        cookie('login', null);
        mcm.tool.browserInterceptor('home');
        mcm.schedule.dispatchEvent('loginStatus', false, null);
        mcm.net.send({
            url: '/api/sso/user_logout',
            type: 'GET'
        }, false).then(function (result) {
            $('.userInfo').hide();
        });
    };

    proto.getLogin = function (callback) {
        var self = this;
        var token = cookie('login');
        if (token !== undefined && token !== null) {
            mcm.net.send({
                url: '/api/user/isLogin.htm'
            }, true).then(function (result) {
                if (result && result.isLogin) {
                    self._isLogin = true;
                    cookie('login', true);
                    self.loadUserInfo();
                    if (callback)
                        callback();
                } else {
                    self._isLogin = false;
                    cookie('login', null);
                    if (callback)
                        callback();
                }
            });
        } else {
            return false;
        }
        return '';
    };

    proto.isLogin = function () {
        return this._isLogin;
    };


    proto.loadUserInfo = function () {
        /**
         * 请求用户信息
         */
        mcm.net.send({
            url: '/api/mine/index.htm',
            type: 'GET'
        }, true).then(function (result) {
            var userInfo = result['user'];
            userInfo.money = result['asset'] && result['asset'].money || 0;
            userInfo.hello = result.hello;
            this._accountInfo = userInfo;
            this.loadUserInfoCallback();
        }.bind(this));

        /**
         * 请求银行卡信息
         */
        mcm.net.send({
            url: '/api/mine/bankCard.htm',
            type: 'GET'
        }, true).then(function (result) {
            this._bankInfo = result['bankCards'];
            this.loadUserInfoCallback();
        }.bind(this));

    };

    proto.loadUserInfoCallback = function () {
        if (this._bankInfo === null || this._accountInfo === null)
            return;
        this._init = false;
        mcm.schedule.dispatchEvent('loginStatus', false, null);
        mcm.schedule.dispatchEvent('loginDelay', false, null);
        mcm.schedule.dispatchEvent('loadingDelay', false, null);
    };

    proto.getUserInfo = function () {
        return {
            accountInfo: this._accountInfo,
            bankInfo: this._bankInfo
        }
    };

    proto.getStatus = function () {
        return this._init;
    };

    proto.getAccountInfo = function () {
        return this._accountInfo
    };

    proto.getBankInfo = function () {
        return this._bankInfo
    };

    proto.setOverage = function (value) {
        mcm.schedule.dispatchEvent('getOverage', false, value)
    };

    proto.getOverage = function () {
        mcm.net.send({
            url: '/api/mine/index.htm',
            type: 'GET'
        }, true).then(function (result) {
            this.setOverage(result['asset'] && result['asset'].money || 0);
        }.bind(this));
    };

    proto.setSimBalance = function (value) {
        mcm.schedule.dispatchEvent('getSimBalance', false, value)
    };

    proto.error = function (code) {
        if (!code)
            return mcm.alert.sp('main', '请求超时,请稍后重试', 'alert', [{name: '确定'}]);

        if (code !== 430 && code !== 403) {
            return true;
        } else {
            mcm.alert.sp('main', '请登录后再重试', 'alert', [{name: '确定'}]);
            mcm.cache.setLogout();
            return false;
        }

    };

    return cache;
});