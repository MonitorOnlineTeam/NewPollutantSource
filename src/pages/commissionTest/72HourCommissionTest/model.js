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
    treeList: [],
    testRecordType: [],
    particleMatterReferTableDatas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
  effects: {
    *getTestEntTree({ payload, callback }, { call, put, update }) { //企业树
      yield update({ tableLoading: true })
      const result = yield call(services.GetTestEntTree, payload);
      if (result.IsSuccess) {
        yield update({
          treeList: result.Datas,
        })
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *get72TestRecordType({ payload, callback }, { call, put, update }) { //右侧tab栏
      yield update({ tableLoading: true })
      const result = yield call(services.Get72TestRecordType, payload);
      if (result.IsSuccess) {
        yield update({ testRecordType: result.Datas, })
      } else {
        message.error(result.Message)
        yield update({ testRecordType: result.Datas ? result.Datas : [], })
      }
    },
    *get72TestRecordPollutant({ payload, callback }, { call, put, update }) { //获取污染物列表
      yield update({ tableLoading: true })
      const result = yield call(services.Get72TestRecordPollutant, payload);
      if (result.IsSuccess) {
        let data = [], defaultPollCode;
        if (result.Datas && result.Datas[0]) {
          data = result.Datas.map(item => {
            return { label: item.Name, value: item.ChildID }
          })
          defaultPollCode = result.Datas[0].ChildID
        }

        callback(data, defaultPollCode)
      } else {
        message.error(result.Message)
      }
    },


    /**颗粒物参比 */
    *importData({ payload, callback }, { call, put, update }) { //导入
      yield update({ tableLoading: true })
      const result = yield call(services.ImportData, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.Datas)
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *getPMReferenceCalibrationRecord({ payload, callback }, { call, put, update }) { //获取表单参数
      yield update({ tableLoading: true })
      const result = yield call(services.GetPMReferenceCalibrationRecord, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *addPMReferenceCalibrationRecord({ payload, callback }, { call, put, update }) { //提交 暂存
      yield update({ tableLoading: true })
      const result = yield call(services.AddPMReferenceCalibrationRecord, payload);
      if (result.IsSuccess) {
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *deletePMReferenceCalibrationRecord({ payload, callback }, { call, put, update }) { //删除
      yield update({ tableLoading: true })
      const result = yield call(services.DeletePMReferenceCalibrationRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },

    /**参比方法评估气态污染物CEMS（含氧量）准确度 */

    *getTimesListByPollutant({ payload, callback }, { call, put, update }) { //根据污染物获取时间
      const result = yield call(services.GetTimesListByPollutant, payload);
      if (result.IsSuccess) {
        let data = [], defaultDateCode;
        if (result.Datas && result.Datas[0]) {
          data = result.Datas.map(item => {
            return { label: moment(item).format('YYYY-MM-DD'), value: item }
          })
          defaultDateCode = result.Datas[0]
        }

        callback(data, defaultDateCode)
      } else {
        message.error(result.Message)
      }
    },
    *getGasReferenceMethodAccuracyRecord({ payload, callback }, { call, put, update }) { //获取
      yield update({ tableLoading: true })
      const result = yield call(services.GetGasReferenceMethodAccuracyRecord, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *addGasReferenceMethodAccuracyInfo({ payload, callback }, { call, put, update }) { //初始添加
      yield update({ tableLoading: true })
      const result = yield call(services.AddGasReferenceMethodAccuracyInfo, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *addGasReferenceMethodAccuracyRecord({ payload, callback }, { call, put, update }) { //添加或修改 暂存、保存
      yield update({ tableLoading: true })
      const result = yield call(services.AddGasReferenceMethodAccuracyRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *deleteGasReferenceMethodAccuracyRecord({ payload, callback }, { call, put, update }) { //删除
      yield update({ tableLoading: true })
      const result = yield call(services.DeleteGasReferenceMethodAccuracyRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *importDataNew({ payload, callback }, { call, put, update }) { //导入
      yield update({ tableLoading: true })
      const result = yield call(services.ImportDataNew, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    /*** 气态污染物CEMS示值误差和系统响应时间检测表单 ***/
    *getGasIndicationErrorSystemResponseRecord({ payload, callback }, { call, put, update }) { //获取
      yield update({ tableLoading: true })
      const result = yield call(services.GetGasIndicationErrorSystemResponseRecord, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *addGasIndicationErrorSystemResponseRecord({ payload, callback }, { call, put, update }) { //添加或修改 暂存、保存
      yield update({ tableLoading: true })
      const result = yield call(services.AddGasIndicationErrorSystemResponseRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *deleteGasIndicationErrorSystemResponseRecord({ payload, callback }, { call, put, update }) { //删除
      yield update({ tableLoading: true })
      const result = yield call(services.DeleteGasIndicationErrorSystemResponseRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    /*** 速度场系数表单 ***/
    *getVelocityFieldCheckingRecord({ payload, callback }, { call, put, update }) { //获取
      yield update({ tableLoading: true })
      const result = yield call(services.GetVelocityFieldCheckingRecord, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *addVelocityFieldCheckingRecord({ payload, callback }, { call, put, update }) { //添加或修改 暂存、保存
      yield update({ tableLoading: true })
      const result = yield call(services.AddVelocityFieldCheckingRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *deleteVelocityFieldCheckingRecord({ payload, callback }, { call, put, update }) { //删除
      yield update({ tableLoading: true })
      const result = yield call(services.DeleteVelocityFieldCheckingRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },

    /*** 温度CMS准确度检测表单 ***/
    *getTemperatureCheckingRecord({ payload, callback }, { call, put, update }) { //获取
      yield update({ tableLoading: true })
      const result = yield call(services.GetTemperatureCheckingRecord, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *addTemperatureCheckingRecord({ payload, callback }, { call, put, update }) { //添加或修改 暂存、保存
      yield update({ tableLoading: true })
      const result = yield call(services.AddTemperatureCheckingRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *deleteTemperatureCheckingRecord({ payload, callback }, { call, put, update }) { //删除
      yield update({ tableLoading: true })
      const result = yield call(services.DeleteTemperatureCheckingRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    /*** 湿度CMS准确度检测表单 ***/
    *getHumidityCheckingRecord({ payload, callback }, { call, put, update }) { //获取
      yield update({ tableLoading: true })
      const result = yield call(services.GetHumidityCheckingRecord, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *addHumidityCheckingRecord({ payload, callback }, { call, put, update }) { //添加或修改 暂存、保存
      yield update({ tableLoading: true })
      const result = yield call(services.AddHumidityCheckingRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *deleteHumidityCheckingRecord({ payload, callback }, { call, put, update }) { //删除
      yield update({ tableLoading: true })
      const result = yield call(services.DeleteHumidityCheckingRecord, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
  }
})