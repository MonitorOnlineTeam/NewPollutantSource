/*
 * @desc: 报警列表
 * @Author: jab
 * @Date: 2020.09.09
 */
import Model from '@/utils/model';
import { GetAlarmDataList  } from './service';
import moment from 'moment';
import {  message } from 'antd';

export default Model.extend({
  namespace: 'alarmInfoData',
  state: {
    pollutantlist :[],
    tableDatas: [],
    columns:[],
    total:"",
    tableLoading:true,
    queryParams: {
      alarmType: "",
      BeginTime: moment(new Date()).add(-1, 'month').format('YYYY-MM-DD HH:mm:ss'),
      EndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      mnList:""
    }
  },
  effects: {
     // 获取报警列表
        *getAlarmDataList({callback, payload }, { call, update }) {

          yield update({ tableLoading: true})
          const result = yield call(GetAlarmDataList, payload);  
          if (result.IsSuccess) {
            yield update({ tableDatas: result.Datas,tableLoading: false})
          } else {
            yield update({ tableLoading: false})
            message.error(result.Message)
          }
        },

    // },
    // 导出报表
        *exportHistoryReports({ payload }, { call, put, update, select }) {
          alert(111)
          // const { historyparams } = yield select(state => state.historyparData);
          // const postData = {  ...historyparams,DGIMNs: historyparams.DGIMN,...payload,
          // }
          // const result = yield call(exportHistoryReport, postData);
          // if (result.IsSuccess) {
          //   window.open(result.Datas)
          //   message.success('导出成功')
          // } else {
          //   message.error(result.Message)
          // }
        },
  }


});
