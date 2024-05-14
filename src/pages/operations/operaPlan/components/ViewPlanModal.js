/**
 * 功  能：预测性维护 运维计划  查看计划弹框
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
    tableLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    tableDatas: operaPlan.formulateTableDatas,
    tableTotal: operaPlan.formulateTableTotal,
    queryPar: operaPlan.formulateQueryPar,
    exportLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    configInfo: global.configInfo,
})

const Index = (props) => {







    const { visible } = props;

    



    return (
        <div>
                <Modal
                    visible={visible}
                    title={'查看计划'}
                    onCancel={() => { props.onCancel && props.onCancel()}}
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
                                children: <PlanList type={3} planContentOpera={[]}/>,
                            },
                            {
                                label: '计划日历',
                                key: '2',
                                children: <PlanCalendar />,
                            },
                        ]}
                    />
                </Modal>


        </div>
    );
};
export default connect(dvaPropsData)(Index);