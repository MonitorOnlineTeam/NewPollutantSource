import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import InstallDebugger from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/InstStdAndCompReso/install';
import { fontSizeFn } from '@/pages/SystemDashboard/CONST.js';

let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  time: sysDashboard.time,
  // loading: loading.effects['ctDataScreen/GetInstallationDebuggingAnalysis'],
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
  const [loading, setLoading] = useState(false);
  const { dispatch, time } = props;

  useEffect(() => {
    getData();
  }, [time]);

  useEffect(() => {
    window.addEventListener('resize', refreshChart);
    // 在组件卸载或者依赖发生变化前，移除事件监听器
    return () => {
      window.removeEventListener('resize', refreshChart);
    };
  }, [echarts]);

  // 改变echarts图字体大小
  const refreshChart = () => {
    if (echarts) {
      let echarts_instance = echarts.getEchartsInstance();
      echarts_instance.resize();
      let option = echarts_instance.getOption();
      if (option.title) {
        option.title[0].textStyle.rich.val.fontSize = fontSizeFn(24);
        option.series[0].radius = [fontSizeFn(60), fontSizeFn(100)];
        option.series[0].label = {
          show: true,
          position: 'outside',
          color: 'inherit', //继承饼图颜色
          formatter: function(params) {
            return '{b|' + params.name + '：}{c|' + params.value + '套}\n{hr|●}';
          },
          rich: {
            b: {
              fontFamily: 'Source Han Sans CN',
              fontWeight: 500,
              fontSize: fontSizeFn(15),
              color: '#fff',
              padding: [fontSizeFn(-10), 0, 0, fontSizeFn(6)],
            },
            c: {
              fontFamily: 'Microsoft YaHei',
              fontWeight: 500,
              fontSize: fontSizeFn(15),
              padding: [fontSizeFn(-10), fontSizeFn(20), 0, 0],
              align: 'left',
            },
            hr: {
              color: 'inherit',
              width: fontSizeFn(4),
              height: fontSizeFn(4),
              verticalAlign: 'top',
              lineHeight: fontSizeFn(-20),
              padding: [fontSizeFn(-5), fontSizeFn(-10), 0, fontSizeFn(-10)],
            },
          },
        };
        option.series[0].labelLine = {
          length: fontSizeFn(2),
          length2: fontSizeFn(30),
          lineStyle: {
            width: fontSizeFn(2), // 引导线宽度
          },
        };
        echarts_instance.setOption(option);
      }
    }
  };

  const getData = () => {
    setLoading(true);
    dispatch({
      type: 'ctDataScreen/GetInstallationDebuggingAnalysis',
      payload: {
        bTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        eTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
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
      { value: InstallationDebuggingRate.NoNeed, name: '/' },
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
              fontSize: fontSizeFn(24),
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
          radius: [fontSizeFn(60), fontSizeFn(100)],
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
            rich: {
              b: {
                fontFamily: 'Source Han Sans CN',
                fontWeight: 500,
                fontSize: fontSizeFn(15),
                color: '#fff',
                padding: [fontSizeFn(-10), 0, 0, fontSizeFn(6)],
              },
              c: {
                fontFamily: 'Microsoft YaHei',
                fontWeight: 500,
                fontSize: fontSizeFn(15),
                padding: [fontSizeFn(-10), fontSizeFn(20), 0, 0],
                align: 'left',
              },
              hr: {
                color: 'inherit',
                width: fontSizeFn(4),
                height: fontSizeFn(4),
                verticalAlign: 'top',
                lineHeight: fontSizeFn(-20),
                padding: [fontSizeFn(-5), fontSizeFn(-10), 0, fontSizeFn(-10)],
              },
            },
          },
          labelLine: {
            length: fontSizeFn(2),
            length2: fontSizeFn(30),
            lineStyle: {
              width: fontSizeFn(2), // 引导线宽度
            },
          },
          data: seriesData,
        },
      ],
    };

    return option;
  };

  return (
    <HomeCard title="安装调试达标分析" bodyStyle={{}} loading={loading}>
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart);
        }}
        option={getOption()}
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

export default connect(dvaPropsData)(Card_3);
