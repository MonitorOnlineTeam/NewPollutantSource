/**
 * 功  能：海康相关插件
 * 创建人：xpy
 * 创建时间：2019.09.16
 */

import { message } from 'antd';
// 全局保存当前选中窗口
let g_iWndIndex = 0; // 可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
let msg = 'failed';
let messagess = 'failed';
const vwidth = '100%'; // 视频画面宽度
const vheight = '100%'; // 视频画面高度
// $(function () {
//     InitVideo();
// });
export function getBrowserInfo() {
    const { userAgent } = navigator; // 取得浏览器的userAgent字符串
    const isOpera = userAgent.indexOf('Opera') > -1;
    if (isOpera) {
        return 'Opera';
    } // 判断是否Opera浏览器
    if (userAgent.indexOf('Firefox') > -1) {
        return 'FF';
    } // 判断是否Firefox浏览器
    if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome';
    }
    if (userAgent.indexOf('Safari') > -1) {
        return 'Safari';
    } // 判断是否Safari浏览器
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
        const IE5 = IE55 = IE6 = IE7 = IE8 = false;
        const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
        reIE.test(userAgent);
        const fIEVersion = parseFloat(RegExp.$1);
        IE55 = fIEVersion == 5.5;
        IE6 = fIEVersion == 6.0;
        IE7 = fIEVersion == 7.0;
        IE8 = fIEVersion == 8.0;
        IE9 = fIEVersion == 9.0;
        IE10 = fIEVersion == 10.0;
        // alert(fIEVersion);
        if (IE55) {
            return 'IE55';
        }
        if (IE6) {
            return 'IE6';
        }
        if (IE7) {
            return 'IE7';
        }
        if (IE8) {
            return 'IE8';
        }
        if (IE9) {
            return 'IE9';
        }
        if (IE10) {
            return 'IE10';
        }
    } // 判断是否IE11浏览器
    if (userAgent.indexOf('rv:11.0') > -1 && !isOpera) {
        return 'IE11';
    }
}

export function InitVideo() {
    // 以下是调用上面的函数
    const mb = getBrowserInfo();
    if (mb.indexOf('IE') >= 0) {
        // 检查插件是否已经安装过
        // istrue是否加载成功
        if (WebVideoCtrl.I_CheckPluginInstall() == -1) {
            msg = { flag: true, message: '您还未安装过插件，点击确定下载安装', istrue: false };
            // 插件下载地址 toduo
            window.location.href = 'http://172.16.12.82:1025/Content/Video/WebComponents.exe';
            return;
        }
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin(vwidth, vheight, {
            iWndowType: 1,
            cbSelWnd(xmlDoc) {
                g_iWndIndex = 0;
            },
        });
        WebVideoCtrl.I_InsertOBJECTPlugin('divPlugin');
        msg = { flag: true, message: '初始化播放插件成功', istrue: true };

        // 检查插件是否最新
        // if (WebVideoCtrl.I_CheckPluginVersion() == -1) {
        //     alert("检测到新的插件版本，点击确定下载升级！");
        //     //window.location.href = `${_serverBasePath }Content/Video/WebComponents.exe`;
        //    }
    } else {
        msg = { flag: false, message: '请在IE11浏览器下查看视频', istrue: false };
    }

    // 窗口事件绑定
    $(window).bind({
        resize() {
            const $Restart = $('#restartDiv');
            if ($Restart.length > 0) {
                const oSize = getWindowSize();
                $Restart.css({
                    width: `${oSize.width}px`,
                    height: `${oSize.height}px`,
                });
            }
        },
    });
    return msg;
}

// 登录
export function clickLogin(loginPara) {
    msg = 'failed';
    const szIP = loginPara.IP;
    const szPort = loginPara.Device_Port;
    const szUsername = loginPara.User_Name;
    const szPassword = loginPara.User_Pwd;

    if (szIP == '' || szPort == '') {
        msg = { flag: false, message: 'IP或端口不能为空！' };
        return msg;
    }

    const iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
        success(xmlDoc) {
            msg = { flag: true, message: ' 登录成功！监控视频连接中...' };
        },
        error() {
            msg = { flag: false, message: ' 登录失败！' };
        },
    });
    if (iRet == -1) {
        msg = { flag: true, message: ' 已登录过！视频连接中...' };
    }

    if (iRet == undefined) {
        msg = { flag: true, message: ' 登录中...' };
    }
    return msg;
}

