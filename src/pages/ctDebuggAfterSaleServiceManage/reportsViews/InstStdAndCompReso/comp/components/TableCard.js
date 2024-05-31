/*
 * @Author: JiaQi
 * @Date: 2024-04-16 16:37:38
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-23 14:40:14
 * @Description:  投诉解决率表格
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Descriptions, Space, Tooltip, Modal } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import AllViewModal from '@/pages/ctDebuggAfterSaleServiceManage/customerSatisfaction/handleComplaints/components/AllViewModal.js';

const dvaPropsData = ({ loading, reportsAndViews }) => ({
  compPageData: reportsAndViews.compPageData,
  loading: loading.effects[`reportsAndViews/GetComplaintResolutionRate`],
  exportLoading: loading.effects['reportsAndViews/ExportComplaintResolutionRate'],
});

const TableCard = props => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    dispatch,
    loading,
    exportLoading,
    compPageData: { ColumnList, TableList },
    title,
    date,
  } = props;

  useEffect(() => {}, []);

  // 导出
  const onExport = () => {
    dispatch({
      type: 'reportsAndViews/ExportComplaintResolutionRate',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  //
  const getColumns = () => {
    let columnList = ColumnList.map(item => {
      return {
        title: item.key,
        children: [
          {
            title: '投诉次数',
            dataIndex: `${item.key}ComplaintsNum`,
            key: `${item.key}ComplaintsNum`,
            width: 100,
            align: 'center',
            fixed: item.key.indexOf('年') > -1 ? 'left' : false,
            sorter: (a, b) => a[`${item.key}ComplaintsNum`] - b[`${item.key}ComplaintsNum`],
          },
          {
            title: '已解决',
            dataIndex: `${item.key}YesComplaintsNum`,
            key: `${item.key}YesComplaintsNum`,
            width: 100,
            align: 'center',
            fixed: item.key.indexOf('年') > -1 ? 'left' : false,
            sorter: (a, b) => a[`${item.key}YesComplaintsNum`] - b[`${item.key}YesComplaintsNum`],
          },
          {
            title: '未解决',
            dataIndex: `${item.key}NoComplaintsNum`,
            key: `${item.key}NoComplaintsNum`,
            width: 100,
            sorter: (a, b) => a[`${item.key}NoComplaintsNum`] - b[`${item.key}NoComplaintsNum`],
            fixed: item.key.indexOf('年') > -1 ? 'left' : false,
            align: 'center',
          },
          {
            title: '解决率',
            dataIndex: `${item.key}ComplaintsRate`,
            key: `${item.key}ComplaintsRate`,
            fixed: item.key.indexOf('年') > -1 ? 'left' : false,
            width: 100,
            sorter: (a, b) =>
              a[`${item.key}ComplaintsRate`].replace('%', '') -
              b[`${item.key}ComplaintsRate`].replace('%', ''),
            align: 'center',
          },
        ],
      };
    });
    return [
      {
        title: '序号',
        fixed: 'left',
      },
      {
        title: '大区',
        dataIndex: 'ServiceAreaName',
        key: 'ServiceAreaName',
        width: 120,
        fixed: 'left',
      },
      ...columnList,
    ];
  };

  return (
    <Card
      title={
        <Space>
          <span>{title}</span>
          <Button
            icon={<ExportOutlined />}
            loading={exportLoading}
            onClick={() => {
              onExport();
            }}
          >
            导出
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            查看基础数据
          </Button>
        </Space>
      }
      size="small"
      bodyStyle={{ paddingBottom: 10 }}
      loading={loading}
    >
      <SdlTable
        dataSource={TableList}
        columns={getColumns()}
        align="center"
        scroll={{
          y: 500,
        }}
        pagination={false}
      />
      {// 基础数据
      isModalOpen && (
        <AllViewModal
          title="投诉解决率基础数据"
          isModalOpen={isModalOpen}
          onCancel={() => {
            onCancel();
          }}
        />
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(TableCard);
