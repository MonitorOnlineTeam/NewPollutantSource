/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2020-10-15 16:19:00
 * @LastEditTime: 2020-10-22 15:15:06
 * @FilePath: /NewPollutantSource/src/pages/dataSearch/abnormalStandard/model.js
 */
/**
 * 功  能：排放标准
 * 创建人：jab
 * 创建时间：2020.10.10
 */

import Model from '@/utils/model';
import {
  GetExceptionStandValue,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportExceptionStandValue,
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'abnormalStandard',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      PollutantCode: '',
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      PollutantType: '1',
      PageIndex:1,
      PageSize: 20,
    },
    pointName: '',
    tableDatas: [],
    column: [],
    total: '',
    attentionList: [],
    priseList: [],
    chartExport: [],
    chartImport: [],
    chartTime: [],
  },
  subscriptions: {},
  effects: {
    *getExceptionStandValue({ payload }, { call, put, update, select }) {
      //列表  异常标准
      yield update({ loading: true });
      const response = yield call(GetExceptionStandValue, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas.data,
          column: response.Datas.column,
          total: response.Total,
          loading: false,
        });
      }
    },
    *getAttentionDegreeList({ payload }, { call, put, update, select }) {
      //关注列表
      const response = yield call(GetAttentionDegreeList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          attentionList: response.Datas,
        });
      }
    },
    *getEntByRegion({ payload }, { call, put, update, select }) {
      const { queryPar } = yield select(state => state.abnormalStandard);
      //获取所有企业列表
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
      }
    },
    *exportExceptionStandValue({ callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出 异常
      const response = yield call(ExportExceptionStandValue, { ...payload });
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
