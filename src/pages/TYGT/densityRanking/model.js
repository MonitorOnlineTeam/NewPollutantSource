/**
 * 功  能：区域浓度
 * 创建人：lzy
 * 创建时间：2023.05.22
 */

 import Model from '@/utils/model';
 import {
   GetAreaDensityRanking,
   ExportSewageHistoryList
 } from './service';
 import moment from 'moment';
 import { message } from 'antd';

 
 export default Model.extend({
   namespace: 'densityRankingModel',
   state: {
     exloading: false,
     loading: true,
     queryPar: {
        EntCode:"d7891158-f43e-43b5-805c-ad11db586f6f",//唐银企业code
        PollutantCode: "a34001",
        MonitorTime:moment().subtract(1, 'hour').format('YYYY-MM-DD HH:00:00')
     },
     tableDatas: [],
     total: '',
     column:[],
     timeList:[],
   },
   subscriptions: {},
   effects: {
     *getAreaDensityRanking({ payload }, { call, put, update, select }) {
       //列表
       console.log("查询");
       yield update({ loading:true }); 
       const response = yield call(GetAreaDensityRanking, { ...payload });
       if (response.IsSuccess) {
         yield update({
           tableDatas: response.Datas,
        //    column:response.Datas.chart,
        //    timeList:response.Datas.times,
           loading:false
         });
       }else{
         message.warning(response.Message);
         yield update({ loading:false }); 
       }
     },  
     *exportSewageHistoryList({callback, payload }, { call, put, update, select }) {
       yield update({ exloading: true });
       //导出
       const response = yield call(ExportSewageHistoryList, { ...payload });
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
 