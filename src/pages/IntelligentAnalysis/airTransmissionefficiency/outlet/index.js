/**
 * 功  能：
 * 创建人：
 * 创建时间：
 */
import React, { Component } from 'react';
import { ExportOutlined, RollbackOutlined } from '@ant-design/icons';
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
  Select,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import styles from '../style.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile, interceptTwo } from '@/utils/utils';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'airTransmissionefficiency/updateState',
  getData: 'airTransmissionefficiency/getAirTransmissionEfficiencyForPoint',
};
const content = <div>当有效传输率未到达90%时判定为未达标</div>;
@connect(({ loading, airTransmissionefficiency }) => ({
  priseList: airTransmissionefficiency.priseList,
  exEntloading: airTransmissionefficiency.exEntloading,
  loading: loading.effects[pageUrl.getData],
  total: airTransmissionefficiency.qutleTotal,
  tableDatas: airTransmissionefficiency.priseTableDatas,
  queryPar: airTransmissionefficiency.priseQueryPar,
  entName: airTransmissionefficiency.entName,
  pageSize: airTransmissionefficiency.pageSize,
  pageIndex: airTransmissionefficiency.pageIndex,
  beginTime: airTransmissionefficiency.beginTime,
  endTime: airTransmissionefficiency.endTime,
  pollutantType: airTransmissionefficiency.pollutantType,
  assessment: airTransmissionefficiency.assessment,
  operationpersonnel:airTransmissionefficiency.operationpersonnel,

}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      beginTime: moment(new Date()).subtract(1, 'months'),
      endTime: moment(new Date()),
      EnterpriseCode: '',
      EnterpriseName: '',
      visible: false,
      eName: '',
      regions: '',
      effectiveVisible: false,
      effectiveLoading: false,
    };
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location, beginTime, endTime } = this.props;

    this.updateQueryState({
      EntCode: location.query.EntCode,
      beginTime: beginTime,
      endTime: endTime,
      // PageIndex: 1,
      // PageSize: 20,
      // PollutantType: this.props._pollutantType || this.props.pollutantType,
      // Assessment: this.props.assessment
    });

    setTimeout(() => {
      this.getTableData();
    });
  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { priseQueryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...queryPar },
    });
  };





  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { exEntloading: true },
    });
    dispatch({
      type: 'airTransmissionefficiency/exportAirTransmissionEfficiencyForPoint',
      payload: { ...queryPar },
      callback: data => {
        downloadFile(data);
      },
    });
  };
  dateCallback = date => {
    // console.log(date[0].format("YYYY-MM-DD"))
    this.updateQueryState({
      beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();
  };


  
  interceptTwo = (value) => {
    const data = value.toString();
    const result = data.substring(0, data.indexOf(".") + 3)
    return result;
  }
  render() {

    const { eName } = this.state;
    const {
      exEntloading,
      queryPar: { PollutantType, PageIndex, PageSize, EntCode },
      beginTime,
      endTime,
      entName,
      cityName,
      location
    } = this.props;

    const columns = [
      {
        title: <span style={{ fontWeight: 'bold' }}>行政区</span>,
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
        render: (text, record) => {
          return <span> {record.EntName}（{text}）</span>;
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>监测点名称</span>,
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>应传条数</span>,
        dataIndex: 'ShouldNumber',
        key: 'ShouldNumber',
        // sorter: (a, b) => a.CountPoint - b.CountEnt,
        align: 'center',
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>实传条数</span>,
        dataIndex: 'TransmissionNumber',
        key: 'TransmissionNumber',
        align: 'center',
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>传输有效率</span>,
        dataIndex: 'TransmissionEffectiveRate',
        key: 'TransmissionEffectiveRate',
        align: 'center',
        sorter: (a, b) => a.TransmissionEffectiveRate - b.TransmissionEffectiveRate,
        render: (text, record) => {
          if (record.ShouldNumber == 0) {
            return <span>停运</span>;
          }
          // 红色：#f5222d 绿色：#52c41a
          const percent = interceptTwo(Number(text) * 100);
          if (percent >= 90) {
            return (
              <div>
                <Progress
                  successPercent={percent}
                  percent={percent}
                  size="small"
                  style={{ width: '85%' }}
                  format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
                />
              </div>
            );
          }
          return (
            <div>
              <Progress
                successPercent={0}
                percent={percent}
                status="exception"
                size="small"
                style={{ width: '85%' }}
                format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
              />
            </div>
          );
        },
      },
    ];
    return (
      <BreadcrumbWrapper title="传输有效率" hideBreadcrumb={this.props.hideBreadcrumb}>
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">

              <Row> 
              <Form.Item>
                {location.query.cityName}（{moment(beginTime).format("YYYY-MM-DD")} - {moment(endTime).format("YYYY-MM-DD")}）
                </Form.Item>
                </Row>
                <Form.Item>
                  <Button
                    style={{ marginRight: '5px' }}
                    icon={<ExportOutlined />}
                    onClick={this.template}
                    loading={exEntloading}
                  >
                    导出
                  </Button>
                  <Button
                    onClick={() => {
                      this.props.onBack ? this.props.onBack() :
                        this.props.history.go(-1);
                    }}
                    style={{ marginRight: '10px' }}
                  >
                    <RollbackOutlined />
                    返回
                  </Button>
                </Form.Item>
                <Form.Item>
                <span style={{color:'#f5222d',fontSize:14}}>应传条数：每日应传24条小时数据和1条日数据，实传条数：每日实际传输过来的数据条数</span>
                </Form.Item>
             </Form>
            </>
          }
        >
          <>
            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={this.props.loading}
              columns={columns}
              bordered={false}
              onChange={this.handleTableChange}
              dataSource={this.props.tableDatas}
              scroll={this.props.isModal?{ y: 'calc(100vh - 550px)'}:''}
              // scroll={{ y: 550 }}
              width={'100%'}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                sorter: true,
                total: this.props.total,
                pageSize: PageSize,
                current: PageIndex,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
              }}
            />
          </>
        </Card>
        {/* </div> */}
      </BreadcrumbWrapper>
    );
  }
}
