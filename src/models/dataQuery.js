import Model from '@/utils/model';
import {
    queryhistorydatalist,
} from '../services/monitordata';
import {
    querypollutantlist,
}
    from '../services/baseapi';
import { formatPollutantPopover } from '@/utils/utils';

export default Model.extend({
    namespace: 'dataquery',
    state: {
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
            pollutantCodes: null,
            pollutantNames: null,
            unit: null,
            isAsc: true,
            DGIMN: '',
        },
    },
    effects: {
        * querypollutantlist({ payload,
        }, { call, update, put, take, select }) {
            const body = {
                DGIMNs: payload.dgimn,
            }
            const result = yield call(querypollutantlist, body);
            let { historyparams } = yield select(_ => _.dataquery);
            const { pollutantlist } = yield select(_ => _.dataquery);
            if (result && result[0]) {
                yield update({ pollutantlist: result });
                if (!payload.overdata) {
                    historyparams = {
                        ...historyparams,
                        pollutantCodes: result[0].PollutantCode,
                        pollutantNames: result[0].PollutantName,
                        unit: result[0].Unit,
                        DGIMN: payload.dgimn,
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
            const { pollutantlist, historyparams } = yield select(_ => _.dataquery);
            if (!pollutantlist[0] || !historyparams.pollutantCodes) {
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
            if (result && result.length === 0) {
                yield update({ datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
                return;
            }
            let xAxis = [];
            const arr = [];

            let i = 0;
            const arrname = historyparams.pollutantNames.split(',');
            historyparams.pollutantCodes.split(',').map((item, key) => {
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
                    width: 150,
                    fixed: 'left',
                    align: 'center',
                }];
                columns = columns.concat(pollutantcols);
            } else {
                pollutantlist.map((item, key) => {
                    const unit = item.Unit ? `(${item.Unit})` : ''
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
                    width: 160,
                    align: 'center',
                }];
                columns = columns.concat(pollutantcols);
            }
            let option = null;
            if (arr && arr.length > 0) {
                // if (xAxis.length > 20) {
                //     xAxis = xAxis.splice(xAxis.length - 20, 20);
                // }
                // if (arr[0].data.length > 20) {
                //     arr[0].data = arr[0].data.splice(arr[0].data.length - 20, 20);
                // }
                const unit = historyparams.unit ? `(${historyparams.unit})` : '';
                option = {
                    title: {
                        // text: '2018-05-17~2018-05-18'
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: historyparams.pollutantNames.split(','),
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
                        name: `浓度值${unit}`,
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
        updateRealTimeCharts(state, action) {
            // 最新推送数据
            const realtimedata = action.payload.data;
            // 原始数据
            const {chartdata} = state;

            // 根据污染物查询出最新数据
            const newDataByPollutant = realtimedata.filter(n => n.PollutantCode == state.historyparams.pollutantCodes);
            // 纵坐标显示单位
            const unit = state.historyparams.unit ? `(${state.historyparams.unit})` : '';
            // MN号相同的代表是选中的进行数据更新
            if (realtimedata && realtimedata[0].DGIMN === state.historyparams.DGIMN) {
                const newChartInfo = new Object();
                let legendData = []; let xAxisdata = []; let
seriesData = [];
                // 如果原始数据初始不为空将固定数据反填到定义对象并进行更新
                if (chartdata) {
                    legendData = chartdata.legend.data;
                    xAxisdata = chartdata.xAxis.data;
                    seriesData = chartdata.series;
                }
                // 原始数据为空的话标准先去推送数据中的标准
                else {
                    legendData = state.historyparams.pollutantNames.split(',');
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
                    const series = {
                        type: 'line',
                        name: legendData,
                        data: [],
                        markLine: markLineData,
                    }
                    // 将小数组添加到大数组中
                    seriesData.push(series);
                }
                // 默认展示十条数据
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
                    name: `浓度值${unit}`,
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

                return {
                    ...state,
                };
        },
    },
});
