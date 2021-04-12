// 运维任务列表
import moment from 'moment';
import { message } from 'antd';
import * as services from './services';
import Model from '@/utils/model';

export default Model.extend({
  namespace: 'map',
  state: {
    allPoints: [],
    pollutantTypeCountList: [],
    tableList: [],
    curPointData: [],
    chartData: {
      seriesData: [],
      xAxisData: [],
      legend: []
    },
    monitorTime: null,
    infoWindowData: {},
    pointDetailsModalVisible: false,
    pointCountList: {},
    entEmissionsData: [],
    markersEntList: [],
  },

  effects: {
    *getAllPoint({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getAllPoint, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas.PointList);
        yield update({
          allPoints: result.Datas.PointList,
          pollutantTypeCountList: result.Datas.countList,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取监测点infoWindow数据
    *getInfoWindowData({ payload }, { call, update, select, put }) {
      const result = yield call(services.getInfoWindowData, payload);
      console.log('result=', result)
      if (result.IsSuccess) {
        let data = result.Datas[0] ? result.Datas[0] : {};
        console.log('data=', data)
        yield update({
          infoWindowData: data
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取污染物
    * getPollutantList({
      payload,
    }, { call, update, select, put }) {
      const pollutantType = "pollutantType" + payload.type;
      const result = yield call(services.getPollutantList, { pollutantTypes: payload.type });
      console.log("pollutantType=", pollutantType)
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
    // 获取点位气泡表格数据
    * getPointTableData({
      payload,
    }, { call, update, select, take, put }) {
      const pollutantType = yield select(state => state.map[`pollutantType${payload.type}`])
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
                unit: item.unit
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
        if (payload.isAirOrSite) {
          // if (false) {
          // 大气站或工地
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
    // 获取大气站或工地图表数据
    * getAirChartData({ payload }, { call, update, select }) {
      const result = yield call(services.getPointChartData, payload.postData);
      if (result.IsSuccess) {
        let seriesData = result.Datas.map(item => {
          if (item.AQI != undefined) {
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
      const chartData = yield select(state => state.map.chartData);
      const xAxisData = [];
      const legend = payload.label;
      let flag = false;
      let seriesData = [];
      seriesData = chartData.allData.map((item, index) => {
        xAxisData.push(moment(item.MonitorTime).hour())
        if (item[key]) {
          flag = true;
          if (payload.isAirOrSite) {
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
    // 获取企业排放量数据
    *getEntEmissionsData({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getEntEmissionsData, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
        let markersEntList = result.Datas.map(item => {
          return {
            position: {
              longitude: item.Longitude,
              latitude: item.Latitude
            },
            title: item.EntName,
            count: item.Discharge,
          }
        })
        console.log('markersEntList=', markersEntList)
        yield update({
          entEmissionsData: result.Datas,
          markersEntList
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取特征污染物数据
    *getFeaturesPolList({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getFeaturesPolList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
        
        yield update({
         
        })
      } else {
        message.error(result.Message)
      }
    },
  }
});
