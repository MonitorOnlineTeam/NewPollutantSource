import React, { useState, useEffect, useMemo, useRef } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Divider } from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import styles from '../index.less';
import 'echarts-gl';
import {
  getPie3D,
  chartMouseover,
  chartMouseout,
} from '@/pages/ctDebuggAfterSaleServiceManage/utils/getPie3D.js';

const customVal = 0;

const dvaPropsData = ({ loading, reportsAndViews }) => ({
  underWarrantyServicesData: reportsAndViews.underWarrantyServicesData,
  loading: loading.effects['reportsAndViews/GetWarrantyServiceAnalysis'],
});

const ProductProportionCard4 = props => {
  const echarts3D = useRef(null);
  const [echarts, setEcharts] = useState();

  const {
    title,
    loading,
    underWarrantyServicesData: { WarrantyAnalysis },
    windowWidth,
    minWidth,
    // timeoutServicesData: { TimeoutReasonAnalysis },
  } = props;
  const legendTextWidth = 128;
  const windowWidthFlag = windowWidth <= minWidth

  useEffect(() => { }, []);
  useEffect(() => {
    if (WarrantyAnalysis.length && echarts3D) {
      setTimeout(() => {
        let myChart = echarts3D?.current?.getEchartsInstance();
        let echartsOption = echarts3D?.current?.props;
        myChart?.on('mouseover', function (params) {
          chartMouseover(myChart, echartsOption, params);
        });
        myChart?.on('globalout', function (params) {
          chartMouseout(myChart, echartsOption, params); // 修正取消高亮失败的 bug
        });
      }, 400);
    }
  }, [WarrantyAnalysis, echarts3D]);

  function getTopFourAndOthers(data) {
    // 创建一个副本，避免改变原数组
    let copyData = data.slice();

    // 根据 NumRate 进行降序排序
    copyData.sort((a, b) => b.NumRate - a.NumRate);

    // 获取前四个元素
    let topFour = copyData.splice(0, 4);

    // 计算前四个元素的 NumRate 总和
    let topFourTotal = topFour.reduce((sum, current) => sum + current.NumRate, 0).toFixed(2);
    // 创建 '其他' 元素, 如果所有数据都为0，'其他' 选项的 NumRate 也应为0
    let other = {
      ReasonName: '其他',
      Times: 0,
      TimeRate: '0%',
      Num: 0,
      NumRate: topFourTotal == 0 ? '0.00' : (100 - topFourTotal).toFixed(2),
    };

    // 添加到结果数组
    topFour.push(other);
    return topFour;
  }

  function getTopFourAndOthers2(data) {
    let tempData = data.map(item => {
      return {
        ...item,
        TimeRate: item.TimeRate.replace('%', '') * 1,
      };
    });
    // 创建一个副本，避免改变原数组
    let copyData = tempData.slice();
    copyData.sort((a, b) => b.TimeRate - a.TimeRate);
    // 根据 TimeRate 进行降序排序
    // 获取前四个元素
    let topFour = copyData.splice(0, 4);

    // 计算前四个元素的 TimeRate 总和
    let topFourTotal = topFour.reduce((sum, current) => sum + current.TimeRate, 0).toFixed(2);

    // 获取其他元素
    let otherData = copyData;
    // 计算前其他元素的 TimeRate 总和
    let otherTotalData = otherData.reduce((sum, current) => sum + current.Times, 0);

    // 创建 '其他' 元素, 如果所有数据都为0，'其他' 选项的 TimeRate 也应为0
    let other = {
      ReasonName: '其他',
      Times: otherTotalData,
      TimeRate: topFourTotal == 0 ? '0.00' : (100 - topFourTotal).toFixed(2),
      Num: 0,
      NumRate: 0,
    };

    // 添加到结果数组
    topFour.push(other);
    return topFour;
  }

  const getCountOption = () => {
    let chartData = getTopFourAndOthers(WarrantyAnalysis);
    let count = 0;
    let seriesData = chartData.map(item => {
      count += item.Times;
      return {
        value: item.NumRate,
        name: item.ReasonName,
      };
    });
    let option = {
      color: ['#35D6FF', '#3C88FE', '#FA5C90', '#FFBC63', '#7F66FE'],
      tooltip: {
        valueFormatter: function (value) {
          return value + '%';
        },
      },
      legend: {
        orient: 'vertical',
        top: 'middle',
        right: 4,
        icon: 'circle',
        triggerEvent: true,
        tooltip: {
          show: true,
          trigger: 'item',
        },
        formatter: name => {
          const item = seriesData.find(i => {
            return i.name === name;
          });
          return (
            "{name|" + name + "} " + "{b|" + item?.value + "%}"
          );
        },
        textStyle: {
          rich: {
            name: {
              width: legendTextWidth,
            },
          }
        }
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      series: [
        {
          name: '产品类别占比',
          type: 'pie',
          // radius: [50, 250],
          radius: windowWidth <= 1600 && windowWidth > minWidth || windowWidth<=1200 ? ['50%', '78%'] :  ['60%', '88%'],
          center: ['25%', '50%'],
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
          },
          padAngle: 0.1,
          label: { show: false },
          data: seriesData,
        },
      ],
    };

    return option;
  };

  const getOption2 = () => {
    if (!echarts3D) {
      return {};
    }

    const color = ['#F2924E', '#24979D', '#77C5EE', '#F6C95D', '#1C56A6'];
    let chartData = getTopFourAndOthers2(WarrantyAnalysis);
    let count = 0;
    let seriesData = chartData.map((item, index) => {
      count += item.Times;
      return {
        value: item.TimeRate * 1 || customVal,
        name: item.ReasonName,
        rate: item.TimeRate,
        itemStyle: {
          color: color[index],
          opacity: 1,
          // // 这里设置半透明
          // normal: {
          //   color: new echarts3D.graphic.LinearGradient(0, 0, 0, 1, [
          //     {
          //       offset: 0,
          //       color: '#00A8FF',
          //     },
          //     {
          //       offset: 1,
          //       color: '#8FDFFE',
          //     },
          //   ]),
          // },
        },
      };
    });
    let option = {};
    // return {}
    option = getPie3D(seriesData, {
      internalDiameterRatio: 0.8,
      customVal: customVal,
      legendOption: { show: false },
      // positiveSequence : true
    });

    let pie2dData = [];
    seriesData.map(item => {
      if (item.value !== 0) {
        pie2dData.push({
          ...item,
          itemStyle: {
            color: 'transparent',
          },
        });
      }
    });

    option.grid3D = {
      show: false,
      boxHeight: 8, //圆环的高度
      width: '100%',
      top: '-6%',
      left: '-25%',
      viewControl: {
        //3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 30, //角度
        distance: windowWidth <= 1600 && windowWidth > minWidth || windowWidth<=1200 ? 190 : 175,//调整视角到主体的距离，类似调整zoom
        rotateSensitivity: 0, //设置为0无法旋转
        zoomSensitivity: 0, //设置为0无法缩放
        panSensitivity: 0, //设置为0无法平移
        autoRotate: true, //自动旋转
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
    option.legend = {
      orient: 'vertical',
      top: 'middle',
      right: 4,
      icon: 'circle',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 14,
      triggerEvent: true,
      tooltip: {
        show: true,
        trigger: 'item',
      },
      formatter: name => {
        const item = seriesData.find(i => {
          return i.name === name;
        });
        return (
          "{name|" + name + "} " + "{b|" + item?.rate + "%}"
        );
      },
      textStyle: {
        rich: {
          name: {
            width: legendTextWidth,
          },
        }
      }
    };

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

  const renderCountEcharts = useMemo(() => {
    return (
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getCountOption()}
        style={{ height: 'calc(100% - 40px)' }}
        className="echarts-for-echarts"
        theme="my_theme"
      />
    );
  }, [WarrantyAnalysis, echarts, windowWidth]);

  return (
    <Card title={title} size="small" bodyStyle={{ height: windowWidthFlag ? 640/2 : 640, paddingTop: 4 }} loading={loading}>
      <Row className={styles.ProductProportionWrapper} style={{ flexDirection: windowWidthFlag ? 'row' : 'column' }}>
        <Col span={windowWidthFlag ? 11 : 24} className={styles.chartItemWrapper} >
          {renderCountEcharts}
          <Row align="center" className={styles.chartNameBox}>
            <span className={styles.name}>次数占比</span>
          </Row>
        </Col>

        {windowWidthFlag ?
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

          :
          <div
            style={{
              flex: 'none',
            }}
          >
            <Divider dashed type={"horizontal"} />
          </div>

        }
        <Col span={windowWidthFlag ? 11 : 24} className={styles.chartItemWrapper}>
          {WarrantyAnalysis.length ? (
            <ReactEcharts
              option={getOption2()}
              style={{ width: '100%', height: 'calc(100% - 40px)' }}
              ref={echarts3D}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          ) : (
              ''
            )}
          <Row align="center" className={styles.chartNameBox}>
            <span className={styles.name}>时长占比</span>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(dvaPropsData)(ProductProportionCard4);
