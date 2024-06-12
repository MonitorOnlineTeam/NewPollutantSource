/*
 * @Author: JiaQi
 * @Date: 2024-04-17 17:12:44
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-21 09:15:04
 * @Description:  服务响应及时率 - 表格
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Descriptions, Space, Tooltip, Modal } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import BasicData from './BasicData';
import moment from 'moment';

const dvaPropsData = ({ loading, reportsAndViews }) => ({
  timelyRateList: reportsAndViews.timelyRateList,
  loading: loading.effects[`reportsAndViews/GetTimelyRateList`],
  exportLoading: loading.effects['reportsAndViews/ExportTimelyRateList'],
});

const TableCard = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    dispatch,
    loading,
    exportLoading,
    timelyRateList: { columnList, tableList },
    title,
    date,
    modalWrapClassName,
  } = props;

  useEffect(() => {}, []);

  // 导出
  const onExport = () => {
    dispatch({
      type: 'reportsAndViews/ExportTimelyRateList',
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
    let column = columnList.map(item => {
      return {
        title: item.name,
        children: [
          {
            title: '服务响应次数',
            dataIndex: `${item.key}allCount`,
            key: `${item.key}allCount`,
            width: 140,
            align: 'center',
            sorter: (a, b) => a[`${item.key}allCount`] - b[`${item.key}allCount`],
          },
          {
            title: '响应及时',
            dataIndex: `${item.key}timelyCount`,
            key: `${item.key}timelyCount`,
            width: 140,
            align: 'center',
            sorter: (a, b) => a[`${item.key}timelyCount`] - b[`${item.key}timelyCount`],
          },
          {
            title: '响应不及时',
            dataIndex: `${item.key}nottimelyCount`,
            key: `${item.key}nottimelyCount`,
            width: 140,
            sorter: (a, b) => a[`${item.key}nottimelyCount`] - b[`${item.key}nottimelyCount`],
            align: 'center',
          },
          {
            title: '响应及时率',
            dataIndex: `${item.key}rate`,
            key: `${item.key}rate`,
            width: 140,
            sorter: (a, b) =>
              a[`${item.key}rate`].replace('%', '') - b[`${item.key}rate`].replace('%', ''),
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
        dataIndex: 'largeRegionName',
        key: 'largeRegionName',
        width: 200,
        fixed: 'left',
      },
      {
        title: date.format('YYYY年'),
        children: [
          {
            title: '服务响应次数',
            dataIndex: `allCount`,
            key: `allCount`,
            width: 140,
            fixed: 'left',
            align: 'center',
            sorter: (a, b) => a[`allCount`] - b[`allCount`],
          },
          {
            title: '响应及时',
            dataIndex: `timelyCount`,
            key: `timelyCount`,
            width: 140,
            fixed: 'left',
            align: 'center',
            sorter: (a, b) => a[`timelyCount`] - b[`timelyCount`],
          },
          {
            title: '响应不及时',
            dataIndex: `nottimelyCount`,
            key: `nottimelyCount`,
            width: 140,
            sorter: (a, b) => a[`nottimelyCount`] - b[`nottimelyCount`],
            fixed: 'left',
            align: 'center',
          },
          {
            title: '响应及时率',
            dataIndex: `rate`,
            key: `rate`,
            width: 140,
            sorter: (a, b) => a[`rate`].replace('%', '') - b[`rate`].replace('%', ''),
            fixed: 'left',
            align: 'center',
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
          isModalOpen={isModalOpen}
          title="服务响应基础数据"
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
