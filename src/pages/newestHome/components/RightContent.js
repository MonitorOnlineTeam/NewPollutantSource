/**
 * 功能：首页
 * 创建人：jab
 * 创建时间：2021.11.03
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Card,
  Button,
  Select,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
  Popover,
  Radio,
  Spin,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon';
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading';
import moment from 'moment';
import CardHeader from './publicComponents/CardHeader';
import MoreBtn from './publicComponents/MoreBtn';
import styles from '../style.less';
import MissingDataRateModal from './springModal/missingDataRate/MissingDataRateModel';
import AbnormalAlarmRateModal from './springModal/abnormalAlarmRate';
import OperationalExpiraModal from './springModal/operationalExpiration';
import OverVerifyLstModal from '@/pages/IntelligentAnalysis/dataAlarm/overVerifyRate/components/OverVerifyLstModal';
import TransmissionefficiencyModal from '@/pages/IntelligentAnalysis/newTransmissionefficiency/entIndexModal';
import NetworkRateStatisticsModal from './springModal/networkRateStatistics';
// import AlarmResponseTimeoutRateModal from './springModal/abnormalWorkStatistics'
import AlarmResponseTimelyRateModal from './springModal/alarmResponseTimelyRateModal';
import { fontSizeFn } from '@/pages/SystemDashboard/CONST.js';
import screenStyles from '@/pages/screenStyle.less';

const { Option } = Select;

const namespace = 'newestHome';

// const subjectFontSize = 14;

const dvaPropsData = ({ loading, newestHome, operationExpirePoint, global }) => ({
  effectiveTransmissionLoading: loading.effects[`${namespace}/GetEffectiveTransmissionRateList`],
  effectiveTransmissionList: newestHome.effectiveTransmissionList,
  dataAlarmResLoading: loading.effects[`${namespace}/GetAlarmResponse`],
  dataAlarmResData: newestHome.dataAlarmResData,
  networkingLoading: loading.effects['networkRateStatistics/getHomePageNetworkingRate'],
  operationExpireLoading: loading.effects['operationExpirePoint/getOperationExpirePointList'],
  operationExpiraData: operationExpirePoint.totalDatas,
  pollType: newestHome.pollType,
  latelyDays30: newestHome.latelyDays30,
  latelyDays7: newestHome.latelyDays7,
  subjectFontSize: newestHome.subjectFontSize,
  operationSettingInfo: global.operationSettingInfo,
});

const dvaDispatch = dispatch => {
  return {
    updateState: (payload, name) => {
      //更新参数
      dispatch({
        type: `${name ? name : namespace}/updateState`,
        payload: { ...payload },
      });
    },
    GetEffectiveTransmissionRateList: payload => {
      //传输有效率
      dispatch({
        type: `${namespace}/GetEffectiveTransmissionRateList`,
        payload: payload,
      });
    },
    GetAlarmResponse: payload => {
      //异常数据总览
      dispatch({
        type: `${namespace}/GetAlarmResponse`,
        payload: payload,
      });
    },
    GetHomePageNetworkingRate: (payload, callback) => {
      //实时联网率
      dispatch({
        type: 'networkRateStatistics/getHomePageNetworkingRate',
        payload: payload,
        callback: callback,
      });
    },
    GetOperationExpirePointList: (payload, callback) => {
      //运维到期点位
      dispatch({
        type: `operationExpirePoint/getOperationExpirePointList`,
        payload: payload,
        callback: callback,
      });
    },
    MissingRateDataModal: (payload, callback) => {
      //缺失数据报警响应率
      dispatch({
        type: 'MissingRateDataModal/updateState',
        payload: {
          queryPar: {
            beginTime: payload.beginTime,
            endTime: payload.endTime,
          },
        },
      });
    },
    AbnormalResRate: (payload, callback) => {
      //异常报警报警响应率
      dispatch({
        type: 'abnormalResRate/updateState',
        payload: {
          searchForm: {
            PollutantType: '',
          },
        },
      });
    },
  };
};
const Index = props => {
  const [form] = Form.useForm();

  const {
    pollType,
    latelyDays7,
    latelyDays30,
    dataAlarmResData,
    subjectFontSize,
    operationSettingInfo: { TaskPlanType },
  } = props;

  useEffect(() => {
    initData();
  }, []);

  const initData = value => {
    getEffectiveTransmissionRateList(latelyDays7);
    getAlarmResponse(latelyDays7);
    getHomePageNetworkingRate();
  };
  useEffect(() => {
    if (TaskPlanType) {
      getOperationExpirePointList(); //运维监测点信息
    }
  }, [TaskPlanType]);

  const getEffectiveTransmissionRateList = date => {
    //传输有效率
    props.GetEffectiveTransmissionRateList({
      pollutantType: pollutantType,
      ...date,
    });
  };

  const getAlarmResponse = date => {
    //异常数据总览
    props.GetAlarmResponse({
      pollutantType: pollutantType,
      ...date,
    });
  };

  const [effectiveTransBtnCheck, setEffectiveTransBtnCheck] = useState(latelyDays7);
  const effectiveTransClick = key => {
    //有效传输率 切换日期
    setEffectiveTransBtnCheck(key);
    getEffectiveTransmissionRateList(key);
  };

  const [dataAlarmResBtnCheck, setDataAlarmResBtnCheck] = useState(latelyDays7);
  const dataAlarmResClick = key => {
    //数据报警响应 切换日期
    setDataAlarmResBtnCheck(key);
    getAlarmResponse(key);
  };

  const [networking, setNetworking] = useState({
    networkingRate: '0.00',
    networkingCount: 0,
    offLineCount: 0,
  });
  const getHomePageNetworkingRate = () => {
    //实时联网率
    props.GetHomePageNetworkingRate(
      {
        PollutantType: pollutantType,
      },
      res => {
        if (res) {
          let data = res;
          setNetworking({
            networkingRate: data.NetworkingRate,
            networkingCount: data.NetworkingCount,
            offLineCount: data.OffLineCount,
          });
        }
      },
    );
  };

  const getOperationExpirePointList = () => {
    //运维到期点位
    props.GetOperationExpirePointList(
      {
        PollutantType: pollutantType,
      },
      () => {},
    );
  };
  const moreBtnClick = type => {
    switch (type) {
      case 'operationExpira':
        props.updateState({ checkName: '0~7日' }, 'operationExpirePoint'); //防止受运维到期点位统计页面影响
        setOperationalExpiraVisible(true);
        break;
      case 'effectiveTrans':
        setTVisible(true);
        break;
      case 'realTimeNetwork':
        setNetworkVisible(true);
        break;
    }
  };
  const realTimeNetworkOption = () => {
    let option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      color: ['#298CFB', '#FCA522'],
      title: {
        text: networking.networkingRate == '-' ? '-' : networking.networkingRate + '%',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#fff',
          fontSize: fontSizeFn(18),
          align: 'center',
          fontWeight: 'bold',
        },
      },
      series: [
        {
          name: '实时联网率',
          type: 'pie',
          radius: ['84%', '100%'],
          avoidLabelOverlap: false,
          label: { normal: { show: false, position: 'center' } },
          data: [
            { value: networking.networkingRate, name: '已完成' },
            {
              value: networking.networkingRate == '-' ? 0 : 100 - networking.networkingRate,
              name: '未完成',
            },
          ],
          startAngle: 330, //起始角度
          hoverAnimation: false, //悬浮效果
          // silent: true,
        },
      ],
    };
    return option;
  };

  const { effectiveTransmissionList } = props;

  const effectiveTransOption = () => {
    let time = effectiveTransmissionList[0]
      ? effectiveTransmissionList.map(item => moment(item.monitorTime).format('MM/DD'))
      : [];

    let value = effectiveTransmissionList[0]
      ? effectiveTransmissionList.map(item => item.effectiveTransmissionRate)
      : [];

    const option = {
      //传输有效率

      color: '#298CFB',
      tooltip: {
        trigger: 'axis', //触发类型；轴触发，axis则鼠标hover到一条柱状图显示全部数据，item则鼠标hover到折线点显示相应数据，
        formatter: function(params, ticket, callback) {
          let name = params[0].name;
          //值
          let value = '';
          params.map(item => {
            value += `${item.marker} ${item.seriesName}: ${
              item.value == 0 ? '0.00' : item.value
            }% <br />`;
          });
          return name + '<br />' + value;
        },
        backgroundColor: 'rgba(46, 57, 80, 1)', // 提示框浮层的背景颜色。
        padding: [fontSizeFn(14), fontSizeFn(12), fontSizeFn(14), fontSizeFn(10)],
        axisPointer: {
          // 坐标轴指示器配置项。
          type: 'line', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
          snap: true, // 坐标轴指示器是否自动吸附到点上
          lineStyle: {
            color: '#545555',
            opacity: 0.5,
            width: 1,
          },
        },
        textStyle: {
          color: '#fff', // 修改文字颜色为白色
        },
        borderColor: 'rgba(46, 57, 80, 1)', // 修改边框颜色
      },
      grid: {
        left: fontSizeFn(40),
        right: fontSizeFn(20),
        bottom: fontSizeFn(40),
        top: fontSizeFn(20),
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: time,
        axisLine: {
          //x轴
          lineStyle: {
            color: '#545555',
            width: 1,
          },
        },
        axisTick: {
          //x轴 去掉刻度
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: fontSizeFn(12),
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false }, //y轴
        axisTick: { show: false },
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          textStyle: {
            color: '#fff',
            fontSize: fontSizeFn(12),
          },
        },
        splitLine: {
          //x轴分割线
          lineStyle: {
            type: 'dashed',
            color: '#545555',
            width: 1,
          },
        },
      },
      series: [
        {
          name: props.type,
          data: value,
          type: 'line',
          smooth: true,
          symbol: 'circle', //设定为实心点
          symbolSize: 10, //设定实心点的大小
        },
      ],
    };
    return option;
  };

  const dataAlarmResOption = {
    //异常数据总览
    tooltip: { show: false },
    grid: { top: 0, left: fontSizeFn(124), right: fontSizeFn(68), bottom: 0 },
    xAxis: { show: false, type: 'value' },
    yAxis: {
      type: 'category',
      data: ['报警响应及时率', '缺失报警响应率', '异常报警响应率', '超标报警核实率'],
      // data: ['报警响应超时率', '缺失报警响应率', '异常报警响应率', '超标报警核实率'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        margin: fontSizeFn(124),
        textStyle: { color: '#fff', align: 'left', fontSize: fontSizeFn(13) },
      },
    },
    series: [
      {
        type: 'bar', //显示背景图
        data: [100, 100, 100, 100],
        label: {
          normal: {
            show: true,
            position: 'right',
            //通过formatter函数来返回想要的数据
            formatter: function(params) {
              for (let i = 0; i < dataAlarmResData.length; i++) {
                if (params.dataIndex == i) {
                  return dataAlarmResData[i] == '-'
                    ? '-'
                    : `${
                        dataAlarmResData[i] == 100
                          ? Number(dataAlarmResData[i]).toFixed(1)
                          : dataAlarmResData[i]
                      }%`;
                }
              }
            },
            fontSize: subjectFontSize,
            color: '#fff',
            padding: [0, 0, 0, fontSizeFn(12)],
          },
        },
        itemStyle: { normal: { color: '#2E3647' }, barBorderRadius: [15, 15, 15, 15] },
        barWidth: '8px', // 柱形的宽度
        barGap: '-100%', // Make series be ove
        hoverAnimation: false, //为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面
        // silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面
        avoidLabelOverlap: true,
      },
      {
        type: 'bar',
        data: dataAlarmResData,
        label: { normal: { show: false } },
        itemStyle: {
          normal: {
            color: function(params) {
              var colorList = ['#4FBCDC', '#2E7AEB', '#FFCC00', '#FF0000'];
              return colorList[params.dataIndex];
            },
            barBorderRadius: [15, 15, 15, 15],
          },
        },
        barWidth: '8px', // 柱形的宽度
      },
    ],
  };

  const operationExpiraEchartsRef = useRef(null);

  // const { operationExpiraData } = props;

  // const operationExpiraOption = {
  //   //点位到期统计
  //   title: {
  //     text: '点位统计', //图形标题，配置在中间对应位置
  //     left: 'center',
  //     top: '44%',
  //     textStyle: {
  //       color: '#fff',
  //       fontSize: fontSizeFn(18),
  //       align: 'center',
  //       fontWeight: 400,
  //     },
  //   },
  //   tooltip: { show: false },
  //   legend: { show: false },
  //   color: ['#FFB900', '#F76890', '#2D8BCD', '#2AFAA4'],
  //   series: [
  //     {
  //       name: '点位统计',
  //       type: 'pie',
  //       radius: ['35%', '60%'],
  //       avoidLabelOverlap: false,
  //       hoverAnimation: false,
  //       minAngle: 90, //最小角度
  //       label: {
  //         position: 'outer',
  //         alignTo: 'edge', // 'edge'：文字对齐，文字的边距由 label.margin 决定。
  //         formatter: '{name|{b}}\n{num|{c}个}',
  //         margin: 0,
  //         lineHeight: 20,
  //         rich: {
  //           name: {
  //             fontSize: subjectFontSize,
  //           },
  //           num: {
  //             fontSize: fontSizeFn(16),
  //             color: '#fff',
  //             padding: [fontSizeFn(8), 0, 0, 0],
  //           },
  //         },
  //       },
  //       emphasis: {
  //         label: {
  //           show: true, //高亮是标签的样式
  //         },
  //       },
  //       labelLine: {
  //         normal: {
  //           length: '3%', // 视觉引导线第一段的长度。
  //           length2: '28%', //视觉引导线第二段的长度。
  //         },
  //       },
  //       data: [
  //         {
  //           value: operationExpiraData.notExpired7,
  //           name: '0-7日内到期',
  //           label: { color: '#FFB900' },
  //         },
  //         {
  //           value: operationExpiraData.notExpired30,
  //           name: '15-30日内到期',
  //           label: { color: '#F76890' },
  //         },
  //         {
  //           value: operationExpiraData.notExpired14,
  //           name: '8-14日内到期',
  //           label: { color: '#2D8BCD' },
  //         },
  //         { value: operationExpiraData.overdue7, name: '过期7日内', label: { color: '#2AFAA4' } },
  //       ],
  //     },
  //   ],
  // };

  const operationExpiraOption = () => {
    const { operationExpiraData } = props;
    let option = {
      color: ['#2C8BCD', '#FFB901', '#27D8A1', '#384EBE'],
      title: {
        text: '点位统计',
        top: 'center',
        left: 'center',
        textStyle: {
          fontSize: fontSizeFn(18),
          // fontWeight: 'bold',
          color: '#fff',
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
          data: [
            {
              value: operationExpiraData.notExpired7,
              name: '0-7日内到期',
              label: { color: '#FFB900' },
            },
            {
              value: operationExpiraData.notExpired30,
              name: '15-30日内到期',
              label: { color: '#F76890' },
            },
            {
              value: operationExpiraData.notExpired14,
              name: '8-14日内到期',
              label: { color: '#2D8BCD' },
            },
            { value: operationExpiraData.overdue7, name: '过期7日内', label: { color: '#2AFAA4' } },
          ],
        },
      ],
    };

    return option;
  };

  const dataAlarmRes = e => {
    switch (e.name) {
      case '缺失报警响应率':
        setMissingRateVisible(true);
        break;
      case '异常报警响应率':
        setAbnormalAlarmRateVisible(true);
        break;
      case '超标报警核实率':
        setOverVisible(true);
        break;
      case '报警响应及时率':
        setAlarmResponseTimelyVisible(true);
        break;
      // case'报警响应超时率':
      // setAlarmResponseVisible(true)
      // break;
    }
  };
  const { effectiveTransmissionLoading } = props; //有效传输率
  const { dataAlarmResLoading } = props; //数据报警响应
  const { networkingLoading } = props; //实时联网率
  const { operationExpireLoading } = props; //运维到期点位
  const { operationExpiraData } = props; // 运维到期点位
  const [missingRateVisible, setMissingRateVisible] = useState(false);
  const [abnormalAlarmRateVisible, setAbnormalAlarmRateVisible] = useState(false);
  const [operationalExpiraVisible, setOperationalExpiraVisible] = useState(false);
  const [OverVisible, setOverVisible] = useState(false);
  const [TVisible, setTVisible] = useState(false);
  const [networkVisible, setNetworkVisible] = useState(false);
  // const [alarmResponseVisible,setAlarmResponseVisible] = useState(false)
  const [alarmResponseTimelyVisible, setAlarmResponseTimelyVisible] = useState(false);

  const pollutantType = pollType[props.type];
  const isHideIVError = (pollutantType == 1 || configInfo.IsShowProjectRegion); // 废水和宝武项目不显示示值误差

  const dataAlarmEcharts = useMemo(() => {
    return (
      <div style={{ height: 'calc(100% - 1.375rem)', padding: '.625rem 1.5rem .9375rem' }}>
        <ReactEcharts
          option={dataAlarmResOption}
          style={{ height: '100%', width: '100%' }}
          onEvents={{ click: dataAlarmRes }}
        />
      </div>
    );
  }, [dataAlarmResData]);

  return (
    <div>
      <Spin spinning={networkingLoading}>
        <div className={styles.realTimeNetworkSty}>
          <CardHeader title="实时联网率" />
          <div style={{ paddingTop: '1.875rem' }}>
            <Row
              align="bottom"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <ReactEcharts
                option={realTimeNetworkOption(1)}
                style={{ width: fontSizeFn(98), height: fontSizeFn(98) }}
              />
              <div style={{ flex: 1 }}>
                <Row align="middle">
                  <div
                    className={styles.realTimeNetworkLegend}
                    style={{ background: '#298CFB' }}
                  ></div>
                  <div>已联网监测点数：</div>
                  {networking.networkingCount}
                  <span>个</span>
                </Row>
                <Row align="middle" style={{ paddingTop: '.5rem' }}>
                  <div
                    className={styles.realTimeNetworkLegend}
                    style={{ background: '#FCA522' }}
                  ></div>
                  <div>未联网监测点数：</div>
                  {networking.offLineCount}
                  <span>个</span>
                </Row>
              </div>
            </Row>

            <MoreBtn
              className={styles.moreBtnAbsoluteSty}
              type="realTimeNetwork"
              moreBtnClick={moreBtnClick}
            />
          </div>
        </div>
      </Spin>

      {effectiveTransmissionLoading ? (
        <Spin spinning={effectiveTransmissionLoading}>
          <div className={styles.effectiveTrans}></div>
        </Spin>
      ) : (
        <div className={styles.effectiveTrans} style={{ marginBottom: '0.5625rem', height: isHideIVError ? '' : '17.625rem', padding: 0, }}>
          {/**有效传输率 */}
          <CardHeader
            btnClick={effectiveTransClick}
            showBtn
            type="week"
            btnCheck={effectiveTransBtnCheck}
            title="有效传输率"
          />
          <div style={{ height: 'calc(100% - 68px)', padding: 0, paddingLeft: '1.3125rem' }}>
            <ReactEcharts
              option={effectiveTransOption()}
              style={{ height: '100%', width: '100%', paddingTop: 0, }}
            />
            <MoreBtn
              className={styles.moreBtnAbsoluteSty}
              type="effectiveTrans"
              moreBtnClick={moreBtnClick}
            />
          </div>
        </div>
      )}
      <Spin spinning={dataAlarmResLoading}>
        {/* <div
          className={styles.dataAlarmRes}
          // style={{ height: TaskPlanType == 1 ? '16.8125rem' : '18.25rem' }}
          style={{ height: pollutantType == 1 ? TaskPlanType == 1 ? '16.8125rem' : '18.25rem' : '22.8125rem' }}

        > */}
        <div className={styles.planOpera} style={{ height: configInfo.IsShowProjectRegion ? '18.25rem' : isHideIVError ? '16.8125rem' : '22.8125rem' }}>

          {/**异常数据总览 */}
          <CardHeader
            btnClick={dataAlarmResClick}
            showBtn
            type="week"
            btnCheck={dataAlarmResBtnCheck}
            title="异常数据总览"
          />
          {dataAlarmEcharts}
        </div>
      </Spin>

      {operationExpireLoading ? (
        <Spin spinning={operationExpireLoading}>
          <div className={styles.operationExpira} style={{ height: isHideIVError ? '' : '16.5625rem' }}></div>
        </Spin>
      ) : (
        <div className={styles.operationExpira} style={{ height: isHideIVError ? '' : '16.5625rem' }}>
          {/**运维到期点位 */}
          <CardHeader btnClick={dataAlarmResClick} title="运维到期点位" />
          {/* <div style={{ height: '100%', paddingRight: '1.3125rem' }}>
              <ReactEcharts
                option={operationExpiraOption}
                style={{ height: '100%', width: '100%' }}
                ref={operationExpiraEchartsRef}
              />
            </div> */}
          <Row style={{ height: 'calc(100% - 2.25rem)', padding: 0 }}>
            <Col span={10}>
              <ReactEcharts
                option={operationExpiraOption()}
                style={{ height: '100%' }}
                className="echarts-for-echarts"
                theme="my_theme"
              />
            </Col>
            {/* ['#2C8BCD', '#FFB901', '#27D8A1', '#384EBE'] */}
            <Col span={14} className="center">
              <Row className={screenStyles.chartLegendWrapper}>
                <Col span={24} className={screenStyles.lengendItem}>
                  <div className={screenStyles.label}>
                    <i style={{ backgroundColor: '#2C8BCD' }}></i>
                    <span className="textOverflow" style={{ color: '#2C8BCD' }}>
                      0-7日内到期
                    </span>
                  </div>
                  <div className={screenStyles.value}>{operationExpiraData.notExpired7}个</div>
                </Col>
                <Col span={24} className={screenStyles.lengendItem}>
                  <div className={screenStyles.label}>
                    <i style={{ backgroundColor: '#FFB901' }}></i>
                    <span className="textOverflow" style={{ color: '#FFB901' }}>15-30日内到期</span>
                  </div>
                  <div className={screenStyles.value}>{operationExpiraData.notExpired30}个</div>
                </Col>
                <Col span={24} className={screenStyles.lengendItem}>
                  <div className={screenStyles.label}>
                    <i style={{ backgroundColor: '#27D8A1' }}></i>
                    <span className="textOverflow" style={{ color: '#27D8A1' }}>8-14日内到期</span>
                  </div>
                  <div className={screenStyles.value}>{operationExpiraData.notExpired14}个</div>
                </Col>
                <Col span={24} className={screenStyles.lengendItem}>
                  <div className={screenStyles.label}>
                    <i style={{ backgroundColor: '#384EBE' }}></i>
                    <span className="textOverflow" style={{ color: '#384EBE' }}>过期7日内</span>
                  </div>
                  <div className={screenStyles.value}>{operationExpiraData.overdue7}个</div>
                </Col>
              </Row>
            </Col>
          </Row>
          <MoreBtn
            className={styles.moreBtnAbsoluteSty}
            type="operationExpira"
            moreBtnClick={moreBtnClick}
          />
        </div>
      )}

      <MissingDataRateModal //缺失报警响应率弹框
        type={'ent'}
        pollutantType={pollutantType}
        time={[moment(dataAlarmResBtnCheck.beginTime), moment(dataAlarmResBtnCheck.endTime)]}
        missingRateVisible={missingRateVisible}
        missingRateCancel={() => {
          setMissingRateVisible(false);
          props.MissingRateDataModal(dataAlarmResBtnCheck);
        }}
      />
      <AbnormalAlarmRateModal //异常报警响应率弹框
        type={pollutantType}
        visible={abnormalAlarmRateVisible}
        time={[moment(dataAlarmResBtnCheck.beginTime), moment(dataAlarmResBtnCheck.endTime)]}
        onCancel={() => {
          setAbnormalAlarmRateVisible(false);
          props.AbnormalResRate();
        }}
      />
      <OperationalExpiraModal
        type={pollutantType}
        visible={operationalExpiraVisible}
        onCancel={() => {
          setOperationalExpiraVisible(false);
          props.updateState({ checkName: '0~7日' }, 'operationExpirePoint'); //防止影响运维到期点位统计页面
        }}
      />
      <OverVerifyLstModal //超标报警核实率
        beginTime={dataAlarmResBtnCheck.beginTime}
        endTime={dataAlarmResBtnCheck.endTime}
        type={pollutantType}
        TVisible={OverVisible}
        TCancle={() => {
          setOverVisible(false);
        }}
      />
      <TransmissionefficiencyModal //有效传输率弹框
        beginTime={effectiveTransBtnCheck.beginTime}
        endTime={effectiveTransBtnCheck.endTime}
        TVisible={TVisible}
        TCancle={() => {
          setTVisible(false);
        }}
        pollutantType={pollutantType}
      />
      <NetworkRateStatisticsModal //实时联网率
        networkRateVisible={networkVisible}
        networkType={pollutantType}
        networkRateCancel={() => {
          setNetworkVisible(false);
        }}
      />
      <AlarmResponseTimelyRateModal //报警响应及时率弹框
        visible={alarmResponseTimelyVisible}
        type={pollutantType}
        onCancel={() => {
          setAlarmResponseTimelyVisible(false);
        }}
        time={[moment(dataAlarmResBtnCheck.beginTime), moment(dataAlarmResBtnCheck.endTime)]}
      />
      {/* <AlarmResponseTimeoutRateModal  //报警响应超时率弹框
        modalType="alarmResponse"
        visible={alarmResponseVisible}
        type={pollutantType}
        onCancel={()=>{setAlarmResponseVisible(false)}}
        time={[moment(dataAlarmResBtnCheck.beginTime),moment(dataAlarmResBtnCheck.endTime)]}
      /> */}
    </div>
  );
};
export default connect(
  dvaPropsData,
  dvaDispatch,
)(Index);
