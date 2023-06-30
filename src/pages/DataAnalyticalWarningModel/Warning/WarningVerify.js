/*
 * @Author: JiaQi
 * @Date: 2023-05-30 15:07:19
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-06-29 14:19:06
 * @Description：报警核实详情
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Descriptions, Row, Col, Tag, Upload, Button, Tooltip, Empty, message } from 'antd';
import { router } from 'umi';
import styles from '../styles.less';
import { RollbackOutlined } from '@ant-design/icons';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ImageView from '@/components/ImageView';
import ModelChart from './components/ModelChart';
import ModelTable from './components/ModelTable';
import WarningDataModal from './WarningDataModal';
import moment from 'moment';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  warningInfoLoading: loading.effects['dataModel/GetSingleWarning'],
  modelChartsLoading: loading.effects['dataModel/GetSnapshotData'],
});

const WarningVerify = props => {
  const warningId = props.match.params.id;
  const COLOR = ['#5470c6', '#91cc75', '#ea7ccc'];
  const { dispatch, warningInfoLoading, modelChartsLoading } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [dataModalVisible, setDataModalVisible] = useState(false);
  const [warningDataDate, setWarningDataDate] = useState();
  const [imageIndex, setImageIndex] = useState();
  const [warningInfo, setWarningInfo] = useState({});
  const [fileList, setFileList] = useState([]);
  const [modelChartDatas, setModelChartDatas] = useState([]);
  const [modelTableDatas, setModelTableDatas] = useState({
    Column: [],
    Data: [],
  });
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
        let _fileList = [];
        if (res.CheckedMaterial && res.CheckedMaterial.length) {
          _fileList = res.CheckedMaterial.map((item, index) => {
            return {
              uid: index,
              index: index,
              status: 'done',
              url: '/' + item,
            };
          });
        }
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
        if (res.chartData) {
          setModelChartDatas(res.chartData);
        } else {
          setModelTableDatas({
            Column: res.Column,
            Data: res.Data,
          });
        }
        setModelDescribe(res.describe);
      },
    });
  };

  // 查看报警数据
  const onViewWarningData = () => {
    // 表格模型
    if (modelTableDatas.Column && modelTableDatas.Column.length) {
      if (modelTableDatas.Data.length && modelTableDatas.Data[0]) {
        let startDate = modelTableDatas.Data[0].Time;

        let date = [moment(startDate).subtract(3, 'day'), moment(startDate).add(3, 'day')];
        setWarningDataDate(date);
        setDataModalVisible(true);
      } else {
        message.error('报警快照无数据，无法查看报警数据！');
      }
    } else {
      // 图表模型
      if (
        modelChartDatas.length &&
        modelChartDatas[0].data.length &&
        modelChartDatas[0].data[0].date.length
      ) {
        let startDate = modelChartDatas[0].data[0].date[0];

        let date = [moment(startDate).subtract(3, 'day'), moment(startDate).add(3, 'day')];
        setWarningDataDate(date);
        setDataModalVisible(true);
      } else {
        message.error('报警快照无数据，无法查看报警数据！');
      }
    }
  };

  return (
    <BreadcrumbWrapper titles=" / 报警核实">
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
        <Card
          title="异常特征"
          loading={modelChartsLoading}
          extra={
            <Button loading={modelChartsLoading} type="primary" onClick={() => onViewWarningData()}>
              报警数据
            </Button>
          }
        >
          {modelDescribe ? (
            <>
              <p>{modelDescribe}</p>

              {/* 图表模型 */}
              {modelChartDatas.length ? (
                <Row className={styles.chartWrapper}>
                  {modelChartDatas.map((item, index) => {
                    return (
                      <Col span={8}>
                        <ModelChart chartData={item} color={COLOR[index]} />
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                ''
              )}
              {/* 表格模型 */}
              {modelTableDatas.Column.length ? (
                <Row className={styles.chartWrapper} style={{ height: 'auto' }}>
                  <ModelTable
                    WarningTypeCode={warningInfo.WarningTypeCode}
                    tableData={modelTableDatas}
                  />
                </Row>
              ) : (
                ''
              )}
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
        {/* 查看附件弹窗 */}
        <ImageView
          isOpen={isOpen}
          images={fileList.map(item => item.url)}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsOpen(false);
          }}
        />
        {/* 报警数据弹窗 */}
        {dataModalVisible && (
          <WarningDataModal
            DGIMN={warningInfo.Dgimn}
            visible={dataModalVisible}
            date={warningDataDate}
            onCancel={() => {
              setDataModalVisible(false);
            }}
          />
        )}
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WarningVerify);
