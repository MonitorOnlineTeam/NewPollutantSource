/**
 * 功  能：颗粒物参比
 * 创建人：jab
 * 创建时间：2022.08.11
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
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
    tableDatas: hourCommissionTest.tableDatas,
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
    useEffect(() => {

    }, []);

    const columns = [
        {
            title: '日期',
            dataIndex: 'Num',
            key: 'Num',
            align: 'center',
            render: (text, record, index) => {
                const obj = {
                  children: text,
                  props: {rowSpan:index % 2 === 1? 5 : 0},
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
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
                },
                {
                    title: '结束',
                    dataIndex: 'SystemName',
                    key: 'SystemName',
                    align: 'center',
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
                  <Input placeholder='请输入' allowClear />
                </Form.Item>
                 <span style={{position:'absolute',top:5,right:0}}>Pa</span>
                </Col>
                <Col span={8}>
                <Form.Item label="空气过剩系数" name="SystemModel" >
                    <Input placeholder='请输入'  allowClear />

                </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="排放限值" name="Status"  >
                     <Input placeholder='请输入'  allowClear />
                </Form.Item>
                <span style={{position:'absolute',top:5,right:0}}>mg/m3</span>
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
        <div className={styles.hourCommissionTestSty}>
            <BtnComponents isImport imports={imports} temporarySave={temporarySave} submits={submits} clears={clears} del={del}/>
            <SearchComponents />
            <SdlTable
                loading={tableLoading}
                bordered
                dataSource={tableDatas}
                columns={columns}
                pagination={false}
            />
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);