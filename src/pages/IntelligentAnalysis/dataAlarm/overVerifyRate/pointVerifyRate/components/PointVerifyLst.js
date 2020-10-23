/**
 * 功  能：超标核实率
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
import ButtonGroup_ from '@/components/ButtonGroup'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'overVerifyRate/updateState',
  getData: 'overVerifyRate/getDefectPointDetail',
};
@connect(({ loading, overVerifyRate,autoForm,common }) => ({
  priseList: overVerifyRate.priseList,
  loading: loading.effects[pageUrl.getData],
  exloading:overVerifyRate.exloading,
  overVerifyRateForm:overVerifyRate.overVerifyRateForm,
  divisorList: overVerifyRate.divisorList,
  tableDatil:overVerifyRate.tableDatil

}))

export default class PointVerifyLst extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedValues:[],
      columns :[]
    
    };
    
  }

  componentDidMount() {
    // this.updateQueryState({
    //   RegionCode: this.props.RegionCode,
    // });
    this.initData();
    
  }

  initData = () => {
    const { location,dispatch  } = this.props;
    dispatch({
      //获取企业列表
      type: 'overVerifyRate/getEntByRegion',
      payload: { RegionCode:this.props.RegionCode },
  });
    let newColumns = [{
      title: <span>行政区</span>,
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      
    },
    {
      title: <span>{'企业名称'}</span>,
      dataIndex: 'entName',
      key: 'entName',
      align: 'left',
    },
    {
      title: <span>监测点名称</span>,
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'left'
    },];
    this.props.divisorList.map((item, key) => {
      let index = this.props.overVerifyRateForm.PollutantList.findIndex((checkedItem, checkedKey) => {
        if (item.PollutantCode == checkedItem) {
          return true;
        }
      })
      if (index !== -1) {
        newColumns.push({
          title: <span>{item.PollutantName}</span>,
          dataIndex: item.PollutantCode,
          key: item.PollutantCode,
          
         children:[{
          title: <span>报警次数</span>,
          width:100,
        dataIndex: item.PollutantCode + '_alarmCount',
        key: item.PollutantCode + '_alarmCount',
        align: 'center',
        },{
          title: <span>已核实报警次数</span>,
          width:110,
        dataIndex: item.PollutantCode + '_respondedCount',
        key:item.PollutantCode + '_respondedCount',
        align: 'center',
        },{
          title: <span>未核实报警次数</span>,
          width:110,
        dataIndex:item.PollutantCode + '_noRespondedCount',
        key: item.PollutantCode + '_noRespondedCount',
        align: 'center',
        },{
          title: <span>核实率</span>,
          width:100,
        dataIndex: item.PollutantCode + '_RespondedRate',
        key: item.PollutantCode + '_RespondedRate',
        align: 'center',
        render: (text, record) => { 
            return <div>
                     {text == '-'?text:`${text}%`}
                 </div>
                   
         },
        }]
        });
      }else{
      }
    })
    newColumns.push({
      title: <span>核实率</span>,
    dataIndex: 'AllRespondedRate',
    key: 'AllRespondedRate',
    align: 'center',
    render: (text, record) => { 
        return <div>
                 {text == '-'?text:`${text}%`}
             </div>
               
     },
    
  });
  this.setState({columns:newColumns})
    setTimeout(() => {
      this.getTableData();
    });
  };
  updateQueryState = payload => {
    const { overVerifyRateForm, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { overVerifyRateForm: { ...overVerifyRateForm, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, overVerifyRateForm } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...overVerifyRateForm ,RegionCode:this.props.RegionCode},
    });
  };


 
  changeEnt=(value,data)=>{ //企业事件
    this.updateQueryState({
      EntCode: value,
    });
    setTimeout(() => {
    this.queryClick();
      });
  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, overVerifyRateForm } = this.props;
    dispatch({
      type: 'overVerifyRate/exportDefectPointDetail',
      payload: { ...overVerifyRateForm },
      callback: data => {
         downloadFile(`/upload${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();

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
  onRef1 = (ref) => {
    this.child = ref;
  }
    
 
  render() {
    let columns =[]
    return (
        <Card
          bordered={false}
          title={
            
              <Form layout="inline">
            
              <Row>
             
              <Form.Item  >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                    placeholder="企业列表"
                                    onChange={this.changeEnt}
                                    style={{ width: 177 }}
                                >
                                    {this.entChildren()}
                                </Select>
                            </Form.Item>
                <Form.Item>
                 
                  <Button
                    style={{ margin: '0 5px' }}
                    icon="export"
                    onClick={this.template}
                    loading={this.props.exloading}
                  >
                    导出
                  </Button>
                  <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                this.updateQueryState({
                    EntCode: '',
                  });
                history.go(-1);
              }}
            >返回</Button>
                </Form.Item>
                </Row>
              </Form>
          }
        >
            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={this.props.loading}
              columns={this.state.columns}
              dataSource={this.props.tableDatil.data}
              pagination={{
                // showSizeChanger: true,
                // showQuickJumper: true,
                // sorter: true,
                total: this.props.total,
                defaultPageSize:20
               
              }} />
        </Card>
    );
  }
}
