import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'test',
  state: {
    tableDataSource: [],
    addExceptionModalVisible: false,
    exceptionReportedData: {
      ExceptionType: "",
      PollutantCodes: "",
    },
  },
  effects: {
    // 查询
    *getTableData({ payload }, { call, update }) {
      const result = yield call(services.getTableData, payload);
      if (result.IsSuccess) {
        yield update({
          tableDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 删除
    * deleteExceptionItem({ payload, callback }, { call, update, select }) {
      const result = yield call(services.deleteExceptionItem, payload);
      if (result.IsSuccess) {
        message.success("删除成功");
        callback && callback();
      } else {
        message.error(result.Message)
      }
    },
    // 添加、编辑
    * saveAndUpdateException({ payload, callback }, { call, update, select }) {
      const result = yield call(services.saveAndUpdateException, payload);
      if (result.IsSuccess) {
        message.success("操作成功");
        yield update({ addExceptionModalVisible: false });
        callback && callback();
      } else {
        message.error(result.Message)
      }
    },
    // 获取编辑数据
    * getExceptionReportedById({ payload }, { call, update, select }) {
      const result = yield call(services.getExceptionReportedById, payload);
      if (result.IsSuccess) {
        yield update({ exceptionReportedData: result.Datas });
      } else {
        message.error(result.Message)
      }
    },


  }
})