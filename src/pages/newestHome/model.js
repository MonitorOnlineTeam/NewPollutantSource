import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'newestHome',
  state: {
    subjectFontSize:14,
    operationDataSource: [],
    latelyDays30:{beginTime:moment(moment().add(-30, 'day')).format('YYYY-MM-DD 00:00:00'),endTime: moment(moment()).format('YYYY-MM-DD 23:59:59')},
    latelyDays7:{beginTime:moment(moment().add(-7, 'day')).format('YYYY-MM-DD 00:00:00'),endTime: moment(moment()).format('YYYY-MM-DD 23:59:59')},
    pollType : {'废气' : "2", '废水' : "1",},
    // modalType:{'废水':'ent','废气' : "ent"},
    operaOrderData: [],
    planOperaList:{actualCalibrationCount: 0, actualCalibrationRate: "0.00",autoCalibrationAllCount: 0,
                   autoCalibrationCompleteCount: 0,autoCalibrationRate: "0.00",  inspectionAllCount: 0,
                   inspectionCompleteCount: 0,inspectionAllCount:0,inspectionOutCompleteCount:0 ,autoCalibrationOutCompleteCount:0, inspectionRate: "0.00",inspectionCompleteCount:0,inspectionIncompleteCount:0,inspectionCloseCount:0,calibrationRate:"0.00",calibrationCloseCount:0,calibrationCompleteCount:0,calibrationIncompleteCount:0},
    planCompleteList:[],
    effectiveTransmissionList:[],
    dataAlarmResData:["0.00","0.00","0.00","0.00"],
    exceptionSignTaskRateList:{insidePlanRate: "0.00",  insidePlanTaskCount: 0, insidePlanTaskExceptionCount: 0,
                               outPlanTaskCount: 0, outPlanTaskExceptionCount: 0, outPlanTaskRate: "0.00"},
    consumablesList:{consumablesReplaceCount: 0,sparePartReplaceRecordCount: 0, standardGasRepalceCoun: 0, standardLiquidRepalceCount: 0},
    opertionExceptionList:{intactRate: "0.00" ,failureRate: "0.00",repairRate: "0.00"},
    mapPointList:[],
    regionMarkers:[],
    mapStatusData:{exceptionCount: 0,normalCount: 0,overCount: 0, stopCount: 0,unLineCount: 0},
    infoWindowData: { //监测点 infoWindow数据
      list: [],
      time: undefined
    },
    infoWindowDataLoading:false,
    siteDetailsVisible:false,
    tabType:"wasteWater",
    entList:[],
    smallResolution:false,
    mapStatusRegData:{exceptionCount: 0,normalCount: 0,overCount: 0, stopCount: 0,unLineCount: 0},
    mapStatusEntData:{exceptionCount: 0,normalCount: 0,overCount: 0, stopCount: 0,unLineCount: 0},
    alarmResponseTimelyList:11121212,
  },
  effects: {
    *GetOperatePointList({ payload,callback }, { call, put, update }) { //运维信息统计
      const result = yield call(services.GetOperatePointList, payload);
      if (result.IsSuccess) {
        let item = result.Datas;
        let data = [{
          key: '1', type: '总数',  entCount: item.allEntCount,  disPointCount: item.allDischargePointCount,
          unDisPointCount: item.allUnDischargePointCount,allPointCount:item.allPointCount,
        },{
          key: '2', type: '运维中', entCount: item.normalEntCount, disPointCount: item.normalDischargePointCount,
          unDisPointCount: item.normalUnDischargePointCount,allPointCount:item.normalPointCount,
        },{  key: '3', type: '运维暂停',entCount: item.endEntCount, disPointCount: item.endDischargePointCount, 
           unDisPointCount: item.endUnDischargePointCount,allPointCount:item.endPointCount,
        }]
         yield update({ operationDataSource: data });
      }else{
        message.error(result.Message)
      }
    },

    *GetOperationTaskList({ payload,callback }, { call, put, update }) { //运维工单统计
      const result = yield call(services.GetOperationTaskList, payload);
      if (result.IsSuccess) { 
        let item = result.Datas;
        let data = [item.coordinationComparisonCount,item.cooperationInspectionCount,
                    //  item.matchingComparisonCount,
                      item.calibrationTestCount, item.maintainCount,item.repairCount,
                      item.calibrationCount,item.inspectionCount,
                    ]
         yield update({ operaOrderData: data });
      }else{
        message.error(result.Message)
      }
     },
      *GetOperationPlanTaskRate({ payload,callback }, { call, put, update }) { //近30日计划运维情况
        const result = yield call(services.GetOperationPlanTaskRate, payload);
        if (result.IsSuccess) { 
           yield update({ planOperaList: result.Datas });
        }else{
          message.error(result.Message)
         }    
        },
      *GetOperationRegionPlanTaskRate({ payload,callback }, { call, put, update }) { //计划完成率
          const result = yield call(services.GetOperationRegionPlanTaskRate, payload);
          if (result.IsSuccess) { 
             yield update({ planCompleteList: result.Datas });
          }else{
            message.error(result.Message)
           }    
          },
       *GetExceptionSignTaskRate({ payload,callback }, { call, put, update }) { //异常打卡统计
            const result = yield call(services.GetExceptionSignTaskRate, payload);
            if (result.IsSuccess) { 
               yield update({ exceptionSignTaskRateList: result.Datas });
            }else{
              message.error(result.Message)
             }    
        },
       *GetEffectiveTransmissionRateList({ payload,callback }, { call, put, update }) { //传输有效率
          const result = yield call(services.GetEffectiveTransmissionRateList, payload);
          if (result.IsSuccess) { 
             yield update({ effectiveTransmissionList: result.Datas.dataList ? result.Datas.dataList:[] });
          }else{
            message.error(result.Message)
           }    
       },
       *GetAlarmResponse({ payload,callback }, { call, put, update }) { //数据报警响应统计
         const result = yield call(services.GetAlarmResponse, payload);
         if (result.IsSuccess) { 
           let item = result.Datas;
           yield update({ dataAlarmResData: [item.overTimeRate,item.missRate,item.exceptionRate,item.operationRate] });
         }else{
           message.error(result.Message)
          }    
         },
        *GetConsumablesList({ payload,callback }, { call, put, update }) { //耗材统计
          const result = yield call(services.GetConsumablesList, payload);
          if (result.IsSuccess) { 
            yield update({ consumablesList: result.Datas });
          }else{
            message.error(result.Message)
           }    
          },
          *GetOpertionExceptionList({ payload,callback }, { call, put, update }) { //异常设备统计
            const result = yield call(services.GetOpertionExceptionList, payload);
            if (result.IsSuccess) { 
              yield update({ opertionExceptionList: result.Datas });
            }else{
              message.error(result.Message)
             }    
            },



        *GetMapPointList({ payload,callback }, { call, put, update }) { //地图部分
            const result = yield call(services.GetMapPointList, payload);
            if (result.IsSuccess) { 
              const markers = result.Datas.list[0]?result.Datas.list.map((item)=>({
                position:{
                  ...item,
                  latitude:item.Latitude? item.Latitude : item.latitude,
                  longitude:item.Longitude? item.Longitude : item.longitude,
               }
             })): []
             //监测点数据 图例  
             if(payload.pointType==3 && payload.regionCode || payload.pointType==3 && payload.entCode&&payload.selectEnt){  // 或者后面 搜索企业 监测点图例单独处理
              yield update({mapStatusRegData:result.Datas.sum,   })
             }else if(payload.pointType==3 && payload.entCode){
              yield update({mapStatusEntData:result.Datas.sum,   })
             }else{
              yield update({mapStatusData:result.Datas.sum,   })

             }
             if(payload.pointType==2){
              yield update({
                entList:result.Datas.list //企业列表
               })
             }
             callback(markers)
            }else{
              message.error(result.Message)
             }    
            },
   //地图 获取监测点infoWindow数据
    *getInfoWindowData({   payload, }, { call, update, select, put }) {
      yield update({ infoWindowDataLoading: true })
      const result = yield call(services.GetPollutantList, { pollutantTypes: payload.pollutantTypes });
      if (result.IsSuccess) {
        yield put({ type: "getInfoWindowPollutantList", payload: payload, pollutantList: result.Datas });
      } else {
        message.error(result.Message)
      }
    },
    //地图 获取监测点infoWindow数据
    *getInfoWindowPollutantList({ payload, pollutantList }, { call, update, select, put }) {
      const result = yield call(services.GetInfoWindowData, payload);
      console.log("pollutantList=", pollutantList)
      if (result.IsSuccess) {
        let list = [];
        pollutantList.map(item => {
          result.Datas.map(itm => {
            if (itm[item.field]) {
              list.push({
                label: item.name,
                value: itm[item.field],
                key: item.field,
                title: item.title,
                status: itm[item.field + "_params"] ? itm[item.field + "_params"].split("§")[0] : null,
                level: itm[item.field + "_Level"],
                levelColor: itm[item.field + "_LevelColor"],
                levelValue: itm[item.field + "_LevelValue"],
                // ...itm,
              })
            }
          })
        })
        console.log("list=", list)
        let data = result.Datas[0] ? result.Datas[0] : [];
        yield update({
          infoWindowDataLoading:false,
          infoWindowData: {
            list: list,
            ...data
          }
        })
      } else {
        message.error(result.Message)
      }
    },  
    *getResponseList({ payload,callback }, { call, put, update }) { //报警响应及时
      const result = yield call(services.GetResponseList, payload);
      if (result.IsSuccess) { 
        yield update({ alarmResponseTimelyList: result.Datas });
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
       }    
      },   
  },
})