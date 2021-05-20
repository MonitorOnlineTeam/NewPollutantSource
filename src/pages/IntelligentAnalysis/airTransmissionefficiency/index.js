/**
 * 功  能
 * 创建人
 * 创建时间：
 */
import React, { Component } from 'react';
import { ExportOutlined, QuestionCircleTwoTone } from '@ant-design/icons';
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
import styles from './style.less';
import { downloadFile,interceptTwo } from '@/utils/utils';
import SdlCascader from '../../AutoFormManager/SdlCascader';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'airTransmissionefficiency/updateState',
  getData: 'airTransmissionefficiency/getAirTransmissionEfficiencyForEnt',
};
const content = <div>当传输有效率未到达90%时判定为未达标</div>;
@connect(({ loading, airTransmissionefficiency, autoForm }) => ({
  exRegionloading: airTransmissionefficiency.exRegionloading,
  loading: loading.effects[pageUrl.getData],
  total: airTransmissionefficiency.entTotal,
  pageSize: airTransmissionefficiency.pageSize,
  pageIndex: airTransmissionefficiency.pageIndex,
  tableDatas: airTransmissionefficiency.entTableDatas,
  regionList: autoForm.regionList,
  beginTime: airTransmissionefficiency.beginTime,
  endTime: airTransmissionefficiency.endTime,
  pollutantType: airTransmissionefficiency.pollutantType,
  assessment: airTransmissionefficiency.assessment,
  RegionCode: airTransmissionefficiency.RegionCode,
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

  componentWillMount() {
    this.getTableData();
  }

  updateState = payload => {
    this.props.dispatch({
      type: pageUrl.updateState,
      payload,
    });
  };

  getTableData = () => {
    this.props.dispatch({
      type: pageUrl.getData,
    });
  };




  //创建并获取模板   导出
  template = () => {
    this.updateState({
      exRegionloading: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'airTransmissionefficiency/exportAirTransmissionEfficiencyForEnt',
      payload: {
        callback: data => {
          downloadFile(data);
        },
      },
    });
  };
  dateCallback = date => {
    // console.log(date[0].format("YYYY-MM-DD"))
    this.updateState({
      beginTime: date[0].format('YYYY-MM-DD 00:00:00'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };
  //查询事件
  queryClick = () => {
    this.props.dispatch({
      type: pageUrl.getData,
    });
  };




  interceptTwo=(value)=>{
    const data = value.toString();
    const result = data.substring(0,data.indexOf(".")+3)
    return result;
  }
  render() {
    const { eName } = this.state;
    const { regionList, exRegionloading, RegionCode ,operationpersonnel} = this.props;
    const columns = [
      {
        title: <span style={{ fontWeight: 'bold' }}>行政区</span>,
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
        render: (text, record) => { 
           return <Link to={{  pathname: '/Intelligentanalysis/transmissionefficiency/outlet',
                       query: { EntCode: record.EntCode,cityName:record.EntName},
                       }}
                       >
                   {record.EntName}（{text}）
                </Link>
                  
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>空气监测点数</span>,
        dataIndex: 'CountPoint',
        key: 'CountPoint',
        // sorter: (a, b) => a.CountEnt - b.CountEnt,
        align: 'center'
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>传输有效率</span>,
        dataIndex: 'TransmissionEffectiveRate',
        key: 'TransmissionEffectiveRate',
        align: 'center',
        sorter: (a, b) => a.TransmissionEffectiveRate - b.TransmissionEffectiveRate,
        render: (text, record) => {
          if (record.ShouldNumber==0) {
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
                  style={{width:'90%'}}
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
                style={{width:'90%'}} 
                format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
              />
            </div>
          );
        },
      },

    ];
    return (
      <BreadcrumbWrapper title="传输有效率">
        {/* <div className="contentContainer"> */}
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
                <Form.Item>
                  查询时间：
                  <RangePicker_
                    dateValue={[moment(this.props.beginTime), moment(this.props.endTime)]}
                    format="YYYY-MM-DD"
                    callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick}>
                    查询
                  </Button>
                  <Button
                    style={{ margin: '0 5px' }}
                    icon={<ExportOutlined />}
                    onClick={this.template}
                    loading={exRegionloading}
                  >
                    {/* <Icon type="export" /> */}
                    导出
                  </Button>
                </Form.Item>
              </Form>
              <div style={{ paddingTop: 10 }}>
                <div
                  style={{
                    width: 20,
                    height: 9,
                    backgroundColor: '#52c41a',
                    display: 'inline-block',
                    borderRadius: '20%',
                    cursor: 'pointer',
                    marginRight: 3,
                  }}
                />{' '}
                <span style={{ cursor: 'pointer', fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>
                  {' '}
                  ≥90%达标
                </span>
                <div
                  style={{
                    width: 20,
                    height: 9,
                    backgroundColor: '#f5222d',
                    display: 'inline-block',
                    borderRadius: '20%',
                    cursor: 'pointer',
                    marginLeft: 10,
                    marginRight: 3,
                  }}
                />
                <span style={{ cursor: 'pointer', fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>
                  {' '}
                   {`<90%未达标`}
                </span>
                {/* <span style={{color:'#f5222d',fontSize:14,paddingLeft:15}}>每日凌晨计算昨日的传输有效率，每月4号和10号重新计算上个月的传输有效率</span> */}
                <span style={{color:'#f5222d',fontSize:14,paddingLeft:15}}>每日凌晨计算本月的传输有效率，每月1号至15号期间每日凌晨重新计算上个月的传输有效率</span>
              </div>
            </>
          }
        >
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={this.props.loading}
            columns={columns}
            bordered={false}
            // onChange={this.handleTableChange}
            dataSource={this.props.tableDatas}
            // scroll={{ y: 'calc(100vh - 450px)' }}
            // scroll={{ y: 550 }}
            pagination={false}
          />

        </Card>
        {/* </div> */}
      </BreadcrumbWrapper>
    );
  }
}
