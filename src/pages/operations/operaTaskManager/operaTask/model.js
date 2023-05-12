import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operaTask',
  state: {
    tableDatas: [],
    tableLoading: false,
    tableDatas2: [],
    tableLoading2: false,
    taskDetailData: [],
    taskDetailLoading: false,
    contractTableLoading: false,
    contractTableData: [],
    contractTableAllData:[],
    taskTypeListLoading:false,
    taskTypeList:[],
    cityInfoListLoading:false,
    cityInfoList:[],
    pointList: [],
    pointListLoading: false,
    operaUserList:[],
    operaUserListLoading:false,
    operaDeviceList:[],
    operaDeviceListLoading:false,
    operaContantListLoading:false,
    operaContantList:[],
    basicInfoTaskLoading:false,
    taskId:'',
    addPointLoading:false,
    addOperaUserLoading:false,
    addOperaDeviceLoading:false,
    operationTaskPlanLoading:false,
    taskSubmitLoading:false,
  },
  effects: {
    *bWWebService({ payload, callback }, { call, put, update }) {
      switch (payload.functionName) {
        case 'M_GetALLOperationTask': yield update({ tableLoading: true }); break;
        case 'M_GetOperationTaskDone': yield update({ tableLoading2: true }); break;
        case 'M_GetOperationTaskByID': yield update({ taskDetailLoading: true }); break;
        case 'C_GetALLContractList': yield update({ contractTableLoading: true }); break;
        case 'M_OpenationTaskType': yield update({ taskTypeListLoading: true }); break;
        case 'Z_CityInfo': yield update({ cityInfoListLoading: true }); break;
        case 'M_GetOperationSchemeList': yield update({ pointListLoading: true }); break;
        case 'B_GetALLWorkersList': yield update({ operaUserListLoading: true }); break;
        case 'B_GetALLDevicesList': yield update({ operaDeviceListLoading: true }); break;
        case 'M_GetOperationDetailList': yield update({ operaContantListloading: true }); break;
        case 'M_InsertOperationTask': yield update({ basicInfoTaskLoading: true }); break;
        case 'M_InsertOperationTaskScheme': yield update({ addPointLoading: true }); break;
        case 'M_InsertOperationTaskWorkers': yield update({ addOperaUserLoading: true }); break;
        case 'M_InsertOperationTaskDevices': yield update({ addOperaDeviceLoading: true }); break;
        case 'M_InsertOperationTaskPlan': yield update({ operationTaskPlanLoading: true }); break;
        case 'M_SubmitOperationTask': yield update({ taskSubmitLoading: true }); break;

        
      }
      const result = yield call(services.BWWebService, payload);
      const formatData = (resultData, itemsPar,itemPar) => {

        const arrDataFormat = (data,isOperate) => {
          let arrData = [];
          if (data instanceof Array) {
            arrData = data;
          } else { // 单条数据为对象的情况
            arrData.push(data)
          }
          return isOperate? data : arrData;
        }
        if (itemPar&&itemPar) {
          return resultData && resultData['soap:Envelope'] && resultData['soap:Envelope']['soap:Body'] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`][itemsPar] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`][itemsPar][itemPar] ? arrDataFormat(resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`][itemsPar][itemPar]) : []

        }else if(itemsPar=='operate'){ //操作
          return resultData && resultData['soap:Envelope'] && resultData['soap:Envelope']['soap:Body'] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]  && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['ResultStruct'] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['ResultStruct'].succes === "True" ? arrDataFormat(resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['ResultStruct'],'operate') : undefined
        } else {
          return resultData && resultData['soap:Envelope'] && resultData['soap:Envelope']['soap:Body'] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['Items'] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['Items']['Item'] ? arrDataFormat(resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['Items']['Item']) : []

        }
      }
      switch (payload.functionName) {
        case 'M_GetALLOperationTask':  //进行中 运维任务列表
          if (result.IsSuccess) {
             let data = [];
             if(payload.keywords){
                data = formatData(result.Datas).filter((item)=> item.RWMC.indexOf(payload.keywords)!=-1 || item.RWBH.indexOf(payload.keywords)!=-1 || item.RWMC.indexOf(payload.keywords)!=-1)
              }else{
                data = formatData(result.Datas)
            }
            yield update({  tableDatas: data,})
          } else {
            message.error('操作失败'); 
          }
          yield update({ tableLoading: false })
          break;
        case 'M_GetOperationTaskDone':  //已完结 运维任务列表
          if (result.IsSuccess) {
            let data = [];
            if(payload.keywords){
               data = formatData(result.Datas).filter((item)=> item.RWMC.indexOf(payload.keywords)!=-1 || item.RWBH.indexOf(payload.keywords)!=-1 || item.RWMC.indexOf(payload.keywords)!=-1)
              }else{
               data = formatData(result.Datas)
           }
            yield update({ tableDatas2: data, })
          } else {
            message.error('操作失败'); 
          }
          yield update({ tableLoading2: false })
          break;
        case 'M_GetOperationTaskByID':  //任务详情
          if (result.IsSuccess) {
            yield update({ taskDetailData: formatData(result.Datas)})
            callback&&callback(formatData(result.Datas));
          } else {
            message.error('操作失败'); 
          }
          yield update({ taskDetailLoading: false })
          break;
        case 'C_GetALLContractList':  //合同列表
          if (result.IsSuccess) {
            const data = formatData(result.Datas,'CONTRACTS','CONTRACT')      
            const listData = data.filter(item=>item.XZ == '运维')
            yield update({contractTableAllData:listData, contractTableData: listData, })
          } else {
            message.error('操作失败'); 
          }
          yield update({  contractTableLoading: false, })

          break;
          case 'M_OpenationTaskType':  //任务类别
          if (result.IsSuccess) {
            yield update({ taskTypeList: formatData(result.Datas), taskTypeListLoading: false, })
          } else {
            message.error('操作失败'); yield update({ taskTypeListLoading: false })
          }
          break; 
          case 'Z_CityInfo':  //任务所在区
          if (result.IsSuccess) {
             const cityData = [];
             const data = formatData(result.Datas);
                 data&&data[0]&&data.map(item1=>{
                  if(item1.PROVINCE && !item1.CITY&&!item1.DISTRICT){
                      cityData.push({value: item1.PROVINCE,label: item1.PROVINCE ,
                       children:data.map(item2=>{
                        if(item2.PROVINCE ===item1.PROVINCE && item2.CITY && !item2.DISTRICT){
                         return {value: item2.CITY,label: item2.CITY ,
                          children:data.map(item3=>{
                            if(item3.CITY ===item2.CITY &&item3.CITY && item3.DISTRICT){
                              return {value: item3.DISTRICT,label: item3.DISTRICT}
                            }
                         }).filter(item=>item!=undefined)
                        }
                       }
                      }).filter(item=>item!=undefined)
                    })
                  }

                })
            yield update({ cityInfoList: cityData,})
          } else {
            message.error('操作失败'); 
          }
          yield update({ cityInfoListLoading: false })
          break;
          case 'M_GetOperationSchemeList':  //点位列表
          if (result.IsSuccess) {
           const data =  formatData(result.Datas).map(item=>{
                 return {...item,key:item.ID}
            })
            yield update({ pointList: data})
          } else {
            message.error('操作失败')
          }
          yield update({  pointListLoading: false, })
          break;
          case 'B_GetALLWorkersList':  //运维人员列表
          if (result.IsSuccess) {
           const data =  formatData(result.Datas).map(item=>{
                 return {...item,key:item.ID}
            })
            yield update({ operaUserList: data})
          } else {
            message.error('操作失败')
          }
          yield update({  operaUserListLoading: false, })
          break;
          case 'B_GetALLDevicesList':  //运维设备列表
          if (result.IsSuccess) {
           const data =  formatData(result.Datas).map(item=>{
                 return {...item,key:item.ID}
            })
            yield update({ operaDeviceList: data})
          } else {
            message.error('操作失败')
          }
          yield update({  operaDeviceListLoading: false, })
          break;
          case 'M_GetOperationDetailList':  //运维内容
          if (result.IsSuccess) {
            const data =  formatData(result.Datas).map(item=>{
              return  { label: item.DETAILNAME, value: item.ID,CYCLE:item.CYCLE}
            })
            yield update({ operaContantList: data,})
            callback&&callback(data);
          } else {
            message.error('操作失败'); 
          }
          yield update({ operaContantListLoading: false })
          break;
          case 'M_InsertOperationTask':  //任务基本信息添加  
          const res = formatData(result.Datas,'operate')
          if (result.IsSuccess && res) {
             message.success(result.Message)
             yield update({ taskId: res.ID }) 
          } else {
            message.error('操作失败')
          }
          yield update({ basicInfoTaskLoading: false })
          break;
          case 'M_InsertOperationTaskScheme':  //点位添加
          if (result.IsSuccess && formatData(result.Datas,'operate')) {
            message.success(result.Message)
            callback();   
          } else {
            message.error('操作失败')
          }
          yield update({ addPointLoading: false })
          break;
          case 'M_InsertOperationTaskWorkers':  //运维人员添加
          if (result.IsSuccess && formatData(result.Datas,'operate')) {
            message.success(result.Message)
            callback();   
          } else {
            message.error('操作失败')
          }
          yield update({ addOperaUserLoading: false })
          break;
          case 'M_InsertOperationTaskDevices':  //运维设备添加
          if (result.IsSuccess && formatData(result.Datas,'operate')) {
            message.success(result.Message)
            callback();   
          } else {
            message.error('操作失败')
          }
          yield update({ addOperaDeviceLoading: false })
          break;
          case 'M_InsertOperationTaskPlan':  //运维计划添加
          if (result.IsSuccess && formatData(result.Datas,'operate') ) {
            message.success(result.Message)
            callback(formatData(result.Datas));   
          } else {
            message.error('操作失败')
          }
          yield update({ operationTaskPlanLoading: false })
          break;
          case 'M_SubmitOperationTask':  //计划提交
          if (result.IsSuccess && formatData(result.Datas,'operate') ) {
            message.success(result.Message)
            callback&&callback();   
          } else {
            message.error('操作失败')
          }
          yield update({ taskSubmitLoading: false })
          break;
      }
    },
    //导出
    *exportSystemModelList({ payload, }, { call, update, select, put }) {
      const result = yield call(services.ExportSystemModelList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      } else {
        message.error('下载失败')
      }
    },
  },
})