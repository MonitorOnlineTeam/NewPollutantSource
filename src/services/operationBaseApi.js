/*
 * @Author: lzp
 * @Date: 2019-08-16 10:42:43
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:08:39
 * @Description: 运维记录接口
 */

import { async } from 'q';
import { post, get } from '@/utils/request';

// 获取表单类型根据mn号
export async function getrecordtypebymn(params) {
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetFormTypeByMN', params);
    return result === null ? {
        data: null
    } : result;
}
// 获取校准历史记录
export async function getjzhistoryinfo(params) {
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/GetJzHistoryInfo', params);
    return result === null ? {
        data: null
    } : result;
}
// 获取运维日志信息
export async function getOperationLogList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationPageList', params, null);
    return result === null ? {
      data: null
    } : result;
  }


