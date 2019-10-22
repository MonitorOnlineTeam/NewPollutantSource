/*
 * @Author: lzp
 * @Date: 2019-09-05 10:57:14
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-05 10:57:14
 * @Description: 
 */
import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

const data = {
    operationInfo: {},
    stateInfo: [{
        "code": "i12001",
        "name": "工作状态",
        "statename": "故障",
        "state": "1"
    }, {
        "code": "i12110",
        "name": "采样管线故障",
        "statename": "故障",
        "state": "1"
    }, {
        "code": "i12105",
        "name": "探头吹扫",
        "statename": "正常",
        "state": "0"
    }, {
        "code": "i12109",
        "name": "制冷器报警",
        "statename": "正常",
        "state": "0"
    }, {
        "code": "i12106",
        "name": "皮托管吹扫",
        "statename": "故障",
        "state": "1"
    }, {
        "code": "i12108",
        "name": "电源故障",
        "statename": "正常",
        "state": "0"
    }, {
        "code": "i12111",
        "name": "采样探头故障",
        "statename": "正常",
        "state": "0"
    }, {
        "code": "i12115",
        "name": "废液桶液位",
        "statename": "正常",
        "state": "0"
    }, {
        "code": "i12116",
        "name": "蠕动泵状态",
        "statename": "正常",
        "state": "0"
    }, {
        "code": "i12103",
        "name": "分析仪故障",
        "statename": "正常",
        "state": "0"
    }, {
        "code": "i12102",
        "name": "湿度报警",
        "statename": "正常",
        "state": "0"
    }, {
        "code": "i12107",
        "name": "停炉",
        "statename": "正常",
        "state": "0"
    }, {
        "code": "i12117",
        "name": "校准类别",
        "statename": "校零",
        "state": "0"
    }],
    paramsInfo: [{
        "pollutantName": "烟尘",
        "pollutantCode": "01",
        "value": 0,
        "dataparam": "IsException§1§0值异常",
        "pollutantParamInfo": [{
            "statename": "测量量程",
            "value": "2"
        }, {
            "statename": "粉尘仪使用时间",
            "value": "9"
        }, {
            "statename": "斜率",
            "value": "3"
        }, {
            "statename": "稀释比",
            "value": "6"
        }, {
            "statename": "截距",
            "value": "4"
        }, {
            "statename": "加热温度",
            "value": "5"
        }, {
            "statename": "采样流量",
            "value": "7"
        }]
    }, {
        "pollutantName": "二氧化硫",
        "pollutantCode": "02",
        "value": 0.303,
        "dataparam": "",
        "pollutantParamInfo": [{
            "statename": "斜率",
            "value": "11"
        }, {
            "statename": "截距",
            "value": "12"
        }, {
            "statename": "测量量程",
            "value": "10"
        }]
    }, {
        "pollutantName": "氮氧化物",
        "pollutantCode": "03",
        "value": 0.264,
        "dataparam": "",
        "pollutantParamInfo": [{
            "statename": "测量量程",
            "value": "14"
        }, {
            "statename": "截距",
            "value": "16"
        }, {
            "statename": "斜率",
            "value": "15"
        }]
    }, {
        "pollutantName": "流量",
        "pollutantCode": "b02",
        "value": 0,
        "dataparam": "IsException§1§0值异常",
        "pollutantParamInfo": [{
            "statename": "截距",
            "value": "22"
        }, {
            "statename": "测量量程",
            "value": "20"
        }, {
            "statename": "斜率",
            "value": "21"
        }]
    }, {
        "pollutantName": "氧含量",
        "pollutantCode": "s01",
        "value": 29,
        "dataparam": "IsException§3§连续值异常",
        "pollutantParamInfo": [{
            "statename": "斜率",
            "value": "8.68805E-44"
        }, {
            "statename": "测量量程",
            "value": "8.68805E-44"
        }, {
            "statename": "截距",
            "value": "8.68805E-44"
        }]
    }, {
        "pollutantName": "流速",
        "pollutantCode": "s02",
        "value": null,
        "dataparam": null,
        "pollutantParamInfo": [{
            "statename": "测量量程",
            "value": "-125.0113"
        }, {
            "statename": "截距",
            "value": "24"
        }, {
            "statename": "斜率",
            "value": "23"
        }]
    }, {
        "pollutantName": "折算二氧化硫",
        "pollutantCode": "zs02",
        "value": 0,
        "dataparam": "IsException§1§0值异常",
        "pollutantParamInfo": null
    }, {
        "pollutantName": "折算氮氧化物",
        "pollutantCode": "zs03",
        "value": 0,
        "dataparam": "IsException§1§0值异常",
        "pollutantParamInfo": null
    }, {
        "pollutantName": "折算烟尘",
        "pollutantCode": "zs01",
        "value": 0,
        "dataparam": "IsException§1§0值异常",
        "pollutantParamInfo": null
    }, {
        "pollutantName": "烟气温度",
        "pollutantCode": "s03",
        "value": 0,
        "dataparam": "IsException§1§0值异常",
        "pollutantParamInfo": null
    }],
    dataInfo: {
        "pollutantType": '2',
        "16": 24,
        "17": 28,
        "18": 32,
        "30": 4,
        "pointName": "南邵脱硫出口",
        "equipmentType": null,
        "DGIMN": "0102030405060708090A0B0C0D0E0F10",
        "time": "2019-08-05 09:59:53",
        "status": 3,
        "01_params": "IsException§1§0值异常",
        "01": 0,
        "02": 0.303,
        "03": 0.264,
        "a21003": 21,
        "a21005": 25,
        "zs02_params": "IsException§1§0值异常",
        "zs02": 0,
        "zs03_params": "IsException§1§0值异常",
        "zs03": 0,
        "zs01_params": "IsException§1§0值异常",
        "zs01": 0,
        "m004": 8,
        "m002": 12,
        "HF": 16,
        "a24088": 20,
        "s03_params": "IsException§1§0值异常",
        "s03": 0,
        "s08": -5000,
        "b02_params": "IsException§1§0值异常",
        "b02": 0,
        "s05": 0,
        "s01_params": "IsException§3§连续值异常",
        "s01": 29
    },
    stateNameInfo: {
        "i33011": "钢气瓶压力",
        "i33003": "系统采样探头温度",
        "i33007": "采样泵累计使用时间",
        "i33039": "标定状态下标气测量值",
        "i33013": "当地大气压",
        "i33002": "系统冷凝器温度",
        "i33008": "冷凝器温度",
        "i33031": "光学通道1",
        "i33010": "蠕动泵累计使用时间",
        "i33009": "制冷器温度预设值",
        "i33021": "采样流量",
        "i33036": "氧通道",
        "i33012": "分析小屋温度",
        "i33040": "校准偏差值",
        "i33014": "电磁阀累计使用次数",
        "i33004": "探头预设加热温度",
        "i33032": "光学通道2",
        "i33033": "光学通道3",
        "i33034": "光学通道4",
        "i33038": "标气浓度",
        "i33501": "液位高度",
        "i33035": "光学通道5",
        "i33001": "系统采样管线温度",
        "i33037": "标定组分",
        "i12001": "工作状态",
        "i12110": "采样管线故障",
        "i30001": "检测器报警",
        "i12105": "探头吹扫",
        "i12111": "采样探头故障",
        "i12109": "制冷器报警",
        "i12101": "温控报警",
        "i30004": "火焰报警",
        "i30003": "大气平衡状态",
        "i30005": "柱温报警",
        "i12115": "废液桶液位",
        "i12106": "皮托管吹扫",
        "i30002": "周期状态",
        "i12108": "电源故障",
        "i30006": "通道",
        "i12104": "截止阀故障",
        "i12107": "停炉",
        "i12117": "校准类别",
        "i12116": "蠕动泵状态",
        "i12103": "分析仪故障",
        "i12102": "湿度报警"
    },
    paramNameInfo: [{
        "code": "i13104",
        "name": "当前零点"
    }, {
        "code": "i13105",
        "name": "标定系数"
    }, {
        "code": "i13001",
        "name": "测量量程"
    }, {
        "code": "i13007",
        "name": "截距"
    }, {
        "code": "i13008",
        "name": "斜率"
    }, {
        "code": "i13103",
        "name": "校准偏差"
    }, {
        "code": "i13101",
        "name": "标气浓度"
    }, {
        "code": "i13102",
        "name": "零点偏差"
    }, {
        "code": "i13012",
        "name": "粉尘仪使用时间"
    }, {
        "code": "i13010",
        "name": "稀释比"
    }, {
        "code": "i13009",
        "name": "加热温度"
    }, {
        "code": "i13011",
        "name": "采样流量"
    }],
    paramstatusInfo: [{
        "statecode": "i33011",
        "statename": "钢气瓶压力",
        "value": "0"
    }, {
        "statecode": "i33003",
        "statename": "系统采样探头温度",
        "value": "0"
    }, {
        "statecode": "i33007",
        "statename": "采样泵累计使用时间",
        "value": "0"
    }, {
        "statecode": "i33039",
        "statename": "标定状态下标气测量值",
        "value": "10"
    }, {
        "statecode": "i33013",
        "statename": "当地大气压",
        "value": "0"
    }, {
        "statecode": "i33008",
        "statename": "冷凝器温度",
        "value": "0"
    }, {
        "statecode": "i33031",
        "statename": "光学通道1",
        "value": "2"
    }, {
        "statecode": "i33010",
        "statename": "蠕动泵累计使用时间",
        "value": "0"
    }, {
        "statecode": "i33009",
        "statename": "制冷器温度预设值",
        "value": "26"
    }, {
        "statecode": "i33021",
        "statename": "采样流量",
        "value": "1"
    }, {
        "statecode": "i33036",
        "statename": "氧通道",
        "value": "7"
    }, {
        "statecode": "i33012",
        "statename": "分析小屋温度",
        "value": "0"
    }, {
        "statecode": "i33040",
        "statename": "校准偏差值",
        "value": "11"
    }, {
        "statecode": "i33014",
        "statename": "电磁阀累计使用次数",
        "value": "1"
    }, {
        "statecode": "i33004",
        "statename": "探头预设加热温度",
        "value": "0"
    }, {
        "statecode": "i33032",
        "statename": "光学通道2",
        "value": "3"
    }, {
        "statecode": "i33033",
        "statename": "光学通道3",
        "value": "4"
    }, {
        "statecode": "i33034",
        "statename": "光学通道4",
        "value": "5"
    }, {
        "statecode": "i33038",
        "statename": "标气浓度",
        "value": "9"
    }, {
        "statecode": "i33035",
        "statename": "光学通道5",
        "value": "6"
    }, {
        "statecode": "i33001",
        "statename": "系统采样管线温度",
        "value": "-267"
    }, {
        "statecode": "i33037",
        "statename": "标定组分",
        "value": "8"
    }]
}

