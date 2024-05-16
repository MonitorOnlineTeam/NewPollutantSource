/**
 * 功  能：调整计划、延长计划弹框组件
 * 创建人：jab
 * 创建时间：2024.05
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Tabs, Input, InputNumber, Popconfirm, Empty, Checkbox, Spin, Skeleton, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import CheckPhoto from '@/components/CheckPhoto';
import { permissionButton } from '@/utils/utils';
import TitleComponents from '@/components/TitleComponents'
import ProjectNum from '@/components/ProjectNum'
import EntAtmoList from '@/components/EntAtmoList';
import OperationCompanyList from '@/components/OperationCompanyList'


const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    operationPlanInfoRefreshId: operaPlan.operationPlanInfoRefreshId,
    formulatePointListloading: loading.effects[`${namespace}/GetFormulatePointList`],
    adjustmentOperationPlanLoading: loading.effects[`${namespace}/AdjustmentOperationPlan`],
    extendPlanDateLoading: loading.effects[`${namespace}/ExtendPlanDate`],
})

const Index = (props) => {


    const { type, adjustPointList, pointType, operationPlanInfoRefreshId, visible, onCancel, onFinish } = props;


    const [recordType, setRecordType] = useState(pointType == 2 ? '1' : '7')




    const [adjustExtendForm] = Form.useForm();

    useEffect(() => {


    }, []);



    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const checkboxChange = (valList, checkOptions) => {
        setIndeterminate(!!valList.length && valList.length < checkOptions.length);
        setCheckAll(valList.length === checkOptions.length);
    }
    const onCheckAllChange = (e, checkOptions) => {
        const allVal = checkOptions.map(item => item.PointCode)
        adjustExtendForm.setFieldsValue({ pointID: e.target.checked ? allVal : [] })
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };



    const dataList = recordType == '1' || recordType == '7' ? adjustPointList?.xjPointList : adjustPointList?.jzPointList

    const AdJustExtendPlanComponents = () => {

        const labelWidth = type == 1 ? '108px' : '122px'
        const loading = type == 1 ? props.formulatePointListloading : false;
        return loading ? <Skeleton active style={{ height: 158 }} /> :
            <>{dataList?.length ? <Form
                form={adjustExtendForm}
                name="advanced_search_plancontent_form"
                className={'ant-advanced-search-form'}
                labelCol={{ flex: labelWidth }}
            >
                <Checkbox style={{ paddingLeft: labelWidth }} indeterminate={indeterminate} onChange={(e) => onCheckAllChange(e, dataList)} checked={checkAll}>
                    全选
                </Checkbox>
                <Form.Item className='form_label_width_94 pointItemSty' name='pointID' label='监测点' rules={[{ required: true, message: '请选择监测点！' }]} >
                    <Checkbox.Group
                        onChange={(val) => checkboxChange(val, dataList)}
                    >
                        {
                            dataList.map(item => {
                                return <Checkbox key={type == 1 ? item.PointCode : item.PointID} value={type == 1 ? item.PointCode : item.PointID}>{item.PointName}</Checkbox>
                            })
                        }
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item
                    name='tzDate'
                    label={type == 1 ? '调整起始日期' : '新实际结束时间'}
                    rules={[{ required: true, message: `请选择${type == 1 ? '调整起始日期' : '新实际结束时间'}！` }]}
                >
                    <DatePicker
                        disabledDate={(current) => {
                            return current && current < moment()
                        }} />
                </Form.Item>
            </Form>
                :
                <Empty description='暂无监测点' image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBottom: 24 }} />
            }</>
    }



    const resData = () => {
        adjustExtendForm.resetFields();
        setIndeterminate(false);
        setCheckAll(false)
    }


    const onOk = () => {
        adjustExtendForm.validateFields().then((values) => {
            const par = { recordType: recordType, ...values, tzDate: values.tzDate && moment(values.tzDate).format('YYYY-MM-DD 00:00:00') }
            props.dispatch({
                type: type == 1 ? `${namespace}/AdjustmentOperationPlan` : `${namespace}/ExtendPlanDate`,
                payload: { id: operationPlanInfoRefreshId, ...par },
                callback: () => {
                    onCancel && onCancel()
                    if (onFinish) {
                        onFinish()
                    } else {
                        props.dispatch({
                            type: `${namespace}/updateState`,
                            payload: { operationPlanInfoRefreshType: 1, },
                        });
                    }
                }
            });
        }).catch((errorInfo) => {
            console.log('Failed:', errorInfo);
        });
    }


    return (<Modal
        visible={visible}
        title={props.title}
        onCancel={() => { onCancel && onCancel(); resData(); }}
        destroyOnClose
        wrapClassName={`spreadOverModal  ${styles.formulateModalSty}`}
        mask={false}
        footer={dataList?.length > 0 ? [<Button onClick={() => { resData() }}>
            重置
                   </Button>,
        <Button type="primary" loading={type == 1 ? props.adjustmentOperationPlanLoading : props.extendPlanDateLoading} onClick={onOk}>
            提交
                   </Button>] : null}
    >
        <Tabs
            defaultActiveKey="1"
            type='card'
            onChange={(key) => {
                adjustExtendForm.resetFields()
                setCheckAll(false)
                setIndeterminate(false)
                setRecordType(key)
            }}
            items={[
                {
                    label: `巡检`,
                    key: pointType == 2 ? '1' : '7',
                    children: <AdJustExtendPlanComponents />,
                },
                {
                    label: pointType == 2 ? '校准' : '标样核查及校准',
                    key: pointType == 2 ? '3' : '9',
                    children: <AdJustExtendPlanComponents />,
                },
            ]}
        />
    </Modal>
    );
};
export default connect(dvaPropsData)(Index);