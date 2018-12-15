/**   2017/9/29   by alen   **/
define(['page'], function (page) {

    let self = new page('mine-setting');

    Object.assign(self, {
        init() {
            const url = location.hash.replace('#', '');
            this.selected = url.split('?')[0];
            this.copy('init');
        },
        onEnter(){
            mcm.schedule.addEventListener('resetSetting', this.rebuild, this)
        },
        onExit(){
            mcm.schedule.removeEventListeners(this);
            this.copy('onExit');
        },
        switch(v, e) {
            $(e.currentTarget).addClass('active').siblings().removeClass('active');
            mcm.tool.browserInterceptor(v);
        }
    });

    return self;
});