/**
 * 功  能：绩效排名 / 现场签到统计  省份详情内容
 * 创建人：jab
 * 创建时间：2024.02.27
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
import moment from 'moment';
import { getAttachmentDataSource } from '@/pages/AutoFormManager/utils';
import AttachmentView from '@/components/AttachmentView';
import { uploadPrefix } from '@/config'
import styles from "./style.less"
import CityDetail from './CityDetail'

const { Option } = Select;
const { TabPane } = Tabs;

const namespace = 'operationSiteAttendanceStatistics'


const dvaPropsData = ({ loading, operationSiteAttendanceStatistics }) => ({
  tableLoading:operationSiteAttendanceStatistics.regDetaiLoading,
  tableDatas: operationSiteAttendanceStatistics.regDetailDatas,
  tableTotal: operationSiteAttendanceStatistics.regDetailTotal,
  regDetailQueryPar: operationSiteAttendanceStatistics.regDetailQueryPar,
  configInfo: global.configInfo,
  exportLoading:operationSiteAttendanceStatistics.regDetailExportLoading,
  queryPar:operationSiteAttendanceStatistics.queryPar,
})

const dvaDispatch = (dispatch) => {
  return {
    GetSignInList: (payload) => { //列表
      dispatch({
        type: `${namespace}/GetSignInList`,
        payload: payload,
      })
    },
    ExportSignInList: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportSignInList`,
        payload: payload,
      })
    },


  }
}
const Index = (props) => {


  const [form] = Form.useForm();


  const {queryPar, tableDatas, tableTotal,  tableLoading, exportLoading,regDetailQueryPar} = props;


  useEffect(() => {
    onFinish(pageIndex,pageSize);
  }, []);


    const columns = [ 
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render:(text, record, index)=>(index + 1) + (pageIndex - 1) * pageSize
      },
      {
        title: '监测类型',
        dataIndex: 'pollutantTypeName',
        key: 'pollutantTypeName',
        align: 'center',
        width: 'auto',
        ellipsis: true,
        render: (text, record, index) => {
          if (text == '全部合计') {
            return { children: text, props: { colSpan: 0 }, };
          } else {
            return text
          }
        }
      },
      {
        title: '工作类型',
        dataIndex: 'workTypeName',
        key: 'workTypeName',
        align: 'center',
        width: 'auto',
        ellipsis: true,
        render: (text, record, index) => {
          if (text == '全部合计') {
            return { children: text, props: { colSpan: 0 }, };
          } else {
            return text
          }
        }
      },
      {
        title: '省',
        dataIndex: 'provinceName',
        key: 'provinceName',
        align: 'center',
        width: 'auto',
        ellipsis: true,
        render: (text, record) => {
          return <a onClick={() => { detail(record,1) }}> {text} </a>
        }
      },
      {
        title: '市',
        dataIndex: 'cityName',
        key: 'cityName',
        align: 'center',
        width: 'auto',
        ellipsis: true,
        render: (text, record) => {
          const data = <a onClick={() => { detail(record,2) }}> {text} </a>
          if (text == '全部合计') {
            return { children: data, props: { colSpan: 4 }, };
          } else {
            return data
          }
  
        }
      },
      {
        title: '现场工作时长（小时）',
        dataIndex: 'workTime',
        key: 'workTime',
        align: 'center',
        width: 'auto',
        ellipsis: true,
      },
      {
        title: '签到异常次数（缺卡次数）',
        dataIndex: 'exceptCount',
        key: 'exceptCount',
        align: 'center',
        width: 'auto',
        ellipsis: true,
      }
    ]
    const onFinish = async (pageIndex,pageSize) => {  //查询

      try {
        const values =  await form.validateFields();
        props.GetSignInList({
          ...values,
          pageIndex: pageIndex,
          pageSize: pageSize,
          ...queryPar,
          regionCode:props.regionDetailCode,
          pointType:2
        })
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
      }
    }
    const [detailVisible, setDetailVisible] = useState(false)
    const [detailTitle, setDetailTitle] = useState('详情')
    const [cityDetailCode, setCityDetailCode] = useState()
    const [workType, setWorkType] = useState()
  
    const detail = (record,type) => {
      setDetailVisible(true)
      let name, code;
      if(type==1){
        name = record.provinceName;code = record.provinceCode;
      }else{
        name = `${record.provinceName}-${record.cityName}`;code = record.cityCode;

      }
      setDetailTitle(`${name}（${queryPar.beginTime && moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar.endTime && moment(queryPar.endTime).format('YYYY-MM-DD')}）`)
      setCityDetailCode(code? code : queryPar.regionCode )
      setWorkType(record.workType)
    }

    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const handleTableChange = async (PageIndex, PageSize) => { //分页
      setPageSize(PageSize)
      setPageIndex(PageIndex)
      onFinish(PageIndex, PageSize)
    }
  

    const exports = async () => {
      props.ExportSignInList({
        ...regDetailQueryPar,
         pageIndex: undefined,
         pageSize: undefined
      })
    };
  
    const searchComponents = () => {
      return  <Button icon={<ExportOutlined />} loading={exportLoading} style={{ marginRight: 8, }} onClick={() => { exports() }}>
               导出
             </Button>
 
    }
  return (
    <div>
        <div style={{marginBottom:12}}>{searchComponents()}</div>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={{ 
            showSizeChanger:true,
            showQuickJumper:true,
            total:tableTotal,
            pageSize:pageSize,
            current:pageIndex,
            onChange:handleTableChange
           }}
          />            
        
        <Modal
        visible={detailVisible}
        title={detailTitle}
        onCancel={() => { setDetailVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal ${styles.detailModalSty}`}
      >
        <CityDetail cityDetailCode={cityDetailCode} workType={workType}/>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);