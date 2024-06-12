/*
 * @Author: JiaQi 
 * @Date: 2023-05-24 14:42:49 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-24 14:46:01
 * @Description：专家库
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Row, Col, Statistic } from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import StandardFormRow from '@/pages/list/search/applications/components/StandardFormRow';
import TagSelect from '@/pages/list/search/applications/components/TagSelect';

const { Search } = Input;

const dvaPropsData = ({ loading, completeSetManage }) => ({
  regionalList: completeSetManage.regionalList,
});

const View = props => {
  const [form] = Form.useForm();
  const { regionalList } = props;
  const [expertData, setExpertData] = useState([]);

  useEffect(() => {
    getExpertData();
    GetAllRegionalList();
  }, []);

  // 查询数据
  const getExpertData = () => {
    const values = form.getFieldsValue();
    // console.log('values', values);
    // return;
    props.dispatch({
      type: 'completeSetManage/GetExpertList',
      payload: {
        ...values,
        UserGroup_ID: values.UserGroup_ID.toString(),
      },
      callback: (expertList, facilityList) => {
        setExpertData(facilityList);
      },
    });
  };

  // 获取大区
  const GetAllRegionalList = () => {
    props.dispatch({
      type: 'completeSetManage/GetAllRegionalList',
      payload: {},
    });
  };

  // 渲染设备列表
  const renderFacilityCard = () => {
    if (!expertData.length) {
      return (
        <div className={styles.notData}>
          <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
          <p style={{ color: '#d5d9e2', fontSize: 16, fontWeight: 500 }}>暂无数据</p>
        </div>
      );
    }
    return expertData.map((item, index) => {
      return (
        <Card
          key={item.Model}
          title={<div className={styles.title}>{item.Model}</div>}
          bordered={false}
          style={{ marginTop: 12, marginBottom: index === expertData.length ? 20 : 0 }}
          bodyStyle={{ paddingTop: 0 }}
        >
          {renderExpertItem(item.Data)}
        </Card>
      );
    });
  };

  // 根据设备类型渲染专家信息
  const renderExpertItem = expertList => {
    return expertList.map(item => {
      return (
        <Card.Grid key={item.ID} className={styles.expertItemBox}>
          <div className={styles.expertName}>
            <img src="/expert/user.png" />
            <span>{item.ExpertName}</span>
          </div>
          <Row className={styles.expertInfo}>
            <Col span={12}>
              <Statistic
                valueStyle={{ fontSize: 15, fontWeight: 500, paddingLeft: 2 }}
                title={
                  <p className={styles.statisticTitle}>
                    <img src="/expert/regional.png" />
                    所属大区
                  </p>
                }
                value={item.UserGroup_Name}
              />
            </Col>
            <Col span={12}>
              <Statistic
                valueStyle={{ fontSize: 15, fontWeight: 500, paddingLeft: 2 }}
                groupSeparator=""
                title={
                  <p className={styles.statisticTitle}>
                    <img src="/expert/phone.png" />
                    联系方式
                  </p>
                }
                value={item.Phone}
              />
            </Col>
          </Row>
        </Card.Grid>
      );
    });
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.expertViewWrapper}>
        <Card bordered={false} bodyStyle={{ padding: '24px' }}>
          <Form layout="inline" form={form} initialValues={{ UserGroup_ID: [] }}>
            <StandardFormRow
              title="所属大区"
              block
              style={{
                paddingBottom: 11,
              }}
            >
              <Form.Item name="UserGroup_ID">
                <TagSelect
                  onChange={e => {
                    getExpertData();
                  }}
                >
                  {regionalList.map(item => {
                    return (
                      <TagSelect.Option value={item.UserGroup_ID} key={item.UserGroup_ID}>
                        {item.UserGroup_Name}
                      </TagSelect.Option>
                    );
                  })}
                </TagSelect>
              </Form.Item>
            </StandardFormRow>
            <StandardFormRow block grid last>
              <Form.Item name="Model">
                <Search
                  placeholder="请输入设备型号"
                  allowClear
                  style={{
                    width: '50%',
                  }}
                  onSearch={value => getExpertData()}
                  enterButton="搜索"
                  size="large"
                />
              </Form.Item>
            </StandardFormRow>
          </Form>
        </Card>
        {renderFacilityCard()}
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(View);
