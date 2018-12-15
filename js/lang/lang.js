define(['cookie'], function (cookie) {
    return function () {
        var support = ['zh-cn', 'en'];
        var cb = $.Deferred();

        var lang = window.navigator.language.toLowerCase();
        /**
         * 处理英语多语言地区的语言类型缩写
         */
        if (lang.indexOf('en') !== -1)
            lang = 'en';

        if(!contains(support,lang))
            lang = 'zh-cn';

        var select = cookie('lang');
        if(!!select && !contains(support,select))
            select = 'zh-cn';

        var language = select || lang;

        require(['../js/lang/' + 'zh-cn'], function (res) {
            cb.resolve(function (key) {
                if (!res[key]) {
                    console.warn('%s 无法匹配对应 %s 翻译', key, language);
                    return key;
                } else {
                    return res[key];
                }
            })
        });

        return cb;
    };

    function contains(target,element) {
        for (var i = 0; i < target.length; i++) {
            if (target[i] === element) {
                return true;
            }
        }
        return false;
    };
});