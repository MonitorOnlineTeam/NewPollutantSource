import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'emissionsStatistics',
  state: {
    attentionList: [],
    divisorList: [],
    regionTableDataSource: [],
    entTableDataSource: [],
    pointTableDataSource: [],
    regionLoading: false,
    entLoading: false,
    pointLoading: false,
    regionExportLoading: false,
    entExportLoading: false,
    pointExportLoading: false,
    // 对比数据
    regionContrastTableDataSource: [],
    regionContrastLoading: false,
    entContrastTableDataSource: [],
    entContrastLoading: false,
    pointContrastTableDataSource: [],
    pointContrastLoading: false,
    regionContrastExportLoading: false,
    entContrastExportLoading: false,
    pointContrastExportLoading: false,
  },
  effects: {
    // 获取关注列表
    *getAttentionDegreeList({ payload }, { call, put, update, select }) {
      const response = yield call(services.getAttentionDegreeList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          attentionList: response.Datas,
        });
      } else {
        message.error(response.Message)
      }
    },
    // 根据查询类型获取table数据
    *getTableDataByType({ payload, callback }, { call, put, update, select }) {
      let queryType = payload.DataType;
      let actionType, stateKey, loadingName;
      switch (queryType) {
        case "region":
          actionType = "getRegionTableDataList";
          stateKey = "regionTableDataSource";
          loadingName = "regionLoading"
          break;
        case "ent":
          actionType = "getEntTableDataList";
          stateKey = "entTableDataSource";
          loadingName = "entLoading"
          break;
        case "point":
          actionType = "getPointTableDataList";
          stateKey = "pointTableDataSource";
          loadingName = "pointLoading"
          break;
      }
      yield update({ [loadingName]: true })
      const result = yield call(services[actionType], { ...payload });
      if (result.IsSuccess) {
        yield update({
          [stateKey]: result.Datas,
          [loadingName]: false
        })
      } else {
        yield update({ [loadingName]: false })
        message.error(result.Message)
      }
    },
    // 根据查询类型导出table数据
    *exportTableDataByType({ payload, callback }, { call, put, update, select }) {
      let queryType = payload.DataType;
      let actionType, loadingName;
      switch (queryType) {
        case "region":
          actionType = "exportRegionData";
          loadingName = "regionExportLoading"
          break;
        case "ent":
          actionType = "exportEntData";
          loadingName = "entExportLoading"
          break;
        case "point":
          actionType = "exportPointData";
          loadingName = "pointExportLoading"
          break;
      }
      yield update({ [loadingName]: true })
      const result = yield call(services[actionType], { ...payload });
      if (result.IsSuccess) {
        window.open(result.Datas)
        yield update({
          [loadingName]: false
        })
      } else {
        yield update({ [loadingName]: false })
        message.error(result.Message)
      }
    },
    // 根据查询类型获取对比table数据
    *getContrastTableDataByType({ payload, callback }, { call, put, update, select }) {
      let queryType = payload.DataType;
      let actionType, stateKey, loadingName;
      switch (queryType) {
        case "region":
          actionType = "getDataForRegionContrast";
          stateKey = "regionContrastTableDataSource";
          loadingName = "regionContrastLoading"
          break;
        case "ent":
          actionType = "getDataForEntContrast";
          stateKey = "entContrastTableDataSource";
          loadingName = "entContrastLoading"
          break;
        case "point":
          actionType = "getDataForPointContrast";
          stateKey = "pointContrastTableDataSource";
          loadingName = "pointContrastLoading"
          break;
      }
      yield update({ [loadingName]: true })
      const result = yield call(services[actionType], { ...payload });
      if (result.IsSuccess) {
        yield update({
          [stateKey]: result.Datas,
          [loadingName]: false
        })
      } else {
        yield update({ [loadingName]: false })
        message.error(result.Message)
      }
    },
    // 根据查询类型导出对比table数据
    *exportContrastTableDataByType({ payload, callback }, { call, put, update, select }) {
      let queryType = payload.DataType;
      let actionType, loadingName;
      switch (queryType) {
        case "region":
          actionType = "exportRegionContrastData";
          loadingName = "regionContrastExportLoading"
          break;
        case "ent":
          actionType = "exportEntContrastData";
          loadingName = "entContrastExportLoading"
          break;
        case "point":
          actionType = "exportPointContrastData";
          loadingName = "pointContrastExportLoading"
          break;
      }
      yield update({ [loadingName]: true })
      const result = yield call(services[actionType], { ...payload });
      if (result.IsSuccess) {
        window.open(result.Datas)
        yield update({
          [loadingName]: false
        })
      } else {
        yield update({ [loadingName]: false })
        message.error(result.Message)
      }
    },
    // 废气、废水排放量同比
    *getEmissionsListForYear({ payload, callback }, { call, put, update, select }) {
      let queryType = payload.DataType;
      let actionType, stateKey, loadingName;
      switch (queryType) {
        case "region":
          actionType = "getEmissionsListForRegionYear";
          stateKey = "regionYearTableDataSource";
          loadingName = "regionYearLoading"
          break;
        case "ent":
          actionType = "getEmissionsListForEntYear";
          stateKey = "entYearTableDataSource";
          loadingName = "entYearLoading"
          break;
        case "point":
          actionType = "getEmissionsListForPointYear";
          stateKey = "pointYearTableDataSource";
          loadingName = "pointYearLoading"
          break;
      }
      yield update({ [loadingName]: true })
      const result = yield call(services[actionType], { ...payload });
      if (result.IsSuccess) {
        yield update({
          [stateKey]: result.Datas,
          [loadingName]: false
        })
      } else {
        yield update({ [loadingName]: false })
        message.error(result.Message)
      }
    },
    // 废气、废水排放量环比
    *getEmissionsListForChain({ payload, callback }, { call, put, update, select }) {
      let queryType = payload.DataType;
      let actionType, stateKey, loadingName;
      switch (queryType) {
        case "region":
          actionType = "getEmissionsListForRegionChain";
          stateKey = "regionChainTableDataSource";
          loadingName = "regionChainLoading"
          break;
        case "ent":
          actionType = "getEmissionsListForEntChain";
          stateKey = "entChainTableDataSource";
          loadingName = "entChainLoading"
          break;
        case "point":
          actionType = "getEmissionsListForPointChain";
          stateKey = "pointChainTableDataSource";
          loadingName = "pointChainLoading"
          break;
      }
      yield update({ [loadingName]: true })
      const result = yield call(services[actionType], { ...payload });
      if (result.IsSuccess) {
        yield update({
          [stateKey]: result.Datas,
          [loadingName]: false
        })
      } else {
        yield update({ [loadingName]: false })
        message.error(result.Message)
      }
    },
  },
});
