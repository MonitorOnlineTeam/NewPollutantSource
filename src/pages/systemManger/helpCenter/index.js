/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Skeleton, Menu, Form, Tag, Spin, Empty, Typography, Tree, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import QueList from './QueList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';


const { TextArea, Search, } = Input;

const { Option } = Select;

const namespace = 'helpCenter'


const dvaPropsData = ({ loading, helpCenter }) => ({
  questTypeTreeData: helpCenter.questTypeTreeData,
  treeLoading: loading.effects[`${namespace}/getQuestionType`],
  listData: helpCenter.questionListData,
  listDataTotal: helpCenter.questionListTotal,
  questionTypeTitle: helpCenter.questionTypeTitle,
  // questTypeFirstLevel: helpCenter.questTypeFirstLevel,
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
    getQuestionType: (payload, callback) => { //左侧问题树
      dispatch({
        type: `${namespace}/getQuestionType`,
        payload: payload,
        callback: callback,
      })
    },
    getQuestionDetialList: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getQuestionDetialList`,
        payload: payload,
        callback: callback,
      })
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();










  const { questTypeTreeData, treeLoading, questionListData, questionListTotal, } = props;

  const [selectedKey, setSelectedKey] = useState([])
  useEffect(() => {
    props.getQuestionType({}, (data) => {
      const defaultExpandedKeys =  getExpandedKey(data, []) //默认全部展开
      setExpandedKeys(defaultExpandedKeys)
      if (data[2] && data[2].children && data[2].children[0].children[0]) {
        const selectKey = data[2].children[0].children[0].key
        setSelectedKey([selectKey]) //默认选中 平台使用
        props.updateState({
          questionTypeTitle: data[2].children[0].children[0].title,
          // questTypeFirstLevel: data[2].children[0].type,
          questTypeSecondLevel: data[2].children[0].children[0].type,
        })
      }
    })
  }, []);




  const getExpandedKey = (arr, arrKey) => {
    //没有则跳出
    if (!(arr[0] && arr[0].key)) {
      return arrKey;
    } else {
      //有就放入
      arr.filter(item => {
        arrKey.push(item.key);
        getExpandedKey(item.children, arrKey);//再次递归
      })

    }
    return arrKey;

  }

  const treeDatas = (data, i, parent) => {
    if (data && data.length > 0) {
      i++;
      return data.map(item => {
        return {
          ...item,
          titles: item.title,
          title: i == 1 ? <Row style={{ backgroundColor: '#fff', padding: '4px 0 4px 38px', borderBottom: '1px solid #f0f0e0', }}> {item.title} </Row> : <Row align='middle' style={{ paddingLeft: 24, lineHeight: '36px',}} ><span className={'dotSty'} style={{ display: 'inline-block', width: 5, height: 5, borderRadius: 5, marginRight: 6, marginLeft: (i - 1) * 10 }}></span> {item.title}</Row>,
          // selectable:i==1? false : true ,
          parentTitle: parent && parent.title,
          parentType: parent && parent.type,
          children: item.children && item.children.length > 0 ? treeDatas(item.children, i, item) : undefined
        }
      })
    }

  }


  const [expandedKeys, setExpandedKeys] = useState([])
  const onSelect = (selectedKeys, info) => {
    console.log(info)
    if (info.node.children && info.node.children[0]) {
      if (info.node.expanded) { //展开状态 再次点击收缩
        const expandData = expandedKeys.filter(item => item != selectedKeys)
        setExpandedKeys(expandData)
      } else {
        setExpandedKeys([...expandedKeys, ...selectedKeys])
      }
      return;
    }

    setSelectedKey(selectedKeys)
    const data = info.node;
    props.updateState({
      questionTypeTitle: data.titles,
      // questTypeFirstLevel: data.parentType,
      questTypeSecondLevel: data.type,
    })
  };



  //右侧问题查询
  const { listData, listDataTotal, detailLoading, questionTypeTitle, questTypeFirstLevel, questTypeSecondLevel, } = props;

  const [searchContent, setSearchContent] = useState()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  useEffect(() => {
    if (questTypeSecondLevel) {
      setPageIndex(1)
      getQuestionDetialListFun(1, pageSize, searchContent);
    }

  }, [questTypeSecondLevel,]);

  const [id, setId] = useState()

  const detail = (data) => {
    sethelpVisible(true)
    setId(data.ID)
  }



  const [listLoading, setListLoading] = useState(true)

  const getQuestionDetialListFun = (pageIndexs, pageSizes, questionName) => {
    setListLoading(true)
    props.getQuestionDetialList({
      pageIndex: pageIndexs,
      pageSize: pageSizes,
      QuestionName: questionName,
      firstLevel:questTypeSecondLevel,
      status:1,
      // firstLevel: questTypeFirstLevel,
      // secondLevel: questTypeSecondLevel,
    }, () => { setListLoading(false) })
  }

  const onChange = (e) => {  //查询
    setSearchContent(e.target.value)
  }
  const onSearch = (value, e) => {  //查询
    setPageIndex(1)
    getQuestionDetialListFun(1, pageSize, value);
  }

  const handleListChange = (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    getQuestionDetialListFun(PageIndex, PageSize)
  }
  return (
    <div className={styles.helpCenterSty}>
      <BreadcrumbWrapper>
        <Card>
          <Row justify='end'><Search loading={listLoading} value={searchContent} onChange={onChange} onSearch={onSearch} allowClear style={{ marginBottom: 14, width: '20%' }} placeholder="请输入问题" /></Row>
          <Row style={{ overflowY: 'auto', height: 'calc(100vh - 185px)' }}>
            <div className={styles.treeSty}>
              <Skeleton loading={treeLoading} active paragraph={{ rows: 5, }}>
                <Tree
                  selectedKeys={selectedKey}
                  onSelect={onSelect}
                  treeData={treeDatas(questTypeTreeData, 0)}
                  // defaultExpandAll
                  expandedKeys={expandedKeys}
                  blockNode
                />
              </Skeleton>
            </div>
            <div style={{ width: 'calc(100% - 165px)', }}>
              {selectedKey && selectedKey[0] ? <QueList listLoading={listLoading} pageIndex={pageIndex} pageSize={pageSize} handleListChange={handleListChange} /> : <Empty style={{ height: 223, backgroundColor: '#fff', margin: 0, marginLeft: 14, paddingTop: 60, }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </div>

          </Row>

        </Card>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);