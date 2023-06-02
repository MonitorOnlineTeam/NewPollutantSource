/*
 * @Author: cg
 * @Date: 20123-5-15 15:27:00
 * @Last Modified by: cg
 * @Last Modified time: 20123-5-15 15:27:00
 * @desc: 唐银首页
 */
import * as services from '@/pages/hometangy/service';
import Model from '@/utils/model';

export default Model.extend({
  namespace: 'hometangy',
  state: {
    theme: 'dark',
    //监控设备情况
    monitordevices: [],
    monitordevicesTotal: 0,
    //治理情况
    solvedevices: [],
    solvedevicesTotal: 0,
    //环保点位
    environmentalpoints: [],
    //地图
    mappoints: [],
    filterMappoints: [],
    maplegends: null
  },
  effects: {
    *getMonitordevices({ payload }, { call, update, take }) {
      const result = yield call(services.getMonitordevices, payload);
      if (result.IsSuccess) {
        yield update({ monitordevices: result.Datas, monitordevicesTotal: result.Total });
      }
    },
    *getSolvedevices({ payload }, { call, update, take }) {
      const result = yield call(services.getSolvedevices, payload);
      if (result.IsSuccess) {
        yield update({ solvedevices: result.Datas, solvedevicesTotal: result.Total });
      }
    },
    * getEnvironmentalpoints({ payload }, { call, update, take }) {
      const result = yield call(services.getEnvironmentalpoints, payload);
      if (result.IsSuccess) {
        yield update({ environmentalpoints: result.Datas });
      }
    },
    *getlegends({ payload }, { call, update, take }) {
      const result = yield call(services.getlegends, payload);
      if (result.IsSuccess) {
        yield update({ maplegends: result.Datas });
      }
    },
    *getDataForSingleEnt({ payload }, { call, update, take }) {
      const result = yield call(services.getDataForSingleEnt, payload);
      console.log(result);
      if (result.IsSuccess) {
        const childs = result.Datas.filter(t => t.key == payload.entcode);
      const children = childs.length > 0 ? childs[0].children : [];
        yield update({ mappoints: children, filterMappoints: children });
      }
    },
    *updateFilterMappoints({ payload }, { update, select }) {
      let newArr = [];
      const tempmappoints = yield select((state)=>state.hometangy.mappoints )
      tempmappoints.map((item) => {
        const res = item['MonitorPollutantInfors'].filter((j) => payload.PollutantCode.includes(j.PollutantCode));
        if (res && res.length) {          
          item['MonitorPollutantInfors'] = res;
          newArr.push(item);
        }
      });      
      yield update({ filterMappoints: payload.PollutantCode === '-1' ? tempmappoints : newArr });
    }
  },
  reducers: {
  },
});
