/**
 * 功  能：项目执行进度 / 现场签到统计 详情内容
 * 创建人：jab
 * 创建时间：2024.02.26
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Pagination, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Tabs, Spin, Empty } from 'antd';
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
import { uploadPrefix } from '@/config'
import styles from "./style.less"
const { Option } = Select;
const { TabPane } = Tabs;

const namespace = 'siteAttendanceStatistics'




const dvaPropsData = ({ loading, siteAttendanceStatistics }) => ({
  tableLoading: loading.effects[`${namespace}/GetSignInAnalysisInfo`],
  tableDatas: siteAttendanceStatistics.tableDetailDatas,
  tableTotal: siteAttendanceStatistics.tableDetailTotal,
  detailQueryPar:siteAttendanceStatistics.detailQueryPar,
  queryPar:siteAttendanceStatistics.queryPar,
  configInfo: global.configInfo,
  exportLoading: loading.effects[`${namespace}/ExportSignInAnalysisInfo`],

})

const dvaDispatch = (dispatch) => {
  return {
    GetSignInAnalysisInfo: (payload) => { //列表
      dispatch({
        type: `${namespace}/GetSignInAnalysisInfo`,
        payload: payload,
      })
    },
    ExportSignInAnalysisInfo: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportSignInAnalysisInfo`,
        payload: payload,
      })
    },


  }
}
const Index = (props) => {


  const [form] = Form.useForm();


  const {queryPar, detailCode, tableDatas, tableTotal,  tableLoading, exportLoading, detailQueryPar, } = props;


  useEffect(() => {
    onFinish(pageIndex,pageSize);
  }, []);

  const rowSpanFun = (text,record) =>{
    let obj = {
      children: <div>{text}</div>,
      props: { rowSpan: Number(record.count)},
    };
    return obj;
  }

    const columns = [ 
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render:(text, record, index)=>index + 1
      },
      {
        title: '企业名称',
        dataIndex: 'EntName',
        key: 'EntName',
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
        title: '立项号',
        dataIndex: 'ItemCode',
        key: 'ItemCode',
        align: 'center',
        ellipsis: true,

      },
      {
        title: '省份',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        align: 'center',
        ellipsis: true,

      },
      {
        title: '市',
        dataIndex: 'CityName',
        key: 'CityName',
        align: 'center',
        ellipsis: true,

      },
      {
        title: '成套人员',
        dataIndex: 'UserName',
        key: 'UserName',
        align: 'center',
        ellipsis: true,

      },
      {
        title: '工号',
        dataIndex: 'UserAccount',
        key: 'UserAccount',
        align: 'center',
        ellipsis: true,

      },
      {
        title: '签到起始时间',
        dataIndex: 'SinTime',
        key: 'SinTime',
        align: 'center',
        ellipsis: true,
        width:140,

      },
      {
        title: '起始时间签到结果',
        dataIndex: 'SinStatus',
        key: 'SinStatus',
        align: 'center',
        ellipsis: true,
        render:(text, record, index)=>{
         return text==='缺卡'? <span className='red'>{text}</span> : text
        }
      },
      {
        title: '签到结束时间',
        dataIndex: 'OutTime',
        key: 'OutTime',
        align: 'center',
        ellipsis: true,
        width:140,

      },
      {
        title: '结束时间签到结果',
        dataIndex: 'OutStatus',
        key: 'OutStatus',
        align: 'center',
        ellipsis: true,
        render:(text, record, index)=>{
          return text==='缺卡'? <span className='red'>{text}</span> : text
        }
      },
      {
        title: '现场工作时长(小时)',
        dataIndex: 'Workhours',
        key: 'Workhours',
        align: 'center',
        ellipsis: true,
        width:140,
        render:(text, record, index)=>rowSpanFun(text, record)

      },
      {
        title: '签到异常次数(缺卡次数)',
        dataIndex: 'Num',
        key: 'Num',
        align: 'center',
        ellipsis: true,
        width:160,

      },
    ]
    const onFinish = async (pageIndex,pageSize,detailQueryPar) => {  //查询

      try {
        const values =  await form.validateFields();
        if(values.userName || values.userAccount || values.entName || values.projectCode || values.itemCode){
         setPageSize(10)
         pageSize = 10;
        }else{
          pageSize = pageSize; 
        }
        props.GetSignInAnalysisInfo(detailQueryPar?{...detailQueryPar,pageIndex:pageIndex,pageSize:pageSize}: {
          ...values,
          pageIndex: pageIndex,
          pageSize: pageSize,
          regionCode:detailCode,
          bTime: queryPar.bTime,
          eTime: queryPar.eTime,
        })
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
      }
    }


    const searchComponents = () => {
      return <Form
        form={form}
        name="advanced_search"
        className={styles['ant-advanced-search-form']}
        onFinish={() => {setPageIndex(1); onFinish(1, pageSize) }}
      >
        <Row align='middle'>
          <Col span={8}>
            <Form.Item name='userName' label='成套人员'>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item name='userAccount' label='工号' className='minWidth' >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='entName' label='企业名称' >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='projectCode' label='合同编号' >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='itemCode' label='立项号'>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={tableLoading}>
                查询
           </Button>
              <Button style={{margin: '0 8px',}} onClick={() => { form.resetFields(); }}  >
                重置
           </Button>
           <Button icon={<ExportOutlined />} loading={exportLoading} style={{ marginRight: 8, }} onClick={() => { exports() }}>
            导出
           </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    }
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(1)
    const handleTableChange = async (PageIndex, PageSize) => { //分页
      setPageSize(PageSize)
      setPageIndex(PageIndex)
      onFinish(PageIndex, PageSize,detailQueryPar)
    }
  

    const exports = async () => {
      props.ExportSignInAnalysisInfo({
        ...detailQueryPar
      })
    };
  
  return (
    <div>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            rowClassName={null}
            dataSource={tableDatas}
            columns={columns}
            scroll={{y:'calc(100vh - 350px)'}}
            pagination={false}
          />            
        {tableTotal? <div style={{ textAlign: 'right', marginTop: 8 }}>
          <Pagination
              size="small"
              showQuickJumper
              showSizeChanger
              total={tableTotal}
              pageSize={pageSize}
              current={pageIndex}
              onChange={handleTableChange}
              pageSizeOptions={[1,2,5,10]}
          />
      </div> : null}
        </Card>

    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);