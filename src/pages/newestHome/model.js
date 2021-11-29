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
    operationLoading:true,
    operationDataSource: [],
    latelyDays30:{beginTime:moment(moment().add(-31, 'day')).format('YYYY-MM-DD 00:00:00'),endTime: moment(moment().add(-1, 'day')).format('YYYY-MM-DD 23:59:59')},
    operaOrderData: [],
    planOperaList:{actualCalibrationCount: 0, actualCalibrationRate: "0.00",autoCalibrationAllCount: 0,
                   autoCalibrationCompleteCount: 0,autoCalibrationRate: "0.00",  inspectionAllCount: 0,
                   inspectionCompleteCount: 0, inspectionRate: "0.00"},
    planCompleteList:[
      {sort:1,name:'北京',roat:'99.98%'},
      {sort:2,name:'北京',roat:'99.98%'},
      {sort:3,name:'北京',roat:'99.98%'},
      {sort:4,name:'北京',roat:'99.98%'},
      {sort:5,name:'北京',roat:'99.98%'},
      {sort:6,name:'北京',roat:'99.98%'},
      {sort:7,name:'北京',roat:'99.98%'},
      {sort:8,name:'北京',roat:'99.98%'},
      {sort:9,name:'北京',roat:'99.98%'},
      {sort:10,name:'北京',roat:'99.98%'},
      {sort:11,name:'北京',roat:'99.98%'},
      {sort:12,name:'北京',roat:'99.98%'},
      {sort:13,name:'北京',roat:'99.98%'},
      {sort:14,name:'北京',roat:'99.98%'},
    ],
    dataAlarmResData:[100.00,99.00,88.33,12.88],
  },
  effects: {
    *GetOperatePointList({ payload,callback }, { call, put, update }) { //运营信息统计
      yield update({ operationLoading:true})
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
         yield update({ operationDataSource: data,operationLoading:false  });
      }else{
        message.error(result.Message)
        yield update({ operationLoading:false  });
      }
    },

    *GetOperationTaskList({ payload,callback }, { call, put, update }) { //运维工单统计
      yield update({ operationLoading:true})
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
        yield update({ operationLoading:true})
        const result = yield call(services.GetOperationPlanTaskRate, payload);
        if (result.IsSuccess) { 
           yield update({ planOperaList: result.Datas });
        }else{
          message.error(result.Message)
        }
  
      
    },
  },
})