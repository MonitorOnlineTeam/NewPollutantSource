import moment from 'moment';
import * as services from '../services/remoteSupervision';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';
import { ConsoleSqlOutlined } from '@ant-design/icons';

export default Model.extend({
  namespace: 'remoteSupervision',
  state: {
    entList: [],
    tableData: [],
    tableTotal: null,
    tableLoading:false,
    consistencyCheckDetail: [],
    addDataConsistencyData: [],
    addRealTimeData: [],
    addParconsistencyData: [],
    getPointConsistencyParamLoading: false,
    remoteInspectorPointList: [],
    remoteInspectorPointTotal:0,
    forwardTableData:[],
    forwardTableTotal:0,
    forwardTableLoading:false,
    regQueryPar:null,
  },
  effects: {
    // 根据企业获取排口
    *getPointByEntCode({ payload, callback }, { call, update }) {
      const result = yield call(services.getPointByEntCode, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      }
    },
    //列表
    *getRemoteInspectorList({ payload,callback }, { call, update, select, put }) {
      payload.isForward? yield update({ forwardTableLoading: true }) : yield update({ tableLoading: true });
      const result = yield call(services.GetRemoteInspectorList, { ...payload });
      if (result.IsSuccess) {
        payload.isForward? yield update({ forwardTableData: result.Datas, forwardTableTotal: result.Total,forwardTableLoading: false }) : yield update({ tableData: result.Datas, tableTotal: result.Total,tableLoading:false,regQueryPar:payload });
      } else {
        payload.isForward? yield update({ forwardTableLoading: false }) : yield update({ tableLoading: false });
        message.error(result.Message)
      }
    },
    //导出
    *exportRemoteInspectorList({ payload, }, { call, update, select, put }) {
      const result = yield call(services.ExportRemoteInspectorList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
    //获取数据 添加参数列表
    *getPointConsistencyParam({ payload, callback }, { call, update, select, put }) {
      yield update({ getPointConsistencyParamLoading: true });
      const result = yield call(services.GetPointConsistencyParam, { ...payload });
      if (result.IsSuccess) {
        let pollutantList = [], addRealTimeList = [], paramList = [];
        let resultPollList = result.Datas.pollutantList, resultParList = result.Datas.paramList;
        let kArr = [];
        if (resultPollList && resultPollList[0]) {

          resultPollList.map((item, index) => {
            if (item.Name === '颗粒物' || item.Name === '流速') {
              if (item.Name === '颗粒物') { //不push 只添加   达到替换的目的
                pollutantList.splice(index, 0, { ...item, isDisplay: 1, par: item.ChildID }, { ...item, isDisplay: 2, par: item.ChildID + 'a', })
                addRealTimeList.splice(index, 0, { ...item, concentrationType: '原始浓度', par: item.ChildID + 'c', }, { ...item, concentrationType: '标杆浓度', par: item.ChildID + 'd', })
              } else { //流速
                pollutantList.splice(index + 1, 0, { ...item, isDisplay: 3, par: item.ChildID }, { ...item, isDisplay: 4, par: item.ChildID + 'b' })
                addRealTimeList.splice(index + 1, 0, { ...item, par: item.ChildID }) //不变    
              }
            } else {
              pollutantList.push({ ...item, par: item.ChildID })
              addRealTimeList.push({ ...item, par: item.ChildID })
            }
          })
        }
        if (resultParList && resultParList[0]) {
          resultParList.map((item, index) => {
            paramList.push({ ...item, par: item.ChildID })

          })
        }
        yield update({
          addDataConsistencyData: pollutantList, addRealTimeData: addRealTimeList,
          addParconsistencyData: paramList
        });
        yield update({ getPointConsistencyParamLoading: false });
        callback(pollutantList, addRealTimeList, paramList, result.Datas && result.Datas.operationName || null)
      } else {
        yield update({ addDataConsistencyData: [], addParconsistencyData: [], addRealTimeData: [], });
        callback([], [], [], null)
        message.error(result.Message)
      }
    },
    //获取量程数据一致性详情
    *getConsistencyCheckInfo({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetConsistencyCheckInfo, { ...payload });
      if (result.IsSuccess) {
        yield update({ consistencyCheckDetail: result.Datas });
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //添加或修改数据一致性核查
    *addOrUpdConsistencyCheck({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.AddOrUpdConsistencyCheck, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
      } else {
        message.error(result.Message)
      }
      callback(result.Datas)
    },
    //添加或修改数据一致性核查
    *addOrUpdParamCheck({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.AddOrUpdParamCheck, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

    //获取NOx数采仪实时数据
    *getNoxValue({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetNoxValue, { ...payload });
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },


    //量程一致性检查 自动判断
    *judgeConsistencyRangeCheck({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.JudgeConsistencyRangeCheck, { ...payload });
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //数据一致性检查 自动判断
    *judgeConsistencyCouCheck({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.JudgeConsistencyCouCheck, { ...payload });
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //参数一致性检查 自动判断
    *judgeParamCheck({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.JudgeParamCheck, { ...payload });
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //删除
    *deleteRemoteInspector({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.DeleteRemoteInspector, { ...payload });
      if (result.IsSuccess) {
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //下发
    *issueRemoteInspector({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.IssueRemoteInspector, { ...payload });
      if (result.IsSuccess) {
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //关键参数核查 保存 新
    *addRemoteInspector({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.AddRemoteInspector, { ...payload });
      callback(result.IsSuccess)
      if (result.IsSuccess) {
        message.success(result.Message)
      } else {
        message.error(result.Message)
      }
    },
    //关键参数核查 可申请工单站点
    *getRemoteInspectorPointList({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetRemoteInspectorPointList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          remoteInspectorPointList: result.Datas,
          remoteInspectorPointTotal:result.Total,
        });
      } else {
        message.error(result.Message)
      }
    },
    //关键参数核查 手工申请工单
    *addRemoteInspectorPoint({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.AddRemoteInspectorPoint, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback&&callback()
      } else {
        message.error(result.Message)
      }
    },
    //关键参数核查 转发工单
    *forwardRemoteInspector({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.ForwardRemoteInspector, { ...payload });
      if (result.IsSuccess) {
        callback()
      } else {
        message.error(result.Message)
      }
    },
  }

})