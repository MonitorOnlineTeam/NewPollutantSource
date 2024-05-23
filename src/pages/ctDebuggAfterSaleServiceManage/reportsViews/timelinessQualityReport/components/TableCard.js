/*
 * @Author: JiaQi
 * @Date: 2024-05-06 15:04:23
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-21 15:28:54
 * @Description:  表格
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Descriptions, Space, Tooltip, Modal } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import BasicData from './BasicData';
import moment from 'moment';

const dvaPropsData = ({ loading, reportsAndViews }) => ({
  // loading: loading.effects[`reportsAndViews/GetTimelyPassRateListByArea`],
  exportLoading: loading.effects['reportsAndViews/ExportTimelyPassRateListByArea'],
});

const TableCard = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [level, setLevel] = useState();
  const [basicTitle, setBasicTitle] = useState();

  const {
    dispatch,
    loading,
    exportLoading,
    data: { columnList, tableList },
    date,
    modalWrapClassName,
  } = props;

  useEffect(() => {}, []);

  // 导出
  const onExport = () => {
    dispatch({
      type: 'reportsAndViews/ExportTimelyPassRateListByArea',
      payload: {
        year: date.format('YYYY'),
        level: '1',
      },
    });
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  //
  const getColumns = () => {
    let column = columnList.map(item => {
      return {
        title: item.name,
        children: [
          {
            title: '报告及时率',
            dataIndex: `${item.key}ReportTimelyRate`,
            key: `${item.key}ReportTimelyRate`,
            width: 140,
            align: 'center',
            sorter: (a, b) => a[`${item.key}ReportTimelyRate`] - b[`${item.key}ReportTimelyRate`],
            render: (text, row) => {
              return text + '%';
            },
          },
          {
            title: '报告合格率',
            dataIndex: `${item.key}ReportQualifiedRate`,
            key: `${item.key}ReportQualifiedRate`,
            width: 140,
            align: 'center',
            sorter: (a, b) =>
              a[`${item.key}ReportQualifiedRate`] - b[`${item.key}ReportQualifiedRate`],
            render: (text, row) => {
              return text + '%';
            },
          },
          {
            title: '报告及时合格率',
            dataIndex: `${item.key}ReportTimelyQualifiedRate`,
            key: `${item.key}ReportTimelyQualifiedRate`,
            width: 140,
            sorter: (a, b) =>
              a[`${item.key}ReportTimelyQualifiedRate`] - b[`${item.key}ReportTimelyQualifiedRate`],
            align: 'center',
            render: (text, row) => {
              return text + '%';
            },
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
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
        width: 200,
        fixed: 'left',
      },
      {
        title: date.format('YYYY年'),
        children: [
          {
            title: '报告及时率',
            dataIndex: `YearReportTimelyRate`,
            key: `YearReportTimelyRate`,
            width: 140,
            fixed: 'left',
            align: 'center',
            sorter: (a, b) => a[`YearReportTimelyRate`] - b[`YearReportTimelyRate`],
            render: (text, row) => {
              return text + '%';
            },
          },
          {
            title: '报告合格率',
            dataIndex: `YearReportQualifiedRate`,
            key: `YearReportQualifiedRate`,
            width: 140,
            fixed: 'left',
            align: 'center',
            sorter: (a, b) => a[`YearReportQualifiedRate`] - b[`YearReportQualifiedRate`],
            render: (text, row) => {
              return text + '%';
            },
          },
          {
            title: '报告及时合格率',
            dataIndex: `YearReportTimelyQualifiedRate`,
            key: `YearReportTimelyQualifiedRate`,
            width: 140,
            sorter: (a, b) =>
              a[`YearReportTimelyQualifiedRate`] - b[`YearReportTimelyQualifiedRate`],
            fixed: 'left',
            align: 'center',
            render: (text, row) => {
              return text + '%';
            },
          },
        ],
      },
      ...column,
    ];

  };

  const computeStartAndEnd = () => {
    let _date = moment(date);
    var now = moment();
    var currentYear = now.format('YYYY');
    let inputYear = _date.format('YYYY');

    var start = moment(_date.format('YYYY-01-01 00:00:00')),
      end;
    if (inputYear === currentYear) {
      end = now;
    } else {
      end = _date.endOf('year');
    }
    return [start, end];
  };

  return (
    <Card
      title={
        <Space>
          <span>{`${date.format('YYYY年')}验收服务报告及时合格率`}</span>
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
              setLevel('2');
              setBasicTitle('验收服务报告及时率基础数据');
            }}
          >
            及时率基础数据
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
              setLevel('3');
              setBasicTitle('验收服务报告合格率基础数据');
            }}
          >
            合格率基础数据
          </Button>
        </Space>
      }
      size="small"
      bodyStyle={{ paddingBottom: 10 }}
      loading={loading}
    >
      <SdlTable
        dataSource={tableList}
        columns={getColumns()}
        align="center"
        scroll={{
          y: 500,
        }}
        pagination={false}
      />
      {isModalOpen && (
        <BasicData
          wrapClassName={modalWrapClassName}
          type={1}
          level={level}
          isModalOpen={isModalOpen}
          title={basicTitle}
          defaultTime={computeStartAndEnd()}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(TableCard);
