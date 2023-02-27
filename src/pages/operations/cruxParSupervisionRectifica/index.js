/**
 * 功  能：运维督查管理 
 * 创建人：jab
 * 创建时间：2022.04.20
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload, Tag, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, IssuesCloseOutlined, AuditOutlined, DownOutlined, ProfileOutlined, UploadOutlined, EditOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled, UnlockFilled, ToTopOutlined, } from '@ant-design/icons';
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
import RectificaDetail from './RectificaDetail';
import Lightbox from "react-image-lightbox-rotate";

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'cruxParSupervisionRectifica'




const dvaPropsData = ({ loading, cruxParSupervisionRectifica, global, common, point, autoForm }) => ({
  clientHeight: global.clientHeight,
  entLoading: common.entLoading,
  tableDatas: cruxParSupervisionRectifica.tableDatas,
  tableLoading: loading.effects[`${namespace}/getKeyParameterQuestionList`],
  tableTotal: cruxParSupervisionRectifica.tableTotal,
  exportLoading: loading.effects[`${namespace}/exportKeyParameterQuestionList`],
  regQueryPar:cruxParSupervisionRectifica.regQueryPar,

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
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
    getKeyParameterQuestionList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getKeyParameterQuestionList`,
        payload: payload,
      })
    },
    exportKeyParameterQuestionList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportKeyParameterQuestionList`,
        payload: payload,
      })
    },
    checkItemKeyParameterQuestion: (payload, callback) => { //核查整改
      dispatch({
        type: `${namespace}/checkItemKeyParameterQuestion`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {

  const { match: { path } } = props;

  const [form] = Form.useForm();


  const { tableDatas, tableTotal, tableLoading, exportLoading, entLoading,regQueryPar, } = props;


  const userCookie = Cookie.get('currentUser');



  useEffect(() => {
    onFinish(pageIndex,pageSize)
  }, []);


  const columns = [
    {
      title: '省',
      dataIndex: 'provinceName',
      key: 'provinceName',
      align: 'center',
    },
    {
      title: '市',
      dataIndex: 'cityName',
      key: 'cityName',
      align: 'center',
    },
    {
      title: `企业名称`,
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维人员',
      dataIndex: 'operationUserName',
      key: 'operationUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '核查人',
      dataIndex: 'checkUserName',
      key: 'checkUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '核查日期',
      dataIndex: 'checkTime',
      key: 'checkTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'rectificationStatus',
      key: 'rectificationStatus',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return  <span style={{ color: text=='整改待核实'? '#f5222d': text=='整改已完成'? '#52c41a' : ''}}>{text}</span> 
      }
    },
    {
      title: '整改完成时间',
      dataIndex: 'rectificationTime',
      key: 'rectificationTime',
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
        return (
          <div>
            {record.rectificationStatus!=='整改已完成'&&<>
            <a onClick={() => { rectificaDetail(record, 1) }}>
              核查整改
              </a>
           <Divider type="vertical" />
            </>}
            <a onClick={() => {
              rectificaDetail(record, 2)
            }}>
              整改详情
          </a>
          </div>
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


  const onFinish = async (pageIndexs, pageSizes,par) => {  //查询  par参数 分页需要的参数
    try {
      const values = await form.validateFields();

      props.getKeyParameterQuestionList(par?par : {
        ...values,
        beginTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        time2:undefined,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async () => { //导出
    const values = await form.validateFields();
    props.exportKeyParameterQuestionList({
      ...values,
      beginTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      checkBeginTime: values.time2 && moment(values.time2[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      checkEndTime: values.time2 && moment(values.time2[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,
      time2:undefined,

    })
  }





  const [pointList, setPointList] = useState([])
  const [pointLoading, setPointLoading] = useState(false)

  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'entCode') {
      if (!hangedValues.entCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setPointList([])
        return;
      }
      setPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.entCode }, (res) => {
        setPointList(res)
        setPointLoading(false)
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
      onFinish={()=>{setPageIndex(1); onFinish(1,pageSize)}}
      onValuesChange={onValuesChange}
    >
      <Row align='middle'>
        <Form.Item label='行政区' name='regionCode' >
          <RegionList noFilter levelNum={2} style={{ width: 150 }} />
        </Form.Item>
        <Spin spinning={entLoading} size='small' style={{ top: -3, left: 39 }}>
          <Form.Item label='企业' name='entCode'>
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
        <Form.Item label="核查人" name="checkUser"  >
          <OperationInspectoUserList type='2' style={{ width: 150 }} />
        </Form.Item>
        <Form.Item label="核查日期" name="time"  >
            <RangePicker_
              style={{ width: 300 }}
              allowClear={false}
              format="YYYY-MM-DD" />
          </Form.Item>
        <Form.Item label="整改状态" name="checkResult"  >
          <Select placeholder='请选择' allowClear style={{ width: 150 }}>
            <Option key={1} value={1} >整改待核实</Option>
            <Option key={2} value={2} >整改未完成</Option>
            <Option key={3} value={3} >整改已完成</Option>    
          </Select>
        </Form.Item>
        <Form.Item style={{paddingLeft:16}}>
          <Button type="primary" loading={tableLoading} htmlType='submit'>
            查询
          </Button>
          <Button onClick={() => { form.resetFields() }}   style={{ margin: '0 8px' }}>
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
    onFinish(PageIndex, PageSize,{...regQueryPar,pageIndex:PageIndex,pageSize:PageSize})
  }


  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)


  const [rectificaDetailVisible, setRectificaDetailVisible] = useState(false)
  const [rectificaDetailId, setRectificaDetailId] = useState(null)
  const [rectificaDetailType, setRectificaDetailType] = useState(1)
  const [infoData,setInfoData] = useState(null)
  const rectificaDetail = (record, type) => { //核查 详情
    setRectificaDetailId(record.id);
    setRectificaDetailVisible(true)
    setRectificaDetailType(type)
    setInfoData(record)
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
        visible={rectificaDetailVisible}
        title={rectificaDetailType==1? '核查整改': '整改详情'}
        footer={null}
        width={'100%'}
        className={styles.fromModal}
        onCancel={() => { setRectificaDetailVisible(false);rectificaDetailType==1&&infoData&&infoData.rectificationStatus!=='整改未完成'&&onFinish(pageIndex,pageSize); }}
        destroyOnClose
      >
        <RectificaDetail id={rectificaDetailId} type={rectificaDetailType} infoData={infoData}/>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);