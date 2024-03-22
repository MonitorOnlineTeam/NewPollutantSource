/*
 * @Author: JiaQi
 * @Date: 2024-03-21 16:51:07
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-22 09:53:40
 * @Description:  登记弹窗
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Modal,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`serviceIsNotTimely/GetServiceNotSetList`],
});

const RegistrationModal = props => {
  const [form] = Form.useForm();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isHandleModalOpen, setIsHandleModalOpen] = useState(false);
  const [handleNum, setHandleNum] = useState();
  const [remark, setRemark] = useState();
  const [serviceChangeDate, setServiceChangeDate] = useState();

  const { dispatch, title, isModalOpen, onCancel, serviceType, queryLoading } = props;
  console.log('props', props);

  useEffect(() => {
    onFinish();
  }, []);

  // 获取表格数据
  const onFinish = (_pageIndex, _pageSize) => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'serviceIsNotTimely/GetServiceNotSetList',
      payload: {
        ...values,
        serviceType: serviceType,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '派工单号',
        dataIndex: 'Num',
        key: 'Num',
        ellipsis: true,
      },
      {
        title: '合同编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        ellipsis: true,
        width: 220,
      },
      {
        title: '立项号',
        dataIndex: 'ItemCode',
        key: 'ItemCode',
        ellipsis: true,
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '合同类型',
        dataIndex: 'ProjectType',
        key: 'ProjectType',
        ellipsis: true,
        width: 120,
      },
      {
        title: '最终用户',
        dataIndex: 'CustomEnt',
        key: 'CustomEnt',
        ellipsis: true,
        width: 200,
      },
      {
        title: '项目所在省',
        dataIndex: 'Province',
        key: 'Province',
        ellipsis: true,
      },
      {
        title: '服务大区',
        dataIndex: 'Region',
        key: 'Region',
        ellipsis: true,
      },
      {
        title: '服务工程师',
        dataIndex: 'WorkerName',
        key: 'WorkerName',
        ellipsis: true,
      },
      {
        title: '客户服务需求时间',
        dataIndex: 'NeedDate',
        key: 'NeedDate',
        ellipsis: true,
        width: 180,
      },
      {
        title: '下单日期',
        dataIndex: 'OrderDate',
        key: 'OrderDate',
        ellipsis: true,
        width: 180,
      },
      {
        title: <span>操作</span>,
        align: 'center',
        fixed: 'right',
        width: 100,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setIsHandleModalOpen(true);
                setHandleNum(record.Num);
              }}
            >
              {serviceType === 0 ? '不及时' : serviceType === 1 ? '不参与' : '变更时间'}
            </Button>
          );
        },
      },
    ];

    // 只有服务时间变更显示“客户服务需求时间”
    if (serviceType !== 2) columns = columns.filter(item => item.dataIndex !== 'NeedDate');
    return columns;
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    onFinish(PageIndex, PageSize);
  };

  // 设置服务不及时
  const SetServiceStatus = () => {
    if (!remark) {
      message.error('请填写备注！');
      return;
    }
    if (serviceType === 2 && !serviceChangeDate) {
      message.error('请填写变更后服务需求时间！');
      return;
    }
    dispatch({
      type: 'serviceIsNotTimely/SetServiceStatus',
      payload: {
        num: handleNum,
        remark: remark,
        serviceChangeDate:
          serviceType === 2 ? serviceChangeDate.format('YYYY-MM-DD HH:00:00') : undefined,
        serviceType: serviceType,
      },
      callback: res => {
        setIsHandleModalOpen(false);
        setServiceChangeDate();
        setRemark();
        onCancel(true);
      },
    });
  };

  return (
    <Modal
      title={`${title} - 登记`}
      wrapClassName="spreadOverModal"
      visible={isModalOpen}
      destroyOnClose
      footer={[]}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        id="searchForm"
        form={form}
        layout="inline"
        initialValues={{}}
        autoComplete="off"
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        <Row align="middle">
          <Form.Item name="num" label="派工单号">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item name="projectCode" label="合同编号">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item name="itemCode" label="立项号">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              loading={queryLoading}
              onClick={() => {
                handleTableChange(1, 20);
              }}
            >
              查询
            </Button>
          </Form.Item>
        </Row>
      </Form>
      <SdlTable
        loading={queryLoading}
        align="center"
        dataSource={dataSource}
        columns={getColumns()}
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
        // title="Basic Modal"
        visible={isHandleModalOpen}
        destroyOnClose
        onOk={() => {
          SetServiceStatus();
        }}
        onCancel={() => {
          setIsHandleModalOpen(false);
        }}
      >
        {serviceType === 2 && (
          <>
            <p>变更后服务需求时间</p>
            <DatePicker
              style={{ width: '100%', marginBottom: 16 }}
              format="YYYY-MM-DD HH:00"
              showTime
              onChange={(date, dateString) => {
                setServiceChangeDate(date);
              }}
            />
          </>
        )}
        <p>备注</p>
        <TextArea
          rows={4}
          onChange={e => {
            setRemark(e.target.value);
          }}
        />
      </Modal>
    </Modal>
  );
};

export default connect(dvaPropsData)(RegistrationModal);
