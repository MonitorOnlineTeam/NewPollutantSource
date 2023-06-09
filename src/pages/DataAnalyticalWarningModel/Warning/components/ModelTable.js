import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {} from 'antd';
import SdlTable from '@/components/SdlTable';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const ModelTable = props => {
  const { tableData } = props;
  const [columns, set] = useState({});

  useEffect(() => {}, []);

  const getColumns = () => {
    let columns = tableData.Column.map(item => {
      return {
        title: item.PollutantName,
        dataIndex: item.PollutantCode,
        key: item.PollutantCode,
        render: (text, record, index) => {
          if (item.PollutantCode === 'Error') {
            return {
              children: <b style={{ color: '#FF3333', fontSize: 16 }}>{text}</b>,
              props: { rowSpan: index === 0 ? tableData.Data.length : 0 },
            };
          } else {
            return text;
          }
        },
      };
    });

    return [
      {
        title: '时间',
        dataIndex: 'Time',
        key: 'Time',
      },
      ...columns,
    ];
  };

  return (
    <SdlTable
      align="center"
      columns={getColumns()}
      dataSource={tableData.Data}
      pagination={false}
    />
  );
};

export default connect(dvaPropsData)(ModelTable);
