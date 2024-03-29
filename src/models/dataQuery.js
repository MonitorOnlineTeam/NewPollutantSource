import Model from '@/utils/model';
import { message } from 'antd'
import {
  queryhistorydatalist,
} from '../services/monitordata';
import {
  querypollutantlist,
}
  from '../services/baseapi';
import * as services from '../services/dataQueryApi'
import { formatPollutantPopover, getDirLevel } from '@/utils/utils';
import moment from 'moment';
import { airLevel, AQIPopover, IAQIPopover } from '@/pages/monitoring/overView/tools';
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
      beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      pollutantCodes: null,
      pollutantNames: null,
      unit: null,
      isAsc: true,
      DGIMN: '',
    },
    pollutantList: [],
    dataAuditDataSource: [],
    dataFlagDataSource: [],
    tagTableTotal: 0,
    CO2SumData: [],
  },
  effects: {
    * querypollutantlist({ payload, callback,
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
            pollutantCodes: result.map(item => item.PollutantCode).toString(),
            pollutantNames: result.map(item => item.PollutantName).toString(),
            unit: result[0].Unit,
            DGIMN: payload.dgimn,
          }
          yield update({
            historyparams,
          });
          callback && callback(historyparams)
          if (!payload.notLoad) {
            yield put({
              type: 'queryhistorydatalist',
              payload,
            });
            yield take('queryhistorydatalist/@@end');
          }
        }
      } else {
        yield update({ pollutantlist: [], datalist: null, chartdata: null, columns: null, datatable: null, total: 0, DGIMN: payload.dgimn });
      }
    },
    * queryhistorydatalist({
      payload, from,
    }, { select, call, update }) {
      const dataqueryData = yield select(_ => _.dataquery);
      let historyparams = dataqueryData.historyparams;
      let _pollutantlist = dataqueryData.pollutantlist;
      let _historyparams = { ...historyparams, ...payload };
      let pollutantlist = _pollutantlist;
      // 电力：实时类型不显示“有功总累计电能”，其他类型只显示“有功总累计电能”
      if (payload.Type == 37) {
        if (_historyparams.datatype === 'realtime') {
          pollutantlist = _pollutantlist.filter(item => item.PollutantCode !== 'e0011');
        } else {
          pollutantlist = _pollutantlist.filter(item => item.PollutantCode === 'e0011');
        }
      }

      if (!from && (!pollutantlist[0] || !historyparams.pollutantCodes)) {
        yield update({ datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
        return;
      }
      if (payload.dgimn) {
        _historyparams.DGIMNs = payload.dgimn;
      }
      if (!_historyparams.DGIMNs) {
        _historyparams.DGIMNs = _historyparams.DGIMN
      }

      if (from) {
        _historyparams = payload
      }
      // // 如果是初次加载的话
      // if (!historyparams.payloadpollutantCode && pollutantlist.length > 0) {
      //     historyparams.payloadpollutantCode = pollutantlist[0].PollutantCode;
      //     historyparams.payloadpollutantName = pollutantlist[0].PollutantName;
      // }
      const resultlist = yield call(queryhistorydatalist, {
        ..._historyparams,
        DGIMNs: payload.searchDataType === 1 ? _historyparams.DGIMNs : _historyparams.DGIMNs + '_check',
        DGIMN: payload.searchDataType === 1 ? _historyparams.DGIMNs : _historyparams.DGIMNs + '_check'
      });
      const result = resultlist.Datas;
      if (result && result.length === 0) {
        yield update({ datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
        return;
      }
      let xAxis = [];
      const arr = [];
      let i = 0;
      if (result[0].PollutantType === "5AQI") {
        _historyparams.pollutantCodes = "AQI," + _historyparams.pollutantCodes;
        _historyparams.pollutantNames = "AQI," + _historyparams.pollutantNames;
      }
      if (result[0].PollutantType === "5IQI") {
        _historyparams.pollutantCodes = "IQI," + _historyparams.pollutantCodes;
        _historyparams.pollutantNames = "IQI," + _historyparams.pollutantNames;
      }
      const arrname = pollutantlist.map(item => item.PollutantName);
      _historyparams.pollutantCodes.split(',').map((item, key) => {
        let seriesdata = [];
        let series = {
          type: 'line',
          name: '',
          data: [],
          markLine: [],
        };
        let markLine = {};
        const polluntinfo = pollutantlist.find((value, index, arr) =>
          value.PollutantCode === item) || {};
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
          const unit = item.Unit ? `(${item.Unit})` : ''
          pollutantcols = pollutantcols.concat({
            title: <>{item.PollutantName}<br />{unit}</>,
            dataIndex: item.PollutantCode,
            key: item.PollutantCode,
            align: 'center',
            // width,
            render: (value, record, index) => {
              let text = value;
              if (item.PollutantName === '风向') {
                text = getDirLevel(text)
              }
              return formatPollutantPopover(text, record[`${item.PollutantCode}_params`])
            },
          });
        });
        columns = [{
          title: '时间',
          dataIndex: 'MonitorTime',
          key: 'MonitorTime',
          width: 160,
          fixed: payload.Type == 10 ? 'left' : false,
          align: 'center',
          render: (text, record) => {
            let showDetail = "";
            switch (historyparams.datatype) {
              case "month":
                return moment(text).format("YYYY-MM");
              case "quarter":
                switch (moment(text).format("MM-DD")) {
                  case "01-01":
                    return moment(text).format("YYYY") + "年第一季度";
                  case "04-01":
                    return moment(text).format("YYYY") + "年第二季度";
                  case "07-01":
                    return moment(text).format("YYYY") + "年第三季度";
                  case "10-01":
                    return moment(text).format("YYYY") + "年第四季度";
                }
                return moment(text).format("YYYY-MM");
              case "year":
                return moment(text).format("YYYY");
              default:
                return text;

            }
          },
        }];
        if (result && result[0] && result[0].PollutantType === '5AQI' || payload.searchDataType === 2) {
          columns = columns.concat({
            title: 'AQI',
            dataIndex: 'AQI',
            key: 'AQI',
            width: 160,
            // fixed: 'left',
            align: 'center',
            render: (text, record) => {
              return AQIPopover(text, record);
            },
          });
          columns = columns.concat({
            title: '级别',
            dataIndex: 'AirQuality',
            key: 'AirQuality',
            width: 160,
            // fixed: 'left',
            align: 'center',
          });
        }
        if (result && result[0] && result[0].PollutantType === '5IQI') {
          columns = columns.concat({
            title: '综合指数',
            dataIndex: 'IQI',
            key: 'IQI',
            width: 160,
            // fixed: 'left',
            align: 'center',
          });
        }
        columns = columns.concat(pollutantcols);
      } else {
        pollutantlist.map((item, key) => {
          const unit = item.Unit ? `(${item.Unit})` : ''
          pollutantcols = pollutantcols.concat({
            title: <>{item.PollutantName}<br />{unit}</>,
            dataIndex: item.PollutantCode,
            key: item.PollutantCode,
            align: 'center',
            // width,
            render: (value, record, index) => {
              let text = value;
              if (item.PollutantName === '风向') {
                text = getDirLevel(text)
              }
              return formatPollutantPopover(text, record[`${item.PollutantCode}_params`])
            },
          });
        });
        columns = [{
          title: '时间',
          dataIndex: 'MonitorTime',
          key: 'MonitorTime',
          width: 160,
          align: 'center',
          render: (text, record) => {
            let showDetail = "";
            switch (historyparams.datatype) {
              case "month":
                return moment(text).format("YYYY-MM");
              case "quarter":
                switch (moment(text).format("MM-DD")) {
                  case "01-01":
                    return moment(text).format("YYYY") + "年第一季度";
                  case "04-01":
                    return moment(text).format("YYYY") + "年第二季度";
                  case "07-01":
                    return moment(text).format("YYYY") + "年第三季度";
                  case "10-01":
                    return moment(text).format("YYYY") + "年第四季度";
                }
                return moment(text).format("YYYY-MM");
              case "year":
                return moment(text).format("YYYY");
              default:
                return text;

            }
          },
        }];
        if (result && result[0] && result[0].PollutantType === '5AQI') {
          columns = columns.concat({
            title: 'AQI',
            dataIndex: 'AQI',
            key: 'AQI',
            width: 160,
            // fixed: 'left',
            align: 'center',
            render: (text, record) => {
              return AQIPopover(text, record);
            },
          })
          columns = columns.concat({
            title: '级别',
            dataIndex: 'AirQuality',
            key: 'AirQuality',
            width: 160,
            // fixed: 'left',
            align: 'center',
          })
        }
        if (result && result[0] && result[0].PollutantType === '5IQI') {
          columns = columns.concat({
            title: '综合指数',
            dataIndex: 'IQI',
            key: 'IQI',
            width: 160,
            // fixed: 'left',
            align: 'center',
          });
        }
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
        const unit = _historyparams.unit ? `(${_historyparams.unit})` : '';
        option = {
          title: {
            // text: '2018-05-17~2018-05-18'
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            orient: 'vertical',
            x: 'right', // 可设定图例在左、右、居中
            y: 'top', // 可设定图例在上、下、居中
            padding: [40, 16, 0, 0], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
            data: _historyparams.pollutantNames.split(','),
          },
          toolbox: {
            right: 40,
            show: true,
            feature: {
              saveAsImage: {
              },
            },
          },
          xAxis: {
            type: 'category',
            name: '时间',
            boundaryGap: false,
            data: xAxis,
            nameTextStyle: {
              padding: [10, 16]
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
              },
            },
          },
          yAxis: {
            type: 'log',
            name: `浓度值${unit}`,
            axisLabel: {
              formatter: '{value}',
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
              },
            },
          },
          grid: {
            x: 60,
            y: 45,
            x2: 45,
            y2: 20,
            right: 80,
          },
          series: arr,
        };
      }
      yield update({ tablewidth, datalist: result, chartdata: option, columns, datatable: result, total: resultlist.total });
    },

    // 导出报表
    *exportHistoryReport({ payload }, { call, put, update, select }) {
      const { historyparams } = yield select(state => state.dataquery);
      console.log('historyparams=', historyparams)
      const postData = {
        ...historyparams,
        DGIMNs: historyparams.DGIMN,
        ...payload,
      }
      const result = yield call(services.exportHistoryReport, postData);
      if (result.IsSuccess) {
        window.open(result.Datas)
        message.success('导出成功')
      } else {
        message.error(result.Message)
      }
    },
    // 获取数据获取率 - 详情污染物列表
    *getPollutantList({ payload }, { call, put, update }) {
      const result = yield call(services.getDataGainRateDetailPollutantList, payload);
      if (result.IsSuccess) {
        yield update({
          pollutantList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取数据
    *getAllTypeDataForFlag({ payload }, { call, put, update }) {
      const result = yield call(services.getAllTypeDataForFlag, payload);
      if (result.IsSuccess) {
        yield update({
          dataAuditDataSource: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取数据标识
    *updateDataFlag({ payload, callback }, { call, put, update }) {
      const result = yield call(services.updateDataFlag, payload);
      if (result.IsSuccess) {
        message.success('修改成功');
        callback && callback()
      } else {
        message.error(result.Message)
      }
    },
    // 导出报表
    *exportDataAuditReport({ payload, callback }, { call, put, update }) {
      const result = yield call(services.exportDataAuditReport, payload);
      if (result.IsSuccess) {
        message.success('导出成功');
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 数据标记 - 获取数据
    *getAllTypeDataForWryFlag({ payload }, { call, put, update }) {
      const result = yield call(services.getAllTypeDataForWryFlag, payload);
      if (result.IsSuccess) {
        yield update({
          // dataAuditDataSource: result.Datas,
          dataFlagDataSource: result.Datas,
          tagTableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 数据标记 - 修改
    *updateDataWryFlag({ payload, callback }, { call, put, update }) {
      const result = yield call(services.updateDataWryFlag, payload);
      if (result.IsSuccess) {
        message.success('修改成功')
        callback && callback()
      } else {
        message.error(result.Message)
      }
    },
    // 数据标记 - 导出
    *exportDataFlagReport({ payload, callback }, { call, put, update }) {
      const result = yield call(services.exportDataFlagReport, { ...payload, pageSize: null, pageIndex: null });
      if (result.IsSuccess) {
        message.success('导出成功')
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

    // 二氧化碳物料衡算法-获取数据
    *getCO2SumData({ payload }, { call, put, update }) {
      const result = yield call(services.getCO2SumData, payload);
      if (result.IsSuccess) {
        yield update({
          // dataAuditDataSource: result.Datas,
          CO2SumData: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
  },
});
