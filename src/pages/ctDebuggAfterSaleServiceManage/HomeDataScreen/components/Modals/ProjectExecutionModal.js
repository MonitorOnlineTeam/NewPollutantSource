/*
 * @Author: JiaQi
 * @Date: 2024-05-20 15:43:07
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-20 16:32:46
 * @Description:  项目执行情况 - 弹窗
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Button, Card, Select, Space, Row, Col, message, Divider } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { ExportOutlined } from '@ant-design/icons';
import YearDatePicker from '@/components/RangePicker/YearDatePicker';
import styles from '../../styles.less';

const dvaPropsData = ({ loading, common }) => ({
  queryLoading: loading.effects[`ctDataScreen/GetProjectExecutionStatus`],
  exportLoading: loading.effects[`ctDataScreen/ExportProjectExecutionStatus`],
});

const ProjectExecutionModal = props => {
  const [form] = Form.useForm();

  const [columnList, setColumnList] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  const { dispatch, open, onCancel, queryLoading, exportLoading, initDate } = props;

  useEffect(() => {
    form.setFieldsValue({
      analysisDate:initDate? initDate : moment()
    })
    getTableDataSource();
  }, []);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      analysisDate: moment(values.analysisDate).format('YYYY-MM-DD HH:mm:ss'),
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'ctDataScreen/GetProjectExecutionStatus',
      payload: body,
      callback: res => {
        setDataSource(res.TableList);
        setColumnList(res.ColumnList);
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'ctDataScreen/ExportProjectExecutionStatus',
      payload: body,
    });
  };

  //
  const getColumns = () => {
    let _columnList = columnList.map(item => {
      return {
        title: item.LargeRegion,
        children: [
          {
            title: '安装调试数量',
            dataIndex: `InstallationNum${item.ID}`,
            key: `InstallationNum${item.ID}`,
            width: 120,
            align: 'center',
          },
          {
            title: '72小时调试完成数量',
            dataIndex: `DebuggingNum${item.ID}`,
            key: `DebuggingNum${item.ID}`,
            width: 140,
            align: 'center',
          },
          {
            title: '待验收数量',
            dataIndex: `AcceptanceNum${item.ID}`,
            key: `AcceptanceNum${item.ID}`,
            width: 120,
            align: 'center',
          },
        ],
      };
    });
    return [
      {
        title: '日期',
        dataIndex: 'year',
        key: 'year',
        width: 80,
        fixed: 'left',
        className: styles.bg_white,
        render: (text, record, index) => {
          return {
            children: text,
            props: { rowSpan: record.count > 0 ? record.count + 1 : record.count },
          };
        },
      },
      {
        title: '序号',
        dataIndex: 'sort',
        key: 'sort',
        fixed: 'left',
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: text === '总计' ? 2 : 1 },
          };
        },
      },
      {
        title: '设备型号',
        dataIndex: 'CategoryName',
        key: 'CategoryName',
        width: 200,
        fixed: 'left',
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: text === '总计' ? 0 : 1 },
          };
        },
        // onCell: (_, index) => {
        //   if (index === 4) {
        //     return {
        //       colSpan: 0,
        //     };
        //   }
        //   return {};
        // },
      },
      {
        title: '总计',
        fixed: 'left',
        children: [
          {
            title: '安装调试数量',
            dataIndex: 'InstallationNum',
            key: 'InstallationNum',
            width: 120,
            fixed: 'left',
            align: 'center',
          },
          {
            title: '72小时调试完成数量',
            dataIndex: 'DebuggingNum',
            key: 'DebuggingNum',
            width: 140,
            fixed: 'left',
            align: 'center',
          },
          {
            title: '待验收数量',
            dataIndex: 'AcceptanceNum',
            key: 'AcceptanceNum',
            width: 120,
            fixed: 'left',
            align: 'center',
          },
        ],
      },
      ..._columnList,
    ];
  };

  // 搜索组件
  const SearchComponents = () => {
    return (
      <div>
        <Form
          form={form}
          layout="inline"
          // initialValues={{
          //   analysisDate: moment(),
          // }}
          autoComplete="off"
        >
          <Form.Item name="analysisDate" label="年份">
            <YearDatePicker />
          </Form.Item>
          <Form.Item>
            <Space style={{ marginLeft: 10 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={queryLoading}
                onClick={() => {
                  getTableDataSource(1, 20);
                }}
              >
                查询
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  getTableDataSource(1, 20);
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                loading={exportLoading}
                onClick={() => {
                  onExport();
                }}
              >
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
        {/* <Divider style={{ margin: 0 }} /> */}
      </div>
    );
  };

  return (
    <Modal
      title={`项目执行情况`}
      wrapClassName="fullScreenModal"
      open={open}
      destroyOnClose
      footer={false}
      onCancel={() => {
        onCancel();
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Card bordered={false} title={<SearchComponents />}>
        <SdlTable
          loading={queryLoading}
          align="center"
          resizable
          dataSource={dataSource}
          columns={getColumns()}
          scroll={{
            y: 'calc(100vh - 260px)',
          }}
          pagination={false}
        />
      </Card>
    </Modal>
  );
};

export default connect(dvaPropsData)(ProjectExecutionModal);
