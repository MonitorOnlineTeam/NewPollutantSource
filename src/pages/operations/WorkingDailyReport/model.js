/*
 * @Author: Jiaqi
 * @Date: 2019-04-24 17:34:46
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-05-23 15:00:39
 */
import React from 'react';
import moment from 'moment';
import { Icon, message } from 'antd';
import Model from '@/utils/model';
import * as services from './services';

export default Model.extend({
  namespace: 'statisticsmodel',
  state: {
    baseReportList: {
      data: [],
      column: [],
    },
    baseReportSearchForm: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    equipmentCoffList: [], // 设备系数
    equipmentTypeList: [], // 设备分类
    projectProvince: [], // 项目省区
    exportColumn: [], // 可导出列
    provinceReportList: [], // 省区运营数据
    personalHoursList: [], // 个人工时列表数据
    enterpriseList: [], // 设备所在单位
    itemsByProvinceList: [], // 根据省区获取项目列表
    enterpriseByProjectList: [], // 根据项目获取企业及监测点
    equipmentByPointList: [], // 根据监测点获取设备信息
    //个人工时统计参数
    personalHoursListParameters: {
      StartTime: '',
      EndTime: '',
      Name: '',
      Number: '',
      Depart: '',
      Month: '',
      RegionId: '',
    },
  },
  effects: {
    // 获取基础数据报表
    *queryBaseReportList({ payload }, { call, update, select, put }) {
      if (payload) {
        yield put({
          type: 'saveSearchForm',
          payload,
        });
      }
      let baseReportSearchForm = yield select(state => state.statisticsmodel.baseReportSearchForm);
      let postData = {
        ...payload,
      };
      const result = yield call(services.getBaseReportList, postData);
      if (result.requstresult === '1') {
        yield update({
          baseReportList: result.data,
          baseReportSearchForm: {
            ...baseReportSearchForm,
            total: result.total,
          },
        });
      }
    },
    // 统计
    *baseReportStatistical({ payload }, { call, update, put, take }) {
      const result = yield call(services.baseReportStatistics, { ...payload.params });
      if (result.requstresult === '1') {
        message.success('统计成功！');
        payload.callback();
        yield put({
          type: 'queryBaseReportList',
          payload: payload.formParams,
        });
        yield take('queryBaseReportList/@@end');
      } else {
        message.error('统计失败！');
      }
    },
    // 导出基础报表
    *exportBaseReport({ payload }, { call, update, select }) {
      // let baseReportSearchForm = yield select(state => state.statistics.baseReportSearchForm);
      let postData = {
        ...payload.formParams,
        ExportField: payload.checkedList,
        Month: payload.month,
      };
      const result = yield call(services.exportBaseReport, postData);
      if (result && result.requstresult === '1') {
        payload.callback();
        result.reason && window.open(result.reason);
      } else {
        message.error(result.reason);
      }
    },
    // 获取可导出列
    *getExportColumn({ payload }, { call, update }) {
      const result = yield call(services.getExcelField, payload);
      if (result && result.requstresult === '1') {
        yield update({
          exportColumn: result.data,
        });
      }
    },
    // 获取项目省区
    *getProjectProvince({ payload }, { call, update }) {
      const result = yield call(services.getProjectProvince, payload);
      if (result.requstresult === '1') {
        yield update({
          projectProvince: result.data,
        });
      }
    },
    // 获取设备分类
    *getEquipmentTypeList({ payload }, { call, update }) {
      const result = yield call(services.getEquipmentTypeList, payload);
      if (result.requstresult === '1') {
        yield update({
          equipmentTypeList: result.data,
        });
      }
    },
    // 获取设备类别系数
    *getEquipmentCoffList({ payload }, { call, update }) {
      const result = yield call(services.getEquipmentCoffList, payload);
      if (result.requstresult === '1') {
        yield update({
          equipmentCoffList: result.data,
        });
      }
    },
    // 获取省区运营数据
    *getProvinceReportList({ payload }, { call, update }) {
      const result = yield call(services.getProvinceReportList, payload);
      if (result.requstresult === '1') {
        yield update({
          provinceReportList: result.data,
        });
      }
    },
    // 获取设备所在单位名称
    *getEnterpriseList({ payload }, { call, update }) {
      const result = yield call(services.getEnterpriseList, payload);
      if (result.requstresult === '1') {
        yield update({
          enterpriseList: result.data,
        });
      }
    },
    // 导出省区运营数据
    *exportProvinceReport({ payload }, { call, update }) {
      const result = yield call(services.exportProvinceReport, payload);
      if (result.requstresult === '1') {
        result.reason && window.open(result.reason);
      } else {
        message.error(result.reason);
      }
    },
    // 获取个人工时数据
    *getPersonalHoursList({ payload }, { call, update, select }) {
      const { personalHoursListParameters } = yield select(a => a.statisticsmodel);
      const result = yield call(services.getPersonalHoursList, personalHoursListParameters);
      if (result.requstresult === '1') {
        yield update({
          personalHoursList: result.data,
        });
      }
    },
    // 导出个人工时报表
    *exportPersonalHoursReport({ payload }, { call, update, select }) {
      const { personalHoursListParameters } = yield select(a => a.statisticsmodel);
      const result = yield call(services.exportPersonalHoursReport, personalHoursListParameters);
      if (result.requstresult === '1') {
        result.reason && window.open(result.reason);
      } else {
        message.error(result.reason);
      }
    },
    // 保存用户选择字段
    *saveFieldForUser({ payload }, { call, put, take }) {
      const result = yield call(services.saveFieldForUser, { Field: payload.checkedList });
      if (result.requstresult === '1') {
        message.success('保存成功！');
        payload.callback();
        yield put({
          type: 'queryBaseReportList',
          payload: payload.formParams,
        });
        yield take('queryBaseReportList/@@end');
      }
    },
    // 根据省区获取项目列表
    *getItemsByProvince({ payload }, { call, update }) {
      const result = yield call(services.getItemsByProvince, payload);
      if (result.requstresult === '1') {
        yield update({
          itemsByProvinceList: result.data,
        });
      }
    },
    // 根据项目获取企业及监测点
    *getEnterpriseByProject({ payload }, { call, update }) {
      const result = yield call(services.getEnterpriseByProject, payload);
      if (result.requstresult === '1') {
        yield update({
          enterpriseByProjectList: result.data,
        });
      }
    },
    // 根据监测点获取设备信息
    *getEquipmentByPoint({ payload }, { call, update }) {
      const result = yield call(services.getEquipmentByPoint, payload);
      if (result.requstresult === '1') {
        yield update({
          equipmentByPointList: result.data,
        });
      }
    },
  },
  reducers: {
    // 保存搜索框数据
    saveSearchForm(state, action) {
      return {
        ...state,
        baseReportSearchForm: {
          ...state.baseReportSearchForm,
          ...action.payload,
        },
      };
    },
  },
});
