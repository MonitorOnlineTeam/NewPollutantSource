// 运维任务列表
import moment from 'moment';
import { message } from 'antd';
import * as services from './service';
import Model from '@/utils/model';
import _ from 'lodash'
// import { EnumRequstResult } from '../utils/enum';

export default Model.extend({
  namespace: 'report',
  state: {
    dateReportForm: {
      PollutantSourceType: 1,
      current: 1,
      pageSize: 24,
      total: 0,
      DGIMN: [],
      ReportTime: moment().add(-1, 'day'),
      beginTime: null,
      endTime: null,
      reportType: { value: 'siteDaily' },

      // Regions: ["110000000", "110100000", "110101000"],
      // EntCode: "",
      // ReportTime: [moment(), moment()]
    },
    SmokeForm: {
      beginTime: null,
      endTime: null,
    },
    entAndPontList: [],
    pollutantList: [],
    pollutantTypeList: [],
    dateReportData: [],
    enterpriseList: [],
    dailySummaryDataList: [],
    statisticsReportDataList: [],
    EntSewageList: [],
    StatisticsReportDataWhere: {
      MonitorTime: moment().add(-1, 'month'),
      EntList: [],
      PageIndex: 1,
      PageSize: 10,
      beginTime: moment().add(-1, 'month').format('YYYY-MM-01 00:00:00'),
      endTime: moment(moment().format('YYYY-MM-01 00:00:00')).add(-1, 'second').format('YYYY-MM-DD 23:59:59'),
      // aaa:moment(moment().format('YYYY-MM-01 00:00:00')).add(1,"month").format('YYYY-MM-01 23:59:59'),
      total: 0,
    },
    // 烟气报表 ----- 开始
    smokeReportFrom: {
      current: 1,
      pageSize: 34,
      total: 0,
    },
    smokeReportData: [],
    pointName: '',
    Total: 0,
    // 烟气报表 ----- 结束
    // 二氧化碳报表 - 开始
    entByRegionAndAttList: [],
    // 二氧化碳报表 - 结束
  },

  effects: {
    // 获取污染物 - 表头
    * getPollutantList({
      payload,
    }, { call, update, select }) {
      const result = yield call(services.getPollutantList, payload);
      if (result.IsSuccess) {
        const columns = result.Datas.map(item => {
          const unit = item.unit ? `(${item.unit})` : ''
          return {
            title: <>{item.name}<br />{unit}</>,
            dataIndex: item.name,
            align: 'center',
            flag: 'pollutant'
          }
        })
        yield update({
          pollutantList: [
            // {
            //   title: "时间",
            //   dataIndex: 'time',
            // },
            ...columns,
          ],
        })
        payload.callback && payload.callback()
      }
    },
    // 获取站点日报数据
    * getDateReportData({
      payload, reportType,
    }, { call, update, select }) {
      const dateReportForm = yield select(state => state.report.dateReportForm)

      // let _props = {};
      // let startFormat = "YYYY-MM-DD";
      // let endFormat = "YYYY-MM-DD";
      // if (dateReportForm.PollutantSourceType.value == 5) {
      //   // let days = moment(dateReportForm.airReportTime.value[1]).daysInMonth();
      //   if (payload.type === "monthly") {
      //     startFormat = "YYYY-MM-01 00:00:00"
      //     endFormat = `YYYY-MM-01 00:00:00`
      //   }
      //   if (payload.type === "annals") {
      //     startFormat = "YYYY-01-01 00:00:00"
      //     endFormat = `YYYY-01-01 00:00:00`
      //   }
      // }
      // if (dateReportForm.PollutantSourceType && dateReportForm.PollutantSourceType.value == 5) {
      //   _props = {
      //     BeginTime: dateReportForm.airReportTime && dateReportForm.airReportTime.value[0] && moment(dateReportForm.airReportTime.value[0]).format(startFormat),
      //     EndTime: dateReportForm.airReportTime && dateReportForm.airReportTime.value[1] && moment(dateReportForm.airReportTime.value[1]).format(endFormat),
      //     ReportTime: moment().format("YYYY-MM-DD"),
      //   }
      // } else {
      //   _props = {
      //     ReportTime: dateReportForm.ReportTime && moment(dateReportForm.ReportTime.value).format("YYYY-MM-DD"),
      //   }
      // }
      const postData = {
        PageIndex: dateReportForm.current,
        IsPage: 1,
        ...payload,
      }
      const serviceApi = reportType === 'siteDaily' ? services.getSiteDailyDayReport : (reportType === 'monthly' ? services.getMonthlyReport : services.getAnnalsReport)
      const result = yield call(serviceApi, postData);
      if (result.IsSuccess) {
        let data = [];
        if (result.Datas.length) {
          data = result.Datas.map(item => {
            let variate = [];
            variate = item.Datas.map(itm => ({ ...itm, pointName: item.PointName, entName: item.EntName, rowSpan: item.Datas.length + 3 }))
            // 大气和扬尘不显示最大最小平均值
            if (dateReportForm.PollutantSourceType.value != 5 && dateReportForm.PollutantSourceType.value != 12) {
              variate.concat([ // 将最大、最小、平均值放入数据源中
                { ...item.MinVal[0], pointName: item.PointName, time: '最小值' },
                { ...item.MaxVal[0], pointName: item.PointName, time: '最大值' },
                { ...item.AvgVal[0], pointName: item.PointName, time: '平均值' },
              ])
            }
            return variate;
          }).reduce((acc, cur) => acc.concat(cur))
        }
        // console.log('data=',data)
        // message.success("统计成功！")
        yield update({
          dateReportData: data,
          dateReportForm: {
            ...dateReportForm,
            total: result.Total,
          },
        })
      } else {
        message.error(result.Message)
      }
    },

    // 获取系统污染物
    * getPollutantTypeList({
      payload, callback,
    }, { call, update, select }) {
      const result = yield call(services.getPollutantTypeList, payload);
      if (result.IsSuccess) {
        const dateReportForm = yield select(state => state.report.dateReportForm);
        yield update({
          pollutantTypeList: result.Datas,
          dateReportForm: {
            ...dateReportForm,
            PollutantSourceType: result.Datas.length && {
              value: result.Datas[0].pollutantTypeCode,
            },
          },
        })
        callback && callback(result)
      }
    },

    // 获取企业
    * getEnterpriseList({
      payload,
    }, { call, update, select }) {
      const result = yield call(services.getEnterpriseList, payload);
      if (result.IsSuccess) {
        const dateReportForm = yield select(state => state.report.dateReportForm);
        yield update({
          enterpriseList: result.Datas,
          dateReportForm: {
            ...dateReportForm,
            EntCode: result.Datas.length && {
              value: result.Datas[0].ParentCode,
            },
          },
        })
        payload.callback && payload.callback(result)
      }
    },
    // 获取汇总日报数据
    * getDailySummaryDataList({
      payload, reportType,
    }, { call, update, select }) {
      // const summaryForm = yield select(state => state.report.summaryForm);
      // let serviceApi = reportType === 'daily' ? services.getDailySummaryList : (reportType === 'monthly' ? services.getSummaryMonthReport : services.getSummaryYearReport)
      let serviceApi = '';
      switch (reportType) {
        case 'daily':
          serviceApi = services.getDailySummaryList;
          break;
        case 'monthly':
          serviceApi = services.getSummaryMonthReport;
          break;
        case 'annals':
          serviceApi = services.getSummaryYearReport;
          break;
        case 'week':
          serviceApi = services.getSummaryWeekReport;
          break;
        case 'quarter':
          serviceApi = services.getSummaryQuarterReport;
          break;
      }
      const result = yield call(serviceApi, {
        ...payload,
        // BeginTime: summaryForm.beginTime,
        // EndTime: summaryForm.endTime
      });
      if (result.IsSuccess) {
        let data = [];
        if (result.Datas.length) {
          data = result.Datas.map(item =>
            // return { ...item, EntName: item.EntName}
            ({ EntName: item.EntName, ...item.DatasItem }),
          )
        }
        yield update({
          dailySummaryDataList: data,
          Total: result.Total,
        })
      }
    },
    // 报表导出
    * reportExport({ payload }, { call, update, select }) {
      const dateReportForm = yield select(state => state.report.dateReportForm)
      const result = yield call(services.reportExcel, payload);
      if (result.IsSuccess) {
        result.Datas && window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 汇总报表导出
    * summaryReportExcel({ payload }, { call, update, select }) {
      const summaryForm = yield select(state => state.report.summaryForm)
      const result = yield call(services.summaryReportExcel, payload);
      if (result.IsSuccess) {
        result.Datas && window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 数据上报报表
    *getStatisticsReportDataList({ payload }, { call, update, select }) {
      const params = yield select(a => a.report.StatisticsReportDataWhere);
      const result = yield call(services.getStatisticsReportDataList, params);
      yield update({ statisticsReportDataList: result.Datas, total: result.Total })
    },
    // 污水处理厂列表
    *getEntSewageList({ payload }, { call, update }) {
      const result = yield call(services.getEntSewageList, payload);
      yield update({ EntSewageList: result.Datas })
    },
    // 汇总报表导出
    * getStatisticsReportDataExcel({ payload }, { call, update, select }) {
      const params = yield select(a => a.report.StatisticsReportDataWhere);

      const result = yield call(services.getStatisticsReportDataExcel, { ...params, PageIndex: null, PageSize: null });
      if (result.IsSuccess) {
        result.Datas && window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取企业及排口
    *getEntAndPoint({ payload }, { call, update, put }) {
      const result = yield call(services.getEntAndPoint, payload);
      if (result.IsSuccess) {
        const filterData = result.Datas.filter(item => {
          if (item.children.length) {
            const children = item.children.map(itm => {
              const obj = itm;
              delete obj.children;
              return { ...obj }
            })
            return {
              ...item,
              children,
            }
          }
        })
        yield update({
          entAndPointList: filterData,
          defaultEntAndPoint: [filterData[0].key, filterData[0].children[0].key],
          pointName: filterData[0].children[0].title,
        })
        // 获取数据
        yield put({
          type: 'getSmokeReportData',
          payload: {
            DGIMN: filterData[0].children[0].key,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            dataType: payload.reportType,
          },
        })
      } else {
        message.error(result.Message)
      }
    },

    // 获取报表数据
    *getSmokeReportData({ payload }, { call, update, select }) {
      const SmokeForm = yield select(a => a.report.SmokeForm);
      const result = yield call(services.getSmokeReportData,
        { ...payload, BeginTime: SmokeForm.beginTime, EndTime: SmokeForm.endTime });
      if (result.IsSuccess) {
        yield update({
          smokeReportData: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 烟气报表导出
    *exportSmokeReport({ payload }, { call, update, select }) {
      const SmokeForm = yield select(a => a.report.SmokeForm);
      const result = yield call(services.exportSmokeReport,
        { ...payload, BeginTime: SmokeForm.beginTime, EndTime: SmokeForm.endTime });
      if (result.IsSuccess) {
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

    // 站点报表 - 获取企业及排口
    *getPointReportEntAndPointList({ payload, callback }, { call, update }) {
      const result = yield call(services.getEntAndPoint, payload);
      if (result.IsSuccess) {
        const filterData = result.Datas.filter(item => {
          if (item.children.length) {
            const children = item.children.map(itm => {
              const obj = itm;
              delete obj.children;
              return { ...obj }
            })
            return {
              ...item,
              children,
            }
          }
        })
        yield update({
          entAndPontList: filterData,
        })
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

    // 二氧化碳 - 获取企业列表
    *getEntByRegionAndAtt({ payload }, { call, put, update, select }) {
      const result = yield call(services.getEntByRegionAndAtt, payload)
      if (result.IsSuccess) {
        yield update({
          entByRegionAndAttList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取烟气报表表头
    *getReportColumns({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.getReportColumns, payload)
      if (result.IsSuccess) {
        let data = _.sortBy(result.Datas, function (o) { return o.SortCode; });
        callback && callback(data)
      } else {
        message.error(result.Message)
      }
    },
  },
});
