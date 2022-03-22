/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2020-10-27 14:26:17
 * @LastEditTime: 2020-10-27 14:28:07
 * @FilePath: /NewPollutantSource/src/pages/IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/utils.js
 */

export function getAttentionDegreeList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList', params);
  return result;
}

export const checkParent = (item, array) => {
  if (typeof item.parent === 'undefined' || item.parent === null || item.parent === '') {
    return -2;
  }
  const index = array.findIndex(findItem => {
    if (findItem.title == item.parent) {
      return true;
    }
  });
  return index;
};
