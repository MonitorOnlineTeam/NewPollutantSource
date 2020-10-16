/**
 * 功  能：超标报警处置率
 * 创建人：侯晓枫
 * 创建时间：2020.10.16
 */

import Model from '@/utils/model';
import {
  GetDefectModel,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportGetAlarmDataList,
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'overAlarmDisposalRate',
  state: {
    exloading: false,
    loading: false,
    queryPar: {
      beginTime: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      Atmosphere: '',
      PollutantType: '',
      dataType: 'HourData',
    },
    tableDatas: [],
    total: '',
    attentionList: [],
    priseList: [],
  },
  subscriptions: {},
  effects: {
    *getDefectModel({ payload }, { call, put, update, select }) {
      //列表
      const response = yield call(GetDefectModel, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          total: response.Total,
        });
      }
    },
    *getAttentionDegreeList({ payload }, { call, put, update, select }) {
      console.log('关注列表 获取');
      //关注列表
      const response = yield call(GetAttentionDegreeList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          attentionList: response.Datas,
        });
      }
    },
    *getEntByRegion({ payload }, { call, put, update, select }) {
      //获取所有企业列表
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
      }
    },
    *exportGetAlarmDataList({ callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出
      const response = yield call(ExportGetAlarmDataList, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },
  },
});
