/*
 * @Create: Jiaqi 
 * @Date: 2019-11-07 10:53:38 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-19 14:47:36
 * @desc: 智能质控model
 */

import moment from 'moment';
import * as services from './service';
import { getentandpoint } from "@/services/baseTreeApi";
import Model from '@/utils/model';
import { router } from 'umi'
import { message } from 'antd';
// import { EnumRequstResult } from '../utils/enum';

export default Model.extend({
  namespace: 'qualityControl',
  state: {
    entAndPointList: [],
    standardGasList: [],
    qualityControlFormData: {},
    qualityControlTableData: [],
    CEMSList: [],
    autoQCAInfo: [],
    entRate: {
      allResult: 0,
      noAllResult: 0,
      entName: [],
      entResult: [],
    },
    entStaticDataList: [],
    resultContrastData: {
      valueList: [],
      timeList: [],
      tableData: [],
      standValue: 0,
      errorStr: undefined,
    },
    resultContrastTimeList: [],
    paramsRecordForm: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  },

  effects: {
    // 获取企业及排口
    *getEntAndPointList({ payload }, { call, update, select }) {
      let postData = {
        RunState: "",
        Status: [0, 1, 2, 3]
      }
      let global = yield select(state => state.global);
      if (!global.configInfo) {
        yield take('global/getSystemConfigInfo/@@end');
        global = yield select(state => state.global);
        postData.PollutantTypes = global.configInfo.SystemPollutantType
      } else {
        postData.PollutantTypes = global.configInfo.SystemPollutantType
      }

      const result = yield call(getentandpoint, postData);
      if (result.IsSuccess) {
        yield update({
          entAndPointList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取标气
    *getStandardGas({ payload }, { call, put, update }) {
      const result = yield call(services.getStandardGas, payload);
      if (result.IsSuccess) {
        yield update({
          // standardGasList: result.Datas
          standardGasList: [
            ...result.Datas,
            {
              PollutantCode: "n2",
              PollutantName: "氮气"
            }
          ]
        })
      }
    },
    // 添加质控仪
    *addQualityControl({ payload }, { call, put }) {
      const result = yield call(services.addQualityControl, payload);
      if (result.IsSuccess) {
        router.push("/qualityControl/instrumentManage")
        message.success("添加成功！")
      } else {
        message.error(result.Message)
      }
    },
    // 获取质控仪数据
    *getQualityControlData({ payload }, { call, put, update }) {
      const result = yield call(services.getQualityControlData, payload);
      if (result.IsSuccess) {
        let qualityControlTableData = [];
        if (result.Datas.Relation) {
          qualityControlTableData = result.Datas.Relation.map((item, index) => {
            let Component = [];
            Component = item.Component.map((itm, idx) => {
              return {
                ...itm,
                key: `${index}${idx}`
              }
            })
            return {
              ...item,
              DGIMNArr: item.DGIMN.split("/"),
              key: index,
              Component: [
                ...Component
              ]
            }
          })
        }
        console.log("qualityControlTableData=", qualityControlTableData)
        yield update({
          qualityControlFormData: result.Datas.Info,
          qualityControlTableData: qualityControlTableData,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取CEMS列表
    *getCEMSList({ payload }, { call, put, update }) {
      const result = yield call(services.getCEMSList, payload);
      if (result.IsSuccess) {
        yield update({
          CEMSList: [
            ...result.Datas,
            // {
            //   DGIMN: "test1",
            //   PointName: "test1",
            //   MNHall: "test1",
            // }, {
            //   DGIMN: "test2",
            //   PointName: "test2",
            //   MNHall: "test2",
            // },
          ]
        })
      }
    },
    // 发送质控命令 
    * SendQCACmd({ payload }, { call, put, update }) {
      const result = yield call(services.SendQCACmd, payload);
      if (result.IsSuccess) {
        message.success("操作成功")
      } else {
        message.error(result.Message)
      }
    },
    // 获取自动质控信息 
    * getAutoQCAInfo({ payload }, { call, put, update }) {
      const result = yield call(services.getAutoQCAInfo, payload);
      if (result.IsSuccess) {
        yield update({
          autoQCAInfo: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 取消自动质控计划 
    * cancelPlan({ payload }, { call, put, update }) {
      const result = yield call(services.cancelPlan, payload);
      if (result.IsSuccess) {
        message.success("取消成功");
        yield put({
          type: "qualityControl/getAutoQCAInfo",
          payload: {
            qcamn: payload.QCAMN
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取企业达标率 
    * QCAResultStatic({ payload }, { call, put, update }) {
      const result = yield call(services.QCAResultStatic, payload);
      if (result.IsSuccess) {
        let entResult = result.Datas.entResult;
        entResult.map((item, index) => {
          entResult[index] = item * 100;
        })
        yield update({
          entRate: {
            ...result.Datas,
            entResult: entResult
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取单个企业统计数据 
    * QCAResultStaticByEntCode({ payload }, { call, put, update }) {
      const result = yield call(services.QCAResultStaticByEntCode, payload);
      if (result.IsSuccess) {
        yield update({
          // entRate: result.Datas
          entStaticDataList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取结果比对数据 
    * QCAResultCheckByDGIMN({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.QCAResultCheckByDGIMN, payload);
      if (result.IsSuccess) {
        if (otherParams.isSearch) {
          message.success("结果比对完成！")
        }
        yield update({
          resultContrastData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取结果比对时间下拉列表 
    * QCAResultCheckSelectList({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.QCAResultCheckSelectList, payload);
      if (result.IsSuccess) {
        yield update({
          resultContrastTimeList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
  },
});
