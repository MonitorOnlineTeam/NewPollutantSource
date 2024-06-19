/*
 * @Author: jab
 * @Date: 2024
 * @LastEditors: jab
 * @Description: 运维台账 合并运维日志和运维记录
 */
import React, { Component } from 'react';
import { Table,Tabs } from 'antd';
import { PointIcon } from '@/utils/icon';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTree from '@/components/NavigationTree';
import OperationRecord from '@/components/OperationRecord';
import OperationRecordList from '../operationRecordList/ContentPage'
import styles from "./style.less"

@connect(({ operationform, loading }) => ({
  breadTitle: operationform.breadTitle,
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dgimn: '',
      type: '',
      breadTitle: props.breadTitle,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.breadTitle !== nextProps.breadTitle) {
      const breadTitle = { breadTitle: nextProps.breadTitle };

      this.setState({ ...this.state, ...breadTitle });
    }
  }
  render() {
    const { breadTitle } = this.state;
    return (
      <div id="record"  className={styles.operationLedgerSty}>
       <NavigationTree
          runState='1'
          domId="#record"
          choice={false}
          onItemClick={value => {
            if (value.length > 0 && !value[0].IsEnt) {
              this.setState({
                dgimn: value[0].key,
                type: value[0].Type,
              });
            }
          }}
        />
        <BreadcrumbWrapper title={breadTitle} hideBreadcrumb={this.props.hideBreadcrumb}>
            <div>
              {this.state.dgimn && <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    label: `运维日志`,
                    key: '1',
                    children: <OperationRecord DGIMN={this.state.dgimn} PollutantType={this.props.type} {...this.props} />,
                  },
                  {
                    label: `运维记录`,
                    key: '2',
                    children: <OperationRecordList DGIMN={ this.state.dgimn}  PollutantType={this.state.type} {...this.props}/>,
                  },
                ]}
              />}
              </div>
        </BreadcrumbWrapper>
      </div>
    );
  }
}
export default Index;
