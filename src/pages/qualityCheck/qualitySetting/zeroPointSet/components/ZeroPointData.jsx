


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,TimePicker} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import QueryForm from '../../components/QueryForm'
import { green,red } from '@ant-design/colors';
import DropDownSelect from '@/components/DropDownSelect'

/**
 *  质控核查 零点核查
 * jab 2020.08.18
 */





@connect(({ qualitySet,pollutantListData }) => ({
    cycleOptions:qualitySet.cycleOptions,
    cycleListParams:qualitySet.cycleListParams,
   
    // total: standardData.total,
    // tablewidth: standardData.tablewidth,
    // tableLoading:standardData.tableLoading,
    // standardParams:standardData.standardParams,
    // dgimn:standardData.dgimn
}))

class TableData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        tableDatas:[],
        columns:[],
        dateValue: [ moment(new Date()).add(-1, 'month'), moment(new Date())],
        addItem : {CertificateNo: "kyj846",
        CreateDateTime: "2020-08-19 14:55:01",
Creator: null,
DGIMN: "62020131jhdp02",
GasCode: "a21026",
ID: "00000000-0000-0000-0000-000000000000",
LoseDate: "2021-07-14 00:00:00",
PollutantName:"",
Pressure: 10,
Producer: "北京氦普北分气体工业有限公司",
ProductDate: "2020-07-14 00:00:00",
State: 1,
Uncertainty: 1,
Unit: new Date(),
Value: props.cycleOptions,
Volume: 800,
save:["保存","删除"]
}
        };

        this.columns = [
          {
            title: '监测项目',
            dataIndex: 'PollutantName',
            key: 'PollutantName',
            align: 'center',
            render: (value,row) => {
                if(value instanceof Array){
               return <DropDownSelect
               ispollutant = {1}
               optiondatas={value}
               defaultValue={value[0].PollutantCode}
               onChange={this.handlePollutantChange} //父组件事件回调子组件的值
           />
                }else{
                return <span>{value}</span>
                }
            }
            
          },
          {
            title: '质控周期',
            dataIndex: 'SpaceName',
            key: 'SpaceName',
            align: 'center',
            render: (values,row) => {
              console.log(values)
              if(values instanceof Array){
              
             return   <DropDownSelect  optiondatas={values}/>
              }else{
              return <span>{values}</span>
              }
          }
          },
          {
            title: '质控时间',
            dataIndex: 'Time',
            key: 'Time',
            align: 'center',
            render: (value,row) => {
              console.log(value)
              console.log(value instanceof Date)
              if(value instanceof Date){
                return  <TimePicker defaultValue={moment(moment(value), 'HH:mm')} format="HH:mm" allowClear={false} />
              }else{
              return <span>{value}</span>
              }
          }
          },
          {
            title: '提交人',
            dataIndex: 'CreatorName',
            key: 'CreatorName',
            align: 'center',
            width:120
          },
          {
            title: '提交时间',
            dataIndex: 'CreatorDate',
            key: 'CreatorDate',
            align: 'center'
          },
          {
            title: '状态',
            dataIndex: 'ApproveState',
            key: 'ApproveState',
            align: 'center',
            render: text => <>{text == 2?  <span style={{color:green.primary}}>已下发</span> : <span style={{color:red.primary}}>已保存</span> }</>,
          },
          {
            title: '操作',
            dataIndex: 'save',
            key: 'save',
            align: 'center',
            render: (value,row) => {
              if(value){
                return  <TimePicker defaultValue={moment(moment(value), 'HH:mm')} format="HH:mm" allowClear={false} />
              }else{
              return <span>{value}</span>
              }
          }
          },
        ];
        
    }

    
    static getDerivedStateFromProps(props, state) {
     
      if (props.pollutantlist !== state.addItem.PollutantName) {
        return {
          addItem: {...state.addItem,PollutantName:props.pollutantlist}
        };
      }
      return null;

    }
  handlePollutantChange=(e)=>{
    console.log(e)
  }



  addClick=()=>{
    const {addItem} = this.state;
    this.setState(prevState => ({tableDatas: [...prevState.tableDatas, prevState.addItem]}))
  }
  render() {

    const {tableLoading,total,cycleListParams} = this.props;
    const {tableDatas} = this.state;
    return (

<div id="zeroPointData">
        <Card title={ <QueryForm addClick={this.addClick} queryClick={this.queryClick} defaulltVal={this.defaulltVal}/>} >
           <SdlTable
              rowKey={(record, index) => `complete${index}`}
              dataSource={tableDatas}
              columns={this.columns}
              resizable
              defaultWidth={80}
              scroll={{ y: this.props.tableHeight || undefined}}
              loading={tableLoading}
              pagination={{total:total, showSizeChanger:true , showQuickJumper:true }}
          /> 
        </Card>
     </div>);
  }
}

export default TableData;