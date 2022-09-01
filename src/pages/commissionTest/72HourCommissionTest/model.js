import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'hourCommissionTest',
  state: {
    treeList:[],
    testRecordType:[],
    particleMatterReferTableDatas:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
  },
  effects: {
    *getTestEntTree({ payload,callback }, { call, put, update }) { //企业树
      yield update({ tableLoading:true})
      const result = yield call(services.GetTestEntTree, payload);
      if (result.IsSuccess) {
        yield update({
          treeList: result.Datas,
        })
        callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    }, 
    *get72TestRecordType({ payload,callback }, { call, put, update }) { //右侧tab栏
      yield update({ tableLoading:true})
      const result = yield call(services.Get72TestRecordType, payload);
      if (result.IsSuccess) {
        yield update({ testRecordType: result.Datas, })
      }else{
        message.error(result.Message)
        yield update({  testRecordType:result.Datas?result.Datas:[],  })
      }
    },
    /**颗粒物参比 */
    *importData({ payload,callback }, { call, put, update }) { //导入
      yield update({ tableLoading:true})
      const result = yield call(services.ImportData, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *getPMReferenceCalibrationRecord({ payload,callback }, { call, put, update }) { //获取表单参数
      yield update({ tableLoading:true})
      const result = yield call(services.GetPMReferenceCalibrationRecord, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *addPMReferenceCalibrationRecord({ payload,callback }, { call, put, update }) { //提交 暂存
      yield update({ tableLoading:true})
      const result = yield call(services.AddPMReferenceCalibrationRecord, payload);
      if (result.IsSuccess) {
        callback()
      }else{
        message.error(result.Message)
      }
    },
    *deletePMReferenceCalibrationRecord({ payload,callback }, { call, put, update }) { //删除
      yield update({ tableLoading:true})
      const result = yield call(services.DeletePMReferenceCalibrationRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
  },
})