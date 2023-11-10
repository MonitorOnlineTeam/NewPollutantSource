/**
 * 功  能：成套 项目查询
 * 创建人：jab
 * 创建时间：2023.09.11
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "./style.less"
import Cookie from 'js-cookie';
import SdlMap from '@/pages/AutoFormManager/SdlMap'
import Detail from './Detail'
import TreeTransfer from '@/components/TreeTransfer'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { permissionButton } from '@/utils/utils';
const { Option } = Select;

const namespace = 'ctProjectQuery'

const dvaPropsData = ({ loading, ctProjectQuery, global, common }) => ({
  tableLoading: loading.effects[`common/getCTProjectList`],
  tableDatas: common.ctProjectList,
  tableTotal: common.ctProjectTotal,
  queryPar: common.ctProjectQueryPar,
  entAndPoint: common.ctEntAndPointList,
  loadingConfirm: loading.effects[`${namespace}/updateCTProject`],
  exportLoading: loading.effects[`${namespace}/exportCTProjectList`],
  entAndPointLoading: loading.effects[`common/getCtEntAndPointList`] || false,
  rojectPointRelationLoading: loading.effects[`${namespace}/getrojectPointRelationList`] || false,
  addProjectPointRelationLoading: loading.effects[`${namespace}/addProjectPointRelation`] || false,
  configInfo: global.configInfo,
  clientHeight: global.clientHeight,
  checkPoint:ctProjectQuery.checkPoint,
  permisBtnTip:global.permisBtnTip,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `common/updateState`,
        payload: payload,
      })
    },
    getProjectInfoList: (payload) => { //项目查询列表
      dispatch({
        type: `common/getCTProjectList`,
        payload: payload,
      })
    },
    updateCTProject: (payload, callback) => { //修改
      dispatch({
        type: `${namespace}/updateCTProject`,
        payload: payload,
        callback: callback
      })
    },
    getrojectPointRelationList: (payload, callback) => { //获取项目与站点管理关系
      dispatch({
        type: `${namespace}/getrojectPointRelationList`,
        payload: payload,
        callback: callback
      })
    },
    addProjectPointRelation: (payload, callback) => { //添加成套项目与站点关联关系
      dispatch({
        type: `${namespace}/addProjectPointRelation`,
        payload: payload,
        callback: callback
      })
    },
    getEntAndPoint: (payload, callback) => { //企业监测点
      dispatch({
        type: `common/getCtEntAndPointList`,
        payload: payload,
        callback: callback
      })
    },
    exportProjectInfoList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportCTProjectList`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [expand, setExpand] = useState(false)
  const [fromVisible, setFromVisible] = useState(false)
  const [tableVisible, setTableVisible] = useState(false)

  const { tableDatas, tableTotal, loadingConfirm, tableLoading, exportLoading, queryPar, entAndPointLoading, entAndPoint, rojectPointRelationLoading, addProjectPointRelationLoading,checkPoint, } = props;

  // const [editPermisPoint,setPermisEditPoint] = useState(false)
  const [associaePermisPoint,setAssociaePermisPoint] = useState(false)

  useEffect(() => {
    const buttonList = permissionButton(props.match.path)
    buttonList.map(item=>{
      switch (item){
        case 'oprationPoint':  setAssociaePermisPoint(true); break;
        // case 'addPoint': setPermisEditPoint(true); break;
      }
    })
    onFinish(pageIndex, pageSize);
  }, []);


  let columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '服务流水号',
      dataIndex: 'SerialNum',
      key: 'SerialNum',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同签订人',
      dataIndex: 'SignName',
      key: 'SignName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '立项号',
      dataIndex: 'ItemCode',
      key: 'ItemCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '签约客户名称',
      dataIndex: 'CustomName',
      key: 'CustomName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '最终用户单位',
      dataIndex: 'CustomEnt',
      key: 'CustomEnt',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同类型',
      dataIndex: 'ProjectType',
      key: 'ProjectType',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '项目所在省',
      dataIndex: 'Province',
      key: 'Province',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '提供服务大区',
      dataIndex: 'Region',
      key: 'Region',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目负责人',
      dataIndex: 'Director',
      key: 'Director',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目所属行业',
      dataIndex: 'Industry',
      key: 'Industry',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同服务天数',
      dataIndex: 'ProjectDays',
      key: 'ProjectDays',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '经度',
      dataIndex: 'Longitude',
      key: 'Longitude',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '纬度',
      dataIndex: 'Latitude',
      key: 'Latitude',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '电子围栏（KM）',
      dataIndex: 'Range',
      key: 'Range',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目点位数量',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'CreateUser',
      key: 'CreateUser',
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
      dataIndex: 'UpdateUser',
      key: 'UpdateUser',
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
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 180,
      ellipsis: true,
      render: (text, record) => {
        return <span>
          {/* {editPermisPoint&&<Fragment><Tooltip title={'编辑'}> <a onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>} */}
          <Fragment> <Tooltip title="详情">
            <a onClick={() => detail(record)}  ><DetailIcon /></a>
          </Tooltip></Fragment>
          {associaePermisPoint&&<Fragment><Divider type="vertical" /><Tooltip title={"关联监测点"} >  <a onClick={() => { associaePoint(record) }} ><PointIcon /></a></Tooltip></Fragment>}

        </span>
      }
    },
  ];
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailTitle, setDetailTitle] = useState('详情')
  const [detailData, setDetailData] = useState()

  const detail = (record) => {
    setDetailVisible(true)
    setDetailTitle(`${record.ProjectCode? `${record.ProjectCode}-详情` : record.ItemCode ? `${record.ItemCode}-详情` : '详情'}`)
    setDetailData(record)
  }
  
 

  const [editTitle, setEditTitle] = useState('')
  const edit = async (record) => {
    setFromVisible(true)
    setEditTitle(`${record.ProjectCode} - 编辑`)
    form2.resetFields();
    try {
      form2.setFieldsValue({
        latitude: record.Latitude,
        longitude: record.Longitude,
        range: record.Range? record.Range : 3,
        id: record.ID,
      })
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };


  const [projectCode, setProjectCode] = useState();
  const [projectID, setProjectID] = useState();
  const [associaePointVisible, setAssociaePointVisible] = useState(false);
  const associaePoint = (record) => { //关联监测点
    setAssociaePointVisible(true)
    setProjectCode(record.ProjectCode)
    setProjectID(record.ID)
    getrojectPointRelationListQues(record.ID)
    props.getEntAndPoint({ regionCode: '', entName: '', })
  };


  const exports = async () => {
    const values = await form.validateFields();
    props.exportProjectInfoList({
      ...values,
      beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'), 
      endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'), 
      time: undefined,

    })
  };


  const onFinish = async (PageIndex, PageSize, queryPar) => {  //查询
    
    try {
      const values = await form.validateFields();
      const par = queryPar ? queryPar :
        { ...values, beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'), endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'), time: undefined, }
        props.getProjectInfoList({
        ...par,
        pageIndex: PageIndex,
        pageSize: PageSize,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();
      props.updateCTProject({
        ...values,
      }, () => {
        setFromVisible(false)
        onFinish(pageIndex, pageSize)
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize, queryPar)
  }
  
  const getrojectPointRelationListQues = (projectID) =>{
    props.getrojectPointRelationList({ projectID: projectID, },(res)=>{
      const keys = res.map(item=>item.DGIMN)
      setCheckedKeys(keys)
    })
  }

  const [regionCode, setRegionCode] = useState('')
  const [entPointName, setEntPointName] = useState()
  const handlePointQuery = () => {
    getrojectPointRelationListQues(projectID)
    props.getEntAndPoint({ regionCode: regionCode, entName: entPointName, })

  }
  //关联监测点 提交

  const [checkedKeys, setCheckedKeys] = useState([])
  const handlePointOK = (checkedKeys, state, callback) => {
    entAndPoint.map(item=>{
      if(checkedKeys.includes(item.key)){
        checkedKeys = checkedKeys.filter(filterItem => filterItem !== item.key); 
      }
    })
    props.addProjectPointRelation({projectID:projectID, dgimn: checkedKeys, state: state }, () => { callback() })
  }



  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { onFinish(pageIndex, pageSize) }}
      initialValues={{
        time: [moment().clone().startOf('month'), moment().clone().endOf('month')],
      }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='time' label='运维日期' >
            <RangePicker_ style={{ width: '100%' }}
              showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='projectName' label='项目名称'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        {expand && <>
          <Col span={8} className={'minWidth'} >
            <Form.Item name='projectCode' label='合同编号' >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='itemCode' label='立项号'>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='projectType' label='合同类型' >
              {/* <Select placeholder='请选择' allowClear>
                <Option></Option>
              </Select> */}
              <Input placeholder='请输入' allowClear/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='region' label='提供服务大区' >
              {/* <Select placeholder='请选择' allowClear>
                <Option></Option>
              </Select> */}
              <Input placeholder='请输入' allowClear/>
            </Form.Item>
          </Col>

        </>}
        <Col span={8} >
          <Form.Item style={{ marginLeft: expand ? 0 : 16 }}>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button onClick={() => { form.resetFields(); }} style={{ margin: '0 8px' }}  >
              重置
         </Button>
            <Button icon={<ExportOutlined />} loading={exportLoading} style={{ marginRight: 8 }} onClick={() => { exports() }}>
              导出
         </Button>
            <a onClick={() => { setExpand(!expand); }} >
              {expand ? <>收起 <UpOutlined /></> : <>展开 <DownOutlined /></>}
            </a>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  return (
    <div className={styles.ctProjectQuerySty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            scroll={{ y: expand ? 'calc(100vh - 374px)' : 'calc(100vh - 294px)' }}
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

      <Modal
        title={editTitle}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={loadingConfirm}
        onCancel={() => { setFromVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
        centered
      >
        <Form
          name="basic"
          form={form2}
        >

          <Row>
            <Col span={12}>
              <Form.Item label="经度" name="longitude" rules={[{ required: true, message: '请输入经度!', },]} >
                <SdlMap
                  longitude={form2.getFieldValue('longitude') ? form2.getFieldValue('longitude') : null}
                  latitude={form2.getFieldValue('latitude') ? form2.getFieldValue('latitude') : null}
                  onOk={map => {
                    form2.setFieldsValue({ longitude: map.longitude, latitude: map.latitude });
                  }}
                  handleMarker
                  zoom={12}
                  placeholder='请输入 例如：112.236514'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="纬度" name="latitude" rules={[{ required: true, message: '请输入纬度!', },]} >
                <SdlMap
                  longitude={form2.getFieldValue('longitude') ? form2.getFieldValue('longitude') : null}
                  latitude={form2.getFieldValue('latitude') ? form2.getFieldValue('latitude') : null}
                  onOk={map => {
                    form2.setFieldsValue({ longitude: map.longitude, latitude: map.latitude });
                  }}
                  handleMarker
                  zoom={12}
                  placeholder='请输入 例如：112.236514'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="电子围栏半径（KM）" name="range" rules={[{ required: true, message: '请输入电子围栏半径!', },]} >
                <InputNumber placeholder='请输入' allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={detailVisible}
        title={detailTitle}
        onCancel={() => { setDetailVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName='spreadOverModal'
      >
        <Detail data={detailData ? detailData : {}} />
      </Modal>
      <Modal
        title={`${projectCode} - 关联监测点`}
        visible={associaePointVisible}
        destroyOnClose={true}
        onCancel={() => { setAssociaePointVisible(false) }}
        width={1100}
        footer={null}
        bodyStyle={{
          overflowY: 'auto',
          maxHeight: props.clientHeight - 240,
        }}

      >
        {

          <div>
            <Row style={{ background: '#fff', paddingBottom: 10, zIndex: 1 }}>
              <RegionList style={{ width: 200 }} placeholder='请选择行政区' changeRegion={(value) => { setRegionCode(value) }} />
              <Input.Group compact style={{ width: 290, marginLeft: 16, display: 'inline-block' }}>
                <Input style={{ width: 200 }} allowClear placeholder='请输入企业名称' onBlur={(e) => setEntPointName(e.target.value)} />
                <Button type="primary" loading={entAndPointLoading} onClick={handlePointQuery}>查询</Button>
              </Input.Group>
            </Row>
            
            <Spin spinning={entAndPointLoading || rojectPointRelationLoading || addProjectPointRelationLoading  }>
              {entAndPoint?.length > 0 && (!entAndPointLoading) && (!rojectPointRelationLoading) ?
                <TreeTransfer
                  key="key"
                  // permission={!associaePermisPoint}
                  treeData={entAndPoint}
                  checkedKeys={checkedKeys}
                  targetKeysChange={(key, type, callback) => {
                    // setCheckedKeys(key)
                    handlePointOK(key, type == 1 ? 1 : 2, callback)
                  }
                  } 
                  />
                :
                <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </Spin>
          </div>
        }
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);