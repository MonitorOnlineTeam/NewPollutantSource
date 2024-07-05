import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import InstallDebugger from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/InstStdAndCompReso/install';

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
    if (!echarts) {
      return {};
    }

    let seriesData = [
      { value: InstallationDebuggingRate.Excellent, name: '优秀' },
      { value: InstallationDebuggingRate.Qualified, name: '合格' },
      { value: InstallationDebuggingRate.Unqualified, name: '不合格' },
      { value: InstallationDebuggingRate.NoPhotos, name: '无照片' },
      // { value: InstallationDebuggingRate.NoNeed, name: '/' },
    ];
    let rate = InstallationDebuggingRate.Rate;

    let option = {
      color: [
        '#5CDC9F',
        '#488CF7',
        '#F46848',
        '#E0D52B',
        '#4EEFEF',
        '#2358DC',
        '#AFD7DE',
        '#EAA017',
        '#6c76f1',
      ],
      // tooltip: {
      //   trigger: 'item',
      //   valueFormatter: function(value) {
      //     return value + '套';
      //   },
      //   // formatter: '{a} <br/>{b} ： {c} ({d}%)',
      // },
      title: {
        text: '{val|' + rate + '%}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            val: {
              fontSize: 24,
              fontWeight: 500,
              color: '#0693EF',
            },
          },
        },
      },
      series: [
        {
          name: '安装调试占比',
          type: 'pie',
          radius: [60, 100],
          roseType: 'area',
          itemStyle: {
            normal: {
              shadowBlur: 10,
              shadowColor: 'rgba(44,44,44,0.2)',
            },
          },
          label: {
            show: true,
            position: 'outside',
            color: 'inherit', //继承饼图颜色
            formatter: function(params) {
              return '{b|' + params.name + '：}{c|' + params.value + '套}\n{hr|●}';
            },
            // padding: [0, -90],
            rich: {
              // a: {
              //   fontSize: 18,
              //   padding: [18, 0, 0, 0],
              // },
              b: {
                fontFamily: 'Source Han Sans CN',
                fontWeight: 500,
                fontSize: 15,
                color: '#fff',
                padding: [-10, 0, 0, 6],
              },
              c: {
                fontFamily: 'Microsoft YaHei',
                fontWeight: 500,
                fontSize: 15,
                padding: [-10, 20, 0, 0],
                align: 'left',
                // color: '#0055FE',
              },
              hr: {
                color: 'inherit',
                // borderRadius: 100,
                width: 4,
                height: 4,
                verticalAlign: 'top',
                lineHeight: -20,
                padding: [-5, -10, 0, -10],
                // shadowColor: 'inherit',
                // shadowBlur: 1,
                // shadowOffsetX: '0',
                // shadowOffsetY: '-26',
              },
            },
          },
          labelLine: {
            length: 2,
            length2: 30,
            lineStyle: {
              width: 2, // 引导线宽度
            },
          },
          data: seriesData,
        },
      ],
    };

    return option;
  };

  return (
    <HomeCard
      style={{ minHeight: 320 }}
      title="安装调试达标率"
      timeTypes={['上月', '本年']}
      onChange={value => {
        getData(value);
      }}
      onClick={onOpenModal}
      bodyStyle={{}}
      loading={loading}
    >
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getOption(1, 82.71)}
        lazyUpdate={true}
        style={{ height: '100%', width: '100%' }}
        onEvents={{
          click: onOpenModal,
        }}
      />

      <Modal
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
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(InstallDebugRate);
