import React, { PureComponent } from 'react'
import request from 'umi-request';
import { connect } from 'dva'
import { Card, Row, Col, Button, Tooltip, Divider, message } from 'antd'
import {
  CaretUpOutlined, CaretLeftOutlined, CaretRightOutlined, CaretDownOutlined,
  MinusOutlined, PlusOutlined
} from '@ant-design/icons'
import Cookies from 'js-cookie';
import styles from './index.less'

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
  { direction: 10, flag: 'L', title: "近焦距" },
  { text: '焦距' },
  { direction: 11, flag: 'R', title: "远焦距" },
]

@connect(({ loading, global }) => ({
  configInfo: global.configInfo,
}))
class YSYPTZ extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.playViode();
  }


  playViode = () => {
    if (Cookies.get('YSYAccessToken')) {
      // this.onPlayClick()
    } else {
      this.getAccessToken();
    }
  }

  getAccessToken = () => {
    const { configInfo } = this.props;
    fetch(`https://open.ys7.com/api/lapp/token/get?appKey=${configInfo.YSYAppKey}&appSecret=${configInfo.YSYSecret}`, {
      method: 'POST', // or 'PUT'
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        Cookies.set('YSYAccessToken', response.data.accessToken, { expires: 7 });
        this.setState({ accessToken: response.data.accessToken });
        // this.onPlayClick(response.data.accessToken);
      });
  }

  // 云台操作
  start = (direction) => {
    const { deviceSerial, channelNo } = this.props;
    let accessToken = Cookies.get('YSYAccessToken');
    fetch(`https://open.ys7.com/api/lapp/device/ptz/start?accessToken=${accessToken}&deviceSerial=${deviceSerial}&channelNo=${channelNo}&direction=${direction}&speed=1`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        if (response.code !== '200') {
          message.error(response.msg)
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

export default YSYPTZ;