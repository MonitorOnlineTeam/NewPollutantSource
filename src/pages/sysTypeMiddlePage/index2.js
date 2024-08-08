import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Carousel, Button } from 'antd';
import styles from './index2.less';
import 'animate.css';
import webConfig from '../../../public/webConfig';
import { router } from 'umi';
import PageLoading from '@/components/PageLoading';

const dvaPropsData = ({ loading, global }) => ({
  subSysList: global.sysPollutantTypeList,
  configInfo: global.configInfo,
});

const SysTypeMiddlePage = props => {
  const carouselRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [sysList, setSysList] = useState([]);

  const { dispatch, subSysList } = props;

  useEffect(() => {
    getSysPollutantTypeList();
  }, []);

  useEffect(() => {
    let sysList_temp = subSysList.map(item => {
      let description = '',
        featuresList = [];
      switch (item.Name) {
        case '污染源监测监控系统':
          description =
            '污染源监测监控软件能够接入企业固定源监测设备、厂界无组织监测设备、视频监测设备、动态管控设备的数据，实现全天候无人值守的在线监控、预警。该软件配备手机 App，帮助企业随时随地准确的、智能的掌握污染排放现状，高效的实现对污染排放设施的管理，全面响应环保管理要求。';
          featuresList = ['超标报警', '异常数据分析', '排放量综合分析', '移动APP'];
          break;
        case '污染源安装调试系统':
          description =
            '污染源安装调试系统是一个CEMS监测设备安装调试工作内容管理系统，旨在确保CEMS设备从前期勘查、验货、指导/安装、静态调试、动态投运、试运行（包括168小时试运行）、72小时调试检测到联网监控的全过程得到有效管理和控制。';
          featuresList = ['安装调试任务管理', '安装调试过程管理', '安装调试评价分析'];
          break;
        case '污染源智慧运维系统':
          description =
            '污染源监控运维管控系统是一个将传统运维与互联网、大数据等技术相融合的信息平台，它采用“互联网 + 运维”的管理模式，建立了一套集任务派发、异常预警、异常响应、数据分析、质量评估于一体的监管机制。该系统依据运维技术规范、国家法律法规和监督检查指南，实现了监测设备全生命周期管理、预测性维护，以及排污设施数据质量和运维工作质量的监管，提升了运维管理能效。同时，它能在监测数据发现异常时第一时间通知运维人员，及时核实并形成闭环处置流程，降低监管风险。';
          featuresList = [
            '数据分析驾驶仓',
            '任务管理与跟踪',
            '运维督察与跟踪',
            '运维资产管理',
            '移动终端支持',
          ];
          break;
        case '污染源异常数据识别系统':
          description =
            '污染源异常数据识别软件通过科学的数据挖掘与汇聚机制，深度整合了雪迪龙在污染源在线监测领域丰富的行业经验及全国各行业海量的监测数据，构建起一个全面、精准的异常特征信息库。借助超图神经网络、长短期记忆神经网络与自适应遗传算法等深度学习技术手段，建立全国不同在线设备运行指标的横向动态推演比对模型，为监管人员提供科学、客观的异常成因分析及督察建议，精准定位了异常区域、时段及重点监管对象，为非现场监管提供科学依据。';
          featuresList = ['异常分析驾驶舱', '排污画像', '成因分析', '分析报告', '闭环核查'];
          break;
        case '污染源监督核查系统':
          description =
            '污染源监督核查系统是一个污染源监测设备运行合规性核查管理系统，辅助环保人员对监测设备的仪表、DAS、数采仪的数据一致性、量程一致性、参数一致性和设备运维工作的规范性和合规性进行核查，确保CEMS系统的整体性能和监测数据的准确性，为环境保护和企业的合规性运维提供有力支持。';
          featuresList = ['数据一致性核查', '参数一致性核查', '量程一致性核查', '合规性检查'];
          break;
        case '污染源动态质控系统':
          description =
            '污染源动态质控系统将物联网与大数据结合，建立一套了信息化的监测数据质控体系。在传统 CEMS 的基础上搭配质控单元，实现了对污染源烟气设备的零点、量程、线性、响应时间、示值误差等技术指标的定期校验与远程检查。为提高数据质量提供信息化的手段，为设备质控管理提供有效抓手。';
          featuresList = ['数据分析驾驶舱', '定时自动质控', '远程人工抽查', '异常动态质控'];
          break;
      }
      return {
        ...item,
        description,
        featuresList,
      };
    });
    setSysList(sysList_temp);
    // 如果中间页只有一个菜单，直接进入该菜单
    if (subSysList.length === 1) {
      // if (true) {
      sessionStorage.setItem('isShowSelectSystem', 0);
      onSysItemClick(subSysList[0]);
    } else if (subSysList.length) {
      sessionStorage.setItem('isShowSelectSystem', 1);
      setLoading(false);
    }
  }, [subSysList]);

  // 获取系统的污染物类型
  const getSysPollutantTypeList = () => {
    dispatch({
      type: 'global/getSysPollutantTypeList',
    });
  };

  const onSysItemClick = item => {
    let url = item.Url ? new URL(item.Url) : item.Url;
    if (url && (url.protocol === 'http:' || url.protocol === 'https:')) {
      if (webConfig.middlePageOpenMode === 'single') {
        window.location.href = url.href;
      } else {
        window.open(url);
      }
    } else {
      if (webConfig.middlePageOpenMode === 'single') {
        router.push(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`);
      } else {
        window.open(`/sessionMiddlePage?sysInfo=${JSON.stringify(item)}`);
      }
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className={styles.middlePageWrapper}>
      <Carousel
        autoplay={true}
        autoplaySpeed={5000}
        effect="fade"
        dots={{ className: styles.dotsClass }}
        ref={carouselRef}
      >
        {sysList.map(item => {
          return (
            <Row className={`${styles.subSysWrapper}`}>
              <div
                className={styles.subSysContent}
                style={{ backgroundImage: `url(/newLogin/${item.Name}/bg.jpg)` }}
              >
                <Col
                  className={`${styles.content} animate__animated animate__fadeInLeftBig`}
                  // className={`${styles.content}  animate__animated animate__bounceInLeft`}
                  xl={12}
                  lg={24}
                >
                  <div className={styles.logo}></div>
                  <div className={styles.sysName}>{item.Name}</div>
                  <div className={styles.description}>{item.description}</div>
                  <ul className={styles.featuresList}>
                    {item.featuresList.map(itm => {
                      return (
                        <li key={itm}>
                          <div className={styles['triangle-right']}></div>
                          <div className={styles['triangle-right']}></div>
                          <p>{itm}</p>
                        </li>
                      );
                    })}
                  </ul>
                  <Button
                    type="primary"
                    size="large"
                    style={{ borderRadius: 6, fontWeight: 'bold', marginTop: '10%' }}
                    onClick={() => onSysItemClick(item)}
                  >
                    进入系统
                  </Button>
                </Col>
                <Col xl={12} lg={0}></Col>
              </div>
            </Row>
          );
        })}
      </Carousel>
      <div className={`${styles.sysCardList}  animate__animated animate__fadeInDown`}>
        <ul>
          {subSysList.map((item, index) => {
            return (
              <li
                style={{ width: 100 / subSysList.length + '%' }}
                onClick={() => {
                  carouselRef.current.goTo(index);
                }}
              >
                <div className={styles.subSysName}>
                  <img src={`/newLogin/${item.Name}/icon.png`} />
                  <span onClick={() => onSysItemClick(item)}>{item.Name}</span>
                </div>
                <p className={styles.subSysDesc}>{item.TipsName.split('ReactShow')[0]}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default connect(dvaPropsData)(SysTypeMiddlePage);
