import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '../../styles.less';
import { HomeCard, Numbers } from '@/components/HomeComponents';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import CustomerSatisfacQuery from '@/pages/ctDebuggAfterSaleServiceManage/customerSatisfaction/customerSatisfacQuery';

let myChart;
const dvaPropsData = ({ loading, ctDataScreen }) => ({
  // loading: loading.effects['ctDataScreen/GetInstallationDebuggingAnalysis'],
});

const CustomerSatisfaction = props => {
  const [echarts1, setEcharts1] = useState();
  const [echarts2, setEcharts2] = useState();
  const [SatisfactionSurveyRate, setSatisfactionSurveyRate] = useState({
    ServiceAttitudeRate: 0,
    TechnicalLevelRate: 0,
    SatisfactionSurveyCount: 0,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { dispatch } = props;
  const [date, setDate] = useState();
  useEffect(() => {}, []);

  const getData = value => {
    setLoading(true);
    dispatch({
      type: 'ctDataScreen/GetInstallationDebuggingAnalysis',
      payload: {
        bTime: moment(value[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: moment(value[1]).format('YYYY-MM-DD HH:mm:ss'),
      },
      callback: res => {
        if (res.IsSuccess) {
          setSatisfactionSurveyRate(res.Datas.SatisfactionSurveyRate);
        }
        setDate(value?.[0] && value?.[1] && [moment(value[0]), moment(value[1])]);
        setLoading(false);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard
      // style={{ minHeight: 300 }}
      style={{ minHeight: '17.5rem', flex: '0 1 17.5rem' }}
      title="客户满意度"
      timeTypes={['上月', '本年']}
      onChange={value => {
        getData(value);
      }}
      onClick={onOpenModal}
      bodyStyle={{}}
      loading={loading}
    >
      <div className={styles.CustomerSatisfactionWrapper} onClick={onOpenModal}>
        <div className={styles.itemBox} style={{ marginTop: 10 }}>
          <span>调查次数(次)</span>
          <Numbers count={336} />
        </div>
        <div className={styles.itemBox}  style={{ marginTop: 10 }}>
          <span>工程师态度满意度</span>
          <span className={styles.rate}>{SatisfactionSurveyRate.ServiceAttitudeRate} %</span>
        </div>
        <div className={styles.itemBox} style={{ marginTop: 10 }}>
          <span>工程师技术水平满意度</span>
          <span className={styles.rate}>{SatisfactionSurveyRate.TechnicalLevelRate} %</span>
        </div>
        {/* <div className={styles.statisticsNum}>
          <span className={styles.text}>调查次数</span>
          <span className={styles.number}>{SatisfactionSurveyRate.SatisfactionSurveyCount}次</span>
        </div>
        <Row className={`${styles.echartsContent}`}>
          <Col span={12}>
            <ReactEcharts
              ref={echart => {
                echart && setEcharts1(echart.echarts);
              }}
              option={getOption(1, SatisfactionSurveyRate.ServiceAttitudeRate)}
              lazyUpdate={true}
              style={{ height: '180px', width: '100%' }}
            />
            <p className={styles.echartsTitle} style={{ marginTop: -6 }}>
              工程师态度满意度
            </p>
          </Col>
          <Col span={12}>
            <ReactEcharts
              ref={echart => {
                echart && setEcharts2(echart.echarts);
              }}
              option={getOption(2, SatisfactionSurveyRate.TechnicalLevelRate)}
              lazyUpdate={true}
              style={{ height: '180px', width: '100%' }}
            />
            <p className={styles.echartsTitle} style={{ marginTop: -6 }}>
              工程师技术水平满意度
            </p>
          </Col>
        </Row> */}
      </div>
      <Modal
        title={`客户满意度调查`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        // bodyStyle={{ padding: 0 }}
      >
        {open && (
          <CustomerSatisfacQuery
            viewOnlyAll
            match={{ path: '' }}
            modalWrapClassName="fullScreenModal"
            initDate={date}
            isHome
          />
        )}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(CustomerSatisfaction);
