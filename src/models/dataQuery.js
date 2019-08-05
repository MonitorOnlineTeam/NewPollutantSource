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
          payloadpollutantCode: null,
          payloadpollutantName: null,
          isAsc: true,
        },
    },
    effects: {
        * querypollutantlist({ payload,
        }, { call, update, put, take }) {
            const body = {
                DGIMNs: payload.dgimn,
            }
            const result = yield call(querypollutantlist, body);
            if (result && result[0]) {
                yield update({ pollutantlist: result });
                if (!payload.overdata) {
                yield put({
                  type: 'queryhistorydatalist',
                  payload,
                });
                yield take('queryhistorydatalist/@@end');
            }
            } else {
                yield update({ pollutantlist: [], datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
            }
        },
        * queryhistorydatalist({
            payload,
        }, { select, call, update }) {
            const { pollutantlist, historyparams } = yield select(_ => _.dataquery);
            if (!pollutantlist[0]) {
                yield update({ datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
                return;
            }
            if (payload.dgimn) {
                historyparams.DGIMNs = payload.dgimn;
            }
            // 如果是初次加载的话
            if (!historyparams.payloadpollutantCode && pollutantlist.length > 0) {
                historyparams.payloadpollutantCode = pollutantlist[0].PollutantCode;
                historyparams.payloadpollutantName = pollutantlist[0].PollutantName;
            }
            const resultlist = yield call(queryhistorydatalist, historyparams);
            const result = resultlist.Datas;
            if (!result) {
                yield update({ datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
                return;
            }
            let xAxis = [];
            let seriesdata = [];
            let markLine = {};
            result.map((item, key) => {
                xAxis = xAxis.concat(item.MonitorTime);
                seriesdata = seriesdata.concat(item[historyparams.payloadpollutantCode]);
            });
            const polluntinfo = pollutantlist.find((value, index, arr) =>
             value.PollutantCode === historyparams.payloadpollutantCode);
            let pollutantcols = [];
            let tablewidth = 0;
            let width = (window.screen.availWidth - 200 - 120) / pollutantlist.length;
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
            let columns = [{
                title: '时间',
                dataIndex: 'MonitorTime',
                key: 'MonitorTime',
                width: 200,
                fixed: 'left',
                align: 'center',
            }];
            columns = columns.concat(pollutantcols);
            if (polluntinfo.StandardValue) {
                markLine = {
                    symbol: 'none', // 去掉警戒线最后面的箭头
                    data: [{
                        lineStyle: {
                            type: 'dash',
                            color: polluntinfo.color,
                        },
                        yAxis: polluntinfo.StandardValue,
                    }],
                };
            }
            let option = null;
            if (seriesdata && seriesdata.length > 0) {
                option = {
                    title: {
                        // text: '2018-05-17~2018-05-18'
                    },
                    tooltip: {
                        trigger: 'axis',
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
                        name: '浓度(' + `${historyparams.payloadpollutantName}` + `${polluntinfo.Unit ? polluntinfo.Unit : ''}` + ')',
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
                    series: [{
                        type: 'line',
                        name: historyparams.payloadpollutantName,
                        data: seriesdata,
                        markLine,
                        itemStyle: {
                            normal: {
                                color: '#54A8FF',
                                lineStyle: {
                                    color: '#54A8FF',
                                },
                            },
                        },
                    }],
                };
            }

            yield update({ tablewidth, datalist: result, chartdata: option, columns, datatable: result, total: resultlist.total });
        },
    },
});