// 退出
export function clickLogout() {
    if (ip == '') {
        msg = { flag: false, message: ' 监控视频连接失败,原因：IP地址不能为空！' };
        return msg;
    }

    const iRet = WebVideoCtrl.I_Logout(szIP);
    if (iRet == 0) {
        msg = { flag: true, message: '退出成功！' };
    } else {
        msg = { flag: true, message: '退出失败！' };
    }

    return msg;
}

// 开始监控视频连接
export function clickStartRealPlay(loginPara) {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    const szIP = loginPara.IP;
    const iStreamType = 1;
    const iChannelID = parseInt(loginPara.VedioCamera_No, 10);
    const bZeroChannel = false;

    if (szIP == '') {
        msg = { flag: false, message: ' 监控视频连接失败,原因：IP地址不能为空！' };
        return msg;
    }

    if (oWndInfo != null) { // 已经在播放了，先停止
        WebVideoCtrl.I_Stop();
    }

    const iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
        iStreamType,
        iChannelID,
        bZeroChannel,
    });

    if (iRet == 0) {
        messagess = { flag: true, message: ' 监控视频连接成功！' };
    } else {
        messagess = { flag: false, message: ' 监控视频连接失败！' };
    }
    return messagess;
}

// 停止监控视频连接
export function clickStopRealPlay() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    if (oWndInfo != null) {
        const iRet = WebVideoCtrl.I_Stop();
    }
}

// 抓图
export function clickCapturePic(cameraNo) {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    if (oWndInfo != null) {
        const szChannelID = parseInt(cameraNo, 10);
        const szPicName = `${oWndInfo.szIP}_${szChannelID}_${new Date().getTime()}`;
        const iRet = WebVideoCtrl.I_CapturePic(szPicName);
        if (iRet == 0) {
            msg = { flag: true, message: ` 抓图成功,文件名为：【'${szPicName}'】` };
        } else {
            msg = { flag: false, message: ' 抓图失败！' };
        }
    }

    return msg;
}

// PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
let g_bPTZAuto = false;
export function mouseDownPTZControl(iPTZIndex) {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    const bZeroChannel = false;
    let iPTZSpeed = 4;
    let bStop = false;

    if (bZeroChannel) { // 零通道不支持云台
        return;
    }

    if (oWndInfo != null) {
        if (iPTZIndex == 9 && g_bPTZAuto) {
            iPTZSpeed = 0;// 自动开启后，速度置为0可以关闭自动
            bStop = true;
        } else {
            g_bPTZAuto = false;// 点击其他方向，自动肯定会被关闭
            bStop = false;
        }

        WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
            iPTZSpeed,
            success(xmlDoc) {
                if (iPTZIndex == 9) {
                    g_bPTZAuto = !g_bPTZAuto;
                }

                msg = { flag: true, message: ' 开启云台成功！' };
            },
            error() {
                msg = { flag: false, message: ' 开启云台失败！' };
            },
        });
    }

    return msg;
}

// 方向PTZ停止
export function mouseUpPTZControl() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(1, true, {
            success(xmlDoc) {
                msg = { flag: true, message: ' 停止云台成功！' };
            },
            error() {
                msg = { flag: false, message: ' 停止云台失败！' };
            },
        });
    }

    return msg;
}

// 调焦+
export function PTZZoomIn() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(10, false, {
            iWndIndex: g_iWndIndex,
            success(xmlDoc) {
                msg = { flag: true, message: ' 调焦+成功！' };
            },
            error() {
                msg = { flag: false, message: ' 调焦+失败！' };
            },
        });
    }

    return msg;
}

// 调焦-
export function PTZZoomOut() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, false, {
            iWndIndex: g_iWndIndex,
            success(xmlDoc) {
                msg = { flag: true, message: ' 调焦-成功！' };
            },
            error() {
                msg = { flag: false, message: ' 调焦-失败！' };
            },
        });
    }

    return msg;
}

