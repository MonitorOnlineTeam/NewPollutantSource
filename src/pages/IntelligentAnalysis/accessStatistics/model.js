/**
 * 功  能：用户访问率统计
 * 创建人：jab
 * 创建时间：2021.06.17
 */

import Model from '@/utils/model';
import {
  GetDaQuUserActivity,
  GetFuWuQuUserActivity,
  GetUserActivity,
  ExportDaQuUserActivity,
  ExportFuWuQuUserActivity,
  ExportUserActivity,
  GetIndustryBusiness,
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'regionalAccountStatistics',
  state: {
    exloading: false,
    loading: false,
    tableDatas: [],
    tableDatil:[],
    userList:[],
    DaQuArr:[],
    DaviArr:[],
    DaNoVisitArr:[],
    DaRate:[],
    FuWuArr:[],
    FuviArr:[],
    FuNoVisitArr:[],
    FuRate:[],
    industryBusinessList:[],
    queryPar:{},
    days:7,
  },
  subscriptions: {},
  effects: {
    *getDaQuUserActivity({ payload }, { call, put, update, select }) {
      //大区 列表
      const response = yield call(GetDaQuUserActivity, { ...payload });
      if (response.IsSuccess) {
        let chartData = response.Datas.filter(item=>{
          return item.DaQuName !=='全部合计'
        })
        let dqArr = chartData.map(item=>{
          return item.DaQuName
        })
        let viArr = chartData.map(item=>{
          return item.Visited
        })
        let noViArr = chartData.map(item=>{
          return item.NoVisit
        })
        let daRate = chartData.map(item=>{
          return item.VisitRate.replace('%','')
        })
        yield update({
          tableDatas:response.Datas,
          DaQuArr:dqArr,
          DaviArr:viArr,
          DaNoVisitArr:noViArr,
          DaRate:daRate
        });
      } 
    },
    *getFuWuQuUserActivity({ payload }, { call, put, update, select }) {
      //服务区 列表
      const response = yield call(GetFuWuQuUserActivity, { ...payload });
      if (response.IsSuccess&&response.Datas.length>0) {
        let chartData = response.Datas.filter(item=>{
          return item.DaQuName !=='全部合计'
        })
        let fuArr = chartData.map(item=>{
          return item.FuWuQuName
        })
        let viArr = chartData.map(item=>{
          return item.Visited
        })
        let noViArr = chartData.map(item=>{
          return item.NoVisit
        })
        let daRate = chartData.map(item=>{
          return item.VisitRate.replace('%','')
        })
        yield update({
          tableDatil:response.Datas,
          FuWuArr:fuArr,
          FuviArr:viArr,
          FuNoVisitArr:noViArr,
          FuRate:daRate
        });
      }
    },
    *getUserActivity({ payload }, { call, put, update, select }) {
      //账户 列表
      const response = yield call(GetUserActivity, { ...payload });
      if (response.IsSuccess) {
        yield update({
        userList: response.Datas,
        });
      }
    },
    *getIndustryBusiness({ payload }, { call, put, update, select }) {
      //行业属性 和 业务属性
      const response = yield call(GetIndustryBusiness, { ...payload });
      if (response.IsSuccess) {
        yield update({ industryBusinessList: response.Datas,  });
      }else{
        message.error(response.Message)
      }
    },
    *exportDaQuUserActivity({callback, payload }, { call, put, update, select }) {
      //导出  大区
      const response = yield call(ExportDaQuUserActivity, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
      } else {
        message.warning(response.Message);
      }
    },
    *exportFuWuQuUserActivity({callback, payload }, { call, put, update, select }) {
      //导出 服务区
      const response = yield call(ExportFuWuQuUserActivity, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
      } else {
        message.warning(response.Message);
      }
    },
    *exportUserActivity({callback, payload }, { call, put, update, select }) {
      //导出 用户
      const response = yield call(ExportUserActivity, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
      } else {
        message.warning(response.Message);
      }
    },
    
  },
});
