
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import NoDetails from './noAccountAirStatisticsDetails'
@connect(({  noAccountAirStatistics}) => ({
   
    noAccountAirStatisticsForm: noAccountAirStatistics.noAccountAirStatisticsForm,
  }))

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {

  }
  render() {
    return (
      <BreadcrumbWrapper title={`${this.props.location.query.Region}${this.props.noAccountAirStatisticsForm.BeginTime}至${this.props.noAccountAirStatisticsForm.EndTime}空气站监测点缺失台账照片统计信息`}>
     <NoDetails requestData = {this.props.location.query.requestData}/>
      </BreadcrumbWrapper>
    );
  }
}
