/**
 * 功  能：异常买模型识别 模型库管理  模型选配
 * 创建人：jab
 * 创建时间：2024.06
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Badge, Spin, Form, Radio, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, CaretDownOutlined, } from '@ant-design/icons';
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
    tableLoading: loading.effects[`${namespace}/ExportCarList`],
    configInfo: global.configInfo,

})


const Index = (props) => {



    const [form] = Form.useForm();
    const [form2] = Form.useForm();





    const {pointListLoading, tableDatas, tableLoading, } = props;



    useEffect(() => {
        handleChange();

    }, []);

    let columns = [
        {
            title: '企业',
            dataIndex: 'CarNum',
            key: 'CarNum',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '排口',
            dataIndex: 'VehicleType',
            key: 'VehicleType',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 100,
            ellipsis: true,
            render: (text, record) => {
                return (
              <a onClick={() => {edit(record) }}>编辑</a>
                );

            }
        },
    ];

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


    const [editVisible, setEditVisible] = useState(true)
    const [editTitle, setEditTitle] = useState('编辑')

    const [row, setRow] = useState({})

    
    const edit = (record) => {
        setEditVisible(true)
        setEditTitle('编辑')
    }

    const [startExecuVisible, setStartExecuVisible] = useState(false)
    const [startExecuTitle, setStartExecuTitle] = useState('')

    const startExecuConfirm = (type, record) => {
        console.log('开始执行')
    }

    const handleChange = (values) => {  //查询

        props.dispatch({
            type: `${namespace}/GetAuditPhoto`,
            payload: { values },
        });
    }

    const saveCallBack = (text) =>{
        setEditVisible(false)
    }

    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            className={'ant-advanced-search-form'}
            layout='inline'
            initialValues={{
                projectType : '1'
            }}
        >
            <Form.Item label='选择项目' name='projectType'>
                <Select
                    style={{ width: 200 }}
                    onChange={handleChange}
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
                        onRow={record => ({
                            onClick: event => { setRow(record) },
                        })
                        }
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas}
                        columns={columns}
                        pagination={false}
                    />
                </Card>
                <Modal
                    visible={editVisible}
                    title={<div style={{marginLeft:320}}>{editTitle}</div>}
                    onCancel={() => { setEditVisible(false)}}
                    wrapClassName="spreadOverModal"
                    mask={false}
                    destroyOnClose
                    footer={null}
                >
                  <ModelMatch hideBreadcrumb isModal saveCallBack={saveCallBack} zIndex={1002}/>
                </Modal>
            </BreadcrumbWrapper>
        </div >
    );
};
export default connect(dvaPropsData)(Index);