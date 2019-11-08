/*
 * @Create: Jiaqi 
 * @Date: 2019-11-07 10:53:38 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-08 14:34:33
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
      }
    },
    // 获取标气
    *getStandardGas({ payload }, { call, put, update }) {
      const result = yield call(services.getStandardGas, payload);
      if (result.IsSuccess) {
        yield update({
          standardGasList: result.Datas
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
  },
});
