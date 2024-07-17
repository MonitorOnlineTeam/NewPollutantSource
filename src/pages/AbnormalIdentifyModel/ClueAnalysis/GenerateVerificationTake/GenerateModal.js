/*
 * @Author: jab
 * @Date: 2024-01-23
 * @Description：生成核查任务 组件
 */

import React, { useState, useEffect, useRef } from 'react';
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
} from 'antd';
import styles from '../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import cuid from 'cuid';
import Cookie from 'js-cookie';
import { ModelNumberIdsDatas, ModalNameConversion } from '../../CONST';
import { Resizable, ResizableBox } from 'react-resizable';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { API } from '@config/API';
import { cookieName, uploadPrefix } from '@/config';
import ImageView from '@/components/ImageView';
import CluesDetails from '@/pages/AbnormalIdentifyModel/CluesList/CluesDetails.js';
const { Panel } = Collapse;
// 自定义文字大小
let fontSize = ['12px', '14px', '16px', '18px', '20px', '24px', '36px'];
Quill.imports['attributors/style/size'].whitelist = fontSize;
Quill.register(Quill.imports['attributors/style/size']);
import BetterTable from 'quill-better-table';
import 'quill-better-table/dist/quill-better-table.css';
// 注册 better-table 模块到 Quill
Quill.register({ 'modules/better-table': BetterTable }, true);
import { quillModules } from '@/utils/utils';
const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  preTakeFlagDatasLoading: loading.effects['AbnormalIdentifyModel/GetPreTakeFlagDatas'],
  checkRoleDatasLoading: loading.effects['AbnormalIdentifyModel/GetCheckRoleDatas'],
  planDatasLoading: loading.effects['AbnormalIdentifyModel/GetPlanDatas'],
  addLoading: loading.effects['AbnormalIdentifyModel/AddPlanTask'],
});

