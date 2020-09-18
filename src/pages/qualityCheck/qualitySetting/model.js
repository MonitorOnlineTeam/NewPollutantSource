/*
 * @desc: 质控核查设置
 * @Author: jab
 * @Date: 2020.08.18
 */
import Model from '@/utils/model';
import moment from 'moment';
import {  message } from 'antd';
import {GetCycleQualityControlList,AddOrUpdCycleQualityControl,DeleteCycleQualityControl,IssueMessage} from "./service"
export default Model.extend({
  namespace: 'qualitySet',
  state: {
    count:0,
    approveState:"",
    dgimn:"",
    pollType:"",
    isSaveFlag:false,
    cycleListParams:{
      PollutantCodeList: "",
      Cycle: '',
      DGIMN: "",
      QCAType: "",
    },
    addParams:{
      ID: "",
      DGIMN: "",
      PollutantCode: "",
      QCAType: "",
      Time: "",
      Date: "",
      Space: 1,
      ApproveState: "",
      DeleteMark: "",
      Creator: "",
      CreatorID: "",
      CreatorDate: "",
      StandardValue: ""
    },
    tableLoading:true,
    issueFlag:false,
    issueLoading:true,
    tableDatas:[],
    // defaultValue:1,
    cycleOptions:[{value:1,name:"每天"},{value:7,name:"周"},{value:30,name:"月"},{value:90,name:"季度"}]
  },
  subscriptions: { //实时更新
    setup ({dispatch, history}) {
      }
    },
  effects: {
     // 质控核查 质控核查设置 列表
     *getCycleQualityControlList({callback, payload }, { call, update }) {
      yield update({ tableLoading:true  })
      const result = yield call(GetCycleQualityControlList, payload);
      if (result.IsSuccess) {
        yield update({ tableDatas: result.Datas,tableLoading:false,total:result.Datas.length,isSaveFlag:false  })
      } else {
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
     // 质控核查 质控核查设置 添加
     *addOrUpdCycleQualityControl({callback, payload }, { call, update }) {
      const result = yield call(AddOrUpdCycleQualityControl, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess)
      } else {
        message.error(result.Message)
      }
    },
       // 质控核查 质控核查设置 删除
   *deleteCycleQualityControl({callback, payload }, { call, update }) {
        yield update({ tableLoading:true })
        const result = yield call(DeleteCycleQualityControl, payload);
        if (result.IsSuccess) {
          // message.success(result.Message)
          yield update({ issueLoading:true })
          callback(result.IsSuccess)
        } else {
          message.error(result.Message)
        }
      },

         // 质控核查 质控核查设置 下发
         *issueMessage({callback, payload }, { call, update }) {
          yield update({ issueLoading:true })
          const result = yield call(IssueMessage, payload);      
          if (result.IsSuccess) {
            yield update({ issueLoading:false })
            // message.success(result.Message)
            callback(result.IsSuccess)
          } else {
            message.error(result.Message)
          }
        },



  },
  reducers: { // 以 key/value 格式定义reducer，用于处理同步操作，唯一可以修改 state 的地方，由 action 触发
         // 质控核查 质控核查设置 下发
         issueData(state, { payload }) {
            if(payload.ApproveState===2){           
                const issueFlag  = state.issueFlag;
                const approveState = state.approveState;
               !state.issueLoading? null:message.success("操作成功！")
              return { ...state,tableLoading:false,issueFlag:!issueFlag,approveState:payload.ApproveState}
            }
           
          
        },

  }
});
