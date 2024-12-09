import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '../../styles.less';
import screenStyles from '@/pages/screenStyle.less'
import { HomeCard } from '@/components/HomeComponents';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import InstallDebugger from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/InstStdAndCompReso/install';
import { fontSizeFn } from '@/pages/SystemDashboard/CONST.js';

const COLOR = ['#2998FF', '#21ECBB', '#FDAA2A','#DFE06D'];
let myChart;
const dvaPropsData = ({ loading, ctDataScreen }) => ({
  // loading: loading.effects['ctDataScreen/GetInstallationDebuggingAnalysis'],
});

const InstallDebugRate = props => {
  const { dispatch } = props;

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
  const [loading, setLoading] = useState(false);

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
        // 安装调试达标率
        if (res.IsSuccess) {
          setInstallationDebuggingRate(res.Datas.InstallationDebuggingRate);
        }
        setLoading(false);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };
  
  const getOption = () => {
    let seriesData = [
      { value: InstallationDebuggingRate.Excellent, name: '优秀' },
      { value: InstallationDebuggingRate.Qualified, name: '合格' },
      { value: InstallationDebuggingRate.Unqualified, name: '不合格' },
      { value: InstallationDebuggingRate.NoPhotos, name: '无照片' },
      // { value: InstallationDebuggingRate.NoNeed, name: '/' },
    ];
    let rate = InstallationDebuggingRate.Rate;

    let option = {
      color: COLOR,
      title: {
        text: '{val|' + rate + '%}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            // name: {
            //   fontSize: fontSizeFn(14),
            //   color: '#C3F0FF',
            //   padding: [fontSizeFn(10), 0],
            //   fontWeight: 'bold',
            // },
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
          name: '安装调试达标率',
          type: 'pie',
          // radius: [50, 250],
          radius: ['50%', '60%'],
          center: ['50%', '50%'],
          // roseType: 'area',
          label: { show: false },
          itemStyle: {
            // borderRadius: 6,
            // borderColor: '#2998FF',
            // borderWidth: 2,
            // padding: 4,
          },
          // padAngle: 4,
          data: seriesData,
        },
      ],
    };

    return option;
  };

  return (
    <HomeCard
      style={{ minHeight: '20rem' }}
      title="安装调试达标率"
      lastTime
      timeTypes={['上月', '本年']}
      onChange={value => {
        getData(value);
      }}
      onClick={onOpenModal}
      bodyStyle={{}}
      loading={loading}
    >
      <Row style={{ height: '100%' }}>
        <Col span={14}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts(echart);
            }}
            option={getOption()}
            style={{ height: '100%' }}
            className="echarts-for-echarts"
            theme="my_theme"
            onEvents={{ click: onOpenModal }}
          />
        </Col>
        <Col span={10} className={styles.center}>
          <Row className={screenStyles.chartLegendWrapper}>
            <Col span={24} className={screenStyles.lengendItem}>
              <div className={screenStyles.label}>
                <i style={{ backgroundColor: COLOR[0] }}></i>
                <span className="textOverflow">优秀</span>
              </div>
              <div className={screenStyles.value}>{InstallationDebuggingRate.Excellent}</div>
            </Col>
            <Col span={24} className={screenStyles.lengendItem}>
              <div className={screenStyles.label}>
                <i style={{ backgroundColor: COLOR[1] }}></i>
                <span className="textOverflow">合格</span>
              </div>
              <div className={screenStyles.value}>{InstallationDebuggingRate.Qualified}</div>
            </Col>
            <Col span={24} className={screenStyles.lengendItem}>
              <div className={screenStyles.label}>
                <i style={{ backgroundColor: COLOR[2] }}></i>
                <span className="textOverflow">不合格</span>
              </div>
              <div className={screenStyles.value}>
                {InstallationDebuggingRate.Unqualified}
              </div>
            </Col>
            <Col span={24} className={screenStyles.lengendItem}>
              <div className={screenStyles.label}>
                <i style={{ backgroundColor: COLOR[2] }}></i>
                <span className="textOverflow">无照片</span>
              </div>
              <div className={screenStyles.value}>
                {InstallationDebuggingRate.NoPhotos}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        title={`安装调试达标率`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{ padding: 0, height: 'calc(100vh - 46px)', overflowX: 'hidden' }}
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
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(InstallDebugRate);
