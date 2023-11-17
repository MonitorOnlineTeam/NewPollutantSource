/*
 * @Description:单区域 运维工单统计-空气站
 * @LastEditors: hxf
 * @Date: 2020-10-27 10:20:28
 * @LastEditTime: 2020-12-02 11:37:19
 * @FilePath: /NewPollutantSource/src/pages/IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/StationAirQualityMonitoringStation.js
 */

import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'; // 外层cpmponent 包含面包屑
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Col,
  Row,
  Select,
  Input,
  Checkbox,
  DatePicker,
  Button,
  message,
  Modal,
} from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import { downloadFile } from '@/utils/utils';
import moment from 'moment';
import { router } from 'umi';

import { checkParent } from './utils';
import StationAirQualityMonitoringStationContent from './components/StationAirQualityMonitoringStationContent'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class StationAirQualityMonitoringStation extends PureComponent {

  componentDidMount() {
  }

  render() {
    const params = JSON.parse(this.props.location.query.params);
    return (
      <BreadcrumbWrapper >
        <StationAirQualityMonitoringStationContent {...params} />
      </BreadcrumbWrapper>
    );
  }
}
