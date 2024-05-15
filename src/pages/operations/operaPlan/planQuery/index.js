/**
 * 功  能：预测性维护-运维计划  已完结计划  运维计划查询
 * 创建人：jab
 * 创建时间：2024.05
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Tabs, Input, InputNumber, Popconfirm,Upload, Checkbox, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
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
import OperationPlanQuery from '../components/OperationPlanQuery'
import PlanList from '../components/PlanList'
import PlanCalendar from '../components/PlanCalendar'
import RecordList from '../components/RecordList'
import ViewPlanModal from '../components/ViewPlanModal'

import { API } from '@config/API';
import config from '@/config';
import cuid from 'cuid';


import { init, use } from 'echarts';

const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    tableLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    tableDatas: operaPlan.formulateTableDatas,
    tableTotal: operaPlan.formulateTableTotal,
    queryPar: operaPlan.formulateQueryPar,
    exportLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    configInfo: global.configInfo,
})

const Index = (props) => {



    const [form] = Form.useForm();







    const {location, tableDatas, tableTotal, tableLoading, queryPar, exportLoading, } = props;

   
    const type = location?.pathname === '/operations/operaPlan/completedPlan'? 3 : 4;

    console.log(type)

    useEffect(() => {
      

    }, []);

    const initData = () => {
        props.dispatch({
            type: `${namespace}/GetQuestionList`,
            payload: {
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        });
    }





    const operateCol = [{
        title: '操作',
        fixed: 'right',
        ellipsis: true,
        width: 200,
        render: (text, record, index) => {
            return (<Fragment>
                <Space>
                        <a onClick={()=>viewPlan(record)}> 查看计划 </a>
                        <a onClick={()=>statusChangeRecord(record)}> 状态变更记录 </a>
                </Space>
            </Fragment>
            );

        }
    }]
    const [entCode, setEntCode] = useState()
    const [pointType, setPointType] = useState()
    const [viewPlanVisible, setViewPlanVisible] = useState(false)
    const viewPlan = (record) => {
        setViewPlanVisible(true)
        setEntCode(record.entCode)
        setPointType(record.pollutantType=='废气'? 2 :1)
        props.dispatch({
            type: `${namespace}/updateState`,
            payload: { operationPlanInfoRefreshId: record.ID },
        });
    }
    const [statusChangeVisible, setStatusChangeVisible] = useState(false)
    const [statusChangeTitle, setStatusChangeTitle] = useState()

    const statusChangeRecord = (record)=>{
        setStatusChangeVisible(true)
        setStatusChangeTitle('状态变更记录')
    }

    return (
        <div>
            <BreadcrumbWrapper>
                <OperationPlanQuery planType={type==3? 3 : ''} operateCol={operateCol} />
                <ViewPlanModal
                    visible={viewPlanVisible}
                    onCancel={() => { setViewPlanVisible(false) }}
                    type={type}
                    pointType={pointType}
                    entCode={entCode}
                />
                <Modal
                    visible={statusChangeVisible}
                    title={statusChangeTitle}
                    onCancel={() => { setStatusChangeVisible(false) }}
                    destroyOnClose
                    width={'60%'}
                    mask={false}
                    footer={null}
                >
                <RecordList/>
            </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);