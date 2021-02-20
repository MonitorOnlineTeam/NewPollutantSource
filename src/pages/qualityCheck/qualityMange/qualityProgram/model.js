/*
 * @desc: 质控方案管理
 * @Author: jab
 * @Date: 2020.08.13
 */
import Model from '@/utils/model';
import { GetQCAProgrammeList,AddOrUpdQCAProgramme,DelQCAProgramme,ApplicationProgramme,GetDetailsFile  } from './service';
import moment from 'moment';
import {  message } from 'antd';

export default Model.extend({
  namespace: 'qualityProData',
  state: {
    pollutantlist :[],
    tableDatas: [],
    columns:[],
    total:"",
    tableLoading:true,
    queryParams: {
      DGIMN: "",
      QCAProgrammeName:""
    },
    addOrupdatePar:{
      ID: "",
      QCAProgrammeName: "",
      Describe: "",
      DesignatedPerson: "",
      CreateTime: "",
      ProgrammeFile: "",
      DetailsFile: ""
    },
    applyPar:{
      MNList:[],
      ID:""
    },
    applyLoading:false,
    editLoading:false,
    editEchoData:"",
    applyEchoData:"",
    echoType:"",
    seeEchoData:"",
    getDetailsList:[],
    getDetailsLoading:true,
  },
  effects: {
     // 质控方案列表
        *getQCAProgrammeList({callback, payload }, { call, update }) {
          yield update({ tableLoading:true  })
          const result = yield call(GetQCAProgrammeList, payload);
          if (result.IsSuccess) {
            yield update({ tableDatas: result.Datas,tableLoading:false,total:result.Datas.length  })
          } else {
            yield update({ tableLoading:false})
            message.error(result.Message)
          }
        },
        //详情列表
        *getDetailsFile({callback, payload }, { call, update }) {
          yield update({ getDetailsLoading:true  })
          const result = yield call(GetDetailsFile, payload);
          if (result.IsSuccess) {
            yield update({ getDetailsList: result.Datas,getDetailsLoading:false  })
            callback(result.Datas)
          } else {
            yield update({ getDetailsLoading:false})
            message.error(result.Message)
          }
        },
    //  添加 or 更新
        *addOrUpdQCAProgramme({callback, payload }, { call, put, update, select }) {
          const result = yield call(AddOrUpdQCAProgramme, payload);
          if (result.IsSuccess) {
            message.success(result.Message)
            callback()
          } else {
            message.error(result.Message)
          }
        },
        
    // 应用
    *applicationProgramme({callback, payload }, { call, put, update, select }) {
      yield update({ applyLoading: true  })
      const result = yield call(ApplicationProgramme, payload);
      
      if (result.IsSuccess) {
        message.success(result.Message)
        yield update({ applyLoading: false  })
        callback()
      } else {
        yield update({ applyLoading: false  })
        message.error(result.Message)
      }
    },
        
       //  删除
       *delQCAProgramme({callback, payload }, { call, put, update, select }) {
              const result = yield call(DelQCAProgramme, payload);
              if (result.IsSuccess) {
                message.success(result.Message)
                callback()
              } else {
                message.error(result.Message)
              }
            },
        
  }


});
