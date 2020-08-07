//行政区划/部門
import { message } from 'antd';
import { Children } from 'react';
import {
  GetRegions,
  GetXuRegions,
  GetDepartmentTree,
  GetAllDepartmentTree,
  GetEntRegion,
} from '../services/regionapi';
import Model from '@/utils/model';
import { EnumRequstResult } from '../utils/enum';

export default Model.extend({
  namespace: 'region',
  state: {
    RegionList: null, //行政区划
    dptList: [], //部门
    ALLdptList: [], //所有部门
    RegionArr: [],
    // defaultValue:[],
    enterpriseList: [], // 企业列表
    userRegionList: [], //人员行政区
  },

  effects: {
    // 行政区划
    *GetXuRegions({ payload }, { call, update }) {
      const DataInfo = yield call(GetXuRegions, payload);
      if (DataInfo !== null && DataInfo.requstresult == EnumRequstResult.Success) {
        yield update({ RegionList: DataInfo.data });
      } else {
        yield update({ RegionList: [] });
      }
    },
    // 行政区划
    *GetRegions({ payload }, { call, update }) {
      const DataInfo = yield call(GetRegions, payload);
      if (DataInfo !== null && DataInfo.requstresult === '1') {
        yield update({
          RegionArr: DataInfo.data,
        });
      } else {
        yield update({
          RegionArr: [],
        });
      }
    },
    // 部门
    *GetDepartmentTree({ payload }, { call, update, select }) {
      const DataInfo = yield call(GetDepartmentTree, payload);
      if (DataInfo !== null && DataInfo.requstresult == EnumRequstResult.Success) {
        yield update({ dptList: DataInfo.data });
      }
    },

    // 所有部门
    *GetAllDepartmentTree({ payload }, { call, update, select }) {
      const DataInfo = yield call(GetAllDepartmentTree, payload);
      if (DataInfo !== null && DataInfo.requstresult == EnumRequstResult.Success) {
        yield update({ ALLdptList: DataInfo.data });
      }
    },

    // 企业
    *GetEntRegion({ payload }, { call, update, select }) {
      const DataInfo = yield call(GetEntRegion, payload);
      if (DataInfo !== null && DataInfo.requstresult == EnumRequstResult.Success) {
        yield update({ enterpriseList: DataInfo.data });
      }
    },
    // 获取人员行政区
    *GetUserRegionList({}, { call, update }) {
      const result = yield call(GetUserRegionList, {});
      if (result.requstresult == 1) {
        yield update({
          userRegionList: result.data,
        });
      }
    },
  },
});
