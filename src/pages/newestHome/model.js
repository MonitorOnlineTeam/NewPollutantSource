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
    latelyDays30:{beginTime:moment(moment().add(-31, 'day')).format('YYYY-MM-DD 00:00:00'),endTime: moment(moment().add(-1, 'day')).format('YYYY-MM-DD 23:59:59')},
    latelyDays7:{beginTime:moment(moment().add(-8, 'day')).format('YYYY-MM-DD 00:00:00'),endTime: moment(moment().add(-1, 'day')).format('YYYY-MM-DD 23:59:59')},
    pollType : {'废水' : "1",'废气' : "2", },
    operaOrderData: [],
    planOperaList:{actualCalibrationCount: 0, actualCalibrationRate: "0.00",autoCalibrationAllCount: 0,
                   autoCalibrationCompleteCount: 0,autoCalibrationRate: "0.00",  inspectionAllCount: 0,
                   inspectionCompleteCount: 0, inspectionRate: "0.00"},
    planCompleteList:[],
    effectiveTransmissionList:[],
    dataAlarmResData:["0.00","0.00","0.00","0.00"],
    exceptionSignTaskRateList:{insidePlanRate: "0.00",  insidePlanTaskCount: 0, insidePlanTaskExceptionCount: 0,
                               outPlanTaskCount: 0, outPlanTaskExceptionCount: 0, outPlanTaskRate: "0.00"},
    consumablesList:{consumablesReplaceCount: 0,sparePartReplaceRecordCount: 0, standardGasRepalceCoun: 0, standardLiquidRepalceCount: 0},
    mapPointList:[],
    regionMarkers:[] 
  },
  effects: {
    *GetOperatePointList({ payload,callback }, { call, put, update }) { //运营信息统计
      const result = yield call(services.GetOperatePointList, payload);
      if (result.IsSuccess) {
        let item = result.Datas;
        let data = [{
          key: '1', type: '总数',  entCount: item.allEntCount,  disPointCount: item.allDischargePointCount,
          unDisPointCount: item.allUnDischargePointCount,
        },{  key: '2', type: '暂停运维',entCount: item.endEntCount, disPointCount: item.endDischargePointCount, 
           unDisPointCount: item.endUnDischargePointCount,
        },{
          key: '3', type: '结束运维', entCount: item.endProjectEntCount, disPointCount: item.endDischargeProjectEntCount,
          unDisPointCount: item.endUnDischargeProjectEntCount,
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
        let data = [item.inspectionCount,item.calibrationCount,item.calibrationTestCount,
                    item.repairCount,item.repairCount,item.cooperationInspectionCount,
                    item.matchingComparisonCount,1]
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
          //  yield update({ dataAlarmResData: [item.overTimeRate,item.missRate,item.exceptionRate,item.operationRate] });
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
        *GetMapPointList({ payload,callback }, { call, put, update }) { //地图部分
            const result = yield call(services.GetMapPointList, payload);
            if (result.IsSuccess) { 
              const regionMarker = result.Datas.map((item)=>({
                position:{
                  ...item
               }
             }))
             yield update({
              mapPointLists:result.Datas,
              regionMarkers:regionMarker,
             })
            }else{
              message.error(result.Message)
             }    
            },
  },
})