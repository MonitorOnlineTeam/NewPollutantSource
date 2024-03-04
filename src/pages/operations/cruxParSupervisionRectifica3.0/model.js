import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'cruxParSupervisionRectifica',
  state: {
    tableDatas: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
    detailList: [],
    queryPar: '',
  },
  effects: {

    //获取关键参数核查整改信息
    *getZGCheckList({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetZGCheckList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          tableDatas: result.Datas ? result.Datas : [],
          tableTotal: result.Total,
          queryPar: payload
        })
      } else {
        message.error(result.Message)
      }
    },
    //导出关键参数核查整改信息
    *exportZGCheckList({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.ExportZGCheckList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },

    //获取关键参数核查整改详情信息
    *getZGCheckInfoList({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetZGCheckInfoList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          detailList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    //数据一致性核查整改
    *updZGCouCheck({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.UpdZGCouCheck, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.IsSuccess)
      } else {
        message.error(result.Message)
      }
    },
    //量程一致性核查整改
    *updZGRangeCheck({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.UpdZGRangeCheck, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.IsSuccess)
      } else {
        message.error(result.Message)
      }
    },
    //参数一致性核查整改
    *updZGParamCheck({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.UpdZGParamCheck, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback && callback(result.IsSuccess)
      } else {
        message.error(result.Message)
      }
    },
    //数据量程一致性核查整改 单位
    *getKeyPollutantList({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetKeyPollutantList, { ...payload });
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },








  }
})