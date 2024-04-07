/**
 * 功  能：派单详情内容
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import Detail from '@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery/detail'
import styles from '@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery/style.less'

const { Option } = Select; 

const namespace = 'ctCommon'


const dvaPropsData = ({ loading, global, }) => ({

})


const Index = (props) => {



    const [detailVisible, setDetailVisible] = useState(false)
    const [detailTitle, setDetailTitle] = useState()
  
    const detail = (record) => {
      setDetailVisible(true)
      setDetailTitle(`${record.Num}${record.ProjectCode? ` - ${record.ProjectCode}` : record.ItemCode ? ` - ${record.ItemCode}` : ''}`)
    }

  useEffect(() => {

  }, []);

  const {text,size,style,data} = props;
  return (<>
     <Button type='primary' size={size? size : 'small' } style={{marginRight:28,...style}} onClick={()=>detail(data)}>{text? text : '查看派单详细'}</Button>
    <Modal
    visible={detailVisible}
    title={detailTitle}
    onCancel={() => { setDetailVisible(false) }}
    footer={null}
    destroyOnClose
    wrapClassName={`spreadOverModal ${styles.detailModalSty}`}
    mask={false}
  >
    <Detail data={data ? data : {}} id={data?.ID}/>
  </Modal>
 </> );
};
export default connect(dvaPropsData)(Index);