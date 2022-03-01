/**
 * 功  能：设备异常率
 * 创建人：jab
 * 创建时间：2021.2.24
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'equipmentAbnormalRate'




const dvaPropsData = ({ loading, equipmentAbnormalRate, global }) => ({
  tableDatas: equipmentAbnormalRate.pointTableDatas,
  tableLoading: loading.effects[`${namespace}/pointGetExecptionRateList`],
  exportLoading: equipmentAbnormalRate.exportPointLoading,
  clientHeight: global.clientHeight,
  queryPar: equipmentAbnormalRate.queryPar,
  coommonCol: equipmentAbnormalRate.coommonCol,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    pointGetExecptionRateList: (payload) => { // 监测点详情
      dispatch({
        type: `${namespace}/pointGetExecptionRateList`,
        payload: payload,
      })
    },
    exportExecptionRateList:(payload)=>{ // 导出
      dispatch({
        type: `${namespace}/exportExecptionRateList`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [dates, setDates] = useState([]);
  const { tableDatas, tableLoading, exportLoading, clientHeight, type, time, queryPar, coommonCol } = props;


  useEffect(() => {
    initData();

  }, []);


  const initData = () => {
    props.pointGetExecptionRateList({
      ...props.queryPar,
      pointType: 3,
      entName:entName
    })
  };


  const exports = async () => {
    props.exportExecptionRateList({
      ...queryPar,
      pointType: 3,
    })

  };
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '省/市',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }} >{text}</div>
      }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
    },
    ...coommonCol
  ]

  const [entName,setEntName ] = useState()
  return (
    <div className={styles.equipmentAbnormalRateSty}>
       
       <Form layout='inline'>
      <Form.Item style={{ paddingBottom: '16px' }}>
        <Input placeholder='请输入企业名称' allowClear onChange={(e) => { setEntName(e.target.value) }} />
        </Form.Item>
        <Form.Item style={{ paddingBottom: '16px' }}>
        <Button type='primary' loading={tableLoading} style={{ margin: '0 8px', }} onClick={() => { initData() }}>
          查询
     </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
          导出
    </Button>
      </Form.Item>
      </Form>
      <SdlTable
        loading={tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        scroll={{ y: clientHeight - 500 }}
        pagination={false}
      />
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);