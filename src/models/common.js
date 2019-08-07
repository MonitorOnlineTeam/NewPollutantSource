import { message } from 'antd';
import * as services from '../services/commonApi';
import Model from '@/utils/model';

export default Model.extend({
  namespace: 'common',
  state: {
    pollutantTypelist: [],
    defaultPollutantCode: null,
    enterpriseAndPointList: [],
    defaultSelected: [],
    level: null,
  },

  effects: {
    // 获取污染物类型
    *getPollutantTypeList({ payload }, {
      update, call
    }) {
      let { filterPollutantType } = payload;
      const result = yield call(services.getPollutantTypeList, payload);
      if (result.IsSuccess) {

        let data = result.Datas
        if (filterPollutantType !== "undefined") {
          let thisPollutantType = filterPollutantType && filterPollutantType.split(',');
          thisPollutantType && (data = data.filter(item => {
            let flag = thisPollutantType.filter(m => m == item.pollutantTypeCode);
            return flag.length > 0;
          }))

          // console.log("newPollutantTypelist2=", newPollutantTypelist);
        }

        yield update({
          pollutantTypelist: data,
          defaultPollutantCode: data[0] && data[0]["pollutantTypeCode"]
        })
      }
    },
    // 获取省市区/企业/排口
    * getEnterpriseAndPoint({
      payload, callback
    }, { call, update, select }) {
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
            defaultValue.push(data.value)
            factorial(data.children[0])
          }
        }
        factorial(result.Datas.list[0])
        yield update({
          enterpriseAndPointList: result.Datas.list,
          defaultSelected: defaultValue
        });

        callback && callback(result.Datas.list, defaultValue)
      }
    },
  },
});
