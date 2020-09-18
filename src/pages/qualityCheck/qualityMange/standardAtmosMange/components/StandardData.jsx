


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,message} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { green } from '@ant-design/colors';
/**
 * 标准气管理
 * jab 2020.08.13
 */
const columns = [
  {
    title: '标气名称',
    dataIndex: 'PollutantName',
    key: 'PollutantName',
    align: 'center'
  },
  {
    title: '标气浓度',
    dataIndex: 'Value',
    key: 'Value',
    align: 'center'
  },
  {
    title: '单位',
    dataIndex: 'Unit',
    key: 'Unit',
    align: 'center'
  },
  {
    title: '证书编号',
    dataIndex: 'CertificateNo',
    key: 'CertificateNo',
    align: 'center',
    width:120
  },
  {
    title: '生产日期',
    dataIndex: 'ProductDate',
    key: 'ProductDate',
    align: 'center',
    render: text =>  moment(new Date(text)).format('YYYY-MM-DD')
  },
  {
    title: '有效日期',
    dataIndex: 'LoseDate',
    key: 'LoseDate',
    align: 'center',
    render: text =>  moment(new Date(text)).format('YYYY-MM-DD')
  },
  {
    title: '气瓶体积(L)',
    dataIndex: 'Volume',
    key: 'Volume',
    align: 'center',
    width:90
  },
  {
    title: '初始压力(MPa)',
    dataIndex: 'Pressure',
    key: 'Pressure',
    align: 'center',
    width:115
  },
  {
    title: '录入时间',
    dataIndex: 'CreateDateTime',
    key: 'CreateDateTime',
    align: 'center'
  },
  {
    title: '不确定度(%)',
    dataIndex: 'Uncertainty',
    key: 'Uncertainty',
    align: 'center',
    // ellipsis: true
    width:100
  },
  {
    title: '制造商',
    dataIndex: 'Producer',
    key: 'Producer',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'State',
    key: 'State',
    align: 'center',
    render: text => <>{text == 0?  <span>已更换</span> : <span style={{color:green.primary}}>使用中</span> }</>,
  },
];
@connect(({ standardData }) => ({
    tableDatas:standardData.tableDatas,
    total: standardData.total,
    tablewidth: standardData.tablewidth,
    tableLoading:standardData.tableLoading,
    standardParams:standardData.standardParams,
    // dgimn:standardData.dgimn
}))

class TableData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        tableDatas:[],
        columns:[],
        dateValue: [ moment(new Date()).add(-1, 'year'), moment(new Date())],
        };
    }
    static getDerivedStateFromProps(props, state) {
     
      // 只要当前 tableDatas 变化，
      // 重置所有跟 tableDatas 相关的状态。
      // if (props.tableDatas !== state.tableDatas) {
      //   return {
      //     tableDatas: props.tableDatas
      //   };
      // }
      // return null;

    }
    componentDidMount(){
       
      this.props.initLoadData && this.changeDgimn(this.props.dgimn)
     
    }
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
  componentDidUpdate(prevProps) {
   if(prevProps.dgimn !==  this.props.dgimn) {
        this.changeDgimn(this.props.dgimn);
    }
}
 /** 切换排口 */
      changeDgimn = (dgimn) => {
        this.getTableData(dgimn);
  
    }

  /** 根据排口dgimn获取它下面的数据 */
  getTableData = dgimn => {
          let {dispatch,standardParams} = this.props;
          standardParams = {
            ...standardParams,
            BeginTime: moment(new Date()).add(-1, 'year').format('YYYY-MM-DD HH:mm:ss'),
            EndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            DGIMN:dgimn
          }
           dispatch({
              type: 'standardData/updateState',
              payload: { standardParams  },
          });
         setTimeout(()=>{this.onFinish()}) 
         
          
      }
  /**
 * 回调获取时间并重新请求数据
 */
dateCallback = (dates, dataType) => { //更新日期
    let { standardParams, dispatch } = this.props;
    this.setState({dateValue: dates})
    standardParams = {
      ...standardParams,
      BeginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
      EndTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
    }
    dispatch({
      type: 'standardData/updateState',
      payload: { standardParams},
    })
  }
  onFinish = ()=>{
    let {dispatch,standardParams} = this.props;
    standardParams = {
      ...standardParams,
    }
     dispatch({
        type: 'standardData/getQCAStandardList',
        payload: { ...standardParams  },
    });
  }



  //导出数据
  exportData = () => { 
    message.warning("暂未开放")
  //   this.props.dispatch({
  //     type: "historyData/exportHistoryReports",
  //     payload: {DGIMNs: this.state.dgimn }
  // })
  }


      //查询条件
  queryCriteria = () => {
    const { dateValue } = this.state;
    return <div>
      <div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline"  onFinish={this.onFinish}>
          <Row gutter={[8,8]} style={{flex:1}} > 
            <Col xxl={7} xl={10}   lg={14} md={16} sm={24} xs={24}>
              <Form.Item label="监测时间" className='queryConditionForm'>
                  <RangePicker_ 
                   onRef={this.onRef1}
                  dateValue={dateValue}
                  isVerification={true}
                  className='textEllipsis'
                  callback={(dates, dataType) => this.dateCallback(dates,dataType)} //父组件事件回调子组件的值
                  allowClear={false} showTime={true} style={{width:"100%"}} /> 
              </Form.Item>
            </Col>
            <Col xxl={4} xl={4} lg={4}  md={3} sm={24} xs={24}>
              <Form.Item  className='queryConditionForm'> 
                <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                <Button type="primary" loading={false} onClick={() => { this.exportData() }} style={{ marginRight: 5 }}>导出</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  }
  render() {

    const {tableLoading,tableDatas,total} = this.props;
    const  QueryCriteria = this.queryCriteria;
    return (

<div id="standardData">
        <Card title={<QueryCriteria />} >
           <SdlTable
              rowKey={(record, index) => `complete${index}`}
              dataSource={tableDatas}
              columns={columns}
              resizable
              defaultWidth={80}
              scroll={{ y: this.props.tableHeight || undefined}}
              loading={tableLoading}
              pagination={{total:total, showSizeChanger:true , showQuickJumper:true,defaultPageSize:20}}
          /> 
        </Card>
     </div>);
  }
}

export default TableData;