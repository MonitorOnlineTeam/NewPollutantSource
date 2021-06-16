import { CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Badge, Popover, message } from 'antd';
import moment from 'moment';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const encryptKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCC0hrRIjb3noDWNtbDpANbjt5Iwu2NFeDwU16Ec87ToqeoIm2KI+cOs81JP9aTDk/jkAlU97mN8wZkEMDr5utAZtMVht7GLX33Wx9XjqxUsDfsGkqNL8dXJklWDu9Zh80Ui2Ug+340d5dZtKtd+nv09QZqGjdnSp9PTfFDBY133QIDAQAB';

const isUrl = path => reg.test(path);

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

/**
 * 全局提示
 * @content 消息内容
 * @type 消息类型（info|success|warning|error）
 */
export function sdlMessage(content, type) {
  message.config({
    top: 70,
    duration: 3,
    maxCount: 3,
  });
  switch (type || 'info') {
    case 'info':
      message.info(content);
      break;
    case 'success':
      message.success(content);
      break;
    case 'warning':
      message.warning(content);
      break;
    case 'error':
      message.error(content);
      break;
  }
}
/**
 *  格式化moment对象，返回字符串
 * @param {moment} mmt monent对象
 * @param {String} formatType 格式
 */
export function formatMoment(mmt, formatType = 'YYYY-MM-DD HH:mm:ss') {
  return mmt ? moment(mmt).format(formatType) : null;
}
/**
 *格式化数据显示的Popover
 * @export
 * @param {*} value 数据值
 * @param {*} additional 数据的附加信息
 * @returns
 */
export function formatPollutantPopover(value, additional) {
  if (additional) {
    const additionalInfo = additional.split('§');
    if (additionalInfo[0] == 0) {
      const content = (
        <div>
          <div style={{ marginBottom: 10 }}>
            <WarningOutlined style={{ color: '#ff0000', fontSize: 25, marginRight: 10 }} />
            <span style={{ fontWeight: 'Bold', fontSize: 16 }}>数据超标</span>
          </div>
          <li style={{ listStyle: 'none', marginBottom: 10 }}>
            <Badge status="success" text={`标准值：${additionalInfo[2]}`} />
          </li>
          <li style={{ listStyle: 'none', marginBottom: 10 }}>
            <Badge status="error" text={`超标倍数：${additionalInfo[3]}`} />
          </li>
        </div>
      );
      return (
        <Popover content={content}>
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            <span style={{ color: '#ff0000', cursor: 'pointer' }}>
              {value || (value === 0 ? 0 : '-')}
            </span>
          </div>
        </Popover>
      );
    } else {
      const content = (
        <div>
          <div style={{ marginBottom: 10 }}>
            <CloseCircleOutlined style={{ color: '#ff0000', fontSize: 25, marginRight: 10 }} />
            <span style={{ fontWeight: 'Bold', fontSize: 16 }}>数据异常</span>
          </div>
          <li style={{ listStyle: 'none', marginBottom: 10 }}>
            <Badge status="warning" text={`异常原因：${additionalInfo[2]}`} />
          </li>
        </div>
      );
      return (
        <Popover content={content}>
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            <span style={{ color: '#F3AC00', cursor: 'pointer' }}>
              {value || (value === 0 ? 0 : '-')}
            </span>
          </div>
        </Popover>
      );
    }
  }
  return value ? (
    <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{value}</div>
  ) : value === 0 ? (
    0
  ) : (
        '-'
      );
}
export function asc(a, b) {
  //数字类型
  if (typeof a.orderby === 'number') return a.orderby - b.orderby;
  //时间类型
  return a.orderby < b.orderby ? 1 : -1;
}
/**
 * autoForm 处理form数据
 * @param {object} values form对象
 * @param {cuid} cuid 附件唯一标识
 */
export function handleFormData(values) {
  let formData = {};
  for (let key in values) {
    if (values[key] && values[key]['fileList']) {
      // 处理附件列表
      if (values.cuid) {
        formData[key] = values.cuid;
      }
    } else if (values[key] && moment.isMoment(values[key])) {
      // 格式化moment对象
      formData[key] = moment(values[key]).format('YYYY-MM-DD HH:mm:ss');
    } else {
      formData[key] = values[key] && values[key].toString();
    }
  }

  return formData;
}

/**
 * 获取autoForm cuid
 * @param {array} record 行数据
 * @param {object} key key
 */
export function getRowCuid(record, key) {
  const fileInfo = record[key] && record[key].split(';')[0];
  const list = fileInfo ? fileInfo.split('|') : [];
  const cuid = list[list.length - 2] || null;
  return cuid;
}

