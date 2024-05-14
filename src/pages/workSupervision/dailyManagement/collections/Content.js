/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:38:17
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-13 19:17:30
 * @Description：部门内其他工作事项
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
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, EditIcon } from '@/utils/icon';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import HandleModal from './HandleModal';
import RecordModal from './RecordModal';
import LargeRegionSelect from '@/pages/workSupervision/dailyManagement/components/LargeRegionSelect';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/GetAccountsReceivableList'],
  exportLoading: loading.effects['wordSupervision/ExportAccountsReceivableList'],
});

const Content = props => {
  const [form] = Form.useForm();
  const { WorkType, CTOperation, queryLoading, exportLoading, mode } = props;
  const [dataSource, setDataSource] = useState([]);
  const [editData, setEditData] = useState({});
  const [handleModalOpen, setHandleModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  useEffect(() => {
    onFinish();
  }, []);

  // 获取请求参数
  const getParams = values => {
    const beginTime = values.date
      ? moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss')
      : undefined;
    const endTime = values.date ? moment(values.date[1]).format('YYYY-MM-DD 23:59:59') : undefined;

    return {
      BeginTime: beginTime,
      EndTime: endTime,
      flag: mode !== 'record',
    };
  };

  // 查询数据
  const onFinish = async (_pageIndex, _pageSize) => {
    const values = await form.validateFields();
    const body = getParams(values);

    props.dispatch({
      type: 'wordSupervision/GetAccountsReceivableList',
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
      type: 'wordSupervision/ExportAccountsReceivableList',
      payload: {
        ...body,
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteAccountsReceivable',
      payload: { ID },
      callback: res => {
        handleTableChange(1, 20);
      },
    });
  };

  //
  const onEdit = record => {
    setEditData(record);
    setHandleModalOpen(true);
  };

  // 获取列头
  const getColumns = () => {
    let columns = [
      {
        title: '序号',
      },
      {
        title: '项目编号',
        dataIndex: 'ProjectNo',
        key: 'ProjectNo',
        ellipsis: true,
        width: 200,
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '最终用户名称',
        dataIndex: 'FinalUserName',
        key: 'FinalUserName',
        render: text => {
          return text || '-';
        },
      },
      {
        title: '项目所在省',
        dataIndex: 'RegionName',
        key: 'RegionName',
        render: text => {
          return text || '-';
        },
      },
      {
        title: '项目接洽人',
        children: [
          {
            title: '姓名',
            dataIndex: 'UserName',
            key: 'UserName',
            align: 'center',
            width: 120,
          },
          {
            title: '职务',
            dataIndex: 'UserPost',
            width: 120,
            align: 'center',
            key: 'UserPost',
          },
          {
            title: '联系电话',
            dataIndex: 'UserPhone',
            width: 120,
            align: 'center',
            key: 'UserPhone',
          },
        ],
      },
      {
        title: '欠款金额',
        dataIndex: 'AmountInArear',
        key: 'AmountInArear',
        sorter: (a, b) => a.AmountInArear - b.AmountInArear,
      },
      {
        title: '催收完成金额',
        dataIndex: 'CompletionAmount',
        key: 'CompletionAmount',
        sorter: (a, b) => a.CompletionAmount - b.CompletionAmount,
      },
      {
        title: '行业',
        dataIndex: 'IndustryName',
        key: 'IndustryName',
        render: text => {
          return text || '-';
        },
      },
      {
        title: '催收人',
        dataIndex: 'CreateUserName',
        key: 'CreateUserName',
        render: text => {
          return text || '-';
        },
      },
      {
        title: '催收时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        render: text => {
          return text || '-';
        },
      },
    ];

    // if (flag === 'oneself') {
    if (mode !== 'record') {
      columns.push({
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <Tooltip title="编辑">
                <a
                  onClick={() => {
                    onEdit(record);
                  }}
                >
                  <EditIcon />
                </a>
              </Tooltip>

              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    onDelete(record.ID);
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <a>
                    <DelIcon />
                  </a>
                </Popconfirm>
              </Tooltip>
            </>
          );
        },
      });
    }

    return columns;
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    onFinish(PageIndex, PageSize);
  };

  return (
    <Card
      bordered={mode !== 'record' ? true : false}
      title={
        <Form
          name="basic"
          form={form}
          layout="inline"
          // style={{ padding: '10px 0 20px' }}
          initialValues={{
            workResults: null,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Space wrap>
            {mode === 'record' && [
              <Form.Item label="项目编号" name="projectNo">
                <Input placeholder="请输入项目编号" />
              </Form.Item>,
              <LargeRegionSelect label="项目所在省" name="RegionCode" />,
              <Form.Item label="催收人" name="userName">
                <Input placeholder="请输入催收人" />
              </Form.Item>,
            ]}
            <Form.Item label="催收时间" name="date">
              <RangePicker_ />
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
                type="primary"
                onClick={() => {
                  form.resetFields();
                  handleTableChange(1, 20);
                }}
              >
                重置
              </Button>

              {mode !== 'record' && [
                <Button
                  type="primary"
                  onClick={() => {
                    setHandleModalOpen(true);
                    setEditData({});
                  }}
                >
                  添加
                </Button>,
                <Button
                  type="primary"
                  onClick={() => {
                    setRecordModalOpen(true);
                  }}
                >
                  应收账款催收记录
                </Button>,
              ]}
              <Button loading={exportLoading} onClick={() => onExport()}>
                导出
              </Button>
            </Space>
          </Space>
        </Form>
      }
    >
      <SdlTable
        loading={queryLoading}
        align="center"
        columns={getColumns()}
        dataSource={dataSource}
        pagination={{
          total: tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />

      {handleModalOpen && (
        <HandleModal
          open={handleModalOpen}
          editData={editData}
          onCancel={() => {
            setHandleModalOpen(false);
          }}
          onSubmitCallback={() => {
            onFinish();
          }}
        />
      )}

      {recordModalOpen && (
        <RecordModal
          open={recordModalOpen}
          WorkType={WorkType}
          CTOperation={CTOperation}
          onCancel={() => {
            setRecordModalOpen(false);
          }}
        />
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(Content);
