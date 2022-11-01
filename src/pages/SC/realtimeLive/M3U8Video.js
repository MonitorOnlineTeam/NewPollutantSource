import React, { PureComponent } from 'react'
import VideoPlayer from './VideoPlayer';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Row, Col, Card } from 'antd';
import moment from 'moment';
import { connect } from 'dva'
import styles from './index.less'
import 'video.js/dist/video-js.min.css';


@connect(({ loading, SC }) => ({
  columns: SC.columns,
  realdata: SC.realdata
}))
class M3U8Video extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.timer = '';
  }

  componentDidMount() {
    this.getPollutantTitle();
    this.getRealTime();
    this.timer = setInterval(() => {
      this.getRealTime();
    }, 10000)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  getPollutantTitle = () => {
    this.props.dispatch({
      type: 'SC/getPollutantList',
      payload: { DGIMNs: 'Drone001', },
    });
  };

  getRealTime = () => {
    const rangeDate = [
      moment(new Date())
        .add(-5, 'm')
        .format('YYYY-MM-DD HH:mm:ss'),
      moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    ];
    this.props.dispatch({
      type: 'SC/getRealTimeData',
      payload: {
        DGIMNs: 'Drone001',
        datatype: 'realtime',
        pageIndex: 1,
        pageSize: 30,
        beginTime: rangeDate[0],
        endTime: rangeDate[1],
      },
    });
  };

  // <Alert message="Info Text" type="info" />
  getTreeDatalist = () => {
    const { realdata, columns } = this.props;
    let res = [];
    if (columns && realdata.length > 0) {
      if (columns.length !== 0) {
        columns.map((item, key) => {
          const i = key;
          const code = item.key;
          res.push(
            <div className={styles.cardDiv}>
              <div className={styles.cardtopspan}>
                <span className={styles.pointName}>{item.title}</span>
                <span className={styles.pollutantType}>
                  {realdata[0][code] === undefined ? '-' : realdata[0][code]}
                </span>
              </div>
            </div>
          );
        });
      }
    } else {
      res = <div style={{ textAlign: 'center', height: 70, background: '#fff' }}>暂无数据</div>;
    }
    return res;
  };

  render() {
    console.log('props=', this.props);
    const { realdata } = this.props;
    return <BreadcrumbWrapper>
      <Row style={{ height: 'calc(100% - 40px)' }}>
        {/* <Col flex="auto" style={{ padding: 20, height: 'calc(100vh - 146px)' }}> */}
        <Col flex="auto" style={{ padding: 20, }}>
          <VideoPlayer src={'http://223.84.203.227:8088/record/cam/47568770720087/01/20220803/out.m3u8'} />
        </Col>
        <Col flex="440px" style={{ padding: 20 }}>
          <Row style={{ width: '100%' }}>
            <Card
              title="实时数据"
              style={{ width: '100%' }}
              bodyStyle={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }}
              extra={<div style={{ color: 'gray' }}>{realdata[0].MonitorTime || ''}</div>}
              size="small"
            >
              {this.getTreeDatalist()}
            </Card>
          </Row>
        </Col>
      </Row>
    </BreadcrumbWrapper>
  }
}

export default M3U8Video;