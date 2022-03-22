
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NoAccountAirStatisticsPhoto from './noAccountAirStatisticsPhoto';
import { connect } from 'dva';
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
      <BreadcrumbWrapper  title={`${this.props.location.query.Region}${this.props.noAccountAirStatisticsForm.BeginTime}至${this.props.noAccountAirStatisticsForm.EndTime}大气站缺失台账照片工单记录`}>
      <NoAccountAirStatisticsPhoto requestData = {this.props.location.query.requestData}/>
      </BreadcrumbWrapper>
    );
  }
}
