


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,TimePicker,Popconfirm,message,InputNumber,Input, Select} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import QueryForm from './QueryForm'
import { green,red } from '@ant-design/colors';
import DropDownSelect from '@/components/DropDownSelect'
import Cookie from 'js-cookie';
import ConsumablesReplaceRecord from '@/pages/EmergencyTodoList/ConsumablesReplaceRecordContent';

/**
 *  质控核查 零点核查
 * jab 2020.08.18
 */





@connect(({ paramsfil}) => ({
    instruListParams:paramsfil.instruListParams,
    tableDatas:paramsfil.tableDatas,
    pollutantlist:paramsfil.pollutantlist,
    tableLoading:paramsfil.tableLoading,
    count:paramsfil.count,
    isSaveFlag:paramsfil.isSaveFlag,
    addParams:paramsfil.addParams,
    dgimn:paramsfil.dgimn,
    getParaCodeList:paramsfil.getParaCodeList,
    isParaCode:paramsfil.isParaCode,
    editingKey:paramsfil.editingKey
    // total: standardData.total,
    // tablewidth: standardData.tablewidth,
    // tableLoading:standardData.tableLoading,
    // standardParams:standardData.standardParams,
    // dgimn:standardData.dgimn
}))

class Index extends React.Component {
  formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
        tableDatas:[],
        columns:[],
        // Time: [ moment(new Date()).add(-1, 'month'), moment(new Date())],
        addItem : {
        key:0,
        PollutantName:props.pollutantlist,
        ParaName:props.getParaCodeList,
        LowerLimit:"",
        Unit:"",
        Recordor:JSON.parse(Cookie.get('currentUser')).UserName,
        RecordTime: new Date(),
        ApproveState: "-",
        LowerLimit:[],
        save:["保存","取消"]
       },
       selectPollutant:"",
       selectParaName:"",
       editSelectIndex:"",
       selectParaCode:"",
       pageSize:20,
       current:1,
        };
        this.columns = [
          
          {
            title: '仪器',
            dataIndex: 'PollutantName',
            key: 'PollutantName',
            align: 'center',
            width:100,
            render: (value,row,index) => {

                if(value instanceof Array){
                  const {addParams,editingKey} = this.props;
                  const items = value?value.find(item =>  item.code === `${addParams.PollutantCode}`) : null;
               return <DropDownSelect
               iscode={1}
               optiondatas={value}
               defaultValue={value? editingKey? items&&`${items.code}` || "" : value[0].code : null}
               onChange={this.handlePollutantChange.bind(this,row,index)} //父组件事件回调子组件的值
               />
                }else{
                  // return <span>{row.PollutantCode == "a34013"? "颗粒物分析仪" : `气态分析仪(${value})`}</span>
                  return <span>{value}</span>

                }
            }
            
          },
          {
            title: '参数名称',
            dataIndex: 'ParaName',
            key: 'ParaName',
            align: 'center',
            width:120,
            render: (value,row,index) => {
              if(value instanceof Array){
                
              return  <Select  style={{minWidth:100}} value ={this.state.selectParaCode} onChange={this.paraNameChange.bind(this,row,index)}>
                        {
                          this.getParaCodeOption()
                         }
                          </Select> 
                // <Row align='middle' justify='center'>
                 {/* <Form.Item style={{marginBottom:0,paddingRight:2}} name='paraName' rules={[{ required: true, message: '请选择参数名' }]}> */}
              

                    {/* </Form.Item> */}
                    //  </Row>
              }else{
              return <span>{value}</span>
              }
          }
          },
          {
            title: '备案值',
            dataIndex: 'LowerLimit',
            key: 'LowerLimit',
            align: 'center',
            width:175,
            render: (value,row) => {
              if(value instanceof Array){
                 if(row.Type==2){

                   return  <Row align='middle' justify='center'><Form.Item style={{marginBottom:0,paddingRight:2}} name='lowLimit' rules={[{ required: true, message: '请输入备案值' }]}>
                    <InputNumber style={{width:70}} min={0} max={99999} defaultValue={value} onChange={this.lowLimitChange} /> 
                    </Form.Item>
                        ~
                       <Form.Item style={{marginBottom:0,paddingLeft:2}} name='topLimit'  rules={[{ required: true, message: '请输入备案值' }]}>
                       <InputNumber style={{width:70}} min={0} max={99999} defaultValue={row.TopLimit} onChange={this.topLimitChange} /> 
                     </Form.Item>
                     </Row>
                 }else{
                    return   <Row align='middle' justify='center'>
                            <Form.Item style={{marginBottom:0}} name='lowLimits' rules={[{ required: true, message: '请输入备案值' }]}>
                             <InputNumber style={{width:70}} min={0} max={99999} defaultValue={row.TopLimit} onChange={this.lowLimitChange} /> 
                            </Form.Item>
                            </Row>

                 }
              }else{
               return row.Type==2? <span>{`${value} ~ ${row.TopLimit}`}</span> : <span>{value}</span>
              }
          }
          },
          {
            title: '单位',
            dataIndex: 'Unit',
            key: 'Unit',
            align: 'center',
          },
          {
            title: '备案人',
            dataIndex: 'Recordor',
            key: 'Recordor',
            align: 'center',
            width:120
          },
          {
            title: '备案时间',
            dataIndex: 'RecordTime',
            key: 'RecordTime',
            align: 'center',
            render: (value,row) => {
              if(value instanceof Date){
                return  <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>
              }else{
              return <span>{value}</span>
              }
          }
          },
          // {
          //   title: '测试',
          //   dataIndex: 'aa',
          //   key: 'aa',
          //   align: 'center',
          //   render: (value,row) => {
          //     if(value==="测试"){
          //       return  <Form.Item name='test' rules={[{ required: true, message: 'Please input your username!' }]}  >
          //                 <Input />
          //              </Form.Item>
        
          //     }else{
          //     return <span>{value}</span>
          //     }
          // }
          // },
          {
            title: '状态',
            dataIndex: 'ApproveState',
            key: 'ApproveState',
            align: 'center',
            render: text => <>{ text == "-"?  <span>-</span> :text == 1?  <span >已备案</span> : <span style={{color:red.primary}}>已保存</span>}</>,
          },
          {
            title: '操作',
            dataIndex: 'save',
            key: 'save',
            align: 'center',
            render: (value,row,index) => {

              const { editingKey } = this.props;

              if(value instanceof Array){
              return <div>
                  <Popconfirm title="确认保存此备案记录?" onConfirm={this.isSave.bind(this,row,value[0],index)}  >
                     <a >{value[0]}</a>
                     </Popconfirm>
                     <span> <a   onClick={this.isSave.bind(this,row,value[1],index)} href="#" style={{paddingLeft:10}} >{value[1]}</a> </span>
                 
                   </div>
              }else{
                 if(row.ApproveState ==1){
                     return <Popconfirm title="确认删除此备案记录?" onConfirm={this.deleteClick.bind(this,row,false)}  ><a href="#">删除</a>  </Popconfirm>
                 }else{
                  return <div> 
                            <a  href="#" disabled={editingKey !== ""} onClick={this.editClick.bind(this,row,value,index)} >编辑</a> 
                            <Popconfirm title="确认删除此备案记录?" onConfirm={this.deleteClick.bind(this,row,true)}  > <a href="#" style={{paddingLeft:10}}>删除</a> </Popconfirm>
                            </div>
                 }
              }
          }
          },
        ];
        
    }

    
    static getDerivedStateFromProps(props, state) {
     
      if (props.getParaCodeList !== state.addItem.ParaName && props.getParaCodeList.length>0) {
        
        return {
          addItem: {...state.addItem,ParaName:props.getParaCodeList,Unit:props.getParaCodeList[0].Unit,Type:props.getParaCodeList[0].Type},
        };
      }
      if (props.pollutantlist !== state.addItem.PollutantName && props.pollutantlist.length>0) {
        return {
          addItem: {...state.addItem,PollutantName:props.pollutantlist},
        };
      }

      // if (props.editingKey !== state.editingKey) {
        
      //   return {
      //     editingKey: props.editingKey,
      //   };
      // }
      // if (props.tableDatas !== state.tableDatas) {
      
      //   return {
      //     tableDatas:state.tableDatas
      //   };
      // }
      return null;

    }
    componentDidMount(){
      // this.getParaCodeList()
    }
    getParaCodeOption=() => {
      const { getParaCodeList } = this.props;
      const res = [];
      if (getParaCodeList&&getParaCodeList.length>0) {
        getParaCodeList.map((item, key) => {
               res.push(<Option key={key} value={item.ParaCode} >{item.ParaName}</Option>);
            })
          }
          return res;
         
  }
  
    // getParaPollutantCodeList=()=>{ //仪器列表
    //   let {dispatch} = this.props;
    //   dispatch({
    //      type: 'paramsfil/getParaPollutantCodeList',
    //      payload: {},
    //      callback:()=>{

    //      }
    //  });
    // }
  handlePollutantChange=(row,index,value)=>{ //仪器事件
    let {dispatch,pollutantlist,tableDatas,addParams,getParaCodeList,isParaCode} = this.props;
    dispatch({type: 'paramsfil/getParaCodeList',
      payload: {PollutantCode:value},
      callback:(res)=>{
        let getParaCodeList = res;
       this.setState({selectParaCode:getParaCodeList.length>0? getParaCodeList[0].ParaCode:null}) 

       tableDatas.filter(function (item,tableIndex) {
        if(item.ID === row.ID){
          const selectData = [...tableDatas];
          const item = selectData[tableIndex];
          selectData.splice(tableIndex, 1, { ...item, Unit:getParaCodeList.length>0? getParaCodeList[0].Unit :null,Type:getParaCodeList.length>0?getParaCodeList[0].Type:null }); //替换
  
          addParams = {
            ...addParams,
            PollutantCode:value,
            ParaCode: getParaCodeList.length>0? getParaCodeList[0].ParaCode:"",
            Unit: getParaCodeList.length>0?getParaCodeList[0].Unit:"",
            Type:getParaCodeList.length>0?getParaCodeList[0].Type:""
         }
          dispatch({type: 'paramsfil/updateState',payload:{tableDatas:selectData,addParams} });
        }  
      })
      }
    });




    
    

  }
  paraNameChange=(row,index,value)=>{ //参数名称 事件
    let {dispatch,getParaCodeList,tableDatas,addParams} = this.props;

      this.setState({selectParaCode:value}) 
      let selectPoll = getParaCodeList.filter(function (item,tableIndex) {
        return item.ParaCode === value//返回你选中删除之外的所有数据
      })



      tableDatas.filter(function (item,tableIndex) {
        if(item.ID === row.ID){
          const selectData = [...tableDatas];
          const item = selectData[tableIndex];
          selectData.splice(tableIndex, 1, { ...item, Unit: selectPoll[0].Unit,Type:selectPoll[0].Type }); //替换
          dispatch({type: 'paramsfil/updateState',payload:{tableDatas:selectData} });
        }  
      })
    
      addParams = {  ...addParams, ParaCode:value,Unit:selectPoll[0].Unit,Type:selectPoll[0].Type }
      dispatch({ type: 'paramsfil/updateState',  payload: { addParams } });
  }
  lowLimitChange=(value)=>{ //下限
    let {dispatch,addParams} = this.props;
    addParams = {
      ...addParams,
      LowerLimit:value
   }
   dispatch({
    type: 'paramsfil/updateState',
    payload: { addParams },
    });
  }
  topLimitChange=(value)=>{ //上限
    let {dispatch,addParams} = this.props;
    addParams = {
      ...addParams,
      TopLimit:value
   }
   dispatch({
    type: 'paramsfil/updateState',
    payload: { addParams },
    });

  }



  isSave=(row,name,index)=>{
    if(name==="取消"){
      let {dispatch,tableDatas,addParams,isSaveFlag,editingKey} = this.props;
      let {selectPollutant,selectParaName,editSelectIndex} = this.state;
       if(editingKey){ //编辑状态 
        const selectData = [...tableDatas];
        const item = selectData[editSelectIndex];
        selectData.splice(editSelectIndex, 1, { ...item, PollutantName:selectPollutant,ParaName:selectParaName,LowerLimit:row.LowerLimit[0],save:row.ApproveState }); //替换
        tableDatas = selectData;
        editingKey = ""
          dispatch({
             type: 'paramsfil/updateState',
             payload:{tableDatas,editingKey} ,
        });
       }else{
        tableDatas = tableDatas.filter(function (item,tableIndex) {
          return item.key !== row.key//返回你选中删除之外的所有数据
        })
        isSaveFlag = false;
        dispatch({
           type: 'paramsfil/updateState',
           payload:{tableDatas,isSaveFlag} ,
       });

       }

    }else{ //保存事件

      this.formRef.current.validateFields();
      const lowLimit = this.formRef.current.getFieldsValue().lowLimit;
      const topLimit = this.formRef.current.getFieldsValue().topLimit;
      const lowLimits = this.formRef.current.getFieldsValue().lowLimits;


         if( row.Type==2){ //备案值有两个时
             if(lowLimit||lowLimit===0 &&topLimit||topLimit===0){
                this.saveSubmit();
             }else{
               return false;
             }

         }else{
          if(lowLimits||lowLimits===0){
            this.saveSubmit();
          }else{
            return false;
          }
         }
   
      
     
    }


  }
 saveSubmit=()=>{ //提交添加 or 编辑
  let {dispatch,addParams} = this.props;
   dispatch({
      type: 'paramsfil/addOrUpdParameterFiling',
      payload: { ...addParams  },
      callback:()=>{
        this.reloadList();
      }
  });
 }

  deleteClick=(row,isDeleteTrue)=>{ //删除
    let {dispatch} = this.props;
    const parmas = { ID :row.ID,DGIMN: row.DGIMN,DeleteTrue:isDeleteTrue}
     dispatch({
        type: 'paramsfil/deleteParameterFiling',
        payload: { ...parmas  },
        callback:()=>{
          this.reloadList();
        }
    });
  }
  editClick=(row,value,index)=>{//编辑

    let {dispatch,tableDatas,isSaveFlag,addParams,getParaCodeList,pollutantlist,editingKey} = this.props;
    let {addItem} = this.state;
    if(!isSaveFlag){
      editingKey = index + 1;

      addParams = {
        ...addParams, ID:row.ID,DGIMN:row.DGIMN,InstrumentID:row.InstrumentID,PollutantCode:`${row.PollutantCode}^${row.InstrumentID}`,ParaCode:row.ParaCode,Type:row.Type,
        LowerLimit:row.LowerLimit,TopLimit:row.TopLimit,DeleteMark:row.DeleteMark,Recordor:row.Recordor,RecordorID:row.RecordorID,RecordTime:row.RecordTime             
     }

      dispatch({type: 'paramsfil/getParaCodeList',//参数列表请求
      payload: {PollutantCode:row.PollutantCode},
      callback:(res)=>{
        let getParaCodeList = res;
           this.setState({selectPollutant:row.PollutantCode,selectParaName:row.ParaName ,selectParaCode:row.ParaCode})
           
      }

    })

   


 

   this.formRef.current.setFieldsValue({  lowLimit: row.LowerLimit ,topLimit: row.TopLimit});
    const selectData = [...tableDatas];
    let _this = this;
     tableDatas = tableDatas.filter(function (item,tableIndex) {
        if(item.ID === row.ID){
          const item = selectData[tableIndex];
          _this.setState({editSelectIndex:tableIndex})
          selectData.splice(tableIndex, 1, { ...item, PollutantName:pollutantlist,ParaName:getParaCodeList,LowerLimit:[row.LowerLimit],save:addItem.save }); //替换
          tableDatas = selectData;
            dispatch({
               type: 'paramsfil/updateState',
               payload:{tableDatas,addParams,editingKey} ,
          });
        }
    })


    }else{
      message.warning("请完成之前未保存的状态")
    }

    
  }

  addClick=()=>{

    
    let {addItem,standDefaultVal,configInfo,current,pageSize} = this.state;
    
    let {dispatch,tableDatas,count,isSaveFlag,addParams,pollutantlist,getParaCodeList,dgimn,editingKey} = this.props;
     if(!isSaveFlag && !editingKey){


      addItem = {...addItem,key:count};
      count+=1;

     if(current===1){ //第一页时

      tableDatas = [
        addItem,
      ...tableDatas, 
      ]
     }else{
    const selectData = [...tableDatas];
          selectData.splice((current-1)*pageSize, 0, { ...addItem }); //替换
           tableDatas = selectData;
     }


     this.setState({selectParaCode:getParaCodeList[0].ParaCode})
    addParams = {
      ...addParams,
      ParaCode:getParaCodeList[0].ParaCode,
      Unit:getParaCodeList[0].Unit,
      PollutantCode:pollutantlist[0].code,
      DGIMN:dgimn,
      RecordTime:moment(addItem.RecordTime).format('YYYY-MM-DD HH:mm:ss'),
      ID:"",
      InstrumentID:""
   }
   this.formRef.current.setFieldsValue({  lowLimit: "" ,topLimit: "",lowLimits: "" });
    isSaveFlag = true
     dispatch({
        type: 'paramsfil/updateState',
        payload:{tableDatas,count,isSaveFlag,addParams} ,
    });


  }else{
    message.warning("请保存之前未保存的状态")
  }
    
    // this.setState(prevState => ({tableDatas: [...prevState.tableDatas, prevState.addItem]}))
   
  }

  reloadList = () =>{ //查询

    let {dispatch,instruListParams} = this.props;
     instruListParams = {
      ...instruListParams,
    }
     dispatch({
        type: 'paramsfil/getParameterFilingList',
        payload: { ...instruListParams  },
    });
  }
  keepRecordClick=()=>{ //备案
    let {dispatch,dgimn} = this.props;
    dispatch({
      type: 'paramsfil/updateApproveState',
      payload: { DGIMN : dgimn  },
      callback:()=>{
        this.reloadList();
      }
  });
  }


  changePageSize=(pageSize,current)=>{
     this.setState({pageSize})
  }
  changePage=(current)=>{ //跳转页数
   
    setTimeout(()=>{
      const {pageSize} = this.state
       this.setState({pageSize,current})
        
    })
  }
  render() {

    const {tableLoading,total,tableDatas} = this.props;
    return (

<div id="">
        <Card title={ <QueryForm addClick={this.addClick} queryClick={this.queryClick} keepRecordClick={this.keepRecordClick} defaulltVal={this.defaulltVal}/>} >
        <Form  ref={this.formRef} component={false}>
           <SdlTable
              rowKey={(record, index) => `complete${index}`}
              dataSource={tableDatas}
              columns={this.columns}
              resizable
              defaultWidth={80}
              scroll={{ y: this.props.tableHeight || undefined}}
              loading={tableLoading}
              
              pagination={{
                total:total, showSizeChanger:true , showQuickJumper:true,pageSize:this.state.pageSize,
                onShowSizeChange: (current,pageSize) => this.changePageSize(pageSize,current),
                onChange: (current) => this.changePage(current),          
              }}
          /> 
          </Form>
        </Card>
        
     </div>);
  }
}

export default Index;