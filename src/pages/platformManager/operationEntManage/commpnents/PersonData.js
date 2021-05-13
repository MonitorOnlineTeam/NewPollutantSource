/**
 * 功  能：运维人员管理
 * 创建人：jab
 * 创建时间：2021.05.08
 */
import React, { Component,Fragment } from 'react';
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
  Tooltip,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import styles from '../operationPerson/style.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import { getThirdTableDataSource } from '@/services/entWorkOrderStatistics';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { EditIcon } from '@/utils/icon'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'operationPerson/updateState',
  getData: 'operationPerson/getDefectModel',
};
@connect(({ loading, operationPerson,autoForm,common}) => ({
  priseList: operationPerson.priseList,
  exloading:operationPerson.exloading,
  loading: loading.effects[pageUrl.getData],
  total: operationPerson.total,
  tableDatas: operationPerson.tableDatas,
  queryPar: operationPerson.queryPar,
  regionList: autoForm.regionList,
  attentionList:operationPerson.attentionList,
  atmoStationList:common.atmoStationList
}))
@Form.create()
export default class PersonData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible:false
    };
    
    this.columns = [
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const {dispatch, match: { params: { configId } }} = this.props;


    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId,
      },
    });
  

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

  };



  
  //查询事件
  queryClick = () => {

    const {queryPar: {dataType }, } = this.props;
   

    this.getTableData();
  };


  
  onRef1 = (ref) => {
    this.child = ref;
  }
   

   edit=()=>{  //编辑
    this.setState({
      visible:true
    })
   }


   operationUnit=()=>{ //运维单位

   } 
   operationName=()=>{ //姓名

   }
   operationBook=()=>{

   }

   operationBookOverdue=()=>{

   }
   onFinish=()=>{

   }
   handleOk=()=>{

   }
  render() {
    const {
      Atmosphere,
      exloading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantType,PageSize,PageIndex,OperationPersonnel },
      match: { params: { configId } },
    } = this.props;


    return (
        <Card
          bordered={false}
          title={
            <><SearchWrapper
            // onSubmitForm={form => this.loadReportList(form)}
            configId={configId}
        ></SearchWrapper>
              <Form layout="inline">
            
              <Row>
              <Form.Item label=''>
              <Select
                    placeholder="是否有运维工证书"
                    onChange={this.operationBook}
                    value={dataType}
                    allowClear
                  >  
                 <Option key='0' value='HourData'>有运维工证书(气)</Option>
                 <Option key='1' value='DayData'> 无运维工证书(气)</Option>
                 <Option key='0' value='HourData'>有运维工证书(水)</Option>
                 <Option key='1' value='DayData'> 无运维工证书(水)</Option>
                  </Select>
              </Form.Item>
              <Form.Item label=''>
              <Select
                    placeholder="证书是否过期"
                    onChange={this.operationBookOverdue}
                    value={dataType}
                    allowClear
                  >  
                 <Option key='0' value='HourData'>证书已过期</Option>
                 <Option key='1' value='DayData'> 证书未过期</Option>
                  </Select>
              </Form.Item>
                </Row>
                
              </Form>
            </>
          }
        >
          <>

                    <AutoFormTable
                        sort={true}
                        onRef={this.onRef1}
                        style={{ marginTop: 10 }}
                        configId={configId}
                        parentcode="platformconfig/operationEntManage"
                        appendHandleRows={row => <Fragment>

                            <Tooltip title="编辑">
                                <a href="#" style={{paddingLeft:5}} onClick={this.edit(row)} > <EditIcon/> </a>
                           </Tooltip>
                        </Fragment>}
                        parentcode="platformconfig/monitortarget"
                        {...this.props}
                    >
                    </AutoFormTable>
       <Modal
        title="Title"
        visible={this.state.visible}
        // onOk={this.handleOk}
        footer={null}
        // confirmLoading={confirmLoading}
        onCancel={()=>{this.setState({visible:false})}}
        className={styles.operationModal}
      >
        <Form
      name="basic"
      onFinish={this.onFinish}
    >
      <Row>
        <Col span={12}>
    <Form.Item
        label="运维单位"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入运维单位!',
          },
        ]}
      >
      <Select placeholder="请输入运维单位">
          <Option value="china">China</Option>
          <Option value="usa">U.S.A</Option>
        </Select>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
        label="姓名"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入姓名!',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      </Col>
      </Row>

      <Row> 
    <Form.Item
        label="运维证书相关信息(气)"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      </Row>
      <Form.Item style={{textAlign:'right'}}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
      </Modal>
          </>
        </Card>
    );
  }
}
