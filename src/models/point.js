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
import MonitoringStandard from '@/components/MonitoringStandard';
import { deletePoints, addPoint, updatePoint, GetComponent, GetMainInstrumentName, GetChildCems, AddAnalyzer, GetAnalyzerListByDGIMN, factoryTest, getEnterpriseCorporationCode,UpdatePointDGIMN } from '@/services/pointApi';
import { sdlMessage } from '@/utils/utils';

export default Model.extend({
    namespace: 'point',
    state: {
        pollutantType: 'all',
        pointDataWhere: [],
        pollutantTypelist: [],
        isEdit: false,
        TestComponent: [], // 测试项目
        MainInstrumentName: [], // 主要仪器名称
        CemsList: [], //
        CorporationCode: null,
    },
    effects: {

        // 获取监测点数据集合
        *getPointList({ payload }, { call, put, update, select, take }) {
            const dd1 = yield select(state => state.common);
            yield take('common/getPollutantTypeList/@@end');
            const dd = yield select(state => state.common);
            const result = yield call(getEnterpriseCorporationCode, payload);
            yield update({
                CorporationCode: result.Datas,
            })
            payload.callback(dd.defaultPollutantCode);
        },
        *factoryTest({ payload }, { call, put, update, select, take }) {
            const result = yield call(factoryTest, { DGIMN: payload.DGIMN });
            if (!result.IsSuccess) {
                sdlMessage(result.Message, 'error');
            }
            payload.callback(result.IsSuccess);
        },
        *addPoint({ payload }, { call, put, update, select }) {
            // ;

            // let result = yield call(services.postAutoFromDataAdd, {
            //     ...payload,
            //     FormData: JSON.stringify(payload.FormData),
            // });
            const result = yield call(addPoint, payload.FormData);

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

            const result = yield call(updatePoint, payload.FormData);

            if (result.IsSuccess) {
                sdlMessage('操作成功！', 'success');
            } else {
                sdlMessage(result.Message, 'error');
            }
            payload.callback(result);
        },
        *delPoint({ payload }, { call, put, update, select }) {
            const result = yield call(deletePoints, [payload.DGIMN]);
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
        /** 获取测试项目 */
        *GetComponent({ payload }, { call, put, update, select }) {
            const result = yield call(GetComponent, payload);
            if (result.IsSuccess) {
                yield update({
                    TestComponent: result.Datas,
                });
            } else {
                sdlMessage(result.Message, 'error');
            }
        },
        /** 获取主要仪器名称 */
        *GetMainInstrumentName({ payload }, { call, put, update, select }) {
            const result = yield call(GetMainInstrumentName, payload);
            if (result.IsSuccess) {
                yield update({
                    MainInstrumentName: result.Datas,
                });
            } else {
                sdlMessage(result.Message, 'error');
            }
        },
        /** 获取CEMS监测子系统信息 */
        *GetChildCems({ payload }, { call, put, update, select }) {
            const result = yield call(GetChildCems, payload);
            if (result.IsSuccess) {
                yield update({
                    CemsList: result.Datas,
                });
            } else {
                sdlMessage(result.Message, 'error');
            }
        },
        /** 添加Cem */
        *AddAnalyzer({ payload }, { call, put, update, select }) {
            const result = yield call(AddAnalyzer, payload);
            if (result.IsSuccess) {
                sdlMessage('添加成功', 'success');
            } else {
                sdlMessage(result.Message, 'error');
            }
        },
        /** 获取Cem列表 */
        *GetAnalyzerListByDGIMN({ payload }, { call, put, update, select }) {
            const result = yield call(GetAnalyzerListByDGIMN, payload);
            let qualityControlTableData = [];
            if (result.Datas) {
                qualityControlTableData = result.Datas.map((item, index) => {
                    let Component = [];
                    Component = item.Component.map((itm, idx) => ({
                        ...itm,
                        key: `${index}${idx}`,
                    }))
                    return {
                        ...item,
                        key: index,
                        Component: [
                            ...Component,
                        ],
                    }
                })
                yield update({
                    qualityControlTableData,
                })
            } else {
                sdlMessage(result.Message, 'error');
            }
        },
        //更新dgimn号
        *updatePointDGIMN({callback, payload }, { call, put, update, select }) {
            const result = yield call(UpdatePointDGIMN, payload);
            if (result.IsSuccess) {
                sdlMessage('修改成功', 'success');
                callback();
            } else {
                sdlMessage(result.Message, 'error');
            }
        }
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
