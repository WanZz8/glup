define(function () {
    return {
        basicPrice:50.00,
        stock:[],
        realTime:{},
        totalVolume:0,
        init:function () {
            var now = new Date();
            var frame = now.getTime() - 18000000;
            for(var i = 0;i <= 299;i++){
                frame += (i === 0 ? i : (1000*60));
                var volume = (Math.random() * 8000).toFixed(0);
                this.basicPrice = this.basicPrice.add((3 - Math.random()*6).toFixed(2));
                this.totalVolume = this.totalVolume.add(volume);
                this.stock.push([this.basicPrice,0.00,volume,mcm.tool.formatDate(frame,'hi'),this.totalVolume]);
            }
        },
        minute:function () {
            var r = this.stock.slice(-300).map(function (e) {
                return e.join(',');
            });
            return r.join(';');
        }
    };
});