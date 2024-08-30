import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import {
  Form,
  Descriptions,
  Modal,
  Card,
  Spin,
  Upload,
  Space,
  Timeline,
  Input,
  Tooltip,
  message,
  Tag,
  Radio,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import { DetailIcon } from '@/utils/icon';
import { API } from '@config/API';
import CluesDetails from '@/pages/AbnormalIdentifyModel/CluesList/CluesDetails.js';
import dataAnalyticalWarningModelSty from '@/pages/DataAnalyticalWarningModel/styles.less';
import ImageView from '@/components/ImageView';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
import cuid from 'cuid';

const { TextArea } = Input;

const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  queryLoading: loading.effects['AbnormalIdentifyModel/GetCheckedRectificationList'],
  pointListLoading: loading.effects['AbnormalIdentifyModel/GetNoFilterPointByEntCode'],
});

const RectificationTask = props => {
  const [form] = Form.useForm();

  const { dispatch, currentRow, open, onCancel, onHandleSuccess } = props;
  const [cluesList, setCluesList] = useState([]);
  const [rectificaInfo, setRectificaInfo] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [cluesDetailsProps, setCluesDetailsProps] = useState();
  const [viewFileList, setViewFileList] = useState([]);
  const [imageIndex, setImageIndex] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  useEffect(() => {
    open && getPageData();
  }, [open]);

  // 获取页面数据
  const getPageData = () => {
    // setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetCheckedRectificationApprovals,
      payload: {
        id: currentRow.ID,
      },
      callback: result => {
        let res = result.Datas;
        const data = res.CheckedRectificationList?.[0];
        if (data) {
          setRectificaInfo(data);
          let _fileList = [];
          if (data.FileList) {
            _fileList = data.FileList?.ImgList?.map((item, index) => {
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
        setCluesList(res.finalResult);
      },
    });
  };

  // 提交复核
  const onSubmitAudit = () => {
    form.validateFields().then(values => {
      console.log('values', values);
      // return;
      dispatch({
        type: 'AbnormalIdentifyModel/GenericPostRequest',
        url: API.AbnormalIdentifyModel.CheckedRectification,
        payload: {
          id: currentRow.ID,
          ...values,
        },
        callback: result => {
          if (result.IsSuccess) {
            message.success('操作成功');
            setIsAuditOpen(false);
            getPageData();
            onHandleSuccess();
          }
        },
      });
    });
  };

  const handleTimeLineItem = data => {
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
            {data.FileList?.ImgList?.length ? (
              <Upload
                listType="picture-card"
                fileList={data.FileList?.ImgList?.map((item, index) => {
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
                    data.FileList?.ImgList?.map((item, index) => {
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

  const renderTimeline = useMemo(() => {
    return (
      <Timeline style={{ marginTop: 20 }}>
        {processData.map(item => {
          return handleTimeLineItem(item);
        })}
      </Timeline>
    );
  }, [processData]);

  const getColumns = () => {
    return [
      {
        title: '序号',
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '发现线索时间',
        dataIndex: 'WarningTime',
        key: 'WarningTime',
        width: 180,
        ellipsis: true,
        sorter: (a, b) => moment(a.WarningTime).valueOf() - moment(b.WarningTime).valueOf(),
      },
      {
        title: '场景类别',
        dataIndex: 'WarningTypeName',
        key: 'WarningTypeName',
        width: 180,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span style={textStyle}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '线索内容',
        dataIndex: 'WarningContent',
        key: 'WarningContent',
        width: 240,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span style={textStyle}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '核实结果',
        dataIndex: 'CheckedResult',
        key: 'CheckedResult',
        width: 120,
      },
      {
        title: '操作',
        key: 'handle',
        width: 100,
        render: (text, record) => {
          return (
            <Tooltip title="查看">
              <a
                onClick={e => {
                  //   router.push(
                  //     `/AbnormalIdentifyModel/CluesList/CluesDetails/${record.ModelWarningGuid}?checkId=${record.ModelCheckedGuid}`,
                  //   );
                  setCluesDetailsProps(record);
                }}
              >
                <DetailIcon />
              </a>
            </Tooltip>
          );
        },
      },
    ];
  };

  let footerProps = {
    footer: null,
  };

  let bodyStyle = {
    height: 'calc(100% - 39px)',
    maxHeight: 'calc(100% - 39px)',
  };

  if (rectificaInfo.RectificationStatus === '2') {
    // if (true) {
    footerProps = {};
    bodyStyle = { height: 'calc(100% - 100px)' };
  }

  return (
    <Modal
      title={`${currentRow.EntName} - ${currentRow.PointName} / 整改单详情`}
      open={open}
      onCancel={onCancel}
      bodyStyle={{ backgroundColor: '#eff1f4', ...bodyStyle }}
      wrapClassName="spreadOverModal"
      okText="复核"
      destroyOnClose
      onOk={() => {
        setIsAuditOpen(true);
      }}
      {...footerProps}
    >
      <Card title="整改详情" style={{ marginBottom: 12 }}>
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
          <Descriptions.Item span={1} label="整改人">
            {rectificaInfo.RectificationUserName || '-'}
          </Descriptions.Item>
          <Descriptions.Item span={1} label="整改时间">
            {rectificaInfo.CompleteTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="整改描述">
            {rectificaInfo.RectificationDes || '-'}
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
      <Card title="线索详情" style={{ marginBottom: 12 }}>
        <SdlTable
          rowKey="ModelWarningGuid"
          align="center"
          columns={getColumns()}
          dataSource={cluesList}
          // loading={queryLoading}
          scroll={{ y: 240 }}
          pagination={false}
        />
      </Card>
      <Card title="处理流程">{renderTimeline}</Card>
      {/* 复核弹窗 */}
      <Modal
        title="复核"
        width={600}
        open={isAuditOpen}
        destroyOnClose
        onCancel={() => {
          setIsAuditOpen(false);
        }}
        onOk={onSubmitAudit}
      >
        <Form
          form={form}
          initialValues={{
            approvalStatus: 1,
          }}
          autoComplete="off"
          labelCol={{ flex: '90px' }}
        >
          <Form.Item
            label="复核结果"
            name="approvalStatus"
            rules={[{ required: true, message: '不能为空!' }]}
          >
            <Radio.Group>
              <Radio value={1}>通过</Radio>
              <Radio value={0}>驳回</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="复核意见"
            name="approvalRemarks"
            rules={[{ required: true, message: '请填写复核意见!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="附件" name="approvalDocs">
            <SdlUpload
              cuid={cuid()}
              uploadSuccess={id => {
                form.setFieldsValue({ approvalDocs: id });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* 线索详情弹窗 */}
      <Modal
        title={`${cluesDetailsProps?.EntName} / ${cluesDetailsProps?.PointName} - ${cluesDetailsProps?.WarningTypeName}`}
        wrapClassName="fullScreenModal"
        open={cluesDetailsProps}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setCluesDetailsProps();
        }}
        bodyStyle={{
          height: 'calc(100vh - 40px)',
          overflowY: 'auto',
          backgroundColor: '#f0f2f5',
          padding: 12,
        }}
      >
        {cluesDetailsProps && (
          <CluesDetails
            hideBreadcrumb={true}
            match={{
              params: {
                id: cluesDetailsProps.ModelWarningGuid,
              },
            }}
            location={{
              query: {
                checkId: cluesDetailsProps.ModelCheckedGuid,
              },
            }}
          />
        )}
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
    </Modal>
  );
};

export default connect(dvaPropsData)(RectificationTask);
