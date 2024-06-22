import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'OperationSysDashboard',
  state: {
    level: 1,
    timeLabel: '本月',
    time: [moment().startOf('month'), moment()],
    regionCode: '',
    entCode: '',
    level1MapData: [],
    level4MapData: [],
    levelOtherMapData: [],
    InspectionAndCalibration: {
      inspectionCompleteCount: 0,
      inspectionCloseCount: 0,
      inspectionIncompleteCount: 0,
      calibrationCompleteCount: 0,
      calibrationCloseCount: 0,
      calibrationIncompleteCount: 0,
      inspectionRate: '0',
      calibrationRate: '0',
    },
  },
  effects: {
    // 获取系统中间页
    *GetSysList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        '/newApi/rest/PollutantSourceApi/MenuApi/GetSysList',
        {},
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 获取设备运维总览
    *GetOperationEquipmentOverview({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.SystemDashboardApi.GetOperationEquipmentOverview,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 异常响应分析
    *GetExceptionResponseRate({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.SystemDashboardApi.GetExceptionResponseRate,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 巡检质量、校准质量分析
    *GetPlanOperationTaskCompleteRate({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.VisualKanbanApi.GetPlanOperationTaskCompleteRate,
        payload,
      );
      if (result.IsSuccess) {
        yield update({
          InspectionAndCalibration: {
            ...result.Datas,
          },
        });
      }
    },
    // 备件更换分析
    *GetVisualDashBoardConsumablesStatisticsInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.VisualKanbanApi.GetVisualDashBoardConsumablesStatisticsInfo,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 设备故障分析
    *GetEquipmentExceptionsOverview({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.VisualKanbanApi.GetEquipmentExceptionsOverview,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 地图数据
    *GetMapOperationEquipmentOverview({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.SystemDashboardApi.GetMapOperationEquipmentOverview,
        payload,
      );
      if (result.IsSuccess) {
        if (payload.pointType === 1) {
          // 行政区
          yield update({
            level1MapData: result.Datas,
          });
        } else if (payload.pointType === 3 && !payload.regionCode && !payload.entCode) {
          // 全部监测点
          yield update({
            level4MapData: result.Datas,
          });
        } else {
          // 行政区下企业、企业下监测点
          yield update({
            levelOtherMapData: result.Datas,
          });
        }

        callback && callback(result.Datas);
      }
    },
  },
});
