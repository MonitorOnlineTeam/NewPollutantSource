/**
 * 功  能：客户满意度 客户满意度调查
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Popover, Radio, Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import moment from 'moment';
import Cookie from 'js-cookie';
import config from '@/config';
import ImageView from '@/components/ImageView';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import TitleComponents from '@/components/TitleComponents'
import SetUserListBtn from "@/components/SetUserListBtn";
import DispatchDetails from "./components/DispatchDetails";
import InvestigaContent from "./components/InvestigaContent";
import InvestigateModal from "./components/InvestigateModal";
import HandleModal from "./components/HandleModal";
import UserList from '@/components/UserList'
import { permissionButton } from '@/utils/utils';
import { API } from '@config/API';
import cuid from 'cuid';
import styles from "./style.less"
const { Option } = Select;
const { Step } = Steps;
const namespace = 'customerSatisfacQuery'

const dvaPropsData = ({ loading, customerSatisfacQuery, global, }) => ({
  tableLoading: customerSatisfacQuery.tableLoading,
  tableDatas: customerSatisfacQuery.tableDatas,
  tableTotal: customerSatisfacQuery.tableTotal,
  queryPar: customerSatisfacQuery.queryPar,
  tableLoading2: customerSatisfacQuery.tableLoading2,
  tableDatas2: customerSatisfacQuery.tableDatas2,
  tableTotal2: customerSatisfacQuery.tableTotal2,
  queryPar2: customerSatisfacQuery.queryPar2,
  exportLoading: customerSatisfacQuery.exportLoading,
  exportLoading2: customerSatisfacQuery.exportLoading2,
  largeRegionListLoading: loading.effects[`ctCommon/GetLargeRegionList`],
  submitRerminaLoading: loading.effects[`${namespace}/SubmitRermination`],
  transmitSurveyLoading: loading.effects[`${namespace}/TransmitSurvey`],
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form] = Form.useForm();
  const [formAll] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();



  const { largeRegionListLoading, queryPar, tableDatas, tableTotal, tableLoading, queryPar2, tableDatas2, tableTotal2, tableLoading2, auditPhotoLoading, installPhotoData, addAuditInfoLoading, exportLoading, exportLoading2, submitRerminaLoading, transmitSurveyLoading, viewOnlyAll, isHome, initDate, } = props;


  const [exportIndex, setExportIndex] = useState(-1);

  const [largeRegionList, setLargeRegionList] = useState([]);
  const [provinceList, setProvincelist] = useState([]);
  const [provinceList2, setProvincelist2] = useState([]);
  const [provinceAllList, setProvinceAlllist] = useState([]);
  const [popVisible, setPopVisible] = useState(false);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [popVisible2, setPopVisible2] = useState(false);
  const [selectIndex2, setSelectIndex2] = useState(-1);



  const [confiAssistantCheckBtn, setConfiAssistantCheckBtn] = useState(false);

  const isAll = props.match.path == '/ctManage/customerSatisfaction/customerSatisfacQueryAll'

  useEffect(() => {
    const buttonList = permissionButton(props.match.path)
    buttonList.map(item => {
      switch (item) {
        case 'confiAssistantChecklist': setConfiAssistantCheckBtn(true); break;
      }
    })
    props.dispatch({
      type: `ctCommon/GetLargeRegionList`,
      payload: {},
      callback: (res) => {
        setLargeRegionList(res)
        const data = [];
        res.map(item => {
          if (item.ChildList?.[0]) {
            item.ChildList.map(childListItem => {
              data.push(childListItem)
            })
          }

        })
        setProvinceAlllist(data)
        // 仅查看所有数据
        if (viewOnlyAll) {
          onFinish(1, pageIndex2, pageSize2);
          return;
        }
        onFinish(2, pageIndex, pageSize);
      },
    })
  }, []);

  const [viewAllVisible, setViewAllVisible] = useState(false)

  const viewAllData = () => {
    setViewAllVisible(true)
    formAll.resetFields()
    setPopVisible(false)
    setPopVisible2(false)
    setTimeout(()=>{
      onFinish(1, pageIndex2, pageSize2);
    })
  }

  const columns = (type) => [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '派工单号',
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '派单时间',
      dataIndex: 'OrderDate',
      key: 'OrderDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同类型',
      dataIndex: 'ProjectType',
      key: 'ProjectType',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '最终用户',
      dataIndex: 'CustomEnt',
      key: 'CustomEnt',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '大区名称',
      dataIndex: 'ServiceAreaName',
      key: 'ServiceAreaName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省份',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '行业',
      dataIndex: 'Industry',
      key: 'Industry',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务工程师',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '工程师行政区域',
      dataIndex: 'ServiceAreaName',
      key: 'ServiceAreaName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务主要内容',
      dataIndex: 'Remark',
      key: 'Remark',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务完成日期',
      dataIndex: 'LeaveDate',
      key: 'LeaveDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '客户姓名',
      dataIndex: 'ContactsName',
      key: 'ContactsName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '客户电话',
      dataIndex: 'Phone',
      key: 'Phone',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '工程师服务态度（1-5分）',
      dataIndex: 'ServiceAttitude',
      key: 'ServiceAttitude',
      align: 'center',
      ellipsis: true,
      width: 170,

    },
    {
      title: '工程师技术水平（1-5分）',
      dataIndex: 'TechnicalLevel',
      key: 'TechnicalLevel',
      align: 'center',
      ellipsis: true,
      width: 170,
    },

    {
      title: '客户问题及建议',
      dataIndex: 'Problem',
      key: 'Problem',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '总得分',
      dataIndex: 'TotalScore',
      key: 'TotalScore',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查人员',
      dataIndex: 'InvestigatorName',
      key: 'InvestigatorName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查日期',
      dataIndex: 'InvestigationTime',
      key: 'InvestigationTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查提交时间',
      dataIndex: 'InvestigationSubTime',
      key: 'InvestigationSubTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '终止调查原因',
      dataIndex: 'RerminationRemark',
      key: 'RerminationRemark',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查状态',
      dataIndex: 'InvestigationStatusName',
      key: 'InvestigationStatusName',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return <span style={{ color: text == '待调查' ? '#f5222d' : 'rgba(0, 0, 0, 0.85)' }}>{text}</span>
      }
    },
    {
      title: '处理状态',
      dataIndex: 'ProcessingStatusName',
      key: 'ProcessingStatusName',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return <span style={{ color: text == '待处理' ? '#f5222d' : 'rgba(0, 0, 0, 0.85)' }}>{text}</span>
      }
    },
    {
      title: '处理办法',
      dataIndex: 'ProcessedMethod',
      key: 'ProcessedMethod',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '处理人',
      dataIndex: 'ProcessedByName',
      key: 'ProcessedByName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '处理填写时间',
      dataIndex: 'ProcessedTime',
      key: 'ProcessedTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: type == 1 ? 80 : 280,
      ellipsis: true,
      fixed: 'right',
      render: (text, record, index) => {
        return type == 1 ?
          <a onClick={() => detail(record)}>详细</a>  //查看所有数据
          :
          <>
            <a onClick={() => detail(record)}>详细</a>
            {(record.IsInvestigator && record.InvestigationStatusName == '待调查') || (record.IsProcessedBy && record.ProcessingStatusName == '待处理') ? <Divider type="vertical" /> : ''}
            {record.IsInvestigator && record.InvestigationStatusName == '待调查' && <><a onClick={() => investigate(record)}>调查</a><Divider type="vertical" />
              <Popover visible={popVisible && selectIndex == index} placement='left' title={'终止调查'} trigger="click"
                overlayStyle={{ width: 400 }}
                content={
                  <Form
                    name="basic2"
                    form={form2}
                    onFinish={(values) => terminaInvestiga(values, record)}
                  >
                    <Form.Item label="终止调查原因" name="rerminationRemark" rules={[{ required: true, message: '请输入终止调查原因！' }]} >
                      <Input.TextArea rows={2} placeholder='请输入' allowClear />
                    </Form.Item>
                    <Row align='end'>
                      <Button onClick={() => { setPopVisible(false) }} style={{ marginRight: 8 }} >
                        取消
                </Button>
                      <Button type="primary" htmlType='submit' loading={submitRerminaLoading}>
                        保存
                  </Button>
                    </Row>
                  </Form>
                }
              >
                <a onClick={() => { setPopVisible(true); setSelectIndex(index); form2.resetFields(); setPopVisible2(false) }}>终止调查</a>
              </Popover>
              <Divider type="vertical" />
              <Popover visible={popVisible2 && selectIndex2 == index} placement='left' title={'任务转发'} trigger="click"
                overlayStyle={{ width: 400 }}
                content={
                  <Form
                    name="basic3"
                    form={form3}
                    onFinish={(values) => forward(values, record)}
                  >
                    <Form.Item label="转发人" name="userId" rules={[{ required: true, message: '请选择转发人！' }]} >
                      <UserList />
                    </Form.Item>
                    <Row align='end'>
                      <Button onClick={() => { setPopVisible2(false) }} style={{ marginRight: 8 }} >
                        取消
                </Button>
                      <Button type="primary" htmlType='submit' loading={transmitSurveyLoading}>
                        保存
                  </Button>
                    </Row>
                  </Form>
                }>
                <a onClick={() => { setPopVisible2(true); setSelectIndex2(index); form3.resetFields(); setPopVisible(false) }}>转发</a>
              </Popover>
            </>}
            {record.IsProcessedBy && record.ProcessingStatusName == '待处理' && <><a onClick={() => handle(record)}>处理</a></>}
          </>

      }
    }
  ];
  const largeRegionChange = (value) => {
    form.setFieldsValue({ province: undefined })
    const data = value ? provinceAllList.filter(item => item.ID == value) : []
    setProvincelist(data)
  }
  const largeRegionChange2 = (value) => {
    formAll.setFieldsValue({ province: undefined })
    const data = value ? provinceAllList.filter(item => item.ID == value) : []
    setProvincelist2(data)
  }

  const terminaInvestiga = (values, row) => {
    props.dispatch({
      type: `${namespace}/SubmitRermination`,
      payload: {
        ...values,
        id: row?.ID,
      },
      callback: () => {
        setPopVisible(false)
        onFinish(2, pageIndex, pageSize)
      }
    });
  }
  const forward = (values, row) => {
    props.dispatch({
      type: `${namespace}/TransmitSurvey`,
      payload: {
        ...values,
        id: row?.ID,
        num: row?.Num,
      },
      callback: () => {
        setPopVisible2(false)
        onFinish(2, pageIndex, pageSize)
      }
    });
  }
  const [data, setData] = useState([1])

  const [detailVisible, setDetailVisible] = useState(false)
  const detail = (row) => {
    setDetailVisible(true)
    setData(row)
  }

  const [handleVisible, setHandleVisible] = useState(false)
  const [handleData, setHandleData] = useState([1])
  const handle = (row) => {
    setHandleVisible(true)
    setData(row)
  }

  const [investigateVisible, setInvestigateVisible] = useState(false)
  const investigate = (row) => {
    setInvestigateVisible(true)
    setData(row)

  }

  const onFinish = async (type, PageIndex, PageSize, queryPar) => {  //查询

    try {
      const values = type == 1 ? await formAll.validateFields() : await form.validateFields();
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        processingStatus: isHome ? 2 : values.processingStatus,
        bTime: values.time?.[0] && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        eTime: values.time?.[1] && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        LeaveBtime: values.time2?.[0] && moment(values.time2[0]).format('YYYY-MM-DD 00:00:00'),
        LeaveEtime: values.time2?.[1] && moment(values.time2[1]).format('YYYY-MM-DD 23:59:59'),
        SubBtime: values.time3?.[0] && moment(values.time3[0]).format('YYYY-MM-DD 00:00:00'),
        SubEtime: values.time3?.[1] && moment(values.time3[1]).format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        time2: undefined,
        time3: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
        allData: type,
      }
      props.dispatch({
        type: `${namespace}/GetSatisfactionSurveyList`,
        payload: {
          ...par,
        },
        callback: () => {
          if (type == 2) {
            setPopVisible(false)
            setPopVisible2(false)
          }
        }

      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(2, PageIndex, PageSize, queryPar)
  }

  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(20)
  const handleTableChange2 = (PageIndex, PageSize) => { //分页
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    onFinish(1, PageIndex, PageSize, queryPar2)
  }
  const exports = (type) => {
    props.dispatch({
      type: `${namespace}/ExportSatisfactionSurvey`,
      payload: type == 2 ? {...queryPar,pageIndex:1,pageSize:999999} : {...queryPar2,pageIndex:1,pageSize:999999},
    });
  }
  const searchComponents = (type) => {
    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { setPageIndex(1); setPageSize(20); onFinish(2, 1, 20) }}
      initialValues={{
        time2: [moment().add(-1, 'months').startOf('day'), moment().endOf('day')]
      }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Spin size='small' spinning={largeRegionListLoading} className='formItemSpinSty'>
            <Form.Item name='serviceAreaCode' label='大区名称'   className='form_label_width_97'>
              <Select placeholder='请选择' onChange={largeRegionChange} allowClear>
                {largeRegionList.map(item => <Option value={item.ID}>{item.LargeRegion}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={8}>
          <Spin size='small' spinning={largeRegionListLoading} className='formItemSpinSty'>
            <Form.Item name='province' className='minWidth4' label='省份' >
              <Select placeholder='请选择' allowClear>
                {provinceList.map(item => <Option value={item.RegionCode}>{item.RegionName}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
        </Col>

        <Col span={8} >
          <Form.Item name='projectCode' label='项目编号' >
            <Input placeholder="合同编号、立项号" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='time2' label='服务完成日期'>
            <RangePicker_ style={{ width: '100%' }}
              allowClear={false}
              showTime={false}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button style={{ margin: '0 8px' }} loading={tableLoading} onClick={() => { form.resetFields(); setPageIndex(1); setPageSize(20); onFinish(type, 1, 20) }}  >
              重置
         </Button>
            <Button style={{ marginRight: 8 }} icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports(type) }}>
              导出
         </Button>
            {confiAssistantCheckBtn && <SetUserListBtn type={5} text='配置调查人员清单' onClick={() => { setPopVisible(false); setPopVisible2(false) }} />}
            <Button type="primary" onClick={viewAllData}>
              查看所有数据
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  const searchComponents2 = (type) => {
    return <Form
      form={formAll}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      initialValues={{
        time: initDate || [],
        time2: [moment().add(-1, 'months').startOf('day'), moment().endOf('day')]
      }}
      onFinish={() => { setPageIndex2(1); setPageSize2(20); onFinish(1, 1, 20) }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Spin size='small' spinning={largeRegionListLoading} className='formItemSpinSty'>
            <Form.Item name='serviceAreaCode' label='大区名称' className='form_label_width_97'>
              <Select placeholder='请选择' onChange={largeRegionChange2} allowClear>
                {largeRegionList.map(item => <Option value={item.ID}>{item.LargeRegion}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={8}>
          <Spin size='small' spinning={largeRegionListLoading} className='formItemSpinSty'>
            <Form.Item name='province' className='minWidth' label='省份'  className='form_label_width_97'>
              <Select placeholder='请选择' allowClear>
                {provinceList2.map(item => <Option value={item.RegionCode}>{item.RegionName}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={8} >
          <Form.Item name='projectCode' label='项目编号' >
            <Input placeholder="合同编号、立项号" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='customEnt' label='最终用户' className='form_label_width_97'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='time2' label='服务完成日期'>
            <RangePicker_ style={{ width: '100%' }}
              showTime={false}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>

        <Col span={8} >
          <Form.Item name='investigator' className='minWidth' label='调查人' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        {!isHome && <><Col span={8} >
          <Form.Item name='investigationStatus' label='调查状态' className='form_label_width_97'>
            <Select placeholder='请选择' allowClear>
              <Option value={1}>待调查</Option>
              <Option value={2}>调查终止</Option>
              <Option value={3}>调查结束</Option>
            </Select>
          </Form.Item>
        </Col>
          <Col span={8} >
            <Form.Item name='processingStatus' label='处理状态'   className='form_label_width_97'>
              <Select placeholder='请选择' allowClear>
                <Option value={1}>待处理</Option>
                <Option value={2}>已处理</Option>
              </Select>
            </Form.Item>
          </Col></>}
        <Col span={8} >
          <Form.Item name='time' label='调查日期' >
            <RangePicker_
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
          <Col span={8}>
          <Form.Item name='time3' label='调查提交时间'>
            <RangePicker_ style={{ width: '100%' }}
              showTime={false}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col> 
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading2}>
              查询
         </Button>
            <Button style={{ margin: '0 8px' }} loading={tableLoading2} onClick={() => { formAll.resetFields(); setPageIndex2(1); setPageSize2(20); onFinish(type, 1, 20) }}  >
              重置
         </Button>
            <Button style={{ marginRight: 8 }} icon={<ExportOutlined />} loading={exportLoading2} onClick={() => { exports(1) }}>
              导出
         </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }


  const ProcessResultsComponents = ({ data }) => {
    return <Form className='detailForm'>
      <TitleComponents simpleSty text='处理结果' key='1' height={16} style={{ fontSize: 16 }} />
      <div>
        <Row>
          <Col span={24}>
            <Form.Item label='处理办法'>
              {data?.ProcessedMethod}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='处理人'>
              {data?.ProcessedByName}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='处理填写时间'>
              {data?.ProcessedTime}
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  }

  // 仅展示所有数据
  if (viewOnlyAll) {
    return (
      <div className={styles.detailModalSty}>
        {searchComponents2(1)}
        <SdlTable
          style={{ marginTop: 6 }}
          resizable
          loading={tableLoading2}
          bordered
          dataSource={tableDatas2}
          columns={columns(1)}
          pagination={{
            total: tableTotal2,
            pageSize: pageSize2,
            current: pageIndex2,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handleTableChange2,
          }}
        />
        <Modal
          visible={detailVisible}
          title={'调查'}
          onCancel={() => { setDetailVisible(false) }}
          destroyOnClose
          wrapClassName={`fullScreenModal ${styles.modalSty} ${styles.detailModalSty} ${styles.detailModalSty2}`}
          mask={false}
          footer={null}
        >
          <DispatchDetails data={data} />
          <InvestigaContent data={data} />
          <ProcessResultsComponents data={data} />
        </Modal>
      </div>
    )
  }

  const allTable = () => {
    return <SdlTable
      style={{ marginTop: 6 }}
      resizable
      loading={tableLoading2}
      bordered
      dataSource={tableDatas2}
      columns={columns(1)}
      pagination={{
        total: tableTotal2,
        pageSize: pageSize2,
        current: pageIndex2,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: handleTableChange2,
      }}
    />
  }
  return (
    <div className={styles.customerSatisfacQuerySty}>
      <BreadcrumbWrapper>
        <Card title={isAll ? searchComponents2(1) : searchComponents(2)}>
          {
            isAll ?
              allTable()
              :
              <SdlTable
                style={{ marginTop: 6 }}
                resizable
                loading={tableLoading}
                bordered
                dataSource={tableDatas}
                columns={columns(2)}
                pagination={{
                  total: tableTotal,
                  pageSize: pageSize,
                  current: pageIndex,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange,
                }}
              />
          }
        </Card>
        <HandleModal visible={handleVisible} data={data} completeFinish={() => { setPageIndex(1); setPageSize(20); onFinish(2, 1, 20) }} onCancel={() => { setHandleVisible(false) }} />
        <InvestigateModal visible={investigateVisible} data={data} completeFinish={() => { setPageIndex(1); setPageSize(20); onFinish(2, 1, 20) }} onCancel={() => { setInvestigateVisible(false) }} />
        <Modal
          visible={detailVisible}
          title={'调查'}
          onCancel={() => { setDetailVisible(false) }}
          destroyOnClose
          wrapClassName={props.modalWrapClassName || `spreadOverModal ${styles.modalSty} ${styles.detailModalSty}`}
          mask={false}
          footer={null}
        >
          <DispatchDetails data={data} />
          <InvestigaContent data={data} />
          <ProcessResultsComponents data={data} />
        </Modal>
        <Modal
          visible={viewAllVisible}
          title={'查看满意度调查数据'}
          onCancel={() => { setViewAllVisible(false) }}
          destroyOnClose
          wrapClassName={`spreadOverModal ${styles.detailModalSty}`}
          mask={false}
          footer={null}
        >
          <>
            {searchComponents2(1)}
            {allTable()}
          </>
        </Modal>

      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);
