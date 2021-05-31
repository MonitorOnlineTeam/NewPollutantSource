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
  message,
  Spin
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import { downloadFile,interceptTwo } from '@/utils/utils';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'

const { RangePicker } = DatePicker
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const monthFormat = 'YYYY-MM';
import styles from './style.less'
@connect(({ loading, manualStatistics,common }) => ({
  EntList:manualStatistics.EntList,
  PointList:manualStatistics.PointList,
  queryPar:manualStatistics.queryPar,
  airPoint:manualStatistics.airPoint,
  airEffectiveVal:manualStatistics.airEffectiveVal,
  entEffectiveVal:manualStatistics.entEffectiveVal,
  airLoading: loading.effects['autoForm/getConfigIdLists'],
  airEffectLoading: loading.effects['manualStatistics/getRecalculateEffectiveTransmissionAir'],
  entEffectLoading: loading.effects['manualStatistics/getRecalculateEffectiveTransmissionEnt'],
  pointLoading:manualStatistics.pointLoading,
  entLoading:manualStatistics.entLoading
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
      datesValue:'',
      airPoint:[]
    };
  }

  componentDidMount() {
    this.updateState({
      entEffectiveVal:'',
      airEffectiveVal:''
    })
    this.getEntData();
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
  getEntData = () => {
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

  airPoint = (data) =>{
    this.props.dispatch({
      type: 'autoForm/getConfigIdLists',
      payload: {
        configId:'AtmosphereNew',
        ConditionWhere: JSON.stringify({
          rel: '$and',
          group: [
            {
              rel: '$and',
              group: [ 
                {
                Key:'dbo__T_Cod_MonitorPointBase__BaseCode',
                Value:data&&data,
                Where:'$='
              }],
            },
          ],
        })
      },
      callback:res=>{
        this.setState({
          airPoint:res
        })
      }
    })
  }
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
  airPointChildren=()=>{  // 空气站 监测点列表
    const { airPoint } = this.state;

    const selectList = [];
    if (airPoint.length > 0) {
      airPoint.map(item => {
        selectList.push(
          <Option key={item['dbo.T_Bas_CommonPoint.DGIMN']} value={item['dbo.T_Bas_CommonPoint.DGIMN']}  title={item['dbo.T_Bas_CommonPoint.PointName']}>
            {item['dbo.T_Bas_CommonPoint.PointName']}
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



  changeRegion=(value)=>{
    this.updateState({parmarType:'RegionCode'})
    this.props.form.setFieldsValue({ DGIMN: undefined})
    this.setState({regionCode:value},()=>{
      this.getEntData()
    })
  }

  changeAir=(value)=>{
    this.airPoint(value)
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
  // onPanelChange
  queryClick=(e)=>{ //企业 手工统计
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {


     if (!err) {
      const ranges = moment(values.time[0].format('YYYY-MM-DD 23:59:59')).add(30, 'day');
      const ydays = moment(moment().format('YYYY-MM-DD 23:59:59')).add(-1, 'day');
      if(ranges<values.time[1]||values.time[1]>ydays){
          message.warning('日期范围不能超过30天且不能超过昨天')
          this.props.form.setFieldsValue({ time:undefined})
          return false;
     }
      this.props.dispatch({
      type: 'manualStatistics/getRecalculateEffectiveTransmissionEnt',
      payload: { 
        DGIMN:values.DGIMN,
        beginTime: moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
      },
     })
   }
 })
  }
  changeEnt=(value)=>{
      this.updateState({parmarType:'EntCode'})
      this.props.form.setFieldsValue({ DGIMN: undefined})
      this.props.dispatch({ type: 'manualStatistics/getEmissionsEntPointPollutant', //根据企业获取监测点
       payload: {  EntCode: value },
     })
    }

    airQueryClick=(e)=>{ //空气站 手工统计
        const { form:{getFieldValue} } = this.props;
         
          if (getFieldValue('airTime')&&getFieldValue('airDGIMN')) {

            const ranges = moment(getFieldValue('airTime')[0].format('YYYY-MM-DD HH:mm:ss')).add(30, 'day');
            const ydays = moment(moment().format('YYYY-MM-DD 23:59:59')).add(-1, 'day');
            if(ranges<getFieldValue('airTime')[1]||getFieldValue('airTime')[1]>ydays){
                message.warning('日期范围不能超过30天且不能超过昨天')
                this.props.form.setFieldsValue({ airTime:undefined})
                return false;
           }
            this.props.dispatch({
             type: 'manualStatistics/getRecalculateEffectiveTransmissionAir',
             payload: { 
              DGIMN:getFieldValue('airDGIMN'),
              beginTime:moment(getFieldValue('airTime')[0]).format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment(getFieldValue("airTime")[1]).format('YYYY-MM-DD HH:mm:ss'),
            },
            })
          }else{
            message.warning('请选择监测点或者日期')
          }

      }
//   entFormFun = () =>{
//     const { hackValue,datesValue,regionCode } = this.state;
//     const { dispatch,entEffectiveVal} = this.props;
//     const CreateFormMan = Form.create()(props => {
//          const { form} = props;
//          const { getFieldDecorator } = form;
//       //手工计算  企业
//     const queryClick = (e) => {
//       e.preventDefault();
//       props.form.validateFieldsAndScroll((err, values) => {
//        if (!err) {
//         dispatch({
//         type: 'manualStatistics/getRecalculateEffectiveTransmissionEnt',
//         payload: { 
//           DGIMN:values.DGIMN,
//           beginTime: moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
//           entTime: moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
//         },
//        })
//      }
//    })
  
// };

//         return     <Form layout="inline">
//         <Form.Item>
//         <RegionList style={{ width: 150  }} changeRegion={this.changeRegion} RegionCode={regionCode}/>
//         </Form.Item>
//         <Form.Item>
//             <Select 
//                 showSearch 
//                 style={{ width: 250 }} 
//                 onChange={v=>{this.changeEnt(v)}} 
//                 allowClear placeholder="请选择企业">
//                 {
//                   this.children()
//                 }
//             </Select>
//              </Form.Item>

//              <Form.Item label=''>
//              {getFieldDecorator('DGIMN', {
//               rules: [{ required: true, message: '请选择监测点名称' }],
//              })( <Select
//             placeholder="监测点名称"
//             // onChange={this.changePoint}
//             // value={DGIMN? DGIMN : undefined }
//             style={{ width: 150  }}
//           >
//           {this.pointChildren()}
//           </Select>)}
//         </Form.Item>
//           <Form.Item>
//           {getFieldDecorator('time', {
//               rules: [{ required: true, message: '请选择日期' }],
//              })( <RangePicker
//               showTime
//                format="YYYY-MM-DD HH:mm:ss"
//                value={hackValue || datesValue}
//                disabledDate={this.disabledDate}
//                onCalendarChange={val => this.setState({dates:val})}
//                onChange={val => this.setState({datesValue:val})}
//                onOpenChange={this.onOpenChange}
//             /> )}
//           </Form.Item>
//           <Row style={{padding:'15px 0'}}>
//           <Form.Item>
//             <Button type="primary" onClick={queryClick} style={{ width: 150  }}>
//               计算
//             </Button>
//           </Form.Item>
//           <Form.Item>
//              {entEffectiveVal&&<span style={{color:'#ff4d4f'}}>最新计算结果：{entEffectiveVal}%</span>}
//           </Form.Item>
//           </Row>
//         </Form>
//         }
//     )

//     return <CreateFormMan />
//   }
//  dateChange=(date,type)=>{
//   if(date&&date.length>0){
//     const ranges = moment(date[0].format('YYYY-MM-DD HH:mm:ss')).add(30, 'day');
//     const ydays = moment(date[1].format('YYYY-MM-DD 23:59:59')).add(-1, 'day');
//      if(ranges<date[1]||date[1]>ydays){
//         message.warning('日期范围不能超过30天且不能超过昨天')
//         this.setState({dates:[]})
//         type==='ent'? this.props.form.setFieldsValue({ time: []}) : this.props.form.setFieldsValue({ airTime: undefined})
//      }
//   }

//  }


  render() {
    const { hackValue,datesValue,regionCode } = this.state;
    const { dispatch,entEffectiveVal,airEffectiveVal,form:{getFieldDecorator},airLoading,pointLoading,entLoading} = this.props;
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
       {/* {this.entFormFun()} */}

       <Form layout="inline">
        <Form.Item>
        <RegionList style={{ width: 150  }} changeRegion={this.changeRegion} RegionCode={regionCode}/>
        </Form.Item>
        <Form.Item>
        {!entLoading? <Select 
                showSearch 
                style={{ width: 250 }} 
                onChange={v=>{this.changeEnt(v)}} 
                allowClear placeholder="请选择企业">
                {
                  this.children()
                }
            </Select>: <Spin size='small'/>}
             </Form.Item>

             <Form.Item label=''>
             {!pointLoading? getFieldDecorator('DGIMN', {
              rules: [{ required: true, message: '请选择监测点名称' }],
             })( <Select
            placeholder="监测点名称"
            style={{ width: 150  }}
          >
          {this.pointChildren()}
          </Select>) : <Spin size='small'/>}
        </Form.Item>
          <Form.Item>
          {getFieldDecorator('time', {
              rules: [{ required: true, message: '请选择日期' }],
             })( <RangePicker
              // showTime={{
              //   hideDisabledOptions: true,
              //   defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              // }}
               format="YYYY-MM-DD"
               disabledDate={this.disabledDate}
               onCalendarChange={val => this.setState({dates:val})}
              //  onChange={val => this.setState({dates:val})}
              //  onChange={val => this.dateChange(val,'ent')}
               onOpenChange={this.onOpenChange}
            /> )}
          </Form.Item>
          <Row style={{padding:'15px 0'}}>
          <Form.Item>
            <Button type="primary" onClick={this.queryClick} style={{ width: 150  }} loading={this.props.entEffectLoading}>
              计算
            </Button>
          </Form.Item>
          <Form.Item>
             {entEffectiveVal&&<span style={{color:'#ff4d4f'}}>最新计算结果：{entEffectiveVal}</span>}
          </Form.Item>
          </Row>
        </Form>
      </Card>
  


      <Card
          title='统计空气站传输有效率'
          style={{border:'1px solid #f0f0f0',marginTop:20}}
          className={styles.manualStatistics}
      >

<Form layout="inline" >
             <Form.Item>
             <EntAtmoList type={2} changeEnt={this.changeAir} EntCode={''}  style={{ width: 150  }}/>
             </Form.Item>

           <Form.Item label=''>
           {!airLoading? getFieldDecorator('airDGIMN', {
            // rules: [{ required: true, message: '请选择空气监测点名称' }],
           })( <Select
          placeholder="空气监测点名称"
          style={{ width: 250  }}
        >
        {this.airPointChildren()}
        </Select>) :  <Spin size='small'/> } 
      </Form.Item>
        <Form.Item>
        {getFieldDecorator('airTime', {
            // rules: [{ required: true, message: '请选择日期' }],
           })( <RangePicker
            // showTime={{
            //   hideDisabledOptions: true,
            //   defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
            // }}
             format="YYYY-MM-DD"
            //  value={hackValue || datesValue}
             disabledDate={this.disabledDate}
             onCalendarChange={val => this.setState({dates:val})}
            //  onChange={val => this.setState({datesValue:val})}
            //  onChange={val => this.dateChange(val,'air')}
             onOpenChange={this.onOpenChange}
          /> )}
        </Form.Item>
        <Row style={{padding:'15px 0'}}>
        <Form.Item>
          <Button type="primary"   onClick={this.airQueryClick} style={{ width: 150  }} loading={this.props.airEffectLoading}>
            计算
          </Button>
        </Form.Item>
        <Form.Item>
          {airEffectiveVal&&<span style={{color:'#ff4d4f'}}>最新计算结果：{airEffectiveVal}</span>}
        </Form.Item>
        </Row>
      </Form>
    
      </Card>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
