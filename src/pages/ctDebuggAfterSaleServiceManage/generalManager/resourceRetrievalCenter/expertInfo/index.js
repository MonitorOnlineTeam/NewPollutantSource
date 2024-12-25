/*
 * @Author: outman0611
 * @Date: 2024-10-12 08:43:50
 * @LastEditors: outman0611
 * @LastEditTime: 2024-12-10 16:01:50
 * @Description: 专家信息
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
  Empty,
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
import styles from '../style.less';
const { Option } = Select;
const { Search } = Input;
const namespace = 'generalManager';

const dvaPropsData = ({ loading, generalManager, global }) => ({
  loading: loading.effects[`${namespace}/GetMavenList`],
});



const Index = props => {



  const { dispatch, loading } = props;
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [content, setContent] = useState('')


  useEffect(() => {
    getData({ pageIndex: pageIndex, pageSize: pageSize })
    dispatch({
      type: `${namespace}/updateState`,
      payload: { resourceRetrievalCenterSelectIndex: props.selectIndex },
    })
  }, []);

  const getData = (payload) => {
    dispatch({
      type: `${namespace}/GetMavenList`,
      payload: { ...payload },
      callback: (res) => {
        setData(res?.Datas || [])
        setTotal(res?.Total || 0)
        setContent(payload?.content)
      }
    })
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


  const intervalNum = 16

  const userInfoType = [
    { title: '所在大区', url: '/generalManager/ssdq.png', attribute: 'UserGroup_Name' },
    { title: '联系方式', url: '/generalManager/dh.png', attribute: 'Phone' },
    { title: '擅长设备型号', url: '/generalManager/sbxh.png', attribute: 'Model' },
  ]
  return (<div className={styles.pageContentWrapper}>
    {/* <BreadcrumbWrapper title='专家信息'> 
      <Card bodyStyle={{ paddingBottom: 24 }}>*/}
        <SerachInputComponents
          placeholder={props.placeholder}
          className={styles.smallSearchInputSty}
          onSearch={onSearch}
          loading={loading}
        // defaultFocus
        />
        <Spin spinning={loading}>
          <Row gutter={[intervalNum, intervalNum]} className='expertInfoItem'>
            {data?.[0] ? data.map((item, index) =>
              (<Col span={6}>
                <Card className={styles.cardSty} bordered={false} hoverable>
                  <Row>
                    <Space size={12} align='center'>
                      <img src='/generalManager/ry.png' />
                      <span style={{ fontSize: 18, fontWeight: 500 }}>{item.ExpertName}</span>
                      <Tag>{'技术专家'}</Tag>
                    </Space>
                  </Row>
                  <Row>
                    {userInfoType.map(userItem => (
                      <Col span={12} style={{ paddingTop: 14 }}>
                        <Space size={6} direction="vertical">
                          <Row align='middle'>
                            <img src={userItem.url} />
                            <span style={{ color: '#999999', paddingLeft: 6 }}>{userItem.title}</span>
                          </Row>
                          <div>
                            {item[userItem.attribute]}
                          </div>
                        </Space>
                      </Col>))}

                  </Row>
                </Card>
              </Col>

              ))
              :
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '100%' }} />
            }

          </Row>
        </Spin>
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
  </div>
  );
};
export default connect(dvaPropsData)(Index);
