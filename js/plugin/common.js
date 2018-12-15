//Common模块

define(function () {
    var Common = {

        getSearch: function () {
            var search = {};
            var address = location.hash;
            address = address.split('?');
            if (address.length > 1) {
                address = address[1].split('&');
                for (var i = 0, len = address.length; i < len; i++) {
                    var key = address[i].split('=');
                    search[key[0]] = key[1];
                }
            }

            return search;
        },

        forRounding: function (Digital, How) {
            Digital = Math.round(Digital * Math.pow(10, How)) / Math.pow(10, How);
            return Digital;
        },

        isOwnEmpty: function (obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    return false;
                }
            }
            return true;
        },

        combination: function (n, m) {
            m = parseInt(m);
            n = parseInt(n);
            if (m < 0 || n < 0) {
                return false;
            }
            if (m == 0 || n == 0) {
                return 1;
            }
            if (m > n) {
                return 0;
            }
            if (m > n / 2.0) {
                m = n - m;
            }

            var result = 0.0;
            for (i = n; i >= (n - m + 1); i--) {
                result += Math.log(i);
            }
            for (i = m; i >= 1; i--) {
                result -= Math.log(i);
            }
            result = Math.exp(result);
            return Math.round(result);
        },

        //数字大小排序-CP用
        sortNum: function (a, b) {
            a = a.toString();
            b = b.toString();
            a = parseInt(a, 10);
            b = parseInt(b, 10);
            if (isNaN(a) || isNaN(b)) {
                return true;
            }
            return (a - b);
        },

        //投注数组序列化
        arraySerialization: function (arr, type) {
            var temp = [];
            var tempStr = '';

            if (type == 1) { //模式1,拼接投注用的字符串

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != '' && arr[i] != null) {

                        temp.push(arr[i].sort(Common.sortNum).join('&'));

                    }
                }
                tempStr = temp.join('|');
                return tempStr;
            } else if (type == 2) { //模式2,拼接显示用的字符串
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != '' && arr[i] != null) {
                        temp.push(arr[i].sort(Common.sortNum).join(''));
                    }
                }
                tempStr = temp.join();
                return tempStr;
            }

        },

        /**
         * 获取指定组合的所有可能性
         *
         * 例子：5选3
         * $aBaseArray = array('01','02','03','04','05');
         * ----getCombination($aBaseArray,3)
         * 1.初始化一个字符串：11100;--------1的个数表示需要选出的组合
         * 2.将1依次向后移动造成不同的01字符串，构成不同的组合，1全部移动到最后面，移动完成：00111.
         * 3.移动方法：每次遇到第一个10字符串时，将其变成01,在此子字符串前面的字符串进行倒序排列,后面的不变：形成一个不同的组合.
         *            如：11100->11010->10110->01110->11001->10101->01101->10011->01011->00111
         *            一共形成十个不同的组合:每一个01字符串对应一个组合---如11100对应组合01 02 03;01101对应组合02 03 05
         *
         *
         * @param  {Array} aBaseArray 基数数组
         * @param  {int}   iSelectNum 选数
         * @author mark
         *
         */
        getCombination: function (aBaseArray, iSelectNum) {
            var self = this;

            var iBaseNum = aBaseArray.length;
            var aResult = [];
            var aString = [];
            if (iSelectNum > iBaseNum) {
                return aResult;
            }
            if (iSelectNum == 1) {
                return aBaseArray;
            }
            if (iBaseNum == iSelectNum) {
                aResult[0] = aBaseArray.join(",");
                return aResult;
            }
            var sString = '';
            var sLastString = '';
            var sTempStr = '';
            for (var i = 0; i < iSelectNum; i++) {
                sString += '1';
                sLastString += '1';
            }
            for (var j = 0; j < iBaseNum - iSelectNum; j++) {
                sString += '0';
            }
            for (var k = 0; k < iSelectNum; k++) {
                sTempStr += aBaseArray[k] + ',';
            }
            aResult[0] = sTempStr.substr(0, sTempStr.length - 1);
            var count = 1;
            sTempStr = '';
            while (sString.substr(sString.length - iSelectNum, iSelectNum) != sLastString) {
                sString = self.moveString(sString);
                for (var k = 0; k < iBaseNum; k++) {
                    if (sString.substr(k, 1) == '1') {
                        sTempStr += aBaseArray[k] + ',';
                    }
                }
                aResult[count] = sTempStr.substr(0, sTempStr.length - 1);
                sTempStr = '';
                count++;
            }
            return aResult;
        },

        //移动字符串
        moveString: function (sString) {
            var top = '';//开始符串
            var middle = '01';//中间字符串
            var bottom = '';//结束符串
            var tmpone = '';
            var tmptwo = '';
            var find = false;//是否找到分隔字符串
            var findfirst = false;//找到第一个字符
            for (var m = 0; m < sString.length; m++) {
                if (find == false) {
                    top += sString.substr(m, 1);
                }
                if (find == false && sString.substr(m, 1) == '1') {
                    findfirst = true;
                } else if (find == false && findfirst == true && sString.substr(m, 1) == '0') {
                    find = true;
                } else if (find == true) {
                    bottom += sString.substr(m, 1);
                }
            }
            top = top.substr(0, top.length - 2);
            for (var n = 0; n < top.length; n++) {
                if (top.substr(n, 1) == '1') {
                    tmpone += top.substr(n, 1);
                } else if (top.substr(n, 1) == '0') {
                    tmptwo += top.substr(n, 1);
                }
            }
            top = tmpone + tmptwo;
            return top + middle + bottom;
        },

        //格式化金额数字
        formatCurrency: function (num) {
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num))
                num = "0";
            var sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            var cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10)
                cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                    num.substring(num.length - (4 * i + 3));
            return (((sign) ? '' : '-') + num + '.' + cents);
        },

        //倒计时,输入秒数,输出时间
        timeDown: function (second, noZero) {
            var day = '', hour = '', minute = '';
            if (second >= 86400) {
                day = Math.floor(second / 86400);
                day += '';
                second = second % (86400);
            }
            if (second >= 3600) {
                hour = Math.floor(second / 3600);
                hour += '';
                hour = hour.length < 2 && !noZero ? ('0' + hour) : hour;
                second = second % 3600;
            }
            if (second >= 60) {
                minute = Math.floor(second / 60);
                minute += '';
                minute = minute.length < 2 && !noZero ? ('0' + minute) : minute;
                second = second % 60;
            } else {
                minute = '00';
            }
            if (second >= 0) {
                second += '';
                second = second.length < 2 && !noZero ? ('0' + second) : second;
            }
            return [day, hour, minute, second];
        },

        //Buffer转换成Base64字符串
        arrayBufferToBase64: function (buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        },

        //获取剩余天数
        getLeftDayInMonth: function () {
            var today = new Date();
            var now = today.getDate();
            var year = today.getYear();
            if (year < 2000) year += 1900; // Y2K fix
            var month = today.getMonth();
            var monArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            // check for leap year
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) monArr[1] = "29";
            return (monArr[month] - now) * 24 * 3600;
        },

        //获取今日剩余时间
        getExpire: function () {

            var today = new Date();

            today.setHours(0);

            today.setMinutes(0);

            today.setSeconds(0);

            today.setMilliseconds(0);

            //明日0点时间戳

            var tomorrow_0 = today.getTime() / 1000 + (24 * 3600);

            var current_time = Math.round(new Date().getTime() / 1000);

            return tomorrow_0 - current_time;

        },

        //获取今日前的某一个天日期,若不传值则获取今天的日期
        //返回的日期格式为标准日期标签的格式
        //example:2016-08-10 0:0:0
        /**
         *
         * @param {Number} [days] 距离今天的天数,不传或者0则为今天
         * @param {Number} [type] 设置返回的时间规则,0或不传为当前时间,1为0时0分0秒,2为23时59分59秒
         * @returns {*}
         */
        getOneDateBeforeToday: function (days, type) {
            var num = days || 0;

            if (typeof(num) != 'number') {
                console.log('传入参数类型不是数字', num);
                return null;
            }

            if (String(num).indexOf('.') != -1) {
                console.log('传入参数类型不是整数', num);
                return null;
            }

            if (String(num).indexOf('-') != -1) {
                console.log('不能传入负数', num);
                return null;
            }

            var today = new Date();
            today.setDate(today.getDate() - num);
            var year = today.getFullYear();
            var month = today.getMonth() + 1;
            month += '';
            if (month.length == 1)
                month = '0' + month;
            var day = today.getDate();
            day += '';
            if (day.length == 1)
                day = '0' + day;
            var hour = today.getHours();
            var minute = today.getMinutes();
            var second = today.getSeconds();

            if (type) {
                if (type === 1)
                    return year + '-' + month + '-' + day + ' 00:00:00';
                else
                    return year + '-' + month + '-' + day + ' 23:59:59';
            } else {
                return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            }
        },

        //日期转字符串
        transferDateToString: function (obj) {
            if (!obj instanceof Date) {
                console.log('传入对象错误,对象不是一个日期对象', obj);
                return null;
            }

            var year = obj.getFullYear();
            var month = obj.getMonth() + 1;
            month += '';
            if (month.length == 1)
                month = '0' + month;
            var day = obj.getDate();
            day += '';
            if (day.length == 1)
                day = '0' + day;
            var hour = obj.getHours();
            hour += '';
            if (hour.length == 1)
                hour = '0' + hour;
            var minute = obj.getMinutes();
            minute += '';
            if (minute.length == 1)
                minute = '0' + minute;
            var second = obj.getSeconds();
            second += '';
            if (second.length == 1)
                second = '0' + second;

            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

        },

        //百分比输出
        percent: function (number) {
            number = (number * 100).toFixed(2);
            return number.toString() + '%';
        },

        //页数计算
        pageCount: function (now, every) {
            return ((now - 1 - (now - 1) % every) / every) + 1;
        },

        //字符串加密成数字
        encrypt: function (code) {
            var back = 0;
            var team = code.split('');
            for (var i = 0, len = team.length; i < len; i++) {
                back += team[i].charCodeAt(0);
            }
            return back;
        },

        //传入作为密码本的时间基础
        encryptBookDate: function (book) {
            var now = parseInt(new Date().getTime().div(1000).toFixed());
            var base = parseInt(new Date(book).getTime().div(1000).toFixed());
            return now - base;
        },

        //求数字的因数个数
        countFactor: function (n) {
            if (n == 1)
                return 1;
            var f = 2;
            for (var i = 2; i <= Math.floor(Math.sqrt(n)); i++) {
                if (n % i == 0) {
                    if (Math.floor(Math.sqrt(n)) == Math.sqrt(n)) {
                        f += 1;
                    }
                    else {
                        f += 2;
                    }
                }
            }
            return f;
        },

        /**
         * 黑名单验证,提供字符串或数组形式的list,提供的字符串或数组中的字符串任意一个在黑名单中将返回false
         * @param list
         * @param staff
         */
        blackListValid:function (list,staff) {
            if(list instanceof Array)
                return Array.intersect(list,staff).length == 0;
            else
                return !staff.contains(list)
        },
        
        /**
         * @function 更新html模板 并重新绑定 data-element 和 data-events
         * @param  {object} pageClass 实例化后的Page对象{@link page} 作为绑定对象
         * @param  {String} html html模板字符串
         * @param  {HTMLElement} node 插入的dom节点
         */
        mergeContextTemplate: function (pageClass, html, node) {
            var html = html.replace(/[\r\n]/g, '');
            var node = $(node);
            var fragment = $(html);

            node.html(fragment);

            pageClass.bindDomNode(node);
            pageClass.bindEvents(node);
        },
        /**
         * 获取访问地址带的参数
         * @param {Object} name
         */
        getQueryParam: function(name){
        	var strURL = window.location.href;
		    return new RegExp( "(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i" ).test( strURL ) ?
		        decodeURIComponent( RegExp.$2.replace( /\+/g, " " ) ) : "";
        }
    };

    return Common;
});