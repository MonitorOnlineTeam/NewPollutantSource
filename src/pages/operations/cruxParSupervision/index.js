/**
 * 功  能：关键参数督查
 * 创建人：jab
 * 创建时间：2023.02.05
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload, Tag, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, IssuesCloseOutlined,AuditOutlined, DownOutlined, ProfileOutlined, UploadOutlined, EditOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled, UnlockFilled, ToTopOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EntAtmoList from '@/components/EntAtmoList'
import EntType from '@/components/EntType'
import OperationInspectoUserList from '@/components/OperationInspectoUserList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import cuid from 'cuid';
import { getBase64, } from '@/utils/utils';
import CheckDetail from './CheckDetail';
import Lightbox from "react-image-lightbox-rotate";

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'cruxParSupervision'




const dvaPropsData = ({ loading, cruxParSupervision, global, common, point, autoForm }) => ({
  tableDatas: cruxParSupervision.tableDatas,
  tableLoading: loading.effects[`point/getSystemModelList`],
  tableTotal: cruxParSupervision.tableTotal,
  entLoading: common.entLoading,
  clientHeight: global.clientHeight,
  saveloading: loading.effects[`point/getSystemModelList`],
  operationInfoList: cruxParSupervision.operationInfoList,
  exportLoading: loading.effects[`${namespace}/exportInspectorOperationManage`],
  checkDetailDate:cruxParSupervision.checkDetailDate,
  regQueryPar:cruxParSupervision.regQueryPar,

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getPointByEntCode: (payload, callback) => { //监测点
      dispatch({
        type: `remoteSupervision/getPointByEntCode`,
        payload: payload,
        callback: callback
      })
    },
    getEntNoFilterList: (payload, callback) => { //企业
      dispatch({
        type: `common/getEntNoFilterList`,
        payload: payload,
        callback: callback
      })
    },
    getInspectorOperationManageList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getInspectorOperationManageList`,
        payload: payload,
      })
    },
    exportInspectorOperationManage: (payload, callback) => { //导出
      dispatch({
        type: `${namespace}/exportInspectorOperationManage`,
        payload: payload,
        callback: callback
      })
    },
    deleteInspectorOperation: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteInspectorOperation`,
        payload: payload,
        callback: callback
      })
    },
    pushInspectorOperation: (payload, callback) => { //整改问题推送
      dispatch({
        type: `${namespace}/pushInspectorOperation`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {

  const { match: { path } } = props;
  //是否为运维督查记录
  const isRecord = path === '/operations/supervisionRecod' || path === '/operations/siteSupervisionRecod' ? true : false;

  const [form] = Form.useForm();





  const { tableDatas, tableTotal, tableLoading, exportLoading, entLoading, operationInfoList,saveloading,checkDetailDate,regQueryPar, } = props;


  const userCookie = Cookie.get('currentUser');



  useEffect(() => {
    onFinish(pageIndex,pageSize)
  }, []);


  let columns = [
    {
      title: '序号',
      align: 'center',
      width: 80,
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '省',
      dataIndex: 'province',
      key: 'province',
      align: 'center',
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
    },
    {
      title: `企业名称`,
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维人员',
      dataIndex: 'OperationUserName',
      key: 'OperationUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '核查人',
      dataIndex: 'InspectorName',
      key: 'InspectorName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '核查日期',
      dataIndex: 'InspectorDate',
      key: 'InspectorDate',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return text ? moment(text).format("YYYY-MM-DD") : null;
      }
    },
    {
      title: '核查状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return text == 0 ? '保存' : text == 1 ? '提交' : '推送';
      }
    },
    {
      title: '核查结果',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return text == 0 ? '保存' : text == 1 ? '提交' : '推送';
      }
    },
    {
      title: '问题数量',
      dataIndex: 'ProblemNum',
      key: 'ProblemNum',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '下发状态',
      dataIndex: 'issue',
      key: 'issue',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return text === '待下发' ? <span style={{ color: '#f5222d' }}>{text}</span> : <span>{text}</span>
      }
    },
    {
      title: '下发时间',
      dataIndex: 'issueTime',
      key: 'issueTime',
      align: 'center',
      ellipsis: true,
    },

    {
      title: '创建人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'UpdateUserName',
      key: 'UpdateUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'UpdateTime',
      key: 'UpdateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      ellipsis: true,
      render: (text, record) => {
        const updateflag = record.updateflag;
        const flag = record.flag;
        const issue = record.issue;

        let detail = <Tooltip title="详情">
          <a onClick={() => {
            checkDetail(record,2)
          }}>
            <ProfileOutlined style={{ fontSize: 16 }} />
          </a>
        </Tooltip>
        if (isRecord) { //远程督查记录页面
          return detail
        }
        return (
          <>
            <Tooltip title={updateflag && flag ? "删除" : null} >
              <Popconfirm disabled={!(updateflag && flag)} title="确定要删除此条信息吗？" placement="left" onConfirm={() => del(record)} okText="是" cancelText="否">
                <a style={{ cursor: updateflag && flag ? 'pointer' : 'not-allowed', color: updateflag && flag ? '#1890ff' : '#00000040', }}><DelIcon style={{ fontSize: 16 }} /></a>
              </Popconfirm>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="核查">
              <a onClick={() => { checkDetail(record,1)  }}>
                <AuditOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title={!issue || issue === '已下发' ? null : "下发"} >
              <Popconfirm disabled={!issue || issue === '已下发' ? true : false} title="确定要下发督查结果给点位的运维负责人吗？" placement="left" onConfirm={() => issues(record)} okText="是" cancelText="否">
                <a style={{ cursor: !issue || issue === '已下发' ? 'not-allowed' : 'pointer', color: !issue || issue === '已下发' ? '#00000040' : '#1890ff', }}><IssuesCloseOutlined style={{ fontSize: 16 }} /></a>
              </Popconfirm>
            </Tooltip>
            <Divider type="vertical" />
            {detail}
          </>
        )
      }

    }
  ];






  const [entLoading2, setEntLoading2] = useState(false)
  const [entList, setEntList] = useState([])
  const getEntList = (pollutantType, callback) => {
    setEntLoading2(true)
    props.getEntNoFilterList({ RegionCode: '', PollutantType: pollutantType }, (data) => {
      setEntList(data)
      setEntLoading2(false);
      callback && callback();
    })
  }


  const onFinish = async (pageIndexs, pageSizes,par) => {  //查询
    try {
      const values = await form.validateFields();

      props.getInspectorOperationManageList(par? par: { 
        ...values,
        BTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        ETime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async () => { //导出
    const values = await form.validateFields();

    props.exportInspectorOperationManage({
      ...values,
      BTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
      ETime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,

    })
  }

  const formatData = (data, type) => {
    return data.map(item => {
      return {
        InspectorContentID: item.InspectorContentID,
        InspectorNum: item.InspectorNum,
        ParentID: item.ParentID,
        Attachment:'',
      }
    })
  }
  const [saveLoading1, setSaveLoading1] = useState(false)
  const [saveLoading2, setSaveLoading2] = useState(false)

  const save =  (type) => {


    try {
      type == 1 ? setSaveLoading1(true) : setSaveLoading2(true);

      let principleProblemList = operationInfoList.PrincipleProblemList && operationInfoList.PrincipleProblemList || [];
      let importanProblemList = operationInfoList.importanProblemList && operationInfoList.importanProblemList || [];
      let commonlyProblemList = operationInfoList.CommonlyProblemList && operationInfoList.CommonlyProblemList || [];

      if (principleProblemList) {
        principleProblemList = formatData(principleProblemList, 1)
      }
      if (importanProblemList) {
        importanProblemList = formatData(importanProblemList, 2)
      }
      if (commonlyProblemList) {
        commonlyProblemList = formatData(commonlyProblemList, 3)
      }

      const data = {
        ...values,
        RegionCode: values.RegionCode.join(","),
        PollutantCode: values.PollutantCode.join(","),
        InspectorDate: moment(values.InspectorDate).format("YYYY-MM-DD HH:mm:ss"),
        IsSubmit: type,
        InspectorOperationInfoList: [...principleProblemList, ...importanProblemList, ...commonlyProblemList],
        ...devicePar,
      }

        props.addOrEditInspectorOperation(data, (isSuccess) => {
          type == 1 ? setSaveLoading1(false) : null;
          isSuccess && onFinish(pageIndex,pageSize)

        })

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      type == 1 ? setSaveLoading1(false) : setSaveLoading2(false);


    }

  }


  const [pointList, setPointList] = useState([])
  const [pointLoading, setPointLoading] = useState(false)

  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setPointList([])
        return;
      }
      setPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList(res)
        setPointLoading(false)
        form.setFieldsValue({ DGIMN: res[0].DGIMN })
      })
    }
  }


  const searchComponents = () => {
    return  <Form
        form={form}
        name="advanced_search"
        initialValues={{
          time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day"),]
        }}
        className={styles["ant-advanced-search-form"]}
        onFinish={()=>{setPageIndex(1); onFinish(1,pageSize)}}
        onValuesChange={onValuesChange}
      >
        <Row align='middle'>
          <Form.Item label='行政区' name='RegionCode' >
            <RegionList noFilter levelNum={3} style={{ width: 150 }} />
          </Form.Item>
          <Spin spinning={entLoading} size='small' style={{ top: -3, left: 39 }}>
            <Form.Item label='企业' name='EntCode' style={{ marginLeft: 8, marginRight: 8 }}>
              <EntAtmoList noFilter style={{ width: 300 }} />
            </Form.Item>
          </Spin>
          <Spin spinning={pointLoading} size='small' style={{ top: -3, left: 44 }}>
            <Form.Item label='监测点名称' name='DGIMN' >

              <Select placeholder='请选择' showSearch optionFilterProp="children" style={{ width: 150 }}>
                {
                  pointList[0] && pointList.map(item => {
                    return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Spin>
        </Row>

        <Row>
          <Form.Item label="核查人" name="Inspector"  >
            <OperationInspectoUserList type='2' style={{ width: 150 }} />
          </Form.Item>
          <Form.Item label="核查日期" name="time" style={{ marginLeft: 8, marginRight: 8 }}  >
            <RangePicker_
              style={{ width: 300 }}
              allowClear={false}
              format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="核查结果" name="OperationUser" style={{ marginRight: 8 }}  >
            <Select placeholder='请选择' allowClear style={{ width: 150 }}>
              <Option key={1} value={1} >合格</Option>
              <Option key={2} value={2} >不合格</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 8 }}>
              查询
     </Button>
            <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }} >
              重置
     </Button>
            <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={exportLoading}>导出 </Button>

          </Form.Item>

        </Row>
      </Form>
  }


  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize,regQueryPar) //regQueryPar 防止输入查询条件 不点击查询 直接点击分页的情况
  }


  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)



  const del = (record) => { //删除
    props.deleteRemoteInspector({ ID: record.id }, () => {
      setPageIndex(1)
      onFinish(1, pageSize)
    })
  }
  const [checkDetailVisible, setCheckDetailVisible] = useState(false)
  const [checkDetailId, setCheckDetailId] = useState(null)
  const [checkDetailType, setCheckDetailType] = useState(1)

  const checkDetail = (record,type) => { //核查 详情
    setCheckDetailId(record.ID);
    setCheckDetailVisible(true)
    setCheckDetailType(type)
  }

  const issues = (record) => { //下发
    props.issueRemoteInspector({ ID: record.id }, () => {
      onFinish(pageIndex, pageSize)
    })
  }



  if (isRecord) {
    columns = columns.filter(item => item.title != '操作')
  }

  return (
    <div className={styles.supervisionManagerSty}>
      <BreadcrumbWrapper >
        <Card title={searchComponents()} className={styles.supervisionManagerModalSty}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            scroll={{ y: 'calc(100vh - 360px)' }}
            pagination={{
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }}
          />
        </Card>
      </BreadcrumbWrapper>



      <Modal //核查和详情
        visible={checkDetailVisible}
        title={'详情'}
        footer={checkDetailType==1? [
          <Button onClick={()=>{setCheckDetailVisible(false)}}>
            取消
          </Button>,
          <Button  type="primary" loading={saveloading}  onClick={()=>{save(1)}}>
            保存
          </Button>,
          <Button  type="primary" loading={saveloading}   onClick={()=>{save(2)}} >
            提交
          </Button> ,
        ] : null}
        width={'95%'}
        className={styles.fromModal}
        onCancel={() => { setCheckDetailVisible(false) }}
        destroyOnClose
      >
        <CheckDetail ID={checkDetailId} type={checkDetailType}/>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);