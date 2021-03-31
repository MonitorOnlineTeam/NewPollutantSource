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
import { downloadFile } from '@/utils/utils';

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'noAccountAirStatistics/updateState',
  getData: 'noAccountAirStatistics/getDefectPointPhoto',
};
@connect(({ loading, noAccountAirStatistics }) => ({
  loading: loading.effects[pageUrl.getData],
  tablePhotoTotal: noAccountAirStatistics.tablePhotoTotal,
  tablePhoto: noAccountAirStatistics.tablePhoto,
  noAccountAirStatisticsForm: noAccountAirStatistics.noAccountAirStatisticsForm,
  priseList: noAccountAirStatistics.priseList,
}))
export default class airMissing extends Component {
  constructor(props) {
    super(props);

    this.state = {
        EntCode:'',
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
          title: <span>工单类型</span>,
          dataIndex: 'TaskTypeName',
          key: 'TaskTypeName',
          width: 210,
          align: 'center',
        },
        {
          title: <span>工单号</span>,
          dataIndex: 'TaskCode',
          key: 'TaskCode',
          width: 210,
          align: 'center',
        },
        {
          title: <span>运维人</span>,
          dataIndex: 'UserName',
          key: 'UserName',
          width: 210,
          align: 'center',
        },
        {
          title: <span>完成时间</span>,
          dataIndex: 'CompleteTime',
          key: 'CompleteTime',
          width: 210,
          align: 'center',
        },
      ],
    };
  }

  componentDidMount() {
    let requestData = JSON.parse(this.props.requestData);
    
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
    const { dispatch } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...requestData, ...{ ModelType: 'TaskNums' ,EntCode:this.state.EntCode} },
    });
  };

  //创建并获取模板   导出
  template = () => {
    let requestData = JSON.parse(this.props.requestData)
    const { dispatch, noAccountAirStatisticsForm } = this.props;
    dispatch({
      type: 'noAccountAirStatistics/exportDefectDataSummary',
      payload: { ...requestData, ...{ ModelType: 'TaskNums' ,EntCode:this.state.EntCode}  },
      callback: data => {
        downloadFile(`/upload${data}`);
      },
    });
  };
  //查询事件
  queryClick = () => {
    let requestData = JSON.parse(this.props.requestData);
    this.getTableData(requestData);
  };

  onRef1 = ref => {
    this.child = ref;
  };
  entChildren = () => {
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
  changeEnt = (value, data) => {
    //企业事件
    this.setState({ EntCode: value,})
    
    setTimeout(() => {
      this.queryClick();
    });
  };
  render() {
    return (
      <Modal
      title={``}
      footer={null}
      width='95%'
      visible={this.props.photoVisible}  
      onCancel={this.props.photoCancel}
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
        dataSource={this.props.tablePhoto}
        // pagination={{
          // showSizeChanger: true,
          // showQuickJumper: true,
          // sorter: true,
          // total: this.props.tablePhotoTotal,
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
