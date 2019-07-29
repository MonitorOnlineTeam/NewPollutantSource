import React, { Component } from 'react';
import { Table, Card } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './Video.less';
import config from '@/config';

@connect(({ video, loading }) => ({
  isloading: loading.effects['video/queryhistorydatalisthis'],
  hisrealdata: video.hisrealdataList.hisrealdata,
  total: video.hisrealdataList.total,
  pageSize: video.hisrealdataList.pageSize,
  pageIndex: video.hisrealdataList.pageIndex,
  hiscolumns: video.hiscolumns,
}))
class YsyHisVideoData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beginDate: null,
      endDate: null,
      beginTime: moment(this.props.beginDate).add(-30, 'm'),
      endTime: moment(this.props.endDate),
    };
  }

  componentWillMount = () => {
    const { onRef } = this.props;
    onRef(this);
  };

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  startPlay = (beginDate, endDate) => {
    const { pageIndex, pageSize } = this.props;
    this.setState(
      {
        beginDate,
        endDate,
      },
      () => {
        this.getPollutantTitle();
        this.getRealTime(beginDate, endDate, pageIndex, pageSize);
        this.timerID = setInterval(() => this.tick(), config.PlayDatas);
      },
    );
  };

  endPlay = () => {
    clearInterval(this.timerID);
  };

  tick = () => {
    const { pageIndex, pageSize, total } = this.props;
    const { beginDate, endDate } = this.state;
    const sumSize = total / pageSize;
    if (pageIndex <= sumSize) {
      this.getRealTime(
        beginDate.format('YYYY-MM-DD HH:mm:ss'),
        endDate.format('YYYY-MM-DD HH:mm:ss'),
        pageIndex + 1,
        pageSize,
      );
    } else {
      this.endPlay();
    }
  };

  getPollutantTitle = () => {
    const { match, dispatch } = this.props;
    dispatch({
      type: 'video/querypollutantlisthis',
      payload: { dgimn: match.params.pointcode },
    });
  };

  getRealTime = (beginTime, endTime, pageIndex, pageSize) => {
    const { match, dispatch } = this.props;
    dispatch({
      type: 'video/queryhistorydatalisthis',
      payload: {
        DGIMNs: match.params.pointcode,
        datatype: 'realtime',
        pageIndex: pageIndex === undefined ? 1 : pageIndex,
        pageSize: pageSize === undefined ? 15 : pageSize,
        beginTime,
        endTime,
        isAsc: true,
      },
    });
  };

  /** 分页 */

  onChange = (pageIndex, pageSize) => {
    this.endPlay();
    const { match, dispatch } = this.props;
    const { beginDate, endDate } = this.state;
    dispatch({
      type: 'video/queryhistorydatalisthis',
      payload: {
        DGIMNs: match.params.pointcode,
        datatype: 'realtime',
        pageIndex: pageIndex === undefined ? 1 : pageIndex,
        pageSize: pageSize === undefined ? 15 : pageSize,
        beginTime: beginDate,
        endTime: endDate,
        isAsc: true,
      },
    });
  };

  render() {
    const { hisrealdata, hiscolumns } = this.props;
    const x = hiscolumns.length * 160;
    console.log('----------------------------', x);
    return (
      <Table
        className={styles.dataTable}
        loading={this.props.isloading}
        dataSource={hisrealdata}
        columns={hiscolumns}
        size="small"
        scroll={{ x, y: 'calc(100vh - 645px)' }}
        pagination={{
          total: this.props.total,
          pageSize: this.props.pageSize,
          current: this.props.pageIndex,
          onChange: this.onChange,
        }}
      />
    );
  }
}
export default YsyHisVideoData;
