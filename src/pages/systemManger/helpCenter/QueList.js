/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, List, Skeleton, Form, Tag, Spin, Typography, Tree, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RightOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import QueDetail from './QueDetail';



const { TextArea, Search, } = Input;

const { Option } = Select;

const namespace = 'helpCenter'


const dvaPropsData = ({ loading, helpCenter }) => ({
  listData: helpCenter.questionListData,
  listDataTotal: helpCenter.questionListTotal,
  questionTypeTitle: helpCenter.questionTypeTitle,
  questTypeFirstLevel: helpCenter.questTypeFirstLevel,
  questTypeSecondLevel: helpCenter.questTypeSecondLevel,

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();



  const [helpVisible, sethelpVisible] = useState(false)






  const { listData, listDataTotal, detailLoading, questionTypeTitle, questTypeFirstLevel, questTypeSecondLevel, } = props;

  const [searchContent, setSearchContent] = useState()



  const [id, setId] = useState()

  const detail = (data) => {
    sethelpVisible(true)
    setId(data.ID)
  }



  return (
    <div className={styles.questListSty}>
      <div style={{ backgroundColor: '#fff', padding: '14px 0 0 20px',color:'#1890ff'}} >{questionTypeTitle}</div>
      <Skeleton loading={props.listLoading} active>
        <List
          itemLayout="vertical"
          size="default"
          pagination={listDataTotal && listDataTotal > 0 && {
            total: listDataTotal,
            pageSize: props.pageSize,
            current: props.pageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: props.handleListChange,
            size: 'small',
          }}
          dataSource={listData}
          renderItem={(item) => (
            <List.Item
              key={item.title}
              extra={<RightOutlined style={{ color: 'rgb(194,194,194)' }} />}
              onClick={() => detail(item)}
              style={{ cursor: 'pointer' }}
            >
              {item.content}
            </List.Item>
          )}
        />
      </Skeleton>
      <Modal
        title={questionTypeTitle}
        visible={helpVisible}
        confirmLoading={detailLoading}
        onCancel={() => { sethelpVisible(false) }}
        className={styles.helpCenterModal}
        destroyOnClose
        width='70%'
        footer={null}
      >
        <QueDetail match={{ params: { id: id } }} /> {/*兼容移动端  */}
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);