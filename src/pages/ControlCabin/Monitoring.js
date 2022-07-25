import React, { Component } from 'react';
import {
  Spin,
  Radio,
  Button,
  Row,
  Col,
  Modal,
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import { connect } from 'dva';
import { AMapScene, Marker, PointLayer } from '@antv/l7-react';
import config from "@/config";
import styles from './index.less';
import Time from "@/components/Time"
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
import moment from 'moment';
import { router } from "umi"
import { positionList } from "./position"
import EntWorkOrderStatistics from '@/pages/IntelligentAnalysis/operationWorkStatis/entWorkOrderStatistics/components/EntWorkOrderStatistics'
import ContentWrapper from './components/ContentWrapper'
import ContentItemWrapper from './components/ContentItemWrapper'
import PointState from './components/PointState'
import Rate from './components/contentComponents/monitoring/Rate'
import Alarm from './components/contentComponents/monitoring/Alarm'
import Rank from './components/contentComponents/monitoring/Rank'
import EmissionsAnalysis from './components/contentComponents/monitoring/EmissionsAnalysis'
import Video from './components/contentComponents/Video'

const RadioButton = Radio.Button;
const { RunningRate, TransmissionEffectiveRate, amapKey } = config;
let _thismap;

const pollutantTypeList = [
  {
    "pollutantTypeName": "废水",
    "pollutantTypeCode": 1,
    "count": 6
  },
  {
    "pollutantTypeName": "废气",
    "pollutantTypeCode": 2,
    "count": 3
  },
  {
    "pollutantTypeName": "空气站",
    "pollutantTypeCode": 5,
    "count": 5
  }
]

const MarkerPinImg = {
  green:
    'https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*JhBbT4LvHpQAAAAAAAAAAAAAARQnAQ',
  blue:
    'https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*n6cXTb8R7iUAAAAAAAAAAAAAARQnAQ',
};


const MarkerInfo = ({ title }) => {
  return (
    // <div className="markerContent">
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '32px',
          padding: '0.05rem',
          background: '#1677ff',
          borderRadius: '30px',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          style={{
            width: '20px',
            height: '30px',
          }}
          alt="marker"
          src={MarkerPinImg.blue}
        />
      </div>
    </div>
  );
};

@connect(({ loading, home }) => ({
}))
class Monitoring extends Component {
  constructor(props) {
    super(props);
    document.documentElement.className = 'home-dark-theme';
    this.state = {
      mapCenter: [105.121964, 33.186871],
      radioDefaultValue: "",
      ponitList: [
        {
          position: {
            latitude: 39.82793,
            longitude: 79.134,
          },
          type: 1,
          title: "1#废水进口",
        },
        {
          position: {
            latitude: 86.05068,
            longitude: 44.45169,
          },
          type: 1,
          title: "进水口",
        },
        {
          position: {
            latitude: 41.06234,
            longitude: 89.19477,
          },
          type: 2,
          title: "2#窑尾",
        },
        {
          position: {
            latitude: 39.76476,
            longitude: 79.1623,
          },
          type: 1,
          title: "1#废水排放口",
        },
        {
          position: {
            latitude: 42.69216,
            longitude: 93.51414,
          },
          type: 1,
          title: "出水口在线监测",
        },
        {
          position: {
            latitude: 42.53455,
            longitude: 94.12482,
          },
          type: 1,
          title: "回转窑窑尾排口",
        },
        {
          position: {
            latitude: 40.55398,
            longitude: 81.31194,
          },
          type: 1,
          title: "进水口",
        },

      ],
    };

    this._SELF_ = {
      month: moment().format('MM') * 1
    }
  }

  componentDidMount() {
    let htmlElement = document.documentElement;
    htmlElement.setAttribute("id", "darkHtml")
  }

  componentWillUnmount() {
    let htmlElement = document.documentElement;
    htmlElement.setAttribute("id", "")
  }

  // fontSizeInit = () => {
  //   // 获取屏幕宽度
  //   var width = document.documentElement.clientWidth
  //   // 设置根元素字体大小。此时为宽的10等分
  //   document.documentElement.style.fontSize = width / 19.2 + 'px'
  // }

  // componentDidMount() {
  //   //监听窗口大小改变
  //   window.addEventListener('resize', this.fontSizeInit.bind(this));
  // }
  // //移除监听器，防止多个组件之间导致this的指向紊乱
  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.fontSizeInit.bind(this));
  // }

  getPollutantIcon = (pollutantType, status) => {
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
    return icon;
  }

  renderMarkers = (extData) => {
    console.log("extData=", extData)
    return <div>
      {this.getPollutantIcon(extData.type, extData.status)}
      {/* {
        extData.type === 1 ? <WaterIcon /> : <GasIcon />
      } */}
    </div>
  }

  onMenuClick = (url) => {
    window.open(`http://${url}/hrefLogin`)
    // router.push(`${url}/hrefLogin`)
  }





  render() {
    const { mapCenter, ponitList } = this.state;
    const { month } = this._SELF_;
    return (
      <div className={styles.homeWrapper}>
        <AMapScene
          map={{
            resizeEnable: true,
            rotateEnable: true,
            pitchEnable: true,
            buildingAnimation: true,//楼块出现是否带动画
            expandZoomRange: true,
            center: [89.19477, 41.26082325],
            pitch: 50,
            style: 'dark',
            zoom: 15,
            // mapStyle: 'dark',
            mapStyle: "amap://styles/darkblue"
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {
            ponitList.map((item, index) => {
              return <Marker key={index} lnglat={[item.position.longitude, item.position.latitude]}>
                <MarkerInfo title={item.title} />
              </Marker>
            })
          }
        </AMapScene>
        <Row gutter={16} className={styles.homeContainer}>
          <ContentWrapper position="left">
            {/* 运行分析 */}
            <Rate />
            {/* 报警 */}
            <Alarm />
            <ContentItemWrapper title="空气质量日历" />
          </ContentWrapper>
          <ul className={styles.pollutantTypeWrapper}>
            {
              pollutantTypeList.map(item => {
                return <li>
                  <img src={`/ControlCabin/pollutantTypeIcon/${item.pollutantTypeCode}.png`} alt="" />
                  <span>{item.pollutantTypeName}</span>
                  <span>{item.count}个</span>
                </li>
              })
            }
          </ul>
          <PointState />
          <ContentWrapper position="right">
            <Rank />
            <EmissionsAnalysis />
            <Video />
          </ContentWrapper>
        </Row>
        <Modal footer={false} width="80vw" title="Basic Modal" visible={false} onCancel={() => this.setState({ modalVisible: false })}>
          <EntWorkOrderStatistics />
        </Modal>
      </div>
    );
  }
}
export default Monitoring;
