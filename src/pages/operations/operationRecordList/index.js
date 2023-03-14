/*
 * @Author: jab
 * @Date:2023.03
 * @LastEditors: jab
 * @Description: 运维记录
 */
import React, { Component } from 'react';
import { Table } from 'antd';
import { PointIcon } from '@/utils/icon';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTree from '@/components/NavigationTree';
import ContentPage from './ContentPage';

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
      <div id="record">
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
          { this.props.DGIMN && <ContentPage DGIMN={ this.props.DGIMN} PollutantType={this.props.type} {...this.props}/>}
        
        </BreadcrumbWrapper>
      </div>
    );
  }
}
export default Index;
