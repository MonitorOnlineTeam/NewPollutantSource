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
    const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetExceptionProcessingList', params, null);
    return result === null ? {
      data: null,
    } : result;
}
