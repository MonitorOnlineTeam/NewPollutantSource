/**
 * 功  能：设备交接资料管理
 * 创建人：贾安波
 * 创建时间：2021.12.14
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload,Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker   } from 'antd';
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

const { Option } = Select;

const namespace = 'equiptmentHandManager'




const dvaPropsData =  ({ loading,equiptmentHandManager }) => ({

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
  const onFinish1  = async () =>{  //查询 设备运营接手资料
    try {
      const values = await form1.validateFields();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const onFinish3  = async () =>{  //查询  标准物质
    try {
      const values = await form1.validateFields();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const  [visible1,setVisible1] = useState(false)
  const  [visible2,setVisible2] = useState(false)
  const  [visible3,setVisible3] = useState(false)
  const uploadProps1 = { // 设备运营接手资料  资料附件上传 
    action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
    // data:{
    //   FileUuid: this.state.uidGas,
    //   FileActualType: '0',
    // },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove: (file)=>{
        if (!file.error) {
          this.props.dispatch({
            type: "autoForm/deleteAttach",
            payload: {
              FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
              Guid: file.response && file.response.Datas ? file.response.Datas : file.name,
            }
          })
        }

    }
  };
  return (
    <div id="dataquery"  className={styles.equiptmentHandManagerSty}>
    <BreadcrumbWrapper>
           {
                dgimn ?
                <div>
                     <Card title='设备运营接手资料'>
                     <AutoFormTable 
                            style={{ marginTop: 10 }}
                            configId={'EquipmentHandoverData1'}
                            onAdd={() => {
                              setVisible1(true)
                            }}
                            searchParams={[{
                                    Key: 'dbo.T_Bas_EquipmentHandoverData.DGIMN',
                                    Value: `${dgimn}`,
                                    Where: '$=',
                                },
                            ]}
                        />
                        </Card>
                        <Card title='接手时标准物质信息'>
                        <AutoFormTable 
                        style={{ marginTop: 10 }}
                        configId={'EquipmentHandoverData3'}
                        searchParams={[{
                          Key: 'dbo.T_Bas_EquipmentHandoverData.DGIMN',
                          Value: `${dgimn}`,
                          Where: '$=',
                         },
                     ]}
                        onAdd={() => {
                          setVisible3(true)
                        }}
                    />
                    </Card>
                    <Card title='设备移交资料'>
                    <AutoFormTable 
                    style={{ marginTop: 10 }}
                    configId={'EquipmentHandoverData2'}
                    searchParams={[{
                      Key: 'dbo.T_Bas_EquipmentHandoverData.DGIMN',
                      Value: `${dgimn}`,
                      Where: '$=',
                   },
                 ]}
                    onAdd={() => {
                      // router.push('/rolesmanager/user/userinfoadd?tabName=用户管理 - 添加');
                    }}
                />
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
        title="设备运营接手资料-添加"
        visible={visible1}
        onCancel={() => {
          setVisible1(false)
        }}
        onOk={onFinish1}
        wrapClassName={styles['equiptmentHandModalSty']}
        width={'40%'}
        centered
      >
        <Form
           form={form1}
           name="advanced_search1"
           className={styles['ant-advanced-search-form']}
        >  
          <Form.Item   name='ProjectName1' label='接手资料名称'>
            <Input placeholder="请输入接手资料名称" />
          </Form.Item>
          <Form.Item   name='ProjectName3' label='资料附件'>
           <Upload {...uploadProps1} style={{width:'100%'}}>
                <Button icon={<UploadOutlined />}>支持附件，支持图片、文档、压缩文件格式</Button>
            </Upload>
          </Form.Item>
          <Form.Item   name='ProjectName4' label='接手日期'>
            <DatePicker style={{width:'100%'}} showTime />
          </Form.Item>
          <Form.Item   name='ProjectName5' label='备注'>
            <Input placeholder="请输入备注" />
          </Form.Item>
  </Form>
        </Modal>

        <Modal
        title="接手标准物质信息-添加"
        visible={visible3}
        onCancel={() => {
          setVisible3(false)
        }}
        onOk={onFinish3}
        wrapClassName={styles['equiptmentHandModalSty']}
        width={'40%'}
        centered
      >
        <Form
           form={form3}
           name="advanced_search1"
           className={styles['ant-advanced-search-form']}
        >  
          <Form.Item   name='ProjectName1' label='标准物质种类'>
            <Input placeholder="请输入标准物质种类" />
          </Form.Item>
          <Form.Item   name='ProjectName4' label='最近更换日期'>
            <DatePicker style={{width:'100%'}} />
          </Form.Item>
          <Form.Item   name='ProjectName5' label='有效期'>
            <DatePicker style={{width:'100%'}} />
          </Form.Item>
      </Form>
        </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);