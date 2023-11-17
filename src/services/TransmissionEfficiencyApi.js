/**
 * 功  能：传输有效率相关接口
 * 创建人：吴建伟
 * 创建时间：2019.8.12
 */

import { post } from '@/utils/request';

/**
 * 【传输有效率】获取一个或多个排口传输有效率等等
 * @params {"DGIMNs": ["sgjt001003","sgjt001004"],"beginTime":"2018-11-01 00:00:00","endTime":"2018-11-30 00:00:00"}
 */
export async function getMonthsTransmissionEfficiency(params) {

    const result = post('/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetTransmissionEfficiencyForPoints', params, null);

    return result;
}

/**
 * 【传输有效率】获取一个或多个排口传输有效率等等
 * @params {"DGIMNs": ["sgjt001003","sgjt001004"],"beginTime":"2018-11-01 00:00:00","endTime":"2018-11-30 00:00:00"}
 */
export async function getEntMonthsTransmissionEfficiency(params) {


    const result = post('/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetTransmissionEfficiencyForEnterprises', params, null);

    return result;
}

///导出数据
export async function ExportData(params) {
    const result = post('/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/ExportData', params, null);
    return result;
}

///重新统计传输有效率
export async function RecalculateTransmissionEfficiency(params) {
    const result = post('/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/RecalculateTransmissionEfficiency', params, null);
    return result;
}
