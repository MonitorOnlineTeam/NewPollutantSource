/**
 * 功  能：缺失数据报警
 * 创建人：贾安波
 * 创建时间：2020.10
 */
import React, { Component } from 'react';
import { ExportOutlined,RollbackOutlined} from '@ant-design/icons';
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
  Radio,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile,interceptTwo } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import { routerRedux } from 'dva/router';
import RegionList from '@/components/RegionList'



const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'regionalAccountStatistics/updateState',
  getData: 'regionalAccountStatistics/getDefectModel',
};
@connect(({ loading, regionalAccountStatistics,autoForm,common }) => ({
  priseList: regionalAccountStatistics.priseList,
  exloading:regionalAccountStatistics.exloading,
  loading: loading.effects[pageUrl.getData],
  total: regionalAccountStatistics.total,
  tableDatas: regionalAccountStatistics.tableDatas,
  queryPar: regionalAccountStatistics.queryPar,
  regionList: autoForm.regionList,
  attentionList:regionalAccountStatistics.attentionList,
  atmoStationList:common.atmoStationList
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
    };
    
    this.columns = [
      {
        title: <span>序号</span>,
        dataIndex: 'pointCount',
        key: 'pointCount',
        align: 'center',
      },
      {
        title: <span>大区名称</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
        render: (text, record) => { 
          return <Link to={{  pathname: '/Intelligentanalysis/dataAlarm/regionalAccountStatistics/missDataSecond',query:  {regionCode:record.regionCode} }} >
                   {text}
               </Link>      
       },
      },
      {
        title: <span>总账户数</span>,
        dataIndex: 'pointCount',
        key: 'pointCount',
        align: 'center',
        sorter: (a, b) => a.firstTime- b.firstTime
      },
      {
        title: <span>访问账户数</span>,
        dataIndex: 'exceptionCount',
        key: 'exceptionCount',
        align: 'center',
        sorter: (a, b) => a.firstTime- b.firstTime
      },
      {
        title: <span>未访问账户数</span>,
        dataIndex: 'xiangyingCount',
        key: 'xiangyingCount',
        align: 'center',
        sorter: (a, b) => a.firstTime- b.firstTime
      },
      {
        title: <span>系统访问率</span>,
        dataIndex: 'weixiangyingCount',
        key: 'weixiangyingCount',
        align: 'center',
        sorter: (a, b) => a.firstTime- b.firstTime,
        render: (text, record) => {
          const percent = interceptTwo(Number(text) * 100);
            return (
              <div>
                <Progress
                  percent={percent}
                  size="small"
                  style={{width:'90%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{percent}%</span>}
                />
              </div>
            );
          }

    }
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch } = this.props;

      this.dayChange();
  };

  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'regionalAccountStatistics/exportDefectDataSummary',
      payload: { ...queryPar },
      callback: data => {
         downloadFile(`/upload${data}`);
        },
    });
  };

    dayChange=()=>{
      const { dispatch, queryPar } = this.props;
      dispatch({
        type: pageUrl.getData,
        payload: { ...queryPar },
      });
    }
  render() {
    const {
      exloading,
      queryPar: {  BeginTime, EndTime,EntCode, RegionCode,AttentionCode,DataType,PollutantType,OperationPersonnel },
      types,
      tableDatas
    } = this.props;
    return (
      <Card
        bordered={false}
        title={
          <>
            <Form layout="inline">
            <Row>
            <Form.Item>
            <Radio.Group onChange={this.dayChange} defaultValue="a">
               <Radio.Button value="a">近7日内</Radio.Button>
               <Radio.Button value="b">近14日内</Radio.Button>
               <Radio.Button value="c">近30日内</Radio.Button>
             </Radio.Group>

            </Form.Item>
             <Form.Item>
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
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
            dataSource={this.props.tableDatas}
            pagination={false}
            // pagination={{
              // showSizeChanger: true,
              // showQuickJumper: true,
              // sorter: true,
              // total: this.props.total,
              // //defaultPageSize:20
              // pageSize: PageSize,
              // current: PageIndex,
              // pageSizeOptions: ['10', '20', '30', '40', '50'],
            // }}
          />
        </>
      </Card>
    );
  }
}
