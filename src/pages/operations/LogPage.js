import React, { Component } from 'react';
import { Card, Select, Timeline, Icon, Tag, Pagination, Empty, Modal, Upload, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTree from '@/components/NavigationTree';
import RangePicker_ from '@/components/RangePicker';
import LogTimeList from './components/LogTimeList';
import styles from './index.less';

const { Option } = Select;

class LogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: props.dgimn,
      type: null,
      maintenanceSelectValue: props.maintenanceSelectValue,
    };
  }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.dgimn !== nextProps.dgimn) {
      this.setState({
        DGIMN: nextProps.dgimn,
      });
    }
    if (this.props.maintenanceSelectValue !== nextProps.maintenanceSelectValue) {
      this.setState({
        maintenanceSelectValue: nextProps.maintenanceSelectValue,
      });
    }
  }
  render() {
    return (
      <>
        {/* <NavigationTree choice={false} onItemClick={value => {
          if (!value[0].IsEnt) {
            if (this.state.DGIMN !== value[0].key) {
              this.setState({
                DGIMN: value[0].key,
                type: value[0].Type
              })
            }
          }
        }} />  */}
        {/* <div id="contentWrapper" className={styles.operationLogWrapper}> */}
        <div>
          {/* <BreadcrumbWrapper> */}
          {this.state.DGIMN && (
            <LogTimeList
              DGIMN={this.state.DGIMN}
              mainSelectValue={this.state.maintenanceSelectValue}
              type={this.state.type}
              setMaintenanceTree={this.maintenanceTree}
            />
          )}
          {/* </BreadcrumbWrapper> */}
        </div>
        {/* </div> */}
      </>
    );
  }
}

export default LogPage;
