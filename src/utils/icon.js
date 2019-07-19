import { Icon } from 'antd';
const style = {
  fontSize: 16
}

export const EditIcon = () => <Icon type="edit" style={{ ...style }} />

export const DetailIcon = () => <Icon type="profile" style={{ ...style }} />

export const DelIcon = () => <Icon type="delete" style={{ ...style }} />

// 监测点 - 维护点信息
export const PointIconConfig = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1298443_1yovucx4if6.js', // 在 iconfont.cn 上生成
});

export const PointIcon = () => <PointIconConfig type="icon-jiancedianguanli" style={{ ...style }} />