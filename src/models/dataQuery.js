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
                      payloadpollutantCode: result[0].PollutantCode,
                      payloadpollutantName: result[0].PollutantName,
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
                yield update({ pollutantlist: [], datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
            }
        },
        * queryhistorydatalist({
            payload,
        }, { select, call, update }) {
            const { pollutantlist, historyparams } = yield select(_ => _.dataquery);
            debugger;
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
            if (result.length === 0) {
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
                         lineStyle: {
                           type: 'dash',
                           color: polluntinfo.color,
                         },
                         yAxis: polluntinfo.StandardValue,
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
                  width: 50,
                  fixed: 'left',
                  align: '  center',
                }];
                columns = columns.concat(pollutantcols);
            } else {
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
                  width: 50,
                  align: 'center',
                }];
                columns = columns.concat(pollutantcols);
            }

            let option = null;
            if (arr && arr.length > 0) {
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
                        name: '浓度值',
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
});
