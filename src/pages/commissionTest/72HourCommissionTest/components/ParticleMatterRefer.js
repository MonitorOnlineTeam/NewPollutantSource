/**
 * 功  能：颗粒物参比
 * 创建人：jab
 * 创建时间：2022.08.11
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography,TimePicker, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import BtnComponents from './BtnComponents'
const { TextArea } = Input;
const { Option } = Select;
import config from '@/config'
const namespace = 'hourCommissionTest'




const dvaPropsData = ({ loading, hourCommissionTest, commissionTest, }) => ({
    tableDatas: hourCommissionTest.particleMatterReferTableDatas,
    tableLoading: loading.effects[`${namespace}/addSystemModel`],
    tableTotal: hourCommissionTest.tableTotal,

})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        importData: (payload,callback) => { //导入
            dispatch({
                type: `${namespace}/importData`,
                payload: payload,
                callback:callback
            })
        },
    }
}
const Index = (props) => {



    const [form] = Form.useForm();



    const { pointId,tableDatas, tableTotal, tableLoading, } = props;
    const footData = [{evaluateTitle:'评价依据',evaluateData:'1111'}]

    
    useEffect(() => {
        console.log(pointId)
    }, [pointId]);
    const disabledDate = (current) => {
        return current && current > moment().endOf('year') || current < moment().startOf('year');
      };
     
    const [ autoDateFlag,setAutoDateFlag ] = useState(true)
    const onDateChange =  (type) =>{
        const values = form.getFieldValue('date0')
        if(type=='date0'&&autoDateFlag){
          form.setFieldsValue({
            date5: moment(moment(values).add('day',1)),
            date10:moment(moment(values).add('day',2)),
          })
          setAutoDateFlag(false)
        }
    }


    const columns = [
        {
            title: '日期',
            dataIndex: 'Num',
            key: 'Num',
            align: 'center',
            width:140,
            render: (text, record, index) => {
                 const number = index + 1 + 4; 
                 const obj = {
                  children: <Form.Item name={`date${index}`}   rules={[{ required: true, message:''}]}><DatePicker disabledDate={disabledDate} onChange={()=>onDateChange(`date${index}`)}  format="MM-DD"/></Form.Item>,
                  props: {rowSpan: number % 5 == 0 ? 5 : 0},
                };
                return obj;
              }
        },
        {
            title: '时间(时、分)',
            align: 'center',
            children:[
                {
                    title: '开始',
                    align: 'center',
                    width:140,
                    render: (text, record, index) => {
                       return <Form.Item name={`timeStart${index}`}   rules={[{ required: true, message:''}]}><TimePicker   defaultOpenValue={moment('00:00', 'HH:mm')} format = 'HH:mm'/></Form.Item>;
                     }
                },
                {
                    title: '结束',
                    align: 'center',
                    width:140,
                    render: (text, record, index) => {
                        return <Form.Item name={`timeEnd${index}`} rules={[{ required: true,message:'' }]}><TimePicker  defaultOpenValue={moment('00:00', 'HH:mm')} format = 'HH:mm'/></Form.Item>;
                      }
                },   
            ]
        },
        {
            title: '参比方法',
            align: 'center',
            children:[
                {
                    title: '序号',
                    align: 'center',
                    width:50,
                    render: (text, record, index) => {
                         return record;
                      }
                },
                {
                    title: '滤筒/滤膜编号',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`num${index}`}><Input  placeholder='请输入' /></Form.Item>;
                      }
                },   
                {
                    title: '颗粒物重(mg)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`weight${index}`}><Input  placeholder='请输入' /></Form.Item>;
                      }
                },
                {
                    title: '标况体积(NL)',
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`volume${index}`}><Input  placeholder='请输入' /></Form.Item>;
                      }
                },
                {
                    title: '标杆浓度(mg/m3)',
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`benchmarkConcentra${index}`}><Input  placeholder='请输入' /></Form.Item>;
                      }
                },
                {
                    title: '工况浓度(mg/m3)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`workConcentra${index}`}><Input  placeholder='请输入' /></Form.Item>;
                      }
                },       
            ]
        },
        {
            title: 'CEMS法',
            align: 'center',
            children:[
                {
                    title: '测量值(无量纲)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`testVal${index}`}><Input  placeholder='请输入' /></Form.Item>;
                      }
                },
            ]
        },
    ];

 const columns2  = [
    {
        title: '一元线性方程',
        align: 'center',
        children:[ 
            {
                title: '置信区间半宽',
                align: 'center',
                render:()=>{
                  return '评价依据'
                }
            },
            
        ]
    },
    {
        title: 'Y=Kx+b',
        align: 'center',
        children:[ 
            {
                title:  <span>{11111}</span>,
                align: 'center',
                render:(text,record,index)=>{
                    const obj = {
                    children: <span>{'评价内容'}</span>,
                        props: {colSpan:3},
                      };
                      return obj;
                    }
            },

            
        ]
    },
    {
        title: '相关系数',
        align: 'center',
        children:[ 
            {
                title:  '允许区间半宽',
                align: 'center',
                render:(text,record,index)=>{
                    const obj = {
                        props: {colSpan:0},
                      };
                      return obj;
                    }
            },    
        ]
    },
    {
        title: <span>{11111}</span>,
        align: 'center',
        children:[ 
            {
                title:  <span>{2222}</span>,
                align: 'center',
                render:(text,record,index)=>{
                    const obj = {
                        props: {colSpan:0},
                      };
                      return obj;
                    }
            },
            
        ]
    },
 ]
 const columns3  = [
    {
        title: 'K系数',
        align: 'center',
        render:(text,record,index)=>{
             return '评价'
        }
    },
    {
        title: 'Y=Kx+b',
        align: 'center',
        render:(text,record,index)=>{
            return '评价内容'
           }
    },
 ]

    const imports = async () => {


    }
    const temporarySave = () => {
        console.log('暂存事件')
    }
    const submits = () => {
        console.log('提交事件')
    }
    const clears = () => {
    form.resetFields();
    }
    const del = () => {
        console.log('删除事件')
    }


    const SearchComponents = () => {
        return <div>
            <Row gutter={36}>
                <Col span={8}>
                <Form.Item label="当前大气压" name="ManufactorID">
                  <Input placeholder='请输入' allowClear suffix="Pa" />
                </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="空气过剩系数" name="SystemModel" >
                    <Input placeholder='请输入'  allowClear />

                </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="排放限值" name="Status"  >
                     <Input placeholder='请输入'  allowClear suffix="mg/m3" />
                </Form.Item>
                </Col>
            </Row>
            <Row justify='center' style={{fontSize:16,fontWeight:'bold',paddingBottom:16}}>参比方法校准颗粒物CEMS(一元线性方程法)</Row>
            <Row justify='center' className={styles['advanced_search_sty']}>
              <Col span={8}>
                <Form.Item label="测试人员" name="ManufactorID">
                  <Input placeholder='请输入' allowClear />
                </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                <Form.Item label="CEMS生产厂" name="SystemModel" >
                    <Input placeholder='请输入'  allowClear />
                </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="测试地点" name="ManufactorID">
                  <Input placeholder='请输入' allowClear />
                </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                <Form.Item label="CEMS型号、编号" name="SystemModel" >
                    <Input placeholder='请输入'  allowClear />
                </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="测试位置" name="ManufactorID">
                  <Input placeholder='请输入' allowClear />
                </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                <Form.Item label="参比仪器原理" name="SystemModel" >
                    <Input placeholder='请输入'  allowClear />
                </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="参比仪器生产厂" name="ManufactorID">
                  <Input placeholder='请输入' allowClear />
                </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                <Form.Item label="型号、编号" name="SystemModel" >
                    <Input placeholder='请输入'  allowClear />
                </Form.Item>
                </Col>
            </Row>
        </div>
    }
    const [fileList, setFileList] = useState([]);
    const uploadProps = {
        
        beforeUpload: (file) => {
            setFileList([]); 
            setTimeout(()=>{
                setFileList([file]);
            })
            return false;
          },
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
          },
          fileList,
      };
      
    const [importVisible,setImportVisible] = useState(false)
    const importVisibleChange = (newVisible) => {
        setImportVisible(newVisible);
      };

    const [ uploading, setUploading] = useState(false)
    const importOK = async(value)=>{
        
    
        if(!value.rowVal || !value.colVal){
            message.warning('请输入行数和列数')
            return;  
         }
         if(fileList.length<=0){
            message.warning('请上传文件')
            return;  
         }
         try {
                const values = await form.validateFields();
                const timeData = []
                let i = 0;
                 Object.keys(values).map((item,index)=>{
                 if(/^time/g.test(item)){
                     i++;
                     if(i<=10){
                         if(values['date0']&&form.getFieldValue(`timeStart${i-1}`)&&form.getFieldValue(`timeEnd${i-1}`)){
                          timeData.push(`${moment(values['date0']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`timeStart${i-1}`)).format('HH:mm') },${moment(values['date0']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`timeEnd${i-1}`)).format('HH:mm')}|`)     
                         }
                     }else if(i>10&&i<=15){
                        if(values['date5']&&form.getFieldValue(`timeStart${i-1}`)&&form.getFieldValue(`timeEnd${i-1}`)){
                            timeData.push(`${moment(values['date5']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`timeStart${i-1}`)).format('HH:mm') },${moment(values['date0']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`timeEnd${i-1}`)).format('HH:mm')}|`)     
                           }
                     }else{
                        if(values['date10']&&form.getFieldValue(`timeStart${i-1}`)&&form.getFieldValue(`timeEnd${i-1}`)){
                            i==15? timeData.push(`${moment(values['date10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`timeStart${i-1}`)).format('HH:mm') },${moment(values['date0']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`timeEnd${i-1}`)).format('HH:mm')}`) : timeData.push(`${moment(values['date10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`timeStart${i-1}`)).format('HH:mm') },${moment(values['date0']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`timeEnd${i-1}`)).format('HH:mm')}|`)     
                           }
                     }
                   }   
                 })

                 const formData = new FormData();
                 fileList.forEach((file) => {
                   formData.append('files', file);
                 });
                 formData.append('firstRow', value.rowVal);
                 formData.append('firstColumn', value.colVal);
                 formData.append('PollutantCode', '');
                 formData.append('TimeList', timeData.toString().replaceAll('|,','|'));
                 setUploading(true);
                 fetch('/api/rest/PollutantSourceApi/TaskFormApi/ImportData', {
                    method: 'POST',
                    body: formData,
                    headers: {
                     Authorization: "Bearer " + Cookie.get(config.cookieName),
         
                   },
                   
                  }).then((res) =>res.json()).then((data) => {
                      setUploading(false);
                       if(data.IsSuccess){
                         setFileList([]);
                         message.success('导入成功');
                      }else{
                        message.error(data.Message)
                      }
                    }).catch(() => {
                      setUploading(false);
                      message.error('导入失败');
                    })
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
                message.warning('请输入完整的时间')  
                return;  
            }
    }

    return (
        <div className={styles.particleMatterReferSty}>
            <BtnComponents isImport importLoading={uploading}  importOK={importOK}  uploadProps={uploadProps}   importVisible={importVisible}  temporarySave={temporarySave} submits={submits} clears={clears} del={del} importVisibleChange={importVisibleChange}/>
            <Form
            form={form}
            name="advanced_search"
            initialValues={{}}
            className={styles["ant-advanced-search-form"]}
        >
            <SearchComponents />
            <Table
                size="small"
                loading={tableLoading}
                bordered
                dataSource={tableDatas}
                columns={columns}
                pagination={false}
                className={'particleMatterReferTable1'}
            />
            <Table
                size="small"
                loading={tableLoading}
                bordered
                dataSource={footData}
                columns={columns2}
                pagination={false}
                className={'particleMatterReferTable2'}
            />
            </Form>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);