/**
 * 功  能：缺台账工单统计
 * 创建人：张赟
 * 创建时间：2020.10.17
 */
import React, { Component } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Badge,
  Modal,
  Input,
  Button,
  Checkbox,
  Select,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'noAccountAirStatistics/updateState',
  getData: 'noAccountAirStatistics/getDefectPointDetail',
};
@connect(({ loading, noAccountAirStatistics }) => ({
  loading: loading.effects[pageUrl.getData],
  tableDatilTotal: noAccountAirStatistics.tableDatilTotal,
  tableDatil: noAccountAirStatistics.tableDatil,
  noAccountAirStatisticsForm: noAccountAirStatistics.noAccountAirStatisticsForm,
}))
export default class airMissing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          title: <span>行政区</span>,
          dataIndex: 'Region',
          key: 'Region',
          align: 'center',

          
        },
        {
          title: <span>{'缺失台账大气站名称'}</span>,
          dataIndex: 'EntName',
          key: 'EntName',

          align: 'center',
          render: (text, record) => {
            return  <div style={{textAlign:'left',width:'100%'}} >{text}</div>;
        },
        },
        {
          title: <span>缺失台账监测点名称</span>,
          dataIndex: 'PointName',
          key: 'PointName',
          width: 210,
          align: 'center',
          render: (text, record) => {
            return  <div style={{textAlign:'left',width:'100%'}} >{text}</div>;
        },

        },
        {
          title: <span>巡检工单</span>,
          dataIndex: 'pointCount',
          key: 'pointCount',
          width: 210,
          align: 'center',
          children: [
            {
              title: <span>完成工单数</span>,
              width: 100,
              dataIndex: 'InspectionNum',
              key: 'InspectionNum',
              align: 'center',
            },
            {
              title: <span>缺失台账工单数</span>,
              width: 100,
              dataIndex: 'InspectionNotNum',
              key: 'InspectionNotNum',
              align: 'center',
            },
          ],
        },
        {
          title: <span>质控工单</span>,
          dataIndex: 'pointCount',
          key: 'pointCount',
          width: 210,
          align: 'center',
          children: [
            {
              title: <span>完成工单数</span>,
              width: 100,
              dataIndex: 'CalibrationNum',
              key: 'CalibrationNum',
              align: 'center',
            },
            {
              title: <span>缺失台账工单数</span>,
              width: 100,
              dataIndex: 'CalibrationNotNum',
              key: 'CalibrationNotNum',
              align: 'center',
            },
          ],
        },
      ],
    };
  }

  componentDidMount() {
let requestData = JSON.parse(this.props.requestData)
 
      this.getTableData(requestData);
  
  }

  updateQueryState = payload => {
    const { noAccountAirStatisticsForm, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { noAccountAirStatisticsForm: { ...noAccountAirStatisticsForm, ...payload } },
    });
  };

  getTableData = requestData => {
    const {  dispatch } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...requestData, ...{ModelType:'Region',} },
    });
  };

  //创建并获取模板   导出
  template = () => {
    let requestData = JSON.parse(this.props.requestData)
    const { dispatch, noAccountAirStatisticsForm } = this.props;
    dispatch({
      type: 'noAccountAirStatistics/exportDefectDataSummary',
      payload: {  ...requestData, ...{ModelType:'Region'}  },
      callback: data => {
        downloadFile(`${data}`);
      },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();
  };

  onRef1 = ref => {
    this.child = ref;
  };

  render() {
    return (
      <Modal
        title={``}
        footer={null}
        width='95%'
        visible={this.props.regionVisible}  
        onCancel={this.props.regionCancel}
      >
    <Card
      bordered={false}
      title={
        <Form layout="inline">
          <Row>
            <Form.Item>
              <Button style={{ margin: '0 5px' }} icon={<ExportOutlined />} onClick={this.template}>
                导出
              </Button>
            </Form.Item>
          </Row>
        </Form>
      }
    >
      <SdlTable
        rowKey={(record, index) => `complete${index}`}
        loading={false}
        columns={this.state.columns}
        dataSource={this.props.tableDatil}
        // pagination={{
          // showSizeChanger: true,
          // showQuickJumper: true,
          // sorter: true,
          // total: this.props.tableDatilTotal,
          //defaultPageSize: 20,
          // pageSize: PageSize,
          // current: PageIndex,
          // pageSizeOptions: ['10', '20', '30', '40', '50'],
        // }}
      />
    </Card>
    </Modal>
    );
  }
}
