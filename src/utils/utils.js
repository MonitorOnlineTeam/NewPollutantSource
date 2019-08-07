/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import { Icon, Badge, Popover,message } from 'antd';
import moment from 'moment';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

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
    if (additionalInfo[0] === 'IsOver') {
      const content = (
        <div>
          <div style={{ marginBottom: 10 }}>
            <Icon style={{ color: '#ff0000', fontSize: 25, marginRight: 10 }} type="warning" />
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
          <span style={{ color: '#ff0000', cursor: 'pointer' }}>
            {value || (value === 0 ? 0 : '-')}
          </span>
        </Popover>
      );
    }
    const content = (
      <div>
        <div style={{ marginBottom: 10 }}>
          <Icon style={{ color: '#ff0000', fontSize: 25, marginRight: 10 }} type="close-circle" />
          <span style={{ fontWeight: 'Bold', fontSize: 16 }}>数据异常</span>
        </div>
        <li style={{ listStyle: 'none', marginBottom: 10 }}>
          <Badge status="warning" text={`异常原因：${additionalInfo[2]}`} />
        </li>
      </div>
    );
    return (
      <Popover content={content}>
        <span style={{ color: '#F3AC00', cursor: 'pointer' }}>
          {value || (value === 0 ? 0 : '-')}
        </span>
      </Popover>
    );
  }
  return value || (value === 0 ? 0 : '-');
}
export function asc(a, b) {
  //数字类型
  if (typeof a.orderby === 'number') return a.orderby - b.orderby;
  //时间类型
  return a.orderby < b.orderby ? 1 : -1;
}
export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}
/**
 * autoForm 处理form数据
 * @param {object} values form对象
 * @param {uid} uid 附件唯一标识
 */
export function handleFormData(values, uid) {
  let formData = {};
  for (let key in values) {
    if (values[key] && values[key]["fileList"]) {
      // 处理附件列表
      if (uid) {
        formData[key] = uid;
      }
    } else if (values[key] && moment.isMoment(values[key])) {
      // 格式化moment对象
      formData[key] = moment(values[key]).format("YYYY-MM-DD HH:mm:ss")
    } else {
      formData[key] = values[key] && values[key].toString()
    }
  }

  return formData;
}

export { isAntDesignProOrDev, isAntDesignPro, isUrl };
