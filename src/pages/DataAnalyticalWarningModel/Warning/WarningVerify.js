/*
 * @Author: JiaQi
 * @Date: 2023-05-30 15:07:19
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-06-07 10:50:48
 * @Description：报警核实详情
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Descriptions, Row, Col, Tag, Upload, Button, Tooltip, Empty } from 'antd';
import { router } from 'umi';
import styles from '../styles.less';
import { RollbackOutlined } from '@ant-design/icons';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ImageView from '@/components/ImageView';
import ModelChart from './components/ModelChart';

const chartData = {
  title: 'O2范围(19.00~21.50)%',
  data: [
    {
      data: [
        6.567,
        5.767,
        4.881,
        4.869,
        4.52,
        5.244,
        5.385,
        6.149,
        6.692,
        4.732,
        4.182,
        4.058,
        4.84,
        7.132,
        6.988,
        6.35,
        4.799,
        4.617,
        4.058,
        3.366,
        3.399,
        4.614,
        5.267,
        5.144,
      ],
      date: [
        '2023-06-05 00:00:00',
        '2023-06-05 01:00:00',
        '2023-06-05 02:00:00',
        '2023-06-05 03:00:00',
        '2023-06-05 04:00:00',
        '2023-06-05 05:00:00',
        '2023-06-05 06:00:00',
        '2023-06-05 07:00:00',
        '2023-06-05 08:00:00',
        '2023-06-05 09:00:00',
        '2023-06-05 10:00:00',
        '2023-06-05 11:00:00',
        '2023-06-05 12:00:00',
        '2023-06-05 13:00:00',
        '2023-06-05 14:00:00',
        '2023-06-05 15:00:00',
        '2023-06-05 16:00:00',
        '2023-06-05 17:00:00',
        '2023-06-05 18:00:00',
        '2023-06-05 19:00:00',
        '2023-06-05 20:00:00',
        '2023-06-05 21:00:00',
        '2023-06-05 22:00:00',
        '2023-06-05 23:00:00',
      ],
      standardUpper: 21.5,
      standardLower: 19,
      max: 22,
      min: 0,
      unit: '%',
      pollutantName: '氧含量',
      pollutantCode: 's01',
    },
    {
      data: [
        1.567,
        5.767,
        4.881,
        4.869,
        7.52,
        2.244,
        5.385,
        2.149,
        1.692,
        4.732,
        4.182,
        4.058,
        4.84,
        7.132,
        6.988,
        9.35,
        3.799,
        4.617,
        4.058,
        1.366,
        3.399,
        4.614,
        1.267,
        5.144,
      ],
      date: [
        '2023-06-05 00:00:00',
        '2023-06-05 01:00:00',
        '2023-06-05 02:00:00',
        '2023-06-05 03:00:00',
        '2023-06-05 04:00:00',
        '2023-06-05 05:00:00',
        '2023-06-05 06:00:00',
        '2023-06-05 07:00:00',
        '2023-06-05 08:00:00',
        '2023-06-05 09:00:00',
        '2023-06-05 10:00:00',
        '2023-06-05 11:00:00',
        '2023-06-05 12:00:00',
        '2023-06-05 13:00:00',
        '2023-06-05 14:00:00',
        '2023-06-05 15:00:00',
        '2023-06-05 16:00:00',
        '2023-06-05 17:00:00',
        '2023-06-05 18:00:00',
        '2023-06-05 19:00:00',
        '2023-06-05 20:00:00',
        '2023-06-05 21:00:00',
        '2023-06-05 22:00:00',
        '2023-06-05 23:00:00',
      ],
      standardUpper: 20.5,
      standardLower: 20,
      max: 25,
      min: 0,
      unit: '%',
      pollutantName: '氧含量2',
      pollutantCode: 's01',
    },
  ],
};

const dvaPropsData = ({ loading, wordSupervision }) => ({
  warningInfoLoading: loading.effects['dataModel/GetSingleWarning'],
  modelChartsLoading: loading.effects['dataModel/GetSnapshotData'],
});

const WarningVerify = props => {
  const warningId = props.match.params.id;
  const COLOR = ['#5470c6', '#91cc75', '#ea7ccc'];
  const { dispatch, warningInfoLoading, modelChartsLoading } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState();
  const [warningInfo, setWarningInfo] = useState({});
  const [fileList, setFileList] = useState([]);
  const [modelChartDatas, setModelChartDatas] = useState([]);
  const [modelDescribe, setModelDescribe] = useState();

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {
    // 获取报警详情及核实信息
    dispatch({
      type: 'dataModel/GetSingleWarning',
      payload: {
        modelWarningGuid: warningId,
      },
      callback: res => {
        setWarningInfo(res);
        let _fileList = res.CheckedMaterial.map((item, index) => {
          return {
            uid: index,
            index: index,
            status: 'done',
            url: '/wwwroot' + item.FilePath,
          };
        });

        setFileList(_fileList);
      },
    });

    // 获取模型快照数据
    dispatch({
      type: 'dataModel/GetSnapshotData',
      payload: {
        ID: warningId,
      },
      callback: res => {
        setModelChartDatas(res.chartData);
        setModelDescribe(res.describe);
      },
    });
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.WarningVerifyWrapper}>
        <Card
          title="报警详情"
          bodyStyle={{ paddingTop: 16 }}
          loading={warningInfoLoading}
          extra={
            <Button onClick={() => router.goBack()}>
              <RollbackOutlined />
              返回上级
            </Button>
          }
        >
          <Descriptions column={4}>
            <Descriptions.Item label="报警企业">
              <Tooltip title={warningInfo.EntNmae}>
                <span className={styles.textOverflow}>{warningInfo.EntNmae}</span>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="报警排口">{warningInfo.PointName}</Descriptions.Item>
            <Descriptions.Item label="报警类型">
              <Tooltip title={warningInfo.WarningTypeName}>
                <span className={styles.textOverflow}>{warningInfo.WarningTypeName}</span>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="预警时间">{warningInfo.WarningTime}</Descriptions.Item>
            <Descriptions.Item label="报警内容">{warningInfo.WarningContent}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title="异常特征" loading={modelChartsLoading}>
          {modelDescribe ? (
            <>
              <p>{modelDescribe}</p>
              <Row className={styles.chartWrapper}>
                {modelChartDatas.map((item, index) => {
                  return (
                    <Col span={8}>
                      <ModelChart chartData={item} color={COLOR[index]} />
                    </Col>
                  );
                })}
              </Row>
            </>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Card>
        <Card title="预警核实" loading={warningInfoLoading}>
          <Descriptions column={3}>
            <Descriptions.Item label="核实结果">
              {warningInfo.CheckedResultCode === '1' && <Tag color="error">报警不实</Tag>}
              {warningInfo.CheckedResultCode === '2' && <Tag color="success">报警属实</Tag>}
              {warningInfo.CheckedResultCode === '3' && <Tag>未核实</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="核实人">{warningInfo.CheckedUser || '-'}</Descriptions.Item>
            <Descriptions.Item label="核实时间">{warningInfo.CheckedTime || '-'}</Descriptions.Item>
            <Descriptions.Item span={3} label="核实描述">
              {warningInfo.CheckedDes || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="核实材料">
              {fileList.length ? (
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                  onPreview={file => {
                    setIsOpen(true);
                    setImageIndex(file.index);
                  }}
                />
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <ImageView
          isOpen={isOpen}
          images={fileList.map(item => item.url)}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsOpen(false);
          }}
        />
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WarningVerify);
