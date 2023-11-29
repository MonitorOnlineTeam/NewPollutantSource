import Model from '@/utils/model';
import { message } from 'antd';
import { queryhistorydatalist } from '../services/monitordata';
import { querypollutantlist } from '../services/baseapi';
import * as services from '../services/dataQueryApi';
import { formatPollutantPopover, getDirLevel } from '@/utils/utils';
import moment from 'moment';
import { airLevel, AQIPopover, IAQIPopover } from '@/pages/monitoring/overView/tools';
import { remove } from 'lodash';
import { downloadFile } from '@/utils/utils';
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
      pageIndex: 1,
      pageSize: 20,
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
    tabType:'shi',
    dateTypes:'realtime',
    dateValues:[moment(new Date()).add(-60, 'minutes'), moment(new Date())]
  },
  effects: {
    *querypollutantlist({ payload, callback }, { call, update, put, take, select }) {

      let  { tabType }  = yield select(_ => _.dataquery);

      const body = {
        DGIMNs: payload.dgimn,
        dataType:tabType=='biao'? 'air' : undefined,
      };
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
          };
          yield update({
            historyparams,
          });
          callback && callback(historyparams);
          if (!payload.notLoad) {
            yield put({
              type: 'queryhistorydatalist',
              payload,
            });
            yield take('queryhistorydatalist/@@end');
          }
        }
      } else {
        yield update({
          pollutantlist: [],
          datalist: null,
          chartdata: null,
          columns: null,
          datatable: null,
          total: 0,
          DGIMN: payload.dgimn,
        });
      }
    },
    *queryhistorydatalist({ payload, from }, { select, call, update }) {
      const { pollutantlist, historyparams } = yield select(_ => _.dataquery);
      let _historyparams = { ...historyparams, ...payload };
      if (!from && (!pollutantlist[0] || !historyparams.pollutantCodes)) {
        yield update({ datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
        return;
      }
      if (payload.dgimn) {
        _historyparams.DGIMNs = payload.dgimn;
      }
      if (!_historyparams.DGIMNs) {
        _historyparams.DGIMNs = _historyparams.DGIMN;
      }

      if (from) {
        _historyparams = payload;
      }
      // // 如果是初次加载的话
      // if (!historyparams.payloadpollutantCode && pollutantlist.length > 0) {
      //     historyparams.payloadpollutantCode = pollutantlist[0].PollutantCode;
      //     historyparams.payloadpollutantName = pollutantlist[0].PollutantName;
      // }
      const resultlist = yield call(queryhistorydatalist, _historyparams);
      const result = resultlist.Datas;
      if (result && result.length === 0) {
        yield update({ datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
        return;
      }
      let xAxis = [];
      const arr = [];
      let yAxisIndex = 0;
      let yAxisRoller = [];
      //如果是大气小时和日添加aqi污染物和空气质量，月季年增加iqi污染物
      let i = 0;
      if (result[0].PollutantType === '5AQI') {
        _historyparams.pollutantCodes = 'AQI,' + _historyparams.pollutantCodes;
        _historyparams.pollutantNames = 'AQI,' + _historyparams.pollutantNames;
      }
      if (result[0].PollutantType === '5IQI') {
        _historyparams.pollutantCodes = 'IQI,' + _historyparams.pollutantCodes;
        _historyparams.pollutantNames = 'IQI,' + _historyparams.pollutantNames;
      }
      //大气浓度
      let arrayConcentration = [
        'IQI',
        'AQI',
        'a34004',
        'a34002',
        'a05024',
        'a21005',
        'a21026',
        'a21004',
        'a21003',
        'a21002',
      ];
      //大气其它
      let arrayOther = ['a01002', 'a01006', 'a01007', 'a01020', 'a01001'];
      //废气浓度
      let arrayConcentrationGas = ['01', 'zs01', '02', 'zs02', '03', 'zs03'];
      //废气其它
      let arrayOtherGas = ['s01', 's02', 's03', 's05', 's08'];
      //废气流量
      let arrayFlowGas = ['b02'];
      //废水浓度
      let arrayConcentrationWater = ['011', '060', '101', '065'];
      //废水其它（PH）
      let arrayOtherWater = ['001'];
      //废水流量
      let arrayFlowWater = ['b01'];
      //将大气类型中的风向污染物去掉，不在曲线图中展示
      _historyparams.pollutantNames = _historyparams.pollutantNames
        .split(',')
        .filter(function(item) {
          return item != '风向';
        })
        .toString();
      const arrname = _historyparams.pollutantNames.split(',');
      _historyparams.pollutantCodes.split(',').map((item, key) => {
        if (item !== 'a01008') {
          //如果是大气
          if (
            result[0].PollutantType === '5AQI' ||
            result[0].PollutantType === '5IQI' ||
            result[0].PollutantType === '5'
          ) {
            //如果包含大气浓度
            if (arrayConcentration.indexOf(item) !== -1) {
              if (
                yAxisRoller.length !== 0 &&
                yAxisRoller.filter(n => n.name == '浓度值').length !== 0
              ) {
                yAxisRoller.push({});
              } else {
                yAxisRoller.push({
                  type: 'value',
                  name: '浓度值',
                  position: 'left',
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: 'dashed',
                    },
                  },
                });
              }
            } else if (arrayOther.indexOf(item) !== -1) {
              if (
                yAxisRoller.length !== 0 &&
                yAxisRoller.filter(n => n.name == '其它').length !== 0
              ) {
                yAxisRoller.push({});
              } else {
                yAxisRoller.push({
                  type: 'value',
                  name: '其它',
                  position: 'right',
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: 'dashed',
                    },
                  },
                });
              }
            } else {
              yAxisRoller.push({});
            }
            if (arrayConcentration.indexOf(item) !== -1) {
              yAxisRoller.map((item, i) => {
                if (item.name === '浓度值') {
                  yAxisIndex = i;
                }
              });
            }
            if (arrayOther.indexOf(item) !== -1) {
              yAxisRoller.map((item, i) => {
                if (item.name === '其它') {
                  yAxisIndex = i;
                }
              });
            }
          }
          //废气
          else if (
            result[0].PollutantType === '2' ||
            result[0].PollutantType === '2AQI' ||
            result[0].PollutantType === '2IQI'
          ) {
            //如果包含废气浓度
            if (arrayConcentrationGas.indexOf(item) !== -1) {
              if (
                yAxisRoller.length !== 0 &&
                yAxisRoller.filter(n => n.name == '浓度值').length !== 0
              ) {
                yAxisRoller.push({});
              } else {
                yAxisRoller.push({
                  type: 'value',
                  name: '浓度值',
                  position: 'left',
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: 'dashed',
                    },
                  },
                });
              }
            } else if (arrayOtherGas.indexOf(item) !== -1) {
              if (
                yAxisRoller.length !== 0 &&
                yAxisRoller.filter(n => n.name == '其它').length !== 0
              ) {
                yAxisRoller.push({});
              } else {
                yAxisRoller.push({
                  type: 'value',
                  name: '其它',
                  position: 'right',
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: 'dashed',
                    },
                  },
                });
              }
            } else if (arrayFlowGas.indexOf(item) !== -1) {
              if (
                yAxisRoller.length !== 0 &&
                yAxisRoller.filter(n => n.name == '流量').length !== 0
              ) {
                yAxisRoller.push({});
              } else {
                yAxisRoller.push({
                  type: 'value',
                  name: '流量',
                  offset: 50,
                  position: 'right',
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: 'dashed',
                    },
                  },
                });
              }
            } else {
              yAxisRoller.push({});
            }
            if (arrayConcentrationGas.indexOf(item) !== -1) {
              yAxisRoller.map((item, i) => {
                if (item.name === '浓度值') {
                  yAxisIndex = i;
                }
              });
            }
            if (arrayOtherGas.indexOf(item) !== -1) {
              yAxisRoller.map((item, i) => {
                if (item.name === '其它') {
                  yAxisIndex = i;
                }
              });
            }
            if (arrayFlowGas.indexOf(item) !== -1) {
              yAxisRoller.map((item, i) => {
                if (item.name === '流量') {
                  yAxisIndex = i;
                }
              });
            }
          }
          //废水
          else if (
            result[0].PollutantType === '1' ||
            result[0].PollutantType === '1AQI' ||
            result[0].PollutantType === '1IQI'
          ) {
            //如果包含大气浓度
            if (arrayConcentrationWater.indexOf(item) !== -1) {
              if (
                yAxisRoller.length !== 0 &&
                yAxisRoller.filter(n => n.name == '浓度值').length !== 0
              ) {
                yAxisRoller.push({});
              } else {
                yAxisRoller.push({
                  type: 'value',
                  name: '浓度值',
                  position: 'left',
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: 'dashed',
                    },
                  },
                });
              }
            } else if (arrayOtherWater.indexOf(item) !== -1) {
              if (
                yAxisRoller.length !== 0 &&
                yAxisRoller.filter(n => n.name == 'PH').length !== 0
              ) {
                yAxisRoller.push({});
              } else {
                yAxisRoller.push({
                  type: 'value',
                  name: 'PH',
                  position: 'right',
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: 'dashed',
                    },
                  },
                });
              }
            } else if (arrayFlowWater.indexOf(item) !== -1) {
              if (
                yAxisRoller.length !== 0 &&
                yAxisRoller.filter(n => n.name == '流量').length !== 0
              ) {
                yAxisRoller.push({});
              } else {
                yAxisRoller.push({
                  type: 'value',
                  name: '流量',
                  offset: 50,
                  position: 'right',
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: 'dashed',
                    },
                  },
                });
              }
            } else {
              yAxisRoller.push({});
            }
            if (arrayConcentrationWater.indexOf(item) !== -1) {
              yAxisRoller.map((item, i) => {
                if (item.name === '浓度值') {
                  yAxisIndex = i;
                }
              });
            }
            if (arrayOtherWater.indexOf(item) !== -1) {
              yAxisRoller.map((item, i) => {
                if (item.name === 'PH') {
                  yAxisIndex = i;
                }
              });
            }
            if (arrayFlowWater.indexOf(item) !== -1) {
              yAxisRoller.map((item, i) => {
                if (item.name === '流量') {
                  yAxisIndex = i;
                }
              });
            }
          }
          //其它情况只添加一个轴
          else {
            if (yAxisRoller.length === 0) {
              yAxisRoller.push({
                type: 'value',
                name: `浓度值`,
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: 'dashed',
                  },
                },
              });
            }
          }
          let seriesdata = [];
          let series = {
            type: 'line',
            name: '',
            data: [],
            markLine: [],
          };
          let markLine = {};
          const polluntinfo =
            pollutantlist.find((value, index, arr) => value.PollutantCode === item) || {};
          if (polluntinfo.StandardValue) {
            markLine = {
              symbol: 'none', // 去掉警戒线最后面的箭头
              data: [
                {
                  // lineStyle: {
                  //     type: 'dash',
                  //     // color: polluntinfo.Color,
                  // },
                  yAxis: polluntinfo.UpperValue,
                },
              ],
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
            yAxisIndex: yAxisIndex,
          };
          arr.push(series);
          i++;
        }
      });
      result.map((item1, key) => {
        switch (historyparams.datatype) {
          case 'month':
            xAxis = xAxis.concat(moment(item1.MonitorTime).format('YYYY-MM'));
            break;
          case 'quarter':
            switch (moment(item1.MonitorTime).format('MM-DD')) {
              case '01-01':
                xAxis = xAxis.concat(moment(item1.MonitorTime).format('YYYY') + '年第一季度');
                break;
              case '04-01':
                xAxis = xAxis.concat(moment(item1.MonitorTime).format('YYYY') + '年第二季度');
                break;
              case '07-01':
                xAxis = xAxis.concat(moment(item1.MonitorTime).format('YYYY') + '年第三季度');
                break;
              case '10-01':
                xAxis = xAxis.concat(moment(item1.MonitorTime).format('YYYY') + '年第四季度');
                break;
            }
            break;
          case 'year':
            xAxis = xAxis.concat(moment(item1.MonitorTime).format('YYYY'));
            break;
          default:
            xAxis = xAxis.concat(item1.MonitorTime);
            break;
        }
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
          let unit = item.Unit ? `(${item.Unit})` : '';
          if( _historyparams.datatype=="realtime")
          {
            if(item.PollutantCode=="b01")
            {
               unit="(L/s)";
            }
            else if(item.PollutantCode=="b02")
            {
              unit="(m³/s)";
            }
          }
        
        
          pollutantcols = pollutantcols.concat({
            title: (
              <>
                {item.PollutantName}
                <br />
                {unit}
              </>
            ),
            dataIndex: item.PollutantCode,
            key: item.PollutantCode,
            align: 'center',
            // width,
            render: (value, record, index) => {
              let text = value;
              if (item.PollutantName === '风向') {
                text = getDirLevel(text);
              }
              return formatPollutantPopover(text, record[`${item.PollutantCode}_params`]);
            },
          });
        });
        columns = [
          {
            title: '时间',
            dataIndex: 'MonitorTime',
            key: 'MonitorTime',
            width: 160,
            // fixed: 'left',
            align: 'center',
            render: (text, record) => {
              let showDetail = '';
              switch (historyparams.datatype) {
                case 'month':
                  return moment(text).format('YYYY-MM');
                case 'quarter':
                  switch (moment(text).format('MM-DD')) {
                    case '01-01':
                      return moment(text).format('YYYY') + '年第一季度';
                    case '04-01':
                      return moment(text).format('YYYY') + '年第二季度';
                    case '07-01':
                      return moment(text).format('YYYY') + '年第三季度';
                    case '10-01':
                      return moment(text).format('YYYY') + '年第四季度';
                  }
                case 'year':
                  return moment(text).format('YYYY');
                default:
                  return text;
              }
            },
          },
        ];
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
          let unit = item.Unit ? `(${item.Unit})` : '';
          if( _historyparams.datatype=="realtime")
          {
            if(item.PollutantCode=="b01")
            {
               unit="(L/s)";
            }
            else if(item.PollutantCode=="b02")
            {
              unit="(m³/s)";
            }
          }
          debugger;
          pollutantcols = pollutantcols.concat({
            title: (
              <>
                {item.PollutantName}
                <br />
                {unit}
              </>
            ),
            dataIndex: item.PollutantCode,
            key: item.PollutantCode,
            align: 'center',
            // width,
            render: (value, record, index) => {
              let text = value;
              if (item.PollutantName === '风向') {z
                text = getDirLevel(text);
              }
              return formatPollutantPopover(text, record[`${item.PollutantCode}_params`]);
            },
          });
        });
        columns = [
          {
            title: '时间',
            dataIndex: 'MonitorTime',
            key: 'MonitorTime',
            width: 160,
            align: 'center',
            render: (text, record) => {
              let showDetail = '';
              switch (historyparams.datatype) {
                case 'month':
                  return moment(text).format('YYYY-MM');
                case 'quarter':
                  switch (moment(text).format('MM-DD')) {
                    case '01-01':
                      return moment(text).format('YYYY') + '年第一季度';
                    case '04-01':
                      return moment(text).format('YYYY') + '年第二季度';
                    case '07-01':
                      return moment(text).format('YYYY') + '年第三季度';
                    case '10-01':
                      return moment(text).format('YYYY') + '年第四季度';
                  }
                  return moment(text).format('YYYY-MM');
                case 'year':
                  return moment(text).format('YYYY');
                default:
                  return text;
              }
            },
          },
        ];
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

        // if(result && result[0] && result[0].PollutantType !== '5IQI' && result[0].PollutantType !== '5AQI')
        // {
        //   tablewidth=tablewidth+50
        //   columns=columns.concat({
        //     title: '是否停产',
        //     dataIndex: 'stop',
        //     key: 'stop',
        //     width: 50,
        //     // fixed: 'left',
        //     align: 'center',
        //   });
        // }
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
            //格式化风向并重新拼接数据
            formatter: function(params) {
              let res = [];
              let listItem = '';
              res.push('<div >时间：' + params[0].name + '</div>');
              for (var i = 0; i < params.length; i++) {
                if (params[i].seriesName == '风向') {
                  res.push(
                    '<div ><i style="width: 10px;height: 10px;display: inline-block;background: ' +
                      params[i].color +
                      ';margin-right: 5px;border-radius: 50%;}"></i><span style=" display:inline-block;">' +
                      params[i].seriesName +
                      '：' +
                      getDirLevel(params[i].data) +
                      '</div>',
                  );
                } else {
                  res.push(
                    '<div><i style="width: 10px;height: 10px;display: inline-block;background: ' +
                      params[i].color +
                      ';margin-right: 5px;border-radius: 50%;}"></i><span style=" display:inline-block;">' +
                      params[i].seriesName +
                      '：' +
                      params[i].data +
                      '</div>',
                  );
                }
              }
              listItem = res.join('');
              return '<div class="showBox">' + listItem + '</div>';
            },
          },
          legend: {
            // orient: 'vertical',
            // x: 'right', // 可设定图例在左、右、居中
            y: 'top', // 可设定图例在上、下、居中
            padding: [25, 130, 0, 0], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
            data: _historyparams.pollutantNames.split(','),
          },
          toolbox: {
            right: 130,
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
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
              },
            },
          },
          yAxis: yAxisRoller,
          // yAxis: {
          //   type: 'value',
          //   name: `浓度值${unit}`,
          //   axisLabel: {
          //     formatter: '{value}',
          //   },
          //   splitLine: {
          //     show: true,
          //     lineStyle: {
          //       type: 'dashed',
          //     },
          //   },
          // },
          grid: {
            x: 60,
            y: 45,
            x2: 62,
            y2: 20,
            containLabel: true,
          },
          series: arr,
        };
      }

      if(result && result[0] && result[0].PollutantType !== '5IQI' && result[0].PollutantType !== '5AQI')
      {
        tablewidth=tablewidth+50
        columns=columns.concat({
          title: '是否停运',
          dataIndex: 'stop',
          key: 'stop',
          width: 50,
          // fixed: 'left',
          align: 'center',
        });
      }
      yield update({
        tablewidth,
        datalist: result,
        chartdata: option,
        columns,
        datatable: result,
        total: resultlist.Total,
      });
    },

    // 导出报表
    *exportHistoryReport({ payload }, { call, put, update, select }) {
      const { historyparams } = yield select(state => state.dataquery);
      console.log('historyparams=', historyparams);
      const postData = {
        ...historyparams,
        DGIMNs: historyparams.DGIMN,
        ...payload,
      };
      const result = yield call(services.exportHistoryReport, postData);
      if (result.IsSuccess) {
        window.open(result.Datas);
        message.success('导出成功');
      } else {
        message.error(result.Message);
      }
    },
    // 获取数据获取率 - 详情污染物列表
    *getPollutantList({ payload }, { call, put, update }) {
      const result = yield call(services.getDataGainRateDetailPollutantList, payload);
      if (result.IsSuccess) {
        yield update({
          pollutantList: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 获取数据
    *getAllTypeDataForFlag({ payload }, { call, put, update }) {
      const result = yield call(services.getAllTypeDataForFlag, payload);
      if (result.IsSuccess) {
        yield update({
          dataAuditDataSource: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 获取数据标识
    *updateDataFlag({ payload, callback }, { call, put, update }) {
      const result = yield call(services.updateDataFlag, payload);
      if (result.IsSuccess) {
        message.success('修改成功');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 导出报表
    *exportDataAuditReport({ payload, callback }, { call, put, update }) {
      const result = yield call(services.exportDataAuditReport, payload);
      if (result.IsSuccess) {
        message.success('导出成功');
        window.open(result.Datas);
      } else {
        message.error(result.Message);
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
        });
      } else {
        message.error(result.Message);
      }
    },
    // 数据标记 - 修改
    *updateDataWryFlag({ payload, callback }, { call, put, update }) {
      const result = yield call(services.updateDataWryFlag, payload);
      if (result.IsSuccess) {
        message.success('修改成功');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 数据标记 - 导出
    *exportDataFlagReport({ payload, callback }, { call, put, update }) {
      const result = yield call(services.exportDataFlagReport, {
        ...payload,
        pageSize: null,
        pageIndex: null,
      });
      if (result.IsSuccess) {
        message.success('导出成功');
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    *exportPlatformAnalysisReport({ payload }, { call, put, update, select }) { //导出 平台分析报告
      const result = yield call(services.exportPlatformAnalysisReport, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/wwwroot${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },
  },
});
