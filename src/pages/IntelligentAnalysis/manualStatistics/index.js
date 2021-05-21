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
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import { downloadFile,interceptTwo } from '@/utils/utils';
import RegionList from '@/components/RegionList'
const { RangePicker } = DatePicker
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const monthFormat = 'YYYY-MM';
import styles from './style.less'
@connect(({ loading, manualStatistics,autoForm,entWorkOrderStatistics }) => ({
  EntList:manualStatistics.EntList,
  PointList:manualStatistics.PointList,
  queryPar:manualStatistics.queryPar
}))

@Form.create()

export default class EntTransmissionEfficiency extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      regionCode:'',
      dates:'',
      hackValue:'',
      datesValue:''
    };
  }

  componentDidMount() {
    this.getData();
  }

  updateState = payload => {
    this.props.dispatch({
      type: 'manualStatistics/updateState',
      payload,
    });
  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type:'manualStatistics/updateState',
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };
  getData = () => {
     // 获取行政区列表
    const { dispatch } = this.props;
    //获取企业列表
      dispatch({
      type: 'manualStatistics/getEmissionsEntPointPollutant',
      payload: { RegionCode: this.state.regionCode},
      callback:res=>{
      }
    })

  };


  pointChildren=()=>{ //监测点列表
    const { PointList } = this.props;

    const selectList = [];
    if (PointList.length > 0) {
      PointList.map(item => {
        selectList.push(
          <Option key={item[0].DGIMN} value={item[0].DGIMN}  title={item[0].PointName}>
            {item[0].PointName}
          </Option>,
        );
      });
      return selectList;
    }
  }
  children = () => { //企业列表
    const { EntList } = this.props;

    const selectList = [];
    if (EntList.length > 0) {
      EntList.map(item => {
        selectList.push(
          <Option key={item[0].EntCode} value={item[0].EntCode} title={item[0].EntName}>
            {item[0].EntName}
          </Option>,
        );
      });
      return selectList;
    }
  };

  //查询事件
  queryClick = (e) => {
 
      // this.props.form.setFieldsValue({ AttachmentID:this.state.fileList.length>0? this.state.uid : ''})
      // this.props.form.setFieldsValue({ WaterPhoto:this.state.waterPhoto.length>0? this.state.uidWater : ''})
      // this.props.form.setFieldsValue({ GasPhoto:this.state.gasPhoto.length>0? this.state.uidGas : ''})
      const { dispatch } = this.props;
 

     e.preventDefault();
     this.props.form.validateFieldsAndScroll((err, values) => {
       console.log(values)
       if (!err) {
          dispatch({
          type: 'manualStatistics/getRecalculateEffectiveTransmissionEnt',
          payload: { 
            DGIMN:values.DGIMN,
            beginTime: moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            entTime: moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
          },
         })
       }
     })

  };

  changeRegion=(value)=>{
    this.updateState({parmarType:'RegionCode'})
    this.setState({regionCode:value},()=>{
      this.getData()
    })
  }
  changeEnt=(value)=>{
    this.updateState({parmarType:'EntCode'})
    this.props.form.setFieldsValue({ DGIMN: undefined})
    this.props.dispatch({ type: 'manualStatistics/getEmissionsEntPointPollutant', //根据企业获取监测点
     payload: {  EntCode: value },
   })
  }
  disabledDate = current => {
    const {dates} = this.state;
    if (!dates || dates.length === 0 ) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    const maxDate = current > moment().add(-1, 'day');
    return tooEarly || tooLate || maxDate;
  };
  onOpenChange = open => {
    if (open) {
      this.setState({
        hackValue:[]
      })
      this.setState({
        dates:[]
      })
    } else {
      this.setState({
        hackValue:undefined
      })
    }
  };
  render() {
    const { hackValue,datesValue,regionCode } = this.state;
    const { entList,queryPar:{DGIMN,EntCode,RegionCode} } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <BreadcrumbWrapper title="传输有效率">
        <Card
          bordered={false}
        >
     <Card
          title='统计污染源监测点有效传输率'
          style={{border:'1px solid #f0f0f0'}}
          className={styles.manualStatistics}
      >
          <Form layout="inline" ref={this.formRef} >
              <Form.Item>
              <RegionList style={{ width: 150  }} changeRegion={this.changeRegion} RegionCode={regionCode}/>
              </Form.Item>
              <Form.Item>
                  <Select 
                      showSearch 
                      style={{ width: 250 }} 
                      onChange={v=>{this.changeEnt(v)}} 
                      allowClear placeholder="请选择企业">
                      {
                        this.children()
                      }
                  </Select>
                   </Form.Item>

                   <Form.Item label=''>
                   {getFieldDecorator('DGIMN', {
                    rules: [{ required: true, message: '请选择监测点名称' }],
                   })( <Select
                  placeholder="监测点名称"
                  onChange={this.changePoint}
                  value={DGIMN? DGIMN : undefined }
                  style={{ width: 150  }}
                >
                {this.pointChildren()}
                </Select>)}
              </Form.Item>
                <Form.Item>
                {getFieldDecorator('time', {
                    rules: [{ required: true, message: '请选择日期' }],
                   })( <RangePicker
                    showTime
                     format="YYYY-MM-DD HH:mm:ss"
                     value={hackValue || datesValue}
                     disabledDate={this.disabledDate}
                     onCalendarChange={val => this.setState({dates:val})}
                     onChange={val => this.setState({datesValue:val})}
                     onOpenChange={this.onOpenChange}
                  /> )}
                </Form.Item>
                <Row style={{paddingTop:8}}>
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick} style={{ width: 150  }}>
                    计算
                  </Button>
                </Form.Item>
                </Row>
              </Form>
      </Card>
  
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