//文件下载
export function downloadFile(sUrl) {
  //iOS devices do not support downloading. We have to inform user about this.
  if (/(iP)/g.test(navigator.userAgent)) {
    alert('Your device does not support files downloading. Please try again in desktop browser.');
    return false;
  }
  //If in Chrome or Safari - download via virtual link click
  if (true) {
    //Creating new link node.
    var link = document.createElement('a');
    link.href = sUrl;
    if (link.download !== undefined) {
      //Set HTML5 download attribute. This will prevent file from opening if supported.
      var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
      link.download = fileName;
    }
    //Dispatching click event.
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  // Force file download (whether supported by server).
  if (sUrl.indexOf('?') === -1) {
    sUrl += '?download';
  }
  window.open(sUrl, '_self');
  return true;
}

// 风向
export const getDirLevel = dir => {
  if (dir != undefined && dir != '-') {
    let windDir = [
      '北',
      '东北偏北',
      '东北',
      '东北偏东',
      '东',
      '东南偏东',
      '东南',
      '东南偏南',
      '南',
      '西南偏南',
      '西南',
      '西南偏西',
      '西',
      '西北偏西',
      '西北',
      ' 西北偏北',
    ];
    let dirBound = [
      11.25,
      33.75,
      56.25,
      78.75,
      101.25,
      123.75,
      146.25,
      168.75,
      191.25,
      213.75,
      236.25,
      258.75,
      281.25,
      303.25,
      326.25,
      348.75,
    ];
    if (348.75 <= dir && dir <= 360) {
      return windDir[0];
    } else if (0 <= dir && dir <= 11.25) {
      return windDir[0];
    } else {
      for (let i = 0; i < dirBound.length - 1; i++) {
        if (dir > dirBound[i] && dir <= dirBound[i + 1]) return windDir[i + 1];
      }
    }
    return windDir[1];
  }
  return dir !== undefined ? dir : '-';
};

export { isAntDesignProOrDev, isAntDesignPro, isUrl };

//格式化数据类型
export const GetDataType = dataType => {
  let res = dataType;
  if (dataType) {
    switch (dataType) {
      case 'realtime':
        res = 'RealTimeData';
        break;
      case 'minute':
        res = 'MinuteData';
        break;
      case 'hour':
        res = 'HourData';
        break;
      case 'day':
        res = 'DayData';
        break;
    }
  }
  return res;
};

//判断时间范围前后不超过两个月
export function timeDifference(beginDates, endDates) {
  //时间格式为yyyy-mm-dd时

  const beginDate = new Date(beginDates.replace(/-/g, '/')),
    endDate = new Date(endDates.replace(/-/g, '/'));

  let newYear = beginDate.getFullYear(),
    newMonth = beginDate.getMonth() + 2; //先计算其实日期2个月后的日期

  if (newMonth >= 11) {
    // 当年月份设置范围为0 ~ 11

    newYear += 1;
    newMonth -= 12;
  }
  beginDate.setFullYear(newYear);
  beginDate.setMonth(newMonth);

  if (beginDate.getTime() >= endDate.getTime()) {
    return true; //不超过2个月  开始时间加两个月的基础上不超过结束时间说明时间范围未超过
  } else {
    return false;
  }
}
//截取小数点后两位  
export function interceptTwo(value) {
  const data = value.toString();
  // data.indexOf(".") ==-1 是整数时  补零
  const result = data.indexOf(".") == -1 ? `${value.toFixed(2)}` : data.split(".")[1].length <= 1 ? `${value.toFixed(2)}` : data.substring(0, data.indexOf(".") + 3)
  return result;
}

//保持小数点 后三位
export function toDecimal3(x) {
  if (x && x != '-') {
    let res = '', data = x.toString()
    res = data.indexOf(".") == -1 || data.split(".")[1].length < 3 ? `${Number(x).toFixed(3)}` : data.substring(0, data.indexOf(".") + 4); // 如果是整数 toFixed(3) 补三位
    return res;
  } else {
    return x;
  }
}

//判断经纬度是否在多边形中
export function isInsidePolygon(lng, lat, poly) {
  if (poly[0].lng) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].lng <= lng && lng < poly[j].lng) || (poly[j].lng <= lng && lng < poly[i].lng)) &&
        (lat < (poly[j].lat - poly[i].lat) * (lng - poly[i].lng) / (poly[j].lng - poly[i].lng) + poly[i].lat) &&
        (c = !c);
    return c;
  } else {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i][0] <= lng && lng < poly[j][0]) || (poly[j][0] <= lng && lng < poly[i][0])) &&
        (lat < (poly[j][1] - poly[i][1]) * (lng - poly[i][0]) / (poly[j][0] - poly[i][0]) + poly[i][1]) &&
        (c = !c);
    return c;
  }
}

// /* 判断是否是内网IP */
export function isInnerIPFn(webSocketPushURL) {
  
  let isInnerIp = false;// 默认给定IP不是内网IP
  // var returnIP = '';
  // const innerIp = webSocketPushURL.split(',')[0];
  // const outIp = webSocketPushURL.split(',')[1];
  var returnIP = '';
  // 获取当前页面url
  let curPageUrl = window.location.href;
  if (curPageUrl.indexOf('localhost') !== -1) {
    // returnIP = innerIp;
    isInnerIp = true;
  } else {
    const reg1 = /(http|ftp|https|www):\/\//g;// 去掉前缀
    curPageUrl = curPageUrl.replace(reg1, '');

    const reg2 = /\:+/g;// 替换冒号为一点
    curPageUrl = curPageUrl.replace(reg2, '.');
    curPageUrl = curPageUrl.split('.');// 通过一点来划分数组


  
    const ipAddress = `${curPageUrl[0]}.${curPageUrl[1]}.${curPageUrl[2]}.${curPageUrl[3]}`;

    const ipNum = getIpNum(ipAddress);
    const aBegin = getIpNum('10.0.0.0');
    const aEnd = getIpNum('10.255.255.255');
    const bBegin = getIpNum('172.16.0.0');
    const bEnd = getIpNum('172.31.255.255');
    const cBegin = getIpNum('192.168.0.0');
    const cEnd = getIpNum('192.168.255.255');
    const dBegin = getIpNum('127.0.0.0');
    const dEnd = getIpNum('127.255.255.255');
    isInnerIp = isInner(ipNum, aBegin, aEnd) || isInner(ipNum, bBegin, bEnd) || isInner(ipNum, cBegin, cEnd) || isInner(ipNum, dBegin, dEnd);
    // console.log('是否是内网:' + isInnerIp);
    // if (isInnerIp) {
    //   returnIP = innerIp;
    // } else {
    //   returnIP = outIp;
    // }
  }
  // return returnIP;
   return isInnerIp
}