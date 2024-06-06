/**
 * 功  能：缺失数据
 * 创建人：jab
 * 创建时间：2020.09.27
 */

import Model from '@/utils/model';
import {
  GetDefectModel,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportDefectPointDetailRate,
  ExportDefectDataSummary,
  GetDefectPointDetailRate
} from '@/services/missingData';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'MissingRateDataModal',
  state: {
    exloading: false,
    loading: false,
    OperationPersonnel:'',
    queryPar: {
      beginTime: moment()
        .subtract(7, 'day')
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      // beginTime:'',
      // endTime:'',
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      // Atmosphere:'',
      PollutantType:'',
      EntType:'',
      Rate:"1"
      // dataType:'HourData'
    },
    tableDatas: [],
    total: '',
    attentionList:[],
    priseList: [],
    tableDatil:[]
  },
  subscriptions: {},
  effects: {
    *getDefectModel({ payload }, { call, put, update, select }) {
      //列表 响应数据
      const response = yield call(GetDefectModel, { ...payload });
      if (response.IsSuccess) {
        // let entCount = 0,pointCount=0,responseRate=0,exceptionCount=0,weixiangyingCount=0,xiangyingCount=0;
        // response.Datas.map(item=>{
        //   entCount += item.entCount;
        //   pointCount += item.pointCount;
        //   responseRate += item.responseRate;
        //   exceptionCount += item.exceptionCount;
        //   weixiangyingCount += item.weixiangyingCount;
        //   xiangyingCount += item.xiangyingCount;
        // })
        // const totalRow = {
        //   regionName:'全部合计',
        //   regionCode:'',
        //   entCount:entCount,
        //   pointCount:pointCount,
        //   responseRate:Number(xiangyingCount)/Number(exceptionCount)*100,
        //   exceptionCount:exceptionCount,
        //   weixiangyingCount:weixiangyingCount,
        //   xiangyingCount:xiangyingCount
        // }
        yield update({
          // tableDatas: response.Datas.length>0? [...response.Datas,totalRow] : response.Datas,
          tableDatas: response.Datas,
          total: response.Total,
        });
      }
    },
    *getDefectPointDetailRate({ payload }, { call, put, update, select }) {
      //列表 响应率数据详情
      const response = yield call(GetDefectPointDetailRate, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatil: response.Datas,
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
      //获取所有企业列表
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
      }
    },
    // 
    *exportDefectDataSummary({callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出   父页面
      const response = yield call(ExportDefectDataSummary, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },
    *exportDefectPointDetail({callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出 详情页面
      const response = yield call(ExportDefectPointDetailRate, { ...payload });
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
