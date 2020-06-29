import moment from 'moment';
import * as services from './service';
import * as commonApi from '@/services/commonApi'
import Model from '@/utils/model';
import { message } from 'antd';

function getDrillDownParams(state) {
  let postData = {
    beginTime: state.startTime,
    endTime: state.endTime,
    entName: state.entName,
  }
  switch (state.level) {
    case 1:
      postData.regionList = state.regionList;
      postData.regionCode = undefined;
      postData.entCode = undefined;
      postData.entName = undefined;
      break;
    case 2:
      postData.regionList = undefined;
      // postData.regionCode = payload.param || state.regionList.toString();
      postData.regionCode = state.regionCode;
      postData.entCode = undefined;
      break;
    case 3:
      postData.regionList = undefined;
      postData.regionCode = undefined;
      postData.entCode = state.entCode;
      break;
  }
  return postData;
}


export default Model.extend({
  namespace: 'newHome',
  state: {
    startTime: moment().format("YYYY-MM-01 00:00:00"),
    START_TIME: moment().format("YYYY-MM-01 00:00:00"),
    endTime: moment().format("YYYY-MM-DD 23:59:59"),
    END_TIME: moment().format("YYYY-MM-DD 23:59:59"),
    entName: "",
    regionCode: "660000000",
    monitoringData: [],
    runAndAnalysisData: {
      transmissionEfficiencyRate: 0,
      overDataRate: 0,
      operationRate: 0,
      exceptionRate: 0,
      AccuracyRate: 0
    },
    alarmResponseData: {
      taskCount: 0, taskYearCount: 0, taskYearRate: 0, execptionCount: 0, execptionYearCount: 0, execptionYearRate: 0
    },
    taskStatisticsData: [],
    operationAnalysis: [],
    diffHorizontalData: [],
    allEntAndPointList: [],
    constructionCorpsList: [], // 师集合
    officeList: [], // 服务站集合
    infoWindowData: { // infoWindow数据
      list: [],
      time: undefined
    },
    officeUserList: [], // 办事处人员列表
    officeStockList: [], // 办事处备品备件
    officeVisible: false,
    siteDetailsVisible: false,
    monitorRegionDivision: [],
    currentDivisionPosition: [],
    // 下钻state
    level: 1,
    regionList: [],
    drillDownRunVisible: false,
    seriesData: [],
    xData: [],
    paramsList: [],
    // 任务统计下钻
    taskCountModalData: {
      x: [], insidePlan: [], unInsidePlan: [], completeTaskCount: []
    },
    codeList: [],
    // 报警响应下钻
    alarmResponseModalData: {
      taskCount: [], taskYearCount: [], execptionCount: [], execptionYearCount: [], x: []
    },
    taskClassifyModalData: {
      ywc: [], wwc: [], x: [], name: ""
    }
  },
  effects: {
    // 获取显示级别
    *getLevel({ payload }, { call, update }) {
      const result = yield call(services.getLevel);
      if (result.IsSuccess) {
        // yield update({ level: result.Datas, LEVEL: result.Datas, INIT_LEVEL: result.Datas });
      } else {
        // message.error(result.Message)
      }
    },
    // 获取企业和监测点信息
    *getAllEntAndPoint({ payload }, {
      call, update, select, take, put
    }) {
      console.log("payload=", payload)
      const result = yield call(services.getAllEntAndPoint, { Status: [0, 1, 2, 3], ...payload });
      if (result.IsSuccess) {
        let filterList = result.Datas.filter(item => item.MonitorObjectType === "2" || item.MonitorObjectType === "4");
        let allEntAndPointList = result.Datas.filter(item => {
          if (item.MonitorObjectType !== "2" && item.MonitorObjectType !== "4") {
            return {
              ...item,
              EntName: item.EntName || item.title
            }
          }
        });
        filterList.map(item => {
          if (item.children) {
            let childrenList = item.children.map(itm => {
              return { ...itm, MonitorObjectType: item.MonitorObjectType, children: [] }
            })
            allEntAndPointList = allEntAndPointList.concat(childrenList);
          }
        })
        yield update({
          allEntAndPointList: [
            ...allEntAndPointList,
          ],
        })
        // 获取师集合
        yield put({
          type: 'getConstructionCorpsList',
        })
        // 获取服务站集合
        yield put({
          type: "getOfficeList"
        })
        // yield take('getConstructionCorpsList/@@end');
        // yield take('getOfficeList/@@end');
        // const state = yield select(state => state.newHome)

      }
    },
    // 获取监控现状数据
    *getMonitoringData({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const postData = {
        beginTime: state.startTime,
        endTime: state.endTime,
        regionCode: state.regionCode,
        ...payload
      }
      const result = yield call(services.getMonitoringData, postData);
      if (result.IsSuccess) {
        yield update({ monitoringData: result.Datas });
      } else {
        message.error(result.Message)
      }
    },
    // 获取运行分析
    *getRunAndAnalysisData({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const postData = {
        beginTime: state.startTime,
        endTime: state.endTime,
        regionCode: state.regionCode,
        ...payload
      }
      const result = yield call(services.getRunAndAnalysisData, postData);
      if (result.IsSuccess) {
        yield update({ runAndAnalysisData: result.Datas });
      } else {
        message.error(result.Message)
      }
    },
    // 获取报警响应情况
    *getAlarmResponseData({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const postData = {
        beginTime: state.startTime,
        endTime: state.endTime,
        regionCode: state.regionCode,
        ...payload
      }
      const result = yield call(services.getAlarmResponseData, postData);
      if (result.IsSuccess) {
        yield update({ alarmResponseData: result.Datas });
      } else {
        message.error(result.Message)
      }
    },
    // 运维分析 - 任务统计数据
    *getTaskStatisticsData({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const postData = {
        beginTime: state.startTime,
        endTime: state.endTime,
        regionCode: state.regionCode,
        ...payload
      }
      const result = yield call(services.getTaskStatisticsData, postData);
      if (result.IsSuccess) {
        yield update({ taskStatisticsData: result.Datas });
      } else {
        message.error(result.Message)
      }
    },
    // 运维分析 - 任务分类统计
    *getOperationAnalysis({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const postData = {
        beginTime: state.startTime,
        endTime: state.endTime,
        regionCode: state.regionCode,
        ...payload
      }
      const result = yield call(services.getOperationAnalysis, postData);
      if (result.IsSuccess) {
        yield update({ operationAnalysis: result.Datas });
      } else {
        message.error(result.Message)
      }
    },
    // 水平衡差数据
    *getDiffHorizontalData({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const postData = {
        beginTime: state.startTime,
        endTime: state.endTime,
        regionCode: state.regionCode,
        ...payload
      }
      const result = yield call(services.getDiffHorizontalData, postData);
      if (result.IsSuccess) {
        yield update({ diffHorizontalData: result.Datas });
      } else {
        message.error(result.Message)
      }
    },

    // 获取师坐标点
    *getConstructionCorpsList({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const postData = {
        beginTime: state.startTime,
        endTime: state.endTime,
        ...payload
      }
      const result = yield call(services.getConstructionCorpsList, postData);
      if (result.IsSuccess) {
        const regionList = result.Datas.map(item => item.RegionCode);
        const constructionCorpsList = result.Datas.map(item => ({
          key: item.ID,
          title: item.Name,
          MonitorObjectType: "师",
          ...item,
        }))
        const state = yield select(state => state.newHome);
        // 获取级别, 更新regionCode
        let level = 1;
        let regionCode = state.regionCode;
        if (result.Datas.length === 1) {
          regionCode = result.Datas[0].RegionCode
          level = 2;
        }
        yield update({
          level: level, LEVEL: level, INIT_LEVEL: level,
          regionCode,
          regionList,
          // LEVEL: regionList.length > 1 ? 1 : 2,
          // level: regionList.length > 1 ? 1 : 2,
          constructionCorpsList,
          allEntAndPointList: [
            ...state.allEntAndPointList,
            ...constructionCorpsList,
          ],
        })
      } else {
        message.error(result.Message)
      }
    },

    // 获取服务站集合
    *getOfficeList({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const result = yield call(services.getOfficeList, payload);
      if (result.IsSuccess) {
        const officeList = result.Datas.map(item => ({
          key: item.SparePartsStationCode,
          title: item.Name,
          MonitorObjectType: "服务站",
          ...item,
        }))
        const state = yield select(state => state.newHome);
        yield update({
          officeList,
          allEntAndPointList: [
            ...state.allEntAndPointList,
            ...state.constructionCorpsList,
            ...officeList,
          ],
        })
        // yield update({ officeList });
      } else {
        message.error(result.Message)
      }
    },
    // 点击师 - 改变RegionCode - 左右联动
    *changeRegionCode({ payload }, { put, update, select }) {
      const regionCode = payload.regionCode;
      yield update({ regionCode, level: 2, LEVEL: 2 })
      yield put({ type: "getMonitoringData" })
      yield put({
        type: "getRunAndAnalysisData",
        // payload: { regionCode }
      })
      yield put({ type: "getAlarmResponseData" })
      yield put({ type: "getTaskStatisticsData" })
      yield put({ type: "getOperationAnalysis" })
      yield put({ type: "getDiffHorizontalData" })
    },
    // 改变时间 - 左右联动
    *changeDateTime({ payload }, { put, update, select }) {
      const startTime = payload.startTime;
      const endTime = payload.endTime;
      yield update({ startTime, endTime, START_TIME: startTime, END_TIME: endTime })
      yield put({ type: "getMonitoringData" })
      yield put({ type: "getRunAndAnalysisData" })
      yield put({ type: "getAlarmResponseData" })
      yield put({ type: "getTaskStatisticsData" })
      yield put({ type: "getOperationAnalysis" })
      yield put({ type: "getDiffHorizontalData" })
    },
    // 办事处人员信息
    *getOfficeUserList({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const result = yield call(services.getOfficeUserList, payload);
      if (result.IsSuccess) {
        yield update({
          officeUserList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取办事处备品备件信息
    *getOfficeStockList({ payload }, { call, update, select }) {
      const state = yield select(state => state.newHome)
      const result = yield call(services.getOfficeStockList, payload);
      if (result.IsSuccess) {
        yield update({
          officeStockList: result.Datas,
          officeVisible: true
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取监测点infoWindow数据
    *getInfoWindowData({
      payload,
    }, { call, update, select, put }) {
      const result = yield call(services.getPollutantList, { pollutantTypes: payload.pollutantTypes });
      if (result.IsSuccess) {
        yield put({ type: "getInfoWindowPollutantList", payload: payload, pollutantList: result.Datas });
      } else {
        message.error(result.Message)
      }
    },
    // 获取监测点infoWindow数据
    *getInfoWindowPollutantList({ payload, pollutantList }, { call, update, select, put }) {
      const result = yield call(services.getInfoWindowData, payload);
      console.log("pollutantList=", pollutantList)
      if (result.IsSuccess) {
        let list = [];
        pollutantList.map(item => {
          result.Datas.map(itm => {
            if (itm[item.field]) {
              list.push({
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
        console.log("list=", list)
        let data = result.Datas[0] ? result.Datas[0] : [];
        yield update({
          infoWindowData: {
            list: list,
            ...data
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 超标率下钻
    *getTrippingOverDataList({ payload }, { call, update, select, put }) {
      yield update({ drillDownLoading: true })
      const state = yield select(state => state.newHome)
      let postData = getDrillDownParams(state)
      const result = yield call(services.getTrippingOverDataList, postData);
      let seriesData = [], xData = [], paramsList = [];
      if (result.IsSuccess) {
        result.Datas.map(item => {
          seriesData.push(item.rate)
          xData.push(item.name)
          paramsList.push(item.code)
        })
        yield update({
          drillDownRunVisible: true,
          drillDownLoading: false,
          seriesData,
          xData,
          paramsList,
        })
      } else {
        yield update({ drillDownLoading: false })
        message.error(result.Message)
      }
    },
    // 传输有效率下钻
    *getEChartsDrillDown({ payload }, { call, update, select, put }) {
      yield update({ drillDownLoading: true })
      const state = yield select(state => state.newHome)
      let postData = getDrillDownParams(state)
      const result = yield call(services[payload.servicesName], postData);
      let seriesData = [], xData = [], paramsList = [];
      if (result.IsSuccess) {
        result.Datas.map(item => {
          seriesData.push(item.rate)
          xData.push(item.name)
          paramsList.push(item.code)
        })
        yield update({
          // drillDownRunVisible: true,
          seriesData,
          xData,
          paramsList,
          drillDownLoading: false,
        })
      } else {
        yield update({
          drillDownLoading: false,
        })
        message.error(result.Message)
      }
    },
    //获取任务分类统计下钻
    *getTrippingOperationAnalysis({ payload }, { call, update, select, put }) {
      yield update({ drillDownLoading: true })
      const state = yield select(state => state.newHome)
      let postData = getDrillDownParams(state)
      const result = yield call(services.getTrippingOperationAnalysis, postData);
      console.log('payload=', payload)
      const ywcKey = payload.taskType.split(",")[0];
      const wwcKey = payload.taskType.split(",")[1];
      const name = payload.taskType.split(",")[2];
      if (result.IsSuccess) {
        let ywc = [], wwc = [], x = [], codeList = [];
        result.Datas.map(item => {
          ywc.push(item[ywcKey])
          wwc.push(item[wwcKey])
          x.push(item.name)
          codeList.push(item.code)
        })
        yield update({
          drillDownLoading: false,
          drillDownTaskClassifyVisible: true,
          codeList,
          taskClassifyModalData: {
            ywc, wwc, x, name
          }
        })
      } else {
        yield update({ drillDownLoading: false })
        message.error(result.Message)
      }
    },
    // 获取任务统计下钻
    *getTrippingTaskStatistics({ payload }, { call, update, select, put }) {
      yield update({ drillDownLoading: true })
      const state = yield select(state => state.newHome)
      let postData = getDrillDownParams(state)
      const result = yield call(services.getTrippingTaskStatistics, postData);
      if (result.IsSuccess) {
        let insidePlan = [], unInsidePlan = [], x = [], codeList = [], completeTaskCount = [];
        result.Datas.map(item => {
          insidePlan.push(item.insidePlan);
          unInsidePlan.push(item.unInsidePlan);
          completeTaskCount.push(item.completeTaskCount);
          x.push(item.name);
          codeList.push(item.code);
        })

        yield update({
          drillDownLoading: false,
          codeList,
          taskCountModalData: {
            insidePlan, unInsidePlan, x, completeTaskCount
          }
        })
      } else {
        yield update({ drillDownLoading: false })
        message.error(result.Message)
      }
    },
    // 获取报警响应下钻
    *getTrippingAlarmResponse({ payload }, { call, update, select, put }) {
      yield update({ drillDownLoading: true })
      const state = yield select(state => state.newHome)
      let postData = getDrillDownParams(state)
      const result = yield call(services.getTrippingAlarmResponse, postData);
      if (result.IsSuccess) {
        let taskCount = [], taskYearCount = [], execptionCount = [], execptionYearCount = [], x = [], codeList = [];
        result.Datas.map(item => {
          taskCount.push(item.taskCount);
          taskYearCount.push(item.taskYearCount);
          execptionCount.push(item.execptionCount);
          execptionYearCount.push(item.execptionYearCount);
          x.push(item.name);
          codeList.push(item.code);
        })
        yield update({
          drillDownLoading: false,
          drillDownAlarmResponseVisible: true,
          codeList,
          alarmResponseModalData: {
            taskCount, taskYearCount, execptionCount, execptionYearCount, x,
          }
        })
      } else {
        yield update({ drillDownLoading: false })
        message.error(result.Message)
      }
    },
    // 获取行政区与师的关系
    *getMonitorRegionDivision({ payload }, { call, update, select, put }) {
      const result = yield call(services.getMonitorRegionDivision);
      if (result.IsSuccess) {
        yield update({ monitorRegionDivision: result.Datas })
      } else {
        message.error(result.Message)
      }
    },
    //
    *updateDivisionShowCoordinate({ payload }, { call, update, select, put }) {
      const monitorRegionDivision = yield select(state => state.newHome.monitorRegionDivision)
      let currentDivision = monitorRegionDivision.find(item => item.regionCode === payload.adcode + "000");
      let currentDivisionPosition = (currentDivision && currentDivision.divisionList) ? currentDivision.divisionList.map(item => {
        return `${item.longitude},${item.latitude}`
      }) : [];
      yield update({
        currentDivision,
        currentDivisionPosition
      })
    }
  },
  reducers: {
    update(state, { payload }) {
      console.log('payload=', payload)
      const monitorRegionDivision = state.monitorRegionDivision;
      let currentDivision = monitorRegionDivision.find(item => item.regionCode === payload.adcode + "000");
      return { ...state, currentDivision };
    },
  },
})
