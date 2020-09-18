import { message } from 'antd';
import * as services from '../services/components';
import Model from '@/utils/model';
import _ from 'lodash'

export default Model.extend({
  namespace: 'components',
  state: {
    treeRegionData: [],
    treeIndustryData: [],
    selectTreeItem: {},
    statusList: [
      { text: "正常", checked: false, color: "success", value: 1, count: 0, className: "green" },
      { text: "离线", checked: false, color: "default", value: "0", count: 0, className: "default" },
      { text: "超标", checked: false, color: "error", value: 2, count: 0, className: "red" },
      { text: "异常", checked: false, color: "warning", value: 3, count: 0, className: "orange" },
      { text: "备案不符", checked: false, color: "orange", value: 5, count: 0, className: "volcano" },
      { text: "监测不合格", checked: false, color: "gold", value: 4, count: 0, className: "magenta" },
    ],
    // 站点详情
    siteData: {},
    pointInstrumentList: [],
    pollutantByDgimnList: [],
  },
  effects: {
    // 获取导航树 - 数据
    * getTreeData({ payload, requestType }, { call, update, put, select }) {
      let state = yield select(state => state.components)
      const result = yield call(services.getTreeNodeData, payload);
      if (result.IsSuccess) {
        let status = {};
        if (requestType === "did") {
          const { ExceptLine, NoKeepRecord, OffLine, OnLine, OverLine, Unqualified } = result.Datas.numList;
          let statusList = [
            { text: "正常", checked: false, color: "success", value: 1, count: OnLine, className: "green" },
            { text: "离线", checked: false, color: "default", value: "0", count: OffLine, className: "default" },
            { text: "超标", checked: false, color: "error", value: 2, count: ExceptLine, className: "red" },
            { text: "异常", checked: false, color: "warning", value: 3, count: OverLine, className: "orange" },
            { text: "备案不符", checked: false, color: "orange", value: 5, count: NoKeepRecord, className: "volcano" },
            { text: "监测不合格", checked: false, color: "gold", value: 4, count: Unqualified, className: "magenta" },
          ];
          status.statusList = statusList;
        }

        yield update({
          ...status,
          treeRegionData: result.Datas.regionData,
          treeIndustryData: result.Datas.induData,
          selectTreeItem: state.selectTreeItem.value ? { ...state.selectTreeItem } : result.Datas.firstData,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取站点详情
    *getSiteInfo({ payload }, { call, update, put, select }) {
      const result = yield call(services.getSiteInfo, payload);
      if (result.IsSuccess) {
        yield update({
          siteData: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取仪器信息table数据
    *getPointInstrument({ payload }, { call, put, update, select }) {
      const result = yield call(services.getPointInstrument, payload);
      if (result.IsSuccess) {
        yield update({ pointInstrumentList: result.Datas })
      } else {
        message.error(result.Message);
      }
    },
    // 获取污染物信息
    *getPollutantByDgimn({ payload }, { call, put, update, select }) {
      const result = yield call(services.getPollutantByDgimn, payload);
      if (result.IsSuccess) {
        yield update({ pollutantByDgimnList: result.Datas })
      } else {
        message.error(result.Message);
      }
    },
  },
});
