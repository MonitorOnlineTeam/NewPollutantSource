/*
 * @Author: jab
 * @Date: 2024-01-23
 * @Description：生成核查任务
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, Badge, Tooltip, Input, Radio, Modal, Row, message, Popover, Table, Collapse, Cascader, Upload } from 'antd';
import styles from '../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import cuid from 'cuid';
import Cookie from 'js-cookie';
import { ModelNumberIdsDatas, ModalNameConversion } from '../../CONST';
import { Resizable, ResizableBox } from 'react-resizable';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { API } from '@config/API';
import { cookieName, uploadPrefix } from '@/config'
import ImageView from '@/components/ImageView';
const { Panel } = Collapse;
const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};
// 自定义文字大小
let fontSize = ['12px', '14px', '16px', '18px', '20px', '24px', '36px']
Quill.imports['attributors/style/size'].whitelist = fontSize;
Quill.register(Quill.imports['attributors/style/size']);
import { quillModules } from '@/utils/utils';
const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  generateVerificationTakeData: AbnormalIdentifyModel.generateVerificationTakeData,
  workTowerData: AbnormalIdentifyModel.workTowerData,
  modelListLoading: loading.effects['AbnormalIdentifyModel/GetModelList'],
  queryLoading: loading.effects['AbnormalIdentifyModel/GetWaitCheckDatas'],
  pointListLoading: loading.effects['common/getPointByEntCode'],
  entListLoading: loading.effects['common/GetEntByRegion'],
  queryPlanLoading: loading.effects['AbnormalIdentifyModel/GetWaitCheckDatas'],
  preTakeFlagDatasLoading: loading.effects['AbnormalIdentifyModel/GetPreTakeFlagDatas'],
  checkRoleDatasLoading: loading.effects['AbnormalIdentifyModel/GetCheckRoleDatas'],
  planDatasLoading: loading.effects['AbnormalIdentifyModel/GetPlanDatas'],
  addLoading: loading.effects['AbnormalIdentifyModel/AddPlanTask'],

});

const Index = props => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();


  const {
    dispatch,
    modelListLoading,
    queryLoading,
    pointListLoading,
    entListLoading,
    generateVerificationTakeData,
    generateVerificationTakeData: { pageIndex, pageSize, scrollTop, type },
    workTowerData,
    history,
    queryPlanLoading,
    preTakeFlagDatasLoading,
    checkRoleDatasLoading,
    planDatasLoading,
    addLoading,
  } = props;
  let data = history?.location?.query?.data ? JSON.parse(props?.history?.location?.query?.data) : ''
  const currentUser = JSON.parse(Cookie.get('currentUser'));
  const [modelList, setModelList] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false)
  const [planPopVisible, setPlanPopVisible] = useState(false);

  useEffect(() => {
    form.resetFields();
    if (!data) { //点菜单进入
      GetModelList();
      onTableChange(1, 20)
    } else {
      if (type == 1) {//从详情返回
        GetModelList();
        onFinish(pageIndex, pageSize);
      } else if (type == 2) {//从工作台进入
        props.dispatch({
          type: 'AbnormalIdentifyModel/updateState',
          payload: { workTowerData: { ...workTowerData, type: 2 } },
        });
        form.setFieldsValue({
          date: data.beginTime && data.endTime ? [moment(data.beginTime), moment(data.endTime)] : [],
        })
        getPointList(data?.entCode, () => {
          form.setFieldsValue({
            entCode: data?.entCode,
            dgimn: data?.dgimn,
          })
          GetModelList(() => {
            form.setFieldsValue({
              warningCode: data?.warningCode
            })
            onTableChange(1, 20)
          });

        })


      }
    }
  }, []);

  // 获取数据模型列表
  const GetModelList = (callback) => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelList',
      payload: {},
      callback: (res, unfoldModelList) => {
        let _modelList = unfoldModelList;
        setModelList(_modelList);
        callback && callback()
      },
    });
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
          return (
            (pageIndex - 1) * pageSize + index + 1
          );
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
        title: '行业',
        dataIndex: 'Industry',
        key: 'Industry',
        width: 120,
        ellipsis: true,
      },
      {
        title: '发现线索时间',
        dataIndex: 'ClueTime',
        key: 'ClueTime',
        width: 180,
        ellipsis: true,
      },
      {
        title: '场景类别',
        dataIndex: 'WarningName',
        key: 'WarningName',
        width: 180,
        ellipsis: true,
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
        title: '操作',
        key: 'handle',
        width: 100,
        render: (text, record) => {
          return (
            <Tooltip title="查看">
              <a
                onClick={e => {
                  let scrollTop = 0;
                  let el = document.querySelector('.ant-table-body');
                  el ? (scrollTop = el.scrollTop) : '';
                  props.dispatch({
                    type: 'AbnormalIdentifyModel/updateState',
                    payload: {
                      generateVerificationTakeData: {
                        ...generateVerificationTakeData,
                        scrollTop: scrollTop,
                      },
                    },
                  });
                  const data = { type: 2 }
                  router.push(
                    `/AbnormalIdentifyModel/ClueAnalysis/GenerateVerificationTake/Detail?data=${data}`
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
    ]
  }
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
          return <span onClick={() => { verificationActionColumnsCancel(record) }}>
            <a>删除</a>
          </span>


        },
      },
    ]
  }

  const verificationActionColumns = getVerificationActionColumns().map((col, index) => {

    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        index: index,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: true,
      }),
    };
  });

  const [verificationActionData, setVerificationActionData] = useState([])
  const verificationActionAdd = () => { //添加核查动作
    const initCode = cuid()
    const newData = {
      type: 'add',
      PlanItemCode: initCode,
      QTitle: '',
      QContent: '',
    }
    //图片
    setFilesList({ ...filesList, [`QAttachment_${initCode}`]: [], })
    setFilesCuidList({ ...filesCuidList, [`QAttachment_${initCode}`]: initCode })
    setVerificationActionData([...verificationActionData, newData])
  }
  const verificationActionColumnsCancel = (record) => {
    const dataSource = [...verificationActionData];
    let newData = dataSource.filter((item) => item.PlanItemCode !== record.PlanItemCode)
    setVerificationActionData(newData)
  }
  // 查询数据
  const onFinish = (pageIndex, pageSize) => {
    const values = form.getFieldsValue();
    props.dispatch({
      type: 'AbnormalIdentifyModel/GetWaitCheckDatas',
      payload: {
        ...values,
        date: undefined,
        beginTime: values.date ? values.date[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: values.date ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      callback: res => {
        setDataSource(res.Datas);
        setTotal(res.Total);
        setSelectedRowKeys([])
        setSelectedRow([])
        // 设置滚动条高度，定位到点击详情的行号
        // let currentForm = warningForm[modelNumber];
        // let el = document.querySelector(`[data-row-key="rowKey"]`);
        // let tableBody = document.querySelector('.ant-table-body');
        // console.log('el', el);
        // if (tableBody) {
        //   el ? (tableBody.scrollTop = currentForm.scrollTop) : (tableBody.scrollTop = 0);
        // }
      },
    });
  };


  // 分页
  const onTableChange = (current, pageSize) => {
    props.dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        generateVerificationTakeData: {
          ...generateVerificationTakeData,
          pageSize: pageSize,
          pageIndex: current,
          scrollTop: 0,
        },
      },
    });
    onFinish(current, pageSize);
  };

  // 根据企业获取排口
  const getPointList = (EntCode, callback) => {
    dispatch({
      type: 'common/getPointByEntCode',
      payload: {
        EntCode,
      },
      callback: res => {
        setPointList(res);
        callback && callback()
      },
    });
  };

  const [preTakeFlagDatas, setPreTakeFlagDatas] = useState([]) //专家意见
  const [checkRoleDatas, setCheckRoleDatas] = useState([]) //核查角色
  const [planDatas, setPlanDatas] = useState([])//已有核查方案

  const generateVerificationTakeFun = () => {
    if (selectedRowKeys?.[0]) {
      setVisible(true)
    } else {
      message.warning('请选择企业')
    }
  }

  const initVerificationActionData = () => { //初始化核查动作
    setVerificationActionData([])
    setFilesList({})
    setFilesCuidList({})
    const initCode = cuid()
    const newData = {
      type: 'add',
      PlanItemCode: initCode,
      QTitle: '',
      QContent: '',
    }
    //图片
    setFilesList({ [`QAttachment_${initCode}`]: [], })
    setFilesCuidList({ [`QAttachment_${initCode}`]: initCode })
    setVerificationActionData([newData])
  }


  useEffect(() => {
    if (visible) {
      modalForm.resetFields();
      setSiteVerificationPlanType(1)
      setVerificationPlanType(1)
      setCollapsekey()
      dispatch({
        type: 'AbnormalIdentifyModel/GetPreTakeFlagDatas', payload: {},
        callback: res => {
          setPreTakeFlagDatas(res);
        }
      });
      dispatch({
        type: 'AbnormalIdentifyModel/GetCheckRoleDatas', payload: {},
        callback: res => {
          setCheckRoleDatas(res);
        }
      });
      dispatch({
        type: 'AbnormalIdentifyModel/GetPlanDatas', payload: {},
        callback: res => {
          setPlanDatas(res);
        }
      });
      setSelectedRowKeys([]);


    } else {
      setSelectedRow([]);
      setPreTakeFlagDatas([])
      setCheckRoleDatas([])
      setPlanDatas([])
      initVerificationActionData()
    }
  }, [visible])
  const save = (type) => {
    const validateFieldsFun = async () => {
      const modalValues = await modalForm.validateFields();
      if (siteVerificationPlanType == 1) { //现场核查
        if (verificationActionData?.lenght == 0) {
          message.warning('请输入核查动作')
          return;
        }
      }
      const parData = {
        planAction: type,
        createUserId: currentUser?.User_ID,
        dgimn: selectedRow?.DGIMN,
        warningTypeCode: selectedRow?.WarningCode,
        warningTime: selectedRow.ClueTime,
        isSceneCheck: modalValues.isSceneCheck,
        isSavePlan: modalValues.isSavePlan,
        preTakeFlag: modalValues.preTakeFlag?.length ? modalValues.preTakeFlag[modalValues.preTakeFlag.length - 1] : undefined,
        checkResult: modalValues.checkResult,
        checkConclusion: modalValues.checkConclusion,
        checkReason: modalValues.checkReason,
        checkUserId: modalValues.checkUserId,
        checkPlan: siteVerificationPlanType == 1 ? {
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
            }
          })
        } : undefined

      }
      dispatch({
        type: 'AbnormalIdentifyModel/AddPlanTask', payload: { ...parData },
        callback: res => {
          setVisible(false)
        }
      });
    }
    if (siteVerificationPlanType == 1 && !collapsekey) {//未展开核实方案
      setCollapsekey('1')
      setTimeout(() => {
        validateFieldsFun()
      }, 0)
    } else {
      validateFieldsFun()
    }
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, row) => {
      // 如果选中的复选框数量为1，则直接更新选中状态
      if (newSelectedRowKeys?.length === 1) {
        setSelectedRowKeys(newSelectedRowKeys)
      } else {
        let diff = newSelectedRowKeys.filter(x => !selectedRowKeys.includes(x));
        setSelectedRowKeys(diff)
      }
      const data = row?.[0]
      setSelectedRow(data)
    }
  };
  const [selectedPlanRowKeys, setSelectedPlanRowKeys] = useState([]);
  const [selectedPlanRow, setSelectedPlanRow] = useState([]);
  const rowPlanSelection = {
    selectedRowKeys: selectedPlanRowKeys,
    onChange: (newSelectedRowKeys, row) => {
      if (newSelectedRowKeys?.length === 1) {
        setSelectedPlanRowKeys(newSelectedRowKeys)
      } else {
        let diff = newSelectedRowKeys.filter(x => !selectedPlanRowKeys.includes(x));
        setSelectedPlanRowKeys(diff)
      }
      setSelectedPlanRow(row?.[0])
    }
  };
  const [verificationPlanType, setVerificationPlanType] = useState(1)
  const [siteVerificationPlanType, setSiteVerificationPlanType] = useState(1)
  const [saveType, setSaveType] = useState()
  const [collapsekey, setCollapsekey] = useState()
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
    let inputNode = title === '图片' ? <div style={{ textAlign: 'center' }}>  <a onClick={() => { setFileVisible(true); setFiles(`QAttachment_${record.PlanItemCode}`); }}>{filesList[`QAttachment_${record.PlanItemCode}`] && filesList[`QAttachment_${record.PlanItemCode}`][0] ? '查看图片' : '上传图片'}</a></div>
      :
      <Input.TextArea placeholder={`请输入`} />
    return (
      <td {...restProps}>
        {editing ?
          <Form.Item
            name={`${dataIndex}_${record.PlanItemCode}`}
            style={{ margin: 0 }}
            rules={[{ required: title === '图片' ? false : true, message: `请输入${title}!` }]}
          >
            {inputNode}
          </Form.Item>
          : (
            children
          )}
      </td>
    );
  };
  const [fileVisible, setFileVisible] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState()
  const [photoIndex, setPhotoIndex] = useState(0); //预览图片Index
  const [imgUrlList, setImgUrlList] = useState([]);//预览图片列表

  const [files, setFiles] = useState()
  const [filesCuidList, setFilesCuidList] = useState({})
  const [filesList, setFilesList] = useState({})

  const filesCuid = () => {
    for (var key in filesCuidList) {
      if (key == files) {
        return filesCuidList[key]
      }
    }
  }
  const uploadProps = { //图片上传 
    action: API.UploadApi.UploadPicture,
    headers: { Cookie: null, Authorization: "Bearer " + Cookie.get(cookieName) },
    accept: 'image/*',
    data: {
      FileUuid: filesCuid(),
      FileActualType: '0',
    },
    listType: "picture-card",
    beforeUpload: (file) => {
      const fileType = file?.type; //获取文件类型 type  image/*
      if (!(/^image/g.test(fileType))) {
        message.error(`请上传图片格式文件!`);
        return false;
      }
    },
    onChange(info) {
      const fileList = [];
      info.fileList.map(item => {
        if (item.response && item.response.IsSuccess) { //刚上传的
          fileList.push({ ...item, url: `/${item.response.Datas}`, })
        } else if (!item.response) {
          fileList.push({ ...item })
        }
      })
      if (info.file.status === 'uploading') {
        setFilesList({ ...filesList, [files]: fileList })
      }
      if (info.file.status === 'done' || info.file.status === 'removed' || info.file.status === 'error') {
        setFilesList({ ...filesList, [files]: fileList })
        modalForm.setFieldsValue({ [files]: filesCuid() })
        info.file.status === 'done' && message.success('上传成功！')
        info.file.status === 'error' && message.error(`${info.file.name}${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);
      }
    },
    onPreview: async file => { //预览

      const imageList = filesList[files]

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
          imgData.push(item.url)
        })
        setImgUrlList(imgData)
      }
      setPhotoIndex(imageListIndex)
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    },
    onRemove: (file) => {
      if (!file.error) {
        dispatch({
          type: "autoForm/deleteAttach",
          payload: {
            Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
          }
        })
      }

    },
    fileList: filesList[files]
  };

  return (<div className={styles.verificationTakeWrapper}>
    <BreadcrumbWrapper>
      <Card style={{ paddingBottom: 24 }}>
        <Form
          name="basic"
          form={form}
          layout="inline"
          initialValues={{
            date: [moment().add(-1, 'months'), moment()]
          }}
        >
          <Form.Item label="日期" name="date">
            <RangePicker_
              allowClear={false}
              dataType="day"
              format="YYYY-MM-DD"
              style={{ width: 250 }}
            />
          </Form.Item>
          <Form.Item label="行政区" name="regionCode">
            <RegionList noFilter style={{ width: 140 }} />
          </Form.Item>
          <Spin spinning={!!entListLoading} size="small" style={{ background: '#fff' }}>
            <Form.Item label="企业" name="entCode">
              <EntAtmoList
                noFilter
                style={{ width: 200 }}
                onChange={value => {
                  if (!value) {
                    form.setFieldsValue({ DGIMN: undefined });
                  } else {
                    form.setFieldsValue({ DGIMN: undefined });
                    getPointList(value);
                  }
                }}
              />
            </Form.Item>
          </Spin>
          <Spin spinning={!!pointListLoading} size="small">
            <Form.Item label="监测点名称" name="dgimn">
              <Select
                placeholder="请选择"
                showSearch
                allowClear
                optionFilterProp="children"
                style={{ width: 150 }}
              >
                {pointList.map(item => {
                  return (
                    <Option key={item.DGIMN} value={item.DGIMN}>
                      {item.PointName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Spin>
          <Spin spinning={modelListLoading} size="small">
            <Form.Item label="场景类别" name="warningCode">
              <Select
                allowClear
                placeholder="请选择"
                style={{ width: 200 }}
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {modelList.map(item => {
                  return (
                    <Option key={item.ModelGuid} value={item.ModelGuid}>
                      {ModalNameConversion(item.ModelName)}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Spin>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                loading={queryLoading}
                onClick={() => {
                  onTableChange(1, 20);
                }}
              >
                查询
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  onTableChange(1, 20);
                }}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title={<span style={{ fontWeight: 'bold' }}>生成核查任务</span>}
        style={{ marginTop: 12 }}
      >
        <Button style={{ marginBottom: 12 }} type='primary' onClick={() => { generateVerificationTakeFun() }} >生成核查方案</Button>
        <SdlTable
          rowKey={(record, index) => `${index}`}
          align="center"
          rowSelection={rowSelection}
          columns={getColumns()}
          dataSource={dataSource}
          loading={queryLoading}
          scroll={{ y: 'calc(100vh - 455px)' }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: pageSize,
            current: pageIndex,
            onChange: onTableChange,
            total: total,
          }}
        />
      </Card>
      <Modal
        title={'生成核查任务'}
        destroyOnClose
        wrapClassName={'spreadOverModal'}
        mask={false}
        className={styles.generateVerificationTakeModal}
        visible={visible}
        onCancel={() => { setVisible(false); }}
        footer={[
          <Button key="back" onClick={() => { setVisible(false) }}>
            取消
          </Button>,
          siteVerificationPlanType == 1 && saveType == 1 && verificationPlanType == 1 ? //新建方案保存
            <Button key="submit" type="primary" loading={addLoading} onClick={() => save(1)}>
              提交并新增到方案库
           </Button>
            :
            siteVerificationPlanType == 1 && saveType == 1 && verificationPlanType == 2 ?  //选择方案保存
              <>
                <Button key="submit" type="primary" loading={addLoading} onClick={() => save(1)}>
                  提交并新增到方案库
            </Button>
                <Button key="submit" type="primary" loading={addLoading} onClick={() => save(2)}>
                  提交并覆盖原有方案库
            </Button>
              </>
              :
              <Button
                type="primary"
                loading={addLoading}
                onClick={() => save(3)}>
                提交
          </Button>,
        ]}
      >
        <Form
          name="basic2"
          form={modalForm}
          initialValues={{
            verificationPlanType: 1,
            isSceneCheck: 1,
            checkResult: 1,
          }}
        >
          <Form.Item label="企业">
            {selectedRow?.EntName}
          </Form.Item>
          <Form.Item label="排口">
            {selectedRow?.PointName}
          </Form.Item>
          <Form.Item name='isSceneCheck' label="现场核查" rules={[{ required: true, message: '请选择现场核查!' }]}>
            <Radio.Group
              onChange={(e) => {
                setSiteVerificationPlanType(e.target?.value)
                modalForm.resetFields();
                modalForm.setFieldsValue({
                  isSceneCheck: e.target?.value,
                })
                initVerificationActionData()//重新初始化核查动作数据
              }}
            >
              <Radio value={1}>需要</Radio>
              <Radio value={2}>不需要</Radio>
            </Radio.Group>
          </Form.Item>
          <Spin spinning={!!preTakeFlagDatasLoading} size="small" style={{ width: 440, top: -6 }}>
            <Form.Item name='preTakeFlag' label="专家意见" rules={[{ required: true, message: '请选择专家意见!' }]}>
              <Cascader showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 300 }} fieldNames={{ label: 'FlagName', value: 'FlagCode', children: 'ChildrenFlags' }} options={preTakeFlagDatas} placeholder="请选择" />
            </Form.Item>
          </Spin>
          {siteVerificationPlanType == 1 ?
            <>
              <Spin spinning={!!checkRoleDatasLoading} size="small" style={{ width: 440, top: -6 }}>
                <Form.Item name='checkUserId' label="核查人" rules={[{ required: true, message: '请选择核查人!' }]}>
                  <Select showSearch style={{ width: 300 }} placeholder="请选择"  >
                    {checkRoleDatas?.[0] && checkRoleDatas.map(item => <Option value={item.UserID}>{item.UserName}</Option>)}
                  </Select>
                </Form.Item>
              </Spin>
              <Row>
                <Form.Item name='verificationPlanType' label="核查方案" rules={[{ required: true, message: '请选择核查方案!' }]}>
                  <Select style={{ width: 300 }} value={verificationPlanType} placeholder="请选择"
                    onChange={(value) => {
                      setVerificationPlanType(value)
                      modalForm.setFieldsValue({ planName: '', planContent: '', planCode: '' })
                      initVerificationActionData()

                    }}
                  >
                    <Option value={1}>新建方案</Option>
                    <Option value={2}>选择已有方案</Option>
                  </Select>
                </Form.Item>
                <Form.Item name='planName' style={{ margin: '0 6px' }} rules={[{ required: true, message: '请输入方案名称!' }]}>
                  <Input style={{ width: 320 }} disabled={verificationPlanType === 2} placeholder={verificationPlanType == 1 ? '请输入方案名称' : '请选择'} />
                </Form.Item>
                <Popover
                  visible={planPopVisible}
                  title="核查方案"
                  trigger="click"
                  getPopupContainer={node => {
                    if (node && node.parentNode) {
                      return node.parentNode;
                    }
                    return node;
                  }}
                  placement={planDatas?.length >= 18 ? 'rightBottom' : 'right'}
                  content={<>
                    <Table
                      rowKey={(record, index) => `${index}`}
                      bordered
                      size='small'
                      rowSelection={rowPlanSelection}
                      columns={getVerificationPlanColumns()}
                      dataSource={planDatas}
                      loading={planDatasLoading}
                      scroll={{ x: '100%', y: 'calc(100vh - 260px)' }}
                      pagination={false}
                    />
                    <Row justify='end' style={{ marginTop: 8 }}>
                      <Button type='default' size='small' onClick={() => { setPlanPopVisible(false); setSelectedPlanRowKeys([]); setSelectedPlanRow([]) }}>取消</Button>
                      {planDatas?.[0] && <Button type='primary' size='small'
                        onClick={() => {
                          if (selectedPlanRowKeys?.length > 0) {
                            setPlanPopVisible(false);
                            setSelectedPlanRowKeys([]);
                            setSelectedPlanRow([])
                            setCollapsekey('1');
                            setTimeout(() => {
                              if (selectedPlanRow?.PlanItemDatas?.[0]) {
                                modalForm.setFieldsValue({ planName: selectedPlanRow.PlanName, planContent: selectedPlanRow.PlanContent, planCode: selectedPlanRow?.PlanCode })
                                const data = selectedPlanRow.PlanItemDatas
                                setVerificationActionData(data)
                                if (data?.[0]) {
                                  data.map(item => {
                                    modalForm.setFieldsValue({
                                      [`QTitle_${item.PlanItemCode}`]: item.QTitle,
                                      [`QContent_${item.PlanItemCode}`]: item.QContent,
                                      [`QAttachment_${item.PlanItemCode}`]: item.QAttachment[0] && item.QAttachment[0].FileUuid
                                    })
                                  })
                                  //图片回显
                                  const uploadList = {}, uploadCuid = {};
                                  data.map(item => {
                                    const attachmentFilesList = [];
                                    item.QAttachment?.[0] && item.QAttachment.map(attachmentItem => {
                                      if (!attachmentItem.IsDelete) {
                                        attachmentFilesList.push({
                                          uid: attachmentItem.GUID,
                                          name: attachmentItem.FileName,
                                          status: 'done',
                                          url: `${uploadPrefix}/${attachmentItem.FileName}`,
                                        })
                                      }
                                    })
                                    uploadList[`QAttachment_${item.PlanItemCode}`] = attachmentFilesList;
                                    uploadCuid[`QAttachment_${item.PlanItemCode}`] = item.QAttachment?.[0]?.FileUuid ? item.QAttachment[0].FileUuid : cuid();
                                  })
                                  setFilesList({ ...uploadList })
                                  setFilesCuidList({ ...uploadCuid })
                                }
                              }
                            }, 0)
                          } else {
                            message.warning('请选择核查方案')
                          }

                        }} style={{ marginLeft: 6 }}>选择</Button>}
                    </Row>
                  </>
                  }>
                  {verificationPlanType == 2 && <Button type='primary' onClick={() => { setPlanPopVisible(true) }}>选择已有方案</Button>}
                </Popover>
              </Row>
              <Collapse onChange={(value) => { setCollapsekey(value?.[0]) }} activeKey={collapsekey} ghost>
                <Panel header={<div style={{ fontWeight: 'bold' }}>核查方案</div>} key="1">
                  <Form.Item name='isSavePlan' label="保存到方案库" rules={[{ required: true, message: '请选择是否保存到方案库!' }]}>
                    <Radio.Group
                      onChange={(e) => {
                        setSaveType(e.target.value)
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
                  >
                    <Form.Item name='planContent'
                      rules={[
                        {
                          validator: (_, value) => {
                            const contentVal = value && value.replaceAll(/<p>|[</p>]/g, '').trim();
                            if ((!contentVal) || contentVal === 'br') {
                              return Promise.reject(new Error('请输入核查方案!'));
                            } else {
                              return Promise.resolve();
                            }

                          }
                        }
                      ]}
                    >
                      <ReactQuill theme="snow" modules={quillModules} />
                    </Form.Item>
                  </ResizableBox >
                  <Row align='middle' style={{ marginBottom: 6 }}><span style={{ display: 'inline-block', height: 14, width: 4, marginRight: 4, backgroundColor: '#3888ff' }}></span> 核查动作</Row>
                  <Table
                    components={{
                      body: {
                        cell: EditableCell,
                      }
                    }}
                    bordered
                    dataSource={verificationActionData}
                    columns={verificationActionColumns}
                    scroll={{ x: 680, y: 'hidden' }}
                    pagination={false}
                    size='small'
                    className={'verificationActionTableSty'}
                  />
                  <Button style={{ margin: '10px 0 15px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => verificationActionAdd()} >
                    新增
                  </Button>
                </Panel>
              </Collapse>
            </>
            :
            <>
              <Form.Item name='checkResult' label="核查结果与线索是否符合" rules={[{ required: true, message: '请选择是否保存到方案库!' }]}>
                <Radio.Group>
                  <Radio value={1}>符合</Radio>
                  <Radio value={2}>部分符合</Radio>
                  <Radio value={3}>不符合</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="核查结论" name='checkConclusion' rules={[{ required: true, message: '请输入核查结论!' }]}>
                <Input.TextArea placeholder='请输入' />
              </Form.Item>
              <ResizableBox
                height={260}
                axis={'y'}
                minConstraints={['100%', 120]}
                className={'resizable_quill_sty'}
              >
                <Form.Item label="原因" name='checkReason'
                  rules={[
                    {
                      required: true,
                      validator: (_, value) => {
                        const contentVal = value && value.replaceAll(/<p>|[</p>]/g, '').trim();
                        if ((!contentVal) || contentVal === 'br') {
                          return Promise.reject(new Error('请输入原因!'));
                        } else {
                          return Promise.resolve();
                        }
                      }
                    }
                  ]}
                >
                  <ReactQuill theme="snow" modules={quillModules} />
                </Form.Item>
              </ResizableBox >
            </>
          }
          <Form.Item name='planCode' hidden></Form.Item>



        </Form>
      </Modal>
      <Modal
        title='上传图片'
        visible={fileVisible}
        onOk={() => { setFileVisible(false) }}
        destroyOnClose
        onCancel={() => { setFileVisible(false) }}
        width={'50%'}
        footer={null}
      >
        <Upload {...uploadProps} style={{ width: '100%' }} >
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
