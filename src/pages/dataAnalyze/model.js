//运维任务列表
import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'dataAnalyze',
  state: {
    pollutantList: [],
    defaultPollutant: [],
    siteParamsData: {
      timeList: [],
      tableList: [],
      chartList: [],
    },
    multiSiteParamsData: {
      timeList: [],
      tableList: [],
      chartList: [],
    },
    pollutantTypeList: [],
    enterpriseList: [],
    dataGainRateColumn: [],
    dataGainRateTableData: [],
    pollutantlist: [],
    chartAndTableData: [],
    reportTableData: [],
    compositeIndexDataSource: [],
    compositeRangeDataSource: [],
    compositeyoyRangeDataSource: [],
    compositeContrastDataSource: [],
    excellentDaysReportData: [],
    airDayRank: [],
    addUpAirDayRank: [],
    compareWaterTableData: [],

    // 电力
    // 功率数据
    powerData: {
      // 峰值功率
      peakPower: {
        peakPowerN: {
          value: '0',
          time: '-'
        },
        peakPowerY: {
          value: '0',
          time: '-'
        }
      },
      // 功率图表数据
      chartData: {
        timeList: [],
        nlist: [],
        ylist: [],
      },
      // 用电量峰值
      peakYDL: {
        PeackUseElectricityN: {
          value: '0',
          time: '-'
        },
        PeackUseElectricityY: {
          value: '0',
          time: '-'
        }
      },
    },
    // 电能环比数据
    electricChainData: {
      Day: { trend: [] },
      Month: { trend: [] },
      Year: { trend: [] },
    },
    // 电能趋势
    electricTrendData: {}
  },

  effects: {
    // 获取污染物
    *getPollutantList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getPollutantList, payload);
      if (result.IsSuccess) {
        let defaultValue = [];
        if (result.Datas.length) {
          // defaultValue = result.Datas.length >= 2 ? [result.Datas[0].PollutantCode, result.Datas[1].PollutantCode] : [result.Datas[0].PollutantCode]
          result.Datas.map((item, index) => {
            if (item && index < 7) {
              defaultValue.push(item.PollutantCode)
            }
          })
        }
        callback && callback(result.Datas)
        yield update({
          pollutantList: result.Datas,
          defaultPollutant: defaultValue
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取图表及表格数据
    *getChartAndTableData({ payload }, { call, put, update }) {
      const result = yield call(services.getChartAndTableData, payload);
      if (result.IsSuccess) {
        if (payload.Type === "0") {
          // 单站多参
          yield update({
            siteParamsData: {
              ...result.Datas
            }
          })
        } else {
          // 多站多参
          yield update({
            multiSiteParamsData: {
              ...result.Datas
            }
          })
        }
      } else {
        message.error(result.Message)
      }
    },
    // 导出
    *export({ payload }, { call, put, update }) {
      const result = yield call(services.exportData, payload);
      if (result.IsSuccess) {
        window.open(result.Datas);
        message.success("导出成功")
      } else {
        message.error(result.Message)
      }
    },
    // 获取系统污染物
    * getPollutantTypeList({
      payload, callback
    }, { call, update, select }) {
      const result = yield call(services.getPollutantTypeList, payload);
      if (result.IsSuccess) {
        yield update({
          pollutantTypeList: result.Datas,
        })
        callback && callback(result)
      }
    },
    // 获取企业
    * getEnterpriseList({
      payload
    }, { call, update, select }) {
      const result = yield call(services.getEnterpriseList, payload);
      if (result.IsSuccess) {
        yield update({
          enterpriseList: result.Datas,
        })
        payload.callback && payload.callback(result)
      }
    },
    // 获取数据获取率 - 表头
    * getDataGainRateColumn({
      payload
    }, { call, update, select }) {
      const result = yield call(services.getDataGainRateColumn, payload);
      if (result.IsSuccess) {
        yield update({
          dataGainRateColumn: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取数据获取率 - table数据
    * getDataGainRateTableData({
      payload, callback
    }, { call, update, select }) {
      const result = yield call(services.getDataGainRateTableData, payload);
      if (result.IsSuccess) {
        yield update({
          dataGainRateTableData: result.Datas
        })
        callback && callback()
      } else {
        message.error(result.Message)
      }
    },
    // 获取数据获取率 - 详情污染物列表
    *querypollutantlist({ payload }, { call, put, update }) {
      const result = yield call(services.getDataGainRateDetailPollutantList, payload);
      if (result.IsSuccess) {
        yield update({
          pollutantlist: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取数据获取率 - 详情数据
    *queryhistorydatalist({ payload }, { call, put, update }) {
      const result = yield call(services.queryhistorydatalist, payload);
      if (result.IsSuccess) {
        yield update({
          chartAndTableData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取报表数据
    *getGasReport({ payload }, { call, put, update }) {
      const result = yield call(services.getGasReport, payload);
      if (result.IsSuccess) {
        yield update({
          reportTableData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 导出
    *exportGasReport({ payload }, { call, put, update }) {
      const result = yield call(services.exportGasReport, payload);
      if (result.IsSuccess) {
        window.open(result.Datas);
        message.success("导出成功")
      } else {
        message.error(result.Message)
      }
    },
    // 获取综合指数报表数据
    *getCompositeIndexDataSource({ payload, reportType }, { call, put, update }) {
      const api = reportType === "month" ? services.getMonthComposite : services.getYearComposite;
      const result = yield call(api, payload);
      if (result.IsSuccess) {
        yield update({
          compositeIndexDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },

    // 导出综合指数报表
    *exportCompositeReport({ payload, reportType }, { call, put, update }) {
      const api = reportType === "month" ? services.exportMonthComposite : services.exportYearComposite;
      const result = yield call(api, payload);
      if (result.IsSuccess) {
        message.success("导出成功")
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取综合指数范围报表数据
    *queryCompositeRangeData({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.queryCompositeRangeData, payload);
      if (result.IsSuccess) {
        yield update({
          compositeRangeDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取综合指数范围同比报表数据
    *queryCompositeyoyRangeData({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.queryCompositeyoyRangeData, payload);
      if (result.IsSuccess) {
        yield update({
          compositeyoyRangeDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 导出 - 综合指数范围同比报表数据
    *exportCompositeyoyRangeData({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.exportCompositeyoyRangeData, payload);
      if (result.IsSuccess) {
        message.success("导出成功")
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 导出综合指数报表
    *exportRangeCompositeReport({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.exportRangeCompositeReport, payload);
      if (result.IsSuccess) {
        message.success("导出成功")
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取综合指数对比报表数据
    *queryCompositeRangeContrastData({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.queryCompositeRangeContrastData, payload);
      if (result.IsSuccess) {
        yield update({
          compositeContrastDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 导出综合指数对比报表数据
    *exportCompositeRangeContrast({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.exportCompositeRangeContrast, payload);
      if (result.IsSuccess) {
        message.success("导出成功")
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

    // 获取优良天数报表 - 数据
    *getExcellentDaysReport({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.getExcellentDaysReport, payload);
      if (result.IsSuccess) {
        yield update({
          excellentDaysReportData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 优良天数报表 - 导出
    *excellentDaysExportReport({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.excellentDaysExportReport, payload);
      if (result.IsSuccess) {
        message.success("导出成功")
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取空气质量日排名 - 数据
    *getAirDayRank({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.getAirDayRank, payload);
      if (result.IsSuccess) {
        yield update({
          airDayRank: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 优良天数报表 - 导出
    *exportAirDayRank({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.exportAirDayRank, payload);
      if (result.IsSuccess) {
        message.success("导出成功")
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取累计综合空气质量排名 - 数据
    *getAddUpAirRank({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.getAddUpAirRank, payload);
      if (result.IsSuccess) {
        yield update({
          addUpAirDayRank: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 累计综合空气质量排名 - 导出
    *exportAddUpAirRank({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.exportAddUpAirRank, payload);
      if (result.IsSuccess) {
        message.success("导出成功")
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 站点平均值对比分析 - 数据
    *getCompareWater({ payload, reportType }, { call, put, update }) {
      const result = yield call(services.getCompareWater, payload);
      if (result.IsSuccess) {
        yield update({
          compareWaterTableData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取监测同比分析数据 - 功率相关
    *GetPowerWork({ payload }, { call, put, update }) {
      const result = yield call(services.GetPowerWork, payload);
      if (result.IsSuccess) {
        yield update({
          powerData: {
            peakPower: result.Datas.peakPower, // 峰值功率
            chartData: result.Datas.PowerCurve, // 功率图表数据
            peakYDL: result.Datas.PeackUseElectricity, // 用电量峰值
          },
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取电能环比
    *GetPowerCompare({ payload }, { call, put, update }) {
      const result = yield call(services.GetPowerCompare, payload);
      if (result.IsSuccess) {
        yield update({
          electricChainData: result.Datas.ESequential
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取电能趋势
    *GetPowerTrend({ payload }, { call, put, update }) {
      const result = yield call(services.GetPowerTrend, payload);
      if (result.IsSuccess) {
        yield update({
          electricTrendData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
  }
});
