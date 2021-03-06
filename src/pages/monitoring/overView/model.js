/*
 * @Author: lzp
 * @Date: 2019-07-16 09:59:25
 * @LastEditors: lzp
 * @LastEditTime: 2019-07-16 09:59:25
 * @Description: 数据一览
 */
import React from 'react';
import moment from 'moment';
// import { message } from 'antd';
import { Popover, Badge, Divider, message } from 'antd';
import { mainpollutantInfo, mainpoll, enterpriceid, onlyOneEnt } from '@/config';
import { getPollutantTypeList } from '@/services/baseapi';
import {
  querypollutanttypecode,
  querydatalist,
  querylastestdatalist,
  queryhistorydatalist,
  querypollutantlist,
  querygetentdatalist,
  getRealTimeColumn,
  getRealTimeDataView,
} from './services';
import Model from '@/utils/model';
import { isNullOrUndefined } from 'util';
import { formatPollutantPopover } from '@/utils/utils';

export default Model.extend({
  namespace: 'overview',
  state: {
    dataTemp: [],
    lastestdata: [],
    mainpcol: [],
    detailpcol: [],
    detaildata: [],
    chartdata: [],
    existdata: false,
    gwidth: 0,
    gheight: 0,
    pollutantName: [],
    detailtime: null,
    addtaskstatus: false,
    pollutantTypelist: null,
    entbaseinfo: null,
    selectent: null,
    selectpoint: null,
    onlypollutantList: [],
    selectpollutantTypeCode: '',
    // 数据一览表头
    columns: [],
    data: [],
    dataOne: null, // 如果有点信息去第一个数据的MN号码
    entlist: [],
    // 数据一览的参数
    dataOverview: {
      selectStatus: null,
      time: moment(new Date()).add(-1, 'hour'),
      terate: null,
      pointName: null,
      entName: null,
    },
    mapdetailParams: {
      dataType: 'HourData',
      datatype: 'hour',
      isAsc: true,
      endTime: moment(new Date()).format('YYYY-MM-DD HH:00:00'),
      beginTime: moment(new Date())
        .add('hour', -23)
        .format('YYYY-MM-DD HH:00:00'),
      pollutantCode: null,
      pollutantName: null,
    },
    upLoadParameters: {
      manualUploaddataOne: null,
      pointName: null,
      pollutantTypes: '2',
      RunState: '2',
    },
    // 实时数据一览
    realtimeColumns: [],
    realTimeDataView: [],
    dataType: 'HourData',
  },
  effects: {
    *init({ payload }, { call, take, select }) {
      const dd1 = yield select(state => state.common);
      yield take('common/getPollutantTypeList/@@end');

      payload.callback();
    },

    *querypollutanttypecode({ payload }, { call, update, put, take, select }) {
      let gwidth = 300 + 140 + 70;
      if (!onlyOneEnt) {
        gwidth += 300;
      }
      const { dataOverview, selectpollutantTypeCode } = yield select(a => a.overview);
      const body = {
        pollutantTypes: selectpollutantTypeCode,
      };
      const data = yield call(querypollutanttypecode, body);
      // yield put({
      //   type: 'getPollutantTypeList',
      //   payload: {},
      // });
      // yield take('getPollutantTypeList/@@end');
      if (data) {
        gwidth += 200 * data.length;
      }

      let realtimeColumns = [];
      if (selectpollutantTypeCode == 5 || selectpollutantTypeCode == 12) {
        realtimeColumns = [{
          field: 'PrimaryPollutant',
          title: '首要污染物',
        }, {
          title: 'AQI',
          field: 'AQI',
        }]
      }

      yield update({
        columns: [
          ...realtimeColumns,
          ...data,
        ] || [],
        gwidth,
      });
    },
    *querydatalist({ payload }, { call, update, put, select }) {
      const {
        dataOverview,
        selectpollutantTypeCode,
        RunState,
        selectent,
        entbaseinfo,
      } = yield select(a => a.overview);
      let entCode = selectent ? selectent.entCode : entbaseinfo ? entbaseinfo.entCode : null;
      if (payload.entCode) {
        entCode = payload.entCode;
      }
      let body = {
        time: dataOverview.time,
        pollutantTypes: selectpollutantTypeCode,
        pointName: dataOverview.pointName,
        status: dataOverview.selectStatus,
        terate: dataOverview.terate,
        entName: dataOverview.entName,
        entCode,
        ...payload,
      };
      if (body.time) {
        body.time = body.time.format('YYYY-MM-DD HH:00:00');
      }
      if (payload.isAll) {
        body = {};
      }
      const data = yield call(querydatalist, body);
      if (data) {
        data.map(item => {
          item.position = {
            longitude: item.longitude,
            latitude: item.latitude,
          };
          item.key = item.DGIMN;
        });
      }
      const { selectpoint } = yield select(_ => _.overview);
      if (selectpoint) {
        const newpoint = data.find(value => value.DGIMN == selectpoint.DGIMN);
        yield update({
          selectpoint: newpoint,
        });
      }
      yield update({ data });
      yield update({ dataTemp: data });
      yield update({ dataOne: data == null ? '0' : data.length == 0 ? '0' : data[0].DGIMN });
      if (payload.callback === undefined) {
      } else {
        payload.callback(data);
      }
    },
    // 手工数据上传数据列表（单独独立）
    *manualUploadQuerydatalist({ payload }, { call, update, put, take, select }) {
      const { upLoadParameters } = yield select(a => a.overview);
      const body = {
        pollutantTypes: upLoadParameters.pollutantTypes,
        pointName: upLoadParameters.pointName,
        RunState: upLoadParameters.RunState,
      };
      const data = yield call(querydatalist, body);
      if (data) {
        yield update({ data });
        yield update({ dataTemp: data });
      } else {
        yield update({ data: null });
      }
      yield update({
        upLoadParameters: {
          ...upLoadParameters,
          manualUploaddataOne: data == null ? '0' : data.length == 0 ? '0' : data[0].DGIMN,
        },
      });
    },
    *querylastestdatalist({ payload }, { call, update }) {
      const res = yield call(querylastestdatalist, payload);
      if (res.data) {
        yield update({ lastestdata: res.data });
      } else {
        yield update({ lastestdata: [] });
      }
    },
    // 主要污染物
    *querymainpollutantlist({ payload }, { call, update }) {
      let col = [
        {
          title: '监测点',
          dataIndex: 'pointName',
          key: 'pointName',
          width: 110,
          align: 'center',
        },
      ];
      mainpollutantInfo.map((item, key) => {
        col = col.concat({
          title: `${item.pollutantName}(${item.unit})`,
          dataIndex: item.pollutantCode,
          key: item.pollutantCode,
          align: 'center',
          render: (value, record, index) => formatPollutantPopover(value, record[`${item.pollutantCode}_params`]),
        });
      });
      yield update({ mainpcol: col });
    },
    *querydetailpollutant({ payload }, { call, update, put, take, select }) {
      const { selectpoint, mapdetailParams } = yield select(a => a.overview);
      let pollutantInfoList = yield call(querypollutanttypecode, {
        pollutantTypes: selectpoint.pollutantTypeCode,
      });

      // 没绑定污染物则不渲染
      if (!pollutantInfoList || !pollutantInfoList[0]) {
        yield update({
          detailtime: null,
          detaildata: null,
          detailpcol: null,
          pollutantName: null,
          existdata: false,
          mapdetailParams: {
            ...mapdetailParams,
            pollutantCode: null,
            pollutantName: null,
          },
        });
        return;
      }
      pollutantInfoList = pollutantInfoList.filter(value => value.isMainPollutant == true);
      yield update({
        mapdetailParams: {
          ...mapdetailParams,
          pollutantCode: pollutantInfoList[0].field,
          pollutantName: pollutantInfoList[0].name,
        },
      });
      // 地图详细表格列头
      let detailpcol = [
        {
          title: '因子',
          dataIndex: 'pollutantName',
          key: 'pollutantName',
          align: 'center',
        },
        {
          title: '浓度',
          dataIndex: 'pollutantCode',
          key: 'pollutantCode',
          align: 'center',
          render: (value, record, index) => {
            if (selectpoint.stop) {
              return '停运';
            }

            return formatPollutantPopover(value, record.pollutantCodeParam);
          },
        },
      ];
      // 只有废气有折算浓度
      if (selectpoint.pollutantTypeCode == 2) {
        detailpcol = detailpcol.concat({
          title: '折算',
          dataIndex: 'zspollutantCode',
          key: 'zspollutantCode',
          align: 'center',
          render: (value, record, index) => {
            if (selectpoint.stop) {
              return '停运';
            }
            return formatPollutantPopover(value, record.zspollutantCodeParam);
          },
        });
      }

      const detaildata = [];
      let detailtime = null;
      const body = {
        dataType: mapdetailParams.dataType,
        DGIMNs: selectpoint.DGIMN,
        isLastest: true,
      };
      const res = yield call(querylastestdatalist, body);
      if (res.data && res.data[0]) {
        detailtime = res.data[0].MonitorTime;
        pollutantInfoList.map(item => {
          let zspollutantCode;
          let zspollutantCodeParam;
          let pollutantCode;
          if (res.data[0][item.field] || res.data[0][item.field] === 0) {
            pollutantCode = res.data[0][item.field];
          } else {
            pollutantCode = '-';
          }

          if (selectpoint.pollutantTypeCode == 2) {
            if (res.data[0][`zs${item.field}`] === 0 || res.data[0][`zs${item.field}`]) {
              zspollutantCode = res.data[0][`zs${item.field}`];
            } else {
              zspollutantCode = '-';
            }
            zspollutantCodeParam = res.data[0][`zs${item.field}_params`];
          }
          detaildata.push({
            pollutantName: item.name,
            pollutantCode,
            pollutantCodeParam: res.data[0][`${item.field}_params`],
            zspollutantCode,
            zspollutantCodeParam,
            dgimn: payload.dgimn,
            pcode: item.field,
          });
        });
      }
      yield update({
        detailtime,
        detaildata,
        detailpcol,
      });
      yield put({
        type: 'queryoptionDataOnClick',
        payload: {
          ...payload,
          isAsc: true,
        },
      });
      yield take('queryoptionDataOnClick/@@end');
    },
    *queryoptionDataOnClick({ payload }, { call, update, select, take }) {
      const { mapdetailParams, selectpoint, selectpollutantTypeCode } = yield select(
        a => a.overview,
      );

      const body = {
        DGIMNs: selectpoint.DGIMN,
        datatype: mapdetailParams.datatype,
        beginTime: mapdetailParams.beginTime,
        endTime: mapdetailParams.endTime,
        isAsc: mapdetailParams.isAsc,
      };
      const pollutantparams = {
        DGIMNs: selectpoint.DGIMN,
      };
      const resultlist = yield call(queryhistorydatalist, body);
      const pollutantlist = yield call(querypollutantlist, pollutantparams);
      let seriesdata = [];
      let zsseriesdata = [];
      let xData = [];
      if (resultlist && resultlist.data) {
        resultlist.data.map(item => {
          const time = moment(item.MonitorTime).hour();
          xData = xData.concat(time);
          seriesdata = seriesdata.concat(item[mapdetailParams.pollutantCode]);
          zsseriesdata = zsseriesdata.concat(item[`zs${mapdetailParams.pollutantCode}`]);
        });
      }
      // 污染物标准线的组织;
      let polluntinfo;
      let zspolluntinfo;
      let markLine = {};
      let zsmarkLine = {};
      if (pollutantlist) {
        polluntinfo = pollutantlist.find(
          (value, index, arr) => value.pollutantCode === mapdetailParams.pollutantCode,
        );
        zspolluntinfo = pollutantlist.find(
          (value, index, arr) => value.pollutantCode === `zs${mapdetailParams.pollutantCode}`,
        );
      }
      if (polluntinfo && polluntinfo.standardValue) {
        markLine = {
          symbol: 'none', // 去掉警戒线最后面的箭头
          data: [
            {
              lineStyle: {
                type: 'dash',
                color: '#54A8FF',
              },
              yAxis: polluntinfo.standardValue,
            },
          ],
        };
      }
      if (zspolluntinfo && zspolluntinfo.standardValue) {
        zsmarkLine = {
          symbol: 'none', // 去掉警戒线最后面的箭头
          data: [
            {
              lineStyle: {
                type: 'dash',
                color: '#FF00FF',
              },
              yAxis: zspolluntinfo.standardValue,
            },
          ],
        };
      }
      let existdata = true;
      if (!seriesdata[0] && seriesdata[0] != 0 && (!zsseriesdata[0] && zsseriesdata[0] != 0)) {
        existdata = false;
      }
      const pollutantInfoList = mainpoll.find(
        value => value.pollutantCode == selectpollutantTypeCode,
      );
      const legend = [mapdetailParams.pollutantName];
      if (pollutantInfoList.zspollutant) {
        legend.push(`折算${mapdetailParams.pollutantName}`);
      }
      const option = {
        legend: {
          data: legend,
        },
        tooltip: {
          trigger: 'axis',
          formatter(params, ticket, callback) {
            let res = `${params[0].axisValue}时<br/>`;
            params.map(item => {
              res += `${item.seriesName}:${item.value}<br />`;
            });
            return res;
          },
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
          data: xData,
        },
        yAxis: {
          type: 'value',
          name: '浓度(' + 'mg/m³' + ')',
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            type: 'line',
            name: mapdetailParams.pollutantName,
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
          },
          {
            type: 'line',
            name: `折算${mapdetailParams.pollutantName}`,
            data: zsseriesdata,
            markLine: zsmarkLine,
            itemStyle: {
              normal: {
                color: '#FF00FF',
                lineStyle: {
                  color: '#FF00FF',
                },
              },
            },
          },
        ],
      };

      yield update({
        chartdata: option,
        existdata,
        pollutantName: mapdetailParams.pollutantName,
      });
    },

    // 获取系统污染物类型
    *getPollutantTypeList({ payload }, { call, update, put, take }) {
      const res = yield call(getPollutantTypeList, payload);
      if (res.IsSuccess) {
        yield update({
          pollutantTypelist: res.Datas,
        });
        if (!payload.treeCard) {
          yield put({
            type: 'querydatalist',
            payload: {
              ...payload,
            },
          });
          yield take('querydatalist/@@end');
        }
      } else {
        yield update({
          pollutantTypelist: null,
        });
      }
    },

    *querygetentdatalist({ payload }, { call, update, put, take }) {
      const body = { entName: payload.entName };
      const entlist = yield call(querygetentdatalist, body);
      yield update({ entlist });
    },

    // 获取实时数据一览
    *getRealTimeDataView({ payload }, { call, update, select }) {
      const result = yield call(getRealTimeDataView, payload);
      if (result.IsSuccess) {
        yield update({
          realTimeDataView: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取实时数据一览表头
    *getRealTimeColumn({ payload }, { call, update }) {
      const result = yield call(getRealTimeColumn, payload);
      let realtimeColumns = [];
      if (payload.pollutantTypes == 5 || payload.pollutantTypes == 12) {
        realtimeColumns = realtimeColumns.concat([{
          title: 'AQI',
          field: 'AQI',
          wrw: false,
        }, {
          field: 'AirQuality',
          title: '空气质量',
          width: 70,
          wrw: false,
        }, {
          field: 'PrimaryPollutant',
          title: '首要污染物',
          width: 120,
          wrw: false,
        }])
      }
      if (result.IsSuccess) {
        yield update({
          realtimeColumns: [
            ...realtimeColumns,
            ...result.Datas,
          ],
        })
      } else {
        message.error(result.Message)
      }
    },
  },
  reducers: {
    // 实时
    updateRealTimeDataView(state, { payload }) {
      const newRealTimeDataView = state.realTimeDataView;
      const { dataType } = state;
      if (newRealTimeDataView.length && payload.type == dataType) {
        payload.message.map(item => {
          newRealTimeDataView.map((itm, idx) => {
            if (item.DGIMN == itm.DGIMN && itm[item.PollutantCode] != undefined) {
              // console.log("code=", newRealTimeDataView[idx][item.PollutantCode])
              // console.log("newCode=", item.MonitorValue)
              // console.log("MonitorTime=", newRealTimeDataView[idx]["MonitorTime"])
              // console.log("newMonitorTime=", item.MonitorTime)
              newRealTimeDataView[idx][item.PollutantCode] = item.MonitorValue;
              newRealTimeDataView[idx].MonitorTime = item.MonitorTime;
              // 数据异常
              // 异常§异常类别编号§异常类别名称
              if (item.IsException) {
                newRealTimeDataView[idx][`${item.PollutantCode}_params`] = `1§${item.IsException}§${item.ExceptionType}`;
              } else {
                delete newRealTimeDataView[idx][`${item.PollutantCode}_params`];
              }
              // 数据超标
              // 超标§报警颜色§标准值§超标倍数
              if (item.IsOver > -1) {
                newRealTimeDataView[idx][`${item.PollutantCode}_params`] = `0§null§${item.StandardValue}§${item.OverStandValue}`;
              } else {
                delete newRealTimeDataView[idx][`${item.PollutantCode}_params`];
              }
              // newRealTimeDataView[idx]["IsException"] = item.IsException;
              // newRealTimeDataView[idx][item.PollutantCode + "_params"] = `${item.IsException}§${item.IsException}§${item.ExceptionType}`;
              // newRealTimeDataView[idx]["ExceptionType"] = item.ExceptionType;

              // newRealTimeDataView[idx]["IsOver"] = item.IsOver;
              // newRealTimeDataView[idx]["OverStandValue"] = item.OverStandValue;
            }
          })
        })
      }
      // console.log("newRealTimeDataView=", newRealTimeDataView)
      return {
        ...state,
        realTimeDataView: [...newRealTimeDataView],
      }
    },
  },
});
