/**
 * 功  能：项目执行进度 / 现场签到统计
 * 创建人：jab
 * 创建时间：2024.02.26
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
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

import Detail from './Detail'
const { Option } = Select; 

const namespace = 'siteAttendanceStatistics'




const dvaPropsData = ({ loading, siteAttendanceStatistics, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetSignInAnalysis`],
  tableDatas: siteAttendanceStatistics.tableDatas,
  queryPar: siteAttendanceStatistics.queryPar,
  exportLoading: loading.effects[`${namespace}/ExportSignInAnalysis`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetSignInAnalysis: (payload) => { //列表
      dispatch({
        type: `${namespace}/GetSignInAnalysis`,
        payload: payload,
      })
    },
    ExportSignInAnalysis: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportSignInAnalysis`,
        payload: payload,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();



  const { tableDatas,  tableLoading, exportLoading,queryPar,  } = props;



  useEffect(() => {
    onFinish();

  }, []);
  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1);
      }
    },
    {
      title: '省',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
      width:'auto',
      ellipsis: true,
      render: (text, record) => {
        return (
             <a onClick={() => {detail(record)}}>
             {text}
            </a>
        );

      }
    },
    {
      title: '现场工作时长（小时）',
      dataIndex: 'Workhours',
      key: 'Workhours',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '签到异常次数（缺卡次数）',
      dataIndex: 'noSing',
      key: 'noSing',
      align: 'center',
      width:'auto',
      ellipsis: true,
    }
  ];
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailTitle, setDetailTitle] = useState('详情')
  const [detailCode, setDetailCode] = useState()

  const detail = (record) => {
    setDetailVisible(true)
    setDetailTitle(`${record.RegionName}（${queryPar.bTime&&moment(queryPar.bTime).format('YYYY-MM-DD')} ~ ${queryPar.eTime&&moment(queryPar.eTime).format('YYYY-MM-DD')}）`)
    setDetailCode(record.RegionCode)
  }
  const exports = async () => {
    props.ExportSignInAnalysis({
      ...queryPar
    })
  };


  const onFinish = async () => {  //查询

    try {
      const values =   await form.validateFields();
      props.GetSignInAnalysis({
        ...values,
        bTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }



  const searchComponents = () => {
    return <Form
      form={form}
      layout='inline'
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => {onFinish() }}
      initialValues={{
        time:[moment(new Date()).add(-1, 'day').startOf('day'),moment(new Date()).add(-1, 'day').endOf('day')]
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
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading} style={{marginRight:8}}>
              查询
         </Button>
         <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
          导出
         </Button>
          </Form.Item>
    </Form>
  }
  return (
    <div className={styles.siteAttendanceStatisticsSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            scroll={{x:680}}
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
        <Detail  detailCode={detailCode}/>
      </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);