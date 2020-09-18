import React, { Component } from 'react';
import {
  Spin,
  Radio,
  Button,
  Row,
  Col,
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import { connect } from 'dva';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import config from "@/config";
import styles from './Home.less';
import Industry from "./components/Industry"
import QCAType from "./components/QCAType"
import WryInfo from "./components/WryInfo"
import RankTOP5 from "./components/RankTOP5"
import RealtimeAlarm from "./components/RealtimeAlarm"
import AlarmCount from "./components/AlarmCount"
import QCAQualifiedDays from "./components/QCAQualifiedDays"
import ForTheRecord from "./components/ForTheRecord"
import QCAExecuteRate from "./components/QCAExecuteRate"
import QCAFPY from "./components/QCAFPY"
import OutletNumber from "./components/OutletNumber"
import Time from "@/components/Time"
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
import moment from 'moment';
import { router } from "umi"

const statusList = [
  { text: "在线", checked: false, color: "#52c41a", value: 1, count: 33, className: "green" },
  { text: "离线", checked: false, color: "#d9d9d9", value: "0", count: 4, className: "default" },
  { text: "超标", checked: false, color: "#f5222d", value: 2, count: 4, className: "red" },
  { text: "异常", checked: false, color: "#fa8c16", value: 3, count: 6, className: "orange" },
  { text: "备案不符", checked: false, color: "#fa8c16", value: 5, count: 1, className: "volcano" },
  { text: "监测不合格", checked: false, color: "#faad14", value: 4, count: 2, className: "magenta" },
];

const RadioButton = Radio.Button;
const { RunningRate, TransmissionEffectiveRate, amapKey } = config;
let _thismap;

@connect(({ loading, home }) => ({
}))
class Home extends Component {
  constructor(props) {
    super(props);
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
    // this.fontSizeInit();
    this.mapEvents = {
      created(m) {
        _thismap = m;
        setTimeout(() => {
          m.setFitView();
        }, 1000)
      },
      complete: () => {
        //_thismap.setZoomAndCenter(13, [centerlongitude, centerlatitude]);
      }
    };
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

  getRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
  }

  randomMarker = (len) => (
    Array(len).fill(true).map((e, idx) => ({
      position: {
        longitude: 112 + Math.random() * 6,
        latitude: 37 + Math.random() * 5,
      },
      status: this.getRandomNum(0, 3),
      type: this.getRandomNum(1, 2)
    }))
  );

  markersEvents = {
    click: (MapsOption, marker) => {
      const itemData = marker.getExtData();
      // this.markersCilck(itemData);
    }
  };

  render() {
    const { mapCenter, ponitList } = this.state;
    const { month } = this._SELF_;
    return (
      <div className={styles.homeWrapper}>
        <header className={styles.homeHeader}>
          <p><span>SDL</span> 污染源智能质控系统</p>
          <a className={styles.backMenu} onClick={() => {
            router.push(Cookie.get("systemNavigateUrl"))
          }}>系统功能</a>
        </header>

        <div className={styles.homeContainer}>
          <Map
            resizeEnable={true}
            events={this.mapEvents}
            mapStyle="amap://styles/darkblue"
            amapkey={amapKey}
          // center={mapCenter}
          >
            <InfoWindow
              position={this.state.hoverMapCenter}
              isCustom
              showShadow
              autoMove
              visible={this.state.infoWindowHoverVisible}
              offset={[4, -35]}
            >{this.state.currentTitle}</InfoWindow>
            <Markers
              markers={this.randomMarker(50)}
              events={this.markersEvents}
              className={this.state.special}
              render={this.renderMarkers}
            />
          </Map>
          <div className={styles.leftWrapper}>
            <div className={`${styles.category} ${styles.category1}`}>
              <div className={styles.title}>
                <p>
                  污染源信息
                  <img src="/01.png" alt="" />
                </p>
              </div>
              <WryInfo />
            </div>
            <div className={`${styles.category} ${styles.category2}`}>
              <div className={styles.title}>
                <p>
                  污染源行业
                  <img src="/01.png" alt="" />
                </p>
              </div>
              <Industry />
            </div>
            <div className={`${styles.category} ${styles.category3}`}>
              <div className={styles.title}>
                <p>
                  备案信息
                  <img src="/01.png" alt="" />
                </p>
              </div>
              <ForTheRecord />
            </div>
          </div>
          <div className={styles.rightWrapper}>
            <div className={`${styles.category} ${styles.category1}`}>
              <div className={styles.title}>
                <p>
                  实时报警信息
                  <img src="/01.png" alt="" />
                </p>
              </div>
              <RealtimeAlarm />
            </div>
            <div className={`${styles.category} ${styles.category2}`}>
              <div className={styles.title}>
                <p>
                  {month}月报警次数分析
                  <img src="/01.png" alt="" />
                </p>
              </div>
              <AlarmCount />
            </div>
            <div className={`${styles.category} ${styles.category3}`}>
              <div className={styles.title}>
                <p>
                  {month}月报警排口数量分析
                  <img src="/01.png" alt="" />
                </p>
              </div>
              <OutletNumber />
            </div>
          </div>
          <div className={styles.centerWrapper}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 30,
                zIndex: 100
              }}
            >
              <Radio.Group style={{}} defaultValue={this.state.radioDefaultValue} buttonStyle="solid" size="default" onChange={this.onRadioChange}>
                <RadioButton key="-1" value="">全部</RadioButton>
                <RadioButton key={1} value={1}>废气</RadioButton>
                <RadioButton key={2} value={2}>废水</RadioButton>
              </Radio.Group>
            </div>
          </div>
          <div className={styles.monitoringContainer}>
            <div className={styles.title}>
              <span style={{ fontSize: 17 }}>实时监控</span>
              <Time style={{ marginLeft: 10 }} />
            </div>
            <p className={styles.total}>
              当前监测排口总数量<span>50</span>个
              </p>
            <ul className={styles.number}>
              {
                statusList.map(item => {
                  return <li>
                    <i style={{ backgroundColor: item.color }}></i>
                    {item.text}：{item.count}个
                    </li>
                })
              }
            </ul>
          </div>
          <div className={styles.bottomWrapper}>
            <div className={`${styles.category}`}>
              <Row style={{ height: '100%' }}>
                <Col span={12} style={{ height: "100%" }}>
                  <div className={styles.title}>
                    <p>
                      {month}月质控执行率
                    </p>
                  </div>
                  <QCAExecuteRate />
                </Col>
                <Col span={12} style={{ height: "100%" }}>
                  <div className={styles.title}>
                    <p>
                      {month}月质控合格率
                    </p>
                  </div>
                  <QCAFPY />
                </Col>
              </Row>

            </div>
            <div className={styles.centerContainer}>
              <div className={`${styles.category}`}>
                <div className={styles.title}>
                  <p>
                    {month}月质控类别合格情况
                  <img src="/01.png" alt="" />
                  </p>
                </div>
                <QCAType />
              </div>
              <div className={`${styles.category}`}>
                <div className={styles.title}>
                  <p>
                    {month}月质控排名TOP5
                  <img src="/01.png" alt="" />
                  </p>
                </div>
                <RankTOP5 />
              </div>
            </div>
            <div className={`${styles.category}`}>
              <div className={styles.title}>
                <p>
                  {month}月质控合格天数
                  <img src="/01.png" alt="" />
                </p>
              </div>
              <QCAQualifiedDays />
            </div>
          </div>


        </div>
      </div>
    );
  }
}
export default Home;
