import { async } from 'q';
import { post, get } from '@/utils/request';
import { API } from '@config/API'

// 数据上报中的企业名称跟用户名称
export async function getDataReportUserAndEntInfo(params) {
    const body = {
      StandardLibraryID: params.StandardLibraryID,
    };
    const result = post(
      '/api/rest/PollutantSourceApi/DataReportApi/GetDataReportUserAndEntInfo',
      body,
      null,
    );
    return result === null
      ? {
          data: null,
        }
      : result;
  }

  // 数据上报或修改
export async function addDataReport(params) {
    const body = params;
    const result = post(
      '/api/rest/PollutantSourceApi/DataReportApi/AddDataReport',
      body,
      null,
    );
    return result === null
      ? {
          data: null,
        }
      : result;
  }

    // 删除数据上报
export async function deleteDataReport(params) {
   const body = params;
   const result = post(
     '/api/rest/PollutantSourceApi/DataReportApi/DeleteDataReport',
     body,
     null,
   );
   return result === null
     ? {
         data: null,
       }
     : result;
 }
  
  