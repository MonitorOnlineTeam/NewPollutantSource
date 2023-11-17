/*
 * @Description: 运维工单统计-空气站
 * @LastEditors: hxf
 * @Date: 2020-10-27 16:38:28
 * @LastEditTime: 2020-11-10 17:47:38
 * @FilePath: /NewPollutantSource/src/models/airWorkOrderModel.js
 */
import Model from '@/utils/model';
import * as services from '@/services/airWorkOrderApi';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
    namespace: 'airWorkOrderStatistics',
    state: {
        pointTitle: [], // 排口（企业） 运维工单统计 表头
        pointTaskStatic: [], // 排口（企业） 运维工单统计 数据
        enterpriseTitle: [], // 企业 运维工单统计 表头
        enterpriseTaskStatic: [], // 企业 运维工单统计 数据
        regionTitle: [], // 区域 运维工单统计 表头
        regionTaskStatic: [], // 区域 运维工单统计 数据
        taskStaticTitle: [], // 运维工单统计 表头
        taskStatic: [], // 运维工单统计 数据
        beginTime: moment()
            .subtract(30, 'days')
            .hour(0)
            .minute(0)
            .second(0),
        endTime: moment()
            .hour(23)
            .minute(59)
            .second(59),
        RegionCode: undefined,
    },
    effects: {
        // 获取关注列表
        *getAttentionDegreeList({ payload }, { call, put, update, select }) {
            //   const response = yield call(services.getAttentionDegreeList, { ...payload });
            //   if (response.IsSuccess) {
            //     yield update({
            //       attentionList: response.Datas,
            //     });
            //   } else {
            //     message.error(response.Message);
            //   }
        },
        // 获取运维工单统计 表头
        *getTaskStaticTitle({ payload }, { call, put, update, select }) {
            const response = yield call(services.GetTaskStaticTitle, { ...payload });
            if (response.IsSuccess) {
                yield update({
                    taskStaticTitle: response.Datas,
                });
            } else {
                message.error(response.Message);
            }
        },
        // 获取运维工单统计 数据
        *getTaskStatic({ payload }, { call, put, update, select }) {
            const response = yield call(services.GetTaskStatic, { ...payload });
            if (payload.RegionCode != '' &&response.Datas&&response.Datas.length > 0) {
                response.Datas[response.Datas.length - 1]['00_RegionCode'] = payload.RegionCode;
            }
          
            if (response.IsSuccess) {
                yield update({
                    taskStatic: response.Datas,
                });
            } else {
                message.error(response.Message);
            }
        },
        // 区域 运维工单统计 表头    行政区运维工单统计标题栏
        *getTaskStatic4RegionTitle({ payload }, { call, put, update, select }) {
            const response = yield call(services.GetTaskStatic4RegionTitle, { ...payload });
            if (response.IsSuccess) {
                yield update({
                    regionTitle: response.Datas,
                });
            } else {
                message.error(response.Message);
            }
        },
        // 区域 运维工单统计 数据    运维行政区工单统计
        *getTaskStatic4Region({ payload }, { call, put, update, select }) {
            const response = yield call(services.GetTaskStatic4Region, { ...payload });
            if (response.IsSuccess) {
                yield update({
                    regionTaskStatic: response.Datas,
                });
            } else {
                message.error(response.Message);
            }
        },
        // 企业 运维工单统计 表头    运维企业工单统计标题栏
        *getTaskStatic4EnterpriseTitle({ payload }, { call, put, update, select }) {
            const response = yield call(services.GetTaskStatic4EnterpriseTitle, { ...payload });
            if (response.IsSuccess) {
                yield update({
                    enterpriseTitle: response.Datas,
                });
            } else {
                message.error(response.Message);
            }
        },
        // 企业 运维工单统计 数据    运维企业工单统计
        *getTaskStatic4Enterprise({ payload }, { call, put, update, select }) {
            const response = yield call(services.GetTaskStatic4Enterprise, { ...payload });
            if (response.IsSuccess) {
                yield update({
                    enterpriseTaskStatic: response.Datas,
                });
            } else {
                message.error(response.Message);
            }
        },
        // 排口（企业） 运维工单统计 表头    运维排口工单统计标题栏
        *getTaskStatic4PointTitle({ payload }, { call, put, update, select }) {
            const response = yield call(services.GetTaskStatic4PointTitle, { ...payload });
            if (response.IsSuccess) {
                yield update({
                    pointTitle: response.Datas,
                });
            } else {
                message.error(response.Message);
            }
        },
        // 排口（企业） 运维工单统计 数据    运维企业工单统计
        *getTaskStatic4Point({ payload, callback = () => { } }, { call, put, update, select }) {
            console.log('callback = ', callback);
            const response = yield call(services.GetTaskStatic4Point, { ...payload });
            if (response.IsSuccess) {
                yield update({
                    pointTaskStatic: response.Datas,
                });
                callback();
            } else {
                message.error(response.Message);
            }
        },
    },
});
