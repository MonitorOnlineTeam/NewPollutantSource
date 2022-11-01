import { post } from '@/utils/request';
import { API } from '@config/API'

export async function GetMonitorTest(params) {
  const result = await post(API.AirDataApi.GetTargetAssessmentData, params, null);
  return result;
}

