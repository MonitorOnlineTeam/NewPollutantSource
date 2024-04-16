/*
 * @Author: JiaQi 
 * @Date: 2024-04-16 16:37:56 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2024-04-16 16:37:56 
 * @Description:  安装调试达标率表格
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Descriptions, Space, Tooltip, Modal } from 'antd';
import styles from '../../index.less';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import InstallaEquipment from '@/pages/ctDebuggAfterSaleServiceManage/supervisionInspection/installaEquipment';

const dvaPropsData = ({ loading, instStdAndCompReso }) => ({
  installPageData: instStdAndCompReso.installPageData,
  loading: loading.effects[`instStdAndCompReso/GetInstallationDebugRate`],
  basicsLoading: loading.effects[`ctAfterSalesServiceManagement/GetWarrantyServiceInfo`],
  exportLoading: loading.effects['ctAfterSalesServiceManagement/ExportWarrantyServiceAnalysis'],
  basicsExportLoading: loading.effects['ctAfterSalesServiceManagement/ExportWarrantyServiceInfo'],
});

const TableCard = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    dispatch,
    loading,
    exportLoading,
    installPageData: { ColumnList, TableList },
    title,
    date,
  } = props;

  useEffect(() => {}, []);

  // 导出
  const onExport = () => {
    dispatch({
      type: 'ctAfterSalesServiceManagement/ExportInstallationDebugRate',
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
        title: item.LargeRegion,
        children: [
          {
            title: '优秀',
            dataIndex: `Excellent${item.ID}`,
            key: `Excellent${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '合格',
            dataIndex: `Qualified${item.ID}`,
            key: `Qualified${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '不合格',
            dataIndex: `Unqualified${item.ID}`,
            key: `Unqualified${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '无照片',
            dataIndex: `NoPhotos${item.ID}`,
            key: `NoPhotos${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '/',
            dataIndex: `NoNeed${item.ID}`,
            key: `NoNeed${item.ID}`,
            width: 100,
            align: 'center',
          },
          {
            title: '达标率',
            dataIndex: `Rate${item.ID}`,
            key: `Rate${item.ID}`,
            width: 100,
            align: 'center',
          },
        ],
      };
    });
    return [
      {
        title: '年度',
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
        title: '安装设备型号',
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
      },
      {
        title: '总计（安装套数）',
        children: [
          {
            title: '优秀',
            dataIndex: 'Excellent',
            key: 'Excellent',
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '合格',
            dataIndex: 'Qualified',
            key: 'Qualified',
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '不合格',
            dataIndex: 'Unqualified',
            key: 'Unqualified',
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '无照片',
            dataIndex: 'NoPhotos',
            key: 'NoPhotos',
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '/',
            dataIndex: `NoNeed`,
            key: `NoNeed`,
            width: 100,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '达标率',
            dataIndex: `Rate`,
            key: `Rate`,
            width: 100,
            fixed: 'left',
            align: 'center',
          },
        ],
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
      {isModalOpen && (
        <Modal
          title="安装调试达标基础数据"
          wrapClassName="spreadOverModal"
          visible={isModalOpen}
          destroyOnClose
          footer={null}
          onCancel={() => {
            onCancel();
          }}
        >
          <InstallaEquipment
            hideBreadcrumb
            defaultTime={computeStartAndEnd(date)}
            location={props.location}
            match={props.match}
          />
        </Modal>
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(TableCard);
