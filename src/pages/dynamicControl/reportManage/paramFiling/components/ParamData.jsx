


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
    getParaCodeList:paramsfil.getParaCodeList
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
       editingKey:"",
       selectPollutant:"",
       selectParaName:"",
       editSelectIndex:"",
        };
        this.columns = [
          
          {
            title: '仪器',
            dataIndex: 'PollutantName',
            key: 'PollutantName',
            align: 'center',
            render: (value,row,index) => {

                if(value instanceof Array){
                  const {editingKey} = this.state;
                  const {addParams} = this.props;
                  const items = value.find(item =>  item.value === addParams.PollutantCode);
               return <DropDownSelect
               optiondatas={value}
               defaultValue={editingKey? items.value :value[0].value}
               onChange={this.handlePollutantChange.bind(this,index)} //父组件事件回调子组件的值
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
            render: (value,row,index) => {
              if(value instanceof Array){
                const {editingKey} = this.state;
                const {addParams} = this.props;
                const items = value.find(item => addParams.ParaCode === item.ParaCode);
                // console.log(items)
              return  <Select showSearch value={editingKey? items.ParaCode :value[0].ParaCode} onChange={this.paraNameChange.bind(this,index)}>
                    {
                     this.getParaCodeOption()
                    }
                    </Select>
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
            width:150,
            render: (value,row) => {
              if(value instanceof Array){
                 if(row.TopLimit||row.TopLimit===0){

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
                            <Form.Item style={{marginBottom:0}} name='lowLimit' rules={[{ required: true, message: '请输入备案值' }]}>
                             <InputNumber style={{width:70}} min={0} max={99999} defaultValue={row.TopLimit} onChange={this.lowLimitChange} /> 
                            </Form.Item>
                            </Row>

                 }
              }else{
               return  row.TopLimit||row.TopLimit===0? <span>{`${value} ~ ${row.TopLimit}`}</span> : <span>{value}</span>
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

              const { editingKey } = this.state;

              if(value instanceof Array){
              //   value.map((item,index)=>{
              //     console.log(value)
              //   // return <Button type="link" onClick={this.isSave(item,index)}>{item}</Button>
              //   })
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
          addItem: {...state.addItem,ParaName:props.getParaCodeList},
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
      this.getParaCodeList()
    }
    getParaCodeOption=() => {
      const { getParaCodeList,ispollutant } = this.props;
      const res = [];
      if (getParaCodeList&&getParaCodeList.length>0) {
        getParaCodeList.map((item, key) => {
               res.push(<Option key={key} value={item.ParaCode} >{item.ParaName}</Option>);
            })
          }
          return res;
         
  }
    getParaCodeList=()=>{
      let {dispatch} = this.props;
       dispatch({
          type: 'paramsfil/getParaCodeList',
          payload: {}
      });
    }  

  handlePollutantChange=(index,value)=>{ //监测项目事件
    let {dispatch,pollutantlist,tableDatas,addParams} = this.props;
    // if( QCAType == 1030){
    //  let selectPoll = pollutantlist.filter(function (item,tableIndex) {
    //     return item.PollutantCode === value//返回你选中删除之外的所有数据
    //   })
    //   const selectData = [...tableDatas];
    //   const item = selectData[index];
    //   selectData.splice(index, 1, { ...item, Unit: selectPoll[0].Unit }); //替换
    //   dispatch({type: 'paramsfil/updateState',payload:{tableDatas:selectData} });
    
    // }
    addParams = {
      ...addParams,
      PollutantCode:value,
      ParaCode:"a01031"
   }
   dispatch({
     type: 'paramsfil/updateState',
     payload: { addParams  },
    });
  }
  paraNameChange=(index,value)=>{ //参数名称 事件
    const {dispatch,getParaCodeList,tableDatas} = this.props;
         let selectPoll = getParaCodeList.filter(function (item,tableIndex) {
          return item.ParaCode === value//返回你选中删除之外的所有数据
      })
      const selectData = [...tableDatas];
      const item = selectData[index];
      selectData.splice(index, 1, { ...item, Unit: selectPoll[0].Unit }); //替换
      dispatch({type: 'paramsfil/updateState',payload:{tableDatas:selectData} });
  }
  lowLimitChange=(value)=>{ //下限

  }
  topLimitChange=(value)=>{ //上限

  }
  cycleClick = (value) =>{ //质控周期事件

    let {dispatch,addParams} = this.props;
    addParams = {
      ...addParams,
      Space:value
   }
   dispatch({
    type: 'paramsfil/updateState',
    payload: { addParams },
});  
  }


  isSave=(row,name,index)=>{
    if(name==="取消"){
      let {dispatch,tableDatas,addParams,isSaveFlag} = this.props;
      let {editingKey,selectPollutant,selectParaName,editSelectIndex} = this.state;
       if(editingKey){ //编辑状态 
        const selectData = [...tableDatas];
        const item = selectData[editSelectIndex];
        selectData.splice(editSelectIndex, 1, { ...item, PollutantName:selectPollutant,ParaName:selectParaName,LowerLimit:row.LowerLimit[0],save:row.ApproveState }); //替换
        tableDatas = selectData;
          dispatch({
             type: 'paramsfil/updateState',
             payload:{tableDatas} ,
        });
        this.setState({ editingKey: "" });
       }else{
        tableDatas = tableDatas.filter(function (item,tableIndex) {
          return item.key !== row.key//返回你选中删除之外的所有数据
        })
        isSaveFlag = false;
        this.setState({ editingKey: "" });
        dispatch({
           type: 'paramsfil/updateState',
           payload:{tableDatas,isSaveFlag} ,
       });

       }

    }else{ //保存事件

      this.formRef.current.validateFields();
      const lowLimit = this.formRef.current.getFieldsValue().lowLimit;
      const topLimit = this.formRef.current.getFieldsValue().topLimit;
         if( row.TopLimit||row.TopLimit===0 ){
             if(lowLimit||lowLimit===0 &&topLimit||topLimit===0){

             }else{
               return false;
             }

         }else{
          if(lowLimit||lowLimit===0){
          
          }else{
            return false;
          }
         }
   
      
     
    }


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
   
    let {dispatch,tableDatas,isSaveFlag,addParams,getParaCodeList,pollutantlist} = this.props;
    let {addItem} = this.state;
    if(!isSaveFlag){
      this.setState({ editingKey: index + 1});

   this.setState({selectPollutant:row.PollutantName,selectParaName:row.ParaName})
    addParams = {
      ...addParams, ID:row.ID,DGIMN:row.DGIMN,InstrumentID:row.InstrumentID,PollutantCode:row.PollutantCode,ParaCode:row.ParaCode,Type:row.Type,
      LowerLimit:row.LowerLimit,TopLimit:row.TopLimit,DeleteMark:row.DeleteMark,Recordor:row.Recordor,RecordorID:row.RecordorID,RecordTime:row.RecordTime             
   }
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
               payload:{tableDatas,addParams} ,
          });
        }
    })


    }else{
      message.warning("请完成之前未保存的状态")
    }

    
  }
  issueClick=(row,value,index)=>{ //下发
    let {dispatch,tableDatas} = this.props;
    
     
     dispatch({
        type: 'paramsfil/issueMessage',
        // payload: { ...ID  },
        callback:()=>{
          // this.reloadList();
          const selectData = [...tableDatas];
          const item = selectData[index];
          selectData.splice(index, 1, { ...item, ApproveState:2 }); //替换
          dispatch({type: 'paramsfil/updateState',payload:{tableDatas:selectData} });
        }
    });
  }
  addClick=()=>{

    
    let {addItem,standDefaultVal,configInfo,editingKey} = this.state;
    
    let {dispatch,tableDatas,count,instruListParams:{QCAType},isSaveFlag,addParams} = this.props;
     if(!isSaveFlag && !editingKey){
      addItem = {...addItem,key:count} ;
      count+=1;
      tableDatas = [
      ...tableDatas,
      addItem
    ]
    addParams = {
      ...addParams,
   }
   this.formRef.current.setFieldsValue({  lowLimit: "" ,topLimit: ""});
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
        type: 'paramsfil/getCycleQualityControlList',
        payload: { ...instruListParams  },
    });
  }
  render() {

    const {tableLoading,total,tableDatas} = this.props;
    return (

<div id="">
        <Card title={ <QueryForm addClick={this.addClick} queryClick={this.queryClick} defaulltVal={this.defaulltVal}/>} >
        <Form  ref={this.formRef} component={false}>
           <SdlTable
              rowKey={(record, index) => `complete${index}`}
              dataSource={tableDatas}
              columns={this.columns}
              resizable
              defaultWidth={80}
              scroll={{ y: this.props.tableHeight || undefined}}
              loading={tableLoading}
              pagination={{total:total, showSizeChanger:true , showQuickJumper:true,pageSize: 20 }}
          /> 
          </Form>
        </Card>
        
     </div>);
  }
}

export default Index;