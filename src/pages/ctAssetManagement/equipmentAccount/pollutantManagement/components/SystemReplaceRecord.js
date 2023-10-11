/**
 * 功  能：系统更换记录
 * 创建人：jab
 * 创建时间：2023.09.06
 */
import React, { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tabs, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Popover, Tag, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
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
import cuid from 'cuid';
import ProjectInfo from './ProJectInfo'
const { TabPane } = Tabs;
const { Option } = Select;
const namespace = 'ctPollutantManger'




const dvaPropsData = ({ loading, ctPollutantManger, commissionTest, }) => ({
    manufacturerList: commissionTest.manufacturerList,
    systemModelList: ctPollutantManger.systemModelList,
    loadingChangeSystemModel: loading.effects[`${namespace}/testGetSystemModelList`] || false,
    systemModelListTotal: ctPollutantManger.systemModelListTotal,
    cEMSSystemListLoading: loading.effects[`${namespace}/getCEMSSystemList`],
    systemChangeEditingKey: ctPollutantManger.systemChangeEditingKey,
    systemChangeData: ctPollutantManger.systemChangeData,
    projectModelList: ctPollutantManger.projectModelList,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getManufacturerList: (payload, callback) => { //厂家下拉列表
            dispatch({
                type: `commissionTest/getManufacturerList`,
                payload: payload,
                callback: callback
            })
        },
        testGetSystemModelList: (payload, callback) => { //cems系统型号 弹框
            dispatch({
                type: `${namespace}/testGetSystemModelList`,
                payload: payload,
                callback: callback,
            })
        },
        getCEMSSystemList: (payload, callback) => { // CEMS参数信息列表
            dispatch({
                type: `${namespace}/getCEMSSystemList`,
                payload: payload,
                callback: callback,
            })
        },
    }
}




const Index = (props) => {

    const { manufacturerList, systemModelList, systemModelListTotal, systemChangeEditingKey, systemChangeData, projectModelList, } = props;

    const { dgimn, current } = props;


    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    const systemEdit = (record) => {
        form.setFieldsValue({
            ...record,
            ASystemName: Number(record.ASystemNameID),
            BSystemName: Number(record.BSystemNameID),
            ProjectCode:record.ProjectCode ? record.ProjectCode : record.ItemCode
        });
        if (record.type != "add") { //获取接口原有列表数据
            setAsystemManufactorID(record.AManufactorID) //CEMS设备生产商 后
            setAcemsVal(Number(record.ASystemNameID))//系统名称 后
            setBsystemManufactorID(record.BManufactorID) //CEMS设备生产商 前
            setBcemsVal(Number(record.BSystemNameID))//系统名称 前
            setProjectID(record.ProjectID)
        }
        props.updateState({ systemChangeEditingKey: record.ID })
    }


    const systemCancel = (record, type) => {
        if (record.type === 'add' || type) { //新添加一行 删除 || 原有数据编辑的删除  不用走接口
            const dataSource = [...systemChangeData];
            let newData = dataSource.filter((item) => item.ID !== record.ID)
            props.updateState({ systemChangeData: newData })
            props.updateState({ systemChangeEditingKey: '' })
        } else { //编辑状态
            props.updateState({ systemChangeEditingKey: '' })
        }
    };


    const systemSave = async (record) => {
        try {
            const row = await form.validateFields();
            const newData = [...systemChangeData];
            const key = record.ID;
            const index = newData.findIndex((item) => key === item.ID);
            if (index > -1) {
                const editRow = {
                    ASystemName: acemsVal == 465 ? '气态污染物CEMS' : '颗粒物污染物CEMS',
                    ASystemNameID: acemsVal,
                    AManufactorID: asystemManufactorID,
                    BSystemName: bcemsVal == 465 ? '气态污染物CEMS' : '颗粒物污染物CEMS',
                    BSystemNameID: bcemsVal,
                    BManufactorID: bsystemManufactorID,
                    ProjectID:projectID,
                };

                const item = record.type === 'add' ? { ...newData[index], ID: cuid() } : { ...newData[index] }
                newData.splice(index, 1, { ...item, ...row, ...editRow });
                props.updateState({ systemChangeData: newData })
                props.updateState({ systemChangeEditingKey: '' })
            } else {
                newData.push(row);
                props.updateState({ systemChangeData: newData })
                props.updateState({ systemChangeEditingKey: '' })
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }




    const isSystemEditing = (record) => record.ID === systemChangeEditingKey;

    const systemCol = [
        {
            title: '项目号',
            dataIndex: 'ProjectCode',
            align: 'center',
            editable: true,
            render:(text,record)=>{
                return text ? text : record.ItemCode
            }
        },
        {
            title: '变更前系统信息',
            align: 'center',
            children: [
                {
                    title: 'CEMS系统名称',
                    dataIndex: 'BSystemName',
                    align: 'center',
                    width: 140,
                    editable: true,
                },
                {
                    title: 'CEMS生产厂家',
                    dataIndex: 'BManufactorName',
                    align: 'center',
                    width: 140,
                    editable: true,
                },
                {
                    title: 'CEMS型号',
                    dataIndex: 'BSystemModel',
                    align: 'center',
                    width: 110,
                    disType: 'before',
                    editable: true,
                },
                {
                    title: 'CEMS编号',
                    dataIndex: 'BCEMSNum',
                    align: 'center',
                    width: 110,
                    editable: true,
                },
            ]
        },
        {
            title: '变更后系统信息',
            align: 'center',
            children: [
                {
                    title: 'CEMS系统名称',
                    dataIndex: 'ASystemName',
                    align: 'center',
                    width: 140,
                    editable: true,
                },
                {
                    title: 'CEMS生产厂家',
                    dataIndex: 'AManufactorName',
                    align: 'center',
                    width: 140,
                    editable: true,
                },
                {
                    title: 'CEMS型号',
                    dataIndex: 'ASystemModel',
                    align: 'center',
                    width: 110,
                    disType: 'after',
                    editable: true,
                },
                {
                    title: 'CEMS编号',
                    dataIndex: 'ACEMSNum',
                    align: 'center',
                    width: 110,
                    editable: true,
                },
            ]
        },
        {
            title: '创建人',
            dataIndex: 'CreateUserName',
            key: 'CreateUserName',
            align: 'center',
            width: 110,
        },
        {
            title: '创建时间',
            dataIndex: 'CreateTime',
            key: 'CreateTime',
            align: 'center',
        },
        {
            title: '更新人',
            dataIndex: 'UpdateUserName',
            key: 'UpdateUserName',
            align: 'center',
            width: 110,
        },
        {
            title: '更新时间',
            dataIndex: 'UpdateTime',
            key: 'UpdateTime',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (_, record) => {
                const editable = isSystemEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => systemSave(record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            {record.type == 'add' ? "添加" : "保存"}
                        </Typography.Link>
                        <span onClick={() => { systemCancel(record) }} style={{ marginRight: 8 }}>
                            <a>{record.type == 'add' ? "删除" : "取消"}</a>{/*添加的删除 和编辑的取消*/}
                        </span>
                        <span onClick={() => { systemCancel(record, 'del') }}> {/*编辑的删除 */}
                            <a>{!record.type && "删除"}</a>
                        </span>
                    </span>
                ) : (
                        <Typography.Link disabled={systemChangeEditingKey !== ''} onClick={() => systemEdit(record)}>
                            编辑
                        </Typography.Link>
                    );
            },
        },]



    const systemCols = systemCol.map((col) => {
        if (col.title === '变更前系统信息' || col.title === '变更后系统信息') {
            return {
                ...col,
                children: col.children.map(childCol => {
                    if (!childCol.editable) {
                        return childCol;
                    } else {
                        return {
                            ...childCol,
                            onCell: (record) => ({
                                record,
                                inputType: col.inputType === 'number' ? 'number' : 'text',
                                dataIndex: childCol.dataIndex,
                                title: childCol.title,
                                disType: childCol.disType,
                                editing: isSystemEditing(record),
                            }),
                        };
                    }
                })

            };
        }
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isSystemEditing(record),
            }),
        };
    });


    const generatorCol = [
        {
            title: '生产厂家',
            dataIndex: 'ManufactorName',
            key: 'ManufactorName',
            align: 'center',
        },
        {
            title: '系统名称',
            dataIndex: 'SystemName',
            key: 'SystemName',
            align: 'center',
        },
        {
            title: '系统型号',
            dataIndex: 'SystemModel',
            key: 'SystemModel',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            render: (text, record) => {
                return <Button type='primary' size='small' onClick={() => { systemColChoice(record) }}> 选择 </Button>
            }
        },

    ]


    const [asystemManufactorID, setAsystemManufactorID] = useState()
    const [bsystemManufactorID, setBsystemManufactorID] = useState()

    const [achoiceManufacturer, setAchoiceManufacturer] = useState(false); //系统信息 选择生产商 后
    const [bchoiceManufacturer, setBchoiceManufacturer] = useState(false); //系统信息 选择生产商 前

    const systemColChoice = (record) => {
        if (infoType == 1) {
            form.setFieldsValue({ AManufactorName: record.ManufactorName, ASystemModel: record.SystemModel, });
            setAsystemManufactorID(record.ID)
            setAchoiceManufacturer(true)
        } else {
            form.setFieldsValue({ BManufactorName: record.ManufactorName, BSystemModel: record.SystemModel, });
            setBsystemManufactorID(record.ID)
            setBchoiceManufacturer(true)
        }
        setManufacturerPopVisible(false)
    }




    const onManufacturerClearChoice = (value, infoType) => { //CEMS-系统信息 厂家清除
        if (infoType == 1) {
            form.setFieldsValue({ AManufactorName: value, })
            setAsystemManufactorID(value)
            setAchoiceManufacturer(false)
        } else {
            form.setFieldsValue({ BManufactorName: value, })
            setBsystemManufactorID(value)
            setBchoiceManufacturer(false)
        }
    }


    const [pageIndex2, setPageIndex2] = useState(1)
    const [pageSize2, setPageSize2] = useState(10)
    const onFinish2 = async (pageIndex2, pageSize2, cemsVal, ) => { //生成商弹出框 查询

        setPageIndex2(pageIndex2)
        try {
            const values = await form2.validateFields();
            props.testGetSystemModelList({
                pageIndex: pageIndex2,
                pageSize: pageSize2,
                SystemName: cemsVal,
                ...values,
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    const handleTableChange2 = async (PageIndex, PageSize) => { //分页
        const values = await form2.validateFields();
        setPageSize2(PageSize)
        setPageIndex2(PageIndex)
        props.testGetSystemModelList({ ...values, SystemName: infoType == 1 ? acemsVal : bcemsVal, PageIndex, PageSize })
    }

    const systemPopContent = <Form //系统信息-cems生产厂家 弹框
        form={form2}
        name="advanced_search3"
        onFinish={() => { setPageIndex2(1); onFinish2(1, pageSize2, infoType == 1 ? acemsVal : bcemsVal) }}
        initialValues={{
            ManufactorID: manufacturerList[0] && manufacturerList[0].ID,
        }}

    >
        <Row>
            <Form.Item style={{ marginRight: 8 }} name='ManufactorID' >
                <Select placeholder='请选择生产厂家' showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 200 }}>
                    {
                        manufacturerList[0] && manufacturerList.map(item => {
                            return <Option key={item.ID} value={item.ID}>{item.ManufactorName}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item style={{ marginRight: 8 }} name="SystemModel">
                <Input allowClear placeholder="请输入系统型号" />
            </Form.Item>
            <Form.Item name="MonitoringType" hidden>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType='submit'>
                    查询
     </Button>
            </Form.Item>
        </Row>
        <SdlTable scroll={{ y: 'calc(100vh - 500px)' }}
            loading={props.loadingChangeSystemModel} bordered dataSource={systemModelList} columns={generatorCol}
            pagination={{
                total: systemModelListTotal,
                pageSize: pageSize2,
                current: pageIndex2,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: handleTableChange2,
            }}
        />
    </Form>



    const handleSystemAdd = () => { //添加系统变更信息
        if (systemChangeEditingKey) {
            message.warning('请先保存数据')
            return
        } else {
            form.resetFields();
            form.setFieldsValue({ ASystemName: acemsVal, BSystemName: bcemsVal })
            props.updateState({ systemChangeEditingKey: systemChangeEditingKey + 1 })
            const newData = {
                type: 'add',
                ID: systemChangeEditingKey + 1,
            }
            props.updateState({ systemChangeData: [...systemChangeData, newData] })
            setAchoiceManufacturer(false)
            setBchoiceManufacturer(false)
        }
    }






    const [manufacturerPopVisible, setManufacturerPopVisible] = useState(false)
    const [infoType, setInfoType] = useState()

    const manufacturerPopVisibleClick = (type) => { // cems-系统信息 设备生产厂家
        setManufacturerPopVisible(true)
        setInfoType(type)
        const cemsVal = type == 1 ? acemsVal : bcemsVal;
        form.setFieldsValue({ SystemName: cemsVal })
        setTimeout(() => {
            onFinish2(1, 10, cemsVal)
        })

    }


    const [acemsVal, setAcemsVal] = useState(465)
    const [bcemsVal, setBcemsVal] = useState(465)
    const cemsChange = (val) => {
        infoType == 1 ? setAcemsVal(val) : setBcemsVal(val)
    }


    const [projectPopVisible,setProjectPopVisible]= useState(false)
    const [projectID,setProjectID]= useState('')

    const projectColChoice = (record) =>{
      form.setFieldsValue({ ProjectCode: record.ProjectCode?  record.ProjectCode : record.ItemCode  })
      setProjectID(record.ID)
      setProjectPopVisible(false)
    }

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        name,
        children,
        disType,
        ...restProps
    }) => {
        let inputNode = '';
        if (dataIndex === 'ASystemName' || dataIndex === 'BSystemName') {
            inputNode = <Select placeholder='请选择' onChange={cemsChange} disabled={dataIndex === 'ASystemName' ? achoiceManufacturer : bchoiceManufacturer}>
                <Option value={465}>气态污染物CEMS</Option>
                <Option value={466}>颗粒物污染物CEMS</Option>
            </Select>
        } else if (inputType === 'number') {
            inputNode = <InputNumber style={{ width: '100%' }} placeholder={`请输入`} />
        } else {
            inputNode = <Input disabled={disType == 'after' ? achoiceManufacturer : disType == 'before' ? bchoiceManufacturer : false} placeholder={`请输入`} />
        }
        const infoType = dataIndex === 'AManufactorName' ? 1 : 2
        return (
            <td {...restProps}>
                {editing ? (
                    dataIndex === 'AManufactorName' || dataIndex === 'BManufactorName' ?  //CEMS-系统信息 生产厂家
                        <Form.Item name={`${dataIndex}`} style={{ margin: 0 }}>
                            <Select onClick={() => { manufacturerPopVisibleClick(infoType) }} onChange={(value) => { onManufacturerClearChoice(value, infoType) }} allowClear showSearch={false} dropdownClassName={'popSelectSty'} placeholder="请选择"> </Select>
                        </Form.Item>
                        :
                        dataIndex === 'ProjectCode' ?  //项目号
                            <Form.Item name={`${dataIndex}`} style={{ margin: 0 }}>
                                <Select onClick={() => { setProjectPopVisible(true)}} onChange={(value) => {  form.setFieldsValue({ ProjectCode: value, });setProjectID('')}} allowClear showSearch={false} dropdownClassName={'popSelectSty'} placeholder="请选择"> </Select>
                            </Form.Item>
                            :
                            <Form.Item
                                name={`${dataIndex}`}
                                style={{ margin: 0 }}
                                rules={[{ required: dataIndex === 'ACEMSNum' || dataIndex === 'AFactoryNumber' || dataIndex === 'Number' || dataIndex === 'BCEMSNum' || dataIndex === 'BFactoryNumber', message: `请输入`, },]}
                            >
                                {inputNode}
                            </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };



    return (
        <div className={styles.deviceManagerSty} style={{ display: current == 2 ? 'block' : 'none' }}>
            <Form form={form} name="advanced_search_change" >
                <><div>
                    <SdlTable
                        components={{
                            body: {
                                cell: EditableCell,
                            }
                        }}
                        bordered
                        dataSource={systemChangeData}
                        columns={systemCols}
                        rowClassName="editable-row"
                        scroll={{ y: 'auto' }}
                        loading={props.cEMSSystemListLoading}
                        className={`${styles.systemListSty}`}
                        pagination={false}
                        size='small'
                    />
                </div>
                    <Button style={{ margin: '10px 0 15px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleSystemAdd()} >
                        添加系统变更信息
                   </Button></>
            </Form>

            {/**cems 系统信息  cems生产厂家弹框 */}
            <Modal visible={manufacturerPopVisible} getContainer={false} onCancel={() => { setManufacturerPopVisible(false) }} destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }} wrapClassName='noSpreadOverModal'>
                {systemPopContent}
            </Modal>
            {/** 项目信息 弹框 */}
            <ProjectInfo projectPopVisible={projectPopVisible} projectColChoice={projectColChoice} onProjectCancel={()=>{setProjectPopVisible(false)}}/>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);