/**
 * 功  能：异常买模型识别 模型库管理  模型选配
 * 创建人：jab
 * 创建时间：2024.06
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Badge, Spin, Form, Radio, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, CaretDownOutlined, CheckCircleTwoTone ,CloseCircleTwoTone, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList';
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "../../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import ModelMatch from '@/pages/AbnormalIdentifyModel/ModelMatch';
const { Option } = Select;

const namespace = 'ModelBaseManage'


const dvaPropsData = ({ loading, ModelBaseManage, global, }) => ({
    pointListLoading: loading.effects['common/getPointByEntCode'],
    tableDatas: ModelBaseManage.modelSelectionData,
    tableCol: ModelBaseManage.modelSelectionCol,
    tableTotal: ModelBaseManage.modelSelectionTotal,
    tableLoading: loading.effects[`${namespace}/GetModelApolegamyList`],
    configInfo: global.configInfo,

})


const Index = (props) => {



    const [form] = Form.useForm();





    const {pointListLoading, tableDatas,tableCol,tableTotal, tableLoading, } = props;

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        onValuesChange({pageIndex:pageIndex,pageSize:pageSize});
        return ()=>{
            props.dispatch({
                type: 'common/updateState',
                payload: {
                    modelSelectionCol:{},
                },
            });   
        }
    }, []);

    let [ columns,setColumns ] = useState([
        {
            title: '企业',
            dataIndex: 'entName',
            key: 'entName',
            align: 'center',
            width: 180,
            ellipsis: true,
        },
        {
            title: '排口',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 80,
            ellipsis: true,
            render: (text, record) => {
                return (
                 <a onClick={() => {edit(record) }}>编辑</a>
                );

            }
        },
    ])

    // 根据企业获取排口
    const [pointList, setPointList] = useState([]);
    const getPointList = (EntCode, callback) => {
        props.dispatch({
            type: 'common/getPointByEntCode',
            payload: {
                EntCode,
            },
            callback: res => {
                setPointList(res);
                callback && callback();
            },
        });
    };


    const [editVisible, setEditVisible] = useState(false)
    const [editTitle, setEditTitle] = useState('编辑')

    const [DGIMN, setDGIMN] = useState()

    
    const edit = (record) => {
        setEditVisible(true)
        setDGIMN(record.DGIMN)
        setEditTitle(`${record.entName}-${record.pointName}`)
    }


    const saveCallBack = (text) =>{
        setEditVisible(false)
        const values = form.getFieldsValue()
        onValuesChange({...values, pageIndex:pageIndex, pageSize:pageSize},'page')
    }
    const onValuesChange = (allValues,isPage) => {
        props.dispatch({
            type: `${namespace}/GetModelApolegamyList`,
            payload: {projectType:1, ...allValues }, // projectType:1,
            callback:(col)=>{
                let trendsCol = []
                if(col && !isPage){ //防止分页事件刷新列头
                    trendsCol= col.map(item=>({
                            title:  item.ModelName,
                            dataIndex: `model_${item.ModelNumber}`,
                            dataIndex: `model_${item.ModelNumber}`,
                            align: 'center',
                            ellipsis:true,
                            width:item.ModelName?.length<=3?   item.ModelName?.length * 30 : item.ModelName?.length * 18,
                            render: (text, record) => {
                                return text?  <CheckCircleTwoTone style={{fontSize:16}} twoToneColor="#52c41a" /> : <CloseCircleTwoTone style={{fontSize:16}}  twoToneColor="#f5222d"/>;
                
                            }
                    }))
                }
                columns.splice(2,0,...trendsCol) 
            }
        });
    }
    const onTableChange = (PageIndex, PageSize) => {
        setPageIndex(PageIndex);
        setPageSize(PageSize);
        const values = form.getFieldsValue()
        onValuesChange({...values, pageIndex:PageIndex, pageSize:PageSize},'page')
      };
    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            className={'ant-advanced-search-form'}
            layout='inline'
            onValuesChange={ (changedValues, allValues)=>onValuesChange(allValues)}
            initialValues={{
                projectType : '1'
            }}
        >
            <Form.Item label='选择项目' name='projectType'>
                <Select
                    style={{ width: 200 }}
                    placeholder='内蒙数据同步'
                    options={[
                        {
                            value: '1',
                            label: '内蒙数据',
                        },
                    ]}
                />
             </Form.Item>
                <Form.Item label="企业" name="entCode">
                    <EntAtmoList
                        style={{ width: 200 }}
                        onChange={value => {
                            if (!value) {
                                form.setFieldsValue({ dgimn: undefined });
                            } else {
                                form.setFieldsValue({ dgimn: undefined });
                                getPointList(value);
                            }
                        }}
                    />
                </Form.Item>
                    <Form.Item label="监测点名称" name="dgimn">  
                        {!!pointListLoading?
                        <Spin size="small"><Select  placeholder="请选择"   style={{ width: 150 }}/></Spin>
                        :
                         <Select
                            placeholder="请选择"
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            style={{ width: 150 }}
                         >
                            {pointList.map(item => {
                                return (
                                    <Option key={item.DGIMN} value={item.DGIMN}>
                                        {item.PointName}
                                    </Option>
                                );
                            })}
                        </Select>}
                    </Form.Item>
        </Form>
    }
    return (
        <div className={`${styles.modelSelectionSty}`}>
            <BreadcrumbWrapper >
                <Card title={searchComponents()}>
                    <SdlTable
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas}
                        columns={columns}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSize: pageSize,
                            current: pageIndex,
                            onChange: onTableChange,
                            total: tableTotal,
                          }}
                    />
                </Card>
                <Modal
                    visible={editVisible}
                    title={editTitle}
                    onCancel={() => { setEditVisible(false)}}
                    wrapClassName="spreadOverModal"
                    mask={false}
                    destroyOnClose
                    footer={null}
                >
                  <ModelMatch isModal DGIMN={DGIMN} saveCallBack={saveCallBack} zIndex={1002}/>
                </Modal>
            </BreadcrumbWrapper>
        </div >
    );
};
export default connect(dvaPropsData)(Index);