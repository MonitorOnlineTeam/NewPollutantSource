import { Icon } from 'antd';

const scriptUrl = '//at.alicdn.com/t/font_1298443_weo7upayqrg.js';
const style = {
  fontSize: 16,
}
const styles = {
  fontSize: 17,
}
const mapStyle = {
  fontSize: 24,
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "0px 0px 3px 2px #fff"
}
export const EditIcon = () => <Icon type="edit" style={{ ...style }} />

export const DetailIcon = () => <Icon type="profile" style={{ ...style }} />

export const DelIcon = () => <Icon type="delete" style={{ ...style }} />

// Icon 公共
export const IconConfig = Icon.createFromIconfontCN({
  scriptUrl,
})

export const PointIcon = () => <IconConfig type="icon-jiancedianguanli" style={{ ...style }} />
export const EntIcon = props => <IconConfig type="icon-qiye2"  {...props} style={{ ...mapStyle, color: "#4e8cee", ...props.style }} />
export const MapEntIcon = props => <IconConfig type="icon-qy" style={{ ...style }} {...props} />
export const StationIcon = props => <IconConfig type="icon-huanbaojiancezhan" style={{ ...style }} {...props} />
export const ReachIcon = props => <IconConfig type="icon-hechangzhiheduan" style={{ ...style }} {...props} />
export const SiteIcon = props => <IconConfig type="icon-tadiaogongdijianshe" style={{ ...style }} {...props} />
// export const WaterIcon = props => <IconConfig type="icon-ruhehupaiwukou" style={{ ...style }} {...props} />
// export const GasIcon = props => <IconConfig type="icon-wuranyuan" style={{ ...style }} {...props} />
export const PanelWaterIcon = val => <IconConfig type="icon-ruhehupaiwukou" style={val.style} />
export const PanelGasIcon = val => <IconConfig type="icon-wuranyuan" style={val.style} />
export const LegendIcon = val => <IconConfig type="icon-yuandianzhong" style={val.style} />
export const DustIcon = (props) => <IconConfig type="icon-fenchen" style={{ ...style }} {...props} />
export const VocIcon = (props) => <IconConfig type="icon-ziyuan" style={{ ...style }} {...props} />
export const QCAIcon = (props) => <IconConfig type="icon-yiqiyibiao" style={{ ...style }} {...props} />
export const TreeIcon = () => <IconConfig type="icon-jiedian" style={{ ...style }} />
export const PanelIcon = () => <IconConfig type="icon-jiedian1" style={{ ...styles }} />
export const BellIcon = props => <IconConfig type="icon-lingdang" style={{ ...styles }} {...props} />
export const ManIcon = val => <IconConfig type="icon-nan" style={val.style} />
export const WomanIcon = val => <IconConfig type="icon-nv" style={val.style} />
export const FormIcon = () => <IconConfig type="icon-danzi" style={{ ...style }} />
// 审批图标
export const ShenpiIcon = () => <IconConfig type="icon-shenpi" style={{ ...style }} />
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



// 废水
export const WaterIcon = props => <IconConfig type="icon-water" style={{ ...mapStyle }} {...props} />
export const WaterNormal = props => <IconConfig type="icon-water-normal" style={{ ...mapStyle }} {...props} />
export const WaterExceed = props => <IconConfig type="icon-water-exceed" style={{ ...mapStyle }} {...props} />
export const WaterAbnormal = props => <IconConfig type="icon-water-abnormal" style={{ ...mapStyle }} {...props} />
export const WaterOffline = props => <IconConfig type="icon-water-offline" style={{ ...mapStyle }} {...props} />

// 废气
export const GasIcon = props => <IconConfig type="icon-gas" style={{ ...mapStyle }} {...props} />
export const GasNormal = props => <IconConfig type="icon-gas-normal" style={{ ...mapStyle }} {...props} />
export const GasExceed = props => <IconConfig type="icon-gas-exceed" style={{ ...mapStyle }} {...props} />
export const GasAbnormal = props => <IconConfig type="icon-gas-abnormal" style={{ ...mapStyle }} {...props} />
export const GasOffline = props => <IconConfig type="icon-gas-offline" style={{ ...mapStyle }} {...props} />

//向上、向下箭头
export const Xiangshang = props => <IconConfig type="icon-jiantou_xiangshang1" style={{ ...mapStyle }} {...props} />
export const Xiangxia = props => <IconConfig type="icon-jiantou_xiangxia1" style={{ ...mapStyle }} {...props} />
// 电量
export const DianliangIcon = (props) => <IconConfig type="icon-dianliang" {...props} />