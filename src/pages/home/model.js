import moment from 'moment';
import * as services from './service';
import * as commonApi from '@/services/commonApi'
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'home',
  state: {
    pollutantTypeList: [],
    AllMonthEmissionsByPollutant: {
      beginTime: moment().format('YYYY-01-01 HH:mm:ss'),
      endTime: moment().add(1, 'years').format('YYYY-MM-01 HH:mm:ss'),
      pollutantCode: ['01', '02', '03'],
      ycdate: [],
      ycdata: [],
      ycAnalData: [],
      eyhldate: [],
      eyhldata: [],
      eyhlAnalData: [],
      dyhwdate: [],
      dyhwdata: [],
      dyhwAnalData: [],
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
    alarmAnalysis: {}
  },
  effects: {
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

    // 获取智能质控数据
    *getRateStatisticsByEnt({ payload }, { call, select, update }) {
      const rateStatisticsData = yield select(state => state.home.rateStatisticsByEnt);
      const postData = {
        ...rateStatisticsData,
        ...payload
      }
      const result = yield call(services.getRateStatisticsByEnt, postData);
      if (result.requstresult) {
        yield update({
          rateStatisticsByEnt: {
            ...rateStatisticsData,
            rateData: result.data
          }
        })
      }
    },

    // 智能监控数据
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
      if (result.requstresult) {
        let data = result.data.map(item => {
          return { "desc": `${item.PointName}：${item.PollutantNames}从${item.FirstTime}发生了${item.AlarmCount}次报警。`, url: "" }
        })
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
      if (result.requstresult) {
        yield update({
          taskCountData: result.data
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
      if (result.requstresult) {
        yield update({
          operationsWarningData: result.data
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
      if (result.requstresult) {
        yield update({
          alarmAnalysis: result.data
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
        // entCode: payload.entCode
      };
      const response = yield call(services.GetAllMonthEmissionsByPollutant, body);
      let ycdate = [];
      let ycdata = [];
      response.data[0].monthList.map((ele) => {
        ycdate.push(`${ele.DataDate.split('-')[1]}月`);
        ycdata.push(ele.Emissions.toFixed(2));
      });
      let eyhldate = [];
      let eyhldata = [];
      response.data[1].monthList.map((ele) => {
        eyhldate.push(`${ele.DataDate.split('-')[1]}月`);
        eyhldata.push(ele.Emissions.toFixed(2));
      });
      let dyhwdate = [];
      let dyhwdata = [];
      response.data[2].monthList.map((ele) => {
        dyhwdate.push(`${ele.DataDate.split('-')[1]}月`);
        dyhwdata.push(ele.Emissions.toFixed(2));
      });
      yield update({
        AllMonthEmissionsByPollutant: {
          ...AllMonthEmissionsByPollutant,
          ...{
            ycdate: ycdate,
            ycdata: ycdata,
            ycAnalData: response.data[0],
            eyhldate: eyhldate,
            eyhldata: eyhldata,
            eyhlAnalData: response.data[1],
            dyhwdate: dyhwdate,
            dyhwdata: dyhwdata,
            dyhwAnalData: response.data[2],
          }
        }
      });
    },
  }
})