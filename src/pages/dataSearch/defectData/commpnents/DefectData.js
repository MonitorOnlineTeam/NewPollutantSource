/**
 * 功  能：有效传输率
 * 创建人：吴建伟
 * 创建时间：2019.08.12
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
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'defectData/updateState',
  getData: 'defectData/getDefectModel',
};
const content = <div>当有效传输率未到达90%时判定为未达标</div>;
@connect(({ loading, defectData,autoForm }) => ({
  priseList: defectData.priseList,
  exloading:defectData.exloading,
  loading: loading.effects[pageUrl.getData],
  total: defectData.qutleTotal,
  tableDatas: defectData.TableDatas,
  queryPar: defectData.queryPar,
  regionList: autoForm.regionList,
  attentionList:defectData.attentionList
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entCode:''
    };
    
    this.columns = [
      {
        title: <span style={{ fontWeight: 'bold' }}>行政区</span>,
        dataIndex: 'RegionName',
        key: 'RegionName',
        // width: '20%',
        align: 'center',
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>考核监测点数</span>,
        dataIndex: 'CountPoint',
        key: 'CountPoint',
        sorter: (a, b) => a.CountPoint - b.CountEnt,
        // width: '20%',
        align: 'center',
        render: (text, record) => text,
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>有效率</span>,
        dataIndex: 'EffectiveRate',
        key: 'EffectiveRate',
        // width: '10%',
        align: 'center',
        render: (text, record) => {
          if (record.IsStop) {
            return <span>停运</span>;
          }
          if (record.AvgEffectiveRate <= text) {
            return <span>{`${(parseFloat(text) * 100).toFixed(2)}%`}</span>;
          }
          const content = (
            <span>
              <Icon type="warning" style={{ color: '#EEC900' }} />
              平均值{`${(parseFloat(record.AvgEffectiveRate) * 100).toFixed(2)}%`}
            </span>
          );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              <Badge className={styles.warningdata} status="warning" />
              {`${(parseFloat(text) * 100).toFixed(2)}%`}
            </span>
            // </Popover>
          );
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>传输率</span>,
        dataIndex: 'TransmissionRate',
        key: 'TransmissionRate',
        sorter: (a, b) => a.TransmissionRate - b.TransmissionRate,
        // width: '10%',
        align: 'center',
        render: (text, record) => {
          if (record.IsStop) {
            return <span>停运</span>;
          }
          if (record.AvgTransmissionRate <= text) {
            return <span>{`${(parseFloat(text) * 100).toFixed(2)}%`}</span>;
          }
          const content = (
            <span>
              <Icon type="warning" style={{ color: '#EEC900' }} />
              平均值{`${(parseFloat(record.AvgTransmissionRate) * 100).toFixed(2)}%`}
            </span>
          );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              <Badge className={styles.warningdata} status="warning" />
              {`${(parseFloat(text) * 100).toFixed(2)}%`}
            </span>
            // {' '}
            // </Popover>
          );
        },
      },
      ,
      {
        title: <span style={{ fontWeight: 'bold' }}>有效传输率</span>,
        dataIndex: 'TransmissionEffectiveRate',
        key: 'TransmissionEffectiveRate',
        align: 'center',
        sorter: (a, b) => a.TransmissionEffectiveRate - b.TransmissionEffectiveRate,
        render: (text, record) => {
          if (record.IsStop) {
            return <span>停运</span>;
          }
          // 红色：#f5222d 绿色：#52c41a
          const percent = (parseFloat(text) * 100).toFixed(2);
          if (percent >= 90) {
            return (
              <div>
                <Progress
                  successPercent={percent}
                  percent={percent - 0}
                  size="small"
                  format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
                />
              </div>
            );
          }
          return (
            <div>
              <Progress
                successPercent={0}
                percent={percent - 0}
                status="exception"
                size="small"
                format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
              />
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location } = this.props;

    this.updateQueryState({
      beginTime: moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      AttentionCode: '',
      EntName: '',
      RegionCode: '',
      Atmosphere:''
    });
    this.setState({entCode:''})
     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

     dispatch({ type: 'defectData/getEntByRegion', payload: { RegionCode: '' },  });//获取企业列表
 
     dispatch({ type: 'defectData/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
  

    setTimeout(() => {
      this.getTableData();
    });
  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...queryPar },
    });
  };



  children = () => { //企业列表
    const { priseList } = this.props;

    const selectList = [];
    if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode}>
            {item.EntName}
          </Option>,
        );
      });
      return selectList;
    }
  };

  typeChange = value => {
    this.updateQueryState({
      PollutantType: value,
    });
  };

  changeRegion = (value) => { //行政区事件
    
    this.updateQueryState({
      RegionCode: value,
    });
  };
  changeAttent=(value)=>{
    this.updateQueryState({
      AttentionCode: value,
    });
  }
  changeEnt=(value,data)=>{ //企业事件
    console.log(data)
    this.setState({
      entCode:value
    })
    this.updateQueryState({
      EntName: value,
    });
  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'defectData/exportGetAlarmDataList',
      payload: { ...queryPar },
      callback: data => {
          downloadFile(data);
        },
    });
  };
  dateCallback = date => {
    this.updateQueryState({
      beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();
  };


  regchildren=()=>{
    const { regionList } = this.props;
    const selectList = [];
    if (regionList.length > 0) {
      regionList[0].children.map(item => {
        selectList.push(
          <Option key={item.key} value={item.value}>
            {item.title}
          </Option>,
        );
      });
      return selectList;
    }
  }
  attentchildren=()=>{
    const { attentionList } = this.props;
    const selectList = [];
    if (attentionList.length > 0) {
       attentionList.map(item => {
        selectList.push(
          <Option key={item.AttentionCode} value={item.AttentionCode}>
            {item.AttentionName}
          </Option>,
        );
      });
      return selectList;
    }
  }
  
      /** 数据类型切换 */
 _handleDateTypeChange = value => {
        const dataType = value;
        this.updateQueryState({
          dataType: value,
        });
        this.child.onDataTypeChange(dataType);
    }
    onRef1 = ref => {
      this.child = ref;
  }

  render() {
    const {
      exloading,
      queryPar: {  beginTime, endTime,EntName, RegionCode,AttentionCode,dataType,PollutantType },
    } = this.props;

    const { entCode } = this.state;
    return (
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
            
              <Row>
              <Form.Item label='数据类型'>
              <Select
                    placeholder="数据类型"
                    onChange={this._handleDateTypeChange}
                    value={dataType}
                    style={{ width: 200 }}
                  >  
                 <Option key='0' value='HourData'>小时数据</Option>
                 <Option key='1' value='DayData'> 日数据</Option>

                  </Select>
              </Form.Item>
                <Form.Item>
                  日期查询：
                  <RangePicker_
                    dateValue={[moment(beginTime), moment(endTime)]}
                    format="YYYY-MM-DD HH:mm:ss"
                    callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                    onRef={this.onRef1}
                    style={{width: 350,marginLeft:0,marginRight:0}}
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item label='行政区'>
                  <Select
                    allowClear
                    placeholder="行政区"
                    onChange={this.changeRegion}
                    value={RegionCode ? RegionCode : undefined}
                    style={{ width: 150 }}
                  >
                    {this.regchildren()}
                  </Select>
                </Form.Item>
                <Form.Item label='关注程度'>
                  <Select
                    placeholder="关注程度"
                    onChange={this.changeAttent}
                    value={AttentionCode}
                    style={{ width: 150 }}
                  >
                    <Option value="">全部</Option>
                    {this.attentchildren()}
                  </Select>
                </Form.Item>
                </Row>
                <Row>

                <Form.Item label='企业类型'>
                  <Select
                    placeholder="企业类型"
                    onChange={this.typeChange}
                    value={PollutantType}
                    style={{ width: 200 }}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">废水</Option>
                    <Option value="2">废气</Option>
                  </Select>
                </Form.Item>
                <Form.Item label='企业列表'>
                  <Select
                    showSearch
                    allowClear
                    placeholder="企业列表"
                    onChange={this.changeEnt}
                    value={entCode ? entCode : undefined}
                    style={{ width: 350  }}
                  >
                    {this.children()}
                  </Select>
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
            </>
          }
        >
          <>
            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={this.props.loading}
              columns={this.columns}
              bordered={false}
              dataSource={this.props.tableDatas}
              // pagination={{
              //   showSizeChanger: true,
              //   showQuickJumper: true,
              //   sorter: true,
              //   total: this.props.total,
              //   pageSize: PageSize,
              //   current: PageIndex,
              //   pageSizeOptions: ['10', '20', '30', '40', '50'],
              // }}
            />
          </>
        </Card>
    );
  }
}
