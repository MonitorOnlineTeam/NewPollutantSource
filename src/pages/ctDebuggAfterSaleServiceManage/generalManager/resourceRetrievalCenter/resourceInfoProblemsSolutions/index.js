/*
 * @Author: outman0611
 * @Date: 2024-10-12 08:43:50
 * @LastEditors: outman0611
 * @LastEditTime: 2024-12-11 09:18:39
 * @Description: 资源信息 和 问题及解决方案
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Spin,
  Form,
  Typography,
  Card,
  Button,
  Select,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
  Space,
  Tag,
  Pagination,
  List,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SerachInputComponents from '../SerachInputComponents';
import QueDetail from '@/pages/systemManger/helpCenter/QueDetail';
import ProblemBaseDetail from '@/pages/ctDebuggAfterSaleServiceManage/techExpertSystem/problemBase/Detail'
import styles from '../style.less';
import { use } from 'echarts';
const { Option } = Select;
const { Search } = Input;
const namespace = 'generalManager';

const dvaPropsData = ({ loading, generalManager, global }) => ({
  configInfo: global.configInfo,
  loading1: loading.effects[`${namespace}/GetQuestionList`],
  loading2: loading.effects[`${namespace}/GetQuestionCategoryType`]
});



const Index = props => {



  const { dispatch,selectIndex, type } = props;
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [content, setContent] = useState('')



  
  useEffect(() => {
    getData({ pageIndex: pageIndex, pageSize: pageSize })
    dispatch({
      type: `${namespace}/updateState`,
      payload: { resourceRetrievalCenterSelectIndex: selectIndex },
    })
  }, [type]);
  const getData = (payload) => {
    function getQuestionListRequest() {
      dispatch({
        type: `${namespace}/GetQuestionList`,
        payload: { ...payload,status:1 },
        callback: (res) => {
          setData(res?.Datas || [])
          setTotal(res?.Total || 0)
          setContent(payload?.content)
        }
      })
    }
    function getQuestionCategoryTypeRequest() {
      dispatch({
        type: `${namespace}/GetQuestionCategoryType`,
        payload: { ...payload },
        callback: (res) => {
          setData(res?.Datas || [])
          setTotal(res?.Total || 0)
          setContent(payload?.content)
        }
      })
    }
    if (type == 1) {
      getQuestionListRequest()
    } else if (type == 2) {
      getQuestionCategoryTypeRequest()
    }
  }


  const onSearch = (value) => {
    setPageIndex(1)
    setPageSize(20)
    getData({ pageIndex: 1, pageSize: 20, content: value })
  }

  const pageChange = (PageIndex, PageSize) => { //分页
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    getData({ pageIndex: PageIndex, pageSize: PageSize, content: content })
  }
  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }

  const [questionDetailVisible, setQuestionDetailVisible] = useState(false)
  // const [questionTypeTitle,setQuestionTypeTitle] = useState()
  const [questionId,setQuestionId] = useState()
  const [questionData,setQuestionData] = useState({})

  const questionDetail = (record)=>{
    setQuestionDetailVisible(true)
    setQuestionId(record.ID)
    setQuestionData(record)
  }

  const loading = type == 1 ? props.loading1 : props.loading2;
  return (<div className={styles.pageContentWrapper}>
    {/* <BreadcrumbWrapper title={type == 1 ? '资源信息' : '问题及解决方案'}> 
      <Card>*/}
    <SerachInputComponents
      placeholder={props.placeholder}
      className={styles.smallSearchInputSty}
      onSearch={onSearch}
      loading={!!loading}
    // defaultFocus
    />
    <List
      loading={!!loading}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Space direction="vertical" size={10}> 
            <div style={{ fontSize: 18, fontWeight: 500, color: '#1890FF',cursor: 'pointer' }} title={item.QuestionName} onClick={()=>questionDetail(item)}> { truncateString(item.QuestionName,50) }</div>
             {type == 1 ? <Space>{item.FirstLevel?.split(',')?.map(tagItem => <Tag>{tagItem}</Tag>)}</Space> : <Tag>{item.QuestionTypeName}</Tag>}
             {/* { type==1 ? <div style={{ cursor: 'pointer' }} onClick={()=>questionDetail(item)} dangerouslySetInnerHTML={{ __html:item.Content }} /> : <div style={{ cursor: 'pointer' }} onClick={()=>questionDetail(item)}>{item.QuestionDesc}</div>}  */}
             { type==2 && <div style={{ cursor: 'pointer' }} onClick={()=>questionDetail(item)}>{item.QuestionDesc}</div>} 
            <Space size={16}><span>发布人：{item.CreateUserName}</span> <span>发布时间：{type == 1 ? item.CreateTime : item.CreateDate}</span> </Space>
          </Space>
        </List.Item>
      )}
    />

    {/* </Card> */}
    {total > 0 && <Pagination
      className={'darkthemePaginationSty'}
      size="small"
      showSizeChanger
      showQuickJumper
      total={total}
      pageSize={pageSize}
      current={pageIndex}
      onChange={pageChange}
    />}
    {/* </BreadcrumbWrapper> */}

    <Modal
        title={type==1? '资源信息-详情' : '问题与解决方案-详情'}
        visible={questionDetailVisible}
        onCancel={() => { setQuestionDetailVisible(false) }}
        destroyOnClose
        wrapClassName='spreadOverModal'
        mask={false}
        footer={null}
      >
       {type==1? <QueDetail match={{ params: { id: questionId } }} /> : <ProblemBaseDetail data={questionData}/> }
      </Modal>
  </div>
  );
};
export default connect(dvaPropsData)(Index);
