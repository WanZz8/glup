/**   2017/10/10   by alen   **/
/**   2018/2/5  edit by Wilde   **/
define(['page', 'encode'], function (page) {

    let self = new page('withdraw');

    Object.assign(self, {
            param: {
                money: 0
            },
            input: {
                money: '',
                password: ''
            },
            cache: {
                type: 0,
                id: null,
                bankList: false,
                qr: false
            },
            onEnter() {
                mcm.cache.getOverage();
                this.inquiryCards();
                mcm.schedule.addEventListener('getOverage', this.getOverage, this);
            },
            onExit() {
                mcm.schedule.removeEventListeners(this);
                this.copy('onExit');
            },
            getOverage(sender, value) {
                this.param.money = value;
            },
            selectMethod(type, e) {
                const t = $(e.currentTarget);
                if (t.hasClass('active'))
                    return;

                t.addClass('active').siblings('li').removeClass('active');
                this.cache.type = Number(type);
                if (this.cache.type) {
                    this.inquiryQR();
                } else {
                    this.inquiryCards();
                }
            },
            inquiryQR() {
                mcm.net.send({
                    url: '/api/user/alipayOper.htm',
                    type: 'GET',
                    data: {
                        action: 'info'
                    }
                }, true).then((result) => {
                    const {errorCode} = result;
                    if (errorCode === 500) {
                        //todo 实名验证
                        mcm.tool.browserInterceptor('mine-setting-cert');
                        mcm.alert.sp(this.url, '请先进行实名认证', 'normal', [{name: '确定'}]);
                    } else {
                        const {Accounts: [link]} = result;
                        if (!link) {
                            //todo 显示未绑定QR
                            mcm.alert.sp(self.url, '您当前还未绑定支付宝，请先绑定支付宝', 'warn', [{name: '确定'}]);
                        } else {
                            $('#alipayQR').qrcode(link.qrcodeUrl);
                            this.cache.id = link.id;
                            this.cache.qr = true;
                            this['qrNode'].show();
                            this['bankNode'].hide();
                        }
                    }
                });
            },
            inquiryCards() {
                if (!this.cache.bankList) {
                    mcm.net.send({
                        url: '/api/pay/withdraw.htm',
                        type: 'GET',
                        retry: true,
                        timeout: 3000,
                        delay: 500
                    }, true).then(({identityAuth, bankCards}) => {
                        if (!identityAuth) {
                            mcm.tool.browserInterceptor('mine-setting-cert');
                            mcm.alert.sp(this.url, '请先进行实名认证', 'normal', [{name: '确定'}]);
                        } else if (bankCards.length === 0) {
                            mcm.alert.sp(self.url, '您当前还未绑定银行卡，请先绑定银行卡', 'warn', [{name: '确定'}]);
                        } else {
                            let html = '';
                            let list = bankCards;
                            for (let i = 0, len = list.length; i < len; i++) {
                                if (i === 0) {
                                    html += `<li class="selected" data-param='${list[i].id}' data-events="click:selectCard;">`;
                                    html += '<input type="radio" checked="checked" name="type">';
                                } else {
                                    html += `<li data-param ='${list[i].id}' data-events="click:selectCard;">`;
                                    html += `<input type="radio" name="type" value="${list[i].id}">`;
                                }
                                html += `<img src="./images/bank/${list[i].bank}.png">`;
                                html += `<span class="number">卡号：${list[i].card} </span>`;
                                html += '</li>';
                            }
                            this.appendTemplate(html, '.cardList');
                            this.cache.bankList = true;
                            this['bankNode'].show();
                        }
                    });
                } else {
                    this['bankNode'].show();
                    this['qrNode'].hide();
                }
            },

            selectCard(e) {
                const t = $(e.currentTarget);
                t.addClass('selected').siblings().removeClass('selected');
            },
            submit() {
                // if (!checkTimeAvailable()) {
                //     mcm.alert.sp(self.url, '请在07:00-23:00时间段提现', 'normal', [{name: '确定'}]);
                //     return;
                // }
                if (!self.input.money) {
                    mcm.alert.sp(self.url, '输入充值金额', 'normal', [{name: '确定'}]);
                    return;
                }
                if (self.input.money < 100) {
                    mcm.alert.sp(self.url, '单笔提款最低100元', 'normal', [{name: '确定'}]);
                    return;
                }
                if (!self.input.password) {
                    mcm.alert.sp(self.url, '输入提款密码', 'normal', [{name: '确定'}]);
                    return;
                }

                let o = {
                    action: 'apply',
                    money: this.input.money,
                    password: this.input.password,
                    type: this.cache.type
                };
                if (!this.cache.type) {
                    //todo 银行卡判断
                    let bank = $('.bank-right .selected').attr('data-param');
                    if (bank === '') {
                        mcm.alert.sp(self.url, '请选择银行卡', 'normal', [{name: '确定'}]);
                        return;
                    }
                    o.bankCard = bank;
                } else {
                    //todo 支付宝判断
                    o.bankCard = this.cache.id;
                }

                mcm.net.send({
                    url: '/api/pay/withdraw.htm',
                    data:o,
                    retry: true,
                    timeout: 3000,
                    delay: 500
                }).then((result) => {
                    mcm.alert.sp(self.url, result.errorMsg, 'normal', [{name: '确定'}]);
                    if (result.success) {
                        window.location.href = '#mine-setting-info';
                    }
                });
            },
            money() {
                if (!self.input.money) {
                    self.input.money = '';
                    return;
                }
                if (!mcm.tool.verify.checkIdNumber(self.input.money)) {
                    self.input.money = self.input.money.substr(0, self.input.money.length - 1);
                }
                if (self.input.money > self.param.money) {
                    self.input.money = self.param.money;
                }
            }
        }
    );

    //验证是否在体现时间段内
    function checkTimeAvailable() {
        let start = new Date();
        let end = new Date();
        let now = new Date();
        //每日提现时间 07:00-23:00
        start.setHours(7);
        start.setMinutes(0);
        end.setHours(23);
        end.setMinutes(0);
        return now.getTime() - start.getTime() > 0 && now.getTime() - end.getTime() < 0;
    }

    return self;
});