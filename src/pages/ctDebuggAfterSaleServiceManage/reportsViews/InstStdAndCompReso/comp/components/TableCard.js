import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Descriptions, Space, Tooltip, Modal } from 'antd';
import styles from '../../index.less';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import AllViewModal from '@/pages/ctDebuggAfterSaleServiceManage/customerSatisfaction/handleComplaints/components/AllViewModal.js';

const dvaPropsData = ({ loading, instStdAndCompReso }) => ({
  compPageData: instStdAndCompReso.compPageData,
  loading: loading.effects[`instStdAndCompReso/GetComplaintResolutionRate`],
  exportLoading: loading.effects['instStdAndCompReso/ExportComplaintResolutionRate'],
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
      type: 'instStdAndCompReso/ExportComplaintResolutionRate',
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
            sorter: (a, b) => a[`${item.key}ComplaintsNum`] - b[`${item.key}ComplaintsNum`],
          },
          {
            title: '已解决',
            dataIndex: `${item.key}YesComplaintsNum`,
            key: `${item.key}YesComplaintsNum`,
            width: 100,
            align: 'center',
            sorter: (a, b) => a[`${item.key}YesComplaintsNum`] - b[`${item.key}YesComplaintsNum`],
          },
          {
            title: '未解决',
            dataIndex: `${item.key}NoComplaintsNum`,
            key: `${item.key}NoComplaintsNum`,
            width: 100,
            sorter: (a, b) => a[`${item.key}NoComplaintsNum`] - b[`${item.key}NoComplaintsNum`],
            align: 'center',
          },
          {
            title: '解决率',
            dataIndex: `${item.key}ComplaintsRate`,
            key: `${item.key}ComplaintsRate`,
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
        width: 200,
        fixed: 'left',
      },
      ...columnList,
    ];
  };

  const computeStartAndEnd = () => {
    var now = moment();
    var currentYear = now.format('YYYY');
    let inputYear = date.format('YYYY');

    var start = moment(date.format('YYYY-01-01 00:00:00')),
      end;
    if (inputYear === currentYear) {
      end = now;
    } else {
      end = date.endOf('year');
    }
    return [start, end];
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
