﻿define(function() {
    var dsy={
        data:{},
        add:function(key,value)
        {
            var self = this;
            self.data[key] = value;
        },
        getList : function(index1,index2)
        {
            var self = this;
            if(index1 == undefined)
            {
                return self.data["0"];
            }

            if(index2 == undefined)//返回第二级的地址
            {
                return self.data["0_"+index1];
            }
            else//返回第三级的地址
            {
                return self.data["0_"+index1+"_"+index2];
            }
        }
    };

    dsy.add("0",["北京市","上海市","天津市","重庆市","广西区","内蒙古区","宁夏区","西藏区","新疆区","广东省","贵州省","海南省","河北省","河南省","黑龙江省","湖北省","湖南省","吉林省","江苏省","江西省","辽宁省","青海省","山东省","山西省","陕西省","四川省","云南省","浙江省","甘肃省","安徽省","福建省"]);

    dsy.add("0_0",["北京市"]);
    dsy.add("0_0_0",["东城区","西城区","宣武区","房山区","崇文区","海淀区","朝阳区","丰台区","门头沟区","石景山区","通州区","顺义区","昌平区","大兴区","怀柔区","平谷区","密云县","延庆县"]);

    dsy.add("0_1",["上海市"]);
    dsy.add("0_1_0",["黄浦区","卢湾区","静安区","徐汇区","虹口区","长宁路","普陀区","闸北区","杨浦区","浦东新区","宝山区","嘉定区","闵行区","松江区","青浦区","南汇区","奉贤区","金山区","崇明县"]);

    dsy.add("0_2",["天津市"]);
    dsy.add("0_2_0",["和平区","河东区","河西区","南开区","河北区","红桥区","塘沽区","汉沽区","大港区","东丽区","西青区","津南区","北辰区","武清区","宝坻区","宁河县","静海县","蓟县"]);

    dsy.add("0_3",["重庆市"]);
    dsy.add("0_3_0",["万州区","涪陵区","渝中区","大渡口区","江北区","沙坪坝区","九龙坡区","南岸区","北碚区","万盛区","双桥区","渝北区","巴南区","黔江区","长寿区","綦江县","潼南县","铜梁县","大足县","荣昌县","璧山县","梁平县","城口县","丰都县","垫江县","武隆县","忠县","开县","云阳县","奉节县","巫山县","巫溪县","石柱土家族自治县","秀山土家族苗族自治县","酉阳土家族苗族自治县","彭水苗族土家族自治县", "永州区"]);


    dsy.add("0_4",["百色市","北海市","崇左市","防城港市","桂林市","贵港市","河池市","贺州市","来宾市","柳州市","南宁市","钦州市","梧州市","玉林市"]);
    dsy.add("0_4_0",["市辖区","右江区","德保县","靖西县","乐业县","凌云县","隆林各族自治县","那坡县","平果县","田东县","田林县","田阳县","西林县"]);
    dsy.add("0_4_1",["市辖区","海城区","银海区","铁山港区","合浦县"]);
    dsy.add("0_4_2",["市辖区","崇左市","大新县","扶绥县","龙州县","宁明县","凭祥市","天等县"]);
    dsy.add("0_4_3",["市辖区","港口区","防城区","东兴市","上思县"]);
    dsy.add("0_4_4",["市辖区","秀峰区","叠彩区","象山区","七星区","雁山区","恭城瑶族自治县","灌阳县","桂林市","荔浦县","临桂县","灵川县","龙胜各族自治县","平乐县","全州县","兴安县","阳朔县","永福县","资源县"]);
    dsy.add("0_4_5",["市辖区","港北区","港南区","覃塘区","桂平市","平南县"]);
    dsy.add("0_4_6",["市辖区","金城江区","巴马瑶族自治县","大化瑶族自治县","东兰县","都安瑶族自治县","凤山县","环江毛南族自治县","罗城仡佬族自治县","大化瑶族自治县","南丹县","天峨县","宜州市"]);
    dsy.add("0_4_7",["市辖区","八步区","富川瑶族自治县","昭平县","钟山县"]);
    dsy.add("0_4_8",["市辖区","兴宾区","合山市","金秀瑶族自治县","武宣县","象州县","忻城县"]);
    dsy.add("0_4_9",["市辖区","城中区","鱼峰区","柳南区","柳北区","柳城县","柳江县","柳州市","鹿寨县","融安县","融水苗族自治县","三江侗族自治县"]);
    dsy.add("0_4_10",["市辖区","兴宁区","青秀区","江南区","西乡塘区","良庆区","邕宁区","宾阳县","横县","隆安县","马山县","南宁市","上林县","武鸣县","邕宁县"]);
    dsy.add("0_4_11",["市辖区","钦南区","钦北区","灵山县","浦北县"]);
    dsy.add("0_4_12",["市辖区","万秀区","蝶山区","长洲区","苍梧县","蒙山县","藤县","岑溪市"]);
    dsy.add("0_4_13",["市辖区","玉州区","北流市","博白县","陆川县","容县","兴业县"]);


    dsy.add("0_5",["阿拉善盟","巴彦淖尔盟","包头市","赤峰市","鄂尔多斯","呼和浩特市","呼伦贝尔","通辽市","乌海市","乌兰察布盟","锡林郭勒盟","兴安盟"]);
    dsy.add("0_5_0",["阿拉善右旗","阿拉善左旗","额济纳旗"]);
    dsy.add("0_5_1",["杭锦后旗","临河市","乌拉特后旗","乌拉特前旗","乌拉特中旗","五原县","磴口县"]);
    dsy.add("0_5_2",["市辖区","东河区","昆都仑区","青山区","石拐区","白云矿区","九原区","达尔罕茂明安联合旗","固阳县","土默特右旗"]);
    dsy.add("0_5_3",["市辖区","红山区","元宝山区","松山区","阿鲁科尔沁旗","敖汉旗","巴林右旗","巴林左旗","喀喇沁旗","克什克腾旗","林西县","宁城县","翁牛特旗"]);
    dsy.add("0_5_4",["东胜区","达拉特旗","鄂尔多斯市","鄂托克旗","鄂托克前旗","杭锦旗","乌审旗","伊金霍洛旗","准格尔旗"]);
    dsy.add("0_5_5",["市辖区","新城区","回民区","玉泉区","赛罕区","和林格尔县","清水河县","土默特左旗","托克托县","武川县"]);
    dsy.add("0_5_6",["市辖区","海拉尔区","阿荣旗","陈巴尔虎旗","额尔古纳市","鄂伦春自治旗","鄂温克族自治旗","根河市","满洲里市","莫力达瓦达斡尔族自治旗","新巴尔虎右旗","新巴尔虎左旗","牙克石市","扎兰屯市"]);
    dsy.add("0_5_7",["市辖区","霍林郭勒市","开鲁县","科尔沁左翼后旗","科尔沁左翼中旗","库伦旗","奈曼旗","扎鲁特旗"]);
    dsy.add("0_5_8",["市辖区","海勃湾区","海南区","乌达区"]);
    dsy.add("0_5_9",["察哈尔右翼后旗","察哈尔右翼前旗","察哈尔右翼中旗","丰镇市","化德县","集宁市","凉城县","商都县","四子王旗","兴和县","卓资县"]);
    dsy.add("0_5_10",["阿巴嘎旗","东乌珠穆沁旗","多伦县","二连浩特市","苏尼特右旗","苏尼特左旗","太仆寺旗","西乌珠穆沁旗","锡林浩特市","镶黄旗","正蓝旗","正镶白旗"]);
    dsy.add("0_5_11",["阿尔山市","科尔沁右翼前旗","科尔沁右翼中旗","突泉县","乌兰浩特市","扎赉特旗"]);



    dsy.add("0_6",["固原市","石嘴山市","吴忠市","银川市,中卫市"]);
    dsy.add("0_6_0",["市辖区","原州区","海原县","隆德县","彭阳县","西吉县","泾源县"]);
    dsy.add("0_6_1",["市辖区","大武口区","惠农区","惠农县","平罗县","陶乐县"]);
    dsy.add("0_6_2",["市辖区","利通区","青铜峡市","同心县","盐池县","中宁县","中卫县"]);
    dsy.add("0_6_3",["市辖区","兴庆区","西夏区","金凤区","贺兰县","灵武市","永宁县"]);
    dsy.add("0_6_3",["沙坡头区","中宁县","海原县"]);



    dsy.add("0_7",["阿里地区","昌都地区","拉萨市","林芝地区","那曲地区","日喀则地区","山南地区"]);
    dsy.add("0_7_0",["措勤县","噶尔县","改则县","革吉县","普兰县","日土县","札达县"]);
    dsy.add("0_7_1",["八宿县","边坝县","察雅县","昌都县","丁青县","贡觉县","江达县","类乌齐县","洛隆县","芒康县","左贡县"]);
    dsy.add("0_7_2",["市辖区","城关区","达孜县","当雄县","堆龙德庆县","林周县","墨竹工卡县","尼木县","曲水县"]);
    dsy.add("0_7_3",["波密县","察隅县","工布江达县","朗县","林芝县","米林县","墨脱县"]);
    dsy.add("0_7_4",["安多县","巴青县","班戈县","比如县","嘉黎县","那曲县","尼玛县","聂荣县","申扎县","索县"]);
    dsy.add("0_7_5",["昂仁县","白朗县","定结县","定日县","岗巴县","吉隆县","江孜县","康马县","拉孜县","南木林县","聂拉木县","仁布县","日喀则市","萨嘎县","萨迦县","谢通门县","亚东县","仲巴县"]);
    dsy.add("0_7_6",["措美县","错那县","贡嘎县","加查县","浪卡子县","隆子县","洛扎县","乃东县","琼结县","曲松县","桑日县","扎囊县"]);



    dsy.add("0_8",["阿克苏地区","巴音郭楞蒙古自治州","博尔塔拉蒙古自治州","昌吉回族自治州","哈密地区","和田地区","喀什地区","克拉玛依市","克孜勒苏柯尔克孜自治州","石河子市","图木舒克市","吐鲁番地区","乌鲁木齐市","五家渠市","伊犁哈萨克自治州"]);
    dsy.add("0_8_0",["阿克苏市","阿瓦提县","拜城县","柯坪县","库车县","沙雅县","温宿县","乌什县","新和县"]);
    dsy.add("0_8_1",["博湖县","和静县","和硕县","库尔勒市","轮台县","且末县","若羌县","尉犁县","焉耆回族自治县"]);
    dsy.add("0_8_2",["博乐市","精河县","温泉县"]);
    dsy.add("0_8_3",["昌吉市","阜康市","呼图壁县","吉木萨尔县","玛纳斯县","米泉市","木垒哈萨克自治县","奇台县"]);
    dsy.add("0_8_4",["巴里坤哈萨克自治县","哈密市","伊吾县"]);
    dsy.add("0_8_5",["策勒县","和田市","和田县","洛浦县","民丰县","墨玉县","皮山县","于田县"]);
    dsy.add("0_8_6",["巴楚县","喀什市","麦盖提县","莎车县","疏附县","疏勒县","塔什库尔干塔吉克自治县","叶城县","英吉沙县","岳普湖县","泽普县","伽师县"]);
    dsy.add("0_8_7",["克拉玛依市"]);
    dsy.add("0_8_8",["阿合奇县","阿克陶县","阿图什市","乌恰县"]);
    dsy.add("0_8_9",["石河子市"]);
    dsy.add("0_8_10",["图木舒克市"]);
    dsy.add("0_8_11",["吐鲁番市","托克逊县","鄯善县"]);
    dsy.add("0_8_12",["乌鲁木齐市","乌鲁木齐县"]);
    dsy.add("0_8_13",["五家渠市"]);
    dsy.add("0_8_14",["阿勒泰市","布尔津县","察布查尔锡伯自治县","额敏县","福海县","富蕴县","巩留县","哈巴河县","和布克赛尔蒙古自治县","霍城县","吉木乃县","奎屯市","尼勒克县","青河县","沙湾县","塔城市","特克斯县","托里县","乌苏市","新源县","伊宁市","伊宁县","裕民县","昭苏县"]);




    dsy.add("0_9",["潮州市","东莞市","佛山市","广州市","河源市","惠州市","江门市","揭阳市","茂名市","梅州市","清远市","汕头市","汕尾市","韶关市","深圳市","阳江市","云浮市","湛江市","肇庆市","中山市","珠海市"]);
    dsy.add("0_9_0",["市辖区","潮安县","饶平县"]);
    dsy.add("0_9_1",["市辖区","莞城区","东城区","南城区","万江区"]);
    dsy.add("0_9_2",["市辖区","禅城区","南海区","顺德区","三水区","高明区"]);
    dsy.add("0_9_3",["市辖区","从化市","增城市"]);
    dsy.add("0_9_4",["市辖区","东源县","源城区","和平县","连平县","龙川县","紫金县"]);
    dsy.add("0_9_5",["市辖区","惠阳区","惠城区","博罗县","惠东县","龙门县"]);
    dsy.add("0_9_6",["市辖区","蓬江区","江海区","新会区","恩平市","鹤山市","开平市","台山市"]);
    dsy.add("0_9_7",["市辖区","榕城区","惠来县","揭东县","揭西县","普宁市"]);
    dsy.add("0_9_8",["市辖区","茂南区","茂港区","电白县","高州市","化州市","信宜市"]);
    dsy.add("0_9_9",["市辖区","梅江区","大埔县","丰顺县","蕉岭县","梅县","平远县","五华县","兴宁市"]);
    dsy.add("0_9_10",["市辖区","清城区","佛冈县","连南瑶族自治县","连山壮族瑶族自治县","连州市","清新县","清远市","阳山县","英德市"]);
    dsy.add("0_9_11",["市辖区","龙湖区","金平区","濠江区","潮阳区","潮南区","澄海区","南澳县"]);
    dsy.add("0_9_12",["市辖区","海丰县","陆丰市","陆河县"]);
    dsy.add("0_9_13",["市辖区","武江区","浈江区","曲江区","乐昌市","南雄市","仁化县","乳源瑶族自治县","始兴县","翁源县","新丰县"]);
    dsy.add("0_9_14",["市辖区","罗湖区","福田区","南山区","宝安区","龙岗区","盐田区"]);
    dsy.add("0_9_15",["市辖区","阳春市","阳东县","阳西县"]);
    dsy.add("0_9_16",["市辖区","云城区","罗定市","新兴县","郁南县","云安县"]);
    dsy.add("0_9_17",["市辖区","赤坎区","霞山区","坡头区","麻章区","雷州市","廉江市","遂溪县","吴川市","徐闻县"]);
    dsy.add("0_9_18",["市辖区","端州区","鼎湖区","德庆县","封开县","高要市","广宁县","怀集县","四会市"]);
    dsy.add("0_9_19",["中山市"]);
    dsy.add("0_9_20",["市辖区","香洲区","斗门区","金湾区"]);



    dsy.add("0_10",["安顺市","毕节市","贵阳市","六盘水市","黔东南苗族侗族自治州","黔南布依族苗族自治州","黔西南布依族苗族自治州","铜仁市","遵义市"]);
    dsy.add("0_10_0",["市辖区","西秀区","关岭布依族苗族自治县","平坝县","普定县","镇宁布依族苗族自治县","紫云苗族布依族自治县"]);
    dsy.add("0_10_1",["毕节市","大方县","赫章县","金沙县","纳雍县","黔西县","威宁彝族回族苗族自治县","织金县"]);
    dsy.add("0_10_2",["市辖区","南明区","云岩区","花溪区","乌当区","白云区","小河区","开阳县","清镇市","息烽县","修文县"]);
    dsy.add("0_10_3",["六枝特区","盘县","水城县"]);
    dsy.add("0_10_4",["从江县","丹寨县","黄平县","剑河县","锦屏县","凯里市","雷山县","黎平县","麻江县","三穗县","施秉县","台江县","天柱县","镇远县","岑巩县","榕江县"]);
    dsy.add("0_10_5",["长顺县","都匀市","独山县","福泉市","贵定县","惠水县","荔波县","龙里县","罗甸县","平塘县","三都水族自治县","瓮安县"]);
    dsy.add("0_10_6",["安龙县","册亨县","普安县","晴隆县","望谟县","兴仁县","兴义市","贞丰县"]);
    dsy.add("0_10_7",["铜仁市","德江县","江口县","石阡县","思南县","松桃苗族自治县",,"万山特区","沿河土家族自治县","印江土家族苗族自治县","玉屏侗族自治县"]);
    dsy.add("0_10_8",["市辖区","红花岗区","汇川区","赤水市","道真仡佬族苗族自治县","凤冈县","仁怀市","绥阳县","桐梓县","务川仡佬族苗族自治县","习水县","余庆县","正安县","遵义县","湄潭县"]);

    dsy.add("0_11",["海口市","三亚市","海南直辖县"]);
    dsy.add("0_11_0",["市辖区","秀英区","龙华区","琼山区","美兰区"]);
    dsy.add("0_11_1",["市辖区"]);
    dsy.add("0_11_2",["五指山市","琼海市","儋州市","文昌市","万宁市","东方市","定安县","屯昌县","澄迈县","临高县","白沙黎族自治县","昌江黎族自治县","乐东黎族自治县","陵水黎族自治县","保亭黎族苗族自治县","琼中黎族苗族自治县","西沙群岛","南沙群岛","中沙群岛的岛礁及其海域"]);


    dsy.add("0_12",["保定市","沧州市","承德市","邯郸市","衡水市","廊坊市","秦皇岛市","石家庄市","唐山市","邢台市","张家口市"]);
    dsy.add("0_12_0",["市辖区","新市区","北市区","南市区","安国市","安新县","博野县","定兴县","定州市","阜平县","高碑店市","高阳县","满城县","清苑县","曲阳县","容城县","顺平县","唐县","望都县","雄县","徐水县","易县","涞水县","涞源县","涿州市","蠡县"]);
    dsy.add("0_12_1",["市辖区","新华区","运河区","泊头市","沧县","东光县","海兴县","河间市","黄骅市","孟村回族自治县","南皮县","青县","任丘市","肃宁县","吴桥县","献县","盐山县"]);
    dsy.add("0_12_2",["市辖区","双桥区","双滦区","鹰手营子矿区","承德县","丰宁满族自治县","宽城满族自治县","隆化县","滦平县","平泉县","围场满族蒙古族自治县","兴隆县"]);
    dsy.add("0_12_3",["市辖区","邯山区","丛台区","复兴区","峰峰矿区","成安县","磁县","大名县","肥乡县","馆陶县","广平县","邯郸县","鸡泽县","临漳县","邱县","曲周县","涉县","魏县","武安市","永年县"]);
    dsy.add("0_12_4",["市辖区","桃城区","安平县","阜城县","故城县","冀州市","景县","饶阳县","深州市","武强县","武邑县","枣强县"]);
    dsy.add("0_12_5",["市辖区","安次区","广阳区","霸州市","大厂回族自治县","大城县","固安县","廊坊市","三河市","文安县","香河县","永清县"]);
    dsy.add("0_12_6",["市辖区","海港区","山海关区","北戴河区","昌黎县","卢龙县","抚宁县","青龙满族自治县"]);
    dsy.add("0_12_7",["市辖区","长安区","桥东区","桥西区","新华区","井陉矿区","裕华区","高邑县","晋州市","井陉县","灵寿县","鹿泉市","平山县","深泽县","石家庄市","无极县","辛集市","新乐市","行唐县","元氏县","赞皇县","赵县","正定县","藁城市","栾城县"]);
    dsy.add("0_12_8",["市辖区","路南区","路北区","古冶区","开平区","丰南区","丰润区","乐亭县","滦南县","滦县","迁安市","迁西县","唐海县","玉田县","遵化市"]);
    dsy.add("0_12_9",["市辖区","桥东区","桥西区","柏乡县","广宗县","巨鹿县","临城县","临西县","隆尧县","南宫市","南和县","内丘县","宁晋县","平乡县","清河县","任县","沙河市","威县","新河县","邢台县"]);
    dsy.add("0_12_10",["市辖区","桥东区","桥西区","赤城县","崇礼县","沽源县","怀安县","怀来县","康保县","尚义县","万全县","蔚县","宣化县","阳原县","张北县","涿鹿县"]);


    dsy.add("0_13",["安阳市","鹤壁市","焦作市","开封市","洛阳市","南阳市","平顶山市","三门峡市","商丘市","新乡市","信阳市","许昌市","郑州市","周口市","驻马店市","漯河市","濮阳市"]);
    dsy.add("0_13_0",["市辖区","文峰区","北关区","殷都区","龙安区","安阳县","滑县","林州市","内黄县","汤阴县"]);
    dsy.add("0_13_1",["市辖区","鹤山区","山城区","淇滨区","浚县","淇县"]);
    dsy.add("0_13_2",["市辖区","解放区","中站区","马村区","山阳区","博爱县","焦作市","孟州市","沁阳市","温县","武陟县","修武县"]);
    dsy.add("0_13_3",["市辖区","龙亭区","顺河回族区","鼓楼区","南关区","郊区","开封县","兰考县","通许县","尉氏县","杞县"]);
    dsy.add("0_13_4",["市辖区","老城区","西工区","廛河回族区","涧西区","吉利区","洛龙区","洛宁县","孟津县","汝阳县","新安县","伊川县","宜阳县","偃师市","嵩县","栾川县"]);
    dsy.add("0_13_5",["市辖区","宛城区","卧龙区","邓州市","方城县","南召县","内乡县","社旗县","唐河县","桐柏县","西峡县","新野县","镇平县","淅川县"]);
    dsy.add("0_13_6",["市辖区","新华区","卫东区","石龙区","湛河区","宝丰县","鲁山县","汝州市","舞钢市","叶县","郏县"]);
    dsy.add("0_13_7",["市辖区","湖滨区","灵宝市","卢氏县","陕县","义马市","渑池县"]);
    dsy.add("0_13_8",["市辖区","梁园区","睢阳区","民权县","宁陵县","夏邑县","永城市","虞城县","柘城县","睢县"]);
    dsy.add("0_13_9",["市辖区","红旗区","卫滨区","凤泉区","牧野区","长垣县","封丘县","辉县市","获嘉县","卫辉市","新乡县","延津县","原阳县"]);
    dsy.add("0_13_10",["市辖区","师河区","平桥区","固始县","光山县","淮滨县","罗山县","商城县","息县","新县","潢川县"]);
    dsy.add("0_13_11",["市辖区","魏都区","长葛市","襄城县","许昌县","禹州市","鄢陵县"]);
    dsy.add("0_13_12",["市辖区","中原区","二七区","管城回族区","金水区","上街区","登封市","巩义市","新密市","新郑市","中牟县","荥阳市"]);
    dsy.add("0_13_13",["市辖区","川汇区","郸城县","扶沟县","淮阳县","鹿邑县","商水县","沈丘县","太康县","西华县","项城市"]);
    dsy.add("0_13_14",["市辖区","驿城区","泌阳县","平舆县","确山县","汝南县","上蔡县","遂平县","西平县","新蔡县","正阳县"]);
    dsy.add("0_13_15",["市辖区","源汇区","郾城区","召陵区","临颍县","舞阳县"]);
    dsy.add("0_13_16",["市辖区","华龙区","范县","南乐县","清丰县","台前县","濮阳县"]);

    dsy.add("0_14",["大庆市","大兴安岭区","哈尔滨市","鹤岗市","黑河市","鸡西市","佳木斯市","牡丹江市","七台河市","齐齐哈尔市","双鸭山市","绥化市","伊春市"]);
    dsy.add("0_14_0",["市辖区","萨尔图区","龙凤区","让胡路区","红岗区","大同区","杜尔伯特蒙古族自治县","林甸县","肇源县","肇州县"]);
    dsy.add("0_14_1",["呼玛县","漠河县","塔河县"]);
    dsy.add("0_14_2",["市辖区","道里区","南岗区","道外区","香坊区","动力区","平房区","松北区","阿城市","巴彦县","宾县","方正县","呼兰县","木兰县","尚志市","双城市","通河县","五常市","延寿县","依兰县"]);
    dsy.add("0_14_3",["市辖区","向阳区","工农区","南山区","兴安区","东山区","兴山区","萝北县","绥滨县"]);
    dsy.add("0_14_4",["市辖区","爱辉区","北安市","嫩江县","孙吴县","五大连池市","逊克县"]);
    dsy.add("0_14_5",["市辖区","鸡冠区","恒山区","滴道区","梨树区","城子河区","麻山区","虎林市","鸡东县","密山市"]);
    dsy.add("0_14_6",["市辖区","永红区","向阳区","前进区","东风区","郊区","抚远县","富锦市","汤原县","同江市","桦川县","桦南县"]);
    dsy.add("0_14_7",["市辖区","东安区","阳明区","爱民区","西安区","东宁县","海林市","林口县","穆棱市","宁安市","绥芬河市"]);
    dsy.add("0_14_8",["市辖区","新兴区","桃山区","茄子河区","勃利县"]);
    dsy.add("0_14_9",["市辖区","龙沙区","建华区","铁锋区","昂昂溪区","富拉尔基区","碾子山区","梅里斯达斡尔族区","拜泉县","富裕县","甘南县","克东县","克山县","龙江县","泰来县","依安县","讷河市"]);
    dsy.add("0_14_10",["市辖区","尖山区","岭东区","四方台区","宝山区","宝清县","集贤县","饶河县","友谊县"]);
    dsy.add("0_14_11",["市辖区","北林区","安达市","海伦市","兰西县","明水县","青冈县","庆安县","绥棱县","望奎县","肇东市"]);
    dsy.add("0_14_12",["市辖区","伊春区","南岔区","友好区","西林区","翠峦区","新青区","美溪区","金山屯区","五营区","乌马河区","汤旺河区","带岭区","乌伊岭区","红星区","上甘岭区","嘉荫县","铁力市"]);

    dsy.add("0_15",["武汉市","恩施土家族苗族自治州","黄冈市","黄石市","荆门市","荆州市","十堰市","随州市","鄂州市","咸宁市","襄樊市","孝感市","宜昌市"]);
    dsy.add("0_15_0",["市辖区","江汉区","江岸区","桥口区","汉阳区","武昌区","青山区","洪山区","东西湖区","江夏区","新洲区","黄陂区","汉南区","蔡甸区"]);
    dsy.add("0_15_1",["巴东县","恩施市","鹤峰县","建始县","来凤县","利川市","恩施市","咸丰县","宣恩县"]);
    dsy.add("0_15_2",["市辖区","黄州区","红安县","黄冈市","黄梅县","罗田县","麻城市","团风县","武穴市","英山县","蕲春县","浠水县"]);
    dsy.add("0_15_3",["市辖区","黄石港区","西塞山区","下陆区","铁山区","大冶市","阳新县"]);
    dsy.add("0_15_4",["市辖区","东宝区","掇刀区","京山县","沙洋县","钟祥市"]);
    dsy.add("0_15_5",["市辖区","沙市区","荆州区","公安县","洪湖市","监利县","江陵县","石首市","松滋市"]);
    dsy.add("0_15_6",["市辖区","茅箭区","张湾区","丹江口市","房县","郧西县","郧县","竹山县","竹溪县"]);
    dsy.add("0_15_7",["市辖区","曾都区","广水市"]);
    dsy.add("0_15_8",["市辖区","梁子湖区","华容区","鄂城区"]);
    dsy.add("0_15_9",["市辖区","咸安区","赤壁市","崇阳县","嘉鱼县","通城县","通山县"]);
    dsy.add("0_15_10",["市辖区","襄城区","樊城区","襄阳区","保康县","谷城县","老河口市","南漳县","宜城市","枣阳市"]);
    dsy.add("0_15_11",["市辖区","孝南区","安陆市","大悟县","汉川市","孝昌县","应城市","云梦县"]);
    dsy.add("0_15_12",["市辖区","西陵区","伍家岗区","点军区","猇亭区","夷陵区","长阳土家族自治县","当阳市","五峰土家族自治县","兴山县","宜都市","远安县","枝江市","秭归县"]);

    dsy.add("0_16",["常德市","长沙市","郴州市","衡阳市","怀化市","娄底市","邵阳市","湘潭市","湘西土家族苗族自治州","益阳市","永州市","岳阳市","张家界市","株洲市"]);
    dsy.add("0_16_0",["市辖区","武陵区","鼎城区","安乡县","汉寿县","津市市","临澧县","石门县","桃源县","澧县"]);
    dsy.add("0_16_1",["市辖区","芙蓉区","天心区","岳麓区","开福区","雨花区","长沙县","宁乡县","望城县","浏阳市"]);
    dsy.add("0_16_2",["市辖区","北湖区","苏仙区","安仁县","桂东县","桂阳县","嘉禾县","临武县","汝城县","宜章县","永兴县","资兴市"]);
    dsy.add("0_16_3",["市辖区","珠晖区","雁峰区","石鼓区","蒸湘区","南岳区","常宁市","衡东县","衡南县","衡山县","衡阳县","祁东县","耒阳市"]);
    dsy.add("0_16_4",["市辖区","鹤城区","辰溪县","洪江市","会同县","靖州苗族侗族自治县","麻阳苗族自治县","通道侗族自治县","新晃侗族自治县","中方县","芷江侗族自治县","沅陵县","溆浦县"]);
    dsy.add("0_16_5",["市辖区","娄星区","冷水江市","涟源市","双峰县","新化县"]);
    dsy.add("0_16_6",["市辖区","双清区","大祥区","北塔区","城步苗族自治县","洞口县","隆回县","邵东县","邵阳县","绥宁县","武冈市","新宁县","新邵县"]);
    dsy.add("0_16_7",["市辖区","雨湖区","岳塘区","韶山市","湘潭市","湘潭县","湘乡市"]);
    dsy.add("0_16_8",["保靖县","凤凰县","古丈县","花垣县","吉首市","龙山县","永顺县","泸溪县"]);
    dsy.add("0_16_9",["市辖区","资阳区","赫山区","安化县","南县","桃江县","沅江市"]);
    dsy.add("0_16_10",["市辖区","芝山区","冷水滩区","道县","东安县","江华瑶族自治县","江永县","蓝山县","宁远县","祁阳县","双牌县","新田县"]);
    dsy.add("0_16_11",["市辖区","岳阳楼区","云溪区","君山区","华容县","临湘市","平江县","湘阴县","岳阳县","汨罗市"]);
    dsy.add("0_16_12",["市辖区","永定区","武陵源区","慈利县","桑植县","张家界市"]);
    dsy.add("0_16_13",["市辖区","荷塘区","芦淞区","石峰区","天元区","茶陵县","炎陵县","株洲县","攸县","醴陵市"]);

    dsy.add("0_17",["白城市","白山市","长春市","吉林市","辽源市","四平市","松原市","通化市","延边朝鲜族自治州"]);
    dsy.add("0_17_0",["市辖区","洮北区","大安市","通榆县","镇赉县","洮南市"]);
    dsy.add("0_17_1",["市辖区","八道江区","长白朝鲜族自治县","抚松县","江源县","靖宇县","临江市"]);
    dsy.add("0_17_2",["市辖区","南关区","宽城区","朝阳区","二道区","绿园区","双阳区","德惠市","九台市","农安县","榆树市"]);
    dsy.add("0_17_3",["市辖区","昌邑区","龙潭区","船营区","丰满区","磐石市","舒兰市","永吉县","桦甸市","蛟河市"]);
    dsy.add("0_17_4",["市辖区","龙山区","西安区","东丰县","东辽县"]);
    dsy.add("0_17_5",["市辖区","铁西区","铁东区","公主岭市","梨树县","双辽市","伊通满族自治县"]);
    dsy.add("0_17_6",["市辖区","宁江区","长岭县","扶余县","乾安县","前郭尔罗斯蒙古族自治县"]);
    dsy.add("0_17_7",["市辖区","东昌区","二道江区","辉南县","集安市","柳河县","梅河口市","通化县"]);
    dsy.add("0_17_8",["安图县","敦化市","和龙市","龙井市","图们市","汪清县","延吉市","珲春市"]);

    dsy.add("0_18",["常州市","淮安市","连云港市","南京市","南通市","苏州市","宿迁市","泰州市","无锡市","徐州市","盐城市","扬州市","镇江市"]);
    dsy.add("0_18_0",["市辖区","天宁区","钟楼区","戚墅堰区","新北区","武进区","金坛市","溧阳市"]);
    dsy.add("0_18_1",["市辖区","清河区","楚州区","淮阴区","清浦区","洪泽县","金湖县","涟水县","盱眙县"]);
    dsy.add("0_18_2",["市辖区","连云区","新浦区","新浦区","海州区","东海县","赣榆县","灌南县","灌云县"]);
    dsy.add("0_18_3",["市辖区","玄武区","白下区","秦淮区","建邺区","鼓楼区","下关区","浦口区","栖霞区","雨花台区","江宁区","六合区","高淳县","溧水县"]);
    dsy.add("0_18_4",["市辖区","沧浪区","平江区","金阊区","虎丘区","吴中区","相城区","海安县","海门市","南通市","启东市","如东县","如皋市"]);
    dsy.add("0_18_5",["市辖区","宿城区","宿豫区","常熟市","昆山市","太仓市","吴江市","张家港市"]);
    dsy.add("0_18_6",["市辖区","宿城区","宿豫区","兴化市","宿豫县","沭阳县","泗洪县","泗阳县"]);
    dsy.add("0_18_7",["市辖区","海陵区","高港区","姜堰市","靖江市","泰兴市","兴化市"]);
    dsy.add("0_18_8",["市辖区","崇安区","南长区","北塘区","锡山区","惠山区","滨湖区","江阴市","宜兴市"]);
    dsy.add("0_18_9",["市辖区","鼓楼区","云龙区","九里区","贾汪区","泉山区","丰县","沛县","铜山县","新沂市","邳州市","睢宁县"]);
    dsy.add("0_18_10",["市辖区","亭湖区","盐都区","滨海县","大丰市","东台市","阜宁县","建湖县","射阳县","响水县","盐都县"]);
    dsy.add("0_18_11",["市辖区","广陵区","邗江区","宝应县","高邮市","江都市","仪征市"]);
    dsy.add("0_18_12",["市辖区","京口区","润州区","丹徒区","丹阳市","句容市","扬中市"]);

    dsy.add("0_19",["抚州市","赣州市","吉安市","景德镇市","九江市","南昌市","萍乡市","上饶市","新余市","宜春市","鹰潭市"]);
    dsy.add("0_19_0",["市辖区","临川区","崇仁县","东乡县","广昌县","金溪县","乐安县","黎川县","南城县","南丰县","宜黄县","资溪县"]);
    dsy.add("0_19_1",["市辖区","章贡区","安远县","崇义县","大余县","定南县","赣县","会昌县","龙南县","南康市","宁都县","全南县","瑞金市","上犹县","石城县","信丰县","兴国县","寻乌县","于都县"]);
    dsy.add("0_19_2",["市辖区","吉州区","青原区","安福县","吉安县","吉水县","井冈山市","遂川县","泰和县","万安县","峡江县","新干县","永丰县","永新县"]);
    dsy.add("0_19_3",["市辖区","昌江区","珠山区","浮梁县","乐平市"]);
    dsy.add("0_19_4",["市辖区","庐山区","浔阳区","德安县","都昌县","湖口县","九江县","彭泽县","瑞昌市","武宁县","星子县","修水县","永修县"]);
    dsy.add("0_19_5",["市辖区","东湖区","西湖区","青云谱区","湾里区","青山湖区","安义县","进贤县","南昌县","新建县"]);
    dsy.add("0_19_6",["市辖区","安源区","湘东区","莲花县","芦溪县","上栗县"]);
    dsy.add("0_19_7",["市辖区","信州区","波阳县","德兴市","广丰县","横峰县","铅山县","上饶县","万年县","余干县","玉山县","弋阳县","婺源县"]);
    dsy.add("0_19_8",["市辖区","渝水区","分宜县"]);
    dsy.add("0_19_9",["市辖区","袁州区","丰城市","奉新县","高安市","靖安县","上高县","铜鼓县","万载县","宜丰县","樟树市"]);
    dsy.add("0_19_10",["市辖区","月湖","贵溪市","余江县"]);

    dsy.add("0_20",["鞍山市","本溪市","朝阳市","大连市","丹东市","抚顺市","阜新市","葫芦岛市","锦州市","辽阳市","盘锦市","沈阳市","铁岭市","营口市"]);
    dsy.add("0_20_0",["市辖区","铁东区","铁西区","立山区","千山区","海城市","台安县","岫岩满族自治县"]);
    dsy.add("0_20_1",["市辖区","平山区","溪湖区","明山区","南芬区","本溪满族自治县","桓仁满族自治县"]);
    dsy.add("0_20_2",["市辖区","双塔区","龙城区","北票市","朝阳县","建平县","喀喇沁左翼蒙古族自治县","凌源市"]);
    dsy.add("0_20_3",["市辖区","中山区","西岗区","沙河口区","甘井子区","旅顺口区","金州区","长海县","普兰店市","瓦房店市","庄河市"]);
    dsy.add("0_20_4",["市辖区","元宝区","振兴区","振安区","东港市","凤城市","宽甸满族自治县"]);
    dsy.add("0_20_5",["市辖区","新抚区","东洲区","望花区","顺城区","抚顺县","清原满族自治县","新宾满族自治县"]);
    dsy.add("0_20_6",["市辖区","海州区","新邱区","太平区","清河门区","阜新蒙古族自治县","彰武县"]);
    dsy.add("0_20_7",["市辖区","连山区","龙港区","南票区","建昌县","绥中县","兴城市"]);
    dsy.add("0_20_8",["市辖区","古塔区","凌河区","太和区","北宁市","黑山县","凌海市","义县"]);
    dsy.add("0_20_9",["市辖区","白塔区","文圣区","宏伟区","弓长岭区","太子河区","辽阳市","辽阳县"]);
    dsy.add("0_20_10",["市辖区","双台子区","兴隆台区","大洼县","盘山县"]);
    dsy.add("0_20_11",["市辖区","和平区","沈河区","大东区","皇姑区","铁西区","苏家屯区","东陵区","新城子区","于洪区","法库县","康平县","辽中县","新民市"]);
    dsy.add("0_20_12",["市辖区","银州区","清河区","昌图县","调兵山市","开原市","铁岭县","西丰县"]);
    dsy.add("0_20_13",["市辖区","站前区","西市区","鲅鱼圈区","老边区","盖州市","营口市"]);





    dsy.add("0_21",["果洛藏族自治州","海北藏族自治州","海东区","海南藏族自治州","海西蒙古族藏族自治州","黄南藏族自治州","西宁市","玉树藏族自治州"]);
    dsy.add("0_21_0",["班玛县","达日县","甘德县","久治县","玛多县","玛沁县"]);
    dsy.add("0_21_1",["刚察县","海晏县","门源回族自治县","祁连县"]);
    dsy.add("0_21_2",["互助土族自治县","化隆回族自治县","乐都县","民和回族土族自治县","平安县","循化撒拉族自治县"]);
    dsy.add("0_21_3",["共和县","贵德县","贵南县","同德县","兴海县"]);
    dsy.add("0_21_4",["德令哈市","都兰县","格尔木市","天峻县","乌兰县"]);
    dsy.add("0_21_5",["河南蒙古族自治县","尖扎县","同仁县","泽库县"]);
    dsy.add("0_21_6",["市辖区","城东区","城中区","城西区","城北区","大通回族土族自治县","湟源县","湟中县"]);
    dsy.add("0_21_7",["称多县","囊谦县","曲麻莱县","玉树县","杂多县","治多县"]);

    dsy.add("0_22",["滨州市","德州市","东营市","菏泽市","济南市","济宁市","莱芜市","聊城市","临沂市","青岛市","日照市","泰安市","威海市","潍坊市","烟台市","枣庄市","淄博市"]);
    dsy.add("0_22_0",["市辖区","滨城区","博兴县","惠民县","无棣县","阳信县","沾化县","邹平县"]);
    dsy.add("0_22_1",["市辖区","德城区","乐陵市","临邑县","陵县","宁津县","平原县","齐河县","庆云县","武城县","夏津县","禹城市"]);
    dsy.add("0_22_2",["市辖区","东营区","河口区","广饶县","垦利县","利津县"]);
    dsy.add("0_22_3",["曹县","成武县","单县","定陶县","东明县","菏泽市","巨野县","郓城县","鄄城县"]);
    dsy.add("0_22_4",["市辖区","历下区","市中区","槐荫区","天桥区","历城区","长清区","济阳县","平阴县","商河县","章丘市"]);
    dsy.add("0_22_5",["市辖区","市中区","任城区","嘉祥县","金乡县","梁山县","曲阜市","微山县","鱼台县","邹城市","兖州市","汶上县","泗水县"]);
    dsy.add("0_22_6",["莱芜市"]);
    dsy.add("0_22_7",["市辖区","东昌府区","东阿县","高唐县","冠县","临清市","阳谷县","茌平县","莘县"]);
    dsy.add("0_22_8",["市辖区","兰山区","罗庄区","河东区","苍山县","费县","临沭县","蒙阴县","平邑县","沂南县","沂水县","郯城县","莒南县"]);
    dsy.add("0_22_9",["市辖区","市南区","市北区","四方区","黄岛区","崂山区","李沧区","城阳区","即墨市","胶南市","胶州市","莱西市","平度市"]);
    dsy.add("0_22_10",["市辖区","东港区","岚山区","五莲县","莒县"]);
    dsy.add("0_22_11",["市辖区","泰山区","岱岳区","东平县","肥城市","宁阳县","新泰市"]);
    dsy.add("0_22_12",["市辖区","环翠区","荣成市","乳山市","文登市"]);
    dsy.add("0_22_13",["市辖区","潍城区","寒亭区","坊子区","奎文区","安丘市","昌乐县","昌邑市","高密市","临朐县","青州市","寿光市","诸城市"]);
    dsy.add("0_22_14",["市辖区","芝罘区","福山区","牟平区","莱山区","长岛县","海阳市","莱阳市","莱州市","龙口市","蓬莱市","栖霞市","招远市"]);
    dsy.add("0_22_15",["市辖区","市中区","薛城区","峄城区","台儿庄区","山亭区","滕州市"]);
    dsy.add("0_22_16",["市辖区","淄川区","张店区","博山区","临淄区","周村区","高青县","桓台县","沂源县"]);

    dsy.add("0_23",["长治市","大同市","晋城市","晋中市","临汾市","吕梁市","朔州市","太原市","忻州市","阳泉市","运城市"]);
    dsy.add("0_23_0",["市辖区","城区","郊区","长治县","长子县","壶关县","黎城县","潞城市","平顺县","沁县","沁源县","屯留县","武乡县","襄垣县"]);
    dsy.add("0_23_1",["市辖区","城区","矿区","大同县","广灵县","浑源县","灵丘县","天镇县","阳高县","左云县"]);
    dsy.add("0_23_2",["市辖区","城区","高平市","陵川县","沁水县","阳城县","泽州县"]);
    dsy.add("0_23_3",["市辖区","榆次区","和顺县","介休市","灵石县","平遥县","祁县","寿阳县","太谷县","昔阳县","榆社县","左权县"]);
    dsy.add("0_23_4",["市辖区","尧都区","安泽县","大宁县","汾西县","浮山县","古县","洪洞县","侯马市","霍州市","吉县","蒲县","曲沃县","襄汾县","乡宁县","翼城县","永和县","隰县"]);
    dsy.add("0_23_5",["市辖区","离石区","方山县","汾阳市","交城县","交口县","离石市","临县","柳林县","石楼县","文水县","孝义市","兴县","中阳县","岚县"]);
    dsy.add("0_23_6",["市辖区","朔城区","平鲁区","怀仁县","山阴县","应县","右玉县"]);
    dsy.add("0_23_7",["市辖区","小店区","迎泽区","杏花岭区","尖草坪区","万柏林区","古交市","娄烦县","清徐县","阳曲县"]);
    dsy.add("0_23_8",["市辖区","忻府区","保德县","代县","定襄县","繁峙县","河曲县","静乐县","宁武县","偏关县","神池县","五台县","五寨县","原平市","岢岚县"]);
    dsy.add("0_23_9",["市辖区","城区","矿区","郊区","平定县","阳泉市","盂县"]);
    dsy.add("0_23_10",["市辖区","盐湖区","河津市","临猗县","平陆县","万荣县","闻喜县","夏县","新绛县","永济市","垣曲县","芮城县","绛县","稷山县"]);

    dsy.add("0_24",["安康市","宝鸡市","汉中市","商洛市","铜川市","渭南市","西安市","咸阳市","延安市","榆林市"]);
    dsy.add("0_24_0",["市辖区","汉滨区","白河县","汉阴县","宁陕县","平利县","石泉县","旬阳县","镇坪县","紫阳县","岚皋县"]);
    dsy.add("0_24_1",["市辖区","渭滨区","金台区","陈仓区","宝鸡县","凤县","凤翔县","扶风县","陇县","眉县","千阳县","太白县","岐山县","麟游县"]);
    dsy.add("0_24_2",["市辖区","汉台区","城固县","佛坪县","留坝县","略阳县","勉县","南郑县","宁强县","西乡县","洋县","镇巴县"]);
    dsy.add("0_24_3",["市辖区","商州区","丹凤县","洛南县","山阳县","商南县","镇安县","柞水县"]);
    dsy.add("0_24_4",["市辖区","王益区","印台区","耀州区","铜川市","宜君县"]);
    dsy.add("0_24_5",["市辖区","临渭区","白水县","澄城县","大荔县","富平县","韩城市","合阳县","华县","华阴市","蒲城县","潼关县"]);
    dsy.add("0_24_6",["市辖区","新城区","碑林区","莲湖区","灞桥区","未央区","雁塔区","阎良区","临潼区","长安区","高陵县","户县","蓝田县","周至县"]);
    dsy.add("0_24_7",["市辖区","秦都区","杨凌区","渭城区","彬县","长武县","淳化县","礼泉县","乾县","三原县","武功县","兴平市","旬邑县","永寿县","泾阳县"]);
    dsy.add("0_24_8",["市辖区","宝塔区","安塞县","富县","甘泉县","黄陵县","黄龙县","洛川县","吴旗县","延长县","延川县","宜川县","志丹县","子长县"]);
    dsy.add("0_24_9",["市辖区","榆阳区","定边县","府谷县","横山县","佳县","靖边县","米脂县","清涧县","神木县","绥德县","吴堡县","子洲县"]);

    dsy.add("0_25",["阿坝藏族羌族自治州","巴中市","成都市","达州市","德阳市","甘孜藏族自治州","广安市","广元市","乐山市","凉山彝族自治州","眉山市","绵阳市","南充市","内江市","攀枝花市","遂宁市","雅安市","宜宾市","资阳市","自贡市","泸州市"]);
    dsy.add("0_25_0",["阿坝县","黑水县","红原县","金川县","九寨沟县","理县","马尔康县","茂县","壤塘县","若尔盖县","松潘县","小金县","汶川县"]);
    dsy.add("0_25_1",["市辖区","雁江区","南江县","平昌县","通江县"]);
    dsy.add("0_25_2",["市辖区","锦江区","青羊区","金牛区","武侯区","成华区","龙泉驿区","青白江区","新都区","温江区","崇州市","大邑县","都江堰市","金堂县","彭州市","蒲江县","双流县","新津县","邛崃市","郫县"]);
    dsy.add("0_25_3",["市辖区","通川区","达县","大竹县","开江县","渠县","万源市","宣汉县"]);
    dsy.add("0_25_4",["市辖区","旌阳区","广汉市","罗江县","绵竹市","什邡市","中江县"]);
    dsy.add("0_25_5",["巴塘县","白玉县","丹巴县","稻城县","道孚县","德格县","得荣县","甘孜县","九龙县","康定县","理塘县","炉霍县","色达县","石渠县","乡城县","新龙县","雅江县","泸定县"]);
    dsy.add("0_25_6",["市辖区","广安区","华蓥市","邻水县","武胜县","岳池县"]);
    dsy.add("0_25_7",["市辖区","市中区","元坝区","朝天区","苍溪县","剑阁县","青川县","旺苍县"]);
    dsy.add("0_25_8",["市辖区","市中区","沙湾区","五通桥区","金口河区","峨边彝族自治县","峨眉山市","夹江县","井研县","马边彝族自治县","沐川县","犍为县"]);
    dsy.add("0_25_9",["布拖县","德昌县","甘洛县","会东县","会理县","金阳县","雷波县","美姑县","冕宁县","木里藏族自治县","宁南县","普格县","西昌市","喜德县","盐源县","越西县","昭觉县"]);
    dsy.add("0_25_10",["市辖区","东坡区","丹棱县","洪雅县","彭山县","青神县","仁寿县"]);
    dsy.add("0_25_11",["市辖区","涪城区","游仙区","安县","北川县","江油市","平武县","三台县","盐亭县","梓潼县"]);
    dsy.add("0_25_12",["市辖区","顺庆区","高坪区","嘉陵区","南部县","蓬安县","西充县","仪陇县","营山县","阆中市"]);
    dsy.add("0_25_13",["市辖区","市中区","东兴区","隆昌县","威远县","资中县"]);
    dsy.add("0_25_14",["市辖区","东区","西区","仁和区","米易县","攀枝花市","盐边县"]);
    dsy.add("0_25_15",["市辖区","船山区","安居区","大英县","蓬溪县","射洪县","遂宁市"]);
    dsy.add("0_25_16",["市辖区","雨城区","宝兴县","汉源县","芦山县","名山县","石棉县","天全县","雅安市","荥经县"]);
    dsy.add("0_25_17",["市辖区","翠屏区","长宁县","高县","江安县","南溪县","屏山县","兴文县","宜宾县","珙县","筠连县"]);
    dsy.add("0_25_18",["市辖区","雁江区","安岳县","简阳市","乐至县"]);
    dsy.add("0_25_19",["市辖区","自流井区","贡井区","大安区","沿滩区","富顺县","荣县","自贡市"]);
    dsy.add("0_25_20",["市辖区","江阳区","纳溪区","龙马潭区","古蔺县","合江县","叙永县","泸县"]);



    dsy.add("0_26",["保山市","楚雄彝族自治州","大理白族自治州","德宏傣族景颇族自治州","迪庆藏族自治州","红河哈尼族彝族自治州","昆明市","丽江市","临沧市","怒江傈傈族自治州","曲靖市","思茅市","文山壮族苗族自治州","西双版纳傣族自治州","玉溪市","昭通市"]);
    dsy.add("0_26_0",["市辖区","隆阳区","昌宁县","龙陵县","施甸县","腾冲县"]);
    dsy.add("0_26_1",["楚雄市","大姚县","禄丰县","牟定县","南华县","双柏县","武定县","姚安县","永仁县","元谋县"]);
    dsy.add("0_26_2",["宾川县","大理市","洱源县","鹤庆县","剑川县","弥渡县","南涧彝族自治县","巍山彝族回族自治县","祥云县","漾濞彝族自治县","永平县","云龙县"]);
    dsy.add("0_26_3",["梁河县","陇川县","潞西市","瑞丽市","盈江县"]);
    dsy.add("0_26_4",["德钦县","维西傈僳族自治县","香格里拉县"]);
    dsy.add("0_26_5",["个旧市","河口瑶族自治县","红河县","建水县","金平苗族瑶族傣族自治县","开远市","绿春县","蒙自县","弥勒县","屏边苗族自治县","石屏县","元阳县","泸西县"]);
    dsy.add("0_26_6",["市辖区","五华区","盘龙区","官渡区","西山区","东川区","安宁市","呈贡县","富民县","晋宁县","禄劝彝族苗族自治县","石林彝族自治县","寻甸回族自治县","宜良县","嵩明县"]);
    dsy.add("0_26_7",["市辖区","古城区","华坪县","宁蒗彝族自治县","永胜县","玉龙纳西族自治县"]);
    dsy.add("0_26_8",["市辖区","临翔区","沧源佤族自治县","凤庆县","耿马傣族佤族治县","临沧县","双江拉祜族佤族布朗族傣族自治县","永德县","云县","镇康县"]);
    dsy.add("0_26_9",["福贡县","贡山独龙族怒族自治县","兰坪白族普米族自治县","泸水县"]);
    dsy.add("0_26_10",["市辖区","麒麟区","富源县","会泽县","陆良县","罗平县","马龙县","师宗县","宣威市","沾益县"]);
    dsy.add("0_26_11",["市辖区","翠云区","江城哈尼族彝族自治县","景东彝族自治县","景谷彝族傣族自治县","澜沧拉祜族自治县","孟连傣族拉祜族佤族自治县","墨江哈尼族自治县","普洱哈尼族彝族自治县","西盟佤族自治县","镇沅彝族哈尼族拉祜族自治县"]);
    dsy.add("0_26_12",["富宁县","广南县","麻栗坡县","马关县","丘北县","文山县","西畴县","砚山县"]);
    dsy.add("0_26_13",["景洪市","勐海县","勐腊县"]);
    dsy.add("0_26_14",["市辖区","红塔区","澄江县","峨山彝族自治县","华宁县","江川县","通海县","新平彝族傣族自治县","易门县","元江哈尼族彝族傣族自治县"]);
    dsy.add("0_26_15",["市辖区","昭阳区","大关县","鲁甸县","巧家县","水富县","绥江县","威信县","盐津县","彝良县","永善县","镇雄县"]);

    dsy.add("0_27",["杭州市","湖州市","嘉兴市","金华市","丽水市","宁波市","绍兴市","台州市","温州市","舟山市","衢州市"]);
    dsy.add("0_27_0",["市辖区","上城区","下城区","江干区","拱墅区","西湖区","滨江区","萧山区","余杭区","淳安县","富阳市","建德市","临安市","桐庐县"]);
    dsy.add("0_27_1",["市辖区","吴兴区","南浔区","安吉县","长兴县","德清县"]);
    dsy.add("0_27_2",["市辖区","秀城区","秀洲区","海宁市","海盐县","嘉善县","平湖市","桐乡市"]);
    dsy.add("0_27_3",["市辖区","婺城区","金东区","东阳市","兰溪市","磐安县","浦江县","武义县","义乌市","永康市"]);
    dsy.add("0_27_4",["市辖区","莲都区","景宁畲族自治县","龙泉市","青田县","庆元县","松阳县","遂昌县","云和县","缙云县"]);
    dsy.add("0_27_5",["市辖区","海曙区","江东区","江北区","北仑区","镇海区","鄞州区","慈溪市","奉化市","宁海县","象山县","余姚市"]);
    dsy.add("0_27_6",["市辖区","越城区","上虞市","绍兴县","新昌县","诸暨市","嵊州市"]);
    dsy.add("0_27_7",["市辖区","椒江区","黄岩区","路桥区","临海市","三门县","天台县","温岭市","仙居县","玉环县"]);
    dsy.add("0_27_8",["市辖区","鹿城区","龙湾区","瓯海区","苍南县","洞头县","乐清市","平阳县","瑞安市","泰顺县","文成县","永嘉县"]);
    dsy.add("0_27_9",["市辖区","定海区","普陀区","岱山县","嵊泗县"]);
    dsy.add("0_27_10",["市辖区","柯城区","衢江区","常山县","江山市","开化县","龙游县"]);

    dsy.add("0_28",["白银市","定西市","甘南藏族自治州","金昌市","酒泉市","兰州市","临夏回族自治州","陇南市","平凉市","庆阳市","天水市","武威市","张掖市"]);
    dsy.add("0_28_0",["市辖区","白银区","平川区","会宁县","景泰县","靖远县"]);
    dsy.add("0_28_1",["市辖区","安定区","定西县","临洮县","陇西县","通渭县","渭源县","漳县","岷县"]);
    dsy.add("0_28_2",["迭部县","合作市","临潭县","碌曲县","玛曲县","夏河县","舟曲县","卓尼县"]);
    dsy.add("0_28_4",["市辖区","金川区","永昌县"]);
    dsy.add("0_28_5",["市辖区","肃州区","阿克塞哈萨克族自治县","安西县","敦煌市","金塔县","肃北蒙古族自治县","玉门市"]);
    dsy.add("0_28_6",["市辖区","城关区","七里河区","西固区","安宁区","红古区","皋兰县","永登县","榆中县"]);
    dsy.add("0_28_7",["东乡族自治县","广河县","和政县","积石山保安族东乡族撒拉族自治县","康乐县","临夏市","临夏县","永靖县"]);
    dsy.add("0_28_8",["市辖区","武都区","成县","徽县","康县","礼县","两当县","文县","武都县","西和县","宕昌县"]);
    dsy.add("0_28_9",["市辖区","崆峒区","崇信县","华亭县","静宁县","灵台县","平凉市","庄浪县","泾川县"]);
    dsy.add("0_28_10",["市辖区","西峰区","合水县","华池县","环县","宁县","庆城县","镇原县","正宁县"]);
    dsy.add("0_28_11",["市辖区","秦城区","北道区","甘谷县","秦安县","清水县","武山县","张家川回族自治县"]);
    dsy.add("0_28_12",["市辖区","凉州区","古浪县","民勤县","天祝藏族自治县"]);
    dsy.add("0_28_13",["市辖区","甘州区","高台县","临泽县","民乐县","山丹县","肃南裕固族自治县"]);

    dsy.add("0_29",["安庆市","蚌埠市","巢湖市","池州市","滁州市","阜阳市","合肥市","淮北市","淮南市","黄山市","六安市","马鞍山市","宿州市","铜陵市","芜湖市","宣城市","亳州市"]);
    dsy.add("0_29_0",["市辖区","迎江区","大观区","郊区","怀宁县","潜山县","宿松县","太湖县","桐城市","望江县","岳西县","枞阳县"]);
    dsy.add("0_29_1",["市辖区","龙子湖区","蚌山区","禹会区","淮上区","固镇县","怀远县","五河县"]);
    dsy.add("0_29_2",["市辖区","居巢区","含山县","和县","庐江县","无为县"]);
    dsy.add("0_29_3",["市辖区","贵池区","东至县","青阳县","石台县"]);
    dsy.add("0_29_4",["市辖区","琅琊区","南谯区","定远县","凤阳县","来安县","明光市","全椒县","天长市"]);
    dsy.add("0_29_5",["市辖区","颍州区","颍东区","颍泉区","阜南县","界首市","临泉县","太和县","颖上县"]);
    dsy.add("0_29_6",["市辖区","瑶海区","庐阳区","蜀山区","包河区","长丰县","肥东县","肥西县"]);
    dsy.add("0_29_7",["市辖区","杜集区","相山区","烈山区","濉溪县"]);
    dsy.add("0_29_8",["市辖区","大通区","田家庵区","谢家集区","八公山区","潘集区","凤台县"]);
    dsy.add("0_29_9",["市辖区","屯溪区","黄山区","徽州区","祁门县","休宁县","歙县","黟县"]);
    dsy.add("0_29_10",["市辖区","金安区","裕安区","霍邱县","霍山县","金寨县","寿县","舒城县"]);
    dsy.add("0_29_11",["市辖区","金家庄区","花山区","雨山区","当涂县"]);
    dsy.add("0_29_12",["市辖区","墉桥区","灵璧县","萧县","泗县","砀山县"]);
    dsy.add("0_29_13",["市辖区","铜官山区","狮子山区","郊区","铜陵县"]);
    dsy.add("0_29_14",["市辖区","镜湖区","马塘区","新芜区","鸠江区","繁昌县","南陵县","芜湖县"]);
    dsy.add("0_29_15",["市辖区","宣州区","广德县","绩溪县","郎溪县","宁国市","泾县","旌德县"]);
    dsy.add("0_29_16",["市辖区","谯城区","利辛县","蒙城县","涡阳县"]);

    dsy.add("0_30",["福州市","龙岩市","南平市","宁德市","莆田市","泉州市","三明市","厦门市","漳州市"]);
    dsy.add("0_30_0",["市辖区","鼓楼区","台江区","仓山区","马尾区","晋安区","长乐市","福清市","连江县","罗源县","闽侯县","闽清县","平潭县","永泰县"]);
    dsy.add("0_30_1",["市辖区","新罗区","长汀县","连城县","上杭县","武平县","永定县","漳平市"]);
    dsy.add("0_30_2",["市辖区","延平区","光泽县","建阳市","建瓯市","浦城县","邵武市","顺昌县","松溪县","武夷山市","政和县"]);
    dsy.add("0_30_3",["市辖区","蕉城区","福安市","福鼎市","古田县","屏南县","寿宁县","霞浦县","周宁县","柘荣县"]);
    dsy.add("0_30_4",["市辖区","城厢区","涵江区","荔城区","秀屿区","仙游县"]);
    dsy.add("0_30_5",["市辖区","鲤城区","丰泽区","洛江区","泉港区","安溪县","德化县","惠安县","金门县","晋江市","南安市","石狮市","永春县"]);
    dsy.add("0_30_6",["市辖区","梅列区","三元区","大田县","建宁县","将乐县","明溪县","宁化县","清流县","沙县","泰宁县","永安市","尤溪县"]);
    dsy.add("0_30_7",["市辖区","思明区","海沧区","湖里区","集美区","同安区","翔安区"]);
    dsy.add("0_30_8",["市辖区","芗城区","龙文区","长泰县","东山县","华安县","龙海市","南靖县","平和县","云霄县","漳浦县","诏安县"]);

    return dsy;
});
