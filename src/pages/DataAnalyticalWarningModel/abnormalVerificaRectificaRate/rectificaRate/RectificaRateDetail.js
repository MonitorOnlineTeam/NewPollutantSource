import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Descriptions,
  Badge,
  Timeline,
  Tag,
  Upload,
  Button,
  Tooltip,
  Empty,
  message,
  Space,
  Modal,
  Radio,
  Form,
  Col,
  Input,
} from 'antd';
import { router } from 'umi';
import dataAnalyticalWarningModelSty from '../../../DataAnalyticalWarningModel/styles.less';
import styles from './style.less';
import { RollbackOutlined } from '@ant-design/icons';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import { DetailIcon } from '@/utils/icon';
import ImageView from '@/components/ImageView';
import cuid from 'cuid';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
import moment from 'moment';
import WarningDetail from '../../../DataAnalyticalWarningModel/Warning/WarningVerify'

const { TextArea } = Input;

const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, rectificaRate }) => ({
  loading: loading.effects['rectificaRate/getCheckedRectificationApprovals'],
});

const RectificaRateDetail = props => {
  const rectificaId = props.match.params.id;
  const [form] = Form.useForm();
  const { dispatch, loading, height } = props;
  const [imageIndex, setImageIndex] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [processData, setProcessData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [uid, setUid] = useState(cuid());
  const [viewFileList, setViewFileList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  // 获取整改详情数据

  const [rectificaInfo, setRectificaIndfo] = useState({});

  const loadData = () => {
    dispatch({
      type: 'rectificaRate/getCheckedRectificationApprovals',
      payload: {
        id: rectificaId,
      },
      callback: res => {
        const data = res.CheckedRectificationList?.[0]
        if (data) {
          setRectificaIndfo(data);
          let _fileList = [];
          if (data.FileList) {
            _fileList = data.FileList.map((item, index) => {
              return {
                uid: index,
                index: index,
                status: 'done',
                url: '/' + item,
              };
            });
          }
          console.log('_fileList', _fileList);
          setFileList(_fileList);
          setProcessData(res?.appResult);
        }
      },
    });
  };

  const handleTimeLineItem = data => {
    // data.ApprovalStatusName
    return (
      <Timeline.Item>
        <div className={dataAnalyticalWarningModelSty.processTitle}>
          <span>{data.ApproverUserName}</span>
          <span className={dataAnalyticalWarningModelSty.status}>{data.ApprovalStatusName}</span>
          <span className={dataAnalyticalWarningModelSty.date}>{data.ApprovalDate}</span>
        </div>
        {data.ApprovalRemarks || data.FileList.length ? (
          <div className={dataAnalyticalWarningModelSty.processContent}>
            <p>{data.ApprovalRemarks}</p>
            {data.FileList.length ? (
              <Upload
                listType="picture-card"
                fileList={data.FileList.map((item, index) => {
                  return {
                    uid: index,
                    index: index,
                    status: 'done',
                    url: '/' + item,
                  };
                })}
                showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                onPreview={file => {
                  setViewFileList(
                    data.FileList.map((item, index) => {
                      return {
                        uid: index,
                        index: index,
                        status: 'done',
                        url: '/' + item,
                      };
                    }),
                  );
                  setIsOpen(true);
                  setImageIndex(file.index);
                }}
              />
            ) : (
                ''
              )}
          </div>
        ) : (
            ''
          )}
      </Timeline.Item>
    );
  };

  const [warningDetailVisible, setWarningDetailVisible] = useState(false)
  const [modelWarningGuid, setModelWarningGuid] = useState()
  return (
    <BreadcrumbWrapper hideBreadcrumb={props.hideBreadcrumb}>
      <div className={dataAnalyticalWarningModelSty.WarningVerifyWrapper} style={{ height: height ? height : '100%' }}>
        <Card title="整改"
          extra={
            <Space>
              <Button
                type="primary"
                onClick={e => {
                  setWarningDetailVisible(true)
                  setModelWarningGuid(rectificaInfo.CheckedId)
                }}
              >
                线索核实
                </Button>
              <Button onClick={() => props.onCancel ? props.onCancel() : router.goBack()}>
                <RollbackOutlined />
                返回上级
              </Button>
            </Space>
          } bodyStyle={{ padding: '16px 24px' }} loading={loading}>
          <Descriptions column={3}>
            <Descriptions.Item span={1} label="整改状态">
              <Tag
                color={
                  rectificaInfo.RectificationStatus == 3
                    ? 'success'
                    : rectificaInfo.RectificationStatus == 2
                      ? 'orange'
                      : 'volcano'
                }
              >
                {rectificaInfo.RectificationStatusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item span={1} label="整改人">{rectificaInfo.RectificationUserName || '-'}</Descriptions.Item>
            <Descriptions.Item span={1} label="整改时间">
              {rectificaInfo.CompleteTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="整改描述">
              {rectificaInfo.RectificationUserName || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="整改材料">
              {fileList.length ? (
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                  onPreview={file => {
                    setViewFileList(fileList);
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
        <Card bodyStyle={{ padding: '16px 24px' }} title="处理流程" loading={loading}>
          <Timeline style={{ marginTop: 20 }}>
            {processData.map(item => {
              return handleTimeLineItem(item);
            })}
          </Timeline>
        </Card>
      </div>
      <Modal //线索详情
        visible={warningDetailVisible}
        footer={null}
        wrapClassName={`spreadOverModal ${styles.rectificaDetailSty}`}
        onCancel={() => { setWarningDetailVisible(false) }}
        destroyOnClose
        bodyStyle={{
          padding: 0,
        }}
      >
        <WarningDetail onCancel={() => { setWarningDetailVisible(false) }} match={{ params: { modelNumber: 'all', id: modelWarningGuid } }} hideBreadcrumb height='calc(100vh - 52px)' />
      </Modal>
      {/* 查看附件弹窗 */}
      <ImageView
        isOpen={isOpen}
        images={viewFileList.map(item => item.url)}
        imageIndex={imageIndex}
        onCloseRequest={() => {
          setIsOpen(false);
        }}
      />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(RectificaRateDetail);
