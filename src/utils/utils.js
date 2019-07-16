/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import { Icon, Badge, Popover } from 'antd';
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

export { isAntDesignProOrDev, isAntDesignPro, isUrl };
