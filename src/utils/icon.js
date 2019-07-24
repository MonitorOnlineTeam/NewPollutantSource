import { Icon } from 'antd';

const scriptUrl = '//at.alicdn.com/t/font_1298443_cyjkn2locrg.js';
const style = {
  fontSize: 16,
}

export const EditIcon = () => <Icon type="edit" style={{ ...style }} />

export const DetailIcon = () => <Icon type="profile" style={{ ...style }} />

export const DelIcon = () => <Icon type="delete" style={{ ...style }} />

// Icon 公共
export const IconConfig = Icon.createFromIconfontCN({
  scriptUrl,
})

export const PointIcon = () => <IconConfig type="icon-jiancedianguanli" style={{ ...style }} />
export const EntIcon = () => <IconConfig type="icon-qiye1" style={{ ...style }} />
export const WaterIcon = () => <IconConfig type="icon-ruhehupaiwukou" style={{ ...style }} />
export const GasIcon = () => <IconConfig type="icon-wuranyuan" style={{ ...style }} />

/**视频操作图标 */
export const Top = () => <IconConfig type="icon-jiantou_xiangshang" style={{ ...style }} />
export const Down = () => <IconConfig type="icon-jiantou_xiangxia" style={{ ...style }} />
export const Left = () => <IconConfig type="icon-jiantou_xiangzuo" style={{ ...style }} />
export const Right = () => <IconConfig type="icon-jiantou_xiangyou" style={{ ...style }} />
export const Lefttop = () => <IconConfig type="icon-jiantou_zuoshang" style={{ ...style }} />
export const Righttop = () => <IconConfig type="icon-jiantou_youshang" style={{ ...style }} />
export const Leftdown = () => <IconConfig type="icon-jiantou_zuoxia" style={{ ...style }} />
export const Rightdown = () => <IconConfig type="icon-jiantou_youxia" style={{ ...style }} />
export const Adaption = () => <IconConfig type="icon-zidong" style={{ ...style }} />
export const LegendIcon = val => <IconConfig type="icon-yuandianzhong" style={val.style} />
