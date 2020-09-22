/*
 * @desc: 标气管理
 * @Author: jab
 * @Date: 2020.08.13
 */
import Model from '@/utils/model';
import { GetProcessFlowTableHistoryDataList,GetHistoryParaCodeList  } from './service';
import moment from 'moment';
import {  message } from 'antd';

export default Model.extend({
  namespace: 'historyparData',
  state: {
    pollutantlist :[],
    tableDatas: [],
    columns:[],
    total:"",
    tableLoading:true,
    paraCodeList:[],
    parLoading:true,
    queryParams: {
      DGIMN: "",
      BeginTime: moment(new Date()).add(-1, 'month').format('YYYY-MM-DD HH:mm:ss'),
      EndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      ParaCodeList:[]
    },
    location:''
  },
  effects: {
     // 获取 仪器列表
        *getHistoryParaCodeList({callback, payload }, { call, update }) {
          const result = yield call(GetHistoryParaCodeList, payload);  
          if (result.IsSuccess) {
            yield update({ })
            yield update({ paraCodeList: result.Datas,parLoading: false})
            callback(result.Datas)
          } else {
            yield update({ parLoading: false})
            message.error(result.Message)
          }
        },

        *getProcessFlowTableHistory({ payload, }, { call, update, put, take, select }) {
          yield update({ tableLoading:true })
          const result = yield call(GetProcessFlowTableHistoryDataList, payload);
        
          if (result.IsSuccess) {     
            yield update({ tableDatas: result.Datas, tableLoading:false})
          } else {
            yield update({ tableLoading:false })
            message.error(result.Message)
          }
        },

    // },
    // 导出报表
        *exportHistoryReports({ payload }, { call, put, update, select }) {
          message.warning('暂未开放')
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

  },
  subscriptions: {

    setup ({ dispatch, history }) {
      // let { queryParams, dispatch } = this.props;
      // queryParams = {
      //   ...queryParams,
      //   ParaCodeList:value
      // }
      // dispatch({
      //   type: 'historyparData/updateState',
      //   payload: { queryParams},
      // })
    history.listen((location) => {

     })
    }
  }



});
