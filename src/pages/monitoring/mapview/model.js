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
    chartData: {
      seriesData: [],
      xAxisData: [],
      legend: []
    }
  },
  effects: {
    *getAllEntAndPoint({ payload }, {
      call, update
    }) {
      const result = yield call(services.getAllEntAndPoint, { Status: [0, 1, 2, 3] });
      if (result.IsSuccess) {
        yield update({
          allEntAndPointList: result.Datas,
          defaultMapInfo: result.Datas[3],
          // allEnterpriseList: result.Datas.filter
        })
      }
    },
    // 获取水污染物
    * getPollutantWaterList({
      payload,
    }, { call, update, select }) {
      const result = yield call(services.getPollutantList, payload);
      if (result.requstresult === "1") {
        yield update({
          waterList: result.data
        })
      }
    },
    // 获取气污染物
    * getPollutantGasList({
      payload,
    }, { call, update, select }) {
      const result = yield call(services.getPollutantList, payload);
      if (result.requstresult === "1") {
        yield update({
          gasList: result.data
        })
      }
    },
    // 获取点位气泡表格数据
    * getPointTableData({
      payload,
    }, { call, update, select, take, put }) {
      const result = yield call(services.getPointTableData, payload);
      // console.log('aaa',result)
      if (result.IsSuccess) {
        const type = payload.type;
        const pollutantType = type == 1 ? yield select(state => state.mapView.waterList) : yield select(state => state.mapView.gasList)
        // console.log('pollutantType=',pollutantType)
        const tableList = [];
        pollutantType.map(item => {
          result.Datas.map(itm => {
            if (itm[item.field]) {
              console.log('///=', itm[item.field])
              tableList.push({
                label: item.name,
                value: itm[item.field],
                key: item.field
              })
            }
          })
        })
        console.log('tableList=', tableList)
        yield update({
          tableList
        })
        // yield take('getPointTableData/@@end');
        yield put({
          type: 'getPointChartData',
          payload: {
            postData: {
              DGIMNs: payload.DGIMNs,
              endTime: moment(new Date()).format('YYYY-MM-DD HH:00:00'),
              beginTime: moment(new Date()).add('hour', -23).format('YYYY-MM-DD HH:00:00'),
              dataType: "hour",
              isAsc: true
            },
            tableList: tableList
          }
        })
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
        const first = tableList[0];
        console.log('first=', first)
        const xAxisData = [];
        const legend = first && first.label;
        const seriesData = first && result.Datas.map(item => {
          if (item[first.key]) {
            xAxisData.push(moment(item.MonitorTime).hour())
            return item[first.key]
          }
        })
        console.log('seriesData=', seriesData)
        console.log('xAxisData=', xAxisData)
        yield update({
          chartData: {
            seriesData: seriesData || [], xAxisData, legend,
            allData: result.Datas
          }
        })
      }
    },
    // 更新图表数据
    * updateChartData({ payload }, { select, update, put }) {
      const key = payload.key;
      const chartData = yield select(state => state.mapView.chartData);
      const xAxisData = [];
      const legend = payload.label;
      const seriesData = chartData.allData.map(item => {
        if (item[key]) {
          xAxisData.push(moment(item.MonitorTime).hour())
          return item[key]
        }
      })
      console.log('seriupdateesData=', seriesData)
      console.log('xAxisData=', xAxisData)
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