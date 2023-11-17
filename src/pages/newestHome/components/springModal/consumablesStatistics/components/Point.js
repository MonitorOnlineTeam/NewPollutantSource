/**
 * 功  能：耗材统计
 * 创建人：jab
 * 创建时间：2021.1.21
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

const namespace = 'consumablesStatistics'




const dvaPropsData = ({ loading, consumablesStatistics, global }) => ({
  tableDatas: consumablesStatistics.pointTableDatas,
  tableLoading: loading.effects[`${namespace}/pointGetConsumablesRIHList`],
  exportLoading: consumablesStatistics.exportPointLoading,
  clientHeight: global.clientHeight,
  queryPar: consumablesStatistics.queryPar,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    pointGetConsumablesRIHList: (payload) => { // 监测点详情
      dispatch({
        type: `${namespace}/pointGetConsumablesRIHList`,
        payload: payload,
      })
    },
    exportConsumablesRIHList: (payload) => { // 导出
      dispatch({
        type: `${namespace}/exportConsumablesRIHList`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [dates, setDates] = useState([]);
  const { tableDatas, tableLoading, exportLoading, clientHeight, type, time, queryPar } = props;


  useEffect(() => {
    initData();

  }, []);


  const initData = () => {
    props.pointGetConsumablesRIHList({
      ...queryPar,
      pointType: 3,
    })
  };


  const exports = async () => {
    props.exportConsumablesRIHList({
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
      title: '省',
      dataIndex: 'province',
      key: 'province',
      align: 'center',
      render: (text, record, index) => {
        if (text == '合计') {
          return { props: { colSpan: 0 }, };
        }
        return text;
      },
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
      render: (text, record, index) => {
        return { props: { colSpan: text == '合计' ? 2 : 1 }, children: text, };
      }
    },
    {
      title: '企业',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
    },
    {
      title: '备品备件更换数量',
      dataIndex: 'sparePartCount',
      key: 'sparePartCount',
      align: 'center',
    },
    {
      title: '易耗品更换数量',
      dataIndex: 'consumablesCount',
      key: 'consumablesCount',
      align: 'center',
    },
    {
      title: '试剂更换数量',
      dataIndex: 'standardLiquidCount',
      key: 'standardLiquidCount',
      align: 'center',
    },
  ]

  queryPar.pollutantType == 2 && columns.splice(-1, 1,
    {
      title: '标准气体更换数量',
      dataIndex: 'standardGasCount',
      key: 'standardGasCount',
      align: 'center',
    })

  return (
    <div className={styles.consumablesStatisticsSty}>

      <Form.Item style={{ paddingBottom: '16px' }}>
        <Button icon={<ExportOutlined />} loading={exportLoading} style={{ margin: '0 8px', }} onClick={() => { exports() }}>
          导出
    </Button>
      </Form.Item>
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