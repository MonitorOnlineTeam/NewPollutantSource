/*
 * @Author: JiaQi
 * @Date: 2023-08-07 14:04:08
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-09-15 17:03:25
 * @Description：监测数据阈值异常研判
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs, Row, Col, Space, Button, Divider, message, Spin, Tooltip } from 'antd';
import moment from 'moment';
import styles from '../styles.less';
import NavigationTree from '@/components/NavigationTree';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PollutantImages from './components/PollutantImages';
import Histogram from '@/pages/DataAnalyticalWarningModel/Warning/components/Histogram';
import CorrelationCoefficient from '@/pages/DataAnalyticalWarningModel/Warning/components/CorrelationCoefficient';
import WarningDataAndChart from '@/pages/DataAnalyticalWarningModel/Warning/components/WarningDataAndChart';

const dvaPropsData = ({ loading, dataModel }) => ({});

const AbnormalJudgmentPage = props => {
  const [form] = Form.useForm();
  const { dispatch, displayType, loadLoading, saveLoading } = props;
  const [DGIMN, setDGIMN] = useState(props.DGIMN);
  // const [images, setImages] = useState([]);

  // useEffect(() => {
  //   getImages();
  // }, [DGIMN]);

  // // 获取波动范围图表
  // const getImages = () => {
  //   if (DGIMN) {
  //     dispatch({
  //       type: 'dataModel/GetPointParamsRange',
  //       payload: {
  //         DGIMN,
  //       },
  //       callback: res => {
  //         setImages(res.image);
  //       },
  //     });
  //   }
  // };

  const getPageContent = () => {
    return (
      <Card>
        <Tabs defaultActiveKey={displayType === 'modal' ? '2' : '5'}>
          {/* <Tabs defaultActiveKey={displayType === 'modal' ? '2' : '2'}> */}
          <Tabs.TabPane tab="数据工况" key="5" style={{ overflowY: 'auto' }}>
            <WarningDataAndChart
              DGIMN={DGIMN}
              date={[moment().subtract(1, 'week'), moment()]}
              defaultChartSelected={['氧含量', '烟气湿度', '烟气温度', '流速']}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="正常范围" key="2" style={{ overflowY: 'auto' }}>
            <PollutantImages DGIMN={DGIMN} height="calc(100vh - 216px)" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="密度分布直方图" key="3" style={{ overflowY: 'auto' }}>
            <Histogram DGIMN={DGIMN} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="相关系数表" key="4" style={{ overflowY: 'auto' }}>
            <CorrelationCoefficient DGIMN={DGIMN} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  };

  // 弹窗
  if (displayType === 'modal') {
    return getPageContent();
  }

  return (
    <>
      <NavigationTree
        showIndustry
        propsParams={{
          // ModelFlag: 'ModelFlag',
          // industryTypeCode: '1',
          outputType: 0,
          StopPointFlag: true,
        }}
        // checkpPol="2"
        polShow
        domId="#AbnormalJudgmentPage"
        onItemClick={value => {
          console.log('value', value);
          if (value[0].IsEnt === false) {
            setDGIMN(value[0].key);
          }
        }}
      />
      <div id="AbnormalJudgmentPage">
        <BreadcrumbWrapper>{getPageContent()}</BreadcrumbWrapper>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(AbnormalJudgmentPage);
