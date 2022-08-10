/*
 * @Author: Jiaqi
 * @Date: 2019-10-10 10:04:51
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-29 14:27:17
 * @desc: 主页model
 */
import moment from 'moment';
import * as services from '@/services/homeApi';
import * as commonApi from '@/services/commonApi'
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'home1',
  state: {
    allEntAndPointList: [],
    currentEntInfo: {},
    currentMarkersList: [],
    pollutantTypeList: [],
    AllMonthEmissionsByPollutant: {
      beginTime: moment().format('YYYY-01-01 00:00:00'),
      endTime: moment().add(1, 'years').format('YYYY-MM-01 HH:mm:ss'),
      // beginTime: moment().add(2, 'years').format('YYYY-MM-01 HH:mm:ss'),
      // endTime: moment().add(3, 'years').format('YYYY-MM-01 HH:mm:ss'),
      pollutantCode: ['01', '02', '03', '30'],
      ycdate: [],
      ycdata: [],
      ycAnalData: [],
      eyhldate: [],
      eyhldata: [],
      eyhlAnalData: [],
      dyhwdate: [],
      dyhwdata: [],
      dyhwAnalData: [],
      eyhtdate: [],
      eyhtdata: [],
      eyhtAnalData: [],
    },
    // 智能质控
    rateStatisticsByEnt: {
      beginTime: moment().format('YYYY-MM-01 HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      rateData: [],
    },
    // 智能监控点数据
    pointData: {},
    // 报警信息参数
    warningInfoParams: {
      beginTime: moment().format("YYYY-MM-DD 00:00:00"),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      entCode: null,
      pageIndex: 1,
      pageSize: 100,
      PollutantType: "2",
    },
    warningInfoList: [],
    // 运维 - 任务数量统计
    taskCountParams: {
      beginTime: moment().format('YYYY-MM-01 HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    taskCountData: {},
    // 运维 - 智能预警
    operationsWarningParams: {
      beginTime: moment().format('YYYY-MM-01 HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    operationsWarningData: {},
    // 运维 - 异常报警及响应情况
    alarmAnalysisParams: {
      beginTime: moment().format('YYYY-MM-01 HH:mm:ss'),
      endTime: moment().add(1, 'months').format('YYYY-MM-01 HH:mm:ss'),
      aaData: []
    },
    alarmAnalysis: {},
    // 超标汇总
    mounthOverDataParams: {
      beginTime: moment().format("YYYY-MM-01 00:00:00"),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      EntCode: null,
      DGIMN: null,
    },
    mounthOverData: [],
    // 排污税
    taxInfo: {},
    homePage: "1"
  },
  effects: {
    *getHomePage({ payload }, { call, update, take }) {
      const result = yield call(services.getHomePage, payload);
      if (result.IsSuccess) {
        yield update({ homePage: result.Datas });
      }
    },
    // 获取企业及排口信息
    *getAllEntAndPoint({ payload }, {
      call, update, take, select
    }) {
      let global = yield select(state => state.global);
      if (!global.configInfo) {
        yield take('global/getSystemConfigInfo/@@end');
        global = yield select(state => state.global);
        payload = {
          PollutantTypes: global.configInfo.SystemPollutantType,
        }
      } else {
        payload = {
          PollutantTypes: global.configInfo.SystemPollutantType,
        }
      }
      const result = yield call(services.getAllEntAndPoint, { Status: [0, 1, 2, 3], ...payload });
      if (result.IsSuccess) {
        yield update({
          allEntAndPointList: result.Datas,
          // currentEntInfo: result.Datas[0],
          // currentMarkersList: result.Datas[0].children,
          currentMarkersList: result.Datas,
        })
      }
    },
    // 获取污染物类型
    *getPollutantTypeList({ payload }, {
      update, call
    }) {
      const result = yield call(commonApi.getPollutantTypeList, payload);
      if (result.IsSuccess) {
        yield update({
          pollutantTypeList: result.Datas
        })
      }
    },

    // 获取智能质控数据 - 运行分析
    *getRateStatisticsByEnt({ payload }, { call, select, update }) {
      const rateStatisticsData = yield select(state => state.home.rateStatisticsByEnt);
      const postData = {
        ...rateStatisticsData,
        ...payload
      }
      const result = yield call(services.getRateStatisticsByEnt, postData);
      if (result.IsSuccess) {
        yield update({
          rateStatisticsByEnt: {
            ...rateStatisticsData,
            rateData: result.Datas && result.Datas[0]
          }
        })
      }
    },

    // 智能监控数据
    // TODO: 接口更换
    *getStatisticsPointStatus({ payload }, { call, update }) {
      const result = yield call(services.getStatisticsPointStatus, payload);
      if (result.requstresult) {
        yield update({
          pointData: result.data
        })
      }
    },

    // 获取报警信息
    *getWarningInfo({ payload }, { call, update, select }) {
      const warningInfoParams = yield select(state => state.home.warningInfoParams);
      const postData = {
        ...warningInfoParams,
        ...payload
      }
      const result = yield call(services.getWarningInfo, postData);
      if (result.IsSuccess) {
        let data = result.Datas ? result.Datas[0].map(item => {
          return { "desc": `${item.PointName}：<span style="color: #ffcb5b">${item.PollutantName}</span> 从 <span style="color: #3ccafc">${item.FirstTime}</span> 发生了 <span style="color: #f30201; font-size: 16px">${item.AlarmCount}</span> 次报警。`, url: "" }
        }) : [];
        yield update({
          warningInfoList: data
        })
      }
    },

    // 获取运维数据
    *getTaskCount({ payload }, { call, put, select, update }) {
      const taskCountParams = yield select(state => state.home.taskCountParams);
      const postData = {
        ...taskCountParams,
        ...payload
      }
      const result = yield call(services.getTaskCount, postData);
      if (result.IsSuccess) {
        yield update({
          taskCountData: result.Datas && result.Datas[0]
        })
      }
    },

    // 获取智能预警数据
    *getExceptionProcessing({ payload }, { call, put, update, select }) {
      const operationsWarningParams = yield select(state => state.home.operationsWarningParams);
      const postData = {
        ...operationsWarningParams,
        ...payload
      }
      const result = yield call(services.getExceptionProcessing, postData);
      if (result.IsSuccess) {
        yield update({
          operationsWarningData: result.Datas && result.Datas[0]
        })
      }
    },

    // 获取运维 - 异常报警及相应情况
    *getAlarmAnalysis({ payload }, { call, update, select }) {
      const alarmAnalysisParams = yield select(state => state.home.alarmAnalysisParams);
      const postData = {
        ...alarmAnalysisParams,
        ...payload
      }
      const result = yield call(services.getAlarmAnalysis, postData);
      if (result.IsSuccess) {
        yield update({
          alarmAnalysis: result.Datas && result.Datas[0]
        })
      }
    },

    // 获取排污许可情况数据
    * getAllMonthEmissionsByPollutant({ payload }, {
      call,
      put,
      update,
      select
    }) {
      const {
        AllMonthEmissionsByPollutant
      } = yield select(state => state.home);
      let body = {
        beginTime: AllMonthEmissionsByPollutant.beginTime,
        endTime: AllMonthEmissionsByPollutant.endTime,
        pollutantCode: AllMonthEmissionsByPollutant.pollutantCode,
        EntCode: payload.entCode,
        ...payload
      };
      const response = yield call(services.GetAllMonthEmissionsByPollutant, body);
      if (response.IsSuccess && response.Datas) {
        let ycdate = [];
        let ycdata = [];
        // 烟尘
        if (response.Datas['01']) {
          response.Datas['01'].monthList.map((ele) => {
            ycdate.push(`${ele.DataDate.split('-')[1]}月`);
            ycdata.push(ele.Emissions.toFixed(2));
          });
        }
        let eyhldate = [];
        let eyhldata = [];
        // 二氧化硫
        if (response.Datas['02']) {
          response.Datas['02'].monthList.map((ele) => {
            eyhldate.push(`${ele.DataDate.split('-')[1]}月`);
            eyhldata.push(ele.Emissions.toFixed(2));
          });
        }
        let dyhwdate = [];
        let dyhwdata = [];
        // 氮氧化物
        if (response.Datas['03']) {
          response.Datas['03'].monthList.map((ele) => {
            dyhwdate.push(`${ele.DataDate.split('-')[1]}月`);
            dyhwdata.push(ele.Emissions.toFixed(2));
          });
        }
        let eyhtdate = [];
        let eyhtdata = [];
        // 二氧化碳
        if (response.Datas['30']) {
          response.Datas['30'].monthList.map((ele) => {
            eyhtdate.push(`${ele.DataDate.split('-')[1]}月`);
            eyhtdata.push(ele.Emissions);
          });
        }
        yield update({
          AllMonthEmissionsByPollutant: {
            ...AllMonthEmissionsByPollutant,
            ycdate: ycdate,
            ycdata: ycdata,
            ycAnalData: response.Datas['01'] || {},
            eyhldate: eyhldate,
            eyhldata: eyhldata,
            eyhlAnalData: response.Datas['02'] || {},
            dyhwdate: dyhwdate,
            dyhwdata: dyhwdata,
            dyhwAnalData: response.Datas['03'] || {},
            eyhtdate: eyhtdate,
            eyhtdata: eyhtdata,
            eyhtAnalData: response.Datas['30'] || {},
          }
        });
      }
    },
    // 获取超标汇总
    *getMounthOverData({ payload }, { call, update, select }) {
      const mounthOverDataParams = yield select(state => state.home.mounthOverDataParams);
      const postData = {
        ...mounthOverDataParams,
        ...payload
      }
      const result = yield call(services.getMounthOverData, postData);
      if (result.IsSuccess) {
        const mounthOverData = [];
        result.Datas[0].rtnVal.map(item => {
          switch (item.PollutantCode) {
            case '01':
              mounthOverData.push({
                ...item,
                pollutantName: "烟尘"
              })
              break;
            case '02':
              mounthOverData.push({
                ...item,
                pollutantName: "二氧化硫"
              })
              break;
            case '03':
              mounthOverData.push({
                ...item,
                pollutantName: "氮氧化物"
              })
              break;
            default: break;
          }
        })
        console.log('mounthOverData=', mounthOverData)
        yield update({
          mounthOverData
        })
      }
    },

    // 排污税 - 所有企业
    *getAllTax({ payload }, { call, update, select }) {
      const result = yield call(services.getAllTax, payload);
      if (result.IsSuccess) {
        yield update({
          taxInfo: result.Datas || {}
        })
      }
    },
    // 排污税 - 单个企业
    *getEntTax({ payload }, { call, update, select }) {
      const result = yield call(services.getEntTax, payload);
      if (result.IsSuccess) {
        yield update({
          taxInfo: result.Datas || {}
        })
      }
    },
    // 排污税 - 单个排口
    *getPointTax({ payload }, { call, update, select }) {
      const result = yield call(services.getPointTax, payload);
      if (result.IsSuccess) {
        yield update({
          taxInfo: result.Datas || {}
        })
      }
    },
  }
})
