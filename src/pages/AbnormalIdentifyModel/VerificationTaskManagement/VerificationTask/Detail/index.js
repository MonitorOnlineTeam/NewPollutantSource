/*
 * @Author: jab
 * @Date: 2024-01-29
 * @Description：待核查任务 已核查任务
 */

import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Spin,
  Button,
  Space,
  Select,
  Badge,
  Tooltip,
  Input,
  Radio,
  Modal,
  Row,
  message,
  Popover,
  Table,
  Collapse,
  Cascader,
  Upload,
  Col,
  Tabs,
  Skeleton,
  Tag,
} from 'antd';
import styles from '../../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { cookieName, uploadPrefix } from '@/config';
import cuid from 'cuid';
import ImageView from '@/components/ImageView';
import CustomUpload from './CustomUpload';
import CluesDetails from '@/pages/AbnormalIdentifyModel/CluesList/CluesDetails.js';
import QuestionTooltip from '@/components/QuestionTooltip';

import Cookie from 'js-cookie';
import { API } from '@config/API';
const { Panel } = Collapse;

const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  verificationTaskData: AbnormalIdentifyModel.verificationTaskData,
  queryLoading: loading.effects['AbnormalIdentifyModel/GetCheckedView'],
  saveLoading: loading.effects['AbnormalIdentifyModel/UpdatePlanItem'],
  preTakeFlagDatasLoading: loading.effects['AbnormalIdentifyModel/GetPreTakeFlagDatas'],
  checkConfirmLoading: loading.effects['AbnormalIdentifyModel/CheckConfirm'],
});

