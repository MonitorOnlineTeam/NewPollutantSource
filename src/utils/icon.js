import { Icon } from 'antd';

const scriptUrl = '//at.alicdn.com/t/font_1298443_wfrixzb31mk.js';
const style = {
  fontSize: 16,
}
const styles = {
  fontSize: 17,
}
export const EditIcon = () => <Icon type="edit" style={{ ...style }} />

export const DetailIcon = () => <Icon type="profile" style={{ ...style }} />

export const DelIcon = () => <Icon type="delete" style={{ ...style }} />

// Icon 公共
export const IconConfig = Icon.createFromIconfontCN({
  scriptUrl,
})

export const PointIcon = () => <IconConfig type="icon-jiancedianguanli" style={{ ...style }} />
export const EntIcon = props => <IconConfig type="icon-qiye1" style={{ ...style }} {...props}/>
export const StationIcon = props => <IconConfig type="icon-huanbaojiancezhan" style={{ ...style }} {...props}/>
export const ReachIcon = props => <IconConfig type="icon-hechangzhiheduan" style={{ ...style }} {...props}/>
export const SiteIcon = props => <IconConfig type="icon-tadiaogongdijianshe" style={{ ...style }} {...props}/>
export const WaterIcon = props => <IconConfig type="icon-ruhehupaiwukou" style={{ ...style }} {...props} />
export const GasIcon = props => <IconConfig type="icon-wuranyuan" style={{ ...style }} {...props} />
export const PanelWaterIcon = val => <IconConfig type="icon-ruhehupaiwukou" style={val.style } />
export const PanelGasIcon = val => <IconConfig type="icon-wuranyuan" style={val.style } />
export const LegendIcon = val => <IconConfig type="icon-yuandianzhong" style={val.style} />
export const DustIcon = () => <IconConfig type="icon-yangchen" style={{ ...style }} />
export const VocIcon = () => <IconConfig type="icon-ziyuan" style={{ ...style }} />
export const TreeIcon = () => <IconConfig type="icon-jiedian" style={{ ...style }} />
export const PanelIcon = () => <IconConfig type="icon-jiedian1" style={{ ...styles }} />
export const BellIcon = props => <IconConfig type="icon-lingdang" style={{ ...styles }} {...props} />
export const ManIcon = () => <Icon type="icon-nan" style={{ ...style }} />
export const WomanIcon = () => <Icon type="icon-nv" style={{ ...style }} />
export const FormIcon = () => <IconConfig type="icon-danzi" style={{ ...style }} />
/** 视频操作图标 */
export const Top = () => <IconConfig type="icon-jiantou_xiangshang" style={{ ...style }} />
export const Down = () => <IconConfig type="icon-jiantou_xiangxia" style={{ ...style }} />
export const Left = () => <IconConfig type="icon-jiantou_xiangzuo" style={{ ...style }} />
export const Right = () => <IconConfig type="icon-jiantou_xiangyou" style={{ ...style }} />
export const Lefttop = () => <IconConfig type="icon-jiantou_zuoshang" style={{ ...style }} />
export const Righttop = () => <IconConfig type="icon-jiantou_youshang" style={{ ...style }} />
export const Leftdown = () => <IconConfig type="icon-jiantou_zuoxia" style={{ ...style }} />
export const Rightdown = () => <IconConfig type="icon-jiantou_youxia" style={{ ...style }} />
export const Adaption = () => <IconConfig type="icon-zidong" style={{ ...style }} />
