/*
 * @Author: Jiaqi
 * @Date: 2019-10-10 10:04:51
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-11-10 10:25:06
 * @desc: 主页model
 */
import moment from 'moment';
import * as services from '@/services/homeApi';
import * as commonApi from '@/services/commonApi';
import { getComparisonOfMonData } from '@/pages/IntelligentAnalysis/CO2Emissions/service';
import Model from '@/utils/model';
import { message } from 'antd';
import { result } from 'lodash';

export default Model.extend({
  namespace: 'home_ys',
  state: {
    theme: 'dark',
    allEntAndPointList: [],
    currentEntInfo: {},
    currentMarkersList: [],
    pollutantTypeList: [],
    isOnlyCO2: false,
    AllMonthEmissionsByPollutant: {
      beginTime: moment().format('YYYY-01-01 00:00:00'),
      endTime: moment()
        .add(1, 'years')
        .format('YYYY-MM-01 HH:mm:ss'),
      // beginTime: moment().add(2, 'years').format('YYYY-MM-01 HH:mm:ss'),
      // endTime: moment().add(3, 'years').format('YYYY-MM-01 HH:mm:ss'),
      pollutantCode: ['01', '02', '03', '30'],
      ycdate: [],
      ycdata: [],
      ycAnalData: [],
      eyhldate: [],
      eyhldata: [],
      eyhlAnalData: [],
      dyhwdate: [],
      dyhwdata: [],
      dyhwAnalData: [],
      eyhtdate: [],
      eyhtdata: [],
      eyhtAnalData: [],
    },
    // 智能质控
    rateStatisticsByEnt: {
      beginTime: moment().format('YYYY-MM-01 HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      rateData: [],
    },
    // 智能监控点数据
    pointData: {},
    // 报警信息参数
    warningInfoParams: {
      beginTime: moment().format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      entCode: null,
      pageIndex: 1,
      pageSize: 100,
      PollutantType: '2',
    },
    warningInfoList: [],
    // 运维 - 任务数量统计
    taskCountParams: {
      beginTime: moment().format('YYYY-MM-01 HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    taskCountData: {
      TaskSum: 0,
      CompletedTaskSum: 0,
      NoCompletedTaskSum: 0,
    },
    // 运维 - 智能预警
    operationsWarningParams: {
      beginTime: moment().format('YYYY-MM-01 HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    operationsWarningData: {},
    // 运维 - 异常报警及响应情况
    alarmAnalysisParams: {
      beginTime: moment().format('YYYY-MM-01 HH:mm:ss'),
      endTime: moment()
        .add(1, 'months')
        .format('YYYY-MM-01 HH:mm:ss'),
      aaData: [],
    },
    alarmAnalysis: {},
    // 超标汇总
    mounthOverDataParams: {
      beginTime: moment().format('YYYY-MM-01 00:00:00'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      EntCode: null,
      DGIMN: null,
    },
    mounthOverData: [],
    // 排污税
    taxInfo: {},
    homePage: null,
    GHGandEmissionContrastData: { allSumDis: 0, disSum: 0, disGHG: 0 },
    // 视频列表
    homeVideoList: [],
    paramsInfo: { '62030231rdep11': [], '62030231rdep12': [] },
    CO2RateAll: {},
    yanshiVisible: false,
    comparisonOfMonData: {
      lineAcc: [],
      lineDis: [],
      lineTime: [],
    },
  },
  effects: {
    *getHomePage({ payload }, { call, update, take }) {
      const result = yield call(services.getHomePage, payload);
      if (result.IsSuccess) {
        yield update({ homePage: result.Datas });
      }
    },
    // 获取企业及排口信息
    *getAllEntAndPoint({ payload }, { call, update, take, select }) {
      let global = yield select(state => state.global);
      if (!global.configInfo) {
        yield take('global/getSystemConfigInfo/@@end');
        global = yield select(state => state.global);
        payload = {
          PollutantTypes: global.configInfo.SystemPollutantType,
        };
      } else {
        payload = {
          PollutantTypes: global.configInfo.SystemPollutantType,
        };
      }
      const result = yield call(services.getAllEntAndPoint, { Status: [0, 1, 2, 3], ...payload });
      if (result.IsSuccess) {
        yield update({
          allEntAndPointList: result.Datas,
          // currentEntInfo: result.Datas[0],
          // currentMarkersList: result.Datas[0].children,
          currentMarkersList: result.Datas,
        });
      }
    },
    // 获取污染物类型
    *getPollutantTypeList({ payload }, { update, call }) {
      const result = yield call(commonApi.getPollutantTypeList, payload);
      if (result.IsSuccess) {
        yield update({
          pollutantTypeList: result.Datas,
        });
      }
    },

    // 获取智能质控数据 - 运行分析
    *getRateStatisticsByEnt({ payload }, { call, select, update }) {
      const rateStatisticsData = yield select(state => state.home.rateStatisticsByEnt);
      const postData = {
        ...rateStatisticsData,
        ...payload,
      };
      const result = yield call(services.getRateStatisticsByEnt, postData);
      if (result.IsSuccess) {
        yield update({
          rateStatisticsByEnt: {
            ...rateStatisticsData,
            rateData: result.Datas && result.Datas[0],
          },
        });
      }
    },

    // 智能监控数据
    *getStatisticsPointStatus({ payload }, { call, update }) {
      const result = yield call(services.getStatisticsPointStatus, payload);
      if (result.IsSuccess) {
        yield update({
          pointData: result.Datas,
        });
      }
    },

    *GetProcessFlowChartStatus({ payload }, { call, update, select }) {
      const result = yield call(services.GetProcessFlowChartStatus, payload);
      if (result.IsSuccess) {
        const paramsInfo = yield select(state => state.home.paramsInfo);
        let _paramsInfo = {
          ...paramsInfo,
          [payload.dgimn]: result.Datas.paramsInfo,
        };
        console.log('_paramsInfo', _paramsInfo);
        yield update({
          paramsInfo: _paramsInfo,
        });
      }
    },

    // 获取报警信息
    *getWarningInfo({ payload }, { call, update, select }) {
      const warningInfoParams = yield select(state => state.home.warningInfoParams);
      const postData = {
        ...warningInfoParams,
        ...payload,
      };
      const result = yield call(services.getWarningInfo, postData);
      if (result.IsSuccess) {
        let data = result.Datas
          ? result.Datas[0].map(item => {
              // return { "desc": `${item.PointName}：<span style="color: #ffcb5b">${item.PollutantName}</span> 从 <span style="color: #3ccafc">${item.FirstTime}</span> 发生了 <span style="color: #f30201; font-size: 16px">${item.AlarmCount}</span> 次报警。`, url: "" }
              if (item.AlarmType == 16) {
                // 配额超标报警
                let paramsData = item.PollutantName.split('|');
                return {
                  desc: (
                    <div>
                      <span style={{ fontWeight: 'bold' }}>{item.PointName}：</span>
                      <br />
                      <div style={{ marginLeft: 10 }}>
                        <span style={{ color: '#3ccafc' }}>{paramsData[0]}月</span>{' '}
                        核算法温室气体排放量为
                        <span style={{ color: '#f30201' }}>{paramsData[1]}</span>
                        <span style={{ color: '#ffcb5b' }}>
                          [{paramsData[2]}平均每月排放总额]
                        </span>{' '}
                        ，
                        <br />
                        <span style={{ color: '#f30201' }}>超出平均每月排放总额90%。</span>
                      </div>
                    </div>
                  ),
                  url: '',
                };
              }
              if (item.AlarmType == 17) {
                // 数据造假报警
                let paramsData = item.PollutantName.split('|');
                let time = '';
                if (paramsData.length && paramsData[0]) {
                  let times = paramsData[0].split('至');
                  time =
                    moment(times[0]).format('YYYY-MM-DD HH') +
                    '时 至 ' +
                    moment(times[1]).format('YYYY-MM-DD HH') +
                    '时';
                }
                return {
                  desc: (
                    <div>
                      <span style={{ fontWeight: 'bold' }}>{item.PointName}：</span>
                      <br />
                      <div style={{ marginLeft: 10 }}>
                        <span style={{ color: '#3ccafc', width: '100%', display: 'inline-block' }}>
                          {time}，
                        </span>
                        <br />
                        <span style={{ color: '#ffcb5b' }}>{paramsData[1]}</span>
                        分钟数据相似度超过80% ，
                        {/* <span style={{ color: '#ffcb5b' }}>[{paramsData[2]}平均每月排放总额]</span>, */}
                        <br />
                        <span style={{ color: '#f30201' }}>疑似为造假数据。</span>
                      </div>
                    </div>
                  ),
                  url: '',
                };
              }
              return {
                desc: (
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{item.PointName}：</span>
                    <br />
                    <div style={{ marginLeft: 10 }}>
                      <span style={{ color: '#ffcb5b' }}>{item.PollutantName}</span> 从
                      <span style={{ color: '#3ccafc' }}>{item.FirstTime}</span>
                      发生了
                      <span style={{ color: '#f30201', fontSize: 16 }}>{item.AlarmCount}</span>{' '}
                      次报警。
                    </div>
                  </div>
                ),
                url: '',
              };
            })
          : [];
        // "AlarmMsg": "[XX热力-电力电位1]实时功率为71.236KW，启停阈值为50KW，属于正常生产状态，关联的治污设施低温燃烧总电电源的实时功率为0KW，启停阈值为10KW，未正常运行,治污设施异常,首次异常时间：2022/7/15 1:00:00。",
        yield update({
          warningInfoList: [
            // {
            //   "desc": <div>
            //     <span style={{ fontWeight: 'bold' }}>XX热力-电力电位1：</span>
            //     <br />
            //     <div style={{ marginLeft: 10 }}>
            //       实时功率为
            //       <span style={{ color: '#ffcb5b' }}>71.236KW</span>,
            //       启停阈值为
            //       <span style={{ color: '#3ccafc' }}>50KW</span>,
            //       <br />
            //       属于正常生产状态，
            //       关联的治污设施低温燃烧总电电源的实时功率为0KW，
            //       <br />
            //       启停阈值为10KW，
            //       <span style={{ color: '#f30201' }}>未正常运行,治污设施异常</span>,
            //       <br />
            //       首次异常时间：
            //       <span style={{ color: '#3ccafc' }}>2022/7/15 1:00:00</span>。
            //     </div>
            //   </div>
            //   , url: ""
            // },
            // {
            //   "desc": <div>
            //     <span style={{ fontWeight: 'bold' }}>XX热力-电力电位1：</span>
            //     <br />
            //     <div style={{ marginLeft: 10 }}>
            //       实时功率为
            //       <span style={{ color: '#ffcb5b' }}>699.2KW</span>,
            //       启停阈值为
            //       <span style={{ color: '#3ccafc' }}>400KW</span>,
            //       <br />
            //       属于正常生产状态，
            //       关联的治污设施低温燃烧总电电源的实时功率为0KW，
            //       <br />
            //       启停阈值为1KW，
            //       <span style={{ color: '#f30201' }}>未正常运行,治污设施异常</span>,
            //       <br />
            //       首次异常时间：
            //       <span style={{ color: '#3ccafc' }}>2022/7/15 1:00:00</span>。
            //     </div>
            //   </div>
            //   , url: ""
            // },
            // {
            //   "desc": <div>
            //     <span style={{ fontWeight: 'bold' }}>XX热力-电力电位1：</span>
            //     <br />
            //     <div style={{ marginLeft: 10 }}>
            //       实时功率为
            //       <span style={{ color: '#ffcb5b' }}>58.99KW</span>,
            //       启停阈值为
            //       <span style={{ color: '#3ccafc' }}>50KW</span>,
            //       <br />
            //       属于正常生产状态，
            //       关联的治污设施低温燃烧总电电源的实时功率为0.069KW，
            //       <br />
            //       启停阈值为10KW，
            //       <span style={{ color: '#f30201' }}>未正常运行,治污设施异常</span>,
            //       <br />
            //       首次异常时间：
            //       <span style={{ color: '#3ccafc' }}>2022-07-14 23:00:00</span>。
            //     </div>
            //   </div>
            //   , url: ""
            // },
            ...data,
          ],
        });
      }
    },

    // 获取运维数据
    *getTaskCount({ payload }, { call, put, select, update }) {
      const taskCountParams = yield select(state => state.home.taskCountParams);
      const postData = {
        ...taskCountParams,
        ...payload,
      };
      // const result = yield call(services.getTaskCount, postData);
      // if (result.IsSuccess) {
      yield update({
        // taskCountData: result.Datas && result.Datas[0],
        taskCountData: {
          TaskSum: 46,
          CompletedTaskSum: 34,
          NoCompletedTaskSum: 12,
        },
      });
      // }
    },

    // 获取智能预警数据
    *getExceptionProcessing({ payload }, { call, put, update, select }) {
      const operationsWarningParams = yield select(state => state.home.operationsWarningParams);
      const postData = {
        ...operationsWarningParams,
        ...payload,
      };
      const result = yield call(services.getExceptionProcessing, postData);
      if (result.IsSuccess) {
        let data = result.Datas && result.Datas[0] ? result.Datas[0] : {};
        yield update({
          operationsWarningData: {
            ...data,
            ThisMonthEP: 5,
            ThisMonthHB: -1,
            ThisMonthTB: 2,
          },
        });
      }
    },

    // 获取运维 - 异常报警及相应情况
    *getAlarmAnalysis({ payload }, { call, update, select }) {
      const alarmAnalysisParams = yield select(state => state.home.alarmAnalysisParams);
      const postData = {
        ...alarmAnalysisParams,
        ...payload,
      };
      const result = yield call(services.getAlarmAnalysis, postData);
      if (result.IsSuccess) {
        let data = result.Datas && result.Datas[0] ? result.Datas[0] : {};
        yield update({
          alarmAnalysis: {
            ...data,
            // LessThan2Hour: 5,
            // GreaterThan8Hour: 0,
            // OtherTime: 0,

            LessThan2Hour: 24,
            GreaterThan8Hour: 12,
            OtherTime: 4,
            LessThan2Hourlink: -12,
            GreaterThan8Hourlink: -11,
            LessThan2HourlinkFlag: 0,
            GreaterThan8HourlinkFlag: 0,
          },
        });
      }
    },

    // 获取排污许可情况数据
    *getAllMonthEmissionsByPollutant({ payload }, { call, put, update, select }) {
      const { AllMonthEmissionsByPollutant } = yield select(state => state.home);
      let body = {
        beginTime: AllMonthEmissionsByPollutant.beginTime,
        endTime: AllMonthEmissionsByPollutant.endTime,
        // pollutantCode: AllMonthEmissionsByPollutant.pollutantCode,
        pollutantCode: ['a05001'],
        EntCode: payload.entCode,
        ...payload,
      };
      const response = yield call(services.GetAllMonthEmissionsByPollutant, body);
      if (response.IsSuccess && response.Datas) {
        // 判断是否只有二氧化碳
        let isOnlyCO2 = false;
        if (
          !response.Datas['01'] &&
          !response.Datas['02'] &&
          !response.Datas['03'] &&
          response.Datas['a05001']
        ) {
          isOnlyCO2 = true;
        }

        let ycdate = [];
        let ycdata = [];
        // 烟尘
        if (response.Datas['01']) {
          response.Datas['01'].monthList.map(ele => {
            ycdate.push(`${ele.DataDate.split('-')[1]}月`);
            ycdata.push(ele.Emissions.toFixed(2));
          });
        }
        let eyhldate = [];
        let eyhldata = [];
        // 二氧化硫
        if (response.Datas['02']) {
          response.Datas['02'].monthList.map(ele => {
            eyhldate.push(`${ele.DataDate.split('-')[1]}月`);
            eyhldata.push(ele.Emissions.toFixed(2));
          });
        }
        let dyhwdate = [];
        let dyhwdata = [];
        // 氮氧化物
        if (response.Datas['03']) {
          response.Datas['03'].monthList.map(ele => {
            dyhwdate.push(`${ele.DataDate.split('-')[1]}月`);
            dyhwdata.push(ele.Emissions.toFixed(2));
          });
        }
        let eyhtdate = [];
        let eyhtdata = [];
        // 二氧化碳
        if (response.Datas['a05001']) {
          response.Datas['a05001'].monthList.map(ele => {
            eyhtdate.push(`${ele.DataDate.split('-')[1]}月`);
            eyhtdata.push(ele.Emissions);
          });
        }
        console.log('response', response.Datas);
        yield update({
          isOnlyCO2: isOnlyCO2,
          AllMonthEmissionsByPollutant: {
            ...AllMonthEmissionsByPollutant,
            ycdate: ycdate,
            ycdata: ycdata,
            ycAnalData: response.Datas['01'] || {},
            eyhldate: eyhldate,
            eyhldata: eyhldata,
            eyhlAnalData: response.Datas['02'] || {},
            dyhwdate: dyhwdate,
            dyhwdata: dyhwdata,
            dyhwAnalData: response.Datas['03'] || {},
            eyhtdate: eyhtdate,
            eyhtdata: eyhtdata,
            eyhtAnalData: response.Datas['a05001'] || {},
          },
        });
      }
    },
    // 获取超标汇总
    *getMounthOverData({ payload }, { call, update, select }) {
      const mounthOverDataParams = yield select(state => state.home.mounthOverDataParams);
      const postData = {
        ...mounthOverDataParams,
        ...payload,
      };
      const result = yield call(services.getMounthOverData, postData);
      if (result.IsSuccess) {
        const mounthOverData = [];
        result.Datas[0].rtnVal.map(item => {
          switch (item.PollutantCode) {
            case '01':
              mounthOverData.push({
                ...item,
                pollutantName: '烟尘',
              });
              break;
            case '02':
              mounthOverData.push({
                ...item,
                pollutantName: '二氧化硫',
              });
              break;
            case '03':
              mounthOverData.push({
                ...item,
                pollutantName: '氮氧化物',
              });
              break;
            default:
              break;
          }
        });
        console.log('mounthOverData=', mounthOverData);
        yield update({
          mounthOverData,
        });
      }
    },

    // 排污税 - 所有企业
    *getAllTax({ payload }, { call, update, select }) {
      const result = yield call(services.getAllTax, payload);
      if (result.IsSuccess) {
        yield update({
          taxInfo: result.Datas || {},
        });
      }
    },
    // 排污税 - 单个企业
    *getEntTax({ payload }, { call, update, select }) {
      const result = yield call(services.getEntTax, payload);
      if (result.IsSuccess) {
        yield update({
          taxInfo: result.Datas || {},
        });
      }
    },
    // 排污税 - 单个排口
    *getPointTax({ payload }, { call, update, select }) {
      const result = yield call(services.getPointTax, payload);
      if (result.IsSuccess) {
        yield update({
          taxInfo: result.Datas || {},
        });
      }
    },
    // 年度排放量对比分析 - 碳排放
    *getGHGandEmissionContrast({ payload }, { call, update, select }) {
      const result = yield call(services.GetGHGandEmissionContrastOther, payload);
      if (result.IsSuccess) {
        yield update({
          GHGandEmissionContrastData: result.Datas,
        });
      }
    },
    // 获取首页视频列表
    *getHomePageVideo({ payload }, { call, update, select }) {
      const result = yield call(services.getHomePageVideo, {});
      if (result.IsSuccess) {
        console.log('homeVideoList', result.Datas);
        yield update({
          homeVideoList: result.Datas,
        });
      }
    },
    // 获取碳排放对比分析图
    *getComparisonOfMonData({ payload }, { call, update, select }) {
      const result = yield call(getComparisonOfMonData, payload);
      if (result.IsSuccess) {
        yield update({
          comparisonOfMonData: {
            lineAcc: result.Datas['Line-Acc'],
            lineDis: result.Datas['Line-Dis'],
            lineTime: result.Datas['Line-Time'],
          },
        });
      }
    },
  },
  reducers: {
    // 更新流速参数
    updateFlows(state, { payload }) {
      let data = payload.data;
      let currentDGIMN = data[0].DGIMN;

      if (state.paramsInfo[currentDGIMN] && state.paramsInfo[currentDGIMN].length) {
        let _paramsInfo = [...state.paramsInfo[currentDGIMN]];
        // let paramsInfo = _paramsInfo.filter(item => item.pollutantName.indexOf('流速') <= -1 && item.pollutantCode.indexOf('_') <= -1);;
        let paramsInfo = [];

        // let flows = [];
        // 找到推送过来的流速数据,重新加到数组中
        _paramsInfo.map(item => {
          let current = data.find(itm => itm.PollutantCode === item.pollutantCode);
          if (current) {
            paramsInfo.push({
              ...item,
              MonitorTime: current.MonitorTime,
              value: current.MonitorValue,
            });
          }
        });
        return {
          ...state,
          paramsInfo: {
            ...state.paramsInfo,
            [currentDGIMN]: paramsInfo,
          },
        };
      }
      return { ...state };
    },
  },
});