const params = [{
    "pollutantName": "ph值",
    "pollutantCode": "001",
    "value": 6.43,
    "dataparam": "IsException§1§0值异常",
    "pollutantParamInfo": [{
        "statename": "测量量程",
        "value": "2"
    }, {
        "statename": "粉尘仪使用时间",
        "value": "9"
    }, {
        "statename": "斜率",
        "value": "3"
    }, {
        "statename": "稀释比",
        "value": "6"
    }, {
        "statename": "截距",
        "value": "4"
    }, {
        "statename": "加热温度",
        "value": "5"
    }, {
        "statename": "采样流量",
        "value": "7"
    }]
}, {
    "pollutantName": "COD",
    "pollutantCode": "011",
    "value": 20.757,
    "dataparam": "",
    "pollutantParamInfo": [{
        "statename": "斜率",
        "value": "11"
    }, {
        "statename": "截距",
        "value": "12"
    }, {
        "statename": "测量量程",
        "value": "10"
    }]
}, {
    "pollutantName": "氨氮",
    "pollutantCode": "060",
    "value": 3.34,
    "dataparam": "",
    "pollutantParamInfo": [{
        "statename": "测量量程",
        "value": "14"
    }, {
        "statename": "截距",
        "value": "16"
    }, {
        "statename": "斜率",
        "value": "15"
    }]
}]

