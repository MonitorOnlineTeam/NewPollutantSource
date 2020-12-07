/*
 * @Description:单区域 运维工单统计-空气站 排口
 * @LastEditors: hxf
 * @Date: 2020-10-27 10:15:25
 * @LastEditTime: 2020-12-02 11:36:27
 * @FilePath: /NewPollutantSource/src/pages/IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/RegionAirQualityMonitoringStation.js
 */

import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'; // 外层cpmponent 包含面包屑
import { Card, Form, Col, Row, Select, Input, Checkbox, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import { downloadFile } from '@/utils/utils';
import moment from 'moment';
import { router } from 'umi';

import { checkParent } from './utils';
import RegionAirQualityMonitoringStationContent from './components/RegionAirQualityMonitoringStationContent'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class RegionAirQualityMonitoringStation extends PureComponent {

  componentDidMount() {

  }

  render() {
    const params = JSON.parse(this.props.location.query.params);

    return (
      <BreadcrumbWrapper >
        <RegionAirQualityMonitoringStationContent {...params} />
      </BreadcrumbWrapper>
    );
  }
}
