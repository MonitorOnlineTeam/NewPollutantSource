


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,TimePicker,Popconfirm,message,InputNumber } from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import QueryForm from './QueryForm'
import { green,red } from '@ant-design/colors';
import DropDownSelect from '@/components/DropDownSelect'


/**
 *  质控核查 零点核查
 * jab 2020.08.18
 */





@connect(({ qualitySet,pollutantListData}) => ({
    cycleOptions:qualitySet.cycleOptions,
    cycleListParams:qualitySet.cycleListParams,
    tableDatas:qualitySet.tableDatas,
    pollutantlist:pollutantListData.pollutantlist,
    tableLoading:qualitySet.tableLoading,
    count:qualitySet.count,
    isSaveFlag:qualitySet.isSaveFlag,
    addParams:qualitySet.addParams,
    // total: standardData.total,
    // tablewidth: standardData.tablewidth,
    // tableLoading:standardData.tableLoading,
    // standardParams:standardData.standardParams,
    // dgimn:standardData.dgimn
}))

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        tableDatas:[],
        columns:[],
        // Time: [ moment(new Date()).add(-1, 'month'), moment(new Date())],
        addItem : {
        ID:0,
        PollutantName:"",
        SpaceName:  props.cycleOptions,
        Time: new Date(),
        CreatorName: "王大壮",
        CreatorDate: new Date(),
        ApproveState: "-",
        save:["保存","取消"]
       },
        blindAddItem:{ StandardValue: "添加标准值",Unit:"" }
        };
        // props.cycleListParams === 1030 ?
        this.blindCol =[
          {
            title: '标准气浓度',
            dataIndex: 'StandardValue',
            key: 'StandardValue',
            align: 'center',
            width:110,
            render: (value,row) => {
              if(value==="添加标准值"){
               return <InputNumber min={0} max={100000}  onChange={this.standChange} />
              }else{
                return <span>{value}</span>
              }
           } 
         },
         {
          title: '单位',
          dataIndex: 'Unit',
          key: 'Unit',
          align: 'center'
       }
        ]
        this.columns = [
          
          {
            title: '监测项目',
            dataIndex: 'PollutantName',
            key: 'PollutantName',
            align: 'center',
            render: (value,row,index) => {
                if(value instanceof Array){
               return <DropDownSelect
               ispollutant = {1}
               optiondatas={value}
               defaultValue={value[0].PollutantCode}
               onChange={this.handlePollutantChange.bind(this,index)} //父组件事件回调子组件的值
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
            render: (value,row) => {
              if(value instanceof Array){
              
             return   <DropDownSelect  defaultValue={value[0].value} optiondatas={value}/>
              }else{
              return <span>{value}</span>
              }
          }
          },
          {
            title: '质控时间',
            dataIndex: 'Time',
            key: 'Time',
            align: 'center',
            render: (value,row) => {
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
            align: 'center',
            render: (value,row) => {
              if(value instanceof Date){
                return  <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>
              }else{
              return <span>{value}</span>
              }
          }
          },
          {
            title: '状态',
            dataIndex: 'ApproveState',
            key: 'ApproveState',
            align: 'center',
            render: text => <>{ text == "-"?  <span>-</span> :text == 2?  <span style={{color:green.primary}}>已下发</span> : <span style={{color:red.primary}}>已保存</span>}</>,
          },
          {
            title: '操作',
            dataIndex: 'save',
            key: 'save',
            align: 'center',
            render: (value,row,index) => {
              if(value instanceof Array){
              //   value.map((item,index)=>{
              //     console.log(value)
              //   // return <Button type="link" onClick={this.isSave(item,index)}>{item}</Button>
              //   })
              return <div>
                  <Popconfirm title="即将下发命令到现场质控仪?" onConfirm={this.isSave.bind(this,row,value[0],index)}  >
                     <a >{value[0]}</a>
                     </Popconfirm>
                     <span> <a   onClick={this.isSave.bind(this,row,value[1],index)} href="#" style={{paddingLeft:10}} >{value[1]}</a> </span>
                 
                   </div>
              }else{
                 if(row.ApproveState ==2){
                     return <Popconfirm title="即将下发命令删除定时质控?" onConfirm={this.deleteClick.bind(this,row,index)}  ><a href="#" >删除</a>  </Popconfirm>
                 }else{
                  return <div> 
                             <Popconfirm title="即将下发命令到现场质控仪?" onConfirm={this.issueClick.bind(this,row,value)}  ><a  href="#" >下发</a>  </Popconfirm>
                            <Popconfirm title="即将下发命令删除定时质控?" onConfirm={this.deleteClick.bind(this,row,value)}  > <a href="#" style={{paddingLeft:10}}>删除</a> </Popconfirm>
                            </div>
                 }
              }
          }
          },
        ];
        
    }

    
    static getDerivedStateFromProps(props, state) {
     
      if (props.pollutantlist !== state.addItem.PollutantName && props.pollutantlist.length>0) {
        
        return {
          addItem: {...state.addItem,PollutantName:props.pollutantlist},
          blindAddItem:{...state.blindAddItem,Unit:props.pollutantlist[0].Unit}
        };
      }
      // if (props.tableDatas !== state.tableDatas) {
      
      //   return {
      //     tableDatas:state.tableDatas
      //   };
      // }
      return null;

    }
    componentDidMount(){
     this.isdBind();
    }

    
   isdBind=()=>{
      const {cycleListParams:{QCAType}} = this.props;
      if( QCAType == 1030){
        this.columns.splice(2,0,...this.blindCol)
      }
    }

  handlePollutantChange=(index,value)=>{
    let {dispatch,cycleListParams:{QCAType},pollutantlist,tableDatas} = this.props;
    if( QCAType == 1030){
     let selectPoll = pollutantlist.filter(function (item,tableIndex) {
        return item.PollutantCode === value//返回你选中删除之外的所有数据
      })
      console.log(selectPoll)
      const newData = [...tableDatas];
      const item = newData[index];
      newData.splice(index, 1, { ...item, Unit: selectPoll[0].Unit }); //替换
      dispatch({type: 'qualitySet/updateState',payload:{tableDatas:newData} });
    
    }
  }
  standChange=(value)=>{//标准气浓度

  }
  isSave=(row,name,index)=>{
    if(name==="取消"){
      let {dispatch,tableDatas,isSaveFlag} = this.props;
       tableDatas = tableDatas.filter(function (item,tableIndex) {
         return item.ID !== row.ID//返回你选中删除之外的所有数据
       })
       isSaveFlag = false;
       dispatch({
          type: 'qualitySet/updateState',
          payload:{tableDatas,isSaveFlag} ,
      });
    }else{ //保存事件
      // PollutantCode: "",
      // QCAType: "",
      // Time: "",
      // Date: "",
      // Space: "",
      // ApproveState: 1,
      // DeleteMark: 1,
      // Creator: "",
      // CreatorID: "",
      // CreatorDate: "",
      // StandardValue: ""
      console.log(row)
      let {dispatch,addParams} = this.props;
         addParams = {
          ...addParams
       }
       dispatch({
          type: 'qualitySet/addOrUpdCycleQualityControl',
          payload: { ...addParams  },
      });
    }


  }
  deleteClick=(row,value)=>{ //删除
    let {dispatch,cycleListParams} = this.props;
    cycleListParams = {
      ...cycleListParams,
      ID:row.ID
    }
     dispatch({
        type: 'qualitySet/deleteCycleQualityControlm',
        payload: { ...cycleListParams  },
    });
  }
  issueClick=(row,value)=>{ //下发
    let {dispatch,cycleListParams} = this.props;
    cycleListParams = {
      ...cycleListParams,
      ID:row.ID
    }
     dispatch({
        type: 'qualitySet/issueMessage',
        payload: { ...cycleListParams  },
    });
  }
  addClick=()=>{

    
    let {addItem,blindAddItem} = this.state;
    
    let {dispatch,tableDatas,count,cycleListParams:{QCAType},isSaveFlag} = this.props;
     if(!isSaveFlag){
     QCAType ==1030? addItem = {...addItem,ID:count,...blindAddItem} : addItem = {...addItem,ID:count} ;
     count+=1;
     tableDatas = [
      ...tableDatas,
      addItem
    ]
    isSaveFlag = true
     dispatch({
        type: 'qualitySet/updateState',
        payload:{tableDatas,count,isSaveFlag} ,
    });
  }else{
    message.warning("请保存之前的编辑状态")
  }
    
    // this.setState(prevState => ({tableDatas: [...prevState.tableDatas, prevState.addItem]}))
   
  }

  reloadList = () =>{ //查询

    let {dispatch,cycleListParams} = this.props;
    cycleListParams = {
      ...cycleListParams,
    }
     dispatch({
        type: 'qualitySet/getCycleQualityControlList',
        payload: { ...cycleListParams  },
    });
  }
  render() {

    const {tableLoading,total,tableDatas} = this.props;
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

export default Index;