/*
 * @Author: lzp
 * @Date: 2019-09-05 10:57:14
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-05 10:57:14
 * @Description: 
 */
import moment from 'moment';
import * as services from './service';
import {
    queryhistorydatalist,
} from '@/services/monitordata';
import {
    querypollutantlist,
}
    from '@/services/baseapi';
import Model from '@/utils/model';
import { message } from 'antd';
import { ExceptionTypeOnline } from '@/utils/enum';
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
        paramstatusInfo: null,
        DGIMN: "",
        pollutantlist: [],
        option: null,
        chartdata: null,
        selectpoint: [],
        columns: [],
        datatable: [],
        total: 0,
        tablewidth: 0,
        
        historyparams: {
            datatype: 'realtime',
            DGIMNs: null,
            pageIndex: null,
            pageSize: null,
            beginTime: null,
            endTime: null,
            payloadpollutantCode: null,
            payloadpollutantName: null,
            unit: null,
            isAsc: true,
            DGIMN: "",
        },
    },
    effects: {
        * GetProcessFlowChartStatus({
            payload
        }, { call, update }) {
            const res = yield call(services.GetProcessFlowChartStatus, payload);
            if (res && res.Datas) {
                if (payload.dgimn == '101' || payload.dgimn == '45011020152890055') {
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
                    yield update({
                        operationInfo: res.Datas.operationInfo,
                        stateInfo: res.Datas.stateInfo,
                        paramsInfo: info,
                        dataInfo: res.Datas.dataInfo,
                        stateNameInfo: res.Datas.stateNameInfo,
                        paramNameInfo: res.Datas.paramNameInfo,
                        paramstatusInfo: res.Datas.paramstatusInfo,
                        DGIMN: payload.dgimn,
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
                    paramstatusInfo: null,
                    DGIMN: payload.dgimn,
                });
            }
        },
        * querypollutantlist({ payload,
        }, { call, update, put, take, select }) {
            const body = {
                DGIMNs: payload.dgimn,
            }
            const result = yield call(querypollutantlist, body);
            let { historyparams } = yield select(_ => _.realtimeserver);
            let { pollutantlist } = yield select(_ => _.realtimeserver);
            console.log("result=",result);
            if (result && result[0]) {
                yield update({ pollutantlist: result });
                if (!payload.overdata) {
                    historyparams = {
                        ...historyparams,
                        payloadpollutantCode: result[0].PollutantCode,
                        payloadpollutantName: result[0].PollutantName,
                        unit: result[0].Unit,
                        DGIMN: payload.dgimn
                    }
                    yield update({
                        historyparams,
                    });
                    yield put({
                        type: 'queryhistorydatalist',
                        payload,
                    });
                    yield take('queryhistorydatalist/@@end');
                }
            } else {
                yield update({ pollutantlist: [], datalist: null, chartdata: null, columns: null, datatable: null, total: 0, DGIMN: payload.dgimn });
            }
        },
        * queryhistorydatalist({
            payload,
        }, { select, call, update }) {
            const { pollutantlist, historyparams } = yield select(_ => _.realtimeserver);
            if (!pollutantlist[0] || !historyparams.payloadpollutantCode) {
                yield update({ datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
                return;
            }
            if (payload.dgimn) {
                historyparams.DGIMNs = payload.dgimn;
            }
            // // 如果是初次加载的话
            // if (!historyparams.payloadpollutantCode && pollutantlist.length > 0) {
            //     historyparams.payloadpollutantCode = pollutantlist[0].PollutantCode;
            //     historyparams.payloadpollutantName = pollutantlist[0].PollutantName;
            // }
            const resultlist = yield call(queryhistorydatalist, historyparams);
            const result = resultlist.Datas;
            if (result&&result.length === 0) {
                yield update({ datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
                return;
            }
            let xAxis = [];
            const arr = [];

            let i = 0;
            const arrname = historyparams.payloadpollutantName.split(',');
            historyparams.payloadpollutantCode.split(',').map((item, key) => {
                let seriesdata = [];
                let series = {
                    type: 'line',
                    name: '',
                    data: [],
                    markLine: [],
                };
                let markLine = {};
                const polluntinfo = pollutantlist.find((value, index, arr) =>
                    value.PollutantCode === item);
                if (polluntinfo.StandardValue) {
                    markLine = {
                        symbol: 'none', // 去掉警戒线最后面的箭头
                        data: [{
                            // lineStyle: {
                            //     type: 'dash',
                            //     // color: polluntinfo.Color,
                            // },
                            yAxis: polluntinfo.UpperValue,
                        }],
                    };
                }
                result.map((item1, key) => {
                    seriesdata = seriesdata.concat(item1[item]);
                });
                series = {
                    ...series,
                    name: arrname[i],
                    data: seriesdata,
                    markLine,
                }

                arr.push(series);
                i++;
            })
            result.map((item1, key) => {
                xAxis = xAxis.concat(item1.MonitorTime);
            });
            let pollutantcols = [];
            let tablewidth = 0;
            let width = 100;
            let columns = [];
            if (pollutantlist.length > 6) {
                width = (window.screen.availWidth - 200 - 120) / pollutantlist.length;
                if (width < 200) {
                    width = 200;
                }
                tablewidth = width * pollutantlist.length + 200;
                pollutantlist.map((item, key) => {
                    pollutantcols = pollutantcols.concat({
                        title: `${item.PollutantName}(${item.Unit})`,
                        dataIndex: item.PollutantCode,
                        key: item.PollutantCode,
                        align: 'center',
                        width,
                        render: (value, record, index) => formatPollutantPopover(value, record[`${item.PollutantCode}_params`]),
                    });
                });
                columns = [{
                    title: '时间',
                    dataIndex: 'MonitorTime',
                    key: 'MonitorTime',
                    width: 80,
                    fixed: 'left',
                    align: 'center',
                }];
                columns = columns.concat(pollutantcols);
            } else {
                pollutantlist.map((item, key) => {
                    let unit = item.Unit ? "(" + item.Unit + ")" : ""
                    pollutantcols = pollutantcols.concat({
                        title: item.PollutantName + unit,
                        dataIndex: item.PollutantCode,
                        key: item.PollutantCode,
                        align: 'center',
                        width,
                        render: (value, record, index) => formatPollutantPopover(value, record[`${item.PollutantCode}_params`]),
                    });
                });
                columns = [{
                    title: '时间',
                    dataIndex: 'MonitorTime',
                    key: 'MonitorTime',
                    width: 80,
                    align: 'center',
                }];
                columns = columns.concat(pollutantcols);
            }
            let option = null;
            if (arr && arr.length > 0) {
                if (xAxis.length > 20) {
                    xAxis = xAxis.splice(xAxis.length - 20, 20);
                }
                if (arr[0].data.length > 20) {
                    arr[0].data = arr[0].data.splice(arr[0].data.length - 20, 20);
                }
                let unit = historyparams.unit ? `(${historyparams.unit})` : "";
                option = {
                    title: {
                        // text: '2018-05-17~2018-05-18'
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: historyparams.payloadpollutantName.split(','),
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {},
                        },
                    },
                    xAxis: {
                        type: 'category',
                        name: '时间',
                        boundaryGap: false,
                        data: xAxis,
                    },
                    yAxis: {
                        type: 'value',
                        name: "浓度值" + unit,
                        axisLabel: {
                            formatter: '{value}',
                        },
                    },
                    grid: {
                        x: 60,
                        y: 45,
                        x2: 45,
                        y2: 20,
                    },
                    series: arr,
                };
            }
            yield update({ tablewidth, datalist: result, chartdata: option, columns, datatable: result, total: resultlist.total });
        },
    },
    reducers: {
        //更新最新一条数据
        updateRealTimeDatas(state, action) {
            //最新推送数据
            let realtimedata = action.payload.data;
            //原始数据
            let paramsInfo = state.paramsInfo;
            let newInfo = [];
            //异常类型大类，从数据库中对应
            let ExceptionTypeOnline = [
                {
                    id: 1,
                    description: "0值异常"
                },
                {
                    id: 2,
                    description: "超限异常"
                },
                {
                    id: 3,
                    description: "连续值异常"
                },
                {
                    id: 4,
                    description: "设备参数异常"
                },
                {
                    id: 5,
                    description: "人工挑选异常"
                },
                {
                    id: 6,
                    description: "设备状态异常"
                },
            ];
            //如果原生数据和推送数据都不为空并且MN号一致则更新
            if (realtimedata && paramsInfo) {
                if (realtimedata[0].DGIMN === state.DGIMN) {
                    paramsInfo.map((item, index) => {
                        let firstOrDefault = realtimedata.find(n => n.PollutantCode == item.pollutantCode);
                        if (firstOrDefault) {
                            let paratmeter = '';
                            //先判断是否异常(如果异常重新给参数赋标准等参数)
                            if (parseInt(firstOrDefault.IsException) > 0) {
                                paratmeter = "1" + "§" + firstOrDefault.IsException + "§" + ExceptionTypeOnline.find(n => n.id === parseInt(firstOrDefault.IsException)).description;
                            }
                            //在判断是否超标（如果超标更改参数）
                            else if (parseInt(firstOrDefault.IsOver) > 0) {
                                paratmeter = "0" + "§" + firstOrDefault.StandardColor + "§" + firstOrDefault.StandardValue + "§" + firstOrDefault.OverStandValue;
                            }
                            newInfo.push({
                                value: firstOrDefault.MonitorValue,
                                dataparam: paratmeter,
                                pollutantCode: item.pollutantCode,
                                pollutantName: item.pollutantName,
                                DGIMN: state.DGIMN,
                                pollutantParamInfo: item.pollutantParamInfo,
                            }
                            )
                        }
                    })
                    if (newInfo.length !== 0) {
                        return {
                            ...state,
                            paramsInfo: newInfo,
                        };
                    }
                }
            }
            return {
                ...state,
            };
        },

        //更新动态管控参数数据
        updateDynamicControl(state, action) {
            //类型（状态，参数）
            let messageType = action.payload.data.MessageType;
            //最新推送数据
            let newChilddata = action.payload.data.Message;
            //原始参数信息
            let paramsInfo = state.paramsInfo;
            //原始状态信息
            let stateInfo = state.stateInfo;
            //原始状态参数信息
            let paramstatusInfo = state.paramstatusInfo;
            let newparamsInfo = [];
            let newstateInfo = [];
            let newparamstatusInfo = [];
            //MN号相等才能更新数据
            if (newChilddata[0].DGIMN === state.DGIMN) {
                //动态管控参数
                if (messageType === "DynamicControlParam") {
                    //这里只更新点数据，不更新点位污染物状态（再次说明）**********
                    //如果是系统的，更新paramstatusInfo参数状态信息
                    if (newChilddata[0].PollutantCode === "cems") {
                        paramstatusInfo.map((item, key) => {
                            if (item.statecode === newChilddata[0].StateCode) {
                                item.value = newChilddata[0].NewStateValue;
                            }
                            newparamstatusInfo.push(item);
                        })
                    }
                    //证明不是系统的，是污染物的，更新paramsInfo参数信息
                    else {
                        paramsInfo.map((item, key) => {
                            if (item.pollutantCode === newChilddata[0].PollutantCode) {
                                //再此只考虑了状态（截距、斜率、量程）要么全有要么全部没有的情况，里面参数个数要么是3要么是0，个数为1或2的情况没有考虑（可以问一下宏宾）
                                if (item.pollutantParamInfo) {
                                    item.pollutantParamInfo.map((itemChild, keyChild) => {
                                        if (itemChild.stateCode === newChilddata[0].StateCode) {
                                            itemChild.value = newChilddata[0].NewStateValue;
                                        }
                                    })
                                }
                            }
                            newparamsInfo.push(item);
                        })
                    }
                }
                //动态管控状态
                else if (messageType === "DynamicControlState") {
                    if (newChilddata[0].Code === "i12109") {
                        //有可能设备发的code在数据库里面没有，在此不考虑**********
                        //根据MN号和Code查询并替换其它信息
                        stateInfo.map((item, key) => {
                            if (item.code === newChilddata[0].Code) {
                                item.state = newChilddata[0].State;
                                item.statename = newChilddata[0].StateName;
                                item.name = newChilddata[0].Name;
                                item.code = newChilddata[0].Code;
                            }
                            newstateInfo.push(item)
                        })
                    }
                }
                //不能写在一起*********
                //更新参数
                if (newparamsInfo.length !== 0) {
                    return {
                        ...state,
                        paramsInfo: newparamsInfo,
                    };
                }
                //更新参数状态
                else if (newstateInfo.length !== 0) {
                    return {
                        ...state,
                        stateInfo: newstateInfo,
                    };
                }
                //更新系统状态参数
                else if (newparamstatusInfo.length !== 0) {
                    return {
                        ...state,
                        paramstatusInfo: newparamstatusInfo,
                    };
                }
            }
            return {
                ...state,
            };
        },
        updateRealTimeCharts(state, action) {
            //最新推送数据
            let realtimedata = action.payload.data;
            //原始数据
            let chartdata = state.chartdata;
           
            //根据污染物查询出最新数据
            let newDataByPollutant = realtimedata.filter(n => n.PollutantCode == state.historyparams.payloadpollutantCode);
            //纵坐标显示单位
            let unit = state.historyparams.unit ? `(${state.historyparams.unit})` : "";
            //MN号相同的代表是选中的进行数据更新
            if (realtimedata && realtimedata[0].DGIMN === state.historyparams.DGIMN) {
                let newChartInfo = new Object();
                let legendData = [], xAxisdata = [], seriesData = [];
                //如果原始数据初始不为空将固定数据反填到定义对象并进行更新
                if (chartdata) {
                    legendData = chartdata.legend.data;
                    xAxisdata = chartdata.xAxis.data;
                    seriesData = chartdata.series;
                }
                //原始数据为空的话标准先去推送数据中的标准
                else {
                    legendData = state.historyparams.payloadpollutantName.split(',');
                    let markLineData = [];
                    if (parseInt(newDataByPollutant[0].IsOver) > 0) {
                        markLineData = {
                            symbol: 'none', // 去掉警戒线最后面的箭头
                            data: [{
                                lineStyle: {
                                    type: 'dash',
                                    color: newDataByPollutant[0].StandardColor,
                                },
                                yAxis: newDataByPollutant[0].Upperpollutant,
                            }],
                        }
                    }
                    let series = {
                        type: 'line',
                        name: legendData,
                        data: [],
                        markLine: markLineData,
                    }
                    //将小数组添加到大数组中
                    seriesData.push(series);
                }
                //默认展示十条数据
                if (xAxisdata && xAxisdata.length === 20) {
                    xAxisdata = xAxisdata.splice(1, 19);
                }
                xAxisdata.push(realtimedata[0].MonitorTime);
                if (seriesData && seriesData[0] && seriesData[0].data.length === 20) {
                    seriesData[0].data = seriesData[0].data.splice(1, 19);
                }
                seriesData[0].data.push(newDataByPollutant ? newDataByPollutant[0].MonitorValue : 0)
                newChartInfo.title = {};
                newChartInfo.tooltip = {
                    trigger: 'axis',
                };
                newChartInfo.legend = {
                    data: legendData,
                };
                newChartInfo.toolbox = {
                    show: true,
                    feature: {
                        saveAsImage: {},
                    },
                };
                newChartInfo.xAxis = {
                    type: 'category',
                    name: '时间',
                    boundaryGap: false,
                    data: xAxisdata,
                };
                newChartInfo.yAxis = {
                    type: 'value',
                    name: '浓度值' + unit,
                    axisLabel: {
                        formatter: '{value}',
                    },
                };
                newChartInfo.grid = {
                    x: 60,
                    y: 45,
                    x2: 45,
                    y2: 20,
                };
                newChartInfo.series = seriesData;
                return {
                    ...state,
                    chartdata: newChartInfo,
                };
            }
            else {
                return {
                    ...state,
                };
            }

        }
    }
})
