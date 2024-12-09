import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

const initializeState = {
  level: configInfo.IsSingleEnterprise ? 3 : 1,
  timeLabel: '本月',
  time: [moment().startOf('month'), moment()],
  regionCode: '',
  entCode: '',
  regionInfo: {},
  entInfo: {},
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
  supervisionUniformityAnalysisData: {
    //关键参数核查、合规性
    RemoteInspector: [
      {
        Name: '量程一致性',
        YiNum: 0,
        NoYiNum: 0,
      },
      {
        Name: '数据一致性',
        YiNum: 0,
        NoYiNum: 0,
      },
      {
        Name: '参数一致性',
        YiNum: 0,
        NoYiNum: 0,
      },
    ],
    InspectorOperationManage: {
      CommonlyProblemNum: 0,
      importanProblemNum: 0,
      PrincipleProblemNum: 0,
    },
  },
  // 监控总览
  MonitoringCountAnalysis: {
    entCount: 0,
    pointCount: 0,
    overCount: 0,
    exceptionCount: 0,
    normalCount: 0,
    unLineCount: 0,
    stopCount: 0,
  },
  // 质控
  QCOverviewData: {
    EntCount: 0,
    NoResultNum: 0,
    PointCount: 0,
    ResultFalseNum: 0,
    ResultTrueNum: 0,
  },
};

export default Model.extend({
  namespace: 'sysDashboard1',
  state: initializeState,
  effects: {
    // 获取系统中间页
    *GetSysList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, '/rest/PollutantSourceApi/MenuApi/GetSysList', {});
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
    // 运维地图数据
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
    // 获取质控地图数据
    *GetQCAMapPointInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.SystemDashboardApi.GetQCAMapPointInfo, payload);
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

        yield update({
          QCOverviewData: result.Datas,
        });
        callback && callback(result.Datas);
      }
    },
    // 质控核查任务核查
    *GetQCACRTaskAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.SystemDashboardApi.GetQCACRTaskAnalysis, payload);
      if (result.IsSuccess) {
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
      const result = yield call(
        requestPost,
        API.SystemDashboardApi.GetSupervisionOverview,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    //关键参数监督核查分析、合规性监督核查分析
    *GetSupervisionUniformityAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.SystemDashboardApi.GetSupervisionUniformityAnalysis,
        payload,
      );
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
      const result = yield call(
        requestPost,
        API.SystemDashboardApi.GetSupervisionQualifiedAnalysis,
        payload,
      );
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
    // 监控地图
    *GetMapPointList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.VisualKanbanApi.GetMapPointList, payload);
      if (result.IsSuccess) {
        if (payload.pointType === 1) {
          // 行政区
          yield update({
            level1MapData: result.Datas.list,
          });
        } else if (payload.pointType === 3 && !payload.regionCode && !payload.entCode) {
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
    // 联网率
    *GetVisualDashBoardNetworkingRate({ callback, payload }, { call, put, update, select }) {
      const result = yield call(
        requestPost,
        API.VisualKanbanApi.GetVisualDashBoardNetworkingRate,
        payload,
      );
      if (result.IsSuccess) {
        callback(result.Datas);
      }
    },
    // 排放量综合分析
    *GetEmissionsAnalysis({ callback, payload }, { call, put, update, select }) {
      const result = yield call(requestPost, API.SystemDashboardApi.GetEmissionsAnalysis, payload);
      if (result.IsSuccess) {
        callback(result.Datas);
      }
    },
    // 超标数据分析
    *GetOverDataAnalysis({ callback, payload }, { call, put, update, select }) {
      const result = yield call(requestPost, API.SystemDashboardApi.GetOverDataAnalysis, payload);
      if (result.IsSuccess) {
        callback(result.Datas);
      }
    },
    // 有效传输
    *GetEffectiveTransmissionRate({ callback, payload }, { call, put, update, select }) {
      const result = yield call(
        requestPost,
        API.SystemDashboardApi.GetEffectiveTransmissionRate,
        payload,
      );
      if (result.IsSuccess) {
        callback(result.Datas);
      }
    },
    // 异常数据分析
    *GetExceptionDataAnalysis({ callback, payload }, { call, put, update, select }) {
      const result = yield call(
        requestPost,
        API.SystemDashboardApi.GetExceptionDataAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        callback(result.Datas);
      }
    },
  },
});
