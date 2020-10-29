/*
 * @Description:单站点 运维工单统计-空气站 排口
 * @LastEditors: hxf
 * @Date: 2020-10-27 10:29:59
 * @LastEditTime: 2020-10-28 15:23:15
 * @FilePath: /NewPollutantSource/src/pages/IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/SingleStationAirQualityMonitoringStation.js
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

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ airWorkOrderStatistics, loading }) => ({
  pointTitle: airWorkOrderStatistics.pointTitle,
  pointTaskStatic: airWorkOrderStatistics.pointTaskStatic,
  loading: loading.effects['airWorkOrderStatistics/getTaskStatic4Point'],
}))
@Form.create()
export default class SingleStationAirQualityMonitoringStation extends PureComponent {
  state = {
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
    checkedValues: [],
  };

  _SELF_ = {
    formLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'airWorkOrderStatistics/getTaskStatic4PointTitle',
      payload: { PollutantTypeCode: 5 },
    });
    const params = JSON.parse(this.props.location.query.params);
    dispatch({
      type: 'airWorkOrderStatistics/getTaskStatic4Point',
      payload: {
        PollutantTypeCode: '5',
        AttentionCode: '',
        RegionCode: params.regionCode,
        EntCode: params.entCode,
        BeginTime: moment(params.beginTime).format('YYYY-MM-DD 00:00:00'),
        EndTime: moment(params.endTime).format('YYYY-MM-DD 23:59:59'),
      },
    });
  }

  createColum = item => {
    return {
      title: item.TypeName,
      dataIndex: item.ID,
      key: item.ID,
      width: 150,
      align: 'center',
    };
  };

  render() {
    const {
      dispatch,
      pointTitle,
      pointTaskStatic,
      alarmManagementRateExportLoading,
      loading = false,
    } = this.props;
    const params = JSON.parse(this.props.location.query.params);
    const columns = [];
    let index = -1;
    pointTitle.map((item, key) => {
      index = -1;
      index = checkParent(item, columns);
      if (index === -2) {
        columns.push(this.createColum(item));
      } else if (index === -1) {
        columns.push({
          title: item.parent,
          children: [this.createColum(item)],
        });
      } else {
        columns[index].children.push(this.createColum(item));
      }
    });
    return (
      <BreadcrumbWrapper
        title={`${params.stationName}（${params.beginTime} - ${params.endTime}）运维工单统计`}
      >
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row gutter={24}>
              <Col md={9} style={{ marginTop: 3 }}>
                <Button
                  style={{ margin: '0 5px' }}
                  onClick={() => {
                    router.goBack();
                  }}
                >
                  返回
                </Button>
                <Button
                  style={{ marginLeft: 10 }}
                  icon="export"
                  onClick={this.exportAlarmManagementRate}
                  loading={alarmManagementRateExportLoading}
                >
                  导出
                </Button>
              </Col>
            </Row>
          </Form>
          <SdlTable
            scroll={{ xScroll: 'scroll' }}
            dataSource={pointTaskStatic}
            columns={columns}
            loading={loading}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
