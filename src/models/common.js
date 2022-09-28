import { message } from 'antd';
import * as services from '../services/commonApi';
import config from '@/config';
import Model from '@/utils/model';

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
    atmoStationList: [],
    priseList: [],
    attentionList: [],
    pointListByEntCode: [],
    pollutantListByDgimn: [],
    userList: [],
    userTotal:null,
    entLoading:true,
    inspectorUserList:[],
    operationUserList:[],
    noFilterRegionList:[],
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
      yield update({ entLoading: true, });
      const response = yield call(services.GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
          entLoading: false,
        });
      }else{
        message.error(response.Message)
        yield update({ priseList: [], entLoading: false,  });
      }
    },
    *getEntNoFilterList({ payload,callback }, { call, put, update, select }) {
      //企业列表 未过滤的
      yield update({ entLoading: true, });
      const response = yield call(services.GetEntNoFilterList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
          entLoading: false,
        });
        callback&&callback(response.Datas)
      }else{
        message.error(response.Message)
        yield update({ priseList: [], entLoading: false,  });
      }
    },
    *getEntByRegionCallBack({ payload,callback }, { call, put, update, select }) {
      //企业列表 回调
      const response = yield call(services.GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        callback(response.Datas)
      }else{
        message.error(response.Message)
        callback([])
      }
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
      const { filterPollutantType } = payload;
      const result = yield call(services.getPollutantTypeList, payload);
      if (result.IsSuccess) {
        let data = result.Datas;
        if (filterPollutantType !== 'undefined') {
          const thisPollutantType = filterPollutantType && filterPollutantType.split(',');
          thisPollutantType &&
            (data = data.filter(item => {
              const flag = thisPollutantType.filter(m => m == item.pollutantTypeCode);
              return flag.length > 0;
            }));
        }

        // 是否显示全部
        if (showAll) {
          data = [{
            pollutantTypeName: '全部',
            pollutantTypeCode: data.map(item => item.pollutantTypeCode).toString(),
          },
          ...data,
          ]
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
    // 多选组件 - 获取企业及排口
    *getEntAndPointList({ payload, callback }, { call, update }) {
      const result = yield call(services.getEntAndPoint, payload);
      if (result.IsSuccess) {
        const filterData = result.Datas.filter(item => {
          if (item.children.length) {
            let children = item.children.map(itm => {
              let obj = itm;
              delete obj.children;
              return { ...obj }
            })
            return {
              ...item,
              children
            }
          }
        })
        callback && callback(filterData)
        // yield update({
        //   entAndPointList: filterData,
        // });
      } else {
        message.error(result.Message);
      }
    },

    // 获取运维日志详情图片
    *getOperationImageList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getOperationImageList, payload);
      if (result.IsSuccess) {
        let imageList = [];
        if (result.Datas) {
          imageList = result.Datas.map((item, index) => {
            return {
              uid: index,
              name: item,
              status: 'done',
              url: `/uploadplantform/${item}`,
            }
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
        message.error(result.Message);
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
    *getPointByEntCode({ payload,callback }, { call, update }) {
      const result = yield call(services.getPointByEntCode, payload);
      if (result.IsSuccess) {
        yield update({
          pointListByEntCode: result.Datas,
        });
        callback&&callback(result.Datas)
      }
    },
    // 根据mn号获取站点下的所有污染物因子
    *getPollutantListByDgimn({ payload }, { call, update }) {
      const result = yield call(services.getPollutantListByDgimn, payload);
      if (result.IsSuccess) {
        yield update({
          pollutantListByDgimn: result.Datas,
        });
      }
    },
    /**
  * 基本信息-生成当前企业下所有监测点的二维码
  * @param {传递参数} 传递参数
  * @param {操作} 操作项
  */
    * CreatQRCode({
      payload
    }, {
      call,
    }) {
      const result = yield call(services.CreatQRCode, {
        ...payload
      });
      payload.callback(result);
    },

  // 用户列表
  *getUserList({ payload }, { call, update }) {
    const result = yield call(services.GetUserList, payload);
    if (result.IsSuccess) {
      yield update({
        userList: result.Datas,
        userTotal:result.Total,
      });
    }else {
      message.error(result.Message);
    }
  },
    // 运维人员 督查人员
    *getInspectorUserList({ payload,callback }, { call, update }) {
      const result = yield call(services.GetInspectorUserList, payload);
      if (result.IsSuccess) {
        yield update({
          inspectorUserList:result.Datas? result.Datas.InspectorUserList : [],
          operationUserList:result.Datas? result.Datas.OperationUserList :[],
        });
      }else {
        message.error(result.Message);
      }
    },
      // 行政区 非过滤
      *getNoFilterRegionList({ payload,callback }, { call, update }) {
        const result = yield call(services.GetNoFilterRegionList, payload);
        if (result.IsSuccess) {
          yield update({
            noFilterRegionList:result.Datas? result.Datas.list : [],
          });
        }else {
          message.error(result.Message);
        }
      },
  },
  
});
