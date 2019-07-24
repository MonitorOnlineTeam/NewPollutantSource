import { Icon } from 'antd';
const scriptUrl = "//at.alicdn.com/t/font_1298443_cyjkn2locrg.js";
const style = {
  fontSize: 16
}

export const EditIcon = () => <Icon type="edit" style={{ ...style }} />

export const DetailIcon = () => <Icon type="profile" style={{ ...style }} />

export const DelIcon = () => <Icon type="delete" style={{ ...style }} />

// Icon 公共
export const IconConfig = Icon.createFromIconfontCN({
  scriptUrl
})

export const PointIcon = () => <IconConfig type="icon-jiancedianguanli" style={{ ...style }} />
export const EntIcon = () => <IconConfig type="icon-qiye1" style={{ ...style }} />
export const WaterIcon = () => <IconConfig type="icon-ruhehupaiwukou" style={{ ...style }} />
export const GasIcon = () => <IconConfig type="icon-wuranyuan" style={{ ...style }} />
export const LegendIcon = (val) =><IconConfig type="icon-yuandianzhong" style={val.style} />
  

