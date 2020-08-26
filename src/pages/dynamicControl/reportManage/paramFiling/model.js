/*
 * @desc: 质控核查设置
 * @Author: jab
 * @Date: 2020.08.18
 */
import Model from '@/utils/model';
import moment from 'moment';
import {  message } from 'antd';
import {getCycleQualityControlList,AddOrUpdCycleQualityControl,DeleteCycleQualityControlm,IssueMessage} from "./service"
export default Model.extend({
  namespace: 'qualitySet',
  state: {
    count:0,
    dgimn:"",
    pollType:"",
    isSaveFlag:false,
    cycleListParams:{
      PollutantCodeList: "",
      Cycle: 1,
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
    tableDatas:[],
    // defaultValue:1,
    cycleOptions:[{value:1,name:"1天"},{value:7,name:"7天"},{value:30,name:"30天"},{value:90,name:"季度"}]
  },
  effects: {
     // 质控核查 质控核查设置 列表
     *getCycleQualityControlList({callback, payload }, { call, update }) {
      yield update({ tableLoading:true  })
      const result = yield call(getCycleQualityControlList, payload);
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
   *deleteCycleQualityControlm({callback, payload }, { call, update }) {
        const result = yield call(DeleteCycleQualityControlm, payload);
        if (result.IsSuccess) {
          message.success(result.Message)
          callback(result.IsSuccess)
        } else {
          message.error(result.Message)
        }
      },
         // 质控核查 质控核查设置 下发
     *issueMessage({callback, payload }, { call, update }) {
          const result = yield call(IssueMessage, payload);
          if (result.IsSuccess) {
            message.success(result.Message)
            callback(result.IsSuccess)
          } else {
            message.error(result.Message)
          }
        },




  },
});
