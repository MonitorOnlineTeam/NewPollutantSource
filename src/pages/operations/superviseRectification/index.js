/**
 * 功  能：督查整改列表
 * 创建人：jab
 * 创建时间：2022.11.24
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload, Tag, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, UploadOutlined, EditOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled, UnlockFilled } from '@ant-design/icons';
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
import { getBase64 } from '@/utils/utils';
import Detail from './Detail';
import Lightbox from "react-image-lightbox-rotate";

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'superviseRectification'




const dvaPropsData = ({ loading, superviseRectification, global, common, point, autoForm }) => ({
  tableDatas: superviseRectification.tableDatas,
  tableLoading: loading.effects[`${namespace}/getInspectorRectificationManageList`],
  tableTotal: superviseRectification.tableTotal,
  pointParamesLoading: loading.effects[`${namespace}/getPointParames`],
  infoloading: loading.effects[`${namespace}/getInspectorOperationInfoList`],
  userLoading: loading.effects[`common/getUserList`],
  entLoading: common.entLoading,
  clientHeight: global.clientHeight,
  exportLoading: loading.effects[`${namespace}/exportInspectorRectificationManage`],
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

    deleteAttach: (file) => { //删除照片
      dispatch({
        type: "autoForm/deleteAttach",
        payload: {
          Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
        }
      })
    },
    getInspectorRectificationManageList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getInspectorRectificationManageList`,
        payload: payload,
      })
    },

    exportInspectorRectificationManage: (payload, callback) => { //导出
      dispatch({
        type: `${namespace}/exportInspectorRectificationManage`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {

  const { match: { path } } = props;


  const inspectorType = path === '/operations/superviseRectification' ? 1 : 2 ; // 是否为现场督查 1 现场 2 远程  

  const [form] = Form.useForm();
 


  const [fromVisible, setFromVisible] = useState(false)


  const [type, setType] = useState()




  const { tableDatas, tableTotal, tableLoading, pointParamesLoading, exportLoading, userLoading, entLoading, } = props;






  useEffect(() => {
    initData()
  }, []);

  const initData = () => {
    onFinish()

  }

  const columns = [
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
      title: '行政区',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: `企业名称`,
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '站点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '督查类别',
      dataIndex: 'InspectorTypeName',
      key: 'InspectorTypeName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '督查人员',
      dataIndex: 'InspectorName',
      key: 'InspectorName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '督查日期',
      dataIndex: 'InspectorDate',
      key: 'InspectorDate',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return text ? moment(text).format("YYYY-MM-DD") : null;
      }
    },
    {
      title: '运维人员',
      dataIndex: 'OperationUserName',
      key: 'OperationUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '整改状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '整改完成时间',
      dataIndex: 'CompletionTime',
      key: 'CompletionTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      fixed: 'right',
      align: 'center',
      width: 180,
      ellipsis: true,
      render: (text, record) => {
        return <Tooltip title='详情'> <a onClick={() => { detail(record) }} ><DetailIcon /></a> </Tooltip>
      }
    },
  ];


  const [detailLoading, setDetailLoading] = useState(false)

  const [detailVisible, setDetailVisible] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const detail = (record) => {
    setDetailId(record.ID);
    setDetailVisible(true)
  }



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





  const onFinish = async (pageIndexs, pageSizes) => {  //查询
    try {
      const values = await form.validateFields();

      props.getInspectorRectificationManageList({
        ...values,
        BTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        ETime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        // InspectorType: inspectorType,
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : pageIndex,
        pageSize: pageSizes ? pageSizes : pageSize,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async () => { //导出
    const values = await form.validateFields();

    props.exportInspectorRectificationManage({
      ...values,
      BTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
      ETime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,
      // InspectorType: inspectorType,
    })
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
        console.log(res[0].DGIMN)
        form.setFieldsValue({ DGIMN: res[0].DGIMN })
      })
    }
  }



  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      initialValues={{
        time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day"),]
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      <Row align='middle'>
        <Form.Item label='行政区' name='RegionCode' >
          <RegionList noFilter levelNum={3} style={{ width: 150 }} />
        </Form.Item>
        <Spin spinning={entLoading} size='small' style={{ top: -3, left: 28 }}>
          <Form.Item label='企业' name='EntCode'>
            <EntAtmoList noFilter style={{ width: 150 }} />
          </Form.Item>
        </Spin>
        <Spin spinning={pointLoading} size='small' style={{ top: -3, left: 44 }}>
          <Form.Item label='站点名称' name='DGIMN' >

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
        <Form.Item label="督查人员" name="Inspector" >
          <OperationInspectoUserList type='2' style={{ width: 150 }} />
        </Form.Item>
        {/* <Form.Item label="督查日期" name="time" style={{ marginLeft: 8, marginRight: 8 }}  >
          <RangePicker_
            style={{ width: 300 }}
            allowClear={false}
            format="YYYY-MM-DD" />
        </Form.Item> */}
        <Form.Item label="运维人员" name="OperationUser">
          <OperationInspectoUserList noFirst style={{ width: 150 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 5 }}>
            查询
     </Button>
          <Button onClick={() => { form.resetFields() }} style={{ marginRight: 5 }} >
            重置
     </Button>
          <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={exportLoading} style={{ marginRight: 5 }}>
            导出
            </Button>

        </Form.Item>

      </Row>
    </Form>
  }


  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }


  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)























  return (
    <div className={styles.superviseRectificationSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
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


      <Modal //详情
        visible={detailVisible}
        title={'详情'}
        footer={null}
        width={'90%'}
        className={styles.fromModal}
        onCancel={() => { setDetailVisible(false) }}
        destroyOnClose
      >
        <Detail ID={detailId} />
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);