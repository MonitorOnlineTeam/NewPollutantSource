/**
 * 功  能：绩效排名 / 现场签到统计
 * 创建人：jab
 * 创建时间：2024.02.27
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card,Spin, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
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
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

import RegionDetail from './RegionDetail'

const { Option } = Select;

const namespace = 'operationSiteAttendanceStatistics'


const dvaPropsData = ({ loading, operationSiteAttendanceStatistics, global, }) => ({
  tableLoading: operationSiteAttendanceStatistics.tableLoading,
  tableDatas: operationSiteAttendanceStatistics.tableDatas,
  queryPar: operationSiteAttendanceStatistics.queryPar,
  exportLoading: operationSiteAttendanceStatistics.exportLoading,
  signInTypeLoading: loading.effects[`${namespace}/GetSignInType`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
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
    GetSignInType: (payload,callback) => { //打卡类型
      dispatch({
        type: `${namespace}/GetSignInType`,
        payload: payload,
        callback:callback,
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();



  const { tableDatas, tableLoading, exportLoading, queryPar, signInTypeLoading } = props;


 const [signInType,setSignInType] = useState([])
  useEffect(() => {
    onFinish();
    props.GetSignInType({},(res)=>{
      res?.childList&&setSignInType(res?.childList)
    })
  }, []);

  const rowSpanFun = (text, record) => {
    let obj = {
      children: <div>{text}</div>,
      props: { rowSpan: record.count },
    };
    return obj;
  }
  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => index + 1
    },
    {
      title: '监测类型',
      dataIndex: 'pollutantTypeName',
      key: 'pollutantTypeName',
      align: 'center',
      width: 'auto',
      ellipsis: true,
      render: (text, record, index) => {
        return { children: text, props: { colSpan: text == '全部合计'? 0 : 1, rowSpan: record.pcol }, };
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
        const data = <a onClick={() => { detail(record) }}> {text} </a>
        return { children: data, props: { colSpan: text == '全部合计'? 3 : 1,rowSpan: record.col }, };
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
  ];
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailTitle, setDetailTitle] = useState('详情')
  const [regionDetailCode, setRegionDetailCode] = useState()

  const detail = (record) => {
    setDetailVisible(true)
    setDetailTitle(`${record.provinceName}（${queryPar.beginTime && moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar.endTime && moment(queryPar.endTime).format('YYYY-MM-DD')}）`)
    setRegionDetailCode(record.RegionCode? record.RegionCode : queryPar.regionCode )
  }
  const exports = async () => {
    props.ExportSignInList({
      ...queryPar
    })
  };


  const onFinish =  () => {  //查询

      const values =  form.getFieldsValue();
      props.GetSignInList({
        ...values,
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        pointType: 1
      })
  }



  const searchComponents = () => {
    return <Form
      form={form}
      layout='inline'
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { onFinish() }}
      initialValues={{
        time: [moment(new Date()).add(-7, 'day').startOf('day'), moment(new Date()).endOf('day')]
      }}
    >
      <Form.Item label="日期" name="time">
        <RangePicker_
          allowClear={false}
          style={{ width: 380 }}
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }}
        />
      </Form.Item>
      <Form.Item name='regionCode' label='省份' >
        <RegionList levelNum={1} style={{ width: 170 }} />
      </Form.Item>
      <Form.Item name='pollutantType' label='监测类型' >
        <Select placeholder='请选择' style={{ width: 160 }} allowClear>
          <Option value={2}>污染源（废气）</Option>
          <Option value={1}>污染源（废水）</Option>
          <Option value={3}>污染源（废气废水）</Option>
        </Select>

      </Form.Item>
      <Spin spinning={signInTypeLoading} size='small' className='formItemSpinSty'>
      <Form.Item name='workType' label='工作类型' >
        <Select placeholder='请选择' style={{ width: 140 }} allowClear>
         {signInType.map(item=> <Option value={item.ChildID}>{item.Name}</Option>)}
        </Select>
      </Form.Item>
      </Spin>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={tableLoading} style={{ marginRight: 8 }}>
          查询
         </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
          导出
         </Button>
      </Form.Item>
    </Form >
  }
return (
  <div className={styles.operationSiteAttendanceStatisticsSty}>
    <BreadcrumbWrapper>
      <Card title={searchComponents()}>
        <SdlTable
          resizable
          loading={tableLoading}
          bordered
          rowClassName={null}
          dataSource={tableDatas}
          columns={columns}
          scroll={{ x: 880 }}
          pagination={false}
        />
      </Card>
      <Modal
        visible={detailVisible}
        title={detailTitle}
        onCancel={() => { setDetailVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal ${styles.detailModalSty}`}
      >
        <RegionDetail regionDetailCode={regionDetailCode} />
      </Modal>
    </BreadcrumbWrapper>
  </div>
);
};
export default connect(dvaPropsData, dvaDispatch)(Index);