// 调焦
export function PTZZoomStop() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, true, {
            iWndIndex: g_iWndIndex,
            success(xmlDoc) {
                msg = { flag: true, message: ' 调焦停止成功！' };
            },
            error() {
                msg = { flag: false, message: ' 调焦停止失败！' };
            },
        });
    }

    return msg;
}

// 聚焦+
export function PTZFocusIn() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, false, {
            iWndIndex: g_iWndIndex,
            success(xmlDoc) {
                msg = { flag: true, message: ' 聚焦+成功！' };
            },
            error() {
                msg = { flag: false, message: ' 聚焦+失败！' };
            },
        });
    }

    return msg;
}

// 聚焦-
export function PTZFocusOut() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(13, false, {
            iWndIndex: g_iWndIndex,
            success(xmlDoc) {
                msg = { flag: true, message: ' 聚焦-成功！' };
            },
            error() {
                msg = { flag: false, message: ' 聚焦-失败！' };
            },
        });
    }

    return msg;
}

// 聚焦停止
export function PTZFocusStop() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, true, {
            iWndIndex: g_iWndIndex,
            success(xmlDoc) {
                msg = { flag: true, message: ' 聚焦停止成功！' };
            },
            error() {
                msg = { flag: false, message: ' 聚焦停止失败！' };
            },
        });
    }

    return msg;
}

// 光圈+
export function PTZIrisIn() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, false, {
            iWndIndex: g_iWndIndex,
            success(xmlDoc) {
                msg = { flag: true, message: ' 光圈+成功！' };
            },
            error() {
                msg = { flag: false, message: ' 光圈+失败！' };
            },
        });
    }

    return msg;
}

// 光圈-
export function PTZIrisOut() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(15, false, {
            iWndIndex: g_iWndIndex,
            success(xmlDoc) {
                msg = { flag: true, message: ' 光圈-成功！' };
            },
            error() {
                msg = { flag: false, message: ' 光圈-失败！' };
            },
        });
    }

    return msg;
}

// 光圈
export function PTZIrisStop() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, true, {
            iWndIndex: g_iWndIndex,
            success(xmlDoc) {
                msg = { flag: true, message: ' 光圈停止成功！' };
            },
            error() {
                msg = { flag: false, message: ' 光圈停止失败！' };
            },
        });
    }

    return msg;
}
// 比较时间
export function CompareTime(startTime, endTime) {
    const sTime = Date.parse(startTime.replace('-', '/'));
    const eTime = Date.parse(endTime.replace('-', '/'));
    return sTime > eTime;
}
// 开始回放
export function clickStartPlayback(para) {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    const szIP = para.ip;
    const bZeroChannel = false;
    const iChannelID = parseInt(para.cameraNo, 10);
    const szStartTime = para.beginTime;
    const szEndTime = para.endTime;
    const bChecked = false;
    let iRet = -1;
    msg = 'failed';

    if (szStartTime == '' || szEndTime == '') {
        // $.XDL.tips("时间不能为空！");
        message.warning('时间不能为空！');
        return;
    }

    if (CompareTime(szStartTime, szEndTime)) {
        // $.XDL.tips("");
        message.warning('请填写正确的时间！');
        return;
    }

    if (szIP == '') {
        return;
    }

    if (bZeroChannel) { // 零通道不支持回放
        return;
    }

    if (oWndInfo != null) { // 已经在播放了，先停止
        WebVideoCtrl.I_Stop();
    }

    if (bChecked) { // 启用转码回放
        const oTransCodeParam = {
            TransFrameRate: '16', // 0：全帧率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
            TransResolution: '2', // 255：Auto，3：4CIF，2：QCIF，1：CIF
            TransBitrate: '23', // 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
        };
        iRet = WebVideoCtrl.I_StartPlayback(szIP, {
            iChannelID,
            szStartTime,
            szEndTime,
            oTransCodeParam,
        });
    } else {
        iRet = WebVideoCtrl.I_StartPlayback(szIP, {
            iChannelID,
            szStartTime,
            szEndTime,
        });
    }

    if (iRet == 0) {
        msg = '开始回放成功！';
    } else {
        msg = '开始回放失败！';
    }

    message.info(msg);
}

