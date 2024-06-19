import React, { PureComponent } from 'react'
import request from 'umi-request';
import { connect } from 'dva'
import { Card, Row, Col, Button, Tooltip, Divider, message } from 'antd'
import {
  CaretUpOutlined, CaretLeftOutlined, CaretRightOutlined, CaretDownOutlined,
  MinusOutlined, PlusOutlined
} from '@ant-design/icons'
import Cookies from 'js-cookie';
import styles from '../index.less'
import { getTime, getNonce, getCalcSign } from '../utils'

const PZTList = [
  { text: '左上', rotate: -45, flag: 'top', direction: 4 },
  { text: '上', rotate: 0, flag: 'top', direction: 0 },
  { text: '右上', rotate: 45, flag: 'top', direction: 6 },
  { text: '左', rotate: 0, flag: 'left', direction: 2 },
  { text: '上', rotate: 0, hide: true },
  { text: '右', rotate: 0, flag: 'right', direction: 3 },
  { text: '左下', rotate: 45, flag: 'bottom', direction: 5 },
  { text: '下', rotate: 0, flag: 'bottom', direction: 1 },
  { text: '右下', rotate: -45, flag: 'bottom', direction: 7 },
]

const PZTZoomList = [
  { direction: 9, flag: 'L', title: "缩小" },
  { text: '缩放' },
  { direction: 8, flag: 'R', title: "放大" },
]

@connect(({ loading, global }) => ({
  configInfo: global.configInfo,
}))
class PTZ extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.getLCSystemAndIdParams();
    // this.getToken();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.deviceSerial !== prevProps.deviceSerial || this.props.channelNo !== prevProps.channelNo) {
      // this.getToken();
    }
  }

  // 云台操作
  start = (direction) => {
    const { deviceSerial, channelNo, appKey, appSecret, AccessToken } = this.props;
    const time = getTime();
    const nonce = getNonce();
    const id = Math.round(Math.random() * 100);
    const sign = getCalcSign(time, nonce, appSecret);
    fetch(`/openapi/controlMovePTZ`, {
      method: 'POST', // or 'PUT'
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // },
      body: JSON.stringify({
        "system": {
          "ver": "1.0",
          "appId": appKey,
          "sign": sign,
          "time": time,
          "nonce": nonce
        },
        "id": id,
        "params": {
          "token": AccessToken,
          "deviceId": deviceSerial,
          "channelId": channelNo,
          "operation": direction,
          "duration": "1000"
        }
      }),
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        if (response.result.code !== '0') {
          message.error(response.result.msg)
        }
      });
  }

  // 渲染云台dom
  renderPTZContent = () => {
    // let element = '';
    let element = PZTList.map((item, index) => {
      if (item.hide === true) {
        return <Col span="8" style={{ textAlign: 'center' }}></Col>
      } else {
        let icon = <CaretUpOutlined style={{ transform: `rotate(${item.rotate}deg)`, fontSize: 18 }} />
        if (item.flag === 'center') {
          icon = <CaretUpOutlined style={{ transform: `rotate(${item.rotate}deg)`, fontSize: 18 }} />
        }
        if (item.flag === 'bottom') {
          icon = <CaretDownOutlined style={{ transform: `rotate(${item.rotate}deg)`, fontSize: 18 }} />
        }
        if (item.flag === 'left') {
          icon = <CaretLeftOutlined style={{ transform: `rotate(${item.rotate}deg)`, fontSize: 18 }} />
        }
        if (item.flag === 'right') {
          icon = <CaretRightOutlined style={{ transform: `rotate(${item.rotate}deg)`, fontSize: 18 }} />
        }
        return <Col span="8" style={{ textAlign: 'center', marginBottom: index < 6 ? 8 : 0 }}>
          <Tooltip title={item.text}>
            <Button shape="circle" onClick={() => { this.start(item.direction) }}>
              {/* <CaretUpOutlined style={{ transform: `rotate(${item.rotate}deg)`, fontSize: 18 }} /> */}
              {icon}
            </Button>
          </Tooltip>
        </Col>
      }
    })
    return element;
  }

  renderPTZContent2 = () => {
    return PZTZoomList.map(item => {
      if (item.text) {
        return <Col span={8} style={{ textAlign: 'center' }}>
          {item.text}
        </Col>
      }
      let icon = <MinusOutlined />;
      if (item.flag === 'R') {
        icon = <PlusOutlined />
      }
      return <Col span={8} style={{ textAlign: 'center' }}>
        <Tooltip title={item.title}>
          <Button shape="circle" onClick={() => { this.start(item.direction) }}>
            {icon}
          </Button>
        </Tooltip>
      </Col>
    })
  }

  render() {
    return (
      <Card
        title="云台操作"
        size="small"
        bodyStyle={{ width: '100%' }}
      >
        <div className={styles.PTZContainer}>
          <div className={styles.left}>
            <Row>
              {this.renderPTZContent()}
            </Row>
          </div>
          <div className={styles.right}>
            <Row gutter={[0, 8]} justify='center' style={{ alignItems: 'center' }}>
              {this.renderPTZContent2()}
            </Row>
          </div>
        </div>
      </Card >
    );
  }
}

export default PTZ;