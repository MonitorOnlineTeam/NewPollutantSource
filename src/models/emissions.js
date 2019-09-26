/*
 * @Author: JianWei
 * @Date: 2019-09-25
 * @decription: 排放量统计
 * @Last Modified by: JianWei
 * @Last Modified time: 2019-09-25
 */
import { message } from 'antd';
import Model from '@/utils/model';
import moment from 'moment';
import * as services from '@/services/emissionsApi';
import { sdlMessage } from '@/utils/utils';

export default Model.extend({
    namespace: 'emissions',
    state: {
        pageSize: 20,
        pageIndex: 1,
        pointTableDatas: [],
        pointDaysDatas: [],
        enterpriseCodes: [],
        pollutantCodes: ['01'],
        selectedDate: moment().format('YYYY-MM-01 00:00:00'),
        clickDate: moment().format('YYYY-MM-01 00:00:00'),
        beginTime: moment().format('YYYY-01-01 00:00:00'),
        endTime: moment().add(1, 'years').format('YYYY-01-01 00:00:00'),
        monthTime: moment().format('YYYY-MM-01 00:00:00'),
        emissionsSort: '',
        xAxisData: [],
        seriesData: [],
        queryDGIMNs: '',
        enttableDatas: [],
        entxAxisData: [],
        entseriesData: [],
        currFlag: 1,
        entName: ''
    },
    effects: {

        * getEntChartData({ payload }, { call, put, update, select }) {
            const { beginTime, endTime, pollutantCodes } = yield select(state => state.emissions);
            let body = {
                BeginTime: beginTime,
                EndTime: endTime,
                PollutantCodes: pollutantCodes,
            };
            const response = yield call(services.getAllMonthEntPollutantEmissions, body);
            if (response.IsSuccess) {
                let data = response.Datas;
                let XAxisData = [];
                let SeriesData = [];
                response.Datas && data.map((ele) => {
                    XAxisData.push(ele.DataDate.split('-')[1] + '月');
                    SeriesData.push(ele.Emissions.toFixed(6));
                });
                yield update({
                    entxAxisData: XAxisData,
                    entseriesData: SeriesData
                });
            }
        },
        * getEntsData({ payload }, { call, put, update, select }) {
            const { clickDate, pollutantCodes } = yield select(state => state.emissions);
            let body = {
                MonthTime: clickDate,
                PollutantCodes: pollutantCodes,
            };
            const response = yield call(services.getSingleMonthEntPollutantEmissions, body);
            if (response.IsSuccess && response.Datas) {
                yield update({
                    enttableDatas: response.Datas
                });
            }
        },
        * getPointChartData({ payload }, { call, put, update, select }) {
            const { beginTime, endTime, pollutantCodes, enterpriseCodes } = yield select(state => state.emissions);
            let body = {
                EnterpriseCodes: enterpriseCodes,
                BeginTime: beginTime,
                EndTime: endTime,
                PollutantCodes: pollutantCodes,
            };
            const response = yield call(services.getAllMonthPointPollutantEmissions, body);
            if (response.IsSuccess && response.Datas) {
                let data = response.Datas;
                let XAxisData = [];
                let SeriesData = [];
                data && data.map((ele) => {
                    XAxisData.push(ele.DataDate.split('-')[1] + '月');
                    SeriesData.push(ele.Emissions.toFixed(6));
                });
                yield update({
                    xAxisData: XAxisData,
                    seriesData: SeriesData
                });
            }
        },

        * getPointsData({ payload }, { call, put, update, select }) {
            const { clickDate, pollutantCodes, enterpriseCodes } = yield select(state => state.emissions);
            let body = {
                EnterpriseCodes: enterpriseCodes,
                MonthTime: clickDate,
                PollutantCodes: pollutantCodes,
            };
            const response = yield call(services.getSingleMonthAllPointEmissions, body);
            if (response.IsSuccess && response.Datas) {
                yield update({
                    pointTableDatas: response.Datas
                });
            }
        },

        * getPointDaysData({ payload }, { call, put, update, select }) {
            const { clickDate, pollutantCodes, queryDGIMNs, enterpriseCodes } = yield select(state => state.emissions);
            let body = {
                EnterpriseCodes: enterpriseCodes,
                MonthTime: clickDate,
                DGIMN: queryDGIMNs,
                PollutantCodes: pollutantCodes,
            };
            const response = yield call(services.getSinglePointDaysEmissions, body);

            if (response.IsSuccess && response.Datas) {
                yield update({
                    pointDaysDatas: response.Datas
                });
            }
        },


    }
});
