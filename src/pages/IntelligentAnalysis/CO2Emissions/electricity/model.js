import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'CO2Material',
  state: {
    entList: [],
    GHGEchartsData: {
      profit: [],
      quota: [],
      use: [],
      buse: [],
    },
    GHGTableData: [],
    GHGChartData: [],
    monthDischargeData: {},
    CO2LinearAnalysisData: {
      coordMax: [],
      coordMin: [],
      linearData: [],
      formula: ""
    },
    CO2ReportList: [],
    Dictionaries: {},

  },
  effects: {
    // 获取关注列表
    *getAllEnterprise({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getAllEnterprise, { ...payload });
      if (response.IsSuccess) {
        yield update({
          entList: response.Datas,
        });
        callback && callback(response.Datas)
      } else {
        message.error(response.Message)
      }
    },
    // 获取关注列表
    *getGHGEchartsData({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getGHGEchartsData, { ...payload });
      if (response.IsSuccess) {
        callback && callback()
        yield update({
          GHGEchartsData: response.Datas,
        });
      } else {
        message.error(response.Message)
      }
    },
    // 获取柱状图详细数据 - 表格数据
    *getEchartsItemTableDataSource({ payload }, { call, put, update, select }) {
      const response = yield call(services.getEchartsItemTableDataSource, { ...payload });
      if (response.IsSuccess) {
        yield update({
          GHGTableData: response.Datas.TableData,
          GHGChartData: response.Datas.ChartData,
        });
      } else {
        message.error(response.Message)
      }
    },
    // 温室气体线性回归分析 - 图表数据
    *getCO2LinearAnalysis({ payload }, { call, put, update, select }) {
      const response = yield call(services.getCO2LinearAnalysis, { ...payload });
      if (response.IsSuccess) {
        yield update({
          // CO2LinearAnalysisData: response.Datas,
          CO2LinearAnalysisData: {
            ...response.Datas,
            // coordMax:[99594, 84525]
          },
        });
      } else {
        message.error(response.Message)
      }
    },
    // 月度排放量比较数据 - 图表数据
    *getCO2MonthDischarge({ payload }, { call, put, update, select }) {
      const response = yield call(services.getCO2MonthDischarge, { ...payload });
      if (response.IsSuccess) {
        yield update({
          monthDischargeData: response.Datas,
        });
      } else {
        message.error(response.Message)
      }
    },
    // 温室气体排放报告
    *getCO2ReportList({ payload }, { call, put, update, select }) {
      const response = yield call(services.getCO2ReportList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          CO2ReportList: response.Datas,
        });
      } else {
        message.error(response.Message)
      }
    },
    // 温室气体排放报告
    *createReportCO2({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.createReportCO2, { ...payload });
      if (response.IsSuccess) {
        yield put({
          type: 'getCO2ReportList'
        })
        callback && callback();
        message.success('生成报表成功！')
      } else {
        message.error(response.Message)
      }
    },
    // 获取缺省值码表
    *getCO2EnergyType({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getCO2EnergyType, payload);
      if (response.IsSuccess) {
        yield update({
          Dictionaries: response.Datas
        })
      } else {
        message.error(response.Message)
      }
    },
    // 判断是否重复 - 是否可添加
    *JudgeIsRepeat({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.JudgeIsRepeat, payload);
      if (response.IsSuccess) {
        callback && callback(response.Datas)
      } else {
        message.error(response.Message)
      }
    },
    // 获取模板下载地址
    *GetGHGUploadTempletUrl({ payload, callback }, { call }) {
      const result = yield call(services.GetGHGUploadTempletUrl, payload);
      if (result.IsSuccess) {
        window.open('/api/' + result.Datas)
      } else {
        message.error(response.Message)
      }
    },
  },
});