export default Model.extend({
    namespace: 'realtimeserver',
    state: {
        operationInfo: null,
        stateInfo: null,
        paramsInfo: null,
        dataInfo: null,
        stateNameInfo: null,
        paramNameInfo: null,
        paramstatusInfo: null
    },
    reducers: {
        updateRealTimeData(state, action) {
            let realtimedata = action.payload.data;
            let pollutantval = [{ pollutantName: 'co', value: 21.1 }, { pollutantName: 'nox', value: 21.1 }]
            realtimedata.map((item, key) => {
                pollutantval.where(() => { });
            });
            return {
                ...state,
                ...action.payload,
            };
        },
    },
    effects: {
        * GetProcessFlowChartStatus({
            payload
        }, { call, update }) {
            const res = yield call(services.GetProcessFlowChartStatus, payload);
            if (res && res.Datas) {
                console.log('dgimn=', payload.dgimn)
                if (payload.dgimn == '101'||payload.dgimn=='45011020152890055') {
                    yield update({
                        operationInfo: data.operationInfo,
                        stateInfo: data.stateInfo,
                        paramsInfo: data.paramsInfo,
                        dataInfo: data.dataInfo,
                        stateNameInfo: data.stateNameInfo,
                        paramNameInfo: data.paramNameInfo,
                        paramstatusInfo: data.paramstatusInfo
                    });
                }
                else {
                    var info = res.Datas.paramsInfo
                    if (payload.dgimn == '42102320160824') {
                        info = params
                    }
                    console.log('info=',info)
                    yield update({
                        operationInfo: res.Datas.operationInfo,
                        stateInfo: res.Datas.stateInfo,
                        paramsInfo: info,
                        dataInfo: res.Datas.dataInfo,
                        stateNameInfo: res.Datas.stateNameInfo,
                        paramNameInfo: res.Datas.paramNameInfo,
                        paramstatusInfo: res.Datas.paramstatusInfo
                    });
                }
            }
            else {
                yield update({
                    operationInfo: null,
                    stateInfo: null,
                    paramsInfo: null,
                    dataInfo: null,
                    stateNameInfo: null,
                    paramNameInfo: null,
                    paramstatusInfo: null
                });
            }
        }
    }
})
