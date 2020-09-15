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
  },

  effects: {
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
    // 
    *getEntAndPointList({ payload, callback }, { call, update }) {
      const result = yield call(services.getEntAndPoint, payload);
      if (result.IsSuccess) {
        yield update({ entAndPointList: result.Datas })
      } else {
        message.error(result.Message);
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
    *getIndustryTree({ payload }, { call, update }) {
      const result = yield call(services.getIndustryTree, payload);
      if (result.IsSuccess) {
        yield update({
          industryTreeList: result.Datas,
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
  },
});
