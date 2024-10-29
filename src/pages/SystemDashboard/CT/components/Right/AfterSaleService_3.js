import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Typography, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactSeamlessScroll from 'rc-seamless-scroll';
import moment from 'moment';
import UnderWarrantyServices from '@/pages/ctDebuggAfterSaleServiceManage/afterSalesServiceManage/underWarrantyServices';
import ToggleRadio from '@/pages/SystemDashboard/components/ToggleRadio.js';

const { Paragraph, Text } = Typography;

const dvaPropsData = ({ loading, sysDashboard }) => ({
  time: sysDashboard.time,
  loading: loading.effects['ctDataScreen/GetAfterSalesServiceAnalysis'],
});

const AfterSaleService = props => {
  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState(1);
  const [dataType, setDataType] = useState('1');
  const [ProductCategoryList, setProductCategoryList] = useState([]);
  const [ServiceReasonsList, setServiceReasonsList] = useState([]);

  const { dispatch, loading, time } = props;

  useEffect(() => {
    getData();
  }, [time]);

  const getData = value => {
    dispatch({
      type: 'ctDataScreen/GetAfterSalesServiceAnalysis',
      payload: {
        bTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        eTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        // 质保内服务产品类别
        setProductCategoryList(res.ProductCategoryList);
        // 质保内服务原因
        setServiceReasonsList(res.ServiceReasonsList);
      },
    });
  };

  const onOpenModal = type => {
    setOpen(true);
    setOpenType(type);
  };

  return (
    <HomeCard
      title="售后服务分析"
      style={{ flex: 5 }}
      bodyStyle={{ height: 'calc(100% - 2.5rem)' }}
      loading={loading}
    >
      <Row className={styles.AfterSaleServiceWrapper}>
        <Col
          span={24}
          style={{
            height: '100%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <ToggleRadio
            radioList={[
              { name: '质保内服务产品占比', value: '1' },
              { name: '质保内服务原因分析', value: '2' },
            ]}
            onChange={e => {
              setDataType(e.target.value);
            }}
          />
          {dataType === '1' ? (
            <div className={styles.listWrapper} onClick={() => onOpenModal(1)}>
              <Row className={styles.header} style={{ color: '#71CDF9' }}>
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
          ) : (
            <div className={styles.listWrapper} onClick={() => onOpenModal(2)}>
              <Row className={styles.header} style={{ color: '#71CDF9' }}>
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
          )}
        </Col>
        {/* <Col span={12} style={{ height: '100%',cursor:'pointer' }}  onClick={()=>onOpenModal(2)}>
          <div className={styles.title}>质保内服务原因</div>
          
        </Col> */}
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
        {open && (
          <UnderWarrantyServices
            btnType={openType}
            hideBreadcrumb
            modalWrapClassName="fullScreenModal"
          />
        )}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(AfterSaleService);
