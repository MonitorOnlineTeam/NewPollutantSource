


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,TimePicker} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import QueryForm from '../../components/QueryForm'
import { green } from '@ant-design/colors';
import DropDownSelect from '@/components/DropDownSelect'
/**
 *  质控核查 零点核查
 * jab 2020.08.18
 */





@connect(({ zeroPointSet,qualitySet,pollutantListData }) => ({
    tableDatas:zeroPointSet.tableDatas,
    pollutantlist:pollutantListData.pollutantlist,
    cycleOptions:qualitySet.cycleOptions
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
            dataIndex: 'Value',
            key: 'Value',
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
            dataIndex: 'Unit',
            key: 'Unit',
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
            align: 'center'
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
            title: '操作',
            dataIndex: 'save',
            key: 'save',
            align: 'center',
            render: (value,row) => {
              console.log(value)
              console.log(value == true)
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
        console.log(props.cycleOptions)

        return {
          addItem: {...state.addItem,PollutantName:props.pollutantlist}
        };
      }
      return null;

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
            DGIMNs:dgimn
          }
           dispatch({
              type: 'standardData/updateState',
              payload: { ...standardParams  },
          });
          this.onFinish();
          
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

  handlePollutantChange=(e)=>{
    console.log(e)
  }


  queryClick = () =>{
    alert("查询")
  }
  addClick=()=>{
    const {addItem} = this.state;


    // console.log(tableDatas)
    // let tableDatas =  [];

    // this.setState({tableDatas:tableDatas})
    this.setState(prevState => ({tableDatas: [...prevState.tableDatas, prevState.addItem]}))
  }
  render() {

    const {tableLoading,total} = this.props;
    const {tableDatas} = this.state;
    return (

<div id="zeroPointData">
        <Card title={<QueryForm addClick={this.addClick} queryClick={this.queryClick}/>} >
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