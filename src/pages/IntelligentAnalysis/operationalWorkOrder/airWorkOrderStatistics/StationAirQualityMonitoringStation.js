/*
 * @Description:单区域 运维工单统计-空气站
 * @LastEditors: hxf
 * @Date: 2020-10-27 10:20:28
 * @LastEditTime: 2020-11-05 10:39:14
 * @FilePath: /NewPollutantSource/src/pages/IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/StationAirQualityMonitoringStation.js
 */

import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'; // 外层cpmponent 包含面包屑
import {
  Card,
  Form,
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

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ airWorkOrderStatistics, loading }) => ({
  enterpriseTitle: airWorkOrderStatistics.enterpriseTitle,
  enterpriseTaskStatic: airWorkOrderStatistics.enterpriseTaskStatic,
  pointTitle: airWorkOrderStatistics.pointTitle,
  pointTaskStatic: airWorkOrderStatistics.pointTaskStatic,
  loading: loading.effects['airWorkOrderStatistics/getTaskStatic4Enterprise'],
  mLoading: loading.effects['airWorkOrderStatistics/getTaskStatic4Point'],
}))
@Form.create()
export default class StationAirQualityMonitoringStation extends PureComponent {
  state = {
    showTime: true,
    regionName: '',
    format: 'YYYY-MM-DD HH:mm:ss',
    checkedValues: [],
    visible: false,
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
      type: 'airWorkOrderStatistics/getTaskStatic4EnterpriseTitle',
      payload: { PollutantTypeCode: 5 },
    });
    dispatch({
      type: 'airWorkOrderStatistics/getTaskStatic4PointTitle',
      payload: { PollutantTypeCode: 5 },
    });
    const params = JSON.parse(this.props.location.query.params);
    dispatch({
      type: 'airWorkOrderStatistics/getTaskStatic4Enterprise',
      payload: {
        PollutantTypeCode: '5',
        AttentionCode: '',
        RegionCode: params.regionCode,
        EntCode: '',
        BeginTime: moment(params.beginTime).format('YYYY-MM-DD 00:00:00'),
        EndTime: moment(params.endTime).format('YYYY-MM-DD 23:59:59'),
      },
    });
  }

  createColum = item => {
    const { dispatch } = this.props;
    if (item.ID == '00_StationName') {
      return {
        title: item.TypeName,
        dataIndex: item.ID,
        key: item.ID,
        width: 150,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                const params = JSON.parse(this.props.location.query.params);
                params.stationName = record['00_StationName'];
                params.entCode = record['00_EntCode'];
                // router.push(
                //   `/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/SingleStationAirQualityMonitoringStation?params=${JSON.stringify(
                //     params,
                //   )}`,
                // );
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
                  callback: () => {
                    this.setState({ stationName: record['00_StationName'] });
                    this.showModal();
                  },
                });
              }}
            >
              {text}
            </a>
          );
        },
      };
    }
    return {
      title: item.TypeName,
      dataIndex: item.ID,
      key: item.ID,
      width: 150,
      align: 'center',
    };
  };

  mCreateColum = item => {
    if (item.ID === '00_PointName') {
      return {
        title: item.TypeName,
        dataIndex: item.ID,
        key: item.ID,
        width: 150,
      };
    }
    return {
      title: item.TypeName,
      dataIndex: item.ID,
      key: item.ID,
      width: 150,
      align: 'center',
    };
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      dispatch,
      enterpriseTitle,
      enterpriseTaskStatic,
      mLoading = false,
      pointTitle,
      pointTaskStatic,
      alarmManagementRateExportLoading,
      loading = false,
    } = this.props;
    const params = JSON.parse(this.props.location.query.params);
    const columns = [];
    let index = -1;
    enterpriseTitle.map((item, key) => {
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

    const mColumns = [];
    index = -1;
    pointTitle.map((item, key) => {
      index = -1;
      index = checkParent(item, mColumns);
      if (index === -2) {
        mColumns.push(this.mCreateColum(item));
      } else if (index === -1) {
        mColumns.push({
          title: item.parent,
          children: [this.mCreateColum(item)],
        });
      } else {
        mColumns[index].children.push(this.mCreateColum(item));
      }
    });
    return (
      <BreadcrumbWrapper
        title={`${params.regionName}运维大气站（${params.beginTime} - ${params.endTime}）运维工单统计`}
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
                {/* <Button
                  style={{ marginLeft: 10 }}
                  icon="export"
                  onClick={this.exportAlarmManagementRate}
                  loading={alarmManagementRateExportLoading}
                >
                  导出
                </Button> */}
              </Col>
            </Row>
          </Form>
          <SdlTable
            scroll={{ xScroll: 'scroll' }}
            dataSource={enterpriseTaskStatic}
            columns={columns}
            loading={loading}
          />
        </Card>
        <Modal
          width={'90%'}
          centered
          title={`${this.state.stationName}（${params.beginTime} - ${params.endTime}）运维工单统计`}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <SdlTable
            scroll={{ xScroll: 'scroll' }}
            dataSource={pointTaskStatic}
            columns={mColumns}
            loading={mLoading}
          />
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}
