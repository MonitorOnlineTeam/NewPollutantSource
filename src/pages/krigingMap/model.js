import moment from 'moment';
import { message } from 'antd';
import * as services from './services';
import Model from '@/utils/model';

export default Model.extend({
  namespace: 'krigingMap',
  state: {
    rankHourData: [],
    mapData: [],
    dateTimeAllData: [],
    time: '',
    emissionsDataList: [],
    emissionsDataListALL: [],
    legendData: {},
  },

  effects: {
    // 获取监测点infoWindow数据
    *GetAirRankHour({ payload }, { call, update, select, put }) {
      const result = yield call(services.GetAirRankHour, payload);
      if (result.IsSuccess) {
        yield update({
          rankHourData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },


    // 根据时间获取地图数据
    *getMapData({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.getMapData, payload);
      if (result.IsSuccess) {
        let currentTime = moment().subtract(1, 'hours').format("YYYY-MM-DD HH:00:00")
        let filterData = result.Datas.filter(item => item.Time === currentTime);
        let mapData = [];
        let time = "";
        if (filterData.length) {
          mapData = filterData[0].Value;
          time = filterData[0].Time;
        } else {
          mapData = result.Datas.length ? result.Datas[0].Value : [];
          time = result.Datas.length ? result.Datas[0].Time : "";
        }
        callback && callback()
        yield update({
          time: time,
          mapData: mapData,
          dateTimeAllData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },

    // 获取废气排放量
    *getEmissionsData({ payload }, { call, update, select, put }) {
      const result = yield call(services.getEmissionsData, payload);
      if (result.IsSuccess) {
        let colors = [
          "#00e400",
          "#f3dd22",
          "#ff7e00",
          "#ff0000",
          "#99004c",
          "#7e0023",
        ]

        // 烟尘：0,500,1000,1500,3000
        // 二氧化硫：0,200,500,1000,2000
        // 氮氧化物: 0,500,1000,1500,3000
        let valueInterval2 = {
          "01-EmissionsValue": [
            {
              min: 0, max: 20, color: '#00e400'
            },
            {
              min: 20, max: 50, color: '#f3dd22'
            },
            {
              min: 50, max: 100, color: '#ff7e00'
            },
            {
              min: 100, max: 200, color: '#ff0000'
            },
            {
              min: 200, max: 99999999, color: '#99004c'
            }
          ],
          "02-EmissionsValue": [
            {
              min: 0, max: 20, color: '#00e400'
            },
            {
              min: 20, max: 50, color: '#f3dd22'
            },
            {
              min: 50, max: 100, color: '#ff7e00'
            },
            {
              min: 100, max: 200, color: '#ff0000'
            },
            {
              min: 200, max: 99999999, color: '#99004c'
            }
          ],
          "03-EmissionsValue": [
            {
              min: 0, max: 50, color: '#00e400'
            },
            {
              min: 50, max: 100, color: '#f3dd22'
            },
            {
              min: 100, max: 150, color: '#ff7e00'
            },
            {
              min: 150, max: 200, color: '#ff0000'
            },
            {
              min: 200, max: 99999999, color: '#99004c'
            }
          ]
        }
        
        let valueInterval1 = {
          "011-EmissionsValue": [
            {
              min: 0, max: 20, color: '#00e400'
            },
            {
              min: 20, max: 50, color: '#f3dd22'
            },
            {
              min: 50, max: 100, color: '#ff7e00'
            },
            {
              min: 100, max: 200, color: '#ff0000'
            },
            {
              min: 200, max: 99999999, color: '#99004c'
            }
          ],
          "060-EmissionsValue": [
            {
              min: 0, max: 10, color: '#00e400'
            },
            {
              min: 10, max: 30, color: '#f3dd22'
            },
            {
              min: 30, max: 50, color: '#ff7e00'
            },
            {
              min: 50, max: 100, color: '#ff0000'
            },
            {
              min: 100, max: 99999999, color: '#99004c'
            }
          ],
          "101-EmissionsValue": [
            {
              min: 0, max: 10, color: '#00e400'
            },
            {
              min: 10, max: 20, color: '#f3dd22'
            },
            {
              min: 20, max: 30, color: '#ff7e00'
            },
            {
              min: 30, max: 40, color: '#ff0000'
            },
            {
              min: 40, max: 99999999, color: '#99004c'
            }
          ],
          "065-EmissionsValue": [
            {
              min: 0, max: 20, color: '#00e400'
            },
            {
              min: 20, max: 50, color: '#f3dd22'
            },
            {
              min: 50, max: 100, color: '#ff7e00'
            },
            {
              min: 100, max: 200, color: '#ff0000'
            },
            {
              min: 200, max: 99999999, color: '#99004c'
            }
          ]
        }
        let currentEmissionsData = result.Datas[0].Data;
        // 01 - 烟尘， 02 - 二氧化硫， 03 - 氮氧化物
        // let data = currentEmissionsData.map(item => {
        let allData = result.Datas.map(itm => {
          itm.Data.map(item => {
            if (payload.PollutantType === 2) {
              valueInterval2["01-EmissionsValue"].map((interval, index) => {
                if (item["01-EmissionsValue"] >= interval.min && item["01-EmissionsValue"] < interval.max) {
                  item["01-EmissionsValue_color"] = interval.color;
                  item["01-EmissionsValue_level"] = index;
                }
              })
              valueInterval2["02-EmissionsValue"].map((interval, index) => {
                if (item["02-EmissionsValue"] >= interval.min && item["02-EmissionsValue"] < interval.max) {
                  item["02-EmissionsValue_color"] = interval.color;
                  item["02-EmissionsValue_level"] = index;
                }
              })
              valueInterval2["03-EmissionsValue"].map((interval, index) => {
                if (item["03-EmissionsValue"] >= interval.min && item["03-EmissionsValue"] < interval.max) {
                  item["03-EmissionsValue_color"] = interval.color;
                  item["03-EmissionsValue_level"] = index;
                }
              })
            } else {
              // const pollutantTypeListWater = [
        //   { name: 'COD', value: '011-EmissionsValue' },
        //   { name: '氨氮', value: '060-EmissionsValue' },
        //   { name: '总磷', value: '101-EmissionsValue' },
        //   { name: '总氮', value: '065-EmissionsValue' },
        // ]
              valueInterval1["011-EmissionsValue"].map((interval, index) => {
                if (item["011-EmissionsValue"] >= interval.min && item["011-EmissionsValue"] < interval.max) {
                  item["011-EmissionsValue_color"] = interval.color;
                  item["011-EmissionsValue_level"] = index;
                }
              })
              valueInterval1["060-EmissionsValue"].map((interval, index) => {
                if (item["060-EmissionsValue"] >= interval.min && item["060-EmissionsValue"] < interval.max) {
                  item["060-EmissionsValue_color"] = interval.color;
                  item["060-EmissionsValue_level"] = index;
                }
              })
              valueInterval1["101-EmissionsValue"].map((interval, index) => {
                if (item["101-EmissionsValue"] >= interval.min && item["101-EmissionsValue"] < interval.max) {
                  item["101-EmissionsValue_color"] = interval.color;
                  item["101-EmissionsValue_level"] = index;
                }
              })
              valueInterval1["065-EmissionsValue"].map((interval, index) => {
                if (item["065-EmissionsValue"] >= interval.min && item["065-EmissionsValue"] < interval.max) {
                  item["065-EmissionsValue_color"] = interval.color;
                  item["065-EmissionsValue_level"] = index;
                }
              })
            }

            return item;
          })
          return itm;
        })
        let data = allData[0].Data
        // let data = currentEmissionsData.map(item => {
        //   valueInterval2["01-EmissionsValue"].map((interval, index) => {
        //     if (item["01-EmissionsValue"] >= interval.min && item["01-EmissionsValue"] < interval.max) {
        //       item["01-EmissionsValue_color"] = interval.color;
        //       item["01-EmissionsValue_level"] = index;
        //     }
        //   })
        //   valueInterval2["02-EmissionsValue"].map((interval, index) => {
        //     if (item["02-EmissionsValue"] >= interval.min && item["02-EmissionsValue"] < interval.max) {
        //       item["02-EmissionsValue_color"] = interval.color;
        //       item["02-EmissionsValue_level"] = index;
        //     }
        //   })
        //   valueInterval2["03-EmissionsValue"].map((interval, index) => {
        //     if (item["03-EmissionsValue"] >= interval.min && item["03-EmissionsValue"] < interval.max) {
        //       item["03-EmissionsValue_color"] = interval.color;
        //       item["03-EmissionsValue_level"] = index;
        //     }
        //   })
        //   return item;
        // })
        console.log('allData=', allData);
        // return;
        console.log('data=', data);
        yield update({
          emissionsDataList: data,
          emissionsDataListALL: result.Datas,
          legendData: payload.PollutantType === 2 ? valueInterval2 : valueInterval1,
        })
      } else {
        message.error(result.Message)
      }
    },
  }
});
