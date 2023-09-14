/**
 * 功  能：资产管理/设备台账 污染源管理
 * 创建人：jab
 * 创建时间：2023.08.29
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Tabs } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import PageLoading from '@/components/PageLoading'
import ImageView from '@/components/ImageView';
import styles from "./style.less"
const { Option } = Select;
const { TabPane } = Tabs;

const namespace = 'projectManager'




const dvaPropsData = ({ loading, projectManager }) => ({
  detailLoading: loading.effects[`${namespace}/getProjectInfo`],
})

const dvaDispatch = (dispatch) => {
  return {
    getProjectInfo: (payload, callback) => {
      dispatch({
        type: `${namespace}/getProjectInfo`,
        payload: payload,
      })

    },

  }
}
const Index = (props) => {
  const { data } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState();
  const [imageList, setImageList] = useState([]);


  useEffect(() => {

  }, []);
  const TitleComponents = (props) => {
    // position:'sticky',top: 0,zIndex:998,background: '#fff',
    return <div style={{ display: 'inline-block', fontWeight: 'bold', marginTop: 4, padding: '2px 0', marginBottom: 12, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>
  }
  const [fillContentTab, setFillContent] = useState(['前期勘查', '设备验货', '指导安装', '静态调试', '动态投运', '168/试运行', '72小时调试检测',
    '联网', '比对监测', '项目验收', '配合检查', '维修', '培训', '其他',])


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
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '监测点名称',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '验收服务报告照片',
      dataIndex: 'itemCode',
      key: 'itemCode',
      align: 'center',
      ellipsis: true,
      render: (text, row) => {
        return <a onClick={() => {
          setIsOpen(true)
          setImageList(row.PictureFilesList?.LowimgList.map(item => `/upload/${item}`))
          setImageIndex(0)
        }}>
          查看附件
          </a>
      }

    },
    {
      title: '照片上传时间',
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'AssistantName',
      key: 'AssistantName',
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
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '监测点名称',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '设备型号',
      dataIndex: 'itemCode',
      key: 'itemCode',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '实际工时（小时）',
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '完成状态',
      dataIndex: 'AssistantName',
      key: 'AssistantName',
      align: 'center',
      ellipsis: true,
      width: 110,
    },
    {
      title: '完成时间',
      dataIndex: 'AssistantName',
      key: 'AssistantName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'AssistantName',
      key: 'AssistantName',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
  ]
  //验收服务报告 和 工作记录 组件
  const ServiceReportWorkRecord = ({ serviceReportData, workRecordData }) => {
    return <>
      <TitleComponents text='验收服务报告' />
      <SdlTable
        resizable
        loading={false}
        scroll={{ x: 800 }}
        dataSource={serviceReportData}
        columns={acceptanceServicesCol}
        pagination={false}
      />
      {workRecordData && <div><TitleComponents text='工作记录' />
        <SdlTable
          resizable
          loading={false}
          scroll={{ x: 900 }}
          dataSource={workRecordData}
          columns={workRecordsCol}
          pagination={false}
        /></div>}
    </>
  }
  //通用表格组件  只需要替换验收服务报告照片字段的表格 例如项目交接单这种
  const CommonReplaceContent = ({ text, col, dataSource }) => {

    let columns = []
        columns = acceptanceServicesCol.map(item=>item)
        columns.splice(3, 1, col)
    return <>
      <TitleComponents text={text} />
      <SdlTable
        resizable
        loading={false}
        scroll={{ x: 800 }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </>
  }
  //前期勘查
  const EarlyStageCheck = () => <Form name="detail">
    <TitleComponents text='验收服务报告' />
    <Row>
      <Col span={8}>
        <Form.Item label="验收服务报告照片" >
          {data.Num}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="照片上传时间" >
          {data.Num}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="备注" >
          {data.Num}
        </Form.Item>
      </Col>
    </Row>
    <TitleComponents text='现场勘查信息' />
    <Row>
      <Col span={8}>
        <Form.Item label="现场勘查照片" >
          {data.Num}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="照片上传时间" >
          {data.Num}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="备注" >
          {data.Num}
        </Form.Item>
      </Col>
    </Row>
    <TitleComponents text='工作记录' />
    <Row>
      <Col span={8}>
        <Form.Item label="实际工作（小时）" >
          {data.Num}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="完成状态" >
          {data.Num}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="完成时间" >
          {data.Num}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="离开完成时间" >
          {data.Num}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="备注" >
          {data.Num}
        </Form.Item>
      </Col>
    </Row>
  </Form>
  //设备验货
  const EquipmentInspection = () =>
    <Form name="detail">
      <TitleComponents text='验收服务报告' />
      <Row>
        <Col span={8}>
          <Form.Item label="验收服务报告照片" >
            {/* {aa.map((item,index)=><img
              width={20}
              height={20}
              style={{cursor: 'pointer' }}
              src={`/upload/${item}`}
              onClick={() => {
                setIsOpen(true)
                setImageList(Content.PictureFilesList?.LowimgList.map(item => `/upload/${item}`))
                setImageIndex(index)
              }}
            />)
            } */}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="照片上传时间" >
            {data.Num}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="备注" >
            {data.Num}
          </Form.Item>
        </Col>
      </Row>
      <TitleComponents text='验货单' />
      <Row>
        <Col span={8}>
          <Form.Item label="验货单照片" >
            {data.Num}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="照片上传时间" >
            {data.Num}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="备注" >
            {data.Num}
          </Form.Item>
        </Col>
      </Row>
      <TitleComponents text='工作记录' />
      <Row>
        <Col span={8}>
          <Form.Item label="实际工时（小时）" >
            {data.Num}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="完成状态" >
            {data.Num}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="完成时间" >
            {data.Num}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="离开现场时间" >
            {data.Num}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="备注" >
            {data.Num}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  //指导安装
  const GuideInstallation = () => {

    return <Form name="detail">
      <ServiceReportWorkRecord serviceReportData={[]} workRecordData={[]} />
      <Form.Item label="离开现场时间">
        {data.Num}
      </Form.Item>
    </Form>
  }
  //静态调试

 const [installPhotosPageIndex,setInstallPhotosPageIndex] = useState(1);
  const [installPhotosPageSize,setInstallPhotosPageSize] = useState(8);
  const installPhotosTableChange = (PageIndex, PageSize) =>{
    setInstallPhotosPageSize(PageSize)
    setInstallPhotosPageIndex(PageIndex)
    // onFinish(PageIndex, PageSize)
  }

  const StaticDebugging = () => {
    const projectHandoverCol = {
      title: '项目交接单照片',
      dataIndex: 'itemCode',
      key: 'itemCode',
      align: 'center',
      ellipsis: true,
    }
    const installationReportCol = {
      title: '安装报告照片',
      dataIndex: 'itemCode',
      key: 'itemCode',
      align: 'center',
      ellipsis: true,
    }
    const rowSpanFun = (value, record,index) => {
      let obj = {
        children: <div>{value}</div>,
        props: { rowSpan: index==0? 8 : 0},
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
        dataIndex: 'Num',
        key: 'Num',
        align: 'center',
        ellipsis: true,
        width: 'auto',
        render: (text, record, index) => rowSpanFun(text, record,index)
      },
      {
        title: '监测点名称',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        align: 'center',
        ellipsis: true,
        width: 'auto',
        render: (text, record, index) => rowSpanFun(text, record,index)
      },
      {
        title: '安装项',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        align: 'center',
        ellipsis: true,
        width: 'auto',
      },
      {
        title: '安装报告照片',
        dataIndex: 'itemCode',
        key: 'itemCode',
        align: 'center',
        ellipsis: true,
        render: (text,record,index) => {
          const imgEle =  <a onClick={() => {
            setIsOpen(true)
            setImageList(row.PictureFilesList?.LowimgList.map(item => `/upload/${item}`))
            setImageIndex(0)
          }}>
            查看附件
            </a>

        }
  
      },
      {
        title: '照片上传时间',
        dataIndex: 'aa',
        key: 'aa',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '备注',
        dataIndex: 'AssistantName',
        key: 'AssistantName',
        align: 'center',
        ellipsis: true,
        width: 'auto',
      },
    ]
    return <Form name="detail">
      <ServiceReportWorkRecord serviceReportData={[]} />
      <CommonReplaceContent text='项目交接单' col={projectHandoverCol} dataSource={[]} />
      <CommonReplaceContent text='安装报告' col={installationReportCol} dataSource={[]} />
      <TitleComponents text='安装照片' />
      <SdlTable
        resizable
        loading={false}
        scroll={{ x: 850 }}
        rowClassName={null}
        dataSource={[{aa:'2023-08-10 12:56:25'},{aa:'2023-08-10 12:56:25'},{aa:'2023-08-10 12:56:25'},{aa:'2023-08-10 12:56:25'},{aa:'2023-08-10 12:56:25'},{aa:'2023-08-10 12:56:25'},{aa:'2023-08-10 12:56:25'},{aa:'2023-08-10 12:56:25'},{aa:'2023-08-10 12:56:25'},{aa:'2023-08-10 12:56:25'}]}
        columns={installationPhotosCol}
        pagination={{
          total: 11,
          pageSize: installPhotosPageSize,
          current: installPhotosPageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: installPhotosTableChange,
          pageSizeOptions:[8],
        }}
      />
    </Form>
  }
  const fillContentTabContent = {
    '前期勘查': <EarlyStageCheck />,
    '设备验货': <EquipmentInspection />,
    '指导安装': <GuideInstallation />,
    '静态调试': <StaticDebugging />,
    '动态投运': '',
    '168/试运行': '',
    '72小时调试检测': '',
    '联网': '',
    '比对监测': '',
    '项目验收': '',
    '配合检查': '',
    '维修': '',
    '培训': '',
    '其他': '',
  }
  const ServiceFillContent = () => {
    return <Tabs type='card'>
      {fillContentTab.map(item => <TabPane tab={item} key={item}> {fillContentTabContent[item]}</TabPane>)}
    </Tabs>
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
            {data.ApplicantUser}
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
            {data.CustomName}
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
            {data.Remark}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="服务属性" >
            {data.Attribute}
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
            {data.WorkerName}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="到达现场时间" >
            {data.ArriveDate}
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
          <Form.Item label="参与其他类核算" >
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
          <ServiceFillContent />
        </TabPane>
        <TabPane tab="服务派工申请单" key="2">
          <ServiceWorkContent />
        </TabPane>
      </Tabs>
      {/* 查看附件弹窗 */}
      <ImageView
        isOpen={isOpen}
        images={imageList.map(item => item.url)}
        imageIndex={imageIndex}
        onCloseRequest={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);