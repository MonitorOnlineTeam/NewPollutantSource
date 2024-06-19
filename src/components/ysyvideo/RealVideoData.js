import React, { Component, Fragment } from 'react';
import { Spin, Card, Divider } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';

@connect(({ videodata, loading }) => ({
  isloadingC: loading.effects['videodata/querypollutantlist'],
  isloadingp: loading.effects['videodata/queryhistorydatalist'],
  realdata: videodata.realdata,
  columns: videodata.columns,
}))
class RealVideoData extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount = () => {
    this.getPollutantTitle();
    this.getRealTime();
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.dgimn !== prevProps.dgimn) {
      this.getPollutantTitle();
      this.getRealTime();
    }
  }

  getPollutantTitle = () => {
    const { match, dispatch, dgimn } = this.props;
    dispatch({
      type: 'videodata/querypollutantlist',
      payload: { dgimn },
    });
  };

  getRealTime = () => {
    const rangeDate = [
      moment(new Date())
        .add(-10, 'm')
        .format('YYYY-MM-DD HH:mm:ss'),
      moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    ];
    const { match, dispatch, dgimn } = this.props;
    dispatch({
      type: 'videodata/queryhistorydatalist',
      payload: {
        DGIMNs: dgimn,
        datatype: 'realtime',
        pageIndex: 1,
        pageSize: 20,
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
          let standard = '';
          if (item.StandardValue) {
            standard = ` (${item.StandardValue}) `
          }
          res.push(
            <Fragment>
              <div className={styles.cardDiv}>
                <div className={styles.cardtopspan}>
                  <span className={styles.pointName}>{item.title}</span>
                  <span className={styles.pollutantType}>
                    {realdata[0][code] === undefined ? '-' : realdata[0][code] + standard}
                    {/* {realdata[0][code] === undefined ? '-' : realdata[0][code]} */}
                  </span>
                </div>
              </div>
            </Fragment>,
          );
        });
      }
    } else {
      res = <div style={{ textAlign: 'center', height: 70, background: '#fff' }}>暂无数据</div>;
    }
    return res;
  };

  render() {
    const { isloadingC, isloadingP, realdata, isShowControl } = this.props;
    let MonitorTime;
    if (realdata.length > 0) {
      MonitorTime = realdata[0].MonitorTime;
    }

    return (
      <div className={styles.tab}>
        <Card
          title="实时数据"
          bodyStyle={{ height: isShowControl ? 'calc(100vh - 480px)' : 'calc(100vh - 358px)', overflowY: 'auto' }}
          extra={<div style={{ color: 'gray' }}>{MonitorTime}</div>}
          loading={isloadingC && isloadingP}
          size="small"
        >
          {this.getTreeDatalist()}
        </Card>
      </div>
    );
  }
}
export default RealVideoData;
