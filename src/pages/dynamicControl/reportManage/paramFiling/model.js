/*
 * @desc: 质控核查设置
 * @Author: jab
 * @Date: 2020.08.18
 */
import Model from '@/utils/model';
import moment from 'moment';
import {  message } from 'antd';
import {GetParameterFilingList,AddOrUpdCycleQualityControl,DeleteParameterFiling,GetParaCodeList,IssueMessage} from "./service"
export default Model.extend({
  namespace: 'paramsfil',
  state: {
    count:0,
    dgimn:"",
    pollType:"",
    isSaveFlag:false,
    pollutantlist:[
      {name:"颗粒物分析仪",value:"a34013"},
       {name:"气态分析仪(SO2)",value:"a21026"},
       {name:"气态分析仪(NOx)",value:"a21002"},
       {name:"气态分析仪(NO)",value:"a21003"},
       {name:"气态分析仪(NO2)",value:"a21004"},
       {name:"气态分析仪(O2)",value:"a19001"},
      ],
    defaultValue:["a34013","a21026","a21002","a21003","a21004","a19001"],
    getParaCodeList:[],
    instruListParams:{
      PollutantCodeList: ["a34013","a21026","a21002","a21003","a21004","a19001"],
      DGIMN: ""
    },
    addParams:{
      ID: "",
      DGIMN: "",
      InstrumentID: "",
      PollutantCode: "a21026",
      ParaCode: "",
      Type: "",
      LowerLimit: "",
      TopLimit: "",
      DeleteMark: "",
      Recordor: "",
      RecordorID: "",
      RecordTime: "",
      ApproveState: ""
    },
    tableLoading:true,
    tableDatas:[]
  },
  effects: {
     // 动态管控 参数备案 列表
     *getParameterFilingList({callback, payload }, { call, update }) {
      yield update({ tableLoading:true  })
      const result = yield call(GetParameterFilingList, payload);
      if (result.IsSuccess) {
        yield update({ tableDatas: result.Datas,tableLoading:false,total:result.Datas.length,isSaveFlag:false  })
      } else {
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
     //添加
     *addOrUpdParameterFiling({callback, payload }, { call, update }) {
      const result = yield call(AddOrUpdParameterFiling, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess)
      } else {
        message.error(result.Message)
      }
    },
       //  删除
   *deleteParameterFiling({callback, payload }, { call, update }) {
        const result = yield call(DeleteParameterFiling, payload);
        if (result.IsSuccess) {
          message.success(result.Message)
          callback(result.IsSuccess)
        } else {
          message.error(result.Message)
        }
      },
    //  参数列表
   *getParaCodeList({callback, payload }, { call, update }) {
    const result = yield call(GetParaCodeList, payload);
    if (result.IsSuccess) {
      yield update({ getParaCodeList: result.Datas })
      // callback(result.IsSuccess)
    } else {
      message.error(result.Message)
    }
  },
         // 备案
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
