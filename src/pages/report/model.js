//运维任务列表
import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';
// import { EnumRequstResult } from '../utils/enum';

export default Model.extend({
  namespace: 'report',
  state: {
    dateReportForm: {
      PollutantSourceType: 1,
      current: 1,
      pageSize: 27,
      total: 0,
      EntCode: "",
      // Regions: ["110000000", "110100000", "110101000"],
      // EntCode: "",
      ReportTime: moment()
    },
    pollutantList: [],
    pollutantTypeList: [],
    dateReportData: [],
    enterpriseList: [],
    dailySummaryDataList: []
  },

  effects: {
    // 获取污染物 - 表头
    * getPollutantList({
      payload,
    }, { call, update, select }) {
      const result = yield call(services.getPollutantList, payload);
      if (result.IsSuccess) {
        const columns = result.Datas.map(item => {
          return {
            title: item.title,
            dataIndex: item.name
          }
        })
        yield update({
          pollutantList: [
            // {
            //   title: "时间",
            //   dataIndex: 'time',
            // },
            ...columns
          ]
        })
        payload.callback && payload.callback()
      }
    },
    // 获取站点日报数据
    * getDateReportData({
      payload
    }, { call, update, select }) {
      const dateReportForm = yield select(state => state.report.dateReportForm)
      const postData = {
        // ...payload,
        PollutantSourceType: dateReportForm.PollutantSourceType && dateReportForm.PollutantSourceType.value,
        ReportTime: dateReportForm.ReportTime && moment(dateReportForm.ReportTime.value).format("YYYY-MM-DD"),
        Regions: dateReportForm.Regions && dateReportForm.Regions.value.toString(),
        EntCode: dateReportForm.EntCode && dateReportForm.EntCode.value,
        PageIndex: dateReportForm.current && dateReportForm.current,
        IsPage: 1,
        ...payload
      }
      let serviceApi = payload.type === "siteDaily" ? services.getSiteDailyDayReport : (payload.type === "monthly" ? services.getMonthlyReport : services.getAnnalsReport)
      const result = yield call(serviceApi, postData);
      if (result.IsSuccess) {
        let data = [];
        if (result.Datas.length) {
          data = result.Datas.map(item => {
            return item.Datas.map(itm => {
              return { ...itm, pointName: item.PointName, rowSpan: item.Datas.length + 3 }
            }).concat([ // 将最大、最小、平均值放入数据源中
              { ...item.MinVal[0], pointName: item.PointName, time: "最小值" },
              { ...item.MaxVal[0], pointName: item.PointName, time: "最大值" },
              { ...item.AvgVal[0], pointName: item.PointName, time: "平均值" },
            ])
          }).reduce((acc, cur) => acc.concat(cur))
        }
        // console.log('data=',data)
        // message.success("统计成功！")
        yield update({
          dateReportData: data,
          dateReportForm: {
            ...dateReportForm,
            total: result.Total
          }
        })
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
        const dateReportForm = yield select(state => state.report.dateReportForm);
        yield update({
          pollutantTypeList: result.Datas,
          dateReportForm: {
            ...dateReportForm,
            PollutantSourceType: result.Datas.length && {
              value: result.Datas[0]["pollutantTypeCode"]
            }
          }
        })
        callback && callback(result)
      }
    },

    // 获取企业
    * getEnterpriseList({
      payload
    }, { call, update, select }) {
      const result = yield call(services.getEnterpriseList, { regionCode: payload.regionCode });
      if (result.IsSuccess) {
        const dateReportForm = yield select(state => state.report.dateReportForm);
        yield update({
          enterpriseList: result.Datas,
          dateReportForm: {
            ...dateReportForm,
            EntCode: result.Datas.length && {
              value: result.Datas[0]["ParentCode"]
            }
          }
        })
        payload.callback && payload.callback(result)
      }
    },
    // 获取汇总日报数据
    * getDailySummaryDataList({
      payload
    }, { call, update }) {
      let serviceApi = payload.type === "daily" ? services.getDailySummaryList : (payload.type === "monthly" ? services.getSummaryMonthReport : services.getSummaryYearReport)
      const result = yield call(serviceApi, payload);
      if (result.IsSuccess) {
        let data = [];
        if (result.Datas.length) {
          data = result.Datas.map(item => {
            return item.Datas.map(itm => {
              return { ...itm, EntName: item.EntName, rowSpan: item.Datas.length }
            })
          }).reduce((acc, cur) => acc.concat(cur))
        }
        yield update({
          dailySummaryDataList: data
        })
      }
    },
    // 报表导出
    * reportExport({ payload }, { call, update }) {
      const result = yield call(services.reportExcel, payload);
      if (result.IsSuccess) {
        result.Datas && window.open(result.Datas)
      } else {
        message.error(result.message)
      }
    },
    // 汇总报表导出
    * summaryReportExcel({ payload }, { call, update }) {
      const result = yield call(services.summaryReportExcel, payload);
      if (result.IsSuccess) {
        result.Datas && window.open(result.Datas)
      } else {
        message.error(result.message)
      }
    }
  },
});
