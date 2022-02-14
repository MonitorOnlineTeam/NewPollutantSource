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
import { deletePoints, addPoint, updatePoint, GetComponent, GetMainInstrumentName, GetChildCems, AddAnalyzer, GetAnalyzerListByDGIMN, factoryTest, getEnterpriseCorporationCode,UpdatePointDGIMN,
    GetMonitorPointVerificationItem,GetMonitorPointVerificationList,AddMonitorPointVerificationItem,
    AddPointParamInfo,GetParamInfoList,GetParamCodeList,
    GetPointEquipmentInfo,AddOrUpdateEquipmentInfo,GetPointEquipmentParameters,GetMonitoringTypeList,
    GetManufacturerList,GetSystemModelList
} from '@/services/pointApi'; 
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
        pointVerificationList:[],
        paramCodeList:[],
        manufacturerList:[],//设备厂家
        monitoringTypeList:[],//监测类别
        systemModelList:[],//系统型号
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
        },
        //获取点位关联数据核查信息
        *getMonitorPointVerificationItem({callback, payload }, { call, put, update, select }) {
            const result = yield call(GetMonitorPointVerificationItem, payload);
            if (result.IsSuccess) { 
                callback(result.Datas);
            } else {
                sdlMessage(result.Message, 'error');
            }
        },  
        //获取数据核查信息码表
        *getMonitorPointVerificationList({callback, payload }, { call, put, update, select }) {
            const result = yield call(GetMonitorPointVerificationList, payload);
            if (result.IsSuccess) {
                 if(result.Datas&&result.Datas[0]){
                   const data =  result.Datas.map(item=>{
                        return  { label: item.Name, value:  item.ChildID }
                    })
                    yield update({ pointVerificationList:data  })
                 }
               
            } else {
                sdlMessage(result.Message, 'error');
            }
        },     
        //添加或者修改点位关联数据核查信息
        *addMonitorPointVerificationItem({callback, payload }, { call, put, update, select }) {
            const result = yield call(AddMonitorPointVerificationItem, payload);
            if (result.IsSuccess) {
                sdlMessage(result.Message, 'success');
            } else {
                sdlMessage(result.Message, 'error');
            }
        },   
        //设备参数项码表
        *getParamInfoList({callback, payload }, { call, put, update, select }) {
            const result = yield call(GetParamInfoList, payload);
            if (result.IsSuccess) { 
                let data = []
                if(result.Datas&&result.Datas[0]){
                    data =  result.Datas.map(item=>{
                        return item.id
                    })
                }
                callback({code:data});
            } else {
                sdlMessage(result.Message, 'error');
            }
        },  
        //获取数据核查信息码表
        *getParamCodeList({callback, payload }, { call, put, update, select }) {
            const result = yield call(GetParamCodeList, payload);
            if (result.IsSuccess) {
                 if(result.Datas&&result.Datas[0]){
                   const data =  result.Datas.map(item=>{
                        return  { label: item.Name, value:  item.ChildID }
                    })
                    yield update({ paramCodeList:data  })
                 }
               
            } else {
                sdlMessage(result.Message, 'error');
            }
        },     
        //添加设备参数项
        *addPointParamInfo({callback, payload }, { call, put, update, select }) {
            const result = yield call(AddPointParamInfo, payload);
            if (result.IsSuccess) {
                sdlMessage(result.Message, 'success');
            } else {
                sdlMessage(result.Message, 'error');
            }
        },   

        
        /*******监测点设备管理  ***** */
       *getPointEquipmentInfo({callback, payload }, { call, put, update, select }) {
                const result = yield call(GetPointEquipmentInfo, payload);
                if (result.IsSuccess) {
                    sdlMessage(result.Message, 'success');
                } else {
                    sdlMessage(result.Message, 'error');
                }
            }, 
        *addOrUpdateEquipmentInfo({callback, payload }, { call, put, update, select }) {
            const result = yield call(AddOrUpdateEquipmentInfo, payload);
            if (result.IsSuccess) {
                sdlMessage(result.Message, 'success');
            } else {
                sdlMessage(result.Message, 'error');
            }
        }, 
         *getPointEquipmentParameters({callback, payload }, { call, put, update, select }) {
            const result = yield call(GetPointEquipmentParameters, payload);
            if (result.IsSuccess) {
                sdlMessage(result.Message, 'success');
            } else {
                sdlMessage(result.Message, 'error');
            }
        },             
        *getManufacturerList({ payload,callback }, { call, put, update }) { //设备厂家列表
            const result = yield call(GetManufacturerList, payload);
            if (result.IsSuccess) {
              yield update({
                manufacturerList:result.Datas,
              })
            }else{
              message.error(result.Message)
            }
          },
        *getMonitoringTypeList({ payload,callback }, { call, put, update }) { //获取监测类别
            const result = yield call(GetMonitoringTypeList, payload);
            if (result.IsSuccess) {
              yield update({ monitoringTypeList:result.Datas})
            }else{
              message.error(result.Message)
            }
          },
        *getManufacturerList({ payload,callback }, { call, put, update }) { //获取厂商列表
            const result = yield call(GetManufacturerList, payload);
            if (result.IsSuccess) {
              yield update({ manufacturerList:result.Datas})
            }else{
              message.error(result.Message)
            }
          },
          *getSystemModelList({ payload,callback }, { call, put, update }) { //系统型号列表
            const result = yield call(GetSystemModelList, payload);
            if (result.IsSuccess) {
              yield update({
                systemModelList:result.Datas,
              })
            }else{
              message.error(result.Message)
            }
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
