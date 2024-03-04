/**
 * 功  能：设备完好率
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
  coommonCol2: equipmentAbnormalRate.coommonCol2,
  failcoommonCol2: equipmentAbnormalRate.failcoommonCol2,
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
  const { tableDatas, tableLoading, exportLoading, clientHeight, type, time, queryPar, coommonCol,coommonCol2,failcoommonCol2,operationSetType,deviceType } = props;


  useEffect(() => {
    initData();

  }, []);


  const initData = () => {
    props.pointGetExecptionRateList({
      ...queryPar,
      pointType: 3,
      entName:entName,
      type:operationSetType,
    })
  };


  const exports = async () => {
    props.exportExecptionRateList({
      ...queryPar,
      pointType: 3,
      type:operationSetType,
      taskType: deviceType
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
  const assessmentCentreCol =  deviceType == 1 ? coommonCol2 : failcoommonCol2
  const columns2 = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '省',
      dataIndex: 'provinceName',
      key: 'provinceName',
      align: 'center',
      render: (text, record, index) => {
        if (text == '全部合计') {
          return { props: { colSpan: 0 }, };
        }
        return text;
      },
    },
    {
      title: '市',
      dataIndex: 'cityName',
      key: 'cityName',
      align: 'center',
      render: (text, record) => {
        const name = record.provinceName == '全部合计' ? '全部合计' : text
        return {
          props: { colSpan: record.provinceName == '全部合计' ? 2 : 1 },
          children: name
        }

      }
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
    },
    {
      title: '站点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',

    },
    ...assessmentCentreCol
  ]
  const [entName,setEntName ] = useState()
  return (
    <div>
       
       <Form layout='inline'>
      <Form.Item>
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
        columns={operationSetType==1? columns2 : columns}
        scroll={{ y: clientHeight - 500 }}
        pagination={false}
      />
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);