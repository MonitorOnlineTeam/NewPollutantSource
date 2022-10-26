/**
 * 功  能：排放标准
 * 创建人：贾安波
 * 创建时间：2020.10.10
 */

import Model from '@/utils/model';
import {
  GetDischargeStandValue,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportDischargeStandValue,
} from './service';
import moment from 'moment';                                                                                                                                                                                                                  
import { message } from 'antd';
export default Model.extend({
  namespace: 'standardData',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      PollutantCode:'',
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      PollutantType:'1',
      PageIndex:1,
      PageSize:20,
    },
    pointName:'',
    disTableDatas: [],
    disColumn:[],
    total: '',
    attentionList:[],
    priseList: [],
    chartExport:[],
    chartImport:[],
    chartTime:[]
  },
  subscriptions: {},
  effects: {
    *getDischargeStandValue({ payload }, { call, put, update, select }) {
      //列表  排放标准
      yield update({ loading: true });
      const response = yield call(GetDischargeStandValue, { ...payload });
      if (response.IsSuccess) {
        yield update({
          disTableDatas: response.Datas.data,
          disColumn:response.Datas.column,
          total: response.Total,
          loading: false
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
    *getEntByRegion({payload }, { call, put, update, select }) {
      const { queryPar }  = yield select(state => state.standardData);
      //获取所有企业列表
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
      }
    },
    *exportDischargeStandValue({callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出 标准
      const response = yield call(ExportDischargeStandValue, { ...payload });
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
