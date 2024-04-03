import moment from 'moment';
import * as services from '../services/customerSatisfacQuery';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
    namespace: 'customerSatisfacQuery',
    state: {
        tableDatas: [],
        tableLoading: false,
        tableTotal: 0,
        queryPar: {},
        serviceDispatchTypeAndRecordData: [],
    },
    effects: {
        *GetSatisfactionSurveyList({ payload, callback }, { call, put, update }) { //获取客户满意度调查信息
            const result = yield call(services.GetSatisfactionSurveyList, payload);
            if (result.IsSuccess) {
                yield update({
                    queryPar: payload,
                    tableDatas: result.Datas,
                    tableTotal: result.Total,
                })
            } else {
                message.error(result.Message)
            }
        },
        *ExportSatisfactionSurvey({ callback, payload }, { call, put, update, select }) { //客户满意度调查信息 导出
            const response = yield call(services.ExportSatisfactionSurvey, { ...payload });
            if (response.IsSuccess) {
                message.success('下载成功');
                downloadFile(`${response.Datas}`);
            } else {
                message.warning(response.Message);
            }
        },
        *SubmitSurvey({ payload, callback }, { call, put, update }) { //客户满意度调查 提交
            const result = yield call(services.getServiceDispatchTypeAndRecord, payload);
            if (result.IsSuccess) {
                callback && callback(result.Datas)
            } else {
                message.error(result.Message)
            }
        },
        *SubmitProcessed({ payload, callback }, { call, put, update }) { // 客户满意度调查 处理
            const result = yield call(services.SubmitProcessed, payload);
            if (result.IsSuccess) {
                callback && callback(result.Datas)
            } else {
                message.error(result.Message)
            }
        },
        *SubmitRermination({ payload, callback }, { call, put, update }) { // 客户满意度调查 终止处理
            const result = yield call(services.SubmitRermination, payload);
            if (result.IsSuccess) {
                callback && callback(result.Datas)
            } else {
                message.error(result.Message)
            }
        },
        *TransmitSurvey({ payload, callback }, { call, put, update }) { // 客户满意度 转发
            const result = yield call(services.TransmitSurvey, payload);
            if (result.IsSuccess) {
                callback && callback(result.Datas)
            } else {
                message.error(result.Message)
            }
        },
      






    }
})