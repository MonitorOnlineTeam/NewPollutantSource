/**
 * 功  能：绩效排名  用户运维积分
 * 创建人：jab
 * 创建时间：2023.05.19
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload, Tag, Tabs, Pagination, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ImportOutlined, ProfileOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
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
  summaryTableDatas: operaAchiev.integralGroupList,
  summaryTableTotal: operaAchiev.integralGroupTotal,
  summaryTableLoading: loading.effects[`${namespace}/getOperationIntegralGroupList`],
  integralQueryPar: operaAchiev.integralQueryPar,
  detailedTableDatas: operaAchiev.operationIntegralList,
  detailedTableTotal: operaAchiev.operationIntegralTotal,
  detailedTableLoading: loading.effects[`${namespace}/getOperationIntegralList`],
  integralDetailedQueryPar: operaAchiev.integralDetailedQueryPar,
  tableDatas2: operaAchiev.integralInfoList,
  tableTotal2: operaAchiev.integralInfoTotal,
  tableLoading2: loading.effects[`${namespace}/getOperationIntegralInfoList`],
  clientHeight: global.clientHeight,
  tableDatas3: operaAchiev.integralGroupInfoList,
  tableTotal3: operaAchiev.integralGroupInfoTotal,
  tableLoading3: loading.effects[`${namespace}/getOperationIntegralGroupInfoList`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getOperationIntegralList: (payload) => { //积分信息查询 汇总列表
      dispatch({
        type: `${namespace}/getOperationIntegralList`,
        payload: payload,
      })
    },
    getOperationIntegralInfoList: (payload) => { //积分信息查询  汇总详情列表
      dispatch({
        type: `${namespace}/getOperationIntegralInfoList`,
        payload: payload
      })
    },
    getOperationIntegralGroupList: (payload) => { //积分信息查询 明细列表
      dispatch({
        type: `${namespace}/getOperationIntegralGroupList`,
        payload: payload,
      })
    },
    getOperationIntegralGroupInfoList: (payload) => { //积分信息查询  明细详情列表
      dispatch({
        type: `${namespace}/getOperationIntegralGroupInfoList`,
        payload: payload
      })
    },
  }
}


const Index = (props) => {
  const [form] = Form.useForm();

  const { clientHeight, summaryTableDatas, summaryTableTotal, summaryTableLoading, integralQueryPar, detailedTableDatas, detailedTableTotal, detailedTableLoading, integralDetailedQueryPar, tableDatas2, tableTotal2, tableLoading2, tableDatas3, tableTotal3, tableLoading3, } = props;

  useEffect(() => {
    onFinish(summaryPageIndex, summaryPageSize)
    onFinish2(detailedPageIndex, detailedPageSize)

  }, [])

  const summaryColumns = [
    {
      title: '运维积分排名',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        return (index + 1) + (detailedPageIndex - 1) * detailedPageSize;
      }
    },
    {
      title: '大区',
      dataIndex: 'UserGroupName',
      key: 'UserGroupName',
      align: 'center',
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'GroupManager',
      key: 'GroupManager',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '运维人员数量',
      dataIndex: 'OperationNum',
      key: 'OperationNum',
      align: 'center',
      width: 100,
    },
    {
      title: '平均分',
      dataIndex: 'Average',
      key: 'Average',
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
  const detailedColumns = [
    {
      title: '倒序排名',
      align: 'center',
      dataIndex: 'Ranking',
      key: 'Ranking',
      width: 80,
    },
    {
      title: '员工编号',
      dataIndex: 'UserAccount',
      key: 'UserAccount',
      align: 'center',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '业务属性',
      dataIndex: 'Business',
      key: 'Business',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '所属大区',
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
    if (tabType == 1) {
      setTitle(`${record.UserGroupName} - 积分汇总详情`)
      props.getOperationIntegralGroupInfoList({
        GroupName: record.UserGroupName,
      })
    } else {
      setTitle(`${record.UserName} - 积分明细详情`)
      props.getOperationIntegralInfoList({
        UserId: record.UserId,
      })
    }
  }
  const detailCols = [
    {
      title: '倒序排名',
      align: 'center',
      dataIndex: 'Ranking',
      key: 'Ranking',
      width: 80,
      render:(text,record,index)=>{
          return index + 1;
      }
    },
    {
      title: '员工编号',
      dataIndex: 'UserAccount',
      key: 'UserAccount',
      align: 'center',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '业务属性',
      dataIndex: 'Business',
      key: 'Business',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '所属大区',
      dataIndex: 'UserGroupName',
      key: 'UserGroupName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: `4月考核扣分`,
      dataIndex: 'MinusPoints',
      key: 'MinusPoints',
      align: 'center',
      width: 110,
    },
    {
      title: `4月考核加分`,
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
      title: '操作',
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
  const onFinish =  (pageIndexs, pageSizes, queryPar) => {  //查询 积分汇总信息查询
      const values =  form.getFieldsValue();
      setSummaryPageIndex(pageIndexs);
      const par = queryPar ? { ...queryPar, pageIndex: pageIndexs, pageSize: pageSizes } : { ...values, pageIndex: pageIndexs, pageSize: pageSizes };
      props.getOperationIntegralGroupList(par)
  }
  const onFinish2 =   (pageIndexs, pageSizes, queryPar) => {  //查询 积分明细信息查询
      const values =  form.getFieldsValue();
      setDetailedPageIndex(pageIndexs);
      const par = queryPar ? { ...queryPar, pageIndex: pageIndexs, pageSize: pageSizes } : { ...values, UserName: values.UserName2, UserName2: undefined, pageIndex: pageIndexs, pageSize: pageSizes };
      props.getOperationIntegralList(par)
    
  }


  const [summaryPageIndex, setSummaryPageIndex] = useState(1)
  const [summaryPageSize, setSummaryPageSize] = useState(20)
  const summaryHandleTableChange = (PageIndex, PageSize) => { //积分汇总 分页
    setSummaryPageIndex(PageIndex)
    setSummaryPageSize(PageSize)
    onFinish(PageIndex, PageSize, integralQueryPar)

  }

  const [scoreVisible, setScoreVisible] = useState(false)
  const [scoreTitle, setScoreTitle] = useState(null)
  const [scoreDetailPar, setDetailPar] = useState(null)
  const scoreDetail = (record) => {
    setScoreVisible(true)
    setScoreTitle(`${record.UserName} - 分数详情`)
    setDetailPar({ UserId: record.UserId, })
  }

  const [detailedPageIndex, setDetailedPageIndex] = useState(1)
  const [detailedPageSize, setDetailedPageSize] = useState(20)
  const detailedHandleTableChange = (PageIndex, PageSize) => { //积分明细 分页
    setDetailedPageIndex(PageIndex)
    setDetailedPageSize(PageSize)
    onFinish2(PageIndex, PageSize, integralDetailedQueryPar)

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

  const [importLoading, setImportLoading] = useState(false)
  const uplodProps = {
    name: 'file',
    accept: '.xls,.xlsx',
    showUploadList: false,
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
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        setImportLoading(true)
      } else if (info.file.status === 'done') {
        message.success(`${info.file.name}导入成功`);
        onFinish(1, summaryPageSize)
        onFinish2(1, detailedPageSize)
        setImportLoading(false)

      } else if (info.file.status === 'error') {
        message.error(`${info.file.name}${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '导入失败'}`);
        setImportLoading(false)
      }
    },

  }
  const QueryFormItem = ({type}) => <Form.Item>
    <Button type="primary" htmlType="submit" loading={type == 1?  summaryTableLoading : detailedTableLoading}>
      查询
    </Button>
    <Button style={{ margin: '0 8px', }}
     onClick={() => { type == 1?    
      form.setFieldsValue({GroupName:'',UserName:''}) :  form.setFieldsValue({UserNum:'',UserName2:''})}} 
     >
      重置
    </Button>
    {/* <Upload {...uplodProps}>
      <Button
        icon={<ImportOutlined />}
        loading={importLoading}
      >
        导入
    </Button>
    </Upload> */}
  </Form.Item>
  const searchComponents = (type) => {
    return <Form
      name="advanced_search"
      form={form}
      layout='inline'
      onFinish={() => {type == 1 ? onFinish(1, summaryPageSize) :  onFinish2(1, detailedPageSize)}}
      initialValues={{
      }}
    >
      {type == 1 ?
        <>
          <Form.Item label='大区名称' name='GroupName'>
            <Input placeholder='请输入' allowClear={true} />
          </Form.Item>
          <Form.Item label='姓名' name='UserName'>
            <Input placeholder='请输入' allowClear={true} />
          </Form.Item>
          <QueryFormItem />
        </>
        :
        <>
          <Form.Item label='员工编号' name='UserNum'>
            <Input placeholder='请输入' allowClear={true} />
          </Form.Item>
          <Form.Item label='姓名' name='UserName2'>
            <Input placeholder='请输入' allowClear={true} />
          </Form.Item>
          <QueryFormItem type/>
        </>
      }

    </Form>
  }

  const [tabType, setTabType] = useState('1')
  return (
    <div className={styles.operaUserIntegralSty}>
      <BreadcrumbWrapper>
          <Tabs tabPosition='left' onChange={(key) => { setTabType(key) }}>
            <TabPane tab="积分汇总" key="1">
            <Card title={searchComponents(1) }>
              <SdlTable
                loading={summaryTableLoading}
                bordered
                dataSource={summaryTableDatas}
                columns={summaryColumns}
                pagination={{
                  total: summaryTableTotal,
                  current: summaryPageIndex,
                  summaryPageSize: summaryPageSize,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: summaryHandleTableChange,
                }}
              />
              </Card>
            </TabPane>
            <TabPane tab='积分明细' key="2">
            <Card title={searchComponents(2) }>
              <SdlTable
                loading={detailedTableLoading}
                bordered
                dataSource={detailedTableDatas}
                columns={detailedColumns}
                pagination={{
                  total: detailedTableTotal,
                  current: detailedPageIndex,
                  summaryPageSize: detailedPageSize,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: detailedHandleTableChange,
                }}
              />
                </Card>
            </TabPane>
          </Tabs>
        
        <Modal
          title={title}
          visible={visible}
          footer={null}
          onCancel={() => { setVisible(false) }}
          destroyOnClose
          wrapClassName='spreadOverModal'
          zIndex={998}
        >
          {tabType == 1 ?
            <SdlTable
            loading={tableLoading3}
            bordered
            dataSource={tableDatas3}
            columns={detailCols.filter(item => item.title != '4月考核扣分' && item.title != '4月考核加分' && item.title != '操作')}
            pagination={false}
          />
            :
            <SdlTable
              loading={tableLoading2}
              bordered
              dataSource={tableDatas2}
              columns={detailCols}
              pagination={false}
            />
          }
        </Modal>
        <Modal
          title={scoreTitle}
          visible={scoreVisible}
          footer={null}
          onCancel={() => { setScoreVisible(false) }}
          destroyOnClose
          wrapClassName='spreadOverModal'
          className={styles.scoreModalSty}
          zIndex={999}
        >
          <AssessScoreAddReeuce props detailPar={scoreDetailPar} />
        </Modal>
      </BreadcrumbWrapper>


    </div >
  );
};


export default connect(dvaPropsData, dvaDispatch)(Index);