import CustomIcon from '@/components/CustomIcon';
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';

// 获取筛选状态图标颜色
function getColor(status) {
  let color = ''
  switch (status) {
    case 0:// 离线
      color = '#999999'
      break;
    case 1:// 正常
      color = '#34c066'
      break;
    case 2:// 超标
      color = '#f04d4d'
      break;
    case 3:// 异常
      color = '#e94'
      break;
  }
  return color
}

// 地图图标
export function getMapPollutantIcon(pollutantType, status) {
  let icon = "";
  if (pollutantType == 1) {
    // 废水
    switch (status) {
      case 0:// 离线
        icon = <WaterOffline />
        break;
      case 1:// 正常
        icon = <WaterNormal />
        break;
      case 2:// 超标
        icon = <WaterExceed />
        break;
      case 3:// 异常
        icon = <WaterAbnormal />
        break;
    }
  }
  if (pollutantType == 2) {
    // 气
    switch (status) {
      case 0:// 离线
        icon = <GasOffline />
        break;
      case 1:// 正常
        icon = <GasNormal />
        break;
      case 2:// 超标
        icon = <GasExceed />
        break;
      case 3:// 异常
        icon = <GasAbnormal />
        break;
    }
  }
  const mapStyle = {
    fontSize: 24,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0px 0px 3px 2px #fff',
  }
  const style = { fontSize: 24, color: getColor(status), ...mapStyle }
  switch (pollutantType) {
    case '10':
      return <VocIcon style={style} />
    case '6':
      return <a><CustomIcon type="icon-richangshenghuo-shuizhan" style={{ ...style }} /></a>
    case '9':
      return <a><CustomIcon type="icon-echoujiance" style={{ ...style }} /></a>
    case '12':
      return <CustomIcon type="icon-yangchen1" style={{ ...style }} />
    case '5':
      return <a><CustomIcon type="icon-fangwu" style={style} /></a>
    case '37':
      return <CustomIcon type="icon-dian2" style={{ ...style }} />
  }
  return icon;
}