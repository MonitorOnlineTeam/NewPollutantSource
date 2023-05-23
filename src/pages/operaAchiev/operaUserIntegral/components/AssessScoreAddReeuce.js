/**
 * 功  能：考核加分项
 * 创建人：jab
 * 创建时间：2023.05.19
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm,Tabs, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, ProfileOutlined, CodeSandboxCircleFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import RegionList from '@/components/RegionList'
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import styles from "../../style.less";
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const namespace = 'operaAchiev'

const dvaPropsData = ({ loading, operaAchiev, autoForm }) => ({
    tableDatas: operaAchiev.integralInfoViewList,
    tableTotal: operaAchiev.integralInfoViewTotal,
    tableLoading: loading.effects[`${namespace}/getOperationIntegralInfoViewList`],
})

const dvaDispatch = (dispatch) => {
    return {
        getOperationIntegralInfoViewList: (payload) => { //列表
            dispatch({
                type: `${namespace}/getOperationIntegralInfoViewList`,
                payload: payload,
            })
        },
    }
}

const Index = (props) => {



    const [form] = Form.useForm();



    const { tableTotal, tableDatas, tableLoading, exportLoading, detailPar } = props;


    useEffect(() => {
        props.getOperationIntegralInfoViewList({ ...detailPar, })

    }, []);



    const columns = [
        {
            title: '序号',
            align: 'center',
            // fixed:'left',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '运维人员姓名',
            dataIndex: 'UserName',
            key: 'UserName',
            align: 'center',
            // fixed:'left',
            width: 100,
            ellipsis: true,
          },
          {
            title: '工号',
            dataIndex: 'UserAccount',
            key: 'UserAccount',
            align: 'center',
            // fixed:'left',
            width: 120,
          },
          {
            title: '大区',
            dataIndex: 'UserGroupName',
            key: 'UserGroupName',
            align: 'center',
            // fixed:'left',
            width: 120,
            ellipsis: true,
          },
          {
            title: '未完成数量',
            dataIndex: 'NoNum',
            key: 'NoNum',
            align: 'center',
            width: 120,
          },
          {
            title: '考核分数',
            dataIndex: 'Integral',
            key: 'Integral',
            align: 'center',
            width: 120,
          },
          {
            title: '计分分类',
            dataIndex: 'IntegralClass',
            key: 'IntegralClass',
            align: 'center',
            width: 150,
            ellipsis: true,
          },
          {
            title: '具体内容',
            dataIndex: 'IntegralContent',
            key: 'IntegralContent',
            align: 'left',
            ellipsis: true,
          },
          {
            title: '统计周期',
            dataIndex: 'StatisticalCycle',
            key: 'StatisticalCycle',
            align: 'center',
            width: 120,
          },
          // {
          //   title: '考核月份',
          //   dataIndex: 'AssessmentMonth',
          //   key: 'AssessmentMonth',
          //   align: 'center',
          //   width: 100,
          // },
          // {
          //   title: '考核金额',
          //   dataIndex: 'AssessmentAmount',
          //   key: 'AssessmentAmount',
          //   align: 'center',
          //   width: 100,
          //   ellipsis: true,
          // },
          // {
          //   title: '直管经理',
          //   dataIndex: 'ManagerName',
          //   key: 'ManagerName',
          //   align: 'center',
          //   width: 100,
          //   ellipsis: true,
          // },
          // {
          //   title: '直管经理工号',
          //   dataIndex: 'ManagerNum',
          //   key: 'ManagerNum',
          //   align: 'center',
          //   width: 120,
          // },
          // {
          //   title: '直管经理考核',
          //   dataIndex: 'ManagerAmount',
          //   key: 'ManagerAmount',
          //   align: 'center',
          //   width: 120,
          // },
          // {
          //   title: '大区经理',
          //   dataIndex: 'RegionalName',
          //   key: 'RegionalName',
          //   align: 'center',
          //   width: 100,
          // },
          // {
          //   title: '大区经理工号',
          //   dataIndex: 'RegionalNum',
          //   key: 'RegionalNum',
          //   align: 'center',
          //   width: 120,
          // },
          // {
          //   title: '大区经理考核',
          //   dataIndex: 'RegionalAmount',
          //   key: 'RegionalAmount',
          //   align: 'center',
          //   width: 120,
          // },
    ];
    const columns2 = [
        {
            title: '序号',
            align: 'center',
            fixed:'left',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '运维人员姓名',
            dataIndex: 'UserName',
            key: 'UserName',
            align: 'center',
            fixed:'left',
            width: 100,
            ellipsis: true,
          },
          {
            title: '工号',
            dataIndex: 'UserAccount',
            key: 'UserAccount',
            align: 'center',
            fixed:'left',
            width: 120,
          },
          {
            title: '大区',
            dataIndex: 'UserGroupName',
            key: 'UserGroupName',
            align: 'center',
            width: 120,
            fixed:'left',
            ellipsis: true,
          },
          {
            title: '数量',
            dataIndex: 'NoNum',
            key: 'NoNum',
            align: 'center',
            width: 80,
          },
          {
            title: '增加分数',
            dataIndex: 'Integral',
            key: 'Integral',
            align: 'center',
            width: 100,
          },
          {
            title: '计分分类',
            dataIndex: 'IntegralClass',
            key: 'IntegralClass',
            align: 'center',
            width: 120,
            ellipsis: true,
          },
          {
            title: '具体内容',
            dataIndex: 'IntegralContent',
            key: 'IntegralContent',
            align: 'left',
            ellipsis: true,
          },
          {
            title: '统计周期',
            dataIndex: 'StatisticalCycle',
            key: 'StatisticalCycle',
            align: 'center',
            width: 120,
          },
    ];


    return (
        <div className={styles.operaAchievSty}>
            <Tabs tabPosition='left'>
                <TabPane tab="考核减分项" key="1">
                    <SdlTable
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas.MinusPointsList&&tableDatas.MinusPointsList[0]? tableDatas.MinusPointsList : []}
                        columns={columns}
                        pagination={false}
                    />
                </TabPane>
                <TabPane tab='考核加分项' key="2">
                    <SdlTable
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas.BonusPointsList&&tableDatas.BonusPointsList[0]? tableDatas.BonusPointsList : []}
                        columns={columns2}
                        pagination={false}
                    />
                </TabPane>
            </Tabs>
        </div >
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);