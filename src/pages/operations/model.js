import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';
import config from '@/config'

export default Model.extend({
  namespace: 'operations',
  state: {
    calendarList: [],
    abnormalDetailList: [],
    abnormalForm: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    recordTypeList: [],
    timeLineList: [],
    timeLineTotal: 0,
    imageList: []
  },
  effects: {
    // 获取日历信息
    * getCalendarInfo({ payload }, { call, put, update }) {
      const result = yield call(services.getCalendarInfo, payload);
      if (result.IsSuccess) {
        yield update({
          calendarList: result.Datas
        })
      }
    },

    // 获取异常详细信息 - 表格数据
    * getAbnormalDetailList({ payload }, { call, put, update, select }) {
      const abnormalForm = yield select(state => state.operations.abnormalForm)
      const result = yield call(services.getAbnormalDetailList, payload);
      if (result.IsSuccess) {
        yield update({
          abnormalDetailList: result.Datas,
          abnormalForm: {
            ...abnormalForm,
            total: result.Total
          }
        })
      }
    },

    // 获取运维日志信息
    * getOperationLogList({ payload }, { call, put, update }) {
      console.log('payload=',payload)
      const result = yield call(services.getOperationLogList, payload);
      if (result.IsSuccess) {
        yield update({
          recordTypeList: result.Datas.RecordType,
          timeLineList: result.Datas.FormList,
          timeLineTotal: result.Total
        })
      }
    },

    // 获取运维日志详情图片
    * getOperationImageList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getOperationImageList, payload);
      if (result.IsSuccess) {
        let imageList = [];
        if (result.Datas) {
          imageList = result.Datas.map((item, index) => {
            return {
              uid: index,
              name: item,
              status: 'done',
              url: config.imgaddress + item
            }
          })
        }
        yield update({
          imageList: imageList
        })
        callback && callback(result)
      }
    }
  }
})