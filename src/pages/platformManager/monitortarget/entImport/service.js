import { post } from '@/utils/request';

/**
 * 
 *
 */
export async function InsertImportEnt(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/InsertImportEnt',
    params,
    null,
  );

  return result;
}
