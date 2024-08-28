/*
 * @Author: jab
 * @Date: 2024
 * @LastEditors: outman0611
 * @Description: 运维台账 合并运维日志和运维记录
 */
import React, { Component } from 'react';
import { Table,Tabs,Radio } from 'antd';
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
      tabType:1,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.breadTitle !== nextProps.breadTitle) {
      const breadTitle = { breadTitle: nextProps.breadTitle };

      this.setState({ ...this.state, ...breadTitle });
    }
  }
  render() {
    const {dgimn, breadTitle,tabType } = this.state;
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
        <BreadcrumbWrapper  hideBreadcrumb={this.props.hideBreadcrumb}>
           {dgimn && <>
           <div style={{position:'absolute',right:0,zIndex:10,lineHeight:'65px'}}>
            <Radio.Group
                defaultValue={1}
                onChange={e => {
                  this.setState({
                    tabType:e.target.value
                  })
                }}
              >
                <Radio.Button value={1}>时间轴</Radio.Button>
                <Radio.Button value={2}>列表</Radio.Button>
              </Radio.Group>
             </div>
              {tabType == 1 && <OperationRecord DGIMN={this.state.dgimn} PollutantType={this.props.type} {...this.props} />}
              {tabType == 2 && <OperationRecordList DGIMN={ this.state.dgimn}  PollutantType={this.state.type} {...this.props}/>} 
               {/* <Tabs
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
              /> */}
              </>}
        </BreadcrumbWrapper>
      </div>
    );
  }
}
export default Index;
