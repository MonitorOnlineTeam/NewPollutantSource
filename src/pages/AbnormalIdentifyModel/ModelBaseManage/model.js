import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'ModelBaseManage',
  state: {
    dataAccessDatas: [],
  },
  effects: {
    //模型训练
    // 数据接入
    // 数据接入信息
    *GetProjectMonitorDataList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetProjectMonitorDataList, payload);
      if (result.IsSuccess) {
        yield update({
          dataAccessDatas: result.Datas,
        });
        callback && callback(result);
      }
    },
    //接入信息 修改执行方式
    *UpdProjectMonitorData({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.UpdProjectMonitorData, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //接入企业数据执行
    *GetProjectMonitorDataList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetProjectMonitorDataList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //接入站点数据执行
    *AccessPointInfoList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.AccessPointInfoList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //接入备案参数执行
    *AccessParamInfoList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.AccessParamInfoList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //接入站点污染物排放信息执行
    *AccessEmissionStandardList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.AccessEmissionStandardList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //接入站点污染物关联信息执行
    *AccessMonitorPollutantList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.AccessMonitorPollutantList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //接入小时数据执行
    *AccessHourData({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.AccessHourData, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    // 数据清洗
    //企业信息、排放口信息、备案参数日志信息
    *GetProjectLogsList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetProjectLogsList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //企业信息、排放口信息、备案参数日志详情信息
    *GetProjectLogsInfoList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetProjectLogsInfoList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //污染物日志信息
    *GetMonitorPollutantLogsList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetMonitorPollutantLogsList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //污染物日志详情信息
    *GetMonitorPollutantLogsInfoList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetMonitorPollutantLogsInfoList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //排放口日志信息
    *GetMonitorAlarmLogsList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetMonitorAlarmLogsList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //排放口日志详情信息
    *GetMonitorAlarmLogsInfoList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetMonitorAlarmLogsInfoList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },
    //查看监测数据日志信息
    *GetHourDataLogsList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetHourDataLogsList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.Datas);
      }
    },












  },
});
