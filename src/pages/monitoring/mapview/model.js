import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'mapView',
  state: {
    allEntAndPointList: [],
    defaultMapInfo: {},
    allEnterpriseList: [],
    ponitList: [],
    windowEntInfo: [],
    windowPointInfo: [],
    coordinateSet: [],
    position: [],
    waterList: [],
    gasList: [],
    tableList: [],
    curPointData: [],
    chartData: {
      seriesData: [],
      xAxisData: [],
      legend: []
    },
    monitorTime: null
  },
  effects: {
    *getAllEntAndPoint({ payload = {} }, {
      call, update, select, take
    }) {
      if (!payload.PollutantTypes) {
        let global = yield select(state => state.global);
        if (!global.configInfo) {
          yield take('global/getSystemConfigInfo/@@end');
          global = yield select(state => state.global);
          payload = {
            ...payload,
            PollutantTypes: global.configInfo.SystemPollutantType
          }
        } else {
          payload = {
            ...payload,
            PollutantTypes: global.configInfo.SystemPollutantType
          }
        }
      }
      const result = yield call(services.getAllEntAndPoint, { Status: [0, 1, 2, 3], ...payload });
      if (result.IsSuccess) {
        let monitorArr = result.Datas.filter(item => item.MonitorObjectType === "2");
        let allEntAndPointList = result.Datas.filter(item => item.MonitorObjectType !== "2");
        monitorArr.map(item => {
          if (item.children) {
            let childrenList = item.children.map(itm => {
              return { ...itm, MonitorObjectType: 2, children: [] }
            })
            allEntAndPointList = allEntAndPointList.concat(childrenList);
          }
        })
        yield update({
          // allEntAndPointList: result.Datas,
          allEntAndPointList: allEntAndPointList,
          defaultMapInfo: result.Datas[0],
          // allEnterpriseList: result.Datas.filter
        })
      }
    },
    // 获取污染物
    * getPollutantList({
      payload,
    }, { call, update, select, put }) {
      const pollutantType = "pollutantType" + payload.type;
      const result = yield call(services.getPollutantList, { pollutantTypes: payload.type });
      if (result.IsSuccess) {
        yield update({
          [pollutantType]: result.Datas
        })
        yield put({
          type: "getPointTableData",
          payload: payload
        })
      }
    },
    // 获取气污染物
    * getPollutantGasList({
      payload,
    }, { call, update, select }) {
      const result = yield call(services.getPollutantList, payload);
      if (result.IsSuccess) {
        yield update({
          gasList: result.Datas
        })
      }
    },
    // 获取点位气泡表格数据
    * getPointTableData({
      payload,
    }, { call, update, select, take, put }) {
      const pollutantType = yield select(state => state.mapView[`pollutantType${payload.type}`])
      const result = yield call(services.getPointTableData, payload);
      // console.log('aaa',result)
      if (result.IsSuccess) {
        const type = payload.type;
        // const pollutantType = type == 1 ? yield select(state => state.mapView.waterList) : yield select(state => state.mapView.gasList)
        const tableList = [];
        pollutantType.map(item => {
          result.Datas.map(itm => {
            if (itm[item.field]) {
              tableList.push({
                label: item.name,
                value: itm[item.field],
                key: item.field,
                title: item.title,
                status: itm[item.field + "_params"] ? itm[item.field + "_params"].split("§")[0] : null,
                level: itm[item.field + "_Level"],
                levelColor: itm[item.field + "_LevelColor"],
                levelValue: itm[item.field + "_LevelValue"],
                // ...itm,
              })
            }
          })
        })
        yield update({
          tableList,
          monitorTime: result.Datas[0] ? result.Datas[0].MonitorTime : null,
          curPointData: result.Datas[0] ? result.Datas[0] : []
        })
        // yield take('getPointTableData/@@end');
        if (payload.type == 5) {
          // if (false) {
          // 大气站
          yield put({
            type: 'getAirChartData',
            payload: {
              postData: {
                DGIMNs: payload.DGIMNs,
                endTime: moment(new Date()).format('YYYY-MM-DD HH:00:00'),
                beginTime: moment(new Date()).add('hour', -23).format('YYYY-MM-DD HH:00:00'),
                dataType: "hour",
                isAsc: true,
                IsSupplyData: true,
                // pollutantType: payload.pollutantType
              },
            }
          })
        } else {
          yield put({
            type: 'getPointChartData',
            payload: {
              postData: {
                DGIMNs: payload.DGIMNs,
                endTime: moment(new Date()).format('YYYY-MM-DD HH:00:00'),
                beginTime: moment(new Date()).add('hour', -23).format('YYYY-MM-DD HH:00:00'),
                dataType: "hour",
                isAsc: true,
                IsSupplyData: true,
                // pollutantType: payload.pollutantType
              },
              tableList: tableList,
              pollutantType: pollutantType,
              type: payload.type
            }
          })
        }
      }
    },
    // 获取大气站图表数据
    * getAirChartData({ payload }, { call, update, select }) {
      const result = yield call(services.getPointChartData, payload.postData);
      if (result.IsSuccess) {
        let seriesData = result.Datas.map(item => {
          if (item.AQI) {
            return {
              value: item.AQI,
              itemStyle: {
                color: item.Color || "#3398DB",
              }
            }
          }
          return "-"
        }
        );
        let xAxisData = result.Datas.map(item => moment(item.MonitorTime).hour());
        yield update({
          chartData: {
            seriesData: seriesData || [],
            xAxisData: xAxisData,
            allData: result.Datas,
            legend: "AQI"
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取点位气泡图表数据
    * getPointChartData({
      payload,
    }, { call, update, select }) {
      const result = yield call(services.getPointChartData, payload.postData);
      if (result.IsSuccess) {
        // const tableList = yield select(state => state.mapView.tableList);
        const tableList = payload.tableList;
        const pollutantType = payload.pollutantType;
        const first = tableList[0];
        const xAxisData = [];
        const legend = first && first.label;
        let flag = false;
        let seriesData = [];
        // 监测站
        // if (false) {
        seriesData = first && result.Datas.map(item => {
          xAxisData.push(moment(item.MonitorTime).hour())
          if (item[first.key]) {
            flag = true;
            if (payload.type == 5) {
              return {
                value: item[first.key + "_IAQI"],
                itemStyle: {
                  color: item[first.key + "_LevelColor"] || "#3398DB",
                }
              }
            } else {
              return item[first.key]
            }
          } else {
            return "-"
          }
        })

        seriesData = !flag ? [] : seriesData;

        console.log('seriesData=', seriesData)
        console.log('xAxisData=', xAxisData)
        yield update({
          chartData: {
            seriesData: seriesData || [],
            xAxisData: xAxisData,
            legend,
            allData: result.Datas
          }
        })
      }
    },
    // 更新图表数据
    * updateChartData({ payload }, { select, update, put }) {
      let key = payload.key
      const chartData = yield select(state => state.mapView.chartData);
      const xAxisData = [];
      const legend = payload.label;
      let flag = false;
      let seriesData = [];
      // if (key != "01" && key != "02" && key != "03" && key != "05" && key != "07" && key != "08") {
      //   key = payload.key;
      // }
      seriesData = chartData.allData.map((item, index) => {
        xAxisData.push(moment(item.MonitorTime).hour())
        if (item[key]) {
          flag = true;
          if (payload.type == 5) {
            return {
              value: item[key],
              itemStyle: {
                color: item[payload.itemKey + "_LevelColor"] || "#3398DB",
              }
            }
          } else {
            return item[key] || "-"
          }
        } else {
          return "-"
        }
      })
      seriesData = !flag ? [] : seriesData;
      yield update({
        chartData: {
          ...chartData,
          seriesData: seriesData || [], xAxisData, legend,
        }
      })
    },
    // 获取所有企业
    *getAllEnterprise({ payload }, {
      call, update
    }) {
      const result = yield call(services.getAllEnterprise, payload);
      if (result.IsSuccess) {
        yield update({
          allEnterpriseList: result.Datas
        })
      }
    },
    // 获取单个企业信息及排口
    *getEntAndPointList({ payload }, {
      call, update
    }) {
      console.log('getEntAndPointList=', payload)
      const result = yield call(services.getEntAndPointList, payload);
      if (result.IsSuccess) {
        let ponitList = [];
        if (payload.dataType == 0) {
          // 点击的排口
          ponitList = [result.Datas.PointInfo];
        } else {
          // 点击的企业
          ponitList = result.Datas.PointList
        }
        yield update({
          ponitList: ponitList,
          coordinateSet: result.Datas.CoordinateSet,
          position: [result.Datas.Longitude, result.Datas.Latitude]
        })
      }
    },
    // 获取企业气泡信息
    *getWindowEntInfo({ payload }, {
      call, update
    }) {
      const result = yield call(services.getWindowEntInfo, payload);
      if (result.IsSuccess) {
        yield update({
          windowEntInfo: result.Data
        })
      }
    },
    // 获取排口气泡信息
    *getWindowPointInfo({ payload }, {
      call, update
    }) {
      const result = yield call(services.getWindowPointInfo, payload);
      if (result.IsSuccess) {
        yield update({
          windowPointInfo: result.Data
        })
      }
    }
  }
})
