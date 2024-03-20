/**
 * 功  能：派单信息 服务填报内容 详情内容
 * 创建人：jab
 * 创建时间：2023.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Tabs, Spin, Empty } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import PageLoading from '@/components/PageLoading'
import ImageView from '@/components/ImageView';
import { getAttachmentDataSource } from '@/pages/AutoFormManager/utils';
import AttachmentView from '@/components/AttachmentView';
import CooperaInspection from './components/CooperaInspection'
import { uploadPrefix } from '@/config'
import styles from "./style.less"
const { Option } = Select;
const { TabPane } = Tabs;

const namespace = 'dispatchQuery'




const dvaPropsData = ({ loading, dispatchQuery }) => ({
  serviceDispatchTypeAndRecordLoading: loading.effects[`${namespace}/getServiceDispatchTypeAndRecord`],
  serviceDispatchTypeAndRecordData: dispatchQuery.serviceDispatchTypeAndRecordData,
})

const dvaDispatch = (dispatch) => {
  return {
    getProjectInfo: (payload, callback) => {
      dispatch({
        type: `${namespace}/getProjectInfo`,
        payload: payload,
      })
    },
    getServiceDispatchTypeAndRecord: (payload, callback) => { //派单信息 服务填报内容 需要加载的项
      dispatch({
        type: `${namespace}/getServiceDispatchTypeAndRecord`,
        payload: payload,
        callback: callback,
      })
    },
    getAcceptanceServiceRecord: (payload, callback) => { // 验收服务报告
      dispatch({
        type: `${namespace}/getAcceptanceServiceRecord`,
        payload: payload,
        callback: callback,
      })
    },
    getWorkRecord: (payload, callback) => { // 工作记录
      dispatch({
        type: `${namespace}/getWorkRecord`,
        payload: payload,
        callback: callback,
      })
    },
    getPublicRecord: (payload, callback) => { // 勘查信息、 项目交接单、安装报告、72小时调试检测、比对监测报告、验收资料等
      dispatch({
        type: `${namespace}/getPublicRecord`,
        payload: payload,
        callback: callback,
      })
    },
    getInstallationPhotosRecord: (payload, callback) => { //安装照片
      dispatch({
        type: `${namespace}/getInstallationPhotosRecord`,
        payload: payload,
        callback: callback,
      })
    },
    getParameterSettingsPhotoRecord: (payload, callback) => { //参数设置照片
      dispatch({
        type: `${namespace}/getParameterSettingsPhotoRecord`,
        payload: payload,
        callback: callback,
      })
    },
    getCooperateRecord: (payload, callback) => { //配合检查
      dispatch({
        type: `${namespace}/getCooperateRecord`,
        payload: payload,
        callback: callback,
      })
    },
    getRepairRecord: (payload, callback) => { //维修记录
      dispatch({
        type: `${namespace}/getRepairRecord`,
        payload: payload,
        callback: callback,
      })
    },
  }
}
const Index = (props) => {
  const { id, data, serviceDispatchTypeAndRecordLoading, serviceDispatchTypeAndRecordData, } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState();
  const [imageList, setImageList] = useState([]);

  const [tabKey, setTabKey] = useState('')
  const [fillContentTab, setFillContentTab] = useState([])

  useEffect(() => {
    props.getServiceDispatchTypeAndRecord({ dispatchId: id }, (res) => {
      const itemStatusData = res.map(item=>item.ItemStatus)
      const itemStatusFlag = itemStatusData?.toString()?.includes('1')? true : false; //判断是否全部为空
      const showData = res.filter(item=>item.ItemStatus==1)
      setTabKey(itemStatusFlag?  showData?.[0]?.ItemId : '')
      setFillContentTab(itemStatusFlag? showData : [])

    })
  }, []);
  const TitleComponents = (props) => {
    // position:'sticky',top: 0,zIndex:998,background: '#fff',
    return <div style={{ display: 'inline-block', fontWeight: 'bold', marginTop: 4, padding: '2px 0', marginBottom: 12, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>
  }



  const acceptanceServicesCol = [ //验收服务报告列
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '验收服务报告照片',
      dataIndex: 'FileList',
      key: 'FileList',
      align: 'center',
      ellipsis: true,
      render: (text, row) => tableImgList(text)
    },
    {
      title: '照片上传时间',
      dataIndex: 'UploadFileTime',
      key: 'UploadFileTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      key: 'Remark',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
  ]
  const workRecordsCol = [ //工作记录列
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '实际工时（小时）',
      dataIndex: 'ActualHour',
      key: 'ActualHour',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '完成状态',
      dataIndex: 'CompletionStatusName',
      key: 'CompletionStatusName',
      align: 'center',
      ellipsis: true,
      width: 110,
    },
    {
      title: '完成时间',
      dataIndex: 'CompletionTime',
      key: 'CompletionTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      key: 'Remark',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
  ]
  //验收服务报告 表格
  const ServiceReportTable = ({ data, loading }) => {
    return <div>
      <TitleComponents text='验收服务报告' />
      <SdlTable
        // resizable
        loading={loading}
        scroll={{ x: 800, y: 'auto' }}
        rowClassName={null}
        dataSource={data}
        columns={acceptanceServicesCol}
        pagination={false}
      />
    </div>
  }
  //工作记录 组件
  const WorkRecordTable = ({ data, loading,col,isWork }) => {
    return <div>
      <TitleComponents text='工作记录' />
      <SdlTable
        resizable
        loading={loading}
        scroll={{ x: 900, y: 'auto' }}
        rowClassName={null}
        dataSource={data}
        columns={col?col : workRecordsCol}
        pagination={false}
      />
     {/* <Form.Item label="离开现场时间">
        {data?.[0]?.DepartureTime}
      </Form.Item> */}
    </div>
  }
  //通用表格组件  只需要替换验监测点名称和照片上传时间中间的字段
  const CommonReplaceTable = ({ text, col, data, scrollX, loading }) => {

    let columns = []
    columns = acceptanceServicesCol.map(item => item)
    if (col?.length) {
      columns.splice(3, 1, ...col)
    }
    return <>
      <TitleComponents text={text} />
      <SdlTable
        // resizable
        loading={loading}
        scroll={{ x: scrollX ? scrollX : 800, y: 'auto' }}
        rowClassName={null}
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    </>
  }
  const formImgList = (fileList) => {
    return fileList?.ImgList?.length && fileList.ImgList.map((item, index) => <img
      width={20}
      height={20}
      style={{ cursor: 'pointer', marginRight: 6 }}
      src={`/${item}`}
      onClick={() => {
        setIsOpen(true)
        setImageList(fileList?.ImgList?.[0] && fileList.ImgList[0] != 'no' ? fileList.ImgList : [])
        setImageIndex(index)
      }}
    />)
  }
  const tableImgList = (text) => {
    return text?.ImgList?.[0] && text.ImgList[0] != 'no' ? <a onClick={() => {
      setIsOpen(true)
      setImageList(text.ImgList)
      setImageIndex(0)
    }}>
      查看附件
    </a>
      :
      null
  }
  //验收服务表单
  const ServiceReportForm = ({ data, loading }) => {
    return <>
      <TitleComponents text='验收服务报告' />
      <Spin spinning={loading}>
        <Row spinning={loading}>
          <Col span={8}>
            <Form.Item label="验收服务报告照片" >
              {formImgList(data?.FileList)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="照片上传时间" >
              {data?.UploadFileTime}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="备注" >
              {data?.Remark}
            </Form.Item>
          </Col>
        </Row>
      </Spin>
    </>

  }
  //工作记录表单
  const WorkRecordForm = ({ data, loading }) => <>
    <TitleComponents text='工作记录' />
    <Spin spinning={loading}>
      <Row>
        <Col span={8}>
          <Form.Item label="实际工作（小时）" >
            {data?.ActualHour}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="完成状态" >
            {data?.CompletionStatusName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="完成时间" >
            {data?.CompletionTime}
          </Form.Item>
        </Col>
        {/* <Col span={8}>
          <Form.Item label="离开现场时间" >
            {data?.DepartureTime}
          </Form.Item>
        </Col> */}
        <Col span={8}>
          <Form.Item label="备注" >
            {data?.Remark}
          </Form.Item>
        </Col>
      </Row>
    </Spin>
  </>
  /*前期勘查*/

  //服务报告
  const [earlyStaCheckReportId, setEarlyStaCheckReportId] = useState('')
  const [earlyStaCheckReportLoading, setEarlyStaCheckReportLoading] = useState(false)
  const [earlyStaCheckReportData, setEarlyStaCheckReportData] = useState([])

  //勘查信息
  const [earlyStaCheckInfoId, setEarlyStaChecInfoId] = useState('')
  const [earlyStaCheckInfoLoading, setEarlyStaCheckInfoLoading] = useState(false)
  const [earlyStaCheckInfoData, setEarlyStaCheckInfoData] = useState([])

  //工作记录
  const [earlyStaCheckWorkId, setEarlyStaCheckWorkId] = useState('')
  const [earlyStaCheckWorkLoading, setEarlyStaCheckWorkLoading] = useState(false)
  const [earlyStaCheckWorkData, setEarlyStaCheckWorkData] = useState([])
  useEffect(() => {
    if (earlyStaCheckReportId) {
      setEarlyStaCheckReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '1', recordId: earlyStaCheckReportId }, (data) => {
        setEarlyStaCheckReportLoading(false)
        setEarlyStaCheckReportData(data)
      })
    }
    if (earlyStaCheckInfoId) {
      setEarlyStaCheckInfoLoading(true)
      props.getPublicRecord({ mainId: id, serviceId: '1', recordId: earlyStaCheckInfoId }, (data) => {
        setEarlyStaCheckInfoLoading(false)
        setEarlyStaCheckInfoData(data)
      })
    }
    if (earlyStaCheckWorkId) {
      setEarlyStaCheckWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '1', recordId: earlyStaCheckWorkId }, (data) => {
        setEarlyStaCheckWorkLoading(false)
        setEarlyStaCheckWorkData(data)
      })
    }

  }, [earlyStaCheckReportId, earlyStaCheckInfoId, earlyStaCheckWorkId,])
  const EarlyStageCheck = ({ data }) => {

    const SiteInvestigation = ({ siteData, loading }) => {
      return <>
        <TitleComponents text='现场勘查信息' />
        <Spin spinning={loading}>
          <Row>
            <Col span={8}>
              <Form.Item label="现场勘查照片" >
                {formImgList(siteData?.FileList)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="照片上传时间" >
                {siteData?.UploadFileTime}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="备注" >
                {siteData?.Remark}
              </Form.Item>
            </Col>
          </Row>
        </Spin>
      </>
    }
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setEarlyStaCheckReportId(item.RecordId);
              return <ServiceReportForm data={earlyStaCheckReportData?.[0]} loading={earlyStaCheckReportLoading} />; //验收服务报告
            }
          case '10':
            if (item.RecordStatus == 1) {
              setEarlyStaChecInfoId(item.RecordId);
              return <SiteInvestigation siteData={earlyStaCheckInfoData?.[0]} loading={earlyStaCheckInfoLoading} />;  //现场勘查信息
            }
          case '11':
            if (item.RecordStatus == 1) {
              setEarlyStaCheckWorkId(item.RecordId);
              return <WorkRecordForm data={earlyStaCheckWorkData?.[0]} loading={earlyStaCheckWorkLoading} />;//工作记录
            }

        }

      })}
    </Form>
  }
  /* 设备验货 */

  //服务报告
  const [inspectReportId, setInspectReportId] = useState('')
  const [inspectReportLoading, setInspectReportLoading] = useState(false)
  const [inspectkReportData, setInspectReportData] = useState([])
  //验货单
  const [inspectInfoId, setInspectInfoId] = useState('')
  const [inspectInfoLoading, setInspectInfoLoading] = useState(false)
  const [inspectInfoData, setInspectInfoData] = useState([])

  //工作记录
  const [inspectWorkId, setInspectWorkId] = useState('')
  const [inspectWorkLoading, setInspectWorkLoading] = useState(false)
  const [inspectWorkData, setInspectWorkData] = useState([])
  useEffect(() => {
    if (inspectReportId) {
      setInspectReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '2', recordId: inspectReportId }, (data) => {
        setInspectReportLoading(false)
        setInspectReportData(data)
      })
    }
    if (inspectInfoId) {
      setInspectInfoLoading(true)
      props.getPublicRecord({ mainId: id, serviceId: '2', recordId: inspectInfoId }, (data) => {
        setInspectInfoLoading(false)
        setInspectInfoData(data)
      })
    }
    if (inspectWorkId) {
      setInspectWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '2', recordId: inspectWorkId }, (data) => {
        setInspectWorkLoading(false)
        setInspectWorkData(data)
      })
    }
  }, [inspectReportId, inspectInfoId, inspectWorkId,])
  const EquipmentInspection = ({ data }) => {

    const Inspect = ({ inspectData,loading }) => {
      return <>
        <Spin spinning={loading}>
          <TitleComponents text='验货单' />
          <Row>
            <Col span={8}>
              <Form.Item label="验货单照片" >
                {formImgList(inspectData?.FileList)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="照片上传时间" >
                {inspectData?.UploadFileTime}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="备注" >
                {inspectData?.Remark}
              </Form.Item>
            </Col>
          </Row>
        </Spin>
      </>
    }
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setInspectReportId(item.RecordId);
              return <ServiceReportForm data={inspectkReportData?.[0]} loading={inspectReportLoading} />; //验收服务报告
            }
          case '12':
            if (item.RecordStatus == 1) {
              setInspectInfoId(item.RecordId);
              return <Inspect inspectData={inspectInfoData?.[0]} loading={inspectInfoLoading} />;  //验货单
            }
          case '11':
            if (item.RecordStatus == 1) {
              setInspectWorkId(item.RecordId);
              return <WorkRecordForm data={inspectWorkData?.[0]} loading={inspectWorkLoading} />;//工作记录
            }

        }

      })}
    </Form>
  }

  /* 指导安装 */

  //服务报告
  const [installReportId, setInstallReportId] = useState('')
  const [installReportLoading, setInstallReportLoading] = useState(false)
  const [installReportData, setInstallReportData] = useState([])

  //工作记录
  const [installWorkId, setInstallWorkId] = useState('')
  const [installWorkLoading, setInstallWorkLoading] = useState(false)
  const [installWorkData, setInstallWorkData] = useState([])
  useEffect(() => {
    if (installReportId) {
      setInstallReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '3', recordId: installReportId }, (data) => {
        setInstallReportLoading(false)
        setInstallReportData(data)
      })
    }
    if (installWorkId) {
      setInstallWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '3', recordId: installWorkId }, (data) => {
        setInstallWorkLoading(false)
        setInstallWorkData(data)
      })
    }
  }, [installReportId, installWorkId,])
  const GuideInstallation = ({ data }) => {
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setInstallReportId(item.RecordId);
              return <ServiceReportTable data={installReportData} loading={installReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              setInstallWorkId(item.RecordId);
              let columns = []
              columns = workRecordsCol.map(item => item)
              columns.splice(3, 0,{
                  title: '设备型号',
                  dataIndex: 'SystemModelName',
                  key: 'SystemModelName',
                  align: 'center',
                  ellipsis: true,
                  width: 'auto',
                })
              
              return <WorkRecordTable data={installWorkData} loading={installWorkLoading} col={columns}/>;//工作记录
            }

        }

      })}
    </Form>
  }
  /**** 静态调试 *****/

  //服务报告
  const [staticReportId, setStaticReportId] = useState('')
  const [staticReportLoading, setStaticReportLoading] = useState(false)
  const [staticReportData, setStaticReportData] = useState([])
  //工作记录
  const [staticWorkId, setStaticWorkId] = useState('')
  const [staticWorkLoading, setStaticWorkLoading] = useState(false)
  const [staticWorkData, setStatictWorkData] = useState([])
  //项目交接
  const [staticInfoId, setStaticInfoId] = useState('')
  const [staticInfoLoading, setStaticInfoLoading] = useState(false)
  const [staticInfoData, setStaticInfoData] = useState([])
  //安装报告  
  const [staticInstallRepId, setStaticInstallRepId] = useState('')
  const [staticInstallRepLoading, setStaticInstallRepLoading] = useState(false)
  const [staticInstallRepData, setStaticInstallRepData] = useState([])
  //安装照片  
  const [staticPhotoId, setStaticPhotoId] = useState('')
  const [staticPhotoLoading, setStaticPhotoLoading] = useState(false)
  const [staticPhotoData, setStaticPhotoData] = useState([])

  useEffect(() => {
    if (staticReportId) {
      setStaticReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '4', recordId: staticReportId }, (data) => {
        setStaticReportLoading(false)
        setStaticReportData(data)
      })
    }
    if (staticWorkId) {
      setStaticWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '4', recordId: staticWorkId }, (data) => {
        setStaticWorkLoading(false)
        setStatictWorkData(data)
      })
    }
    if (staticInfoId) {
      setStaticInfoLoading(true)
      props.getPublicRecord({ mainId: id, serviceId: '4', recordId: staticInfoId }, (data) => {
        setStaticInfoLoading(false)
        setStaticInfoData(data)
      })
    }
    if (staticInstallRepId) {
      setStaticInstallRepLoading(true)
      props.getPublicRecord({ mainId: id, serviceId: '4', recordId: staticInstallRepId }, (data) => {
        setStaticInstallRepLoading(false)
        setStaticInstallRepData(data)
      })
    }
    if (staticPhotoId) {
      setStaticPhotoLoading(true)
      props.getInstallationPhotosRecord({ mainId: id, serviceId: '4', recordId: staticPhotoId }, (data) => {
        setStaticPhotoLoading(false)
        setStaticPhotoData(data)
      })
    }
  }, [staticReportId, staticWorkId, staticInfoId, staticInstallRepId, staticPhotoId])


  const [installPhotosPageIndex, setInstallPhotosPageIndex] = useState(1);
  const [installPhotosPageSize, setInstallPhotosPageSize] = useState(8);
  const installPhotosTableChange = (PageIndex, PageSize) => {
    setInstallPhotosPageSize(PageSize)
    setInstallPhotosPageIndex(PageIndex)
  }

  const StaticDebug = ({ data }) => {
    const projectHandoverCol = [{
      title: '项目交接单照片',
      dataIndex: 'FileList',
      key: 'FileList',
      align: 'center',
      ellipsis: true,
      render: (text, row) => tableImgList(text)
    }]
    const installationReportCol = [{
      title: '安装报告照片',
      dataIndex: 'FileList',
      key: 'FileList',
      align: 'center',
      ellipsis: true,
      render: (text, row) => tableImgList(text)
    }]
    const rowSpanFun = (value, record, index) => {
      let obj = {
        children: <div>{value}</div>,
        props: { rowSpan: index == 0 ? 8 : 0 },
      };
      return obj;
    }
    const installationPhotosCol = [ //安装照片列
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '企业名称',
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'center',
        ellipsis: true,
        width: 'auto',
        render: (text, record, index) => rowSpanFun(text, record, index)
      },
      {
        title: '监测点名称',
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        ellipsis: true,
        width: 'auto',
        render: (text, record, index) => rowSpanFun(text, record, index)
      },
      {
        title: '安装项',
        dataIndex: 'InstallationItemsName',
        key: 'InstallationItemsName',
        align: 'center',
        ellipsis: true,
        width: 'auto',
      },
      {
        title: '安装报告照片',
        dataIndex: 'InstallationPhotoList',
        key: 'InstallationPhotoList',
        align: 'center',
        ellipsis: true,
        render: (text, row) => tableImgList(text)
      },
      {
        title: '照片上传时间',
        dataIndex: 'UploadFileTime',
        key: 'UploadFileTime',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '备注',
        dataIndex: 'Remark',
        key: 'Remark',
        align: 'center',
        ellipsis: true,
        width: 'auto',
      },
    ]
    const InstallPhoto = ({ data, loading }) => {
      return <div>
        <TitleComponents text='安装照片' />
        <SdlTable
          // resizable
          loading={loading}
          scroll={{ x: 850, y: 'auto' }}
          rowClassName={null}
          dataSource={data}
          columns={installationPhotosCol}
          pagination={{
            total: data?.length ? data.length : 0,
            pageSize: installPhotosPageSize,
            current: installPhotosPageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: installPhotosTableChange,
            pageSizeOptions: [8],
          }}
        />
      </div>
    }
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setStaticReportId(item.RecordId);
              return <ServiceReportTable data={staticReportData} loading={staticReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              let columns = []
              columns = workRecordsCol.map(item => item)
              columns.splice(3, 0,{
                title: '设备型号',
                dataIndex: 'SystemModelName',
                key: 'SystemModelName',
                align: 'center',
                ellipsis: true,
                width: 'auto',
              },)
              setStaticWorkId(item.RecordId);
              return <WorkRecordTable data={staticWorkData} loading={staticWorkLoading} col={columns}/>;//工作记录
            }
          case '13':
            if (item.RecordStatus == 1) {
              setStaticInfoId(item.RecordId);
              return <CommonReplaceTable text='项目交接单' col={projectHandoverCol} data={staticInfoData} loading={staticInfoLoading} />;//项目交接单
            }
          case '14':
            if (item.RecordStatus == 1) {
              setStaticInstallRepId(item.RecordId);
              return <CommonReplaceTable text='安装报告' col={installationReportCol} data={staticInstallRepData} loading={staticInstallRepLoading} />;//安装报告
            }
          case '17':
            if (item.RecordStatus == 1) {
              setStaticPhotoId(item.RecordId);
              return <InstallPhoto data={staticPhotoData} loading={staticPhotoLoading} />;//安装照片
            }
        }

      })}
    </Form>
  }
  /** 动态运行**/

  //服务报告
  const [dynamicReportId, setDynamicReportId] = useState('')
  const [dynamicReportLoading, setDynamicReportLoading] = useState(false)
  const [dynamicReportData, setDynamicReportData] = useState([])

  //工作记录
  const [dynamicWorkId, setDynamicWorkId] = useState('')
  const [dynamicWorkLoading, setDynamicWorkLoading] = useState(false)
  const [dynamicWorkData, setDynamicWorkData] = useState([])

  useEffect(() => {
    if (dynamicReportId) {
      setDynamicReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '5', recordId: installReportId }, (data) => {
        setDynamicReportLoading(false)
        setDynamicReportData(data)
      })
    }
    if (dynamicWorkId) {
      setDynamicWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '5', recordId: installWorkId }, (data) => {
        setDynamicWorkLoading(false)
        setDynamicWorkData(data)
      })
    }
  }, [dynamicReportId, dynamicWorkId,])
  const DynamicOperation = ({ data }) => {
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setDynamicReportId(item.RecordId);
              return <ServiceReportTable data={dynamicReportData} loading={dynamicReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              setDynamicWorkId(item.RecordId);
              return <WorkRecordTable data={dynamicWorkData} loading={dynamicWorkLoading} />;//工作记录
            }

        }

      })}
    </Form>
  }

  /** 168/试运行**/

  //服务报告
  const [testRunReportId, setTestRunReportId] = useState('')
  const [testRunReportLoading, setTestRunReportLoading] = useState(false)
  const [testRunReportData, setTestRunReportData] = useState([])

  //工作记录
  const [testRunWorkId, setTestRunWorkId] = useState('')
  const [testRunWorkLoading, setTestRunWorkLoading] = useState(false)
  const [testRunWorkData, setTestRunWorkData] = useState([])

  useEffect(() => {
    if (testRunReportId) {
      setTestRunReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '6', recordId: testRunReportId }, (data) => {
        setTestRunReportLoading(false)
        setTestRunReportData(data)
      })
    }
    if (testRunWorkId) {
      setTestRunWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '6', recordId: testRunWorkId }, (data) => {
        setTestRunWorkLoading(false)
        setTestRunWorkData(data)
      })
    }
  }, [testRunReportId, testRunWorkId,])
  const TestRun = ({ data }) => {
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setTestRunReportId(item.RecordId);
              return <ServiceReportTable data={testRunReportData} loading={testRunReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              setTestRunWorkId(item.RecordId);
              return <WorkRecordTable data={testRunWorkData} loading={testRunWorkLoading} />;//工作记录
            }
        }

      })}
    </Form>
  }

  /**72小时调试检测 */

  //服务报告
  const [debugReportId, setDebugReportId] = useState('')
  const [debugReportLoading, setDebugReportLoading] = useState(false)
  const [debugReportData, setDebugReportData] = useState([])
  //工作记录
  const [debugWorkId, setDebugWorkId] = useState('')
  const [debugWorkLoading, setDebugWorkLoading] = useState(false)
  const [debugWorkData, setDebugWorkData] = useState([])
  //72小时调试检测
  const [debugInfoId, setDebugInfoId] = useState('')
  const [debugInfoLoading, setDebugInfoLoading] = useState(false)
  const [debugInfoData, setDebugInfoData] = useState([])
  //参数照片  
  const [debugPhotoId, setDebugPhotoId] = useState('')
  const [debugPhotoLoading, setDebugPhotoLoading] = useState(false)
  const [debugPhotoData, setDebugPhotoData] = useState([])

  useEffect(() => {
    if (debugReportId) {
      setDebugReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '7', recordId: debugReportId }, (data) => {
        setDebugReportLoading(false)
        setDebugReportData(data)
      })
    }
    if (debugWorkId) {
      setDebugWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '7', recordId: debugWorkId }, (data) => {
        setDebugWorkLoading(false)
        setDebugWorkData(data)
      })
    }
    if (debugInfoId) {
      setDebugInfoLoading(true)
      props.getPublicRecord({ mainId: id, serviceId: '7', recordId: debugInfoId }, (data) => {
        setDebugInfoLoading(false)
        setDebugInfoData(data)
      })
    }
    if (debugPhotoId) {
      setDebugPhotoLoading(true)
      props.getParameterSettingsPhotoRecord({ mainId: id, serviceId: '7', recordId: debugPhotoId }, (data) => {
        setDebugPhotoLoading(false)
        setDebugPhotoData(data)
      })
    }
  }, [debugReportId, debugWorkId, debugInfoId, debugPhotoId])
  const DebugTest = ({ data }) => {
    const debugTestCol = [{
      title: '72小时调试检测报告',
      dataIndex: 'FileList',
      key: 'FileList',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (text, record) => {
        if (text?.ImgList?.[0] && text.ImgList[0] != 'no' && text?.ImgNameList?.[0]) {
          const fileList = text.ImgList.map((item, index) => {
            return {
              name: text.ImgNameList[index] || '附件.pdf',
              attach: `${uploadPrefix}/${item}`
            }
          })
          return <AttachmentView dataSource={fileList} />;
        }
      },
    }]
    const parSet = [
      {
        title: '参数设置方',
        dataIndex: 'ParameterSetterName',
        key: 'ParameterSetterName',
        align: 'center',
        ellipsis: true,
        width: 110,
      },
      {
        title: '参数设置照片',
        dataIndex: 'SetPhotoList',
        key: 'SetPhotoList',
        align: 'center',
        ellipsis: true,
        width: 110,
        render: (text, row) => row.ParameterSetter == 1 ? tableImgList(text) : null
      },
      {
        title: '客户告知函及函件发送方式截图',
        dataIndex: 'SetPhotoList',
        key: 'SetPhotoList',
        align: 'center',
        ellipsis: true,
        width: 200,
        render: (text, row) => row.ParameterSetter == 2 ? tableImgList(text) : null
      },
    ]
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setDebugReportId(item.RecordId);
              return <ServiceReportTable data={debugReportData} loading={debugReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              let columns = []
              columns = workRecordsCol.map(item => item)
                columns.splice(3, 0,{
                    title: '设备型号',
                    dataIndex: 'SystemModelName',
                    key: 'SystemModelName',
                    align: 'center',
                    ellipsis: true,
                    width: 'auto',
                  },{
                    title: '是否调试完成',
                    dataIndex: 'Col1Name',
                    key: 'Col1Name',
                    align: 'center',
                    ellipsis: true,
                  })
              setDebugWorkId(item.RecordId);
              return <WorkRecordTable data={debugWorkData} loading={debugWorkLoading} col={columns}/>;//工作记录
            }
          case '19':
            if (item.RecordStatus == 1) {
              setDebugInfoId(item.RecordId);
              return <CommonReplaceTable text='72小时调试检测' col={debugTestCol} data={debugInfoData} loading={debugInfoLoading} />;//72小时调试检测
            }
          case '20':
            if (item.RecordStatus == 1) {
              setDebugPhotoId(item.RecordId);
              return <CommonReplaceTable text='参数设置照片' col={parSet} data={debugPhotoData} loading={debugPhotoLoading} />;//参数设置照片
            }
        }

      })}
    </Form>
  }
  /***** 联网 *****/

  //服务报告
  const [netReportId, setNetReportId] = useState('')
  const [netReportLoading, setNetReportLoading] = useState(false)
  const [netReportData, setNetReportData] = useState([])

  //工作记录
  const [netWorkId, setNetWorkId] = useState('')
  const [netWorkLoading, setNetWorkLoading] = useState(false)
  const [netWorkData, setNetWorkData] = useState([])

  useEffect(() => {
    if (netReportId) {
      setNetReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '8', recordId: netReportId }, (data) => {
        setNetReportLoading(false)
        setNetReportData(data)
      })
    }
    if (netWorkId) {
      setNetWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '8', recordId: testRunWorkId }, (data) => {
        setNetWorkLoading(false)
        setNetWorkData(data)
      })
    }
  }, [netReportId, netWorkId,])
  const Networking = ({ data }) => {
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setNetReportId(item.RecordId);
              return <ServiceReportTable data={netReportData} loading={netReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              setNetWorkId(item.RecordId);
              return <WorkRecordTable data={netWorkData} loading={netWorkLoading} />;//工作记录
            }
        }

      })}
    </Form>
  }
  /***** 对比监测 *****/
  //服务报告
  const [comparaReportId, setComparaReportId] = useState('')
  const [comparaReportLoading, setComparaReportLoading] = useState(false)
  const [comparaReportData, setComparaReportData] = useState([])
  //工作记录
  const [comparaWorkId, setComparaWorkId] = useState('')
  const [comparaWorkLoading, setComparaWorkLoading] = useState(false)
  const [comparaWorkData, setComparaWorkData] = useState([])
  //比对监测报告
  const [comparaInfoId, setComparaInfoId] = useState('')
  const [comparaInfoLoading, setComparaInfoLoading] = useState(false)
  const [comparaInfoData, setComparaInfoData] = useState([])

  useEffect(() => {
    if (comparaReportId) {
      setComparaReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '9', recordId: comparaReportId }, (data) => {
        setComparaReportLoading(false)
        setComparaReportData(data)
      })
    }
    if (comparaWorkId) {
      setComparaWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '9', recordId: comparaWorkId }, (data) => {
        setComparaWorkLoading(false)
        setComparaWorkData(data)
      })
    }
    if (comparaInfoId) {
      setComparaInfoLoading(true)
      props.getPublicRecord({ mainId: id, serviceId: '9', recordId: comparaInfoId }, (data) => {
        setComparaInfoLoading(false)
        setComparaInfoData(data)
      })
    }

  }, [comparaReportId, comparaWorkId, comparaInfoId])
  const ComparativeMonitoring = ({ data }) => {
    const monitorCol = [{
      title: '第三方比对监测报告照片',
      dataIndex: 'FileList',
      key: 'FileList',
      align: 'center',
      ellipsis: true,
      width: 160,
      render: (text, row) => tableImgList(text)
    }]
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setComparaReportId(item.RecordId);
              return <ServiceReportTable data={comparaReportData} loading={comparaReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              setComparaWorkId(item.RecordId);
              return <WorkRecordTable data={comparaWorkData} loading={comparaWorkLoading} />;//工作记录
            }
          case '22':
            if (item.RecordStatus == 1) {
              setComparaInfoId(item.RecordId);
              return <CommonReplaceTable text='比对监测报告' col={monitorCol} data={comparaInfoData} loading={comparaInfoLoading} />;//72小时调试检测
            }
        }

      })}
    </Form>
  }
  /***** 项目验收  *****/
  //服务报告
  const [projectAccepReportId, setProjectAccepReportId] = useState('')
  const [projectAccepReportLoading, setProjectAccepReportLoading] = useState(false)
  const [projectAccepReportData, setProjectAccepReportData] = useState([])
  //工作记录
  const [projectAccepWorkId, setProjectAccepWorkId] = useState('')
  const [projectAccepWorkLoading, setProjectAccepWorkLoading] = useState(false)
  const [projectAccepWorkData, setProjectAccepWorkData] = useState([])
  //验收资料
  const [projectAccepInfoId, setProjectAccepInfoId] = useState('')
  const [projectAccepInfoLoading, setProjectAccepInfoLoading] = useState(false)
  const [projectAccepInfoData, setProjectAccepInfoData] = useState([])

  useEffect(() => {
    if (projectAccepReportId) {
      setProjectAccepReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '10', recordId: projectAccepReportId }, (data) => {
        setProjectAccepReportLoading(false)
        setProjectAccepReportData(data)
      })
    }
    if (projectAccepWorkId) {
      setProjectAccepWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '10', recordId: projectAccepWorkId }, (data) => {
        setProjectAccepWorkLoading(false)
        setProjectAccepWorkData(data)
      })
    }
    if (projectAccepInfoId) {
      setProjectAccepInfoLoading(true)
      props.getPublicRecord({ mainId: id, serviceId: '10', recordId: projectAccepInfoId }, (data) => {
        setProjectAccepInfoLoading(false)
        setProjectAccepInfoData(data)
      })
    }

  }, [projectAccepReportId, projectAccepWorkId, projectAccepInfoId])
  const ProjectAcceptance = ({data}) => {
    const acceptanceCol = [{
      title: '验收资料照片',
      dataIndex: 'FileList',
      key: 'FileList',
      align: 'center',
      ellipsis: true,
      render: (text, row) => tableImgList(text)
    }]
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setProjectAccepReportId(item.RecordId);
              return <ServiceReportTable data={projectAccepReportData} loading={projectAccepReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              let columns = []
              columns = workRecordsCol.map(item => item)
                columns.splice(3, 0,{
                    title: '设备型号',
                    dataIndex: 'SystemModelName',
                    key: 'SystemModelName',
                    align: 'center',
                    ellipsis: true,
                    width: 'auto',
                  })
              setProjectAccepWorkId(item.RecordId);
              return <WorkRecordTable data={projectAccepWorkData} loading={projectAccepWorkLoading} col={columns}/>;//工作记录
            }
          case '23':
            if (item.RecordStatus == 1) {
              setProjectAccepInfoId(item.RecordId);
              return <CommonReplaceTable text='验收资料' col={acceptanceCol} data={projectAccepInfoData} loading={projectAccepInfoLoading} />;//验收资料
            }
        }

      })}
    </Form>
  }
  /***** 配合检查 *****/

  //服务报告
  const [cooperateReportId, setCooperateReportId] = useState('')
  const [cooperateReportLoading, setCooperateReportLoading] = useState(false)
  const [cooperateReportData, setCooperateReportData] = useState([])
  //工作记录
  const [cooperateWorkId, setCooperateWorkId] = useState('')
  const [cooperateWorkLoading, setCooperateWorkLoading] = useState(false)
  const [cooperateWorkData, setCooperateWorkData] = useState([])
  //第三方检查汇报
  const [cooperateInfoId, setCooperateInfoId] = useState('')
  const [cooperateInfoLoading, setCooperateInfoLoading] = useState(false)
  const [cooperateInfoData, setCooperateInfoData] = useState([])
  useEffect(() => {
    if (cooperateReportId) {
      setCooperateReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '11', recordId: cooperateReportId }, (data) => {
        setCooperateReportLoading(false)
        setCooperateReportData(data)
      })
    }
    if (cooperateWorkId) {
      setCooperateWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '11', recordId: cooperateWorkId }, (data) => {
        setCooperateWorkLoading(false)
        setCooperateWorkData(data)
      })
    }
    if (cooperateInfoId) {
      setCooperateInfoLoading(true)
      props.getCooperateRecord({ mainId: id, serviceId: '11', recordId: cooperateInfoId }, (data) => {
        setCooperateInfoLoading(false)
        setCooperateInfoData(data)
      })
    }

  }, [cooperateReportId, cooperateWorkId, cooperateInfoId])

  const [cooperaInspectionVisible,setCooperaInspectionVisible] = useState(false)
  const [cooperaInspectionTitle,setCooperaInspectionTitle] = useState('')
  const [cooperaInspectionData,setCooperaInspectionData] = useState('')

  const CooperateInspection = ({data}) => {
    const inspectionCol = [ //第三方检查汇报 列
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '企业名称',
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'center',
        ellipsis: true,
        width: 'auto',
      },
      {
        title: '监测点名称',
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        ellipsis: true,
        width: 'auto',
      },
      {
        title: '检查汇报记录',
        align: 'center',
        ellipsis: true,
        render: (text, row) => {
          return <a onClick={() => {
            setCooperaInspectionVisible(true)
            setCooperaInspectionData(row)
          }}>
            详情
            </a>
        }
      },
      {
        title: '填报时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        align: 'center',
        ellipsis: true,
      },
    ]
    const ThirdCheck = ({ data, loading }) => {
      return <div>
        <TitleComponents text='第三方检查汇报' />
        <SdlTable
          // resizable
          loading={loading}
          scroll={{ x: 700, y: 'auto' }}
          rowClassName={null}
          dataSource={data}
          columns={inspectionCol}
          pagination={false}
        />
      </div>
    }
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setCooperateReportId(item.RecordId);
              return <ServiceReportTable data={cooperateReportData} loading={cooperateReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              setCooperateWorkId(item.RecordId);
              return <WorkRecordTable data={cooperateWorkData} loading={cooperateWorkLoading} />;//工作记录
            }
          case '24':
            if (item.RecordStatus == 1) {
              setCooperateInfoId(item.RecordId);
              return <ThirdCheck data={cooperateInfoData} loading={cooperateInfoLoading} />;//第三方检查汇报
            }
        }

      })}
    </Form>
  }

  /***** 维修 *****/
  //服务报告
  const [maintenReportId, setMaintenReportId] = useState('')
  const [maintenReportLoading, setMaintenReportLoading] = useState(false)
  const [maintenReportData, setMaintenReportData] = useState([])
  //工作记录
  const [maintenWorkId, setMaintenWorkId] = useState('')
  const [maintenWorkLoading, setMaintenWorkLoading] = useState(false)
  const [maintenWorkData, setMaintenWorkData] = useState([])
  //维修记录
  const [maintenInfoId, setMaintenInfoId] = useState('')
  const [maintenInfoLoading, setMaintenInfoLoading] = useState(false)
  const [maintenInfoData, setMaintenInfoData] = useState([])
  useEffect(() => {
    if (maintenReportId) {
      setMaintenReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '12', recordId: maintenReportId }, (data) => {
        setMaintenReportLoading(false)
        setMaintenReportData(data)
      })
    }
    if (maintenWorkId) {
      setMaintenWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '12', recordId: maintenWorkId }, (data) => {
        setMaintenWorkLoading(false)
        setMaintenWorkData(data)
      })
    }
    if (maintenInfoId) {
      setMaintenInfoLoading(true)
      props.getRepairRecord({ mainId: id, serviceId: '12', recordId: maintenInfoId }, (data) => {
        setMaintenInfoLoading(false)
        setMaintenInfoData(data)
      })
    }

  }, [maintenReportId, maintenWorkId, maintenInfoId])
  const Maintenance = ({ data }) => {
    const maintenanceCol = [ //维修记录 列
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '企业名称',
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
        title: '故障单元',
        dataIndex: 'FaultUnitName',
        key: 'FaultUnitName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '故障时间',
        dataIndex: 'FaultTime',
        key: 'FaultTime',
        align: 'center',
        ellipsis: true,
        width:140,
      },
      {
        title: '系统型号',
        dataIndex: 'SystemModelName',
        key: 'SystemModelName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '主机名称型号',
        dataIndex: 'EquipmentNameModel',
        key: 'EquipmentNameModel',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '主机列序号',
        dataIndex: 'EquipmentNumber',
        key: 'EquipmentNumber',
        align: 'center',
        ellipsis: true,
        width:130,
      },
      {
        title: '主机生产厂商',
        dataIndex: 'ManufactorName',
        key: 'ManufactorName',
        align: 'center',
      },
      {
        title: '故障现象',
        dataIndex: 'FaultPhenomenon',
        key: 'FaultPhenomenon',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '原因分析',
        dataIndex: 'CauseAnalysis',
        key: 'CauseAnalysis',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '处理方法',
        dataIndex: 'ProcessingMethod',
        key: 'ProcessingMethod',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '处理结果',
        dataIndex: 'ProcessingResults',
        key: 'ProcessingResults',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '备注',
        dataIndex: 'Remark',
        key: 'Remark',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '维修日期',
        dataIndex: 'RepairDate',
        key: 'RepairDate',
        align: 'center',
        ellipsis: true,
        width:140,
      },
      {
        title: '离开时间',
        dataIndex: 'DepartureTime',
        key: 'DepartureTime',
        align: 'center',
        ellipsis: true,
        width:140,
      },
      // {
      //   title: '审核状态',
      //   dataIndex: 'x',
      //   key: 'x',
      //   align: 'center',
      //   ellipsis: true,
      //   width:100,
      // },
    ]
    const MaintenanceRecord = ({ data, loading }) => {
      return <div>
        <TitleComponents text='维修记录' />
        <SdlTable
          // resizable
          loading={loading}
          scroll={{ y:'auto'  }}
          rowClassName={null}
          dataSource={data}
          columns={maintenanceCol}
          pagination={false}
        />
      </div>
    }
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setMaintenReportId(item.RecordId);
              return <ServiceReportTable data={maintenReportData} loading={maintenReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              setMaintenWorkId(item.RecordId);
              return <WorkRecordTable data={maintenWorkData} loading={maintenWorkLoading}/>;//工作记录
            }
          case '25':
            if (item.RecordStatus == 1) {
              setMaintenInfoId(item.RecordId);
              return <MaintenanceRecord data={maintenInfoData} loading={maintenInfoLoading} />;//维修记录
            }
        }

      })}
    </Form>
  }
  /*** 培训 ****/

  //服务报告
  const [trainReportId, setTrainReportId] = useState('')
  const [trainReportLoading, setTrainReportLoading] = useState(false)
  const [trainReportData, setTrainReportData] = useState([])

  //工作记录
  const [trainWorkId, setTrainWorkId] = useState('')
  const [trainWorkLoading, setTrainWorkLoading] = useState(false)
  const [trainWorkData, setTrainWorkData] = useState([])
  useEffect(() => {
    if (trainReportId) {
      setTrainReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '13', recordId: trainReportId }, (data) => {
        setTrainReportLoading(false)
        setTrainReportData(data)
      })
    }
    if (trainWorkId) {
      setTrainWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '13', recordId: trainWorkId }, (data) => {
        setTrainWorkLoading(false)
        setTrainWorkData(data)
      })
    }

  }, [trainReportId, trainWorkId,])
  const Train = ({ data }) => {
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setTrainReportId(item.RecordId);
              return <ServiceReportForm data={trainReportData?.[0]} loading={trainReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              setTrainWorkId(item.RecordId);
              return <WorkRecordForm data={trainWorkData?.[0]} loading={trainWorkLoading} />;//工作记录
            }

        }

      })}
    </Form>
  }

  /***** 其它 *****/
  //服务报告
  const [otherReportId, setOtherReportId] = useState('')
  const [otherReportLoading, setOtherReportLoading] = useState(false)
  const [otherReportData, setOtherReportData] = useState([])

  //工作记录
  const [otherWorkId, setOtherWorkId] = useState('')
  const [otherWorkLoading, setOtherWorkLoading] = useState(false)
  const [otherWorkData, setOtherWorkData] = useState([])
  useEffect(() => {
    if (otherReportId) {
      setOtherReportLoading(true)
      props.getAcceptanceServiceRecord({ mainId: id, serviceId: '14', recordId: otherReportId }, (data) => {
        setOtherReportLoading(false)
        setOtherReportData(data)
      })
    }
    if (otherWorkId) {
      setOtherWorkLoading(true)
      props.getWorkRecord({ mainId: id, serviceId: '14', recordId: otherWorkId }, (data) => {
        setOtherWorkLoading(false)
        setOtherWorkData(data)
      })
    }

  }, [otherReportId, otherWorkId,])
  const Other = ({ data }) => {
    return <Form name="detail">
      {data.map(item => {
        switch (item.RecordId) {
          case '9':
            if (item.RecordStatus == 1) {
              setOtherReportId(item.RecordId);
              return <ServiceReportForm data={otherReportData?.[0]} loading={otherReportLoading} />; //验收服务报告
            }
          case '11':
            if (item.RecordStatus == 1) {
              setOtherWorkId(item.RecordId);
              return <WorkRecordForm data={otherWorkData?.[0]} loading={otherWorkLoading} />;//工作记录
            }

        }

      })}
    </Form>
  }

  const fillContentTabContent = (item) => {
    const tabContent = {
      '1': <EarlyStageCheck data={item.RecordList?.length ? item.RecordList : []} />, //前期勘查
      '2': <EquipmentInspection data={item.RecordList ? item.RecordList : []} />,//设备验货
      '3': <GuideInstallation data={item.RecordList ? item.RecordList : []} />,//指导安装
      '4': <StaticDebug data={item.RecordList ? item.RecordList : []} />,//静态调试
      '5': <DynamicOperation data={item.RecordList ? item.RecordList : []} />,//前期勘查
      '6': <TestRun data={item.RecordList ? item.RecordList : []} />,//168试运行
      '7': <DebugTest data={item.RecordList ? item.RecordList : []} />,//72小时调试检测
      '8': <Networking data={item.RecordList ? item.RecordList : []} />,//联网
      '9': <ComparativeMonitoring data={item.RecordList ? item.RecordList : []} />,//比对监测
      '10': <ProjectAcceptance data={item.RecordList ? item.RecordList : []} />,//项目验收
      '11': <CooperateInspection data={item.RecordList ? item.RecordList : []} />,//配合检查
      '12': <Maintenance data={item.RecordList ? item.RecordList : []} />,//维修
      '13': <Train data={item.RecordList ? item.RecordList : []} />,//培训
      '14': <Other data={item.RecordList ? item.RecordList : []} />,//其他
    }
    return item.ItemId && tabContent[item.ItemId]
  }

  const ServiceFillContent = () => {
    return serviceDispatchTypeAndRecordLoading ? <PageLoading size='default' /> :
      fillContentTab?.[0] ? 
      <Tabs type='card' activeKey={tabKey} onChange={(key) => { setTabKey(key) }}>
        {fillContentTab.map(item => {
            return <TabPane tab={item.ItemName} key={item.ItemId}>
              {fillContentTabContent(item)}
            </TabPane>
        })
       }
      </Tabs>
      :
      <Empty description='暂无添加表单项'/>
          
  }


  const ServiceWorkContent = () => {
    return <Form name="detail">
      <TitleComponents text='基础信息-发起人填写' />
      <Row>
        <Col span={8}>
          <Form.Item label="派工单号" >
            {data.Num}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="服务申请人">
            {data.ApplicantUserName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="下单日期" >
            {data.OrderDate}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="合同编号">
            {data.ProjectCode}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="立项号">
            {data.ItemCode}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="签约客户名称"  >
            {data.SignName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="最终用户名称"  >
            {data.CustomEnt}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="项目名称" >
            {data.ProjectName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="合同类型" >
            {data.ProjectType}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="最终用户" >
            {data.CustomName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="项目所在省" >
            {data.Province}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="服务大区" >
            {data.Region}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="项目所属行业" >
            {data.Industry}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="工程助理"  >
            {data.AssistantName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="服务需求日期"  >
            {data.DemandDate}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="本次服务内容"  >
            {data.Remark}
          </Form.Item>
        </Col>
      </Row>
      <TitleComponents text='服务需求-工程助理填写' />
      <Row>
        <Col span={8}>
          <Form.Item label="服务大区" >
            {data.Region}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="服务需求日期" >
            {data.DemandDate}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="派工内容描述" >
            {data.DispatchContent}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="服务属性" >
            {data.Attribute}
          </Form.Item>
        </Col>
      </Row>
      <TitleComponents text='区域服务派发-区域派工人员填写' />
      <Row>
        <Col span={8}>
          <Form.Item label="服务工程师" >
            {data.WorkerName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理时间" >
            {data.DealTime}
          </Form.Item>
        </Col>
      </Row>
      <TitleComponents text='联系客户-工程师填写' />
      <Row>
        <Col span={8}>
          <Form.Item label="联系客户时间" >
            {data.ContactDate}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="协商到达时间" >
            {data.ConsultDate}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item label="联系人" >
            {data.ContactsName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="联系电话" >
            {data.Phone}
          </Form.Item>
        </Col>
      </Row>
      <TitleComponents text='工作记录-工程师填写' />
      <Row>
        <Col span={8}>
          <Form.Item label="服务工程师" >
            {data.WorkJLName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="到达现场时间" >
            {data.ArriveDate}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item label="离开现场时间" >
            {data.LeaveSceneTime}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="实际工时（小时）" >
            {data.RealityHour}
          </Form.Item>
        </Col>
      </Row>
      <TitleComponents text='服务结果处理-工程助理填写' />
      <Row>
        <Col span={8}>
          <Form.Item label="确认收入套数" >
            {data.ConfirmCount}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="参与过程服务核算" >
            {data.ProcessCalculate}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item label="参与保内服务核算" >
            {data.WarrantyCalculate}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="参与其它类核算" >
            {data.OtherCalculate}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }

  return (
    <div>
      <Tabs defaultActiveKey="1" tabPosition="left">
        <TabPane tab="服务填报内容" key="1">
          {/* <ServiceFillContent /> */}
          {ServiceFillContent()}
        </TabPane>
        <TabPane tab="服务派工申请单" key="2">
          <ServiceWorkContent />
        </TabPane>
      </Tabs>
      {/* 查看附件弹窗 */}
      <ImageView
        isOpen={isOpen}
        images={imageList?.length ? imageList.map(item => `/${item}`) : []}
        imageIndex={imageIndex}
        onCloseRequest={() => {
          setIsOpen(false);
        }}
      />
      <Modal
        visible={cooperaInspectionVisible}
        title={cooperaInspectionTitle}
        onCancel={() => { setCooperaInspectionVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal`}
      >
       <CooperaInspection cooperatInspectionRecordList={cooperaInspectionData}/>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);