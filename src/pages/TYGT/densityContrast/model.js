/**
 * 功  能：区域浓度
 * 创建人：lzy
 * 创建时间：2023.05.22
 */

 import Model from '@/utils/model';
 import {
   GetAreaDensityContrast,
   ExportSewageHistoryList
 } from './service';
 import moment from 'moment';
 import { message } from 'antd';

 
 export default Model.extend({
   namespace: 'densityContrastModel',
   state: {
     exloading: false,
     loading: true,
     queryPar: {
       //MonitorTime:moment().subtract(1, 'day') .format('YYYY-MM-DD 00:00:00'),
       DataType: "HourData",
       EntCode:"d7891158-f43e-43b5-805c-ad11db586f6f",//唐银企业code
       BeginTime: moment().subtract(0, 'day') .format('YYYY-MM-DD 00:00:00'),
       EndTime: moment().format('YYYY-MM-DD 23:59:59'),
     },
     tableDatas: [],
     total: '',
     column:[],
     timeList:[],
   },
   subscriptions: {},
   effects: {
     *getAreaDensityContrast({ payload }, { call, put, update, select }) {
       //列表
       yield update({ loading:true }); 
       const response = yield call(GetAreaDensityContrast, { ...payload });
       if (response.IsSuccess) {
         yield update({
           tableDatas: response.Datas.data,
           column:response.Datas.chart,
           timeList:response.Datas.times,
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
 