import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import InstallDebugger from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/InstStdAndCompReso/install';
import { fontSizeFn } from '@/pages/SystemDashboard/CONST.js';
import styles from '@/pages/SystemDashboard/styles.less';

let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  time: sysDashboard.time,
  QCOverviewData: sysDashboard.QCOverviewData,
  loading: loading.effects['sysDashboard/GetQCAMapPointInfo'],
});

const Card_3 = props => {
  const [echarts, setEcharts] = useState();
  const [InstallationDebuggingRate, setInstallationDebuggingRate] = useState({
    Excellent: 0,
    Qualified: 0,
    Unqualified: 0,
    NoPhotos: 0,
    NoNeed: 0,
    Rate: 0,
  });
  const [open, setOpen] = useState(false);
  const { dispatch, time, loading, QCOverviewData } = props;

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  const getOption = () => {
    let count = QCOverviewData.ResultTrueNum + QCOverviewData.ResultFalseNum;
    let rate = count > 0 ? QCOverviewData.ResultTrueNum / count : 0;
    let seriesData = [
      {
        value: QCOverviewData.ResultTrueNum,
        name: '合格数量',
      },
      {
        value: QCOverviewData.ResultFalseNum,
        name: '不合格数量',
      },
    ];

    let option = {
      color: ['#2EEA9C', 'rgb(255, 55, 55)'],
      title: {
        text: '{val|' + rate + '%}\n{name|合格率}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            name: {
              fontSize: fontSizeFn(14),
              color: '#C3F0FF',
              padding: [fontSizeFn(10), 0],
              fontWeight: 'bold',
            },
            val: {
              fontSize: fontSizeFn(24),
              fontWeight: 'bold',
              color: '#0693EF',
            },
          },
        },
      },
      tooltip: {
        // valueFormatter: function(value) {
        //   return value + '个';
        // },
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      series: [
        {
          name: '合格率分析',
          type: 'pie',
          // radius: [50, 250],
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          // roseType: 'area',
          label: { show: false },
          itemStyle: {
            borderRadius: fontSizeFn(6),
            borderColor: 'rgb(82, 242, 255)',
            borderWidth: fontSizeFn(2),
            padding: fontSizeFn(4),
          },
          padAngle: 4,
          data: seriesData,
        },
      ],
    };

    return option;
  };

  return (
    <HomeCard title="合格率分析" bodyStyle={{}} loading={loading}>
      <Row style={{ height: '100%' }}>
        <Col span={13}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts(echart);
            }}
            option={getOption()}
            style={{ height: '100%' }}
            className="echarts-for-echarts"
            theme="my_theme"
            // onEvents={{ click: onOpenModal }}
          />
        </Col>
        <Col span={11} className={styles.center}>
          <Row className={styles.chartLegendWrapper}>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: '#347AED' }}></i>
                <span className="textOverflow">执行数量</span>
              </div>
              <div className={styles.value}>
                {QCOverviewData.ResultTrueNum + QCOverviewData.ResultFalseNum}
              </div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: '#2EEA9C' }}></i>
                <span className="textOverflow">合格数量</span>
              </div>
              <div className={styles.value}>{QCOverviewData.ResultTrueNum}</div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: 'rgb(255, 55, 55)' }}></i>
                <span className="textOverflow">不合格数量</span>
              </div>
              <div className={styles.value}>
                {QCOverviewData.ResultFalseNum}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* <Modal
        title={`安装调试达标率`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{ padding: '10px 0' }}
      >
        {open && (
          <InstallDebugger
            hideBreadcrumb
            modalWrapClassName="fullScreenModal"
            location={{
              pathname: '/ctManage/reportsViews/InstStdAndCompReso/install',
              query: {},
            }}
            match={{
              path: '/ctManage/reportsViews/InstStdAndCompReso/install',
              url: '/ctManage/reportsViews/InstStdAndCompReso/install',
              isExact: true,
              params: {},
            }}
          />
        )}
      </Modal> */}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(Card_3);