const Index = props => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [modalForm] = Form.useForm();

  const {
    dispatch,
    queryLoading,
    verificationTaskData,
    history,
    history: {
      location: {
        query: { id, type },
      },
    },
    saveLoading,
    preTakeFlagDatasLoading,
    checkConfirmLoading,
  } = props;
  const [dataSource, setDataSource] = useState([]);
  const [preTakeFlagDatas, setPreTakeFlagDatas] = useState([]); //专家意见
  const [cluesDetailsProps, setCluesDetailsProps] = useState();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [filesList, setFilesList] = useState({});

  const [files, setFiles] = useState();
  const [filesCuidList, setFilesCuidList] = useState({});
  const [fileVisible, setFileVisible] = useState(false);

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    name,
    children,
    ...restProps
  }) => {
    let inputNode =
      title === '图片' ? (
        <div style={{ textAlign: 'center' }}>
          <a
            onClick={() => {
              setFileVisible(true);
              setFiles(`QAttachment_${record.ID}`);
            }}
          >
            {filesList[`QAttachment_${record.ID}`] && filesList[`QAttachment_${record.ID}`][0]
              ? '查看图片'
              : '上传图片'}
          </a>
        </div>
      ) : (
        <Input.TextArea placeholder={`请输入`} />
      );
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={`${dataIndex}_${record.ID}`}
            style={{ margin: 0 }}
            rules={[{ required: title === '核查内容' ? true : false, message: `请输入${title}!` }]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  useEffect(() => {
    initData();
    props.dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: { verificationTaskData: { ...verificationTaskData, type: 2 } },
    });
  }, []);

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

  // 查询数据
  const initData = () => {
    const values = form.getFieldsValue();
    props.dispatch({
      type: 'AbnormalIdentifyModel/GetCheckedView',
      payload: {
        id: id,
      },
      callback: res => {
        setDataSource(res);
        if (type == 1) {
          //待核查
          res?.Plan?.PlanItem?.map(item => {
            form.setFieldsValue({
              [`reContent_${item.ID}`]: item.ReContent,
              [`reAttachment_${item.ID}`]: item.ReAttachment?.AttachID,
            });
          });
        }
        if (type == 2) {
          //待确认
          dispatch({
            type: 'AbnormalIdentifyModel/GetPreTakeFlagDatas',
            payload: {},
            callback: res => {
              setPreTakeFlagDatas(res);
            },
          });
        }
      },
    });
  };

  const save = async type => {
    const values = await form.validateFields();
    const parData = {
      stype: type,
      modelCheckedGuid: id,
      planItems: dataSource?.Plan?.PlanItem?.map(item => {
        return {
          modelPlanItemGuid: item.ID,
          reContent: values[`reContent_${item.ID}`] ? values[`reContent_${item.ID}`] : '',
          reAttachment: values[`reAttachment_${item.ID}`] ? values[`reAttachment_${item.ID}`] : '',
        };
      }),
    };
    props.dispatch({
      type: 'AbnormalIdentifyModel/UpdatePlanItem',
      payload: {
        ...parData,
      },
      callback: res => {
        history.go(-1);
      },
    });
  };

  // ------------ 打回start

  //  打回点击
  const onRejectBtnClick = () => {
    let data = dataSource.Plan.PlanItem;
    setVerificationActionData(data);
    if (data?.[0]) {
      data.map(item => {
        modalForm.setFieldsValue({
          [`QTitle_${item.ID}`]: item.QTitle,
          [`QContent_${item.ID}`]: item.QContent,
          [`QAttachment_${item.ID}`]: item.QAttachment && item.QAttachment.AttachUuid,
        });
      });
      //图片回显
      const uploadList = {},
        uploadCuid = {};
      data.map(item => {
        const attachmentFilesList = [];
        item.QAttachment.ImgList.map((img, index) => {
          attachmentFilesList.push({
            uid: index,
            name: item.QAttachment.ImgNameList[index],
            status: 'done',
            url: '/' + img,
          });
        });
        uploadList[`QAttachment_${item.ID}`] = attachmentFilesList;
        uploadCuid[`QAttachment_${item.ID}`] = item.QAttachment.AttachUuid
          ? item.QAttachment.AttachUuid
          : cuid();
      });
      setFilesList({ ...uploadList });
      setFilesCuidList({ ...uploadCuid });
    }
    setIsRejectModalOpen(true);
  };

  // 核查打回
  const onReject = () => {
    modalForm
      .validateFields()
      .then(values => {
        let planItems = verificationActionData.map(item => {
          const planItemCode = item.type === 'add' ? '' : item.ID;
          return {
            planItemCode: planItemCode,
            planItemContent: values[`QTitle_${item.ID}`],
            planItemDesc: values[`QContent_${item.ID}`],
            planItemAttachment: values[`QAttachment_${item.ID}`],
          };
        });
        // console.log('planItems', planItems);
        // return;
        props.dispatch({
          type: 'AbnormalIdentifyModel/RepulseCheck',
          payload: {
            modelCheckedGuid: id,
            planItems: planItems,
          },
          callback: res => {
            message.success('操作成功');
            history.go(-1);
          },
        });
      })
      .catch(errorInfo => {
        console.log('Failed:', errorInfo);
      });
  };

  const getVerificationActionColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        ellipsis: true,
        align: 'center',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '核查内容',
        dataIndex: 'QTitle',
        key: 'QTitle',
        width: 'auto',
        align: 'center',
        ellipsis: true,
        editable: true,
      },
      {
        title: '描述',
        dataIndex: 'QContent',
        key: 'QContent',
        width: 'auto',
        align: 'center',
        ellipsis: true,
        editable: true,
      },
      {
        title: '图片',
        dataIndex: 'QAttachment',
        key: 'QAttachment',
        width: 100,
        align: 'center',
        ellipsis: true,
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 80,
        render: (_, record) => {
          return (
            <span
              onClick={() => {
                verificationActionColumnsCancel(record);
              }}
            >
              <a>删除</a>
            </span>
          );
        },
      },
    ];
  };

  const verificationActionColumns = getVerificationActionColumns().map((col, index) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        index: index,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: true,
      }),
    };
  });

  const [verificationActionData, setVerificationActionData] = useState([]);
  const verificationActionAdd = () => {
    //添加核查动作
    const initCode = cuid();
    const newData = {
      type: 'add',
      ID: initCode,
      QTitle: '',
      QContent: '',
    };
    //图片
    setFilesList({ ...filesList, [`QAttachment_${initCode}`]: [] });
    setFilesCuidList({ ...filesCuidList, [`QAttachment_${initCode}`]: initCode });
    setVerificationActionData([...verificationActionData, newData]);
  };
  const verificationActionColumnsCancel = record => {
    const dataSource = [...verificationActionData];
    let newData = dataSource.filter(item => item.ID !== record.ID);
    setVerificationActionData(newData);
  };

  const filesCuid = () => {
    for (var key in filesCuidList) {
      if (key == files) {
        return filesCuidList[key];
      }
    }
  };
  const uploadProps = {
    //图片上传
    action: API.UploadApi.UploadPicture,
    headers: { Cookie: null, Authorization: 'Bearer ' + Cookie.get(cookieName) },
    accept: 'image/*',
    data: {
      FileUuid: filesCuid(),
      FileActualType: '0',
    },
    listType: 'picture-card',
    beforeUpload: file => {
      const fileType = file?.type; //获取文件类型 type  image/*
      if (!/^image/g.test(fileType)) {
        message.error(`请上传图片格式文件!`);
        return false;
      }
    },
    onChange(info) {
      const fileList = [];
      info.fileList.map(item => {
        if (item.response && item.response.IsSuccess) {
          //刚上传的
          fileList.push({ ...item, url: `/${item.response.Datas}` });
        } else if (!item.response) {
          fileList.push({ ...item });
        }
      });
      if (info.file.status === 'uploading') {
        setFilesList({ ...filesList, [files]: fileList });
      }
      if (
        info.file.status === 'done' ||
        info.file.status === 'removed' ||
        info.file.status === 'error'
      ) {
        setFilesList({ ...filesList, [files]: fileList });
        if (info.file.status === 'done') {
          if (info.file?.response?.IsSuccess) {
            modalForm.setFieldsValue({ [files]: filesCuid() });
            message.success('上传成功！');
          } else {
            message.error(info.file?.response?.Message);
          }
        }
        info.file.status === 'error' &&
          message.error(
            `${info.file.name}${
              info.file && info.file.response && info.file.response.Message
                ? info.file.response.Message
                : '上传失败'
            }`,
          );
      }
    },
    onRemove: file => {
      if (!file.error) {
        dispatch({
          type: 'autoForm/deleteAttach',
          payload: {
            Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
          },
        });
      }
    },
    fileList: filesList[files],
  };

  // ------------ 打回end

  const [checkVisible, setCheckVisible] = useState(false);
  const checkOk = async () => {
    const values = await form2.validateFields();

    // 处理暂定发出线索时间
    let StopBeginTime = undefined,
      StopEndTime = undefined;
    if (values.stopTime) {
      StopBeginTime = moment().format('YYYY-MM-DD HH:mm:ss');
      StopEndTime = moment()
        .add(1, values.stopTime)
        .format('YYYY-MM-DD HH:mm:ss');
    }

    props.dispatch({
      type: 'AbnormalIdentifyModel/CheckConfirm',
      payload: {
        modelCheckedGuid: id,
        ...values,
        StopBeginTime,
        StopEndTime,
        flag: values.flag?.length ? values.flag[values.flag.length - 1] : undefined,
      },
      callback: res => {
        setCheckVisible(false);
        history.go(-1);
        //router.push('/AbnormalIdentifyModel/VerificationTaskManagement/AlreadyVerifiedTask')
      },
    });
  };
  const SeeUploadComponents = ({ item }) => {
    return (
      <div>
        <Upload {...seeUploadProps(item ? item : [])} style={{ width: '100%' }} />
      </div>
    );
  };
  const [previewVisible, setPreviewVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0); //预览图片Index
  const [imgUrlList, setImgUrlList] = useState([]); //预览图片列表
  //返回的核查动作图片
  const seeUploadProps = imgList => {
    const imgLists = imgList.map(item => {
      return {
        uid: cuid(),
        status: 'done',
        url: `/${item}`,
      };
    });
    return {
      listType: 'picture-card',
      showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
      onPreview: file => {
        //预览
        const imageList = imgLists;
        let imageListIndex = 0;
        imageList.map((item, index) => {
          if (item.uid === file.uid) {
            imageListIndex = index;
          }
        });
        if (imageList && imageList[0]) {
          //拼接放大的图片地址列表
          const imgData = [];
          imageList.map((item, key) => {
            imgData.push(item.url);
          });
          setImgUrlList(imgData);
        }
        setPhotoIndex(imageListIndex);
        setPreviewVisible(true);
      },
      fileList: imgLists,
    };
  };
  const handleFileChange = (key, fileResponse) => {
    // 更新表单域的值
    form.setFieldsValue({ [key]: fileResponse });
  };
  const checkStatus = {
    核查完成: <Tag color="success">核查完成</Tag>,
    待确认: <Tag color="processing">待确认</Tag>,
    待核查: <Tag color="error">待核查</Tag>,
  };
  const isRectificationRecord = dataSource?.checkInfo?.IsRectificationRecord == 1; //需要现场核查
  return (
    <div className={styles.verificationTaskDetailWrapper}>
      <BreadcrumbWrapper>
        <Card style={{ paddingBottom: 24 }}>
          {queryLoading ? (
            <Skeleton avatar paragraph={{ rows: 4 }} />
          ) : (
            <>
              <Row align="middle">
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                  <img
                    width="28"
                    height="28"
                    src="/programme.png"
                    style={{ marginRight: isRectificationRecord == 1 ? 12 : 0 }}
                  />
                  {isRectificationRecord == 1 && <>方案：{dataSource?.Plan?.PlanName}</>}
                </span>
                <Button
                  style={{ marginLeft: 16 }}
                  onClick={() => {
                    history.go(-1);
                  }}
                >
                  <RollbackOutlined />
                  返回上级
                </Button>
              </Row>
              <Form style={{ paddingLeft: 40, paddingTop: 12 }}>
                <Row>
                  <Form.Item label="创建人" style={{ width: 300, paddingRight: 16 }}>
                    {dataSource?.checkInfo?.CreateUserName}
                  </Form.Item>

                  <Form.Item label="企业">{dataSource?.checkInfo?.EntName}</Form.Item>
                </Row>
                <Row>
                  <Form.Item label="创建时间" style={{ width: 300, paddingRight: 16 }}>
                    {dataSource?.checkInfo?.CreateTime}
                  </Form.Item>
                  <Form.Item label="排口">{dataSource?.checkInfo?.PointName}</Form.Item>
                </Row>
                <Row>
                  <Form.Item label="是否核查" style={{ width: 300, paddingRight: 16 }}>
                    {dataSource?.checkInfo?.IsRectificationRecordName}
                  </Form.Item>
                  <Form.Item label="场景类型">{dataSource?.checkInfo?.WarningTypeName}</Form.Item>
                </Row>
                <div style={{ position: 'absolute', top: 80, right: 60, textAlign: 'right' }}>
                  <div>状态</div>
                  <div style={{ fontSize: 18 }}>{dataSource?.checkInfo?.StatusName}</div>
                </div>
              </Form>
            </>
          )}
        </Card>
        <Tabs>
          <Tabs.TabPane tab={'详情'} key={1}>
            <Card title={<span style={{ fontWeight: 'bold' }}>线索详情</span>}>
              <SdlTable
                rowKey={(record, index) => `${index}`}
                align="center"
                columns={getColumns()}
                dataSource={dataSource?.finalResult}
                loading={queryLoading}
                scroll={{ y: 240 }}
                pagination={false}
              />
            </Card>
            <Card
              title={<span style={{ fontWeight: 'bold' }}>方案及核查信息</span>}
              style={{ marginTop: 8 }}
            >
              {queryLoading ? (
                <Skeleton paragraph={{ rows: 4 }} />
              ) : (
                <>
                  <Row>
                    <Col span={6}>
                      <Form.Item label="核查状态">
                        {checkStatus[(dataSource?.checkInfo?.StatusName)]}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item className="checkedDesLabel" label="核查结论">
                        {dataSource?.checkInfo?.CheckedDes || '-'}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="核查人">
                        {dataSource?.checkInfo?.CheckUserName || '-'}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="核查时间">
                        {dataSource?.checkInfo?.CheckedTime || '-'}
                      </Form.Item>
                    </Col>
                  </Row>
                  {isRectificationRecord == 1 ? (
                    <>
                      <Form.Item label="方案及核查信息" className="programmeLabel">
                        <div
                          dangerouslySetInnerHTML={{ __html: dataSource?.Plan?.ContentBody }}
                        ></div>
                      </Form.Item>
                      <Form name="checkAction" form={form} layout="vertical">
                        {dataSource?.Plan?.oldPlanItem?.length ? (
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              padding: '12px 0 10px 69px',
                            }}
                          >
                            <Collapse>
                              {dataSource?.Plan?.oldPlanItem?.map((oldPlan, idx) => {
                                return (
                                  <Panel
                                    header={
                                      <p>
                                        {`${oldPlan[0].RepulseUserName}在${oldPlan[0].RepulseTime}`}{' '}
                                        <Tag color="error">打回</Tag>
                                      </p>
                                    }
                                    key={idx}
                                  >
                                    {oldPlan.map((item, index) => {
                                      const cuids = item.ReAttachment?.AttachID
                                        ? item.ReAttachment.AttachID
                                        : cuid();
                                      const fileList = item.ReAttachment?.ImgList?.map(item => {
                                        return {
                                          uid: cuids,
                                          status: 'done',
                                          url: `/${item}`,
                                        };
                                      });
                                      return (
                                        <div style={{ paddingBottom: 12 }}>
                                          {item.QContent?.trim() ? (
                                            <Form.Item label={`${index + 1}.${item.QTitle}`}>
                                              {item.QContent}
                                            </Form.Item>
                                          ) : (
                                            <span style={{ marginTop: 10 }}>{`${index + 1}.${
                                              item.QTitle
                                            }`}</span>
                                          )}
                                          {item.QAttachment?.ImgList?.[0] && (
                                            <div>
                                              <SeeUploadComponents
                                                item={item.QAttachment?.ImgList}
                                              />
                                            </div>
                                          )}
                                          <Row>
                                            <Col span={12} style={{ paddingRight: 8 }}>
                                              <Form.Item
                                                label="核查结果："
                                                name={`reContent_${item.ID}`}
                                                initialValue={item.ReContent}
                                              >
                                                <Input.TextArea
                                                  disabled
                                                  rows={3}
                                                  placeholder="请填写核查结果"
                                                  style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                                                />
                                              </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                              <div style={{ marginTop: 30 }}>
                                                <SeeUploadComponents
                                                  item={item.ReAttachment?.ImgList}
                                                />
                                              </div>
                                            </Col>
                                          </Row>
                                        </div>
                                      );
                                    })}
                                  </Panel>
                                );
                              })}
                            </Collapse>
                          </div>
                        ) : (
                          ''
                        )}
                        <div
                          style={{ fontSize: 16, fontWeight: 'bold', padding: '12px 0 10px 69px' }}
                        >
                          核查动作
                        </div>
                        <div style={{ paddingLeft: 112 }}>
                          {dataSource?.Plan?.PlanItem?.map((item, index) => {
                            const cuids = item.ReAttachment?.AttachID
                              ? item.ReAttachment.AttachID
                              : cuid();
                            const fileList = item.ReAttachment?.ImgList?.map(item => {
                              return {
                                uid: cuids,
                                status: 'done',
                                url: `/${item}`,
                              };
                            });
                            return (
                              <div style={{ paddingBottom: 12 }}>
                                {item.QContent?.trim() ? (
                                  <Form.Item label={`${index + 1}.${item.QTitle}`}>
                                    {item.QContent}
                                  </Form.Item>
                                ) : (
                                  <span style={{ marginTop: 10 }}>{`${index + 1}.${
                                    item.QTitle
                                  }`}</span>
                                )}
                                {item.QAttachment?.ImgList?.[0] && (
                                  <div>
                                    <SeeUploadComponents item={item.QAttachment?.ImgList} />
                                  </div>
                                )}
                                <Row>
                                  <Col span={type == 1 ? 16 : 12} style={{ paddingRight: 8 }}>
                                    <Form.Item
                                      label="核查结果："
                                      name={`reContent_${item.ID}`}
                                      rules={[
                                        {
                                          required: type == 1 ? true : false,
                                          message: `请填写核查结果!`,
                                        },
                                      ]}
                                      initialValue={item.ReContent}
                                    >
                                      {type == 1 ? (
                                        <Input.TextArea rows={4} placeholder="请填写核查结果" />
                                      ) : (
                                        // item.ReContent
                                        <Input.TextArea
                                          disabled
                                          rows={3}
                                          placeholder="请填写核查结果"
                                          style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                                        />
                                      )}
                                    </Form.Item>
                                  </Col>
                                  <Col span={type == 1 ? 8 : 12}>
                                    <div style={{ marginTop: 30 }}>
                                      {type == 1 ? (
                                        <CustomUpload
                                          fileListData={fileList}
                                          key={index}
                                          name={`reAttachment_${item.ID}`}
                                          uid={cuids}
                                          onFileChange={(k, res) => handleFileChange(k, res)}
                                        />
                                      ) : (
                                        <SeeUploadComponents item={item.ReAttachment?.ImgList} />
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            );
                          })}
                        </div>
                      </Form>
                    </>
                  ) : (
                    <>
                      <Form.Item label="核查结果与线索是否符合">
                        {dataSource?.checkInfo?.CheckedResult}
                      </Form.Item>
                      <Form.Item label="核查原因" className="programmeLabel2">
                        <div
                          dangerouslySetInnerHTML={{ __html: dataSource?.checkInfo?.UntruthReason }}
                        ></div>
                      </Form.Item>
                    </>
                  )}
                  {(type == 1 || type == 2) && (
                    <Row style={{ margin: '12px 0 24px 0' }} justify="end">
                      {type == 1 ? (
                        <Space>
                          <Button
                            type="primary"
                            loading={saveLoading}
                            onClick={() => {
                              save(1);
                            }}
                          >
                            保存
                          </Button>
                          <Button
                            type="primary"
                            loading={saveLoading}
                            onClick={() => {
                              save(2);
                            }}
                          >
                            提交
                          </Button>
                        </Space>
                      ) : (
                        <Space>
                          <Button
                            type="primary"
                            danger
                            onClick={() => {
                              onRejectBtnClick();
                            }}
                          >
                            打回
                          </Button>
                          <Button
                            type="primary"
                            loading={saveLoading}
                            onClick={() => {
                              setCheckVisible(true);
                              form2.resetFields();
                            }}
                          >
                            核查
                          </Button>
                        </Space>
                      )}
                    </Row>
                  )}
                </>
              )}
            </Card>
          </Tabs.TabPane>
        </Tabs>
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
              // showMode={showMode}
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
        <Modal
          title="核实"
          confirmLoading={checkConfirmLoading}
          visible={checkVisible}
          onCancel={() => {
            setCheckVisible(false);
            form2.resetFields();
          }}
          onOk={checkOk}
        >
          <Form name="check" form={form2} labelCol={{ flex: '130px' }}>
            <Form.Item
              name="IsRectificationRecord"
              label="是否需要整改"
              labelCol={{ flex: '130px' }}
              rules={[{ required: true, message: '请选择是否需要整改!' }]}
              initialValue={0}
            >
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="checkedResult"
              label="与线索是否符合"
              labelCol={{ flex: '130px' }}
              rules={[{ required: true, message: '请选择与线索是否符合!' }]}
            >
              <Radio.Group>
                <Radio value={1}>符合</Radio>
                <Radio value={2}>部分符合</Radio>
                <Radio value={3}>不符合</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="stopTime"
              label={
                <span>
                  暂停发出线索
                  <QuestionTooltip
                    content="已知发生问题的原因暂无法解决的情况"
                    style={{ marginLeft: 2 }}
                  />
                </span>
              }
              // rules={[{ required: true, message: '请选择核查人!' }]}
            >
              <Select style={{ width: '100%' }} placeholder="请选择暂停时间" allowClear>
                <Option value={1}>一周</Option>
                <Option value={2}>一个月</Option>
              </Select>
            </Form.Item>
            <Spin
              spinning={!!preTakeFlagDatasLoading}
              size="small"
              style={{ width: '100%', top: -12 }}
            >
              <Form.Item
                name="flag"
                label="专家意见"
                rules={[{ required: false, message: '请选择标记!' }]}
              >
                <Cascader
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  fieldNames={{ label: 'FlagName', value: 'FlagCode', children: 'ChildrenFlags' }}
                  options={preTakeFlagDatas}
                  placeholder="请选择标记"
                />
              </Form.Item>
            </Spin>
            <Form.Item
              label="核查结论"
              name="checkedDes"
              rules={[{ required: true, message: '请输入核查结论!' }]}
            >
              <Input.TextArea placeholder="请输入" />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="打回"
          confirmLoading={checkConfirmLoading}
          open={isRejectModalOpen}
          onCancel={() => {
            setIsRejectModalOpen(false);
          }}
          onOk={onReject}
          width={900}
          bodyStyle={{ padding: '12px 24px' }}
        >
          <Form name="basic2" form={modalForm} initialValues={{}} labelCol={{ flex: '120px' }}>
            <Row align="middle" style={{ marginBottom: 6 }}>
              <span
                style={{
                  display: 'inline-block',
                  height: 14,
                  width: 4,
                  marginRight: 4,
                  backgroundColor: '#3888ff',
                }}
              ></span>
              核查动作
            </Row>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={verificationActionData}
              columns={verificationActionColumns}
              scroll={{ x: 680, y: 'hidden' }}
              pagination={false}
              size="small"
              className={'verificationActionTableSty'}
            />
            <Button
              style={{ margin: '10px 0 15px 0' }}
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={() => verificationActionAdd()}
            >
              新增
            </Button>
          </Form>
        </Modal>
        <Modal
          title="上传图片"
          open={fileVisible}
          onOk={() => {
            setFileVisible(false);
          }}
          destroyOnClose
          onCancel={() => {
            setFileVisible(false);
          }}
          width={'50%'}
          footer={null}
        >
          <Upload {...uploadProps} style={{ width: '100%' }}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          </Upload>
        </Modal>
        <ImageView
          isOpen={previewVisible}
          images={imgUrlList?.length ? imgUrlList : []}
          imageIndex={photoIndex}
          onCloseRequest={() => {
            setPreviewVisible(false);
          }}
        />
      </BreadcrumbWrapper>
    </div>
  );
};

export default connect(dvaPropsData)(Index);
