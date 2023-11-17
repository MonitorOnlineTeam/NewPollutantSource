/** GBS国标视频接口
 * xpy
 * 2020-04-04
 */
import { async } from 'q';
import config from '@/config'
import moment from 'moment'

/** 时间戳 */
const TimeStamp = moment(Date.now()).valueOf();

/** 实时直播 - 直播流保活 */
export async function StreamTouch(params) {
  const res = await fetch(
      `${config.GBSVideoApiUrl}api/v1/stream/touch?serial=${params.serial}&code=${params.code}&t=${TimeStamp}`,
    )
  const result = await res.json()
  return result;
}
/** 云台控制
 * http://121.40.50.44:10000/api/v1/ptz/control?serial=34020000001110000012&code=34020000001320001201&command=right&_=1585893984834
*/
export async function GetGBSPTZ(params) {
    const res = await fetch(
        `${config.GBSVideoApiUrl}api/v1/ptz/control?serial=${params.serial}&code=${params.code}&command=${params.command}&speed=255&_=${TimeStamp}`,
      )
    const result = await res.json()
    return result;
  }
/** 光圈控制 */
export async function GetGBSPFL(params) {
  const res = await fetch(
      `${config.GBSVideoApiUrl}api/v1/fi/control?serial=${params.serial}&code=${params.code}&command=${params.command}&_=${TimeStamp}`,
    )
  const result = await res.json()
  return result;
}
/** 开始回放 */
export async function PlaybackStart(params) {
  const res = await fetch(
      `${config.GBSVideoApiUrl}api/v1/playback/start?serial=${params.serial}&code=${params.code}&starttime=${params.starttime}&endtime=${params.endtime}&_=${TimeStamp}`,
    )
  const result = await res.json()
  return result;
}
/** 停止回放 */
export async function PlaybackStop(params) {
  const res = await fetch(
      `${config.GBSVideoApiUrl}api/v1/playback/stop?streamid=${params.streamid}&speed=255&_=${TimeStamp}`,
    )
  const result = await res.json()
  return result;
}
/** 回放控制 */
export async function PlaybackControl(params) {
  const res = await fetch(
      `${config.GBSVideoApiUrl}api/v1/playback/control?streamid=${params.streamid}&command=${params.command}&scale=${params.scale}&_=${TimeStamp}`,
    )
  const result = await res.json()
  return result;
}
/** 录像回放 - 回放流保活 */
export async function PlaybackTouch(params) {
  const res = await fetch(
      `${config.GBSVideoApiUrl}api/v1/playback/touch?streamid=${params.streamid}&t=${TimeStamp}`,
    )
  const result = await res.json()
  return result;
}
