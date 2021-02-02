/*
 * @desc: 历史管控参数
 * @Author: jab
 * @Date: 2020.08.13
 */
import Model from '@/utils/model';
import { GetProcessFlowTableHistoryDataList,GetHistoryParaCodeList,exportDatas  } from './service';
import moment from 'moment';
import {  message } from 'antd';
import { downloadFile} from '@/utils/utils';
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
    // 导出数据
        *exportDatas({ payload }, { call, put, update, select }) {
          
          const result = yield call(exportDatas, payload); 
          if (result.IsSuccess) {
            downloadFile(`/upload${result.Datas}`)
          } else {
            message.error(result.Message)
          }
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
