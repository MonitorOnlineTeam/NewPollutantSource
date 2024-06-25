import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

const initializeState = {
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
  // 成套总览
  CTCountAnalysis: {
    EntCount: 0,
    PointCount: 0,
    GuideInstallationCount: 0,
    DebuggingCount: 0,
    CheckedCount: 0,
  },
  // 模型驾驶舱数据
  modalCountAnalysis: {
    EntCount: 0,
    PointCount: 0,
    NormalCount: 0,
    ExcepCount: 0,
  },
  modalActionList: [],
  modalLevelList: [],
  modalTypeList: [],
  modalRates: {
    ExcepRate: 0,
    RectRate: 0,
    CheckRate: 0,
  },
  //监督核查数据
  supervisionUniformityAnalysisData: {  //关键参数核查、合规性
    RemoteInspector: [
      {
        Name: "量程一致性",
        YiNum: 0,
        NoYiNum: 0
      },
      {
        Name: "数据一致性",
        YiNum: 0,
        NoYiNum: 0
      },
      {
        Name: "参数一致性",
        YiNum: 0,
        NoYiNum: 0
      }
    ],
    InspectorOperationManage: {
      CommonlyProblemNum: 0,
      importanProblemNum: 0,
      PrincipleProblemNum: 0
    }
  }
};

export default Model.extend({
  namespace: 'sysDashboard',
  state: initializeState,
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
    // 获取系统中间页
    *onResetState({ payload, callback }, { call, put, update }) {
      yield update({
        ...initializeState,
      });
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
    // 获取成套地图数据
    *GetInstallationDebuggingMap({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.SystemDashboardApi.GetInstallationDebuggingMap,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 获取模型地图数据
    *GetMapPointInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.SystemDashboardApi.GetMapPointInfo, payload);
      if (result.IsSuccess) {
        if (payload.pLeve === 1) {
          // 行政区
          yield update({
            level1MapData: result.Datas.list,
          });
        } else if (payload.pLeve === 4) {
          // 全部监测点
          yield update({
            level4MapData: result.Datas.list,
          });
        } else {
          // 行政区下企业、企业下监测点
          yield update({
            levelOtherMapData: result.Datas.list,
          });
        }
        callback && callback(result.Datas);
      }
    },
    // 重点关注企业排行
    *GetPointTopWarning({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AbnormalIdentifyModel.GetPointTopWarning, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    //督查总览
    *GetSupervisionOverview({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.SystemDashboardApi.GetSupervisionOverview, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    //关键参数监督核查分析、合规性监督核查分析
    *GetSupervisionUniformityAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.SystemDashboardApi.GetSupervisionUniformityAnalysis, payload);
      if (result.IsSuccess) {
        // 行政区
        yield update({
          supervisionUniformityAnalysisData: result.Datas,
        });

        callback && callback(result.Datas);
      }
    },
    //合格率分析
    *GetSupervisionQualifiedAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.SystemDashboardApi.GetSupervisionQualifiedAnalysis, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    //监督核查 地图部分
    *GetSupervisionMap({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.SystemDashboardApi.GetSupervisionMap, payload);
      if (result.IsSuccess) {
        if (payload.pLeve === 1) {
          // 行政区
          yield update({
            level1MapData: result.Datas.list,
          });
        } else if (payload.pLeve === 4) {
          // 全部监测点
          yield update({
            level4MapData: result.Datas.list,
          });
        } else {
          // 行政区下企业、企业下监测点
          yield update({
            levelOtherMapData: result.Datas.list,
          });
        }
        callback && callback(result.Datas);
      }

    },







  },
});
