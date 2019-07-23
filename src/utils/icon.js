import { Icon } from 'antd';
const scriptUrl = "//at.alicdn.com/t/font_1298443_nwlbb2f4vuf.js";
const style = {
  fontSize: 16
}

export const EditIcon = () => <Icon type="edit" style={{ ...style }} />

export const DetailIcon = () => <Icon type="profile" style={{ ...style }} />

export const DelIcon = () => <Icon type="delete" style={{ ...style }} />

// 监测点 - 维护点信息
export const PointIconConfig = Icon.createFromIconfontCN({
  scriptUrl
})

export const PointIcon = () => <PointIconConfig type="icon-jiancedianguanli" style={{ ...style }} />