let editor, editor2;
const Index = props => {
  const [modalForm] = Form.useForm();

  const quillRef = useRef(null);
  const quillRef2 = useRef(null);

  const {
    visible,
    dispatch,
    preTakeFlagDatasLoading,
    checkRoleDatasLoading,
    planDatasLoading,
    addLoading,
    history,
    selectedRowKeys,
    selectedRow,
  } = props;
  const currentUser = Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser'));
  const [planPopVisible, setPlanPopVisible] = useState(false);
  const [collapsekey, setCollapsekey] = useState();
  const [siteVerificationPlanType, setSiteVerificationPlanType] = useState(1);

  let locationPar = history?.location?.query?.data
    ? JSON.parse(props?.history?.location?.query?.data)
    : '';

  useEffect(() => {

  }, []);


  useEffect(() => {
    if (collapsekey == 1) {
      setTimeout(() => {
        if (quillRef.current) {
          editor = new Quill(quillRef.current, { ...quillModules });
          editor.on('text-change', () => {
            // 监听Quill编辑器的内容变化
            modalForm.validateFields(['planContent']);
          });
        }
      });
    } else {
      quillRef.current = null;
    }
  }, [collapsekey]);
  useEffect(() => {
    if (siteVerificationPlanType == 2) {
      setTimeout(() => {
        if (quillRef2.current) {
          editor2 = new Quill(quillRef2.current, { ...quillModules });
          console.log('editor2', editor2);
          editor2.on('text-change', () => {
            modalForm.validateFields(['checkReason']);
          });
        }
      });
    } else {
      quillRef2.current = null;
    }
  }, [siteVerificationPlanType]);


  const getVerificationPlanColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        ellipsis: true,
        align: 'center',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '方案名称',
        dataIndex: 'PlanName',
        key: 'PlanName',
        width: 200,
        align: 'center',
        ellipsis: true,
      },
      {
        title: '创建人',
        dataIndex: 'CreateUser',
        key: 'CreateUser',
        width: 120,
        align: 'center',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        width: 150,
        align: 'center',
        ellipsis: true,
      },
    ];
  };
  const getVerificationActionColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
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
        width: 120,
        align: 'center',
        ellipsis: true,
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 100,
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
      PlanItemCode: initCode,
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
    let newData = dataSource.filter(item => item.PlanItemCode !== record.PlanItemCode);
    setVerificationActionData(newData);
  };




  const [preTakeFlagDatas, setPreTakeFlagDatas] = useState([]); //专家意见
  const [checkRoleDatas, setCheckRoleDatas] = useState([]); //核查角色
  const [planDatas, setPlanDatas] = useState([]); //已有核查方案

  const generateVerificationTakeFun = () => {
    if (selectedRowKeys?.[0]) {
      setVisible(true);
    } else {
      message.warning('请选择企业');
    }
  };

  const initVerificationActionData = () => {
    //初始化核查动作
    setVerificationActionData([]);
    setFilesList({});
    setFilesCuidList({});
    const initCode = cuid();
    const newData = {
      type: 'add',
      PlanItemCode: initCode,
      QTitle: '',
      QContent: '',
    };
    //图片
    setFilesList({ [`QAttachment_${initCode}`]: [] });
    setFilesCuidList({ [`QAttachment_${initCode}`]: initCode });
    setVerificationActionData([newData]);
  };

  useEffect(() => {
    if (visible) {
      modalForm.resetFields();
      setSaveType();
      setSiteVerificationPlanType(1);
      setVerificationPlanType(1);
      setCollapsekey('1');
      dispatch({
        type: 'AbnormalIdentifyModel/GetPreTakeFlagDatas',
        payload: {},
        callback: res => {
          setPreTakeFlagDatas(res);
        },
      });
      dispatch({
        type: 'AbnormalIdentifyModel/GetCheckRoleDatas',
        payload: {},
        callback: res => {
          const userList = res?.map(item => {
            return {
              label: item.QuestionName,
              options: item?.Users?.map(chilItem => ({
                label: chilItem.UserName,
                value: chilItem.UserID,
              })),
            };
          });
          console.log(userList);
          setCheckRoleDatas(userList);
        },
      });
      dispatch({
        type: 'AbnormalIdentifyModel/GetPlanDatas',
        payload: {},
        callback: res => {
          setPlanDatas(res);
        },
      });
    } else {
    //   setSelectedRowKeys([]);
    //   setSelectedRow([]);
      setPreTakeFlagDatas([]);
      setCheckRoleDatas([]);
      setPlanDatas([]);
      initVerificationActionData();
    }
  }, [visible]);

  const save = type => {
    const validateFieldsFun = async () => {
      const modalValues = await modalForm.validateFields();
      if (siteVerificationPlanType == 1) {
        //现场核查
        if (verificationActionData?.length == 0) {
          message.error('请新增核查动作');
          return;
        }
      }
      const parData = {
        planAction: type,
        createUserId: currentUser?.User_ID,
        warningCodes: selectedRowKeys?.[0] ? selectedRowKeys.toString() : '',
        isSceneCheck: modalValues.isSceneCheck,
        isSavePlan: modalValues.isSavePlan,
        preTakeFlag: modalValues.preTakeFlag?.length
          ? modalValues.preTakeFlag[modalValues.preTakeFlag.length - 1]
          : undefined,
        checkResult: modalValues.checkResult,
        checkConclusion: modalValues.checkConclusion,
        checkReason: modalValues.checkReason,
        checkUserId: modalValues.checkUserId,
        checkPlan:
          siteVerificationPlanType == 1
            ? {
                planCode: modalValues.planCode,
                planName: modalValues.planName,
                planContent: modalValues.planContent,
                planItems: verificationActionData.map(item => {
                  const planItemCode = item.type === 'add' ? '' : item.PlanItemCode;
                  return {
                    planItemCode: planItemCode,
                    planItemContent: modalValues[`QTitle_${item.PlanItemCode}`],
                    planItemDesc: modalValues[`QContent_${item.PlanItemCode}`],
                    planItemAttachment: modalValues[`QAttachment_${item.PlanItemCode}`],
                  };
                }),
              }
            : undefined,
      };
      dispatch({
        type: 'AbnormalIdentifyModel/AddPlanTask',
        payload: { ...parData },
        callback: res => {
          props.onCancel()
          setCollapsekey('1');
          props.onFinish();
        },
      });
    };
    if (siteVerificationPlanType == 1 && !collapsekey) {
      //未展开核实方案
      setCollapsekey('1');
      setTimeout(() => {
        validateFieldsFun();
      }, 0);
    } else {
      validateFieldsFun();
    }
  };

  const [selectedPlanRowKeys, setSelectedPlanRowKeys] = useState([]);
  const [selectedPlanRow, setSelectedPlanRow] = useState([]);
  const rowPlanSelection = {
    selectedRowKeys: selectedPlanRowKeys,
    onChange: (newSelectedRowKeys, row) => {
      if (newSelectedRowKeys?.length === 1) {
        setSelectedPlanRowKeys(newSelectedRowKeys);
        setSelectedPlanRow(row?.[0]);
      } else {
        let diffIndex = newSelectedRowKeys.filter(x => !selectedPlanRowKeys.includes(x));
        setSelectedPlanRowKeys(diffIndex);
        setSelectedPlanRow(row?.[diffIndex]);
      }
    },
  };
  const [verificationPlanType, setVerificationPlanType] = useState(1);
  const [saveType, setSaveType] = useState();
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
          {' '}
          <a
            onClick={() => {
              setFileVisible(true);
              setFiles(`QAttachment_${record.PlanItemCode}`);
            }}
          >
            {filesList[`QAttachment_${record.PlanItemCode}`] &&
            filesList[`QAttachment_${record.PlanItemCode}`][0]
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
            name={`${dataIndex}_${record.PlanItemCode}`}
            style={{ margin: 0 }}
            rules={[{ required: title === '图片' ? false : true, message: `请输入${title}!` }]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const [fileVisible, setFileVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState();
  const [photoIndex, setPhotoIndex] = useState(0); //预览图片Index
  const [imgUrlList, setImgUrlList] = useState([]); //预览图片列表

  const [files, setFiles] = useState();
  const [filesCuidList, setFilesCuidList] = useState({});
  const [filesList, setFilesList] = useState({});

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
    onPreview: async file => {
      //预览

      const imageList = filesList[files];

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
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
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

  return (
    <div>
        <Modal
          title={'生成核查任务'}
          destroyOnClose
          wrapClassName={'spreadOverModal'}
          mask={false}
          className={styles.generateVerificationTakeModal}
          {...props}
          footer={[
            <Button
              key="back"
              onClick={() => {
                setVisible(false);
              }}
            >
              取消
            </Button>,
            siteVerificationPlanType == 1 && saveType == 1 && verificationPlanType == 1 ? ( //新建方案保存
              <Button key="submit" type="primary" loading={addLoading} onClick={() => save(1)}>
                提交并新增到方案库
              </Button>
            ) : siteVerificationPlanType == 1 && saveType == 1 && verificationPlanType == 2 ? ( //选择方案保存
              <>
                <Button key="submit" type="primary" loading={addLoading} onClick={() => save(1)}>
                  提交并新增到方案库
                </Button>
                <Button key="submit" type="primary" loading={addLoading} onClick={() => save(2)}>
                  提交并覆盖原有方案库
                </Button>
              </>
            ) : (
              <Button type="primary" loading={addLoading} onClick={() => save(3)}>
                提交
              </Button>
            ),
          ]}
        >
          <Form
            name="basic2"
            form={modalForm}
            initialValues={{
              verificationPlanType: 1,
              isSceneCheck: 1,
              checkResult: 1,
              checkUserId: locationPar?.operationUser,
            }}
          >
            <Row>
              <Col span={8}>
                <Form.Item label="企业">{selectedRow?.EntName}</Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="排口">{selectedRow?.PointName}</Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="isSceneCheck"
                  label="现场核查"
                  rules={[{ required: true, message: '请选择现场核查!' }]}
                >
                  <Radio.Group
                    onChange={e => {
                      setSiteVerificationPlanType(e.target?.value);
                      setCollapsekey(e.target.value == 1 ? 1 : undefined);
                      setSaveType();
                      modalForm.resetFields();
                      modalForm.setFieldsValue({
                        isSceneCheck: e.target?.value,
                      });
                      initVerificationActionData(); //重新初始化核查动作数据
                    }}
                  >
                    <Radio value={1}>需要</Radio>
                    <Radio value={2}>不需要</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Spin spinning={!!preTakeFlagDatasLoading} size="small" style={{ width: 440, top: -6 }}>
              <Form.Item
                name="preTakeFlag"
                label="专家意见"
                rules={[{ required: true, message: '请选择标记!' }]}
              >
                <Cascader
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: 300 }}
                  fieldNames={{ label: 'FlagName', value: 'FlagCode', children: 'ChildrenFlags' }}
                  options={preTakeFlagDatas}
                  placeholder="请选择标记"
                />
              </Form.Item>
            </Spin>
            {siteVerificationPlanType == 1 ? (
              <>
                <Spin
                  spinning={!!checkRoleDatasLoading}
                  size="small"
                  style={{ width: 440, top: -6 }}
                >
                  <Form.Item
                    name="checkUserId"
                    label="核查人"
                    rules={[{ required: true, message: '请选择核查人!' }]}
                  >
                    <Select
                      options={checkRoleDatas?.[0] ? checkRoleDatas : []}
                      style={{ width: 300 }}
                      placeholder="请选择"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Spin>
                <Row>
                  <Form.Item
                    name="verificationPlanType"
                    label="核查方案"
                    rules={[{ required: true, message: '请选择核查方案!' }]}
                  >
                    <Select
                      style={{ width: 300 }}
                      value={verificationPlanType}
                      placeholder="请选择"
                      onChange={value => {
                        setVerificationPlanType(value);
                        modalForm.setFieldsValue({ planName: '', planContent: '', planCode: '' });
                        initVerificationActionData();
                        setPlanPopVisible(false);
                        if (editor?.root?.innerHTML) {
                          editor.root.innerHTML = ''; //清空富文本内容
                        }
                      }}
                    >
                      <Option value={1}>新建方案</Option>
                      <Option value={2}>选择已有方案</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="planName"
                    style={{ margin: '0 6px' }}
                    rules={[{ required: true, message: '请输入方案名称!' }]}
                  >
                    <Input
                      style={{ width: 320 }}
                      disabled={verificationPlanType === 2}
                      placeholder={verificationPlanType == 1 ? '请输入方案名称' : '请选择'}
                    />
                  </Form.Item>
                  <Popover
                    visible={planPopVisible}
                    title="核查预案"
                    trigger="click"
                    getPopupContainer={node => {
                      if (node && node.parentNode) {
                        return node.parentNode;
                      }
                      return node;
                    }}
                    placement={planDatas?.length >= 18 ? 'rightBottom' : 'right'}
                    content={
                      <>
                        <Table
                          rowKey={(record, index) => index}
                          bordered
                          size="small"
                          rowSelection={rowPlanSelection}
                          columns={getVerificationPlanColumns()}
                          dataSource={planDatas}
                          loading={planDatasLoading}
                          scroll={{ x: '100%', y: 'calc(100vh - 260px)' }}
                          pagination={false}
                        />
                        <Row justify="end" style={{ marginTop: 8 }}>
                          <Button
                            type="default"
                            size="small"
                            onClick={() => {
                              setPlanPopVisible(false);
                              setSelectedPlanRowKeys([]);
                              setSelectedPlanRow([]);
                            }}
                          >
                            取消
                          </Button>
                          {planDatas?.[0] && (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => {
                                if (selectedPlanRowKeys?.length > 0) {
                                  setPlanPopVisible(false);
                                  setCollapsekey('1');
                                  setTimeout(() => {
                                    if (selectedPlanRow?.PlanItemDatas?.[0]) {
                                      modalForm.setFieldsValue({
                                        planName: selectedPlanRow.PlanName,
                                        planContent: selectedPlanRow.PlanContent,
                                        planCode: selectedPlanRow?.PlanCode,
                                      });
                                      setTimeout(() => {
                                        //给富文本赋值
                                        if (quillRef.current) {
                                          editor.root.innerHTML = selectedPlanRow.PlanContent;
                                        }
                                      });
                                      const data = selectedPlanRow.PlanItemDatas;
                                      setVerificationActionData(data);
                                      if (data?.[0]) {
                                        data.map(item => {
                                          modalForm.setFieldsValue({
                                            [`QTitle_${item.PlanItemCode}`]: item.QTitle,
                                            [`QContent_${item.PlanItemCode}`]: item.QContent,
                                            [`QAttachment_${item.PlanItemCode}`]:
                                              item.QAttachment[0] && item.QAttachment[0].FileUuid,
                                          });
                                        });
                                        //图片回显
                                        const uploadList = {},
                                          uploadCuid = {};
                                        data.map(item => {
                                          const attachmentFilesList = [];
                                          item.QAttachment?.[0] &&
                                            item.QAttachment.map(attachmentItem => {
                                              if (!attachmentItem.IsDelete) {
                                                attachmentFilesList.push({
                                                  uid: attachmentItem.GUID,
                                                  name: attachmentItem.FileName,
                                                  status: 'done',
                                                  url: `${uploadPrefix}/${attachmentItem.FileName}`,
                                                });
                                              }
                                            });
                                          uploadList[
                                            `QAttachment_${item.PlanItemCode}`
                                          ] = attachmentFilesList;
                                          uploadCuid[`QAttachment_${item.PlanItemCode}`] = item
                                            .QAttachment?.[0]?.FileUuid
                                            ? item.QAttachment[0].FileUuid
                                            : cuid();
                                        });
                                        setFilesList({ ...uploadList });
                                        setFilesCuidList({ ...uploadCuid });
                                      }
                                    }
                                    setSelectedPlanRowKeys([]);
                                    setSelectedPlanRow([]);
                                  }, 0);
                                } else {
                                  message.warning('请选择核查方案');
                                }
                              }}
                              style={{ marginLeft: 6 }}
                            >
                              选择
                            </Button>
                          )}
                        </Row>
                      </>
                    }
                  >
                    {verificationPlanType == 2 && (
                      <Button
                        type="primary"
                        onClick={() => {
                          setPlanPopVisible(true);
                        }}
                      >
                        选择已有方案
                      </Button>
                    )}
                  </Popover>
                </Row>
                <Collapse
                  onChange={value => {
                    setCollapsekey(value?.[0]);
                  }}
                  ghost
                  defaultActiveKey="1"
                >
                  <Panel header={<div style={{ fontWeight: 'bold' }}>核查方案</div>} key="1">
                    <Form.Item
                      name="isSavePlan"
                      label="保存到方案库"
                      rules={[{ required: true, message: '请选择是否保存到方案库!' }]}
                    >
                      <Radio.Group
                        onChange={e => {
                          setSaveType(e.target.value);
                        }}
                      >
                        <Radio value={1}>保存</Radio>
                        <Radio value={2}>不保存</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <ResizableBox
                      height={260}
                      axis={'y'}
                      minConstraints={['100%', 120]}
                      className={'resizable_quill_sty'}
                      style={{ marginTop: 8 }}
                    >
                      <Form.Item
                        name="planContent"
                        style={{ height: '100%' }}
                        rules={[
                          {
                            validator: (_, value) => {
                              const editorContent = editor?.root?.innerHTML;
                              const contentVal =
                                editorContent && editorContent.replaceAll(/<p>|[</p>]/g, '').trim();
                              if (!contentVal || contentVal === 'br') {
                                return Promise.reject(new Error('请输入核查方案!'));
                              } else {
                                modalForm.setFieldsValue({ planContent: editorContent });
                                return Promise.resolve();
                              }
                            },
                          },
                        ]}
                      >
                        <div ref={quillRef} />
                      </Form.Item>
                    </ResizableBox>
                    <Row align="middle" style={{ marginBottom: 6 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          height: 14,
                          width: 4,
                          marginRight: 4,
                          backgroundColor: '#3888ff',
                        }}
                      ></span>{' '}
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
                  </Panel>
                </Collapse>
              </>
            ) : (
              <>
                <Form.Item
                  name="checkResult"
                  label="核查结果与线索是否符合"
                  rules={[{ required: true, message: '请选择核查结果与线索是否符合!' }]}
                >
                  <Radio.Group>
                    <Radio value={1}>符合</Radio>
                    <Radio value={2}>部分符合</Radio>
                    <Radio value={3}>不符合</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="核查结论"
                  name="checkConclusion"
                  rules={[{ required: true, message: '请输入核查结论!' }]}
                >
                  <Input.TextArea placeholder="请输入" />
                </Form.Item>
                <ResizableBox
                  height={260}
                  axis={'y'}
                  minConstraints={['100%', 120]}
                  className={'resizable_quill_sty'}
                >
                  <Form.Item
                    label="原因"
                    name="checkReason"
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          const editorContent2 = editor2?.root?.innerHTML;
                          const contentVal =
                            editorContent2 && editorContent2.replaceAll(/<p>|[</p>]/g, '').trim();
                          if (!contentVal || contentVal === 'br') {
                            return Promise.reject(new Error('请输入原因！'));
                          } else {
                            modalForm.setFieldsValue({ checkReason: editorContent2 });
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <div ref={quillRef2} />
                  </Form.Item>
                </ResizableBox>
              </>
            )}
            <Form.Item name="planCode" hidden></Form.Item>
          </Form>
        </Modal>
        <Modal
          title="上传图片"
          visible={fileVisible}
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
    </div>
  );
};

export default connect(dvaPropsData)(Index);
