/*
 * @Description:超标报警处置率-二级
 * @LastEditors: hxf
 * @Date: 2020-10-22 09:08:17
 * @LastEditTime: 2020-10-26 10:12:56
 * @FilePath: /NewPollutantSource/src/pages/dataAnalyze/overAlarmDisposalRate/RegionOverAlarmDisposalRate.js
 */
import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'; // 外层cpmponent 包含面包屑
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, Row, Select, Input, Checkbox, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import { downloadFile } from '@/utils/utils';
import { router } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(({ loading, autoForm, overAlarmDisposalRate }) => ({
  priseList: overAlarmDisposalRate.priseList,
  regionList: autoForm.regionList,
  attentionList: overAlarmDisposalRate.attentionList,
  divisorList: overAlarmDisposalRate.divisorList,
  EntCode: overAlarmDisposalRate.EntCode,
  DetailExportLoading: overAlarmDisposalRate.alarmManagementRateDetailExportLoading,
  alarmManagementRateDetailcolumn: overAlarmDisposalRate.alarmManagementRateDetailcolumn,
  alarmManagementRateDetailSource: overAlarmDisposalRate.alarmManagementRateDetailSource,
  loading: loading.effects['overAlarmDisposalRate/getAlarmManagementRateDetail'],
}))
@Form.create()
export default class RegionOverAlarmDisposalRate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      EntCode: '',
    };
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch } = this.props;

    // dispatch({
    //   type: 'autoForm/getRegions',
    //   payload: { RegionCode: '', PointMark: '2' },
    // });

    // //获取行政区列表
    // dispatch({
    //   type: 'abnormalStandard/getAttentionDegreeList',
    //   payload: { RegionCode: '' },
    // });

    //获取关注列表
    dispatch({
      type: 'overAlarmDisposalRate/getEntByRegion',
      payload: { RegionCode: JSON.parse(this.props.location.query.params).regionCode },
    });

    this.getAlarmManagementRateDetail();

    //获取企业列表
    // this.updateQueryState({
    //   AttentionCode: '',
    //   EntCode: '',
    //   RegionCode: '',
    //   PollutantCode: '',
    //   PollutantType: '1',
    // });
    // setTimeout(() => {
    //   this.getTableData();
    // });
  };

  children = () => {
    //企业列表
    const { priseList } = this.props;

    const selectList = [];
    if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
            {item.EntName}
          </Option>,
        );
      });
      return selectList;
    }
  };

  getAlarmManagementRateDetail = () => {
    const { dispatch } = this.props;
    const { EntCode } = this.state;
    const params = JSON.parse(this.props.location.query.params);
    // 获取超标报警处置率-二级列表
    dispatch({
      type: 'overAlarmDisposalRate/getAlarmManagementRateDetail',
      payload: {
        EntCode,
        AttentionCode: params.AttentionCode,
        PollutantType: params.PollutantType,
        RegionCode: params.regionCode,
        dataType: params.dataType,
        beginTime: moment(params.beginTime).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(params.endTime).format('YYYY-MM-DD 23:59:59'),
        PollutantList: params.PollutantList,
        PollutantCodeList: params.PollutantList,
        Rate: 1,
      },
    });
  };

  changeEnt = value => {
    this.setState({ EntCode: value });
    const { dispatch } = this.props;
    const params = JSON.parse(this.props.location.query.params);
    // 获取超标报警处置率-二级列表
    dispatch({
      type: 'overAlarmDisposalRate/getAlarmManagementRateDetail',
      payload: {
        EntCode: value,
        AttentionCode: params.AttentionCode,
        PollutantType: params.PollutantType,
        RegionCode: params.regionCode,
        dataType: params.dataType,
        beginTime: moment(params.beginTime).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(params.endTime).format('YYYY-MM-DD 23:59:59'),
        PollutantList: params.PollutantList,
        PollutantCodeList: params.PollutantList,
        Rate: 1,
      },
    });
  };

  exportAlarmManagementRateDetail = () => {
    const { dispatch } = this.props;
    const { EntCode } = this.state;
    const params = JSON.parse(this.props.location.query.params);
    // 获取超标报警处置率-二级列表
    dispatch({
      type: 'overAlarmDisposalRate/exportAlarmManagementRateDetail',
      payload: {
        EntCode,
        AttentionCode: params.AttentionCode,
        PollutantType: params.PollutantType,
        RegionCode: params.regionCode,
        dataType: params.dataType,
        beginTime: moment(params.beginTime).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(params.endTime).format('YYYY-MM-DD 23:59:59'),
        PollutantList: params.PollutantList,
        PollutantCodeList: params.PollutantList,
        Rate: 1,
      },
      callback: data => {
        downloadFile(`/wwwroot${data}`);
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      alarmManagementRateDetailSource,
      alarmManagementRateDetailcolumn,
      EntCode,
      loading,
      DetailExportLoading,
    } = this.props;
    const params = JSON.parse(this.props.location.query.params);

    let titlePollutant = [];

    alarmManagementRateDetailcolumn.map((item, key) => {
      titlePollutant.push({
        title: item.PollutantName,
        width:500,
        children: [
          {
            title: '报警次数',
            dataIndex: `${item.PollutantCode}_alarmCount`,
            key: 'DataType',
            width: 100,
            align: 'center',
          },
          {
            title: '已处置报警次数',
            dataIndex: `${item.PollutantCode}_respondedCount`,
            key: 'DataType',
            width: 150,
            align: 'center',
          },
          {
            title: '待处置报警次数',
            dataIndex: `${item.PollutantCode}_noRespondedCount`,
            key: 'DataType',
            width: 150,
            align: 'center',
          },
          {
            title: '处置率',
            dataIndex: `${item.PollutantCode}_RespondedRate`,
            key: 'DataType',
            width: 100,
            align: 'center',
            render: (text, record) => {
              if (text == '-') {
                return <div>{`${text}`}</div>;
              } else {
                return <div>{`${text}%`}</div>;
              }
            },
          },
        ],
      });
    });
    let columns = [
      {
        title: '行政区',
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
      },
      {
        title: '企业名称',
        dataIndex: 'entName',
        key: 'entName',
      },
      {
        title: '监测点名称',
        dataIndex: 'pointName',
        key: 'pointName',
        // fixed: 'left',
      },
      ...titlePollutant,
    ];
    return (
      <BreadcrumbWrapper >
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col md={24} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                <Form.Item label="企业列表">
                  {getFieldDecorator('RegionCode', {
                    // initialValue: 'siteDaily',
                  })(
                    <Select
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      placeholder="企业名称"
                      onChange={this.changeEnt}
                      style={{ width: 170 }}
                    >
                      {this.children()}
                    </Select>,
                  )}
                </Form.Item>
                {/* <Button
                  loading={loading}
                  type="primary"
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    this.getAlarmManagementRateDetail();
                  }}
                >
                  查询
                </Button> */}
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  onClick={this.exportAlarmManagementRateDetail}
                  loading={DetailExportLoading}
                >
                  导出
                </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  onClick={() => {
                    router.goBack();
                  }}
                >
                  返回
                </Button>
              </Col>
            </Row>
          </Form>
          <SdlTable
            scroll={{ xScroll: 'scroll' }}
            dataSource={alarmManagementRateDetailSource}
            columns={columns}
            loading={loading}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
