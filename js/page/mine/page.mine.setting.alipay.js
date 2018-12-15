define(['page', 'qrcode', 'encode'], function (page, qrcode) {
    let self = new page('mine-setting-alipay');
    const {qrCode} = qrcode;
    Object.assign(self, {
        cache: {
            status: 0,
            id: null,
            link: null
        },
        onEnter() {
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
                    mcm.schedule.dispatchEvent('resetSetting', false, true);
                    mcm.alert.sp(this.url, '请先进行实名认证', 'normal', [{name: '确定'}]);
                } else {
                    const {Accounts: [link]} = result;
                    if (!link) {
                        $('.decodeQR').show();
                    } else {
                        this.cache.id = link.id;
                        const qr = link.qrcodeUrl;
                        $('.encodeQR').show();
                        $('#alipayQR').qrcode(qr);
                        this.cache.status = 1;
                    }
                }
            });
        },
        file(e) {
            let f = $(e.currentTarget);
            f = f.prop('files')[0];
            const url = getObjectURL(f);
            qrCode.decode(url);
            qrCode.callback = function (imgMsg) {
                if (imgMsg.indexOf('QR.ALIPAY') === -1) {
                    mcm.alert.sp(self.url, '上传的图片不是有效的收钱码', 'alert', [{name: '确定'}])
                } else {
                    self.cache.link = imgMsg;
                    $('.encodeQR').show();
                    $('.decodeQR').hide();
                    $('#alipayQR').qrcode(imgMsg);
                }
            }
        },
        submit() {
            let o = {
                qrcodeUrl: this.cache.link,
                defaultFlag: true
            };
            o.action = this.cache.status ? 'update' : 'binding';
            if (!!this.cache.id)
                o.id = this.id;

            mcm.net.send({
                url: '/api/user/alipayOper.htm',
                type: 'GET',
                data: o
            }).then((e) => {
                mcm.alert.sp(this.url, !!this.id ? '修改成功' : '绑定成功', 'normal', [{name: '确定'}]);
                mcm.renderer.refresh(this);
            })
        }
    });

    function getObjectURL(file) {
        let url = null;
        if (window.createObjectURL !== undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL !== undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL !== undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    return self;
});