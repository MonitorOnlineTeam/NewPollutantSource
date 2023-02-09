/**
 * 功  能：无数据点位导出
 * 创建人：jab
 * 创建时间：2023.02.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Tabs, Empty, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import { DownloadOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const namespace = 'noDataPointExport'




const dvaPropsData = ({ loading, }) => ({
  exportLoading: loading.effects[`${namespace}/exportTestPeport`],

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    exportTestPeport: (payload) => {
      dispatch({
        type: `${namespace}/exportTestPeport`,
        payload: payload,
      })
    },
  }
}


const Index = (props) => {


  const {  exportLoading ,} = props;

  useEffect(() => {
  }, [])



  const exports = () => {
    props.exportTestPeport({ })
  }

  return (
    <BreadcrumbWrapper>
    <div style={{padding:'16px'}}>
      <Button type="primary" icon={<DownloadOutlined/>}  loading={exportLoading} style={{ marginRight: 10 }} onClick={exports}>导出</Button>
    </div>
    </BreadcrumbWrapper>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);