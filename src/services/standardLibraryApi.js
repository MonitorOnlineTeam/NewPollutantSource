import { async } from 'q';
import { post, get } from '@/utils/request';

// 标准库列表
export async function getlist(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    Name: params.Name,
    Type: params.Type,
    flag: 0,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/GetStandardLibraryList',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 标准库污染物列表
export async function getstandardlibrarypollutantlist(params) {
  const body = {
    StandardLibraryID: params.StandardLibraryID,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/GetStandardLibraryPollutantList',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 启用禁用标准
export async function enableordisable(params) {
  const body = {
    StandardLibraryID: params.StandardLibraryID,
    Enalbe: params.Enalbe,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/EnableOrDisable',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 删除标准库主表
export async function deletestandardlibrarybyid(params) {
  const body = {
    StandardLibraryID: params.StandardLibraryID,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/DeleteStandardLibrary',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 删除标准库子表
export async function deletestandardlibrarypollutantbyid(params) {
  const body = {
    Guid: params.Id,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/DeleteStandardLibraryPollutant',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 添加标准库主表
export async function addstandardlibrary(params) {
  const body = {
    Name: params.Name,
    Type: params.Type,
    IsUsed: params.IsUsed,
    Files: params.Files,
    PollutantType: params.PollutantType,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/AddStandardLibrary',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 添加标准库子表
export async function addstandardlibrarypollutant(params) {
  const body = {
    StandardLibraryID: params.StandardLibraryID,
    PollutantCode: params.PollutantCode,
    AlarmType: params.AlarmType,
    UpperLimit: params.UpperLimit,
    LowerLimit: params.LowerLimit,
    Type: 2,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/AddStandardLibraryPollutant',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 上传附件
export async function uploadfiles(params) {
  const body = {
    file: params.file,
    fileName: params.fileName,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/KBM/UploadFilse',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 删除附件
export async function deletefiles(params) {
  const body = {
    guid: params.guid,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/PUploadImage/DeleteFilse',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 获取标准库主表实体
export async function getStandardlibrarybyid(params) {
  const body = {
    StandardLibraryID: params.StandardLibraryID,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/GetStandardLibraryById',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 获取标准库子表实体
export async function getStandardlibrarypollutantbyid(params) {
  const body = {
    Guid: params.Guid,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/GetStandardLibraryPollutantById',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 编辑标准库主表
export async function editstandardlibrary(params) {
  const body = {
    StandardLibraryID: params.StandardLibraryID,
    Name: params.Name,
    Type: params.Type,
    IsUsed: params.IsUsed,
    Files: params.Files,
    PollutantType: params.PollutantType,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/EditStandardLibrary',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 添加标准库子表
export async function editstandardlibrarypollutant(params) {
  const body = {
    Key: params.Guid,
    StandardLibraryID: params.StandardLibraryID,
    PollutantCode: params.PollutantCode,
    AlarmType: params.AlarmType,
    UpperLimit: params.UpperLimit,
    LowerLimit: params.LowerLimit,
    Type: 2,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/EditStandardLibraryPollutant',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 获取所有污染物
export async function getpollutantlist(params) {
  const body = {
    StandardLibraryID: params.StandardLibraryID,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/GetPollutantList',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 获取所有附件
export async function getstandardlibraryfiles(params) {
  const body = {
    StandardLibraryID: params.StandardLibraryID,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/GetStandardLibraryFiles',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 标准库列表(应用)
export async function getuselist(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    DGIMN: params.DGIMN,
    flag: 1,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/GetStandardLibraryList',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}

// 查询单个排口下污染物列表
export async function getpollutantbydgimn(params) {
  const body = {
    DGIMN: params.DGIMN,
  };
  const result = get(
    '/api/rest/PollutantSourceApi/StandardLibraryApi/GetStandardPollutantsByDgimn',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 应用到单个排口
export async function useStandard(params) {
  const body = {
    DGIMN: params.DGIMN,
    StandardLibraryID: params.StandardLibraryID,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibraryApi/UseStandard',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 应用到所有排口
export async function useallDGIMNbyid(params) {
  const body = {
    StandardLibraryID: params.StandardLibraryID,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibrary/UseAllPoint',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 是否应用当前污染物
export async function isusepollutant(params) {
  const body = {
    DGIMN: params.DGIMN,
    PollutantCode: params.PollutantCode,
    Enalbe: params.Enalbe,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibraryApi/UsePollutant',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 根据排口和污染物编号查询实体
export async function getMonitorPointPollutantDetails(params) {
  const body = {
    DGIMN: params.DGIMN,
    pollutantCode: params.PollutantCode,
  };
  const result = get(
    '/api/rest/PollutantSourceApi/StandardLibraryApi/GetMonitorPointPollutantDetails',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}
// 编辑污染物
export async function editmonitorpointPollutant(params) {
  const body = {
    DGIMN: params.DGIMN,
    PollutantCode: params.PollutantCode,
    AlarmType: params.AlarmType,
    LowerLimit: params.LowerLimit,
    UpperLimit: params.UpperLimit,
    AlarmDescription: params.AlarmDescription,
    AlarmContinuityCount: params.AlarmContinuityCount,
    OverrunContinuityCount: params.OverrunContinuityCount,
    ZeroContinuityCount: params.ZeroContinuityCount,
    SerialContinuityCount: params.SerialContinuityCount,
    AbnormalUpperLimit: params.AbnormalUpperLimit,
    AbnormalLowerLimit: params.AbnormalLowerLimit,
    ExceptionType: params.ExceptionType,
    IsStatisti: params.IsStatisti,
    NormalRangeUpper: params.NormalRangeUpper,
    NormalRangeLower: params.NormalRangeLower,
    OverNormalRangeCount: params.OverNormalRangeCount,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/StandardLibraryApi/EditMonitorPointPollutant',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}

// 改变考核状态
export async function changeUseStatisti(params) {
  const result = post('/api/rest/PollutantSourceApi/StandardLibraryApi/UseStatisti',
    params,
  );
  return result;
}