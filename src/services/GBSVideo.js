/** GBS国标视频接口
 * xpy
 * 2020-04-04
 */
import { async } from 'q';
import config from '@/config'
/** 云台控制
 * http://121.40.50.44:10000/api/v1/ptz/control?serial=34020000001110000012&code=34020000001320001201&command=right&_=1585893984834
*/
export async function GetGBSPTZ(params) {
    const res = await fetch(
        `${config.GBSVideoApiUrl}api/v1/ptz/control?serial=${params.serial}&code=${params.code}&command=${params.command}&speed=255`,
      )
    const result = await res.json()
    return result;
  }
  /** 光圈控制 */
  export async function GetGBSPFL(params) {
    const res = await fetch(
        `${config.GBSVideoApiUrl}/api/v1/fi/control?serial=${params.serial}&code=${params.code}&command=${params.command}&speed=255`,
      )
    const result = await res.json()
    return result;
  }
