/*
 * @Author: lzp
 * @Date: 2019-08-16 10:41:55
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:11:59
 * @Description: 运维记录相关接口
 */
import Model from '@/utils/model';
import {
  getrecordtypebymn,
  getjzhistoryinfo,
  getOperationLogList,
  exportReport,
} from '../services/operationBaseApi';
import { message } from 'antd';
import moment from 'moment';

export default Model.extend({
  namespace: 'operationform',

  state: {
    RecordTypeTree: [],
    JZDatas: [],
    RecordType: '',
    rangDate: [moment(new Date()).add(-3, 'month'), moment(new Date())],
    PollutantTypes: '',
    BeginTime: moment(new Date()).add(-3, 'month'),
    EndTime: moment(new Date()),
    currentRecordType: null,
    recordTypeList: [],
    currentDate: [
      moment()
        .subtract(3, 'month')
        .startOf('day'),
      moment().endOf('day'),
    ],
    breadTitle: '运维日志',
    // mainSelectDate:''
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {});
    },
  },

  effects: {
    /*【智能运维】获取污染物系统污染物**/
    *getrecordtypebymn({ payload, callback }, { call, update }) {
      const result = yield call(getrecordtypebymn, { ...payload });
      if (result.IsSuccess) {
        yield update({
          RecordTypeTree: result.Datas,
          RecordType: result.Datas && result.Datas[0].key,
        });
        callback && callback(result);
      }
    },
    /*【智能运维】获取零点量程漂移与校准记录表**/
    *getjzhistoryinfo({ payload }, { call, update }) {
      const result = yield call(getjzhistoryinfo, { ...payload });
      if (result.IsSuccess) {
        yield update({
          JZDatas: result.Datas,
        });
      }
    },
    // 获取运维日志信息
    *getOperationLogList({ payload, callback }, { call, put, update, select }) {
      const postData = {
        RecordType: '',
        beginTime: moment().format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        ...payload,
      };
      const result = yield call(getOperationLogList, postData);
      if (result.IsSuccess) {
        yield update({
          recordTypeList: result.Datas&&result.Datas.RecordType? result.Datas.RecordType : [],
        });
        callback && callback();
      }
    },
    // 获取运维日志信息
    *exportReport({ payload, callback }, { call, put, update, select }) {
      const result = yield call(exportReport, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },
  },
  reducers: {
    //   mainSelectDates(state, { payload }){
    //     //return新的state,这样页面就会更新 es6语法，就是把state全部展开，然后把payload重新赋值，这样后面赋值的payload的值就会覆盖前面的。也是es6语法，相同名字可以写成一个，所以上面接收处写了num
    // 　　　　return { ...state, ...payload}
    //    },
  },
});
