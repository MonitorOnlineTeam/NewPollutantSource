import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Divider, Space } from 'antd';
import SdlTable from '@/components/SdlTable';
import styles from '../../styles.less';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const ModelTable = props => {
  const { tableData, WarningTypeCode } = props;

  useEffect(() => {}, []);

  const getColumns = () => {
    let columns = tableData.Column.map(item => {
      return {
        title: item.PollutantName,
        dataIndex: item.PollutantCode,
        key: item.PollutantCode,
        render: (text, record, index) => {
          let isError = item.PollutantCode === 'Error';
          // let isRed = false;
          // // 疑似零值微小波动（除了”波动范围“其他显示红色）
          // if (WarningTypeCode === '0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827') {
          //   if (item.PollutantName.indexOf('波动范围') === -1) {
          //     isRed = true;
          //   }
          // }
          // 疑似修改烟道截面积或计算公式、疑似修改标准过量空气系数或计算公式、疑似不规范修改烟道截面积、疑似不规范修改标准过量空气系数.
          // 以上四个模型，在遇见 PollutantCode = "Flue" 或者"基准氧含量" 时，行数分两半合并
          if (
            WarningTypeCode === 'EF861F03-3A71-465B-B3A6-AA94EBEA1370' ||
            WarningTypeCode === '6D3534C9-379A-4005-9960-CD2D4C74C56A' ||
            WarningTypeCode === '1052768E-E858-4624-9A8A-DFE3F164F216' ||
            WarningTypeCode === 'E2D02A1D-B5BB-442C-9E58-685B2A7FF9C7'
          ) {
            if (item.PollutantCode === '基准氧含量' || item.PollutantCode === 'Flue') {
              return {
                children: <b style={{ fontSize: 16 }}>{text}</b>,
                props: {
                  rowSpan:
                    index === 0 || index === tableData.Data.length / 2
                      ? tableData.Data.length / 2
                      : 0,
                },
              };
            }
          }
          // 烟道截面积备案错误、过量空气系数备案错误.
          // 以上两个模型，在遇见 PollutantCode = "Flue" 、"基准氧含量" 、"备案基准氧含量" 、"备案烟道截面积" 时，整列合并
          if (
            WarningTypeCode === '7F531495-DBE0-4ECA-914E-E3DC93CC6076' ||
            WarningTypeCode === 'A951CD94-AAC0-4F64-ABF0-E7440DD3AA43'
          ) {
            if (
              item.PollutantCode === '基准氧含量' ||
              item.PollutantCode === 'Flue' ||
              item.PollutantCode === '备案基准氧含量' ||
              item.PollutantCode === '备案烟道截面积'
            ) {
              return {
                children: <b style={{ fontSize: 16 }}>{text}</b>,
                props: { rowSpan: index === 0 ? tableData.Data.length : 0 },
              };
            }
          }

          if (isError) {
            // 误差列合并单元格
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

  const getFormula = () => {
    if (WarningTypeCode === 'a59cce2a-8558-4c42-8a45-4d8402e4b29d') {
      // 疑似计算公式错误
      console.log('tableData.Column.length', tableData.Column.length);
      if (tableData.Column.length === 6) {
        return (
          <div className={styles.formulaBox}>
            <p className={styles.title}>折算值计算公式</p>
            <img src="/dataModal/1.png" />
          </div>
        );
      } else {
        if (
          // 污染物排放量不显示公式图片
          tableData.Column.length === 5 ||
          // 疑似单位或计算公式错误
          tableData.Column.length === 1
        ) {
          return '';
        }
        return (
          <>
            <div className={styles.formulaBox}>
              <p className={styles.title}>烟气流量计算公式</p>
              <img src="/dataModal/2.png" />
            </div>
            {/* <Divider type='vertical' /> */}
            <div className={styles.formulaBox}>
              <p className={styles.title}>湿烟气流量计算公式</p>
              <img src="/dataModal/3.png" />
            </div>
          </>
        );
      }
    }
  };

  return (
    <>
      <SdlTable
        sticky={true}
        align="center"
        columns={getColumns()}
        dataSource={tableData.Data}
        scroll={{
          y: true,
        }}
        pagination={false}
      />
      <div className={styles.formulaImageWrapper}>
        <Space size={20}>{getFormula()}</Space>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(ModelTable);
