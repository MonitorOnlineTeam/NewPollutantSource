/**
 * 功  能：设备交接资料管理
 * 创建人：贾安波
 * 创建时间：2021.12.14
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload,Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Tabs   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,UploadOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "./style.less"
import Cookie from 'js-cookie';
import NavigationTree from '@/components/NavigationTree'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import PageLoading from '@/components/PageLoading'
import { handleFormData } from '@/utils/utils';
import cuid from 'cuid';
const { Option } = Select;

const namespace = 'equiptmentHandManager'

const { TabPane } = Tabs;


const dvaPropsData =  ({ loading,equiptmentHandManager }) => ({
  saveLoading: loading.effects['autoForm/add'] || loading.effects['autoForm/saveEdit'],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getPageConfig1:(payload)=>{ //设备运营接手资料
      dispatch({
        type: 'autoForm/getPageConfig',
        payload:{configId:'EquipmentHandoverData1'}
     })
    },
    getPageConfig2:(payload)=>{ //设备移交资料
      dispatch({
        type: 'autoForm/getPageConfig',
        payload:{configId:'EquipmentHandoverData2'}
     })
    },
    getPageConfig3:(payload)=>{ //接手时标准物质信息
      dispatch({
        type: 'autoForm/getPageConfig',
        payload:{configId:'EquipmentHandoverData3'}
     })
    },
    autoFormAdd:(payload)=>{ //添加
      dispatch({
        type: 'autoForm/add',
        payload: payload
      });
    },
    autoFormEdit:(payload)=>{ //编辑
      dispatch({
        type: 'autoForm/saveEdit',
        payload: payload
      });
    },
    getAutoFormData:(payload)=>{ //查询
      dispatch({
        type: 'autoForm/getAutoFormData',
        payload: payload
      });
    },
    getAttachmentLists:(payload,callback)=>{ //查看照片
      dispatch({
        type: "autoForm/getAttachmentLists",
        payload: payload,
        callback:callback
      })
    },
    deleteAttach: (file)=>{ //删除照片
      dispatch({
        type: "autoForm/deleteAttach",
        payload: {
          FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
          Guid: file.response && file.response.Datas ? file.response.Datas : file.name,
        }
      })
    },
  }
}
const Index = (props) => {




  const [loading,setLoading] = useState(false)
  
  useEffect(() => {
    reloadPage();
  
  },[]);



  
  const reloadPage = configId => {
     props.getPageConfig1()
     props.getPageConfig2()
     props.getPageConfig3()
}
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();

  const  [title,setTitle] = useState()
  const  [dgimn,setDgimn] = useState()



  const changeDgimn = (val) =>{
    setTitle(val[0].entName)
    setDgimn(val[0].key)
  }


  const autoFormAddEditPar = (values) =>{

    let configId = visible1? "EquipmentHandoverData1" : visible2? "EquipmentHandoverData2" : "EquipmentHandoverData3"
    return {
      configId: configId,
      FormData: {
        ...values, 
        "DGIMN":dgimn,
        "EffectiveDate":moment(values["EffectiveDate"]).format('YYYY-MM-DD'),
        "CreateTime":moment().format('YYYY-MM-DD HH:mm:ss'),
        "DateTimeShort":moment(values["DateTimeShort"]).format('YYYY-MM-DD'),
      },
      searchParams:[{
        Key: 'dbo.T_Bas_EquipmentHandoverData.DGIMN',
        Value: `${dgimn}`,
        Where: '$=',
       }],
      callback: (res) => {
        if (res.IsSuccess) {
          setVisible1(false)
          setVisible2(false)
          setVisible3(false)
          typeName=='编辑'? props.getAutoFormData({
            configId: configId,
            searchParams:[{
              Key: 'dbo.T_Bas_EquipmentHandoverData.DGIMN',
              Value: `${dgimn}`,
              Where: '$=',
             }],
          }) : null;
        
        }
      }
    }
  }

  const [filesCuid,setFilesCuid]= useState()
  const onFinish1  = async () =>{  //添加 设备运营接手资料
    form1.setFieldsValue({ "Files":filesCuid} )
    try {
      const values = await form1.validateFields();
      typeName==='添加'? props.autoFormAdd(autoFormAddEditPar(values)) : props.autoFormEdit(autoFormAddEditPar(values))
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const onFinish3  = async () =>{  //添加  标准物质
    try {
      const values = await form3.validateFields();
      typeName==='添加'? props.autoFormAdd(autoFormAddEditPar(values)) : props.autoFormEdit(autoFormAddEditPar(values))
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }


  const onFinish2  = async () =>{  //添加 备移交资料
    form2.setFieldsValue({ "Files":filesCuid} )
    try {
      const values = await form2.validateFields();
      typeName==='添加'? props.autoFormAdd(autoFormAddEditPar(values)) : props.autoFormEdit(autoFormAddEditPar(values))
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const  [visible1,setVisible1] = useState(false)
  const  [visible2,setVisible2] = useState(false)
  const  [visible3,setVisible3] = useState(false)



  const [fileList,setFileList] = useState([])
  const uploadProps = { // 设备运营接手资料  资料附件上传 
    action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
    data:{
      FileUuid: filesCuid,
      FileActualType: '0',
    },
    onChange(info) {
      setFileList(info.fileList)
    if (info.file.status === 'error') {
      message.error('上传文件失败！')
    }
    },
    onRemove: (file)=>{
        if (!file.error) {
          props.deleteAttach(file)
        }

    },
    fileList:fileList
  };
  const [typeName,setTypeName] = useState('添加')
  const add1 = ()=>{
      setVisible1(true)
      setTypeName('添加')
      form1.resetFields();
      form1.setFieldsValue({"Files":''})
      setFileList([])
      setFilesCuid(cuid())
  }
  const edit1 = (record) =>{
    setVisible1(true)
    setTypeName('编辑')
   
    const files = record["dbo.T_Bas_EquipmentHandoverData.Files"];
    if(files){
        const  FilesID = files.split("|")[files.split("|").length-2]    
        props.getAttachmentLists({FileUuid:FilesID},(fileList)=>{ setFileList(fileList);setFilesCuid(FilesID)}) 
    }else{
      setFilesCuid(cuid())
      setFileList([])
    }
    form1.setFieldsValue({
      CreateTime:moment(record["dbo.T_Bas_EquipmentHandoverData.CreateTime"]),
      CreateUserId:record["dbo.T_Bas_EquipmentHandoverData.CreateUserId"],
      DateTimeShort:moment(record["dbo.T_Bas_EquipmentHandoverData.DateTimeShort"]),
      Name:record["dbo.T_Bas_EquipmentHandoverData.Name"],
      Remark:record["dbo.T_Bas_EquipmentHandoverData.Remark"],
      ID:record["dbo.T_Bas_EquipmentHandoverData.ID"]
    })
  }

  const add3 = ()=>{
    setVisible3(true)
    setTypeName('添加')
    form3.resetFields();
}
const edit3 = (record) =>{
  setVisible3(true)
  setTypeName('编辑')
  const files = record["dbo.T_Bas_EquipmentHandoverData.Files"];
  if(files){
      const  FilesID = files.split("|")[files.split("|").length-2]    
      props.getAttachmentLists({FileUuid:FilesID},(fileList)=>{ setFileList(fileList);setFilesCuid(FilesID)}) 
  }else{
    setFilesCuid(cuid())
    setFileList([])
  }
  form3.setFieldsValue({
    CreateTime:moment(record["dbo.T_Bas_EquipmentHandoverData.CreateTime"]),
    CreateUserId:record["dbo.T_Bas_EquipmentHandoverData.CreateUserId"],
    DateTimeShort:moment(record["dbo.T_Bas_EquipmentHandoverData.DateTimeShort"]),
    EffectiveDate:moment(record["dbo.T_Bas_EquipmentHandoverData.EffectiveDate"]),
    Name:record["dbo.T_Bas_EquipmentHandoverData.Name"],
    Remark:record["dbo.T_Bas_EquipmentHandoverData.Remark"],
    ID:record["dbo.T_Bas_EquipmentHandoverData.ID"]
  })
}

const add2 = ()=>{
  setVisible2(true)
  setTypeName('添加')
  form2.resetFields();
  form2.setFieldsValue({"Files":''})
  setFileList([])
  setFilesCuid(cuid())
}
const edit2 = (record) =>{
setVisible2(true)
setTypeName('编辑')

const files = record["dbo.T_Bas_EquipmentHandoverData.Files"];
if(files){
    const  FilesID = files.split("|")[files.split("|").length-2]    
    props.getAttachmentLists({FileUuid:FilesID},(fileList)=>{ setFileList(fileList);setFilesCuid(FilesID)}) 
}else{
  setFilesCuid(cuid())
  setFileList([])
}
form2.setFieldsValue({
  CreateTime:moment(record["dbo.T_Bas_EquipmentHandoverData.CreateTime"]),
  CreateUserId:record["dbo.T_Bas_EquipmentHandoverData.CreateUserId"],
  DateTimeShort:moment(record["dbo.T_Bas_EquipmentHandoverData.DateTimeShort"]),
  Name:record["dbo.T_Bas_EquipmentHandoverData.Name"],
  Remark:record["dbo.T_Bas_EquipmentHandoverData.Remark"],
  ID:record["dbo.T_Bas_EquipmentHandoverData.ID"]
})
}

const userCookie = Cookie.get('currentUser');
let userId = '';
if (userCookie) {
  userId = JSON.parse(userCookie).User_ID;
}

const {saveLoading } = props;
  return (
    <div id="dataquery"  className={styles.equiptmentHandManagerSty}>
    <BreadcrumbWrapper>
           {
                dgimn ?
                <div>
                   <Card title=''>
             <Tabs
                defaultActiveKey="1"
                onChange={key => {
                  // this.tabsChange(key);
                }}
              >
                <TabPane tab="设备运营接手资料" key="1">
                <AutoFormTable 
                            style={{ marginTop: 10 }}
                            // loading={}
                            configId={'EquipmentHandoverData1'}
                            onAdd={add1}
                            onEdit={(record, key) => {
                               edit1(record, key)
                            }}
                            searchParams={[{
                                    Key: 'DGIMN',
                                    Value: `${dgimn}`,
                                    Where: '$=',
                                },
                            ]}
                            isCenter
                        />
                </TabPane>
                <TabPane tab="接手时标准物质信息" key="2">
                <AutoFormTable 
                        style={{ marginTop: 10 }}
                        configId={'EquipmentHandoverData3'}
                        searchParams={[{
                          Key: 'dbo.T_Bas_EquipmentHandoverData.DGIMN',
                          Value: `${dgimn}`,
                          Where: '$=',
                         },
                     ]}
                     onAdd={add3}
                     onEdit={(record, key) => {
                        edit3(record, key)
                     }}
                     isCenter
                    />
                </TabPane>
                <TabPane tab="设备移交资料" key="3">
                <AutoFormTable 
                    style={{ marginTop: 10 }}
                    configId={'EquipmentHandoverData2'}
                    searchParams={[{
                      Key: 'dbo.T_Bas_EquipmentHandoverData.DGIMN',
                      Value: `${dgimn}`,
                      Where: '$=',
                   },
                 ]}
                 onAdd={add2}
                 onEdit={(record, key) => {
                    edit2(record, key)
                 }}
                 isCenter
                />
                </TabPane>
                </Tabs>
                </Card>
                </div>
                   : <PageLoading />
                    }   
                   <NavigationTree pageType='history' polShow={true} type='ent' runState='1' domId="#dataquery" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        changeDgimn(value)
                    }
                }} />
   </BreadcrumbWrapper>
   <Modal
        title={`设备运营接手资料 - ${typeName}`}
        visible={visible1}
        onCancel={() => {
          setVisible1(false)
        }}
        onOk={onFinish1}
        wrapClassName={styles['equiptmentHandModalSty']}
        width={'40%'}
        centered
        confirmLoading={saveLoading}
      >
        <Form
           form={form1}
           name="advanced_search1"
           className={styles['ant-advanced-search-form']}
           initialValues={{
            CreateUserId:userId,
            CreateTime:moment(),
          }}
        >  
          <Form.Item   name='Name' label='移交资料名称'>
            <Input placeholder="请输入移交资料名称" />
          </Form.Item>
          <Form.Item   name='Files' label='资料附件'>
           <Upload {...uploadProps} style={{width:'100%'}}>
                <Button icon={<UploadOutlined />}>支持附件，支持图片、文档、压缩文件格式</Button>
            </Upload>
          </Form.Item>
          <Form.Item   name='DateTimeShort' label='接手日期'>
            <DatePicker style={{width:'100%'}} />
          </Form.Item>
          <Form.Item   name='Remark' label='备注'>
            <Input placeholder="请输入备注" />
          </Form.Item>
          <Form.Item hidden  name='CreateUserId' label='创建人'>
            <Input/>
          </Form.Item>
          <Form.Item hidden  name='CreateTime' label='创建时间'>
            <Input />
          </Form.Item>
          <Form.Item hidden  name='ID' label='主键ID'>
            <Input  />
          </Form.Item>
  </Form>
        </Modal>

        <Modal
        title={`接手标准物质信息-${typeName}`}
        visible={visible3}
        onCancel={() => {
          setVisible3(false)
        }}
        onOk={onFinish3}
        wrapClassName={styles['equiptmentHandModalSty']}
        width={'40%'}
        centered
        confirmLoading={saveLoading}
      >
        <Form
           form={form3}
           name="advanced_search1"
           className={styles['ant-advanced-search-form']}
           initialValues={{
            CreateUserId:userId,
            CreateTime:moment(),
          }}
        >  
          <Form.Item   name='Name' label='标准物质种类'>
            <Input placeholder="请输入标准物质种类" />
          </Form.Item>
          <Form.Item   name='DateTimeShort' label='最近更换日期'>
            <DatePicker style={{width:'100%'}} />
          </Form.Item>
          <Form.Item   name='EffectiveDate' label='有效期'>
            <DatePicker style={{width:'100%'}} />
          </Form.Item>
          <Form.Item   name='Remark' label='备注'>
            <Input placeholder="请输入备注" />
          </Form.Item>
          <Form.Item hidden  name='CreateUserId' label='创建人'>
            <Input/>
          </Form.Item>
          <Form.Item hidden  name='CreateTime' label='创建时间'>
            <Input />
          </Form.Item>
          <Form.Item hidden  name='ID' label='主键ID'>
            <Input  />
          </Form.Item>
      </Form>
        </Modal>

        <Modal
        title={`设备移交资料-${typeName}`}
        visible={visible2}
        onCancel={() => {
          setVisible2(false)
        }}
        onOk={onFinish2}
        wrapClassName={styles['equiptmentHandModalSty']}
        width={'40%'}
        centered
        confirmLoading={saveLoading}
      >
        <Form
           form={form2}
           name="advanced_search1"
           className={styles['ant-advanced-search-form']}
           initialValues={{
            CreateUserId:userId,
            CreateTime:moment(),
          }}
        >  
          <Form.Item   name='Name' label='移交资料名称'>
            <Input placeholder="请输入移交资料名称" />
          </Form.Item>
          <Form.Item   name='Files' label='资料附件'>
           <Upload {...uploadProps} style={{width:'100%'}}>
                <Button icon={<UploadOutlined />}>支持附件，支持图片、文档、压缩文件格式</Button>
            </Upload>
          </Form.Item>
          <Form.Item   name='DateTimeShort' label='移交日期'>
            <DatePicker style={{width:'100%'}}  />
          </Form.Item>
          <Form.Item   name='Remark' label='备注'>
            <Input placeholder="请输入备注" />
          </Form.Item>
          <Form.Item hidden  name='CreateUserId' label='创建人'>
            <Input/>
          </Form.Item>
          <Form.Item hidden  name='CreateTime' label='创建时间'>
            <Input />
          </Form.Item>
          <Form.Item hidden  name='ID' label='主键ID'>
            <Input  />
          </Form.Item>
  </Form>
        </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);