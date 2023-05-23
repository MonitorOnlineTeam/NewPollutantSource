/**
 * 功  能：运维绩效  用户运维积分
 * 创建人：jab
 * 创建时间：2023.05.19
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Upload, Tag, Tabs, Pagination, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,ImportOutlined, ProfileOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import config from '@/config';
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import styles from "../style.less";
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

import AssessScoreAddReeuce from './components/AssessScoreAddReeuce'

const namespace = 'operaAchiev'
const dvaPropsData = ({ loading, operaAchiev, global }) => ({
  tableDatas: operaAchiev.operationIntegralList,
  tableTotal: operaAchiev.operationIntegralTotal,
  tableLoading: loading.effects[`${namespace}/getOperationIntegralList`],
  tableDatas2: operaAchiev.integralInfoList,
  tableTotal2: operaAchiev.integralInfoTotal,
  tableLoading2: loading.effects[`${namespace}/getOperationIntegralInfoList`],
  integralQueryPar: operaAchiev.integralQueryPar,
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
    getOperationIntegralList: (payload) => { //运维人员积分 列表
      dispatch({
        type: `${namespace}/getOperationIntegralList`,
        payload: payload,
      })
    },
    getOperationIntegralInfoList: (payload) => { //运维人员积分 详情列表
      dispatch({
        type: `${namespace}/getOperationIntegralInfoList`,
        payload: payload
      })
    },
  }
}


const Index = (props) => {
  const [form] = Form.useForm();

  const { clientHeight, tableDatas, tableTotal, tableLoading, tableDatas2, tableTotal2, tableLoading2, integralQueryPar, } = props;

  useEffect(() => {
    onFinish(pageIndex, pageSize)
  }, [])
  const columns = [
    {
      title: '考核排名',
      align: 'center',
      dataIndex: 'Ranking',
      key: 'Ranking',
      width: 80,
    },
    {
      title: '运维人员姓名',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '工号',
      dataIndex: 'UserAccount',
      key: 'UserAccount',
      align: 'center',
      width: 150,
    },
    {
      title: '大区',
      dataIndex: 'UserGroupName',
      key: 'UserGroupName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维人员积分',
      dataIndex: 'Integral',
      key: 'Integral',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      align: 'center',
      width: 70,
      render: (text, record) => {
        return <span>
          <Fragment>
            <Tooltip title="详情">
              <a onClick={() => { detail(record) }}>  <ProfileOutlined style={{ fontSize: 16 }} /></a>
            </Tooltip>
          </Fragment>
        </span>
      }
    },
  ];
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState(null)
  const detail = (record) => {
    setVisible(true)
    setTitle(`${record.UserName} - 积分详情`)
    props.getOperationIntegralInfoList({
      UserId: record.UserId,
    })
  }
  const columns2 = [
    {
      title: '考核排名',
      align: 'center',
      dataIndex: 'Ranking',
      key: 'Ranking',
      width: 80,
    },
    {
      title: '运维人员姓名',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '工号',
      dataIndex: 'UserAccount',
      key: 'UserAccount',
      align: 'center',
      width: 150,
    },
    {
      title: '大区',
      dataIndex: 'UserGroupName',
      key: 'UserGroupName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: `4月考核分数`,
      dataIndex: 'MinusPoints',
      key: 'MinusPoints',
      align: 'center',
      width: 110,
    },
    {
      title: `4月加分`,
      dataIndex: 'BonusPoints',
      key: 'BonusPoints',
      align: 'center',
      width: 100,
    },
    {
      title: '运维人员积分',
      dataIndex: 'Integral',
      key: 'Integral',
      align: 'center',
      width: 150,
    },
    {
      title: <span>操作</span>,
      align: 'center',
      render: (text, record) => {
        return <span>
          <Fragment>
            <Tooltip title="详情">
              <a onClick={() => { scoreDetail(record, 'isDetailed') }}>  <ProfileOutlined style={{ fontSize: 16 }} /></a>
            </Tooltip>
          </Fragment>
        </span>
      }
    },
  ];
  const onFinish = async (pageIndexs, pageSizes, queryPar) => {  //查询 运维人员积分
    try {
      const values = await form.validateFields();
      setPageIndex(pageIndexs);
      const par = {
        ...values,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
      }
      props.getOperationIntegralList(queryPar ? {...queryPar,pageIndex:pageIndexs,pageSize:pageSizes} : par)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }



  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => { //运维人员积分 分页
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize, integralQueryPar)

  }


  const [scoreVisible, setScoreVisible] = useState(false)
  const [scoreTitle, setScoreTitle] = useState(null)
  const [scoreDetailPar, setDetailPar] = useState(null)
  const scoreDetail = (record) => {
    setScoreVisible(true)
    setScoreTitle(`${record.UserName} - 分数详情`)
    setDetailPar({ UserId: record.UserId,})
  }

  const importData = () => {
    const values = form.getFieldsValue();
    const par = {
      ...values,
      UserId: userId,
      Month: values.Month && moment(values.Month).format("YYYY-MM-01 00:00:00"),
      Sort: sortField,
    }
    props.exportPersonalPerformanceRate({ ...par })
  };

 const [importLoading,setImportLoading] = useState(false)
 const uplodProps = {
  name: 'file',
  accept: '.xls,.xlsx',
  showUploadList:false,
  action: '/api/rest/PollutantSourceApi/BaseDataApi/ImportOperationIntegral',
  headers: {
    Authorization: "Bearer " + Cookie.get(config.cookieName),
  },
  beforeUpload: (file) => {
    const fileType = file?.name; //获取文件类型 type xls/*1
    if (!(/.xls/g.test(fileType))) {
      message.error(`请上传xls或xlsx文件!`);
      return false;
    }
  },
  onChange:(info)=>{
    if (info.file.status === 'uploading') {
      setImportLoading(true)
    }else if (info.file.status === 'done') {
      message.success(`${info.file.name}导入成功`);
      onFinish(1,pageSize)
      setImportLoading(false)
                                                           
    } else if(info.file.status === 'error') {
      message.error(`${info.file.name}${info.file&&info.file.response&&info.file.response.Message? info.file.response.Message : '导入失败'}`);
      setImportLoading(false)  
    }
  },

}

  const searchComponents = () => {
    return <Form
      name="advanced_search"
      form={form}
      layout='inline'
      onFinish={() => { onFinish(1, pageSize) }}
      initialValues={{
      }}
    >
      <Form.Item label='员工编号' name='UserNum'>
        <Input placeholder='请输入' allowClear={true} />
      </Form.Item>
      <Form.Item label='姓名' name='UserName'>
        <Input placeholder='请输入' allowClear={true} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={tableLoading}>
          查询
      </Button>
        <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
          重置
      </Button>
        <Upload {...uplodProps}>
          <Button
            icon={<ImportOutlined />}
            loading={importLoading}
          >
            导入
        </Button>
        </Upload>
      </Form.Item>

    </Form>
  }


  return (
    <div className={styles.achievQuerySty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={{
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }}
          />
        </Card>
        <Modal
          title={title}
          visible={visible}
          footer={null}
          onCancel={() => { setVisible(false) }}
          destroyOnClose
          wrapClassName='spreadOverModal'
          zIndex={998}
        >
          <SdlTable
            loading={tableLoading2}
            bordered
            dataSource={tableDatas2}
            columns={columns2}
            pagination={false}
          />
        </Modal>
        <Modal
          title={scoreTitle}
          visible={scoreVisible}
          footer={null}
          onCancel={() => { setScoreVisible(false) }}
          destroyOnClose
          wrapClassName='spreadOverModal'
          zIndex={999}
        >
          <AssessScoreAddReeuce props detailPar={scoreDetailPar} />
        </Modal>
      </BreadcrumbWrapper>


    </div >
  );
};


export default connect(dvaPropsData, dvaDispatch)(Index);