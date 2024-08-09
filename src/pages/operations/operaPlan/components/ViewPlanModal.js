/**
 * 功  能：预测性维护 运维计划  查看计划弹框
 * 创建人：jab
 * 创建时间：2024.05
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Tabs, Input, InputNumber, Popconfirm, Upload, Checkbox, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, NodeCollapseOutlined, } from '@ant-design/icons';
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
import PlanList from '../components/PlanList'
import PlanCalendar from '../components/PlanCalendar'
import RecordList from '../components/RecordList'
import { API } from '@config/API';
import config from '@/config';
import cuid from 'cuid';


import { init, use } from 'echarts';

const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    operationPlanInfoRefreshId: operaPlan.operationPlanInfoRefreshId,
    pointLoading: loading.effects[`common/getPointByEntCode`],
})

const Index = (props) => {







    const { pointType, entCode, operationPlanInfoRefreshId, visible, pointLoading } = props;
    const [pointList, setPointList] = useState([])


    useEffect(() => {
        if (visible) {
            props.dispatch({
                type: `${namespace}/updateState`,
                payload: { operationPlanInfoRefreshType: 1, operationPlanInfoRefreshId: operationPlanInfoRefreshId },
            });
            entCode  && props.dispatch({    //获取排口
                type: 'common/getPointByEntCode',
                payload: { EntCode: entCode },
                callback: (res) => {
                    setPointList(res)
                }
            });
        }
  
    }, [visible])


    const commonSearchComponents = () => {
        return <> 
        {/* <Spin spinning={!!pointLoading} size='small' className='formItemSpinSty'>
            <Form.Item name='pointID' label='监测点' style={{ marginBottom: 8 }}>
                <Select
                    mode="multiple"
                    maxTagCount={2}
                    maxTagTextLength={10}
                    maxTagPlaceholder="..."
                    placeholder="请选择"
                    style={{ width: 200 }}
                >
                    {pointList.map(item => (<Option key={item.PointCode} value={item.PointCode}>{item.PointName}</Option>))}
                </Select>
            </Form.Item>
        </Spin> */}
         <Form.Item name='pointName' label='监测点'   style={{ marginBottom: 8 }}>
                    <Input placeholder='请输入' allowClear/>
                </Form.Item> 
            <Form.Item name='recordType' label='计划内容' style={{ marginBottom: 8 }}>
                  <Select placeholder='请选择' allowClear style={{ width: 100 }}>
                        <Option key={pointType == 2 ? 1 : 7} value={pointType == 2 ? 1 : 7}>巡检</Option>
                        <Option key={pointType == 2 ? 3 : 9} value={pointType == 2 ? 3 : 9}>校准</Option>
                    </Select>
            </Form.Item>
        </>
    }

    return (
        <div>
            <Modal
                visible={visible}
                title={'查看计划'}
                onCancel={() => { props.onCancel && props.onCancel() }}
                destroyOnClose
                wrapClassName={`spreadOverModal`}
                mask={false}
                footer={null}
            >
                <Tabs
                    defaultActiveKey="1"
                    type='card'
                    tabPosition='left'
                    items={[
                        {
                            label: '计划列表',
                            key: '1',
                            children: <PlanList type={3} pointType={pointType} commonSearchComponents={() => commonSearchComponents()}  planContentOpera={[]} pointList={pointList}/>,
                        },
                        {
                            label: '计划日历',
                            key: '2',
                            children: <PlanCalendar pointType={pointType} commonSearchComponents={() => commonSearchComponents()} />,
                        },
                    ]}
                />
            </Modal>


        </div>
    );
};
export default connect(dvaPropsData)(Index);