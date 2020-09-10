/*
 * @desc: 报警列表
 * @Author: jab
 * @Date: 2020.09.09
 */
import Model from '@/utils/model';
import { GetAlarmDataList,GetAlarmType } from './service';
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
    alarmTypeLoading:true,
    alarmTypeList:[],
    defaultAlarmType:[],
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
     // 报警类型
     *getAlarmType({callback, payload }, { call, update,select }) {

      yield update({ alarmTypeLoading: true})
      const result = yield call(GetAlarmType, payload);  
      const queryParams = yield select(_ => _.queryParams)
      if (result.IsSuccess) {
        yield update({ alarmTypeList: result.Datas})
        const defaultValue = result.Datas.map((item)=>{
          return item.code
       })
       yield update({ defaultAlarmType: defaultValue,alarmTypeLoading: false,queryParams:{...queryParams,alarmType:defaultValue}})
       callback(result.Datas)
      } else {
        yield update({ alarmTypeLoading: false})
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
