'use strict';
if (typeof module !== 'undefined' && module && module.exports) {
    // import from './js/lib/tv/charting_library.min.js';
    // import Datafeeds from './js/lib/tv/datafeed.js';
    // import config from './config.js';
}

let chart = function (config) {
    return {
        study:[],
        table: null,
        widget: null,
        init(options) {
            if (!options.dom)
                return console.error('缺少chart容器ID');

            if (!options.code)
                return console.error('缺少初始商品ID');

            let widget = this.widget = new TradingView.widget({
                fullscreen: false,
                // width: 375,
                // height: 400,
                symbol: options.code,
                interval: '1',
                timezone: 'Asia/Hong_Kong',
                timeframe:'1D',
                container_id: options.dom,
                //	BEWARE: no trailing slash is expected in feed URL
                datafeed: new Datafeeds.UDFCompatibleDatafeed("/api/tv/tradingView", config.quoteHost, options.frequency || 1000),
                library_path: "js/charting_lib/",
                locale: "zh",
                //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
                // drawings_access: {type: 'black', tools: [{name: "Regression Trend"}]},
                toolbar_bg: '#ffffff',
                disabled_features: [
                    "use_localstorage_for_settings",
                    "adaptive_logo",
                    "header_symbol_search",
                    "header_saveload",
                    "header_screenshot",
                    "header_settings",
                    "header_compare",
                    "header_undo_redo",
                    "timeframes_toolbar",
                    "remove_library_container_border",
                    "border_around_the_chart",
                    "display_market_status"
                ],
                enabled_features: [
                    "study_templates",
                    "keep_left_toolbar_visible_on_small_screens",
                    "side_toolbar_in_fullscreen_mode",
                    "property_pages",
                    "panel_context_menu",
                ],
                // charts_storage_url: 'http://saveload.tradingview.com',
                // charts_storage_api_version: "1.1",
                user_id: 'jailecoeu',
                overrides: {
                    'paneProperties.vertGridProperties.color': "#f8f8f8",
                    'paneProperties.horzGridProperties.color': "#f8f8f8",

                    'paneProperties.legendProperties.showSeriesTitle': false,
                    // 'paneProperties.legendProperties.showStudyTitles': false,
                    // 'paneProperties.legendProperties.showStudyValues': false,
                    'paneProperties.legendProperties.showLegend': false,

                    'mainSeriesProperties.candleStyle.upColor': "#e34c4c",
                    'mainSeriesProperties.candleStyle.downColor': "#00b38f",
                    'mainSeriesProperties.candleStyle.drawWick': true,
                    'mainSeriesProperties.candleStyle.drawBorder': false,
                    'mainSeriesProperties.candleStyle.borderColor': "#378658",
                    'mainSeriesProperties.candleStyle.borderUpColor': "#e34c4c",
                    'mainSeriesProperties.candleStyle.borderDownColor': "#00b38f",
                    'mainSeriesProperties.candleStyle.wickUpColor': '#e34c4c',
                    'mainSeriesProperties.candleStyle.wickDownColor': '#00b38f',
                    'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
                    'mainSeriesProperties.areaStyle.color1': "#32577a",
                    'mainSeriesProperties.areaStyle.color2': "#ffffff",
                    'mainSeriesProperties.areaStyle.linecolor': "#32577a",
                    // LINESTYLE_SOLID = 0
                    // LINESTYLE_DOTTED = 1
                    // LINESTYLE_DASHED = 2
                    // LINESTYLE_LARGE_DASHED = 3
                    'mainSeriesProperties.areaStyle.linestyle': 0,
                    'mainSeriesProperties.areaStyle.linewidth': 1,
                    'mainSeriesProperties.areaStyle.priceSource': "close",
                },
                // preset: "mobile",
                autosize: true,
                studies_overrides: {
                    "volume.volume.color.0": "#00b38f",
                    "volume.volume.color.1": "#e34c4c",
                    "volume.volume.transparency": 30,
                }
            });

            widget.onChartReady(() => {
                this.table = this.widget.chart();
                this.table.createStudy('Volume', false, false, [], (entityId)=>{
                    this.study.push(entityId);
                }, {
                    'volume ma.color': "rgba(132,170,213,0.7)"
                });
                // STYLE_BARS = 0;
                // STYLE_CANDLES = 1;
                // STYLE_LINE = 2;
                // STYLE_AREA = 3;
                // STYLE_HEIKEN_ASHI = 8;
                // STYLE_HOLLOW_CANDLES = 9;
                this.table.setChartType(3);
                this.table.onIntervalChanged().subscribe(null,  (interval, obj)=> {
                // || interval === '3' || interval === '5' || interval === '15' || interval === '60'
                    if (interval === '1' ) {
                        this.table.setChartType(3);
                        if(this.study.length > 0){
                            for(let i = 0,len = this.study.length;i<len;i++){
                                let entityId = this.study.pop();
                                this.table.removeEntity(entityId);
                            }
                        }
                        this.table.createStudy('Volume', false, false, [], (entityId)=>{
                            this.study.push(entityId);
                        }, {
                            'volume ma.color': "rgba(132,170,213,0.7)"
                        });
                    } else {
                        this.table.setChartType(1);
                        if(this.study.length === 1){
                            let entityId = this.study.pop();
                            this.table.removeEntity(entityId);
                            this.table.createStudy('Moving Average', true, false, [5, "close", 0], (entityId)=>{
                                this.study.push(entityId);
                            }, {
                                'plot.color': "rgba(150,95,196,0.7)"
                            });
                            this.table.createStudy('Moving Average', true, false, [10, "close", 0], (entityId)=>{
                                this.study.push(entityId);
                            }, {
                                'plot.color': "rgba(132,170,213,0.7)"
                            });
                            this.table.createStudy('Moving Average', true, false, [20, "close", 0], (entityId)=>{
                                this.study.push(entityId);
                            }, {
                                'plot.color': "rgba(85,178,99,0.7)"
                            });
                            this.table.createStudy('Moving Average', true, false, [40, "close", 0], (entityId)=>{
                                this.study.push(entityId);
                            }, {
                                'plot.color': "rgba(183,36,138,0.7)"
                            });
                            this.table.createStudy('Volume', false, false, [], (entityId)=>{
                                this.study.push(entityId);
                            }, {
                                'volume ma.color': "rgba(132,170,213,0.7)"
                            });
                        }
                    }
                })
            })
        },
        swap(options) {
            if (!options)
                return console.error('切换表格缺少参数 options');
            //todo 模式一 切换类型
            if (!!options.type && !options.code) {
                this.table.setResolution(options.type)
            }

            //todo 模式二 切换合约
            if (!!options.code && !options.type) {
                this.table.setSymbol(options.code);
            }

            //todo 模式三 切换模式与合约
            if (!!options.code && !!options.type) {
                this.widget.setSymbol(options.code, options.type);
            }
        },
        exit() {
            this.widget.options.datafeed.unsubscribeAll();
            this.widget && this.widget.remove();
            this.widget = null;
            this.table = null;
        }
    }
};

if (!!define) {
    define(['deploy', 'TradingView', 'dataFeeds'], chart)
} else if (typeof module !== 'undefined' && module && module.exports) {
    module.exports = chart();
} else {
    console.error('请在AMD或者CMD项目中使用该模块')
}