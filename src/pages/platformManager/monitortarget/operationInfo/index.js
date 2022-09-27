/**
 * 功  能：企业下运维信息管理
 * 创建人：贾安波
 * 创建时间：2021.08.24
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Upload, Tooltip, Divider, Modal, DatePicker, Popover } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, CodeSandboxCircleFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import RegionList from '@/components/RegionList'
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import styles from "./style.less";
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import AttachmentView from '@/components/AttachmentArrView'
import { getBase64, getAttachmentArrDataSource } from '@/utils/utils'
import cuid from 'cuid'
const { Option } = Select;

const namespace = 'operationInfo'




const dvaPropsData = ({ loading, operationInfo, autoForm }) => ({
  tableDatas: operationInfo.tableDatas,
  projectTableDatas: operationInfo.projectTableDatas,
  tableLoading: operationInfo.tableLoading,
  loadingConfirm: loading.effects[`${namespace}/updateOrAddProjectRelation`],
  exportLoading: loading.effects[`${namespace}/exportEntProjectRelationList`],
  projectNumListLoading: loading.effects[`${namespace}/projectNumList`],
  operationInfoList: autoForm.tableInfo,
  entPointList: operationInfo.entPointList,
})

const dvaDispatch = (dispatch) => {
  return {
    getEntProjectRelationList: (payload) => { //监测运维列表
      dispatch({
        type: `${namespace}/getEntProjectRelationList`,
        payload: payload,
      })
    },
    updateOrAddProjectRelation: (payload, callback) => { //修改 or 添加
      dispatch({
        type: `${namespace}/updateOrAddProjectRelation`,
        payload: payload,
        callback: callback
      })

    },
    deleteOperationPoint: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteOperationPoint`,
        payload: payload,
        callback: callback
      })
    },
    projectNumList: (payload) => { //项目编号列表
      dispatch({
        type: `${namespace}/projectNumList`,
        payload: payload
      })
    },
    operationList: (payload) => { //运维单位列表
      dispatch({
        type: 'autoForm/getAutoFormData',
        payload: {
          configId: 'OperationMaintenanceEnterprise',
          otherParams: {
            pageSize: 10000,
          },

        },
      });
      dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: 'OperationMaintenanceEnterprise',
        },
      });
    },
    getEntPointList: (payload) => { //企业监测点列表
      dispatch({
        type: `${namespace}/getEntPointList`,
        payload: payload
      })
    },
    exportEntProjectRelationList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportEntProjectRelationList`,
        payload: payload
      })
    },
    cycle: (payload, callback) => { //总频次
      dispatch({
        type: 'autoForm/getAutoFormData',
        payload: {
          configId: 'OperationCycle',
          otherParams: {
            pageSize: 10000,
          },
        },
        callback: callback,
      });
      dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: 'OperationCycle',
        },
      });
    },
    calibrationCycle: (payload, callback) => { // 校准
      dispatch({
        type: 'autoForm/getAutoFormData',
        payload: {
          configId: 'OperationCycle',
          otherParams: {
            pageSize: 10000,
          },
          searchParams: [{
            Key: 'dbo.T_Cod_OperationCycle.OperationType',
            Value: `2`,
            Where: '$=',
          }],
        },
        callback: callback,
      });
      dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: 'OperationCycle',
        },
      });
    },
    inspectionCycle: (payload, callback) => { //巡检频次 巡检类型
      dispatch({
        type: 'autoForm/getAutoFormData',
        payload: {
          configId: 'OperationCycle',
          otherParams: {
            pageSize: 10000,
          },
          searchParams: [{
            Key: 'dbo.T_Cod_OperationCycle.OperationType',
            Value: `1`,
            Where: '$=',
          }],
        },
        callback: callback,
      });
      dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: 'OperationCycle',
        },
      });
    },

    deleteAttach: (file) => { //删除照片
      dispatch({
        type: "autoForm/deleteAttach",
        payload: {
          FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
          Guid: file.response && file.response.Datas ? file.response.Datas : file.name,
        }
      })
    },

  }
}
let choiceArr = [], choiceID = []
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [fromVisible, setFromVisible] = useState(false)
  const [tableVisible, setTableVisible] = useState(false)
  const [popVisible, setPopVisible] = useState(false)

  const [type, setType] = useState('add')


  const [projectNum, setProjectNum] = useState('')
  const [choiceData, setChoiceData] = useState([])





  const { tableDatas, projectTableDatas, loadingConfirm, tableLoading, exportLoading, projectNumListLoading, operationInfoList, entPointList } = props;


  useEffect(() => {

    initData();

  }, [props.DGIMN]);


  const [cycleList, setCycleList] = useState([]);
  const [inspectionCycleList, setInspectionCycleList] = useState([]);
  const [calibrationCycleList, setCalibrationCycleList] = useState([]);

  const initData = () => {
    onFinish();
    props.operationList();//运维列表
    props.getEntPointList({ EntID: props.location.query.p });//企业运维列表
    props.cycle({}, (data) => { //总频次
      if (data && data[0]) {
        const list = data.filter(item => item['dbo.T_Cod_OperationCycle.Status'] == 1)  //启用状态
        setCycleList(list)
      }
    });
    props.calibrationCycle({}, (data) => { //校准派单频次
      if (data && data[0]) {
        const list = data.filter(item => item['dbo.T_Cod_OperationCycle.Status'] == 1)  //启用状态
        setCalibrationCycleList(list)
      }
    });

    props.inspectionCycle({}, (data) => { //巡检派单频次 巡检类型
      if (data && data[0]) {
        const list = data.filter(item => item['dbo.T_Cod_OperationCycle.Status'] == 1)
        setInspectionCycleList(list)
      }
    });
  }


  const columns = [
    {
      title: '监测点',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center'
    },
    {
      title: '运维单位',
      dataIndex: 'company',
      key: 'company',
      align: 'center'
    },
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      key: 'projectCode',
      align: 'center',
    },
    // {
    //   title: '省区名称',
    //   dataIndex: 'regionName',
    //   key:'regionName',
    //   align:'center',
    // },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    //   key: 'createTime',
    //   align: 'center',
    // },
    // {
    //   title: '创建人',
    //   dataIndex: 'createUserName',
    //   key: 'createUserName',
    //   align: 'center',
    // },
    {
      title: '巡检类型',
      dataIndex: 'inspectionTypeName',
      key: 'inspectionTypeName',
      align: 'center',
    },
    {
      title: '巡检派单频次',
      dataIndex: 'inspectionCycelName',
      key: 'inspectionCycelName',
      align: 'center',
    },

    {
      title: '校准派单频次',
      dataIndex: 'calibrationCycleName',
      key: 'calibrationCycleName',
      align: 'center',
    },
    {
      title: '参数核对派单频次',
      dataIndex: 'parameterCheckName',
      key: 'parameterCheckName',
      align: 'center',
    },
    {
      title: '运营合同起始日期',
      dataIndex: 'operationBeginTime',
      key: 'operationBeginTime',
      align: 'center',
      width: 180,
      sorter: (a, b) => moment(a.operationBeginTime).valueOf() - moment(b.operationBeginTime).valueOf()
    },
    {
      title: '运营合同结束日期',
      dataIndex: 'operationEndTime',
      key: 'operationEndTime',
      align: 'center',
      width: 180,
      sorter: (a, b) => moment(a.operationEndTime).valueOf() - moment(b.operationEndTime).valueOf()

    },
    {
      title: '实际开始日期',
      dataIndex: 'actualBeginTime',
      key: 'actualBeginTime',
      align: 'center',
      width: 150,
      sorter: (a, b) => moment(a.actualBeginTime).valueOf() - moment(b.actualBeginTime).valueOf()
    },
    {
      title: '实际结束日期',
      dataIndex: 'actualEndTime',
      key: 'actualEndTime',
      align: 'center',
      width: 150,
      sorter: (a, b) => moment(a.actualEndTime).valueOf() - moment(b.actualEndTime).valueOf()

    },
    {
      title: '运维接收确认单附件',
      align: 'center',
      dataIndex: 'uploadInfo',
      key: 'uploadInfo',
      width: 150,
      render: (text, record, index) => {
        const attachmentDataSource = getAttachmentArrDataSource(text);
        return <AttachmentView dataSource={attachmentDataSource} />;

      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) => {
        return <span>
          <Fragment><Tooltip title="编辑"> <a onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment> <Tooltip title="删除">
            <Popconfirm title="确定要删除此条信息吗？" style={{ paddingRight: 5 }} onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <a ><DelIcon /></a>
            </Popconfirm>
          </Tooltip>
          </Fragment>
        </span>
      }
    },
  ];


  const projectNumCol = [
    {
      title: '项目编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '卖方公司名称',
      dataIndex: 'SellCompanyName',
      key: 'SellCompanyName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运营起始日期',
      dataIndex: 'BeginTime',
      key: 'BeginTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运营结束日期',
      dataIndex: 'EndTime',
      key: 'EndTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return <Button size='small' type="primary" onClick={() => { choice(record) }} >选择</Button>
      }
    },
  ]


  const choice = (record) => {
    form2.setFieldsValue({ PorjectID: record.ID });
    setChoiceData(record.ProjectCode)
    setPopVisible(false)
  }
  const onClearChoice = (value) => {
    form2.setFieldsValue({ PorjectID: value });
    setChoiceData(value)
  }
  const del = (record) => {

    if(!record.deleteFlag){
      message.warning('没有操作权限，请联系管理员')
      return;
   }
    props.deleteOperationPoint({ ID: record.ID }, () => {
      onFinish()
    })
  };





  const add = () => {
    setType("add")
    setChoiceData([])
    setFileList1([])
    form2.resetFields();
    setFromVisible(true)

  };
  const edit = async (record) => {
    setFileList1([])
    if (record.uploadInfo && record.uploadInfo[0]) {  // 运维接收确认单附件
      form2.setFieldsValue({ Enclosure: record.uploadID })
      setFilesCuid1(record.uploadID)
      const fileList = record.uploadInfo.map(item => {
        if (!item.IsDelete) {
          return {
            uid: item.GUID,
            name: item.FileName,
            status: 'done',
            url: `\\upload\\${item.FileName}`,
          }

        }
      })
      setFileList1(fileList)
    }
    form2.setFieldsValue({
      ...record,
      Remark: record.remark,
      PorjectID: record.projectID, OperationCompany: record.companyID,
      InspectionCycel: record.inspectionCycel, CalibrationCycle: record.calibrationCycle, ParameterCheck: record.parameterCheck,
      RegionCode: record.regionCode, BeginTime: record.actualBeginTime ? moment(record.actualBeginTime) : undefined, EndTime: record.actualEndTime ? moment(record.actualEndTime) : undefined
    });
    setChoiceData(record.projectCode)
    setType("edit")
    setFromVisible(true)
  };

  const exports = async () => {
    const values = await form.validateFields();
    props.exportEntProjectRelationList({ ...values })
  };


  const onFinish = async () => {  //查询
    try {
      const values = await form.validateFields();
      props.getEntProjectRelationList({ ...values })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框
    try {
      const values = await form2.validateFields();
      if(!values.deleteFlag){
          message.warning('没有操作权限，请联系管理员')
          return;
      }
      props.updateOrAddProjectRelation(
        {
          ...values,
          BeginTime: values.BeginTime&&values.BeginTime.format('YYYY-MM-DD 00:00:00'), EndTime: values.EndTime&&values.EndTime.format('YYYY-MM-DD 23:59:59'),
          createTime: values.createTime&&values.createTime.format('YYYY-MM-DD 00:00:00'), 
          DGIMN: type === 'edit' ? [values.DGIMN] : values.DGIMN,
        }, () => {
          setFromVisible(false);
          onFinish();
        })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const projectNumQuery = (code) => {
    props.projectNumList({ ProjectCode: code, })
  }

  const startDisabledDate = (current) => {
    const time = form2.getFieldValue('EndTime')
    return time && current && current > moment(time).startOf('day');
  }
  const endDisabledDate = (current) => {
    const time = form2.getFieldValue('BeginTime')
    return time && current && current < moment(time).endOf('day');
  }



  useEffect(() => {
    if (popVisible) {
      projectNumQuery(); //项目编号列表
    }
  }, [popVisible])
  const searchComponents = () => {
    return <Form
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      form={form}
      onFinish={onFinish}
      initialValues={{ EntID: props.location.query.p }}
    >

      <Row>
        <Form.Item name='DGIMN' label='监测点' >
          <Select placeholder="请选择监测点列表" style={{ width: 180 }} allowClear showSearch optionFilterProp="children">
            {entPointList[0] && entPointList.map(item => {
              return <Option value={item.DGIMN}>{item.PointName}</Option>
            })
            }
          </Select>
        </Form.Item>
        <Form.Item name='ProjectID' style={{ margin: '20px 12px' }} label='项目编号' >
          <Input placeholder="请输入项目编号" allowClear />
        </Form.Item>
        <Form.Item name='OperationCompany' style={{ margin: '20px 12px 20px 0' }} label='运维单位' >
          <Input placeholder="请输入运维单位" allowClear />
        </Form.Item>
        <Form.Item label="" name="EntID" hidden>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
            重置
          </Button>
          <Button onClick={() => { props.history.go(-1); }} ><RollbackOutlined />返回</Button>
        </Form.Item>
      </Row>

      <Row align='middle'>
        <Form.Item style={{ margin: '0 8px 20px 0' }} >
          <Button icon={<PlusOutlined />} type="primary" onClick={() => { add() }} >
            添加
     </Button>
          <Button icon={<ExportOutlined />} loading={exportLoading} style={{ margin: '0 8px', }} onClick={() => { exports() }}>
            导出
          </Button>
        </Form.Item>
      </Row>

    </Form>
  }
  const operationDataSource = operationInfoList['OperationMaintenanceEnterprise'] && operationInfoList['OperationMaintenanceEnterprise'].dataSource ? operationInfoList['OperationMaintenanceEnterprise'].dataSource : [];
  // const operationCycleDataSource = operationInfoList['OperationCycle']&&operationInfoList['OperationCycle'].dataSource ? operationInfoList['OperationCycle'].dataSource : [];

  // operationCycleDataSource[0]&&operationCycleDataSource.map(item=>{

  //    const  code = item["dbo.T_Cod_OperationCycle.Code"],id=item['dbo.T_Cod_OperationCycle.ID'];
  //   if( code==1){
  //     form2.setFieldsValue({
  //       InspectionCycel:code
  //     })
  //   }
  //   if(code==2){
  //     form2.setFieldsValue({
  //       CalibrationCycle:code
  //     })
  //   }
  //   if(code ==3){
  //     form2.setFieldsValue({
  //       ParameterCheck:code
  //     })
  //   }
  // })
  cycleList[0] && cycleList.map(item => {
    const code = item["dbo.T_Cod_OperationCycle.Code"], id = item['dbo.T_Cod_OperationCycle.ID'];
    //  if(code==2){
    //    form2.setFieldsValue({
    //      CalibrationCycle:code
    //    })
    //  }
    if (code == 3) {
      form2.setFieldsValue({
        ParameterCheck: code
      })
    }
  })
  //  inspectionCycleList[0]&&inspectionCycleList.map(item=>{
  //   const  code = item["dbo.T_Cod_OperationCycle.Code"],id=item['dbo.T_Cod_OperationCycle.ID'];
  //  if( code==1){
  //    form2.setFieldsValue({
  //      InspectionCycel:code
  //    })
  //  }
  // })
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState()
  const [previewImage, setPreviewImage] = useState()


  const [filesCuid1, setFilesCuid1] = useState(cuid())
  const [fileList1, setFileList1] = useState([])

  const uploadProps = { //运维接收确认单附件上传 
    action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
    // accept:'image/*',
    data: {
      FileUuid: filesCuid1,
      FileActualType: '0',
    },
    listType: "picture-card",
    onChange(info) {
      setFileList1(info.fileList)
      if (info.file.status === 'done') {
        form2.setFieldsValue({ Enclosure: filesCuid1 })
      }
      if (info.file.status === 'error') {
        message.error('上传文件失败！')
      }
    },
    onRemove: (file) => {
      if (!file.error) {
        props.deleteAttach(file)
      }

    },
    onPreview: async file => { //预览
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview)
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    },
    fileList: fileList1,
  };
  return (
    <div className={styles.entOperationInfo}>
      <BreadcrumbWrapper>
        <Card title={props.location.query.entName}>
          {searchComponents()}
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
          />
        </Card>
      </BreadcrumbWrapper>

      <Modal
        title={type === 'edit' ? '编辑运维信息' : '添加运维信息'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={loadingConfirm}
        onCancel={() => { setFromVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
      // centered
      >
        <Form
          name="basic2"
          form={form2}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="监测点列表" name="DGIMN" rules={[{ required: true, message: '请选择监测点列表!', },]} >
                <Select mode={type === 'edit' ? null : 'multiple'} optionFilterProp="children" showArrow maxTagPlaceholder='...' maxTagTextLength={4} maxTagCount={2} placeholder="请选择监测点列表">
                  {entPointList[0] && entPointList.map(item => {
                    return <Option value={item.DGIMN}>{item.PointName}</Option>
                  })
                  }
                </Select>
              </Form.Item>
            </Col>
            {/* <Col span={12}>
        <Form.Item label="运维单位" name="OperationCompany" rules={[  { required: true, message: '请选择运维单位!',  },]} >
          <Select placeholder="请选择运维单位">
           {operationDataSource[0]&&operationDataSource.map(item=>{
             return <Option value={item['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID']}>{item['dbo.T_Bas_OperationMaintenanceEnterprise.Company']}</Option>
           })
          }
        </Select> 
      </Form.Item>
      </Col> */}
            <Col span={12}>
              <Form.Item label="项目编号" name="PorjectID" rules={[{ required: true, message: '请输入项目编号!', },]} >
                <Popover
                  content={<>
                    <Row>
                      <Form.Item style={{ marginRight: 8 }} label='项目编号' >
                        <Input allowClear placeholder="请输入项目编号" onChange={(e) => { setProjectNum(e.target.value) }} />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" onClick={() => { projectNumQuery(projectNum) }}>
                          查询
             </Button>
                      </Form.Item>
                    </Row>
                    <SdlTable resizable scroll={{ y: 'calc(100vh - 500px)' }} style={{ width: 800 }} loading={projectNumListLoading} bordered dataSource={projectTableDatas} columns={projectNumCol} />
                  </>}
                  title=""
                  trigger="click"
                  visible={popVisible}
                  onVisibleChange={(visible) => { setPopVisible(visible) }}
                  placement="bottom"
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Select onChange={onClearChoice} allowClear showSearch={false} value={choiceData} dropdownClassName={styles.projectNumSty} placeholder="请选择项目编号"> </Select>
                </Popover>
              </Form.Item>
            </Col>
            {/* <Col span={12}>
      <Form.Item label="省份名称" name="RegionCode" rules={[  { required: true, message: '请选择省份名称!',  },]} >
       <RegionList     levelNum={1} selectType = '1,是' style={{width:'100%'}}/>
      </Form.Item>
      </Col> */}
            {/*<Col span={12}>
              <Form.Item label="创建时间" name="createUserName" rules={[{ required: true, message: '请选择创建时间!', },]} >
                <DatePicker  />
              </Form.Item>
            </Col> 
             <Col span={12}>
              <Form.Item label="创建人" name="createTime" rules={[{ required: true, message: '请输入创建人！', },]} >
                <Input d placeholder="请输入创建人"/>
              </Form.Item>
            </Col>
            */}
            <Col span={12}>
              <Form.Item label="巡检类型" name="inspectionType" rules={[{ required: true, message: '请选择巡检类型!', },]} >
                <Select placeholder="请选择巡检类型" >
                  {inspectionCycleList[0] && inspectionCycleList.map(item => {
                    return <Option value={item['dbo.T_Cod_OperationCycle.Code'] && item['dbo.T_Cod_OperationCycle.Code'].toString()}>{item['dbo.T_Cod_OperationCycle.Frequency']}</Option>
                  })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="巡检派单频次" name="InspectionCycel" rules={[{ required: true, message: '请选择巡检频次!', },]} >
                <Select placeholder="请选择巡检频次" >
                  {inspectionCycleList[0] && inspectionCycleList.map(item => {
                    return <Option value={item['dbo.T_Cod_OperationCycle.Code'] && item['dbo.T_Cod_OperationCycle.Code'].toString()}>{item['dbo.T_Cod_OperationCycle.Frequency']}</Option>
                  })
                  }
                </Select>
              </Form.Item>
            </Col>
            {/* </Row> */}

            {/* <Row> */}

            <Col span={12}>
              <Form.Item label="校准派单频次" name="CalibrationCycle" rules={[{ required: false, message: '请选择校准频次!', },]} >
                <Select placeholder="请选择校准派单频次" allowClear>
                  {calibrationCycleList[0] && calibrationCycleList.map(item => {
                    return <Option value={item['dbo.T_Cod_OperationCycle.Code'].toString()}>{item['dbo.T_Cod_OperationCycle.Frequency']}</Option>
                  })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="参数核对派单频次" name="ParameterCheck" rules={[{ required: true, message: '请选择参数核对频次!', },]} >
                <Select placeholder="请选择参数核对频次" disabled>
                  {cycleList[0] && cycleList.map(item => {
                    return <Option value={item['dbo.T_Cod_OperationCycle.Code']}>{item['dbo.T_Cod_OperationCycle.Frequency']}</Option>
                  })
                  }
                </Select>
              </Form.Item>
            </Col>
            {/* </Row> */}

            {/* <Row> */}
            <Col span={12}>
              <Form.Item label="实际起始日期" name="BeginTime" rules={[{ required: true, message: '请选择实际起始日期!', },]} >
                <DatePicker disabledDate={startDisabledDate} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="实际结束日期" name="EndTime" rules={[{ required: true, message: '请选择实际结束日期!', },]} >
                <DatePicker disabledDate={endDisabledDate} />
              </Form.Item>
            </Col>
            {/* </Row> */}
            {/* <Row> */}

            <Col span={12}>
              <Form.Item label="备注" name='Remark'>
                <TextArea rows={1} placeholder='请输入备注信息' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="运维接收确认单附件" name='Enclosure'>
                <Upload {...uploadProps} style={{ width: '100%' }} >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ID" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item  name="deleteFlag" hidden>
                <Input />
              </Form.Item>
            </Col>
          </Row>


        </Form>
      </Modal>

      <Modal //预览上传运维接收确认单附件
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => { setPreviewVisible(false) }}

      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);