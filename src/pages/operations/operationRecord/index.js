/*
 * @Author: lzp
 * @Date: 2019-08-16 09:42:03
 * @LastEditors: lzp
 * @LastEditTime: 2019-08-16 09:42:03
 * @Description: 运维记录页面
 */
import React, { Component } from 'react';
import { Table } from 'antd';
import { PointIcon } from '@/utils/icon';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTree from '@/components/NavigationTree';
import OperationRecord from '@/components/OperationRecord';

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
    const { isHomeModal } = this.props;
    return ( 
      <div id="record">
        {!isHomeModal&&<NavigationTree
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
        />}
        <BreadcrumbWrapper title={breadTitle} hideBreadcrumb={this.props.hideBreadcrumb}>
        {!isHomeModal?<> { this.state.dgimn && (
            <OperationRecord DGIMN={ this.state.dgimn} PollutantType={this.state.type} />
          )}</>
          :
          <> { this.props.DGIMN && <OperationRecord DGIMN={ this.props.DGIMN} PollutantType={this.props.type} {...this.props}/>}</>
        }
        </BreadcrumbWrapper>
      </div>
    );
  }
}
export default Index;
