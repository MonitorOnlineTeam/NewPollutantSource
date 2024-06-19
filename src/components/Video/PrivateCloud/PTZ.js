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
import axios from 'axios';

const PZTList = [
  { text: '左上', rotate: -45, flag: 'top', direction: 'upleft' },
  { text: '上', rotate: 0, flag: 'top', direction: 'up' },
  { text: '右上', rotate: 45, flag: 'top', direction: 'upright' },
  { text: '左', rotate: 0, flag: 'left', direction: 'left' },
  { text: '上', rotate: 0, hide: true },
  { text: '右', rotate: 0, flag: 'right', direction: 'right' },
  { text: '左下', rotate: 45, flag: 'bottom', direction: 'downleft' },
  { text: '下', rotate: 0, flag: 'bottom', direction: 'down' },
  { text: '右下', rotate: -45, flag: 'bottom', direction: 'downright' },
]

const PZTZoomList = [
  { direction: 'zoomin', flag: 'L', title: "缩小" },
  { text: '缩放' },
  { direction: 'zoomout', flag: 'R', title: "放大" },
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
  }

  // 云台操作
  start = (direction) => {
    const { deviceSerial, channelNo } = this.props;
    axios.post(`/api/ptz/control/${deviceSerial}/${channelNo}?command=${direction}&horizonSpeed=30&verticalSpeed=30&zoomSpeed=30`)
    //   let accessToken = Cookies.get('YSYAccessToken');
    //   fetch(`http://172.16.12.135:18080/api/ptz/control/${deviceSerial}/${channelNo}?command=${direction}&horizonSpeed=30&verticalSpeed=30&zoomSpeed=30`, {
    //     method: 'POST', // or 'PUT'
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       'Access-Control-Allow-Credentials': true
    //     },
    //     // Cookie: 'JSESSIONID=9EAF84C7947B45464BEC24BD3A5BFB67; session={"username":"admin","roleId":1}'
    //     credentials: 'include'
    //   })
    //     .then(res => res.json())
    //     .catch(error => console.error('Error:', error))
    //     .then(response => {

    //     });
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
            <Button shape="circle" onMouseDown={() => this.start(item.direction)} onMouseUp={() => this.start('stop')}>
              {/* onClick={() => { this.start(item.direction) }}> */}
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