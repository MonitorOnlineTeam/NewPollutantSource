/*
 * @Author: JianWei
 * @Date: 2019-6-18 16:42:23
 * @Last Modified by: JianWei
 * @Last Modified time: 2019-6-18 16:42:27
 */
import { message } from 'antd';
import Model from '@/utils/model';
import * as services from '@/services/autoformapi';
import { getPollutantTypeList } from '@/services/baseapi';
import { sdlMessage } from '@/utils/utils';

export default Model.extend({
  namespace: 'monitorTarget',
  state: {
    pollutantType: 'all',
    pointDataWhere: [],
    pollutantTypelist: [],
    isEdit: false,
  },
  effects: {
    // 获取数据
    *getPollutantTypeList({ payload }, { call, put, update, select }) {
      const result = yield call(getPollutantTypeList, payload);
      if (result) {
        // ;
        if (result && result.length > 0) {
          yield update({
            pollutantTypelist: result,
            pollutantType: result[0].pollutantTypeCode,
            // pointDataWhere:[
            //     {
            //         Key: "dbo__T_Bas_CommonPoint__PollutantType",
            //         Value: `${result[0].pollutantTypeCode}`,
            //         Where: "$in"
            //     }
            // ]
          });
          payload.callback && payload.callback(result[0].pollutantTypeCode);
        }
      }
    },
    *addPoint({ payload }, { call, put, update, select }) {
      // ;

      let result = yield call(services.postAutoFromDataAdd, {
        ...payload,
        FormData: JSON.stringify(payload.FormData),
      });
      if (result.IsSuccess && result.Datas) {
        console.log('pointRes=', result);
        let monitorRelFormData = {
          DGIMN: payload.FormData.DGIMN,
          BaseCode: payload.targetId,
          BaseType: payload.FormData.PollutantType,
          PointCode: result.Datas,
        };

        result = yield call(services.postAutoFromDataAdd, {
          configId: 'monitorpoint',
          FormData: JSON.stringify(monitorRelFormData),
        });
        console.log('monitorRelFormData=', result);
        if (result.IsSuccess) {
          sdlMessage('操作成功！', 'success');
        } else {
          sdlMessage(result.Message, 'error');
        }
      } else {
        sdlMessage(result.Message, 'error');
      }
      payload.callback(result);
    },
    *editPoint({ payload }, { call, put, update, select }) {
      // ;
      let result = yield call(services.postAutoFromDataUpdate, {
        ...payload,
        FormData: JSON.stringify(payload.FormData),
      });

      if (result.IsSuccess) {
        sdlMessage('操作成功！', 'success');
      } else {
        sdlMessage(result.Message, 'error');
      }

      payload.callback(result);
    },
    *delPoint({ payload }, { call, put, update, select }) {
      let pointParam = {
        'dbo.T_Bas_CommonPoint.PointCode': payload.PointCode,
      };

      let result = yield call(services.postAutoFromDataDelete, {
        configId: payload.configId,
        FormData: JSON.stringify(pointParam),
      });

      if (result.IsSuccess) {
        let pointRelParam = {
          'dbo.T_Cod_MonitorPointBase.DGIMN': payload.DGIMN,
          'dbo.T_Cod_MonitorPointBase.BaseCode': payload.targetId,
          'dbo.T_Cod_MonitorPointBase.BaseType': payload.pollutantType,
        };
        result = yield call(services.postAutoFromDataDelete, {
          configId: 'monitorpoint',
          FormData: JSON.stringify(pointRelParam),
        });
        if (result.IsSuccess) {
          sdlMessage('操作成功！', 'success');
        } else {
          sdlMessage(result.Message, 'error');
        }
      } else {
        sdlMessage(result.Message, 'error');
      }

      payload.callback(result);
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
