import { message } from 'antd';
import * as services from '../services/commonApi';
import config from '@/config';
import Model from '@/utils/model';
import { requestPost, requestGet } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'common',
  state: {
    pollutantTypelist: [],
    defaultPollutantCode: null,
    enterpriseAndPointList: [],
    defaultSelected: [],
    level: null,
    imageListVisible: false,
    imageList: [],
    pollutantCode: [],
    industryTreeList: [],
    entAndPointList: [],
    entAndPointNoFilterList: [],
    atmoStationList: [],
    entList: [],
    entLoading: true,
    noFilterEntList: [],
    noFilterEntLoading: false,
    enableEntList: [], //启用的企业
    enableEntLoading: false,
    attentionList: [],
    pointListByEntCode: [],
    pollutantListByDgimn: [],
    menuNameList: [],
    QCAPollutantList: [],
    userList: [],
    userTotal: null,
    inspectorUserList: [],
    operationUserList: [],
    noFilterRegionList: [],
    roleList: [],
    testRegionList: [],
    ctEntAndPointList: [],
    ctProjectList: [],
    ctProjectTotal: 0,
    ctProjectQueryPar: null,
    ctRegionList: [],
    allUser: [],
    // 成套大区、省份
    CtLargeRegionList: [],
    CtProvinceList: [],
    // 运维大区、省份
    largeRegionList: [],
    provinceList: [],
  },

  effects: {
    *getStationByRegion({ payload }, { call, put, update, select }) {
      //大气站列表
      const response = yield call(services.GetStationByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          atmoStationList: response.Datas,
        });
      }
    },
    *getEntByRegion({ payload }, { call, put, update, select }) {
      //企业列表
      yield update({ entLoading: true });
      const response = yield call(services.GetEntByRegion, { ...payload, pollutantType: sessionStorage.getItem('sysPollutantCodes') || payload.PollutantType });
      if (response.IsSuccess) {
        yield update({
          entList: response.Datas,
          entLoading: false,
        });
      } else {
        response.Message && message.error(response.Message);
        yield update({ entList: [], entLoading: false });
      }
    },
    *getEntNoFilterList({ payload, callback }, { call, put, update, select }) {
      //企业列表 未过滤的
      yield update({ noFilterEntLoading: true });
      const response = yield call(services.GetEntNoFilterList, { ...payload, PollutantType: sessionStorage.getItem('sysPollutantCodes') || payload.PollutantType });
      if (response.IsSuccess) {
        yield update({
          noFilterEntList: response.Datas,
          noFilterEntLoading: false,
        });
        callback && callback(response.Datas);
      } else {
        response.Message && message.error(response.Message);
        yield update({ noFilterEntList: [], noFilterEntLoading: false });
      }
    },
    *getEnableEntList({ payload, callback }, { call, put, update, select }) {
      //企业列表 开启未停用的企业
      yield update({ enableEntLoading: true });
      const response = yield call(services.GetEntList, { ...payload });
      if (response.IsSuccess) {
        yield update({ enableEntList: response.Datas });
      }
      callback && callback(response?.Datas);
      yield update({ enableEntLoading: false });
    },
    *getAttentionDegreeList({ payload }, { call, put, update, select }) {
      //关注列表
      const response = yield call(services.GetAttentionDegreeList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          attentionList: response.Datas,
        });
      }
    },
    // 获取污染物类型
    *getPollutantTypeList({ payload = {}, showAll, callback }, { update, call }) {
      const { filterPollutantType, filterInvalidData } = payload;
      console.log('payload', payload);
      const result = yield call(services.getPollutantTypeList, payload);
      if (result.IsSuccess) {
        let data = result.Datas;
        if (filterPollutantType) {
          const thisPollutantType = filterPollutantType && filterPollutantType.split(',');
          thisPollutantType &&
            (data = data.filter(item => {
              const flag = thisPollutantType.filter(m => m == item.pollutantTypeCode);
              return flag.length > 0;
            }));
        }
        if (filterInvalidData) {
          const _filterInvalidData = filterInvalidData && filterInvalidData.split(',');
          _filterInvalidData &&
            _filterInvalidData.map(item => {
              data = data.filter(m => m.pollutantTypeCode != item);
            });
        }
        // 是否显示全部
        if (showAll) {
          data = [
            {
              pollutantTypeName: '全部',
              pollutantTypeCode: data.map(item => item.pollutantTypeCode).toString(),
            },
            ...data,
          ];
        }
        let defaultPollutantCode = data[0] && data[0]['pollutantTypeCode'];
        callback && callback(data);
        yield update({
          pollutantTypelist: data,
          defaultPollutantCode: defaultPollutantCode,
        });
      }
    },
    // 获取省市区/企业/排口
    *getEnterpriseAndPoint({ payload, callback }, { call, update, select }) {
      const level = yield select(state => state.common.level);
      const result = yield call(services.getEnterpriseAndPoint, payload);
      if (result.IsSuccess) {
        if (level !== result.Datas.level) {
          yield update({ level: result.Datas.level });
        }
        let defaultValue = [];
        function factorial(data) {
          // if (n == 1) return n;
          if (data && data.children) {
            defaultValue.push(data.value);
            factorial(data.children[0]);
          }
        }
        result.Datas.list && result.Datas.list.length && factorial(result.Datas.list[0]);
        yield update({
          enterpriseAndPointList: result.Datas.list,
          defaultSelected: defaultValue,
        });

        callback && callback(result.Datas.list, defaultValue);
      }
    },
    // 获取企业及排口
    *getEntAndPointList({ payload, callback }, { call, update }) {
      const result = yield call(services.getEntAndPoint, payload);
      if (result.IsSuccess) {
        const filterData = result.Datas.filter(item => {
          if (item.children.length) {
            let children = item.children.map(itm => {
              let obj = itm;
              delete obj.children;
              return { ...obj };
            });
            return {
              ...item,
              children,
            };
          }
        });
        callback && callback(filterData);
        yield update({
          // entAndPointList: result.Datas,
          entAndPointList: filterData,
        });
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 获取企业及排口
    *GetEntAndPointNoFilter({ payload, callback }, { call, update }) {
      const result = yield call(requestPost, API.CommonApi.GetEntAndPointNoFilter, payload);
      if (result.IsSuccess) {
        const filterData = result.Datas.filter(item => {
          if (item.children.length) {
            let children = item.children.map(itm => {
              let obj = itm;
              delete obj.children;
              return { ...obj };
            });
            return {
              ...item,
              children,
            };
          }
        });
        callback && callback(filterData);
        yield update({
          // entAndPointList: result.Datas,
          entAndPointNoFilterList: filterData,
        });
      } else {
        result.Message && message.error(result.Message);
      }
    },

    // 获取运维日志详情图片
    *getOperationImageList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getOperationImageList, payload);
      if (result.IsSuccess) {
        let imageList = [];
        if (result.Datas && result.Datas[0]) {
          imageList = result.Datas.map((item, index) => {
            return {
              uid: index,
              name: item,
              status: 'done',
              url: `${config.uploadPrefix}/${item}`,
            };
          });
          yield update({
            imageListVisible: true,
          });
          callback && callback(result);
        } else {
          message.error('暂无数据');
        }
        yield update({
          imageList,
        });
      }
    },

    // 根据污染物类型获取污染物
    *getAllPollutantCode({ payload, callback }, { call, update }) {
      const result = yield call(services.getPollutantTypeCode, payload);
      if (result.IsSuccess) {
        yield update({
          pollutantCode: result.Datas,
        });
        callback && callback(result);
      } else {
        result.Message && message.error(result.Message);
      }
    },

    // 获取产业级联
    *getIndustryTree({ payload, callback }, { call, update }) {
      const result = yield call(services.getIndustryTree, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
        yield update({
          industryTreeList: result.Datas,
        });
      }
    },
    // 根据企业获取排口
    *getPointByEntCode({ payload, callback }, { call, update }) {
      const result = yield call(services.getPointByEntCode, { ...payload, PollutantTypeCode: sessionStorage.getItem('sysPollutantCodes') || payload.PollutantTypeCode });
      if (result.IsSuccess) {
        yield update({
          pointListByEntCode: result.Datas,
        });
        callback && callback(result.Datas);
      }
    },
    // 根据mn号获取站点下的所有污染物因子
    *getPollutantListByDgimn({ payload, callback }, { call, update }) {
      const result = yield call(services.getPollutantListByDgimn, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
        yield update({
          pollutantListByDgimn: result.Datas,
        });
      }
    },
    // 根据项目id 获取企业 
    *GetEntByProjectInfo({ payload, callback }, { call, update }) {
      const result = yield call(requestPost, API.CommonApi.GetEntByProjectInfo, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 根据企业id 获取点位
    *GetPointByEntInfo({ payload, callback }, { call, update }) {
      const result = yield call(requestPost, API.CommonApi.GetPointByEntInfo , payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 根据所有菜单名称
    *getMenuNameList({ payload }, { call, update }) {
      const result = yield call(services.getMenuNameList, payload);
      if (result.IsSuccess) {
        yield update({
          menuNameList: result.Datas.map(item => item.replace('ReactPD', '')),
        });
      }
    },
    // 获取质控污染物，参数DGIMN 可选
    *getQCAPollutantByDGIMN({ payload, callback, errorCallback }, { call, put, update, select }) {
      const result = yield call(services.getQCAPollutantByDGIMN, payload);
      if (result.IsSuccess) {
        yield update({
          QCAPollutantList: result.Datas,
        });
        callback && callback(result.Datas);
      } else {
        errorCallback && errorCallback(result.Message);
        result.Message && message.error(result.Message);
      }
    },
    // 记录日志
    *AddUserAccessLog({ payload }, { call, update }) {
      const result = yield call(services.AddUserAccessLog, payload);
      if (result.IsSuccess) {
      }
    },
    /**
     * 基本信息-生成当前企业下所有监测点的二维码
     * @param {传递参数} 传递参数
     * @param {操作} 操作项
     */
    *CreatQRCode({ payload }, { call }) {
      const result = yield call(services.CreatQRCode, {
        ...payload,
      });
      payload.callback(result);
    },
    // 用户列表
    *getUserList({ payload }, { call, update }) {
      const result = yield call(services.GetUserList, payload);
      if (result.IsSuccess) {
        yield update({
          userList: result.Datas,
          userTotal: result.Total,
        });
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 角色列表
    *getRoleCodeList({ payload }, { call, update }) {
      const result = yield call(services.GetRoleCodeList, payload);
      if (result.IsSuccess) {
        yield update({
          roleList: result.Datas,
        });
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 运维人员 督查人员
    *getInspectorUserList({ payload, callback }, { call, update }) {
      const result = yield call(services.GetInspectorUserList, payload);
      if (result.IsSuccess) {
        yield update({
          inspectorUserList: result.Datas
            ? result.Datas.InspectorUserList.map(item => ({ ...item, key: item.UserId }))
            : [],
          operationUserList: result.Datas ? result.Datas.OperationUserList : [],
        });
      } else {
        result.Message && message.error(result.Message);
      }
      callback && callback();
    },
    // 行政区 非过滤
    *getNoFilterRegionList({ payload, callback }, { call, update }) {
      const result = yield call(services.GetNoFilterRegionList, payload);
      if (result.IsSuccess) {
        yield update({
          noFilterRegionList: result.Datas ? result.Datas.list : [],
        });
        callback && callback(result.Datas ? result.Datas.list : []);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 行政区 非过滤  联级选择下拉列表  防止loading重复刷新
    *getCascaderNoFilterRegionList({ payload, callback }, { call, update }) {
      const result = yield call(services.GetNoFilterRegionList, payload);
      if (result.IsSuccess) {
        yield update({
          noFilterRegionList: result.Datas ? result.Datas.list : [],
        });
        callback && callback(result.Datas ? result.Datas.list : []);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 行政区 非过滤  联级选择下拉列表  防止loading重复刷新
    *getCascaderNoFilterRegionList({ payload, callback }, { call, update }) {
      const result = yield call(services.GetNoFilterRegionList, payload);
      if (result.IsSuccess) {
        yield update({
          noFilterRegionList: result.Datas ? result.Datas.list : [],
        });
        callback && callback(result.Datas ? result.Datas.list : []);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 行政区 调试服务
    *getTestXuRegions({ payload, callback }, { call, update }) {
      const result = yield call(services.GetTestXuRegions, payload);
      if (result.IsSuccess) {
        yield update({
          testRegionList: result.Datas ? result.Datas.list : [],
        });
        callback && callback(result.Datas ? result.Datas.list : []);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 行政区 成套污染源管理
    *getCtTestXuRegions({ payload, callback }, { call, update }) {
      const result = yield call(services.GetCtTestXuRegions, payload);
      if (result.IsSuccess) {
        yield update({
          ctRegionList: result.Datas ? result.Datas.list : [],
        });
        callback && callback(result.Datas ? result.Datas.list : []);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    //成套获取 企业和监测点
    *getCtEntAndPointList({ payload, callback }, { call, update }) {
      const result = yield call(services.GetCtEntAndPointList, payload);
      if (result.IsSuccess) {
        const data = result.Datas ? result.Datas : [];
        yield update({
          ctEntAndPointList: data,
        });
        callback && callback(data);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    *getCTProjectList({ payload, callback }, { call, put, update }) {
      //项目列表
      const result = yield call(services.GetCTProjectList, payload);
      if (result.IsSuccess) {
        yield update({
          ctProjectList: result.Datas,
          ctProjectTotal: result.Total,
          ctProjectQueryPar: payload,
        });
        callback && callback(result.Datas);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    //获取所有用户信息
    *getAlluser({ payload, callback }, { call, update }) {
      const result = yield call(services.GetAlluser, payload);
      if (result.IsSuccess) {
        const data = result.Datas ? result.Datas : [];
        yield update({
          allUser: data,
        });
        callback && callback(data);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    *addSetUser({ payload, callback }, { call, put, update }) {
      //设置人员信息
      const result = yield call(services.AddSetUser, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback(result.Datas);
      } else {
        result.Message && message.error(result.Message);
      }
    },

    *getSetUser({ payload, callback }, { call, put, update }) {
      //获取设置的人员信息
      const result = yield call(services.GetSetUser, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        result.Message && message.error(result.Message);
      }
    },

    // 获取成套大区及省份列表
    *getCTLargeRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetCtLargeRegionList, payload);
      if (result.IsSuccess) {
        let provinceList = [];
        result.Datas.map(item => {
          provinceList = provinceList.concat([...item.ChildList]);
        });
        let _datas = {
          CtLargeRegionList: result.Datas,
          CtProvinceList: provinceList,
        };
        yield update(_datas);
        callback && callback(_datas);
      }
    },
    // 获取运维大区及省份列表
    *getLargeRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetLargeRegion, payload);
      if (result.IsSuccess) {
        let provinceList = [];
        result.Datas.map(item => {
          provinceList = provinceList.concat([...item.ChildList]);
        });
        let _datas = {
          largeRegionList: result.Datas,
          provinceList: provinceList,
        };
        yield update(_datas);
        callback && callback(_datas);
      }
    },
  },
});
