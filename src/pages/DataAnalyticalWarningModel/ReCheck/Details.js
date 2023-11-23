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
import styles from '../styles.less';
import { RollbackOutlined } from '@ant-design/icons';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import { DetailIcon } from '@/utils/icon';
import ImageView from '@/components/ImageView';
import cuid from 'cuid';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
import moment from 'moment';
import {  ModalNameConversion } from '../CONST';
import {  API } from '@config/API';

const { TextArea } = Input;

const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, dataModel }) => ({
  loading: loading.effects['dataModel/GetWarningVerifyCheckInfo'],
  checkLoading: loading.effects['dataModel/InsertWarningVerify'],
});

const ReCheckDetails = props => {
  const warningId = props.match.params.id;
  const [form] = Form.useForm();

  const { dispatch, loading, checkLoading } = props;
  const [imageIndex, setImageIndex] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [warningInfo, setWarningInfo] = useState({});
  const [processData, setProcessData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [uid, setUid] = useState(cuid());
  const [viewFileList, setViewFileList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  // 获取复核详情数据
  const loadData = () => {
    dispatch({
      type: 'dataModel/GetWarningVerifyCheckInfo',
      payload: {
        modelCheckedGuid: warningId,
      },
      callback: res => {
        setWarningInfo(res.checkInfo);
        let _fileList = [];
        if (res.checkInfo && res.checkInfo.FileList) {
          _fileList = res.checkInfo.FileList.map((item, index) => {
            return {
              uid: index,
              index: index,
              status: 'done',
              url: '/' + item.FileName,
            };
          });
        }
        console.log('_fileList', _fileList);
        setFileList(_fileList);
        setDataSource(res.finalResult);
        setProcessData(res.appResult);
      },
    });
  };

  // 报警核实
  const InsertWarningVerify = () => {
    // const values = form.getFieldsValue();
    // return;
    form.validateFields().then(values => {
      console.log('values', values);
      // return;
      dispatch({
        type: 'dataModel/InsertWarningVerify',
        payload: {
          approvalDocs: uid,
          modelCheckedGuid: warningId,
          approvalStatus: values.approvalStatus,
          approvalRemarks: values.approvalRemarks,
          ModelWarningGuid: [],
        },
        callback: res => {
          setVisible(false);
          // loadData();
          router.push('/DataAnalyticalWarningModel/reCheck/Todo');
        },
      });
    });
  };

  const handleTimeLineItem = data => {
    // data.ApprovalStatusName
    return (
      <Timeline.Item>
        <div className={styles.processTitle}>
          <span>{data.ApproverUserName}</span>
          <span className={styles.status}>{data.ApprovalStatusName}</span>
          <span className={styles.date}>{data.ApprovalDate}</span>
        </div>
        {data.ApprovalRemarks || data.FileList.length ? (
          <div className={styles.processContent}>
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

  const getColumns = () => {
    return [
      {
        title: '编号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '企业',
        dataIndex: 'EntNmae',
        key: 'EntNmae',
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
          let _text = ModalNameConversion(text);
          return (
            <Tooltip title={_text}>
              <span className={styles.textOverflow}>{_text}</span>
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
        dataIndex: 'CheckedResultCode',
        key: 'CheckedResultCode',
        width: 120,
        render: (text, record) => {
          switch (text) {
            case '3':
              return <Badge status="default" text="未核实" />;
            case '2':
              return <Badge status="warning" text="有异常" />;
            case '1':
              return <Badge status="error" text="系统误报" />;
          }
        },
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
                  router.push(
                    `/DataAnalyticalWarningModel/Warning/ModelType/all/WarningVerify/${record.ModelWarningGuid}`,
                    );
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
  console.log('warningInfo', warningInfo);
  return (
    <BreadcrumbWrapper titles=" / 复核详情">
      <div className={styles.WarningVerifyWrapper} style={{ height: '100%' }}>
        <Card
          title="线索详情"
          bodyStyle={{ padding: '16px 24px' }}
          extra={
            <Space>
              <Button onClick={() => router.goBack()}>
                <RollbackOutlined />
                返回上级
              </Button>
              {// 核实完成不显示复核按钮
              (warningInfo.Status === 1 || warningInfo.Status === 2) && (
                <Button type="primary" onClick={() => setVisible(true)}>
                  复核
                </Button>
              )}
            </Space>
          }
        >
          <SdlTable
            rowKey="ModelWarningGuid"
            align="center"
            columns={getColumns()}
            dataSource={dataSource}
            loading={loading}
            pagination={false}
          />
        </Card>
        <Card title="线索核实" bodyStyle={{ padding: '16px 24px' }} loading={loading}>
          <Descriptions column={4}>
            <Descriptions.Item label="核实状态">
              <Tag
                color={
                  warningInfo.Status === 3
                    ? 'success'
                    : warningInfo.Status === 2
                    ? 'orange'
                    : 'volcano'
                }
              >
                {warningInfo.StatusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="核实结果">
              {warningInfo.CheckedResult === '1' && <Tag color="error">系统误报</Tag>}
              {warningInfo.CheckedResult === '2' && <Tag color="warning">有异常</Tag>}
              {warningInfo.CheckedResult === '3' && <Tag>未核实</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="异常原因">
              {warningInfo.UntruthReason || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="核实人">{warningInfo.CheckedUser || '-'}</Descriptions.Item>
            <Descriptions.Item span={2} label="核实时间">
              {warningInfo.CheckedTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="暂停报警截止时间">
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
      {/* 查看附件弹窗 */}
      <ImageView
        isOpen={isOpen}
        images={viewFileList.map(item => item.url)}
        imageIndex={imageIndex}
        onCloseRequest={() => {
          setIsOpen(false);
        }}
      />
      <Modal
        title="线索复核"
        destroyOnClose
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          InsertWarningVerify();
        }}
        confirmLoading={checkLoading}
        // onCancel={onCancel}
      >
        <Form
          name="basic"
          form={form}
          // layout="inline"
          style={{ padding: '10px 0' }}
          initialValues={{
            approvalStatus: 3,
          }}
          autoComplete="off"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          // onValuesChange={onValuesChange}
          onValuesChange={(changedFields, allFields) => {}}
        >
          <Form.Item
            label="复核结果"
            name="approvalStatus"
            rules={[
              {
                required: true,
                message: '请选择复核结果!',
              },
            ]}
          >
            <Radio.Group defaultValue={1}>
              <Radio value={3}>通过</Radio>
              <Radio value={4}>驳回</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="审核意见"
            name="approvalRemarks"
            rules={[
              {
                required: true,
                message: '请输入审核意见!',
              },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item label="附件" name="file">
            <SdlUpload
              accept="image/*"
              action={API.UploadApi.UploadFiles}
              cuid={uid}
              uploadSuccess={cuid => {}}
            />
          </Form.Item>
        </Form>
      </Modal>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(ReCheckDetails);
