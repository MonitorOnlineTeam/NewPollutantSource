import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Typography, Modal } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import ReactSeamlessScroll from 'rc-seamless-scroll';
import moment from 'moment';
import ToggleRadio from '@/pages/SystemDashboard/components/ToggleRadio.js';
import UnderWarrantyServices from '@/pages/ctDebuggAfterSaleServiceManage/afterSalesServiceManage/underWarrantyServices';

const { Paragraph, Text } = Typography;

const dvaPropsData = ({ loading }) => ({
  loading: loading.effects['ctDataScreen/GetAfterSalesServiceAnalysis'],
});

const AfterSaleService = props => {
  const { dispatch, loading } = props;

  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState(1);

  const [ProductCategoryList, setProductCategoryList] = useState([]);
  const [ServiceReasonsList, setServiceReasonsList] = useState([]);

  useEffect(() => { }, []);

  const getData = value => {
    dispatch({
      type: 'ctDataScreen/GetAfterSalesServiceAnalysis',
      payload: {
        bTime: moment(value[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: moment(value[1]).format('YYYY-MM-DD HH:mm:ss'),
      },
      callback: res => {
        // 质保内服务产品类别
        setProductCategoryList(res.ProductCategoryList);
        // 质保内服务原因
        setServiceReasonsList(res.ServiceReasonsList);
      },
    });
  };

  const onOpenModal = (type) => {
    setOpen(true);
    setOpenType(type)
  };
  const [dataType, setDataType] = useState(1);

  return (
    <HomeCard
      style={{ minHeight: 320 }}
      title="售后服务情况"
      timeTypes={['本月', '本年']}
      onChange={value => {
        getData(value);
      }}
      bodyStyle={{
        height: 'calc(100% - 41px)'
      }}
      loading={loading}
      onClick={()=>onOpenModal(dataType)}
    >
      
      <Row className={styles.AfterSaleServiceWrapper}>
      <Col
          span={24}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding:'8px 0'
          }}
        >
        <ToggleRadio
          radioList={[
            { name: '质保内服务产品类别', value: 1 },
            { name: '质保内服务原因', value: 2 },
          ]}
          onChange={e => {
            setDataType(e.target.value);
          }}
        />
        </Col>
        {dataType == 1 ? <Col span={24} style={{ height: 'calc(100% - 38px)', cursor: 'pointer' }} onClick={() => onOpenModal(1)}>
          {/* <div className={styles.title}>质保内服务产品类别</div> */}
          <div className={styles.listWrapper}>
            <Row className={styles.header}>
              <Col flex={2}>设备类别</Col>
              <Col flex={1}>次数</Col>
              <Col flex={1}>占比</Col>
              <Col flex={1}>工时</Col>
              <Col flex={1}>占比</Col>
            </Row>
            <div className={styles.listContent}>
               <ReactSeamlessScroll
                list={ProductCategoryList}
                style={{ width: '100%', height: '100%' }}
                wrapperClassName={styles.RankingSeamlessScrollContent}
                hover={true}
                step={0.3}
                limitScrollNum={6}
              >
                {ProductCategoryList.map(item => {
                  return (
                    <Row className={styles.listItem}>
                      <Col flex={2}>{item.Name}</Col>
                      <Col flex={1}>{item.Num}</Col>
                      <Col flex={1}>{item.NumRate}%</Col>
                      <Col flex={1}>{item.Times}</Col>
                      <Col flex={1}>{item.TimeRate}</Col>
                    </Row>
                  );
                })}
              </ReactSeamlessScroll> 
            </div>
          </div>
        </Col>
          :
          <Col span={24} style={{ height: 'calc(100% - 38px)', cursor: 'pointer' }} onClick={() => onOpenModal(2)}>
            {/* <div className={styles.title}>质保内服务原因</div> */}
            <div className={styles.listWrapper}>
              <Row className={styles.header}>
                <Col flex={2}>服务原因</Col>
                <Col flex={1}>次数</Col>
                <Col flex={1}>占比</Col>
                <Col flex={1}>工时</Col>
                <Col flex={1}>占比</Col>
              </Row>
              <div className={styles.listContent}>
                <ReactSeamlessScroll
                  list={ServiceReasonsList}
                  style={{ width: '100%', height: '100%' }}
                  wrapperClassName={styles.RankingSeamlessScrollContent}
                  hover={true}
                  step={0.3}
                  limitScrollNum={6}
                >
                  {ServiceReasonsList.map(item => {
                    return (
                      <Row className={styles.listItem}>
                        <Col flex={2}>{item.Name}</Col>
                        <Col flex={1}>{item.Num}</Col>
                        <Col flex={1}>{item.NumRate}%</Col>
                        <Col flex={1}>{item.Times}</Col>
                        <Col flex={1}>{item.TimeRate}</Col>
                      </Row>
                    );
                  })}
                </ReactSeamlessScroll>
              </div>
            </div>
          </Col>
        }
      </Row>
      <Modal
        title={`售后服务情况`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        {open && <UnderWarrantyServices btnType={openType} hideBreadcrumb modalWrapClassName="fullScreenModal" />}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(AfterSaleService);
