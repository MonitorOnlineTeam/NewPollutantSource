import { post } from '@/utils/request';


//上报列表
export async function GetDataReportList(params) {
  const result = post('/api/rest/PollutantSourceApi/DataReportApi/GetDataReportList',
    params,
    null,
  );

  return result;
}



