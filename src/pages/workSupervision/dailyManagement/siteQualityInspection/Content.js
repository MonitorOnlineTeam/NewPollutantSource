/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:38:17
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-23 16:20:35
 * @Description：现场工作质量检查
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Radio,
  Tag,
  Divider,
  Select,
  Modal,
  Row,
  Col,
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, EditIcon } from '@/utils/icon';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import LargeRegionList from '@/components/largeRegionList';
import RecordMangerTableModal from './RecordMangerTableModal';


const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/GetOtherWorkList'],
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
});

const Work = props => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { queryLoading, exportLoading,  } = props;
  const [dataSource, setDataSource] = useState([]);

  const [completRecordOpen, setCompletRecordOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);

  const [ siteInspectionOpen, setSiteInspectionOpen] = useState(false);
  const [ modalType, setModalType] = useState(1);
  const [ title, setTitle] = useState(1);

 
  useEffect(() => {
    onFinish();
  }, []);

  // 获取请求参数
  const getParams = values => {
    const beginTime = values.date
      ? moment(values.date[0]).format('YYYY-MM-DD 00:00:00')
      : undefined;
    const endTime = values.date ? moment(values.date[1]).format('YYYY-MM-DD 23:59:59') : undefined;

    return {
      BeginTime: beginTime,
      EndTime: endTime,
      WorkContent: values.WorkContent,
      WorkResults: values.workResults,
    };
  };

  // 查询数据
  const onFinish = async (_pageIndex, _pageSize) => {
    const values = await form.validateFields();
    const body = getParams(values);

    props.dispatch({
      type: 'wordSupervision/GetOtherWorkList',
      payload: {
        ...body,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 导出
  const onExport = async () => {
    const values = await form.validateFields();
    const body = getParams(values);
    props.dispatch({
      type: 'wordSupervision/exportTaskRecord',
      payload: {
        ...body,
        apiName: 'ExportOtherWorkList',
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteOtherWork',
      payload: { ID },
      callback: res => {
        handleTableChange(1, 20);
      },
    });
  };



  const columns = [
    {
      title: '序号',
    },
    {
      title: '大区',
      dataIndex: 'User_Name',
      key: 'User_Name',
    },
    {
      title: '应完成任务数量',
      dataIndex: 'WorkTime',
      key: 'WorkTime',
      render:(text)=>{
        return <a onClick={()=>{setCompletRecordOpen(true)}}>{111}</a>
      }
    },
    {
      title: '实际成任务数量',
      dataIndex: 'WorkTime',
      key: 'WorkTime',
    },
    {
      title: '任务完成率',
      dataIndex: 'ContentDes',
      key: 'ContentDes',
      ellipsis: true,
    },
  ];
  const columns2 = [
    {
      title: '序号',
    },
    {
      title: '大区',
      dataIndex: 'User_Name',
      key: 'User_Name',
    },
    {
      title: '任务派发时间',
      dataIndex: 'WorkTime',
      key: 'WorkTime',
    },
    {
      title: '是否完成',
      dataIndex: 'WorkTime',
      key: 'WorkTime',
    },
    {
      title: '检查人',
      dataIndex: 'ContentDes',
      key: 'ContentDes',
      ellipsis: true,
    },
    {
      title: '任务结束时间',
      dataIndex: 'ContentDes',
      key: 'ContentDes',
      ellipsis: true,
    },
  ];

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    onFinish(PageIndex, PageSize);
  };


  return (
    <Card
      className='queryCriterTitleSty'
      title={
        <Form
          name="basic"
          form={form}
          layout="inline"
          initialValues={{
            workResults: null,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Space wrap>
            <Form.Item label="任务派发时间" name="date">
              <RangePicker_ picker="day" format="YYYY-MM-DD" />
            </Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={() => handleTableChange(1, 20)}
                loading={queryLoading}
              >
                查询
              </Button>

              <Button loading={exportLoading} onClick={() => onExport()}>
                导出
              </Button>
              <Button
                type="primary"
                onClick={()=>{
                  setSiteInspectionOpen(true)
                  setModalType(1)
                }}
              >
                现场检查管理
              </Button>
              <Button
                type="primary"
                onClick={()=>{
                  setSiteInspectionOpen(true)
                  setModalType(2)
                }}
              >
                现场检查记录
              </Button>
            </Space>
          </Space>
        </Form>
      }
    >
      <SdlTable
        loading={queryLoading}
        align="center"
        columns={columns}
        dataSource={[1]}
        scroll={{ x: 840 }}
        pagination={{
          total: tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
      <Modal
        title={'现场检查完成记录'}
        wrapClassName={`spreadOverModal`}
        mask={false}
        open={completRecordOpen}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setCompletRecordOpen(false)
        }}
      >
        <Form
          name="basic2"
          form={form2}
          layout="inline"
          initialValues={{
            workResults: null,
          }}
          onFinish={onFinish}
          autoComplete="off"
          style={{paddingBottom:8}}
        >
          <LargeRegionList label="大区" />
          <Form.Item label="任务派发时间" name="date2">
            <RangePicker_ picker="day" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="status" label="是否完成">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Space>
            <Button
              type="primary"
              onClick={() => handleTableChange(1, 20)}
              loading={queryLoading}
            >
              查询
              </Button>
            <Button
              onClick={() => handleTableChange(1, 20)}
              loading={queryLoading}
            >
              重置
              </Button>
            <Button loading={exportLoading} onClick={() => onExport()}>
              导出
              </Button>
          </Space>
                       
        </Form>
        <SdlTable
          loading={queryLoading}
          align="center"
          columns={columns2}
          dataSource={dataSource}
          scroll={{ x: 840 }}
          pagination={{
            total: tableTotal,
            pageSize: pageSize,
            current: pageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handleTableChange,
          }}
        />
      </Modal>
      <RecordMangerTableModal //现场检查记录和现场检查管理 弹框
        open={siteInspectionOpen}
        modalType={modalType}
        onCancel={() => {
          setSiteInspectionOpen(false)
        }}
      />
    </Card>
  );
};

export default connect(dvaPropsData)(Work);
