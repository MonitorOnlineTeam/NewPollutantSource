import { post } from '@/utils/request';


/** 获取单排口报警数据
 * {
        DGIMN: "51052216080301",
        pollutantCode: "zs01",
        beginTime: "2019-3-1",
        endTime: "2019-3-2",
        pageIndex: 1,
        pageSize: 10
    }
 *  */
export async function queryoverdatalist(params) {
    const result = await post('/api/rest/PollutantSourceApi/AlarmDataApi/GetLocalMemoryExceptionProcessing', params, null);
    return result;
}
/** 更新报警记录表
 * {
        ExceptionProcessingID: "1，2，3",
        ExceptionVerifyID: "4",
    }
 *  */
export async function UpdateExceptionProcessing(params) {
  const result = await post('/api/rest/PollutantSourceApi/ExceptionApi/UpdateExceptionProcessing', params, null);
  return result;
}
/** 报警记录详情
 * {
        ExceptionVerifyID: "4",
    }
 *  */
export async function GetAlarmRecordDetails(params) {
  const result = await post('/api/rest/PollutantSourceApi/ExceptionApi/GetAlarmRecordDetails', params, null);
  return result;
}


export async function AlarmVerifyAdd(params)
{
  const result = await post('/api/rest/PollutantSourceApi/MonitorAlarmApi/AlarmVerifyAdd', params, null);
  return result;
}