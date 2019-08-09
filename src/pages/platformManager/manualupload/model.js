/**
 * 功  能：收数据导入请求地址model
 * 创建人：dongxiaoyun
 * 创建时间：2019.08.9
 */
import Model from '@/utils/model';
import {
  uploadfiles, GetPollutantByPoint, 
  GetManualSupplementList, 
  getUploadTemplate,
  GetAllPollutantTypes, 
  addGetPollutantByPoint, 
  AddUploadFiles, 
  GetUnitByPollutant, 
  DeleteUploadFiles, 
  UpdateManualSupplementData, 
  getPollutantTypeList
} from './services';
import config from '@/config';
import {
  formatPollutantPopover,
} from '@/utils/utils';
import {
  message,
} from 'antd';
import * as services from '../../../services/autoformapi';

export default Model.extend({
  namespace: 'manualupload',
  state: {
      editUser: null,
      requstresult: null,
      total: 0,
      reason: null,
      selectdata: [],
      uploaddatalist: [],
      templatedata: [],
      PollutantTypesList: [],
      addselectdata: [],
      unit: null,
      DGIMN: null,
      pointName: null,
      polltuantTypeList: [],
      //手工数据上传参数
      manualUploadParameters: {
          DGIMNs: '',
          DGIMN: '',
          pollutantCode: [],
          BeginTime: moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'),
          EndTime: moment().format('YYYY-MM-DD 23:59:59'),
          pageIndex: 1,
          pageSize: 10,
          pointName: '',
          PollutantType: '2'
      }

  },
  effects: {
      //上传附件
      * uploadfiles({
          payload
      }, {
          call,
          update,
      }) {
          const result = yield call(uploadfiles, payload);
          if (result !== null) {
              yield update({
                  requstresult: result.requstresult,
              });
              payload.callback(result.requstresult, result.reason);
          }
      },
      //根据排口获取污染物
      * GetPollutantByPoint({
          payload
      }, {
          call,
          update,
      }) {
          const result = yield call(GetPollutantByPoint, payload);
          if (result.data.length !== 0) {
              yield update({
                  selectdata: result.data,
                  reason: result.reason
              });
          }
          else {
              yield update({
                  selectdata: [],
                  reason: result.reason
              });
          }
      },
      //根据排口获取污染物添加页面
      * addGetPollutantByPoint({
          payload
      }, {
          call,
          update,
      }) {
          const result = yield call(addGetPollutantByPoint, payload);
          if (result.data.length !== 0) {
              yield update({
                  addselectdata: result.data,
                  reason: result.reason
              });
          }
          else {
              yield update({
                  addselectdata: null,
                  reason: result.reason
              });
          }
      },
      //获取数据列表（右侧）
      * GetManualSupplementList({
          payload
      }, {
          call,
          put,
          update,
          select,
      }) {
          const { manualUploadParameters } = yield select(a => a.manualupload);
          const body = {
              DGIMN: manualUploadParameters.DGIMN,
              pollutantCode: manualUploadParameters.pollutantCode,
              BeginTime: manualUploadParameters.BeginTime,
              EndTime: manualUploadParameters.EndTime,
              pageIndex: manualUploadParameters.pageIndex,
              pageSize: manualUploadParameters.pageSize,
              pointName: manualUploadParameters.pointName,
              PollutantType: manualUploadParameters.PollutantType,
          }
     
          const result = yield call(GetManualSupplementList, body);
          if (result.data !== null) {
              if (result.data.length !== 0) {
                  //根据MN号码获取所对应的污染物信息
                  if (body.DGIMN) {
                      yield put({
                          type: 'GetPollutantByPoint',
                          payload: {
                              DGIMN: body.DGIMN
                          }
                      });
                  }
                
                  yield update({
                      uploaddatalist: result.data,
                      reason: result.reason,
                      total: result.total,
                  });
              }
              else {
                  
                  yield update({
                      uploaddatalist: null,
                      reason: result.reason,
                      total: result.total,
                  });
              }
          }
          else {
              yield update({
                  uploaddatalist: null,
                  reason: result.reason,
                  total: result.total,
              });
          }
      },
      //获取Excel模板
      * getUploadTemplate({
          payload
      }, {
          call,
          update,
      }) {
          console.log(payload);
          const result = yield call(getUploadTemplate, payload);
          if (result.data !== null) {
              if (result.data.length !== 0) {
                  yield update({
                      reason: result.reason,
                  });
              }
          }
          payload.callback(result.data);
      },

      //获取污染物类型列表
      * GetAllPollutantTypes({
          payload
      }, {
          call,
          update,
      }) {
          const result = yield call(GetAllPollutantTypes, payload);
          if (result.data !== null) {
              yield update({
                  PollutantTypesList: result.data,
                  reason: result.reason
              });
          }
          else {
              yield update({
                  PollutantTypesList: null,
                  reason: result.reason
              });
          }
      },

      //添加手工上传数据
      * AddUploadFiles({
          payload,

      }, {
          call,
          update,
      }) {
          const result = yield call(AddUploadFiles, payload);
          if (result.requstresult === "1") {
              yield update({
                  requstresult: result.requstresult,
              });
          }
          else {
              yield update({
                  requstresult: result.requstresult,
              });
          }
          payload.callback(result.reason);
      },

      //根据污染物获取单位
      * GetUnitByPollutant({
          payload
      }, {
          call,
          update,
      }) {
          const result = yield call(GetUnitByPollutant, payload);
          if (result.requstresult === "1") {
              yield update({
                  unit: result.data,
                  reason: result.reason
              });
          }
          else {
              yield update({
                  unit: null,
                  reason: result.reason
              });
          }
      },

      //根据MN号码 污染物编号 时间删除数据
      * DeleteUploadFiles({
          payload
      }, {
          call,
          update,
      }) {
          const result = yield call(DeleteUploadFiles, payload);
          if (result.requstresult === "1") {
              yield update({
                  requstresult: result.requstresult,
                  reason: result.reason
              });
          }
          else {
              yield update({
                  requstresult: result.requstresult,
                  reason: result.reason
              });
          }
          payload.callback(result.reason);
      },

      //修改数据，值修改监测值
      * UpdateManualSupplementData({
          payload
      }, {
          call,
          update,
      }) {
          const result = yield call(UpdateManualSupplementData, payload);
          if (result.requstresult === "1") {
              yield update({
                  requstresult: result.requstresult,
                  reason: result.reason
              });
          }
          else {
              yield update({
                  requstresult: result.requstresult,
                  reason: result.reason
              });
          }
          payload.callback(result.reason);
      },
  },
});
