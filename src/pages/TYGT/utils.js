// 格式化处理参数列表
export function formatParamsList(PollutantNames, PollutantCodes) {
  let _PollutantCodes = PollutantCodes.split(',');
  let _PollutantNames = PollutantNames.split(',');
  let paramsList = _PollutantCodes.map((item, index) => {
    return {
      PollutantCode: item,
      PollutantName: _PollutantNames[index]
    }
  })

  return paramsList;
}