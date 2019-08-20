import React, { Component } from 'react';
import { Card, Select, Timeline, Icon, Tag, Pagination, Empty, Modal, Upload, message } from 'antd'
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '@/components/NavigationTree'
import RangePicker_ from '@/components/RangePicker'
import LogTimeList from './components/LogTimeList'
import styles from './index.less'

const { Option } = Select;


class LogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: ""
    };
  }
  componentDidMount() {

  }

  render() {
    return (
      <>
        <NavigationTree choice={false} onItemClick={value => {
          if (this.state.DGIMN !== value[0].key) {
            console.log('value=', value)
            this.setState({
              DGIMN: value[0].key
            })
          }
        }} />
        <div id="contentWrapper" className={styles.operationLogWrapper}>
          <PageHeaderWrapper>
            {
              this.state.DGIMN && <LogTimeList DGIMN={this.state.DGIMN} />
            }
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default LogPage;