// 停止回放
export function clickStopPlayback() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    msg = 'failed';

    if (oWndInfo != null) {
        const iRet = WebVideoCtrl.I_Stop();
        if (iRet == 0) {
            msg = '停止回放成功！';
        } else {
            msg = '停止回放失败！';
        }
        message.info(msg);
        //  $.XDL.tips(message);
    }
}

// 开始倒放
export function clickReversePlayback(para) {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    const szIP = para.ip;
    const bZeroChannel = false;
    const iChannelID = parseInt(para.cameraNo, 10);
    const szStartTime = para.beginTime;
    const szEndTime = para.endTime;
    msg = 'failed';

    if (szStartTime == '' || szEndTime == '') {
        //  $.XDL.tips("时间不能为空！");
        message.warning('时间不能为空！');
        return;
    }

    if (CompareTime(szStartTime, szEndTime)) {
        //  $.XDL.tips("请填写正确的时间");
        message.warning('请填写正确的时间');
        return;
    }

    if (szIP == '') {
        return;
    }

    if (bZeroChannel) { // 零通道不支持回放
        return;
    }

    if (oWndInfo != null) { // 已经在播放了，先停止
        WebVideoCtrl.I_Stop();
    }

    const iRet = WebVideoCtrl.I_ReversePlayback(szIP, {
        iChannelID,
        szStartTime,
        szEndTime,
    });

    if (iRet == 0) {
        msg = '开始倒放成功！';
    } else {
        msg = '开始倒放失败！';
    }
    message.info(msg);
    // $.XDL.tips(message);
}

// 暂停
export function clickPause() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    msg = 'failed';

    if (oWndInfo != null) {
        const iRet = WebVideoCtrl.I_Pause();
        if (iRet == 0) {
            msg = '暂停成功！';
        } else {
            msg = '暂停失败！';
        }
        message.info(msg);
    }
}

// 恢复
export function clickResume() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    msg = 'failed';

    if (oWndInfo != null) {
        const iRet = WebVideoCtrl.I_Resume();
        if (iRet == 0) {
            msg = '恢复成功！';
        } else {
            msg = '恢复失败！';
        }

        message.info(msg);
    }
}

// 慢放
export function clickPlaySlow() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    msg = 'failed';

    if (oWndInfo != null) {
        const iRet = WebVideoCtrl.I_PlaySlow();
        if (iRet == 0) {
            msg = '慢放成功！';
        } else {
            msg = '慢放失败！';
        }
        message.info(msg);
    }
}

// 快放
export function clickPlayFast() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    msg = 'failed';

    if (oWndInfo != null) {
        const iRet = WebVideoCtrl.I_PlayFast();
        if (iRet == 0) {
            msg = '快放成功！';
        } else {
            msg = '快放失败！';
        }
        message.info(msg);
    }
}


// 设置当前日期的凌晨时间
export function SetCurrentDateEarlierTime(id, time) {
    var strDate = time;
    if (!strDate) {
        const curr_time = new Date();
        var strDate = `${curr_time.getFullYear()}-`;
        strDate += `${curr_time.getMonth() + 1}-`;
        strDate += `${curr_time.getDate()} `;
        strDate += '00' + ':';
        strDate += '00' + ':';
        strDate += '00';
    }
    $(`#${id}`).datetimebox('setValue', strDate);
}

// 设置当前时间
export function SetCurrentDateTime(id, time) {
    var strDate = time;
    if (!strDate) {
        const curr_time = new Date();
        var strDate = `${curr_time.getFullYear()}-`;
        strDate += `${curr_time.getMonth() + 1}-`;
        strDate += `${curr_time.getDate()} `;
        strDate += `${curr_time.getHours()}:`;
        strDate += `${curr_time.getMinutes()}:`;
        strDate += curr_time.getSeconds();
    }
    $(`#${id}`).datetimebox('setValue', strDate);
}
