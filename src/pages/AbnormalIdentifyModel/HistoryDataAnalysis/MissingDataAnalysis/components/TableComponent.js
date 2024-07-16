import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  loading: loading.effects['AbnormalIdentifyModel/GetDataMissAnalysis'],
});
const PointStatisticalAnalysis = props => {

  const { dispatch, pageTitle, entCode, DGIMN, loading, dataSource } = props;

  useEffect(() => {
  }, []);

  const getColumns = () => {
    let column = [];
    // region/ent/point
    switch (dataType) {
      case 'region':
        column = [
          {
            title: '行政区',
            dataIndex: 'Name',
            key: 'Name',
            render: (text, record) => {},
          },
        ];
        break;
      case 'ent':
        column = [
          {
            title: '企业',
            dataIndex: 'Name',
            key: 'Name',
          },
        ];
        break;
      case 'point':
        column = [
          {
            title: '企业',
            dataIndex: 'ParentName',
            key: 'ParentName',
          },
          {
            title: '排口',
            dataIndex: 'Name',
            key: 'Name',
          },
        ];
        break;

      default:
        break;
    }

    const columns = [
      ...column,
      {
        title: '缺失率',
        dataIndex: 'Rate',
        key: 'Rate',
        render: text => {
          return text + '%';
        },
      },
      {
        title: '缺失小时数',
        dataIndex: 'MissHour',
        key: 'MissHour',
      },
      {
        title: '应传小时数',
        dataIndex: 'ShouldHour',
        key: 'ShouldHour',
      },
    ];
    return columns;
  };

  return (
    <SdlTable
      loading={loading}
      align="center"
      columns={getColumns()}
      dataSource={dataSource}
      pagination={true}
    />
  );
};

export default connect(dvaPropsData)(PointStatisticalAnalysis);
