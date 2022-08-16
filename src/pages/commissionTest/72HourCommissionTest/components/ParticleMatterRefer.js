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
        getSystemModelList: (payload) => { //列表
            dispatch({
                type: `${namespace}/getSystemModelList`,
                payload: payload,
            })
        },
    }
}
const Index = (props) => {



    const [form] = Form.useForm();



    const { tableDatas, tableTotal, tableLoading, } = props;
    const footData = [{evaluateTitle:'评价依据',evaluateData:'1111'}]
    useEffect(() => {

    }, []);
    const disabledDate = (current) => {
        return current && current > moment().endOf('year') || current < moment().startOf('year');
      };
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
                  children: <Form.Item name={`date${index}`}> <DatePicker disabledDate={disabledDate} format="MM-DD" /></Form.Item>,
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
                       return <Form.Item name={`timeStart${index}`}><TimePicker  defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /></Form.Item>;
                     }
                },
                {
                    title: '结束',
                    align: 'center',
                    width:140,
                    render: (text, record, index) => {
                        return <Form.Item name={`timeEnd${index}`}><TimePicker  defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /></Form.Item>;
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
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
                },
                {
                    title: '滤筒/滤膜编号',
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
                },   
                {
                    title: '颗粒物重(mg)',
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
                },
                {
                    title: '标况体积(NL)',
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
                },
                {
                    title: '标杆浓度(mg/m3)',
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
                },
                {
                    title: '工况浓度(mg/m3)',
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
                },       
            ]
        },
        {
            title: 'CEMS法',
            align: 'center',
            children:[
                {
                    title: '测量值(无量纲)',
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
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

    const imports = () => {
        console.log('导入事件')
    }
    const temporarySave = () => {
        console.log('暂存事件')
    }
    const submits = () => {
        console.log('提交事件')
    }
    const clears = () => {
        console.log('清除事件')
    }
    const del = () => {
        console.log('删除事件')
    }

    const [importVisible,setImportVisible] = useState(false)
    const importVisibleChange = (newVisible) => {
        setImportVisible(newVisible);
      };
     const  importOk = (rowVal,colVal)=>{
       console.log(rowVal,colVal)
     }
    // const onFinish  = async (pageIndexs) =>{  //查询
      
    //     try {
    //       const values = await form.validateFields();
          
    //       pageIndexs&& typeof  pageIndexs === "number"? setPageIndex(pageIndexs) : setPageIndex(1); //除编辑  每次查询页码重置为第一页
    
    //       props.getSystemModelList({
    //         pageIndex: pageIndexs&& typeof  pageIndexs === "number"? pageIndexs: 1,
    //         pageSize: pageSize,
    //         ...values,
    //       })
    //     } catch (errorInfo) {
    //       console.log('Failed:', errorInfo);
    //     }
    //   }



              {/* <Select placeholder='请选择设备厂家' allowClear showSearch
             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
             style={{width:200}}>
                {
               manufacturerList[0]&&manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufactorName}</Option>
                  })
                } 
                 
              </Select> */}


    const SearchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            initialValues={{}}
            className={styles["ant-advanced-search-form"]}
        >
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
        </Form>
    }

    return (
        <div className={styles.particleMatterReferSty}>
            <BtnComponents isImport importOk={importOk}  importVisible={importVisible} imports={imports} temporarySave={temporarySave} submits={submits} clears={clears} del={del} importVisibleChange={importVisibleChange}/>
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
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);