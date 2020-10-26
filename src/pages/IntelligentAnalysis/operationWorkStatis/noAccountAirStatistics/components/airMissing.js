/**
 * 功  能：缺台账工单统计
 * 创建人：张赟
 * 创建时间：2020.10.17
 */
import React, { Component } from 'react';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Icon,
  Badge,
  Modal,
  Input,
  Button,
  Form,
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
import ButtonGroup_ from '@/components/ButtonGroup';

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'noAccountAirStatistics/updateState',
  getData: 'noAccountAirStatistics/getDefectModel',
};
@connect(({ loading, noAccountAirStatistics, autoForm, common }) => ({
  priseList: noAccountAirStatistics.priseList,
  exloading: noAccountAirStatistics.exloading,
  loading: loading.effects[pageUrl.getData],
  total: noAccountAirStatistics.total,
  tableDatas: noAccountAirStatistics.tableDatas,
  regionList: autoForm.regionList,
  attentionList: noAccountAirStatistics.attentionList,
  atmoStationList: common.atmoStationList,
  airMissingForm: noAccountAirStatistics.airMissingForm,
  divisorList: noAccountAirStatistics.divisorList,
}))
export default class airMissing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          title: <span>行政区</span>,
          dataIndex: 'regionName',
          key: 'regionName',
          align: 'center',

          render: (text, record) => {
            return (
              <Link
                to={{
                  pathname: '/Intelligentanalysis/dataAlarm/noAccountAirStatistics/pointVerifyRate',
                  query: { regionCode: record.regionCode },
                }}
              >
                {text}
              </Link>
            );
          },
        },
        {
          title: <span>{'运维空气监测点'}</span>,
          dataIndex: 'entCount',
          key: 'entCount',

          align: 'center',
          children: [ {
            title: <span>监测点数</span>,
            width: 100,
            dataIndex: '_alarmCount',
            key:  '_alarmCount',
            align: 'center',
          }, {
            title: <span>缺失台账监测点数</span>,
            width: 100,
            dataIndex: '_alarmCount',
            key:'_alarmCount',
            align: 'center',
          },]
        },
        {
          title: <span>巡检工单</span>,
          dataIndex: 'pointCount',
          key: 'pointCount',
          width: 210,
          align: 'center',
        },
        {
          title: <span>质控工单</span>,
          dataIndex: 'pointCount',
          key: 'pointCount',
          width: 210,
          align: 'center',
        },
      ],
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    this.getTableData();
  };
  updateQueryState = payload => {
    const { noAccountAirStatisticsForm, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { noAccountAirStatisticsForm: { ...noAccountAirStatisticsForm, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, noAccountAirStatisticsForm } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...noAccountAirStatisticsForm },
    });
  };

  //创建并获取模板   导出
  template = () => {
    const { dispatch, noAccountAirStatisticsForm } = this.props;
    dispatch({
      type: 'noAccountAirStatistics/exportDefectDataSummary',
      payload: { ...noAccountAirStatisticsForm },
      callback: data => {
        downloadFile(`/upload${data}`);
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

  dateChange = (date, dataType) => {
    this.updateQueryState({
      dataType: dataType,
      beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  render() {
    const {
      airMissingForm: {
        beginTime,
        endTime,

        dataType,
      },
      exloading
    } = this.props;
    return (
      <Card
        bordered={false}
        title={
          <Form layout="inline">
            <Row>
              <Form.Item>
                日期查询：
                <RangePicker_
                  onRef={this.onRef1}
                  dataType={dataType}
                  style={{ minWidth: '200px', marginRight: '10px' }}
                  dateValue={[moment(beginTime), moment(endTime)]}
                  callback={(dates, dataType) => this.dateChange(dates, dataType)}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" onClick={this.queryClick}>
                  查询
                </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  icon="export"
                  onClick={this.template}
                  loading={exloading}
                >
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
          dataSource={[]}
          pagination={{
            // showSizeChanger: true,
            // showQuickJumper: true,
            // sorter: true,
            total: this.props.total,
            defaultPageSize: 20,
            // pageSize: PageSize,
            // current: PageIndex,
            // pageSizeOptions: ['10', '20', '30', '40', '50'],
          }}
        />
      </Card>
    );
  }
}
