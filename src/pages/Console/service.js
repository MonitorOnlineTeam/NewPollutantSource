import { post, get } from '@/utils/request';
import { API } from '@config/API'

// 获取采集服务配置及基本信息
export async function GetConsulConfig(params) {
  const result = await post(API.ConsoleApi.GetConsulConfig, params, null);
  return result;
}

// 更新采集服务操作
export async function UpdateConsulConfig(params) {
  const result = await post(API.ConsoleApi.UpdateConsulConfig, params, null);
  return result;
}

// 重启联网scoket
export async function RestartCollect(params) {
  const result = await post(API.ConsoleApi.RestartCollect, params, null);
  return result;
}

// 获取定时任务
export async function GetStatisSet(params) {
  const result = await post(API.ConsoleApi.GetStatisSet, params, null);
  return result;
}

// 设置定时任务配置
export async function ModifyStatisTask(params) {
  const result = await post(API.ConsoleApi.ModifyStatisTask, params, null);
  return result;
}

// 重启定时任务
export async function Restart(params) {
  const result = await post(API.ConsoleApi.Restart, params, null);
  return result;
}

// 获取转发配置
export async function GetTransmitSet(params) {
  const result = await post(API.ConsoleApi.GetTransmitSet, params, null);
  return result;
}

// 设置转发配置
export async function ModifyTransmitSet(params) {
  const result = await post(API.ConsoleApi.ModifyTransmitSet, params, null);
  return result;
}

// 重启转发服务
export async function RestartTransmit(params) {
  const result = await post(API.ConsoleApi.RestartTransmit, params, null);
  return result;
}

