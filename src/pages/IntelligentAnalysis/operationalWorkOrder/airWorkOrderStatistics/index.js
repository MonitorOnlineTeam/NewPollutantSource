/*
 * @Description:运维工单统计-空气站
 * @LastEditors: hxf
 * @Date: 2020-10-26 10:52:49
 * @LastEditTime: 2020-10-27 08:12:44
 * @FilePath: /NewPollutantSource/src/pages/IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/index.js
 */
import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'; // 外层cpmponent 包含面包屑
import { Card, Form, Col, Row, Select, Input, Checkbox, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import { downloadFile } from '@/utils/utils';
import moment from 'moment';
import { router } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default class index extends PureComponent {
  render() {
    return (
      <BreadcrumbWrapper>
        <div>AirWorkOrderStatistics</div>
      </BreadcrumbWrapper>
    );
  }
}
