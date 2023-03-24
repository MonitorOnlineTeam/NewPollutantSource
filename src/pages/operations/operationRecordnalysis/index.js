/**
 * 功  能：运维记录
 * 创建人：jab
 * 创建时间：2022.04.20
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload, Tag, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, IssuesCloseOutlined, AuditOutlined, DownOutlined, ProfileOutlined, UploadOutlined, EditOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled, UnlockFilled, ToTopOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import styles from "./style.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RecordForm from '@/pages/operations/recordForm'
import ViewImagesModal from '@/pages/operations/components/ViewImagesModal';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'operationRecordnalysis'




const dvaPropsData = ({ loading, operationRecordnalysis, global, common, point, autoForm }) => ({
  clientHeight: global.clientHeight,
  taskTypeList: operationRecordnalysis.taskTypeList,
  taskTypeLoading: loading.effects[`${namespace}/getTaskTypeList`],
  tableDatas: operationRecordnalysis.tableDatas,
  tableLoading: loading.effects[`${namespace}/getoperationRecordnalysisByDGIMN`],
  tableTotal: operationRecordnalysis.tableTotal,
  exportLoading: loading.effects[`${namespace}/exportoperationRecordnalysisByDGIMN`],
  tableDatas2: operationRecordnalysis.tableDatas,
  tableLoading2: loading.effects[`${namespace}/getoperationRecordnalysisByDGIMN`],
  tableTotal2: operationRecordnalysis.tableTotal,
  exportLoading2: loading.effects[`${namespace}/exportoperationRecordnalysisByDGIMN`],
  accountQueryPar: operationRecordnalysis.accountQueryPar,
  imageListVisible: common.imageListVisible,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getTaskTypeList: (payload, callback) => { //获取工单类型
      dispatch({
        type: `${namespace}/getTaskTypeList`,
        payload: payload,
      })
    },
    getoperationRecordnalysisByDGIMN: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getoperationRecordnalysisByDGIMN`,
        payload: payload,
        callback: callback
      })
    },
    exportoperationRecordnalysisByDGIMN: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportoperationRecordnalysisByDGIMN`,
        payload: payload,
      })
    },
    getOperationImageList: (payload, callback) => { //电子表单 图片类型
      dispatch({
        type: 'common/getOperationImageList',
        payload: payload,
        callback: callback
      })
    },

  }
}
const Index = (props) => {


  const [form] = Form.useForm();
  const [form2] = Form.useForm();


  const { taskTypeLoading, taskTypeList, tableDatas, tableTotal, tableLoading, exportLoading, tableDatas2, tableTotal2, tableLoading2, exportLoading2, accountQueryPar, } = props;



  useEffect(() => {
    props.getTaskTypeList({});
    onFinish()
  }, []);

  const column = [
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省',
      dataIndex: 'Time',
      key: 'Time',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '市',
      dataIndex: 'Time',
      key: 'Time',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维企业数',
      dataIndex: 'OperationName',
      key: 'OperationName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维监测点数',
      dataIndex: 'OperationTypeName',
      key: 'OperationTypeName',
      align: 'center',
      ellipsis: true,
    },
  ];

  const [columns, setColumns] = useState([
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省',
      dataIndex: 'Time',
      key: 'Time',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '市',
      dataIndex: 'Time',
      key: 'Time',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维企业数',
      dataIndex: 'OperationName',
      key: 'OperationName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维监测点数',
      dataIndex: 'OperationTypeName',
      key: 'OperationTypeName',
      align: 'center',
      ellipsis: true,
    },
  ]);

  const onFinish = async () => {  //查询  par参数 分页需要的参数
    try {
      const values = await form.validateFields();

      props.getoperationRecordnalysisByDGIMN({
        ...values,
        Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
      }, (col) => {
        if (col && Object.keys(col).length) {
          const cols = []
          for (let key in col) {
            cols.push({
              title: col[key],
              dataIndex: key,
              key: key,
              align: 'center',
              ellipsis: true,
              render: (text, record, index) => {
                if (text && text != '-') {
                  if (text instanceof Array) {
                    return <a>查看详情</a>
                  }
                }
              }
            })
          }
          setColumns([...column, ...cols])
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async () => { //导出
    const values = await form.validateFields();
    props.exportKeyParameterQuestionList({
      ...values,
      Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,

    })
  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      initialValues={{
        time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day")],
        pointType: 2,
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={() => { onFinish() }}
    >
      <Form.Item label='运维日期' name='time' >
        <RangePicker_
          showTime={{
            format: 'YYYY-MM-DD HH:mm:ss',
            defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')]
          }}
          style={{ width: 350 }}
        />
      </Form.Item>
      <Form.Item label='监测点类型' name='pointType'>
        <Select placeholder='请选择' allowClear style={{ width: 150 }}>
          <Option key={2} value={2} >废气</Option>
          <Option key={1} value={1} >废水</Option>
        </Select>
      </Form.Item>
      <Spin spinning={taskTypeLoading} size='small'>
        <Form.Item label='运维内容' name='TaskType'>
          <Select placeholder='请选择' allowClear style={{ width: 150 }}>
            {taskTypeList.map(item => <Option key={item.ID} value={item.ID} >{item.TypeName}</Option>)}
          </Select>
        </Form.Item>
      </Spin>
      <Form.Item>
        <Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 8 }}>
          查询
          </Button>
        <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={exportLoading}>
          导出
          </Button>

      </Form.Item>

    </Form>
  }



  //上传台账
  const column2 = [
    {
      title: '省',
      dataIndex: 'Time',
      key: 'Time',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '市',
      dataIndex: 'OperationName',
      key: 'OperationName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维负责人',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维负责人工号',
      dataIndex: 'entName',
      key: 'entName',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
  ];
  const [columns2, setColumn2] = useState([]);
  const [accountVisible, setAccountVisible] = useState(true);
  const [accountTitle, setAccountTitle] = useState('');

  const [open, setOpen] = useState(false);

  const onFinish2 = async (pageIndexs, pageSizes, par) => {  //查询  par参数 分页需要的参数
    try {
      const values = await form.validateFields();

      props.getoperationRecordnalysisByDGIMN(par ? par : {
        ...values,
        PollutantType: PollutantType,
        Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        time2: undefined,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
      }, (col) => {
        if (col && Object.keys(col).length) {
          const cols = []
          for (let key in col) {
            cols.push({
              title: col[key],
              dataIndex: key,
              key: key,
              align: 'center',
              ellipsis: true,
              render: (text, record, index) => {
                if (text && text != '-') {
                  if (text instanceof Array) {
                    return <Popover
                      zIndex={800}
                      onOpenChange={(newOpen) => { setOpen(newOpen) }}
                      trigger="click"
                      open={open}
                      overlayClassName={styles.detailPopSty}
                      content={
                        <Table
                          bordered
                          size='small'
                          columns={[
                            {
                              align: 'center',
                              width: 50,
                              render: (text, record, index) => index + 1
                            },
                            {
                              align: 'center',
                              width: 100,
                              render: (text, record, index) => <a onClick={() => { detail(record) }}>查看详情</a>
                            }
                          ]}
                          dataSource={text} pagination={false} />
                      }>
                      <a>查看详情</a>
                    </Popover>
                  } else {
                    return text; //运维人员 运维内容 序号 运维日期 或工单类型为-
                  }
                }
              }
            })
          }
          setColumns([...column, ...cols])
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const searchComponents2 = () => {
    return <Form
      form={form2}
      name="advanced_search"
      layout='inline'
      initialValues={{
        time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day")],
        pointType: 2,
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={() => { setPageIndex2(1); onFinish2(1, pageSize2) }}
    >
      <Form.Item name='entName' >
        <Input placeholder='请输入企业名称' />
      </Form.Item>
      <Form.Item name='pointName' >
        <Input placeholder='请输入监测点名称' />
      </Form.Item>
      <Form.Item>
        <Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 8 }}>
          查询
          </Button>
        <Button icon={<ExportOutlined />} onClick={() => { exports2() }} loading={exportLoading}>
          导出
          </Button>

      </Form.Item>

    </Form>
  }

  const [pageSize2, setPageSize2] = useState(20)
  const [pageIndex2, setPageIndex2] = useState(1)
  const handleTableChange2 = (PageIndex, PageSize) => {
    setPageIndex2(PageIndex)
    setPageSize2(PageSize)
    onFinish(PageIndex, PageSize, { ...accountQueryPar, pageIndex: PageIndex, pageSize: PageSize })
  }
  const exports2 = async () => { //导出 上传台账
    const values = await form.validateFields();
    props.exportKeyParameterQuestionList({
      ...values,
      Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,

    })
  }



  //表单
  const [detailVisible, setDetailVisible] = useState(false)
  const [typeID, setTypeID] = useState(null)
  const [taskID, setTaskID] = useState(1)
  const detail = (record) => { //详情
    if (record.RecordType == 1) {
      setTypeID(record.TypeID);
      setTaskID(record.TaskID)
      setDetailVisible(true)
    } else {
      // 获取详情 图片类型表单
      props.getOperationImageList({ FormMainID: record.FormMainID })
    }
  }
  return (
    <div className={styles.operationRecordnalysisSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={false}
          />
        </Card>
        <Modal //台账详情
          visible={accountVisible}
          title={`${accountTitle}台账上传情况`}
          wrapClassName='spreadOverModal'
          footer={null}
          width={'100%'}
          onCancel={() => { setAccountVisible(false) }}
          destroyOnClose
        >
          <Card title={searchComponents2()}>
            <SdlTable
              resizable
              loading={tableLoading2}
              bordered
              dataSource={tableDatas2}
              columns={columns2}
              scroll={{ y: 'calc(100vh - 360px)' }}
              pagination={{
                total: tableTotal2,
                pageSize: pageSize2,
                current: pageIndex2,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: handleTableChange2,
              }}
            />
          </Card>
        </Modal>
        <Modal //表单详情
          visible={detailVisible}
          title={'详情'}
          wrapClassName='spreadOverModal'
          footer={null}
          width={'100%'}
          onCancel={() => { setDetailVisible(false) }}
          destroyOnClose
        >
          <RecordForm hideBreadcrumb match={{ params: { typeID: typeID, taskID: taskID } }} />
        </Modal>
        {props.imageListVisible && <ViewImagesModal />}
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);