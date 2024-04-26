/**
 * 功  能：项目执行进度 遗留问题
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Popover,Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
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
import styles from "./style.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import CheckPhoto from '@/components/CheckPhoto';
import { permissionButton } from '@/utils/utils';

const { Option } = Select;

const namespace = 'remainProblems'




const dvaPropsData = ({ loading, remainProblems, global, }) => ({
  tableLoading: remainProblems.tableLoading,
  tableDatas: remainProblems.tableDatas,
  tableTotal: remainProblems.tableTotal,
  queryPar: remainProblems.queryPar,
  tableLoading2: remainProblems.tableLoading2,
  tableDatas2: remainProblems.tableDatas2,
  tableTotal2: remainProblems.tableTotal2,
  queryPar2: remainProblems.queryPar2,
  exportLoading: remainProblems.exportLoading,
  exportLoading2: remainProblems.exportLoading2,
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form] = Form.useForm();

  const [form2] = Form.useForm();

  const [formAll] = Form.useForm();




  const { queryPar, tableDatas, tableTotal, tableLoading, queryPar2, tableDatas2, tableTotal2, tableLoading2, exportLoading, exportLoading2,hideBreadcrumb } = props;

  const [selectIndex, setSelectIndex] = useState(-1);

  const [remainProblemsBtn, setRemainProblemsBtn] = useState(true);

  
  useEffect(() => {
    const buttonList = permissionButton(props.match.path)
    buttonList.map(item => {
      switch (item) {
        case 'remainProblems': setRemainProblemsBtn(true); break;
      }
    })
    onFinish(2, pageIndex, pageSize);

  }, []);

  const [popVisible, setPopVisible] = useState(false);

  let columns2 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '合同编号',
      dataIndex: 'projectCode',
      key: 'projectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '立项号',
      dataIndex: 'itemCode',
      key: 'itemCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '问题描述',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      width:150,
      ellipsis: true,
    },
    {
      title: '问题附件',
      dataIndex: 'fileList',
      key: 'fileList',
      align: 'center',
      width:90,
      ellipsis: true,
      render: (text) => {
        return <CheckPhoto fileList={text} />
      }
    },
    {
      title: '问题状态',
      dataIndex: 'problemStatusName',
      key: 'problemStatusName',
      align: 'center',
      ellipsis: true,
      render: (text) => {
       return text == '未解决'? <span className='red'>{text}</span> : text
      }
    },
    {
      title: '解决人',
      dataIndex: 'solveUserName',
      key: 'solveUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '解决问题时间',
      dataIndex: 'problemTime',
      key: 'problemTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      ellipsis: true,
    },
  ];
  let columns = [
    ...columns2,
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 60,
      ellipsis: true,
      render: (text, record,index) => {
        return (
          <Tooltip title="编辑">
            <Popover visible={popVisible && selectIndex == index} placement='left' title={'编辑'} trigger="click"
              overlayStyle={{ width: 400 }}
              overlayClassName={styles.popSty}
              content={
                <Form
                  name="basic2"
                  form={form2}
                  onFinish={(values) => solveProblem(values, record)}
                >
                  <Form.Item label="解决人" name="solveUserName" className='minWidth' rules={[{ required: true, message: '请输入解决人！' }]} >
                    <Input placeholder='请输入' allowClear />
                  </Form.Item>
                  <Form.Item label="解决时间" name="problemTime" rules={[{ required: true, message: '请选择解决时间！' }]} >
                    <DatePicker style={{width:'100%'}}/>
                  </Form.Item>

                  <Row align='end'>
                    <Button onClick={() => { setPopVisible(false) }} style={{ marginRight: 8 }} >
                      取消
                </Button>
                    <Button type="primary" htmlType='submit' loading={updateImplementationLoading}>
                      提交
                  </Button>
                  </Row>
                </Form>
              }
            >
              <a onClick={() => { setPopVisible(true);setSelectIndex(index);form2.setFieldsValue({solveUserName:record.solveUserName,problemTime:record.problemTime}); }}><EditIcon /></a>
            </Popover>
          </Tooltip>
        );

      }
    },
  ];
  const [updateImplementationLoading,setUpdateImplementationLoading] = useState(false)
  const solveProblem = (values,record) => {
    setUpdateImplementationLoading(true)
    props.dispatch({
      type: `wordSupervision/UpdateImplementationStatus`,
      payload: {id:record.id,...values,  problemTime:values.problemTime&&moment(values.problemTime).format('YYYY-MM-DD HH:mm:ss')},
      callback:()=>{
        setUpdateImplementationLoading(false)
        setPopVisible(false)
        onFinish(2, pageIndex, pageSize);
      }
    });
  }

  const [viewAllVisible, setViewAllVisible] = useState(false)

  const viewAllData = () => {
    setViewAllVisible(true)
    formAll.resetFields()
    setPopVisible(false)
    onFinish(1, pageIndex2, pageSize2);
  }
  const exports = (type) => {
    props.dispatch({
      type: `${namespace}/ExportQuestionList`,
      payload: type == 2 ? queryPar : queryPar2,
    });
  };


  const onFinish = async (type, PageIndex, PageSize, queryPar) => {  //查询

    try {
      const values = type == 2 ? await form.validateFields() : await formAll.validateFields();
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
        isAll: type,
      }
      props.dispatch({
        type: `${namespace}/GetQuestionList`,
        payload: {
          ...par,
        },
        callback: () => {
          if (type == 2) {
            setPopVisible(false)
          }
        }

      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
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

  const SearchCommon = () => {
    return <>
      <Col span={8}>
        <Form.Item name='num' label='派单工号'>
          <Input placeholder="请输入" allowClear />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name='projectCode' label='合同编号' >
          <Input placeholder="请输入" allowClear />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name='itemCode' label='立项号' className='minWidth'>
          <Input placeholder="请输入" allowClear />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name='projectName' label='项目名称'>
          <Input placeholder="请输入" allowClear />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name='problemStatus' label='进度状态'>
          <Select placeholder='请选择' allowClear>
            <Option value={1}>待解决</Option>
            <Option value={2}>已解决</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name='time' label='创建时间'>
          <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
      </Col></>
  }
  const searchComponents = (type) => {

    const resetData = () => { setPageIndex(1); setPageSize(20); onFinish(type, 1, 20) }
    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { resetData() }}
    >
      <Row align='middle'>
        <SearchCommon />
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button style={{ margin: '0 8px' }} loading={tableLoading} onClick={() => { form.resetFields(); resetData() }}  >
              重置
         </Button>
            {remainProblemsBtn && <Button style={{ marginRight: 8 }} type="primary" onClick={viewAllData}>
              全部遗留问题
            </Button>}
            <Button icon={<ExportOutlined />} loading={exportLoading} style={{ marginRight: 8 }} onClick={() => { exports(type) }}>
              导出
         </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  const searchComponents2 = (type) => {

    const resetData = () => { setPageIndex2(1); setPageSize2(20); onFinish(type, 1, 20) }

    return <Form
      form={formAll}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { resetData() }}
    >
      <Row align='middle'>
       <SearchCommon />
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading2}>
              查询
         </Button>
            <Button style={{ margin: '0 8px' }} loading={tableLoading2} onClick={() => { formAll.resetFields(); resetData() }}  >
              重置
         </Button>
            <Button icon={<ExportOutlined />} loading={exportLoading2} style={{ marginRight: 8 }} onClick={() => { exports(type) }}>
              导出
         </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  } 
  return (
    <div className={`${styles.remainProblemsSty} queryCriterTitleSty`}>
      <BreadcrumbWrapper hideBreadcrumb={hideBreadcrumb}>
        <Card title={searchComponents(2)} bordered={!hideBreadcrumb}>
          <SdlTable
            resizable
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
          visible={viewAllVisible}
          title={'查看满意度调查数据'}
          onCancel={() => { setViewAllVisible(false) }}
          destroyOnClose
          wrapClassName={`spreadOverModal queryCriterTitleSty ${styles.detailModalSty}`}
          mask={false}
          footer={null}
        >
          {searchComponents2(1)}
          <SdlTable
            style={{ marginTop: 6 }}
            resizable
            loading={tableLoading2}
            bordered
            dataSource={tableDatas2}
            columns={columns2}
            pagination={{
              total: tableTotal2,
              pageSize: pageSize2,
              current: pageIndex2,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange2,
            }}
          />
        </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);