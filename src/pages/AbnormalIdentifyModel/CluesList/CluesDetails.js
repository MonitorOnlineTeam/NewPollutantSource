import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Descriptions,
  Row,
  Col,
  Tag,
  Upload,
  Button,
  Tooltip,
  Empty,
  message,
  Divider,
} from 'antd';
import { router } from 'umi';
import styles from '../styles.less';
import { RollbackOutlined } from '@ant-design/icons';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ImageView from '@/components/ImageView';
// import WarningDataModal from './WarningDataModal';
import moment from 'moment';
import { ChartDefaultSelected, getPollutantNameByCode, ModalNameConversion } from '../CONST';
import _ from 'lodash';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  warningInfoLoading: loading.effects['AbnormalIdentifyModel/GetSingleWarning'],
  modelChartsLoading: loading.effects['AbnormalIdentifyModel/GetSnapshotData'],
});

const CluesDetails = props => {
  const warningId = props.match.params.id;
  const COLOR = ['#5470c6', '#91cc75', '#ea7ccc'];
  const { dispatch, warningInfoLoading, modelChartsLoading, height } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [dataModalVisible, setDataModalVisible] = useState(false);
  const [warningDataDate, setWarningDataDate] = useState();
  const [warningDate, setWarningDate] = useState([]);
  const [rtnFinal, setRtnFinal] = useState([]);
  const [imageIndex, setImageIndex] = useState();
  const [warningInfo, setWarningInfo] = useState({});
  const [fileList, setFileList] = useState([]);
  const [rectFileList, setRectFileList] = useState([]);
  const [modelChartDatas, setModelChartDatas] = useState([]);
  const [linearDatas, setLinearDatas] = useState([]);
  const [modelTableDatas, setModelTableDatas] = useState([]);
  const [modelDescribe, setModelDescribe] = useState('');
  const [defaultChartSelected, setDefaultChartSelected] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [snapshotData, setSnapshotData] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {
    // 获取报警详情及核实信息
    dispatch({
      type: 'AbnormalIdentifyModel/GetSingleWarning',
      payload: {
        modelWarningGuid: warningId,
      },
      callback: res => {
        if (res) {
          setWarningInfo(res);
          let _fileList = [],
            rectFileList = [];
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
          if (res.RectificationMaterial && res.RectificationMaterial.length) {
            rectFileList = res.RectificationMaterial.map((item, index) => {
              return {
                uid: index,
                index: index,
                status: 'done',
                url: '/' + item,
              };
            });
          }

          setFileList(_fileList);
          setRectFileList(rectFileList);
          // GetSnapshotData(res.WarningTypeCode);
        }
      },
    });
  };

  // 获取模型快照数据
  const GetSnapshotData = WarningTypeCode => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetSnapshotData',
      payload: {
        ID: warningId,
      },
      callback: res => {
        if (res.chartData) {
          // setModelChartDatas(res.chartData);
          // handleLinearDatas(res.chartData, WarningTypeCode);
        } else {
          setRtnFinal(res.rtnFinal);
          let tableDatas = processJSONData(res.rtnFinal);
          setModelTableDatas(tableDatas);
          // setModelTableDatas({
          //   Column: res.Column,
          //   Data: res.Data,
          // });
        }
        setModelDescribe(res.describe);
        setSnapshotData(res);
        // 处理恒定值报警时间线
        if (res.timeListByCode) {
          let timeList = res.timeListByCode;
          let newTimeList = [];
          for (const key in timeList) {
            timeList[key].map(item => {
              newTimeList.push({
                pollutantCode: key,
                time: item.split('~'),
              });
            });
          }
          console.log('newTimeList', newTimeList);
          setTimeList(newTimeList);
        }
      },
    });
  };

  // 表格数据：相同Column数据合并
  const processJSONData = data => {
    // 创建一个空数组用于存储处理后的数据
    let mergedData = [];

    // 遍历原始数据对象数组
    data.forEach(function(obj) {
      // 检查当前数据对象的Column是否存在于mergedData中
      let existingData = mergedData.find(function(item) {
        return JSON.stringify(item.Column) === JSON.stringify(obj.Column);
      });

      // 如果存在相同的Column，则将Data合并到已存在的数据中
      if (existingData) {
        existingData.Data = existingData.Data.concat(obj.Data);
      } else {
        // 如果不存在相同的Column，则将整个数据对象添加到mergedData中
        mergedData.push(obj);
      }
    });

    return mergedData;
  };

  const isShowBack = location.pathname.indexOf('autoLogin') <= -1;
  return (
    <BreadcrumbWrapper titles=" / 线索核实" hideBreadcrumb={props.hideBreadcrumb}>
      <div
        className={styles.PageWrapper}
        style={{ height: height ? height : isShowBack ? '100%' : 'calc(100vh - 22px)' }}
      >
        <Card
          title="线索详情"
          bodyStyle={{ paddingTop: 16 }}
          loading={warningInfoLoading}
          extra={
            isShowBack ? (
              <Button
                onClick={() =>
                  props.hideBreadcrumb && props.onCancel ? props.onCancel() : router.goBack()
                }
              >
                <RollbackOutlined />
                返回上级
              </Button>
            ) : (
              ''
            )
          }
        >
          <Descriptions column={4}>
            <Descriptions.Item label="企业">
              <Tooltip title={warningInfo.EntNmae}>
                <span className={styles.textOverflow}>{warningInfo.EntNmae}</span>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="排口">{warningInfo.PointName}</Descriptions.Item>
            <Descriptions.Item label="场景类别">
              <Tooltip title={warningInfo.WarningTypeName}>
                <span className={styles.textOverflow}>
                  {ModalNameConversion(warningInfo.WarningTypeName)}
                </span>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="发现线索时间">{warningInfo.WarningTime}</Descriptions.Item>
            <Descriptions.Item label="线索内容">{warningInfo.WarningContent}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title="异常特征" style={{margin: '10px 0'}}>

        </Card>
        <Card title="线索核实" loading={warningInfoLoading}>
          <Descriptions column={4}>
            <Descriptions.Item label="核实状态">
              <Tag
                color={
                  warningInfo.Status === 3 // 核实完成
                    ? 'success'
                    : warningInfo.Status === 2 // 待复核
                    ? 'orange'
                    : 'volcano' //待核实
                }
              >
                {warningInfo.StatusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="核实结果">
              {warningInfo.CheckedResultCode === '1' && <Tag color="error">系统误报</Tag>}
              {warningInfo.CheckedResultCode === '2' && <Tag color="warning">有异常</Tag>}
              {warningInfo.CheckedResultCode === '3' && <Tag>未核实</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="异常原因">
              {warningInfo.UntruthReason || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="核实人">{warningInfo.CheckedUser || '-'}</Descriptions.Item>
            <Descriptions.Item span={1} label="核实时间">
              {warningInfo.CheckedTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="暂停报警截止时间">
              {warningInfo.StopAlarmEndTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={4} label="核实描述">
              {warningInfo.CheckedDes || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={4} label="核实材料">
              {fileList.length ? (
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                  onPreview={file => {
                    setIsOpen(true);
                    setImageIndex(file.index);
                    setImages(fileList);
                  }}
                />
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginTop: 10 }} />
          {/* 整改详情 */}
          <Descriptions column={4}>
            <Descriptions.Item label="是否需要整改">
              <Tag
                color={
                  warningInfo.IsRect === 1 // 需整改
                    ? 'orange'
                    : 'success' //不用整改
                }
              >
                {warningInfo.IsRect === 1 ? '需整改' : '不用整改'}
              </Tag>
            </Descriptions.Item>
            {warningInfo.IsRect === 1 && (
              <>
                <Descriptions.Item label="整改状态">
                  {warningInfo.RectificationStatus === '1' && <Tag color="orange">待整改</Tag>}
                  {warningInfo.RectificationStatus === '2' && <Tag color="orange">待复核</Tag>}
                  {warningInfo.RectificationStatus === '3' && <Tag color="success">整改完成</Tag>}
                </Descriptions.Item>
                <Descriptions.Item label="整改人">
                  {warningInfo.RectificationUserName || '-'}
                </Descriptions.Item>
                <Descriptions.Item span={1} label="整改时间">
                  {warningInfo.CompleteTime || '-'}
                </Descriptions.Item>
                <Descriptions.Item span={4} label="整改描述">
                  {warningInfo.RectificationDes || '-'}
                </Descriptions.Item>
                <Descriptions.Item span={4} label="整改材料">
                  {rectFileList.length ? (
                    <Upload
                      listType="picture-card"
                      fileList={rectFileList}
                      showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                      onPreview={file => {
                        setIsOpen(true);
                        setImageIndex(file.index);
                        setImages(rectFileList);
                      }}
                    />
                  ) : (
                    '-'
                  )}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </Card>
        {/* 查看附件弹窗 */}
        <ImageView
          isOpen={isOpen}
          images={images.map(item => item.url)}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsOpen(false);
          }}
        />
        {/* 报警数据弹窗 */}
        {/* {dataModalVisible && warningDataDate && (
          <WarningDataModal
            PointName={`${warningInfo.EntNmae} - ${warningInfo.PointName}`}
            DGIMN={warningInfo.Dgimn}
            CompareDGIMN={warningInfo.CompareDGIMN}
            ComparePointName={`${warningInfo.CompareEntNmae} - ${warningInfo.ComparePointName}`}
            visible={dataModalVisible}
            date={warningDataDate}
            warningDate={warningDate}
            wrapClassName={isShowBack ? 'spreadOverModal' : 'fullScreenModal'}
            describe={modelDescribe}
            defaultChartSelected={defaultChartSelected}
            onCancel={() => {
              setDataModalVisible(false);
            }}
          />
        )} */}
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(CluesDetails);
