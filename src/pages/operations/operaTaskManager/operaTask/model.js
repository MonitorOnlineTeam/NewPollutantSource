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
    tableTotal: 0,
    tableDatas2: [],
    tableLoading2: false,
    tableTotal2: 0,
    taskAddPointLoading: false,
    taskDetailData: [],
    taskDetailLoading: false,
    contractTableLoading: false,
    contractTableData: [],
    taskTypeListLoading:false,
    taskTypeList:[],
    cityInfoListLoading:false,
    cityInfoList:[],
    pointList: [],
    pointListLoading: false,
  },
  effects: {
    *bWWebService({ payload, callback }, { call, put, update }) {
      switch (payload.functionName) {
        case 'M_GetALLOperationTask': yield update({ tableLoading: true }); break;
        case 'M_GetOperationTaskDone': yield update({ tableLoading2: true }); break;
        case 'M_InsertOperationTaskScheme': yield update({ taskAddPointLoading: true }); break;
        case 'M_GetOperationTaskByID': yield update({ taskDetailLoading: true }); break;
        case 'C_GetALLContractList': yield update({ contractTableLoading: true }); break;
        case 'M_OpenationTaskType': yield update({ taskTypeListLoading: true }); break;
        case 'Z_CityInfo': yield update({ cityInfoListLoading: true }); break;
        case 'M_GetOperationSchemeList': yield update({ pointListLoading: true }); break;

      }
      const result = yield call(services.BWWebService, payload);
      const formatData = (resultData, itemsPar,itemPar) => {

        const arrDataFormat = (data) => {
          let arrData = [];
          if (data instanceof Array) {
            arrData = data;
          } else { // 单条数据为对象的情况
            arrData.push(data)
          }
          return arrData;
        }
        if (itemPar&&itemPar) {
          return resultData && resultData['soap:Envelope'] && resultData['soap:Envelope']['soap:Body'] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`][itemsPar] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`][itemsPar][itemPar] ? arrDataFormat(resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`][itemsPar][itemPar]) : []

        } else {
          return resultData && resultData['soap:Envelope'] && resultData['soap:Envelope']['soap:Body'] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['Items'] && resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['Items']['Item'] ? arrDataFormat(resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['Items']['Item']) : []

        }
      }
      switch (payload.functionName) {
        case 'M_GetALLOperationTask':  //进行中 运维任务列表
          if (result.IsSuccess) {
            yield update({ tableTotal: result.Total, tableDatas: formatData(result.Datas), tableLoading: false, })
          } else {
            message.error(result.Message); yield update({ tableLoading: false })
          }
          break;
        case 'M_GetOperationTaskDone':  //已完结 运维任务列表
          if (result.IsSuccess) {
            yield update({ tableTotal2: result.Total, tableDatas2: formatData(result.Datas), tableLoading2: false, })
          } else {
            message.error(result.Message); yield update({ tableLoading2: false })
          }
          break;
        case 'M_GetOperationTaskByID':  //任务详情
          if (result.IsSuccess) {
            yield update({ taskDetailData: formatData(result.Datas), taskDetailLoading: false, })
          } else {
            message.error(result.Message); yield update({ taskDetailLoading: false })
          }
          break;
        case 'C_GetALLContractList':  //合同列表
          if (result.IsSuccess) {
            yield update({ contractTableData: formatData(result.Datas,'CONTRACTS','CONTRACT'), contractTableLoading: false, })
          } else {
            message.error(result.Message); yield update({ contractTableLoading: false })
          }
          break;
          case 'M_OpenationTaskType':  //任务类别
          if (result.IsSuccess) {
            yield update({ taskTypeList: formatData(result.Datas), taskTypeListLoading: false, })
          } else {
            message.error(result.Message); yield update({ taskTypeListLoading: false })
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
            message.error(result.Message); 
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
            message.error(result.Message)
          }
          yield update({  pointListLoading: false, })
          break;
        case 'M_InsertOperationTaskScheme':  //任务 添加点位
          if (result.IsSuccess) {
            message.success(result.Message)
          } else {
            message.error(result.Message)
          }
          yield update({ taskAddPointLoading: false })
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
        message.error(result.Message)
      }
    },
  },
})