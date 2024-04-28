import React, { useState, useEffect, useMemo, useRef } from 'react';
import { connect } from 'dva';
import { Card, Empty, Row, Col, Divider } from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import styles from '../index.less';
import 'echarts-gl';
import {
  getPie3D,
  chartMouseover,
  chartMouseout,
} from '@/pages/ctDebuggAfterSaleServiceManage/utils/getPie3D.js';

const customVal = 0.03456;

const dvaPropsData = ({ loading, ctAfterSalesServiceManagement }) => ({
  underWarrantyServicesData: ctAfterSalesServiceManagement.underWarrantyServicesData,
  loading: loading.effects['ctAfterSalesServiceManagement/GetWarrantyServiceAnalysis'],
});

const RegionalProportionCard2 = props => {
  const echarts2 = useRef(null);
  const [echarts, setEcharts] = useState();

  const {
    title,
    loading,
    underWarrantyServicesData: { LargeRegionAnalysis },
  } = props;

  useEffect(() => {}, []);

  useEffect(() => {
    if (LargeRegionAnalysis.length && echarts2) {
      setTimeout(() => {
        let myChart = echarts2?.current?.getEchartsInstance();
        let echartsOption = echarts2?.current?.props;
        myChart?.on('mouseover', function(params) {
          chartMouseover(myChart, echartsOption, params);
        });
        myChart?.on('globalout', function(params) {
          chartMouseout(myChart, echartsOption, params); // 修正取消高亮失败的 bug
        });
      }, 400);
    }
  }, [LargeRegionAnalysis, echarts2]);

  const getOption = () => {
    if (!echarts) {
      return {};
    }
    let isAllZero = LargeRegionAnalysis.every(item => item.Times === 0);
    let count = 0;
    let seriesData = [];
    LargeRegionAnalysis.map(item => {
      count += item.Times;
      let TimeRate = item.TimeRate.replace(/%/g, '') * 1;
      if ((TimeRate === 0 && isAllZero) || (TimeRate !== 0 && !isAllZero)) {
        seriesData.push({ value: TimeRate, name: item.LargeRegionName });
      }
    });
    // if (isAllZero) {
    //   m;
    // }

    console.log('seriesData2', seriesData);
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
      tooltip: {
        trigger: 'item',
        valueFormatter: function(value) {
          return value + '%';
        },
        // formatter: '{a} <br/>{b} ： {c} ({d}%)',
      },
      title: {
        text: '{name|服务时长}\n{val|' + count + '}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            name: {
              fontSize: 14,
              color: '#0693EF',
              padding: [10, 0],
            },
            val: {
              fontSize: 24,
              fontWeight: 'bolder',
              color: '#0693EF',
            },
          },
        },
      },
      series: [
        {
          name: '服务时长占比',
          type: 'pie',
          radius: [60, 100],
          // roseType: 'area',
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
              return '{b|' + params.name + '}\n{c|' + params.value + '%}\n{hr|●}';
            },
            rich: {
              // a: {
              //   fontSize: 18,
              //   padding: [18, 0, 0, 0],
              // },
              b: {
                fontFamily: 'Source Han Sans CN',
                fontWeight: 500,
                fontSize: 14,
                color: '#999999',
                padding: [18, 8, 0, 6],
              },
              c: {
                fontFamily: 'Microsoft YaHei',
                fontWeight: 500,
                fontSize: 16,
                padding: [4, 0, 0, 4],
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
                padding: [-28, -10, 0, -10],
                // shadowColor: 'inherit',
                // shadowBlur: 1,
                // shadowOffsetX: '0',
                // shadowOffsetY: '-26',
              },
            },
          },
          labelLine: {
            lineStyle: {
              // length: 20,
              // length2: 5,
              width: 2, // 引导线宽度
            },
          },
          data: seriesData,
        },
      ],
    };

    return option;
  };

  const getOption2 = () => {
    if (!echarts2) {
      return {};
    }

    const color = [
      '#2451FF',
      '#5AADD4',
      '#B35AFF',
      '#EDCC31',
      '#FF6B11',
      '#25BD97',
      '#4C8FFE',
      '#2AC3DF',
      '#fe6bba',
    ];

    let count = 0;
    let seriesData = LargeRegionAnalysis.map((item, index) => {
      count += item.Num;
      return {
        value: item.Num || customVal,
        name: item.LargeRegionName,
        rate: item.NumRate,
        itemStyle: {
          color: color[index],
          opacity: 1,
        },
      };
    });

    let option = {};
    option = getPie3D(seriesData, {
      internalDiameterRatio: 0.8,
      customVal: customVal,
      legendOption: { show: false },
    });

    let isAllZero = LargeRegionAnalysis.every(item => item.Num === 0);
    let pie2dData = [];
    seriesData.map((item, index) => {
      if ((!isAllZero && item.value !== customVal) || isAllZero) {
        pie2dData.push({
          ...item,
          itemStyle: {
            color: item.itemStyle.color,
            opacity: 0,
          },
        });
      }
    });
    console.log('pie2dData', pie2dData)
    option.title = {
      text: '{name|总计}\n{val|' + count + '}',
      // top: 'center',
      // left: 'center',
      x: 'center',
      y: '45%',
      textStyle: {
        rich: {
          name: {
            fontSize: 14,
            fontWeight: 'bolder',
            color: '#3888FF',
            padding: [10, 0],
          },
          val: {
            fontSize: 14,
            fontWeight: 'bolder',
            color: '#3888FF',
          },
        },
      },
    };

    option.grid3D = {
      show: false,
      boxHeight: 20, //圆环的高度
      width: '100%',
      top: 0,
      left: 0,
      viewControl: {
        //3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 50, //角度
        distance: 190, //调整视角到主体的距离，类似调整zoom
        rotateSensitivity: 0, //设置为0无法旋转
        zoomSensitivity: 0, //设置为0无法缩放
        panSensitivity: 0, //设置为0无法平移
        autoRotate: false, //自动旋转
        // projection: 'orthographic'//默认为透视投影'perspective'，也支持设置为正交投影'orthographic'
      },
      //后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果。可以让整个画面更富有质感。
      // postEffect: {
      //   //配置这项会出现锯齿，请自己去查看官方配置有办法解决
      //   enable: true,
      //   bloom: {
      //     enable: true,
      //     bloomIntensity: 0.1,
      //   },
      //   SSAO: {
      //     enable: true,
      //     quality: 'medium',
      //     radius: 2,
      //   },
      // },
    };
    option.series.push({
      //需要label指引线的话
      name: 'pie2d',
      type: 'pie',
      // avoidLabelOverlap: true,
      // label: {
      //   show: true,
      //   position: 'outside',
      //   // color: 'inherit', //继承饼图颜色
      // },

      label: {
        show: true,
        position: 'outside',
        color: 'inherit', //继承饼图颜色
        formatter: function(params) {
          return '{b|' + params.name + '}\n{c|' + params.data.rate + '%}';
        },
        opacity: 1,
        padding: [0, -90],
        rich: {
          // a: {
          //   fontSize: 18,
          //   padding: [18, 0, 0, 0],
          // },
          b: {
            fontFamily: 'Source Han Sans CN',
            fontWeight: 500,
            fontSize: 14,
            color: '#999999',
            // padding: [18, 8, 0, 6],
          },
          c: {
            fontFamily: 'Microsoft YaHei',
            fontWeight: 500,
            fontSize: 13,
            padding: [10, 8, 0, 0],
            align: 'left',
            // color: '#0055FE',
          },
        },
      },
      labelLine: {
        length: 30,
        length2: 90,
        color: 'inherit',
        lineStyle: {
          width: 2, // 引导线宽度
          // normal: {
          //   color: param => {
          //     console.log('param', param);
          //     // return color[param.dataIndex]
          //     return 'red';
          //   },
          // },
        },
      },
      startAngle: -40, //起始角度，支持范围[0, 360]。
      clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
      radius: ['40%', '60%'],
      center: ['50%', '55%'],
      data: pie2dData.sort((a, b) => {
        return b.value - a.value;
      }),
      itemStyle: {
        opacity: 1,
      },
      tooltip: {
        show: false,
      },
    });

    option.tooltip = {
      formatter: params => {
        let bfb = '';
        if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
          const item = option.series[params.seriesIndex].pieData;
          if (item.value == customVal || item.value.rate == 0) {
            //为0时
            bfb = '0.00';
          } else {
            bfb = option.series[params.seriesIndex].pieData.rate;
          }
        }
        return (
          `${params.seriesName}<br/>` +
          `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
          `${bfb}%`
        );
      },
    };
    return option;
  };

  const renderEcharts = useMemo(() => {
    return (
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getOption()}
        style={{ height: 'calc(100% - 40px)' }}
        className="echarts-for-echarts"
        theme="my_theme"
      />
    );
  }, [LargeRegionAnalysis, echarts]);

  return (
    <Card
      title={title}
      size="small"
      bodyStyle={{ height: 340, paddingBottom: 0, paddingTop: 0 }}
      loading={loading}
    >
      <Row wrap={false} style={{ height: '100%' }}>
        <Col flex="1">
          {LargeRegionAnalysis.length ? (
            <ReactEcharts
              option={getOption2()}
              style={{ width: '100%', height: 'calc(100% - 40px)' }}
              ref={echarts2}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          ) : (
            <Empty style={{ minHeight: 308, height: 'calc(50vh - 170px)' }} />
          )}
          <Row align="center" className={styles.chartNameBox}>
            <span className={styles.name}>次数占比</span>
          </Row>
        </Col>
        <Col flex="none">
          <div
            style={{
              padding: '16px 0',
              height: '100%',
            }}
          >
            <Divider type="vertical" dashed style={{ height: '100%' }} />
          </div>
        </Col>
        <Col flex="1" style={{ position: 'relative' }}>
          {renderEcharts}
          <Row align="center" className={styles.chartNameBox}>
            <span className={styles.name}>时长占比</span>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(dvaPropsData)(RegionalProportionCard2);
