/*
 * @Author: wjw
 * @Date: 2019年7月29日16:59:00
 * @Last Modified by: wjw
 * @Last Modified time: 2019年7月29日16:59:10
 */
import { message } from 'antd';
import Model from '@/utils/model';
import * as services from '@/services/autoformapi';
import { getPollutantTypeList } from '@/services/baseapi';
import { deletePoints, addPoint, updatePoint } from '@/services/pointApi';
import { sdlMessage } from '@/utils/utils';

export default Model.extend({
    namespace: 'point',
    state: {
        pollutantType: 'all',
        pointDataWhere: [],
        pollutantTypelist: [],
        isEdit: false,
    },
    effects: {
        // 获取监测点数据集合
        *getPointList({ payload }, { call, put, update, select, take }) {

            const dd1 = yield select(state => state.common);
            yield take('common/getPollutantTypeList/@@end');
            const dd = yield select(state => state.common);
            payload.callback(dd.defaultPollutantCode);
        },
        *addPoint({ payload }, { call, put, update, select }) {
            // ;
            console.log("payload=", payload);

            // let result = yield call(services.postAutoFromDataAdd, {
            //     ...payload,
            //     FormData: JSON.stringify(payload.FormData),
            // });
            let result = yield call(addPoint, payload.FormData);

            if (result.IsSuccess) {
                sdlMessage('操作成功！', 'success');
            } else {
                sdlMessage(result.Message, 'error');
            }
            payload.callback(result);
        },
        *editPoint({ payload }, { call, put, update, select }) {
            // ;
            // let result = yield call(services.postAutoFromDataUpdate, {
            //     ...payload,
            //     FormData: JSON.stringify(payload.FormData),
            // });

            let result = yield call(updatePoint, payload.FormData);

            if (result.IsSuccess) {
                sdlMessage('操作成功！', 'success');
            } else {
                sdlMessage(result.Message, 'error');
            }
            payload.callback(result);
        },
        *delPoint({ payload }, { call, put, update, select }) {

            let result = yield call(deletePoints, [payload.DGIMN]);
            if (result.IsSuccess) {
                sdlMessage('操作成功！', 'success');
                payload.callback(result);
            } else {
                sdlMessage('操作失败！', 'error');
            }

            // let pointParam = {
            //     'dbo.T_Bas_CommonPoint.PointCode': payload.PointCode,
            // };

            // let result = yield call(services.postAutoFromDataDelete, {
            //     configId: payload.configId,
            //     FormData: JSON.stringify(pointParam),
            // });

            // if (result.IsSuccess) {
            //     let pointRelParam = {
            //         'dbo.T_Cod_MonitorPointBase.DGIMN': payload.DGIMN,
            //         'dbo.T_Cod_MonitorPointBase.BaseCode': payload.targetId,
            //         'dbo.T_Cod_MonitorPointBase.BaseType': payload.pollutantType,
            //     };
            //     result = yield call(services.postAutoFromDataDelete, {
            //         configId: 'monitorpoint',
            //         FormData: JSON.stringify(pointRelParam),
            //     });
            //     if (result.IsSuccess) {
            //         sdlMessage('操作成功！', 'success');
            //     } else {
            //         sdlMessage(result.Message, 'error');
            //     }
            // } else {
            //     sdlMessage(result.Message, 'error');
            // }

            // payload.callback(result);
        },
    },
    reducers: {
        // 保存搜索框数据
        saveConfigIdList(state, action) {
            return {
                ...state,
                configIdList: {
                    ...state.configIdList,
                    ...action.payload,
                },
            };
        },
    },
});
