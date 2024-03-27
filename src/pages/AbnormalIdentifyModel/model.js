import * as services from './services';
import Model from '@/utils/model';
import { message } from 'antd';
import moment from 'moment';
import { downloadFile } from '@/utils/utils';
import { ModelNumberIdsDatas } from './CONST';
import { getListPager } from '@/services/autoformapi';
import { useSelector } from 'umi';
function initWarningForm() {
  let warningForm = {};
  for (const key in ModelNumberIdsDatas) {
    warningForm[key] = {
      date: [
        moment()
          .subtract(1, 'month')
          .startOf('day'),
        moment().endOf('day'),
      ],
      date1:[],
      PollutantCode: '',
      warningTypeCode: [],
      pageSize: 20,
      pageIndex: 1,
    };
  }
  return warningForm;
}

export default Model.extend({
  namespace: 'AbnormalIdentifyModel',
  state: {
    warningForm: initWarningForm(),
    modelList: [],
    unfoldModelList: [],
    ModelInfoAndParams: {
      modelInfo: {},
      dataAttribute: { 1: [], 2: [], 3: [] },
    },
    DataPhenomenaChartList: {
      MonitorTimeList: [],
      dataList: [],
    },
    DataPhenomenaTableList: [],
    workTowerData: {
      pageIndex: 1,
      pageSize: 12,
      type: 1,
    },
    generateVerificationTakeData: {
      pageIndex: 1,
      pageSize: 20,
      scrollTop: '',
      type: '',
    },
    waitCheckDatasQueryPar:{},
    workTowerQueryPar: {},
    verificationTaskData: {
      pageIndex: 1,
      pageSize: 20,
      scrollTop: '',
      type: 1,
    },
    pollutantDischargeGapQuery: {},
  },
  effects: {
    // 获取通用库模型列表
    *GetModelList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetModelList, payload);
      if (result.IsSuccess) {
        let unfoldModelList = [];
        result.Datas.map(item => {
          item.ModelBaseList.map(itm => {
            unfoldModelList = unfoldModelList.concat(itm.ModelList);
          });
        });
        // console.log('unfoldModelList', unfoldModelList);
        let modelList = result.Datas.sort((a, b) => a.ModelTypeCode - b.ModelTypeCode);
        callback && callback(modelList, unfoldModelList);
        yield update({
          modelList: modelList,
          unfoldModelList,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 模型状态开启关闭
    *SetMoldStatus({ payload, callback }, { call, select, update }) {
      const result = yield call(services.SetMoldStatus, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取模型基础信息和参数配置
    *GetModelInfoAndParams({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetModelInfoAndParams, payload);
      if (result.IsSuccess) {
        let dataAttribute = result.Datas.dataAttribute;
        let arr = [];
        for (const key in dataAttribute) {
          arr.push({
            industryCode: key,
            params: dataAttribute[key],
          });
        }

        yield update({
          ModelInfoAndParams: {
            modelInfo: result.Datas.modelInfo || {},
            // dataAttribute: arr || [],
            dataAttribute: {
              1: [],
              2: [],
              3: [],
              ...result.Datas.dataAttribute,
            },
          },
        });
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 保存模型基础信息和参数配置
    *SaveModelInfoAndParams({ payload, callback }, { call, select, update }) {
      const result = yield call(services.SaveModelInfoAndParams, payload);
      if (result.IsSuccess) {
        callback && callback();
        message.success('保存成功！');
      } else {
        message.error(result.Message);
      }
    },
    // 根据MN获取模型选配数据
    *GetDataAttributeAndPointList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetDataAttributeAndPointList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 添加、关联模型选配
    *AddDataAttributeAndPoint({ payload, callback }, { call, select, update }) {
      const result = yield call(services.AddDataAttributeAndPoint, payload);
      if (result.IsSuccess) {
        callback && callback();
        message.success('保存成功！');
      } else {
        message.error(result.Message);
      }
    },
    // 获取辅助分析数据
    *GetAllTypeDataListForModel({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetAllTypeDataListForModel, payload);
      if (result.IsSuccess) {
        // yield update({
        //   allTypeDataList: result.Datas,
        // });
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取直方图数据
    *StatisPolValueNumsByDGIMN({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisPolValueNumsByDGIMN, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取点位参数配置
    *GetPointParamsRange({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetPointParamsRange, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        // message.error(result.Message);
      }
    },
    // 重新生成正常范围
    *RegenerateNomalRangeTime({ payload, callback }, { call, select, update }) {
      const result = yield call(services.RegenerateNomalRangeTime, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取相关系数图数据
    *StatisLinearCoefficient({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisLinearCoefficient, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 历史数据综合评价/统计分析
    *GetHistoricalDataEvaluation({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetHistoricalDataEvaluation, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取数据现象
    *GetHourDataForPhenomenon({ payload, callback }, { call, select, update }) {
      const { pollutantCodes } = payload;
      const result = yield call(services.GetHourDataForPhenomenon, {
        ...payload,
        pollutantCodes: pollutantCodes.toString(),
      });
      if (result.IsSuccess) {
        let data = {},
          MonitorTimeList = [];
        pollutantCodes.map(code => {
          data[code] = [];
          data[`${code}_ME`] = [];
          result.Datas.map(item => {
            data[code].push(item[code]);
            data[`${code}_ME`].push(item[`${code}_ME`]);

            if (MonitorTimeList.length !== result.Datas.length) {
              MonitorTimeList.push(item.MonitorTime);
            }
          });
        });
        console.log('data', data);
        yield update({
          DataPhenomenaChartList: {
            MonitorTimeList,
            dataList: data,
          },
          DataPhenomenaTableList: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 获取首页地图数据
    *GetMapPointList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetMapPointList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取线索列表
    *GetWarningList({ payload, callback }, { call, select, update }) {
      const state = yield select(state => state.AbnormalIdentifyModel);
      let currentForm = state.warningForm[payload.modelNumber];
      const result = yield call(services.GetWarningList, {
        ...payload,
        pageSize: currentForm.pageSize,
        pageIndex: currentForm.pageIndex,
      });
      if (result.IsSuccess) {
        callback && callback(result);
      } else {
        callback && callback([]);
        message.error(result.Message);
      }
    },
    // 重置报警记录form
    *onReset({ payload, callback }, { call, select, update }) {
      let state = yield select(state => state.AbnormalIdentifyModel);
      let current = state.warningForm[payload.modelNumber];
      yield update({
        warningForm: {
          ...state.warningForm,
          [payload.modelNumber]: {
            date: [
              moment()
                .subtract(1, 'month')
                .startOf('day'),
              moment().endOf('day'),
            ],
            date1:[],
            PollutantCode: '',
            warningTypeCode: [],
            pageSize: 20,
            pageIndex: 1,
          },
        },
      });
    },
    // 根据企业获取排口
    *GetNoFilterPointByEntCode({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetNoFilterPointByEntCode, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取报警及核实信息（上、下部分）
    *GetSingleWarning({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetSingleWarning, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取模型快照数据
    *GetSnapshotData({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetSnapshotData, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },

    // 保存点位参数配置
    *SavePointParamsRange({ payload, callback }, { call, select, update }) {
      const result = yield call(services.SavePointParamsRange, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        // message.error(result.Message);
      }
    },

    // 保存已关联排口
    *SaveModelRelationDGIMN({ payload, callback }, { call, select, update }) {
      const result = yield call(services.SaveModelRelationDGIMN, payload);
      if (result.IsSuccess) {
        message.success('保存成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取已关联排口
    *GetModelRelationDGIMN({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetModelRelationDGIMN, payload);
      if (result.IsSuccess) {
        yield update({
          relationDGIMN: result.Datas.relationDGIMN,
        });
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },

    // 获取报警数据
    *GetAllTypeDataListForModel2({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetAllTypeDataListForModel, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 导出报警关联数据
    *ExportHourDataForModel({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportHourDataForModel, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },

    // 根据企业获取排口
    *getPointByEntCode({ payload, callback }, { call, select, update }) {
      const result = yield call(services.getPointByEntCode, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取模型精度版本列表
    *GetEvaluationVersionList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetEvaluationVersionList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取模型精度数据
    *GetEvaluationList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetEvaluationList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 报警统计 - 线索信息统计
    *StatisAlarmInfo({ payload, callback, errorCallback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfo, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        errorCallback && errorCallback();
        message.error(result.Message);
      }
    },
    // 报警统计 - 统计核实、异常原因
    *StatisAlarmInfoCheck({ payload, callback, errorCallback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfoCheck, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        errorCallback && errorCallback();
        message.error(result.Message);
      }
    },
    // 报警统计 - 核实次数及企业及模型执行率
    *StatisAlarmInfoRate({ payload, callback, errorCallback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfoRate, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        errorCallback && errorCallback();
        message.error(result.Message);
      }
    },
    // 报警统计 - 已选择行统计
    *StatisAlarmInfoSum({ payload, callback, errorCallback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfoSum, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        errorCallback && errorCallback();
        message.error(result.Message);
      }
    },
    // 线索信息统计
    *StatisAlarmInfoIndiz({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfoIndiz, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取全企业波动范围
    *StatisNormalRange({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisNormalRange, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 全企业波动范围 - 导出
    *ExportStatisNormalRange({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportStatisNormalRange, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 场景模型分析报告 - 导出
    *ExportStatisAlarmReport({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportStatisAlarmReport, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 场景模型分析报告 - 全模型导出
    *ExportStatisAlarmAllReport({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportStatisAlarmReport, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 场景模型分析 - 导出
    *ExportStatisAlarm({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportStatisAlarm, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
        // window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },

    // 首页 - 数据统计分析
    *StatisForData({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisForData, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 首页 - 线索核实情况和企业排名
    *StatisVeriAndEr({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisVeriAndEr, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 首页 - 线索统计
    *StatisTipMsg({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisTipMsg, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },

    // 我的待办数据
    *GetMyModelExceptionByPManager({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetMyModelExceptionByPManager, payload);
      if (result.IsSuccess) {
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    // 我的已办
    *GetMyModelException({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetMyModelException, payload);
      if (result.IsSuccess) {
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    // 复核详情
    *GetWarningVerifyCheckInfo({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetWarningVerifyCheckInfo, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 报警核实
    *InsertWarningVerify({ payload, callback }, { call, select, update }) {
      const result = yield call(services.InsertWarningVerify, payload);
      if (result.IsSuccess) {
        message.success('操作成功!');
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取行业
    *getListPager({ payload, callback }, { call, select, update }) {
      const result = yield call(getListPager, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 模型重新运行
    *onRunModel({ payload, callback }, { call, select, update }) {
      yield update({ runState: true });
      const result = yield call(services.onRunModel, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        yield update({ runState: false });
        message.error(result.Message);
      }
    },
    // 获取模型运行状态
    *GetModelRunState({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetModelRunState, payload);
      if (result.IsSuccess) {
        yield update({
          runState: result.Datas,
        });
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },

    /**
     * 线索分析
     */
    *GetClueDatas({ payload, callback }, { call, select, update }) {
      // 获取工作台信息
      const result = yield call(services.GetClueDatas, payload);
      if (result.IsSuccess) {
        callback && callback(result);
        yield update({
          workTowerQueryPar: payload,
        });
      } else {
        message.error(result.Message);
      }
    },
    *GetWaitCheckDatas({ payload, callback }, { call, select, update }) {
      //获取生成核查任务
      const result = yield call(services.GetWaitCheckDatas, payload);
      if (result.IsSuccess) {
        callback && callback(result);
        yield update({
          waitCheckDatasQueryPar: payload,
        });
      } else {
        message.error(result.Message);
      }
    },
    *GetPreTakeFlagDatas({ payload, callback }, { call, select, update }) {
      //获取庄家意见信息
      const result = yield call(services.GetPreTakeFlagDatas, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    *GetPlanDatas({ payload, callback }, { call, select, update }) {
      //获取已有方案信息
      const result = yield call(services.GetPlanDatas, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    *GetCheckRoleDatas({ payload, callback }, { call, select, update }) {
      //获取核查角色（目前暂时用的是管理员角色）
      const result = yield call(services.GetCheckRoleDatas, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    *AddPlanTask({ payload, callback }, { call, select, update }) {
      //生成核查任务
      const result = yield call(services.AddPlanTask, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    *GetCheckedList({ payload, callback }, { call, select, update }) {
      // 获取待核查任务、已核查任务
      const result = yield call(services.GetCheckedList, payload);
      if (result.IsSuccess) {
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    *GetCheckedView({ payload, callback }, { call, select, update }) {
      // 获取待核查任务、已核查任务详情
      const result = yield call(services.GetCheckedView, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    *UpdatePlanItem({ payload, callback }, { call, select, update }) {
      // 核查保存或提交
      const result = yield call(services.UpdatePlanItem, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    *CheckConfirm({ payload, callback }, { call, select, update }) {
      // 核查确认
      const result = yield call(services.CheckConfirm, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    *GetPollutionDischargeGap({ payload, callback }, { call, select, update }) {
      // 排污缺口
      const result = yield call(services.GetPollutionDischargeGap, payload);
      if (result.IsSuccess) {
        callback && callback(result);
        yield update({
          pollutantDischargeGapQuery: payload,
        });
      } else {
        message.error(result.Message);
      }
    },

    *ExportPollutionDischargeGap({ payload, callback }, { call, select, update }) {
      // 排污缺口 导出
      const result = yield call(services.ExportPollutionDischargeGap, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },
  },
});
