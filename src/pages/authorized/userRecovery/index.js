

/**
 * 功  能：用户回复
 * 创建人：jab
 * 创建时间：2022.05.25
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled ,SyncOutlined,} from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import NumTips from '@/components/NumTips'
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'user'




const dvaPropsData = ({ loading, user,common, global }) => ({
    tableDatas:common.userList,
    tableTotal: common.userTotal,
    tableLoading: loading.effects[`common/getUserList`],
    clientHeight: global.clientHeight,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getTableData: (payload) => { //列表
            dispatch({
                type: `common/getUserList`,
                payload: payload,
            })
        },
        recoveryUser: (payload) => { //用户恢复
            dispatch({
                type: `${namespace}/recoveryUser`,
                payload: payload,
            })
        },
    }
}
const Index = (props) => {



    const [form] = Form.useForm();


    const { tableDatas, tableTotal, tableLoading, } = props;


    useEffect(() => {
        onFinish(pageIndex, pageSize)
    }, []);

    const columns = [

        {
            title: '登录名',
            dataIndex: 'userAccount',
            key: 'userAccount',
            align: 'center',
        },

        {
            title: '真实姓名',
            dataIndex: 'userName',
            key: 'userName',
            align: 'center',
        },
        {
            title: '部门',
            dataIndex: 'groupName',
            key: 'groupName',
            align: 'center',
            render: (text, record) => {
                return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
             },
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (text, record) => {
                return  text=='正常'? <Tag color="green"> 正常 </Tag> : <Tag color="red"> 已删除 </Tag>
             },
        },
          {
            title: <span>操作</span>,
            dataIndex: '',
            key: '',
            align: 'center',
            render:(text,row)=>{
              return (
                <Fragment>
                 <Divider type="vertical" />
                <Tooltip title="恢复">
                  <Popconfirm
                    title="确认要恢复此用户吗?"
                    onConfirm={() => {
                      recoveryUser(row);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <a><SyncOutlined style={{ fontSize: 16 }} /></a>
                  </Popconfirm>
                </Tooltip> 
              </Fragment>
              );
            }
          },
    ];

   const recoveryUser = (row) =>{
    props.recoveryUser({
        userID: row.ID,
    })
   }



    const onFinish = async (pageIndexs, pageSizes) => {  //查询
        try {
            const values = await form.validateFields();
            setPageIndex(pageIndexs)
            props.getTableData({
                ...values,
                status:'1',
                pageIndex: pageIndexs,
                pageSize: pageSizes
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo); 
        }
    }




    const handleTableChange = (PageIndex, PageSize) => {
        setPageIndex(PageIndex)
        setPageSize(PageSize)
        onFinish(PageIndex, PageSize)
    }



    const [pageSize, setPageSize] = useState(20)
    const [pageIndex, setPageIndex] = useState(1)

    const searchComponents = () => {
        return <><Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(1, pageSize) }}
            initialValues={{
            }}
            layout='inline'
        >
            <Form.Item label='登录名' name='userAccount'>
                <Input allowClear placeholder='请输入' />
            </Form.Item>
            <Form.Item label='真实姓名' name='userName' >
              <Input allowClear placeholder='请输入' />
            </Form.Item>
            <Form.Item>
                <Button loading={tableLoading} type="primary" loading={tableLoading} htmlType="submit">
                    查询
       </Button>
                <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                    重置
        </Button>
            </Form.Item>
        </Form>
        </>
    }
    return (
        <div>
            <Card title={searchComponents()}>
                <SdlTable
                    loading={tableLoading}
                    bordered
                    dataSource={tableDatas}
                    columns={columns}
                    // pagination={{
                    //     total: tableTotal,
                    //     pageSize: pageSize,
                    //     current: pageIndex,
                    //     showSizeChanger: true,
                    //     showQuickJumper: true,
                    //     onChange: handleTableChange,
                    // }}
                />
            </Card>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);

