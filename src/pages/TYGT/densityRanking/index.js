/**
/**
 * 功  能：统计量变化趋势
 * 创建人：贾安波
 * 创建时间：2019.10.19
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
  Select,
  Tabs,
  Radio,
  Checkbox,
  message,
  Spin,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import webConfig from '@public/webConfig';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile, GetDataType, toDecimal3 } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';
import { blue, red, green, gold, purple, grey, magenta } from '@ant-design/colors';
import PageLoading from '@/components/PageLoading'
import { EnumPropellingAlarmSourceType } from '@/utils/enum';
import Item from 'antd/lib/list/Item';



const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const defaultSelectPollutantCode = webConfig.defaultSelectPollutantCode;
const monthFormat = 'YYYY-MM';
const dateFormat = 'YYYY-MM-DD HH:00:00';
const pageUrl = {
  updateState: 'densityRankingModel/updateState',
  getData: 'densityRankingModel/getAreaDensityRanking',
};
@connect(({ loading, densityRankingModel, autoForm }) => ({
  exloading: densityRankingModel.exloading,
  loading: densityRankingModel.loading,
  total: densityRankingModel.total,
  tableDatas: densityRankingModel.tableDatas,
  queryPar: densityRankingModel.queryPar,
  column: densityRankingModel.column,
  chartTime: densityRankingModel.timeList,
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    this.queryClick();
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

  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'densityRankingModel/exportSewageHistoryList',
      payload: { ...queryPar },
      callback: data => {
        downloadFile(`/upload${data}`);
      },
    });
  };
  // //查询事件
  queryClick = () => {
    const { pointName, dispatch, queryPar: { DGIMN, PollutantList, EntCode } } = this.props;
    this.getTableData();
  };
  ondateChange = (value, dateString) => {
    this.updateQueryState({
      MonitorTime: dateString
    });
  };

  render() {
    const { chartExport, chartImport, chartTime, entName, PollutantList, column, tableDatas } = this.props;
    let columns = [
      {
        title: '序号',
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '区域名称',
        dataIndex: 'BranchFactoryName',
        key: 'BranchFactoryName',
        align: 'center',
      },
      {
        title: '关联设备数',
        dataIndex: 'PointNum',
        key: 'PointNum',
        align: 'center',
      },
      {
        title: '实时污染指数',
        dataIndex: 'MonitorValue',
        key: 'MonitorValue',
        align: 'center',
      },
      {
        title: '小时排名',
        dataIndex: 'HourRanking',
        key: 'HourRanking',
        align: 'center',
        sorter: {
          compare: (a, b,c) => {
            var tempa=a.HourRanking,tempb=b.HourRanking;
            if(c=="ascend")
            {
              if(a.HourRanking=="-")
              {
                tempa=999
              }else
  
              if(b.HourRanking=="-")
              {
                tempb=999
              } 
            }else{
              if(a.HourRanking=="-")
              {
                tempa=0
              }else
  
              if(b.HourRanking=="-")
              {
                tempb=0
              } 

            }         
          return  tempa-tempb 
          } 
        },
      },
      {
        title: '日排名',
        dataIndex: 'DayRanking',
        key: 'DayRanking',
        align: 'center',
        sorter: {
          compare: (a, b,c) =>{
            var tempa=a.DayRanking,tempb=b.DayRanking;
            if(c=="ascend")
            {
              if(a.DayRanking=="-")
              {
                tempa=999
              }else
  
              if(b.DayRanking=="-")
              {
                tempb=999
              } 
            }else{
              if(a.DayRanking=="-")
              {
                tempa=0
              }else
  
              if(b.DayRanking=="-")
              {
                tempb=0
              } 

            }         
          return  tempa-tempb 
          }   
        },
      },
      {
        title: '月排名',
        dataIndex: 'MonthRanking',
        key: 'MonthRanking',
        align: 'center',
        sorter: {
          compare: (a, b,c) => {
            var tempa=a.MonthRanking,tempb=b.MonthRanking;
            if(c=="ascend")
            {
              if(a.MonthRanking=="-")
              {
                tempa=999
              }else
  
              if(b.MonthRanking=="-")
              {
                tempb=999
              } 
            }else{
              if(a.MonthRanking=="-")
              {
                tempa=0
              }else
  
              if(b.MonthRanking=="-")
              {
                tempb=0
              } 

            }         
          return  tempa-tempb 
          }  
        },
      }
    ];

    return (
      <Card
        bordered={false}
        title={
          <>
            <Form layout="inline">
              <Row>
                <Form.Item >
                  <DatePicker showTime onChange={this.ondateChange} onOk={this.onOk} defaultValue={moment(moment().subtract(1, 'hour'),'YYYY-MM-DD hh:00:00') }
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
                  >
                    导出
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          </>
        }
      >
        <SdlTable
          style={{ paddingTop: 10 }}
          dataSource={tableDatas} columns={columns}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            // sorter: true,
            total: this.props.total,
            defaultPageSize: 20
          }}
        />

      </Card>
    );
  }
}
