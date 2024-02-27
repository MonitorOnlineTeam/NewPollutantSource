import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Progress, Row, Col } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  loading: loading.effects['AbnormalIdentifyModelHome/GetDataQualityAnalysis'],
});

const DataQualityAnalysis = props => {
  const { dispatch, entRequestParams, loading } = props;
  const [analysisData, setAnalysisData] = useState({});
  const [maxNum, setMaxNum] = useState();

  useEffect(() => {
    GetDataQualityAnalysis();
  }, [entRequestParams]);

  const GetDataQualityAnalysis = () => {
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetDataQualityAnalysis',
      payload: {},
      callback: result => {
        let res = result || {};
        setAnalysisData(res || {});
        let max = Math.max(
          ...[
            res.ExceptionHour,
            res.FaultHour,
            // res.DefendHour,
            res.ExceptionHour,
            res.MissHour,
            res.RenweiHour,
            res.StopHour,
            res.RunHour,
            res.AllHours,
          ],
        );
        setMaxNum(max + max * 0.1);
      },
    });
  };
  return (
    <HomeCard
      title={'数据质量分析'}
      loading={loading}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        // height: 'calc(100% - 110px)',
        // padding: '10px',
        // overflowY: 'auto',
      }}
    >
      <div className={styles.rateBoxWrapper}>
        <div className={styles.Progress}>
          <p className={styles.title}>数据异常率</p>
          <Progress
            percent={analysisData.ExceptionRate}
            strokeColor={'#11C0F9'}
            trailColor="#0D6B8A"
            showInfo={false}
          />
        </div>
        <div className={styles.numberContent}>
          <p className={styles.num}>{analysisData.ExceptionHour}</p>
          <p className={styles.text}>运行异常小时数</p>
        </div>
        <div className={styles.line}></div>
        <div className={styles.numberContent}>
          <p className={styles.num}>{analysisData.ExceptionRate}%</p>
          <p className={styles.text}>异常率</p>
        </div>
      </div>
      <div className={styles.rateBoxWrapper}>
        <div className={styles.Progress}>
          <p className={styles.title}>CEMS运行故障率</p>
          <Progress
            percent={analysisData.CEMSFailureRate}
            strokeColor={'#11C0F9'}
            trailColor="#0D6B8A"
            showInfo={false}
          />
        </div>
        <div className={styles.numberContent}>
          <p className={styles.num}>{analysisData.FaultHour}</p>
          <p className={styles.text}>故障运行小时数</p>
        </div>
        <div className={styles.line}></div>
        <div className={styles.numberContent}>
          <p className={styles.num}>{analysisData.CEMSFailureRate}%</p>
          <p className={styles.text}>故障率</p>
        </div>
      </div>
      <div className={styles.rateBoxWrapper}>
        <div className={styles.Progress}>
          <p className={styles.title}>CEMS运行维护量</p>
          <Progress
            percent={analysisData.EquipmentMaintenanceRate}
            strokeColor={'#11C0F9'}
            trailColor="#0D6B8A"
            showInfo={false}
          />
        </div>
        <div className={styles.numberContent}>
          <p className={styles.num}>{analysisData.DefendHour}</p>
          <p className={styles.text}>运行维护小时数</p>
        </div>
        <div className={styles.line}></div>
        <div className={styles.numberContent}>
          <p className={styles.num}>{analysisData.EquipmentMaintenanceRate}%</p>
          <p className={styles.text}>维护率</p>
        </div>
      </div>
      <div className={styles.rateBoxWrapper}>
        <div className={styles.Progress}>
          <p className={styles.title}>数据缺失率</p>
          <Progress
            percent={analysisData.MissRate}
            strokeColor={'#11C0F9'}
            trailColor="#0D6B8A"
            showInfo={false}
          />
        </div>
        <div className={styles.numberContent}>
          <p className={styles.num}>{analysisData.MissHour}</p>
          <p className={styles.text}>数据缺失小时数</p>
        </div>
        <div className={styles.line}></div>
        <div className={styles.numberContent}>
          <p className={styles.num}>{analysisData.MissRate}%</p>
          <p className={styles.text}>缺失率</p>
        </div>
      </div>
      <div className={styles.groupItemWrapper}>
        <p className={styles.unit}>单位：小时</p>
        <div className={styles.itemInfoBox}>
          <span className={styles.itemName}>总时长</span>
          <div className={styles.itemProgress}>
            <Progress
              style={{ width: '100%' }}
              strokeWidth={12}
              percent={maxNum ? (analysisData.AllHours / maxNum).toFixed(2) * 100 : 0}
              steps={40}
              showInfo={false}
              strokeColor={'#00FFFC'}
              trailColor="#0F255D"
            />
          </div>
          <span className={styles.num}>{analysisData.AllHours}</span>
        </div>
        <div className={styles.itemInfoBox}>
          {/* 排放源运行小时数 */}
          <span className={styles.itemName}>运行</span>
          <div className={styles.itemProgress}>
            <Progress
              style={{ width: '100%' }}
              strokeWidth={12}
              percent={maxNum ? (analysisData.RunHour / maxNum).toFixed(2) * 100 : 0}
              steps={40}
              showInfo={false}
              strokeColor={'#00FFFC'}
              trailColor="#0F255D"
            />
          </div>
          <span className={styles.num}>{analysisData.RunHour}</span>
        </div>
        <div className={styles.itemInfoBox}>
          <span className={styles.itemName}>停炉</span>
          <div className={styles.itemProgress} style={{transform: 'scaleX(-1)'}}>
            <Progress
              style={{ width: '100%' }}
              strokeWidth={12}
              percent={maxNum ? (analysisData.StopHour / maxNum).toFixed(2) * 100 : 0}
              steps={40}
              showInfo={false}
              strokeColor={'#00FFFC'}
              trailColor="#0F255D"
            />
          </div>
          <span className={styles.num}>{analysisData.StopHour}</span>
        </div>
        <div className={styles.itemInfoBox}>
          <span className={styles.itemName}>人为干预</span>
          <div className={styles.itemProgress}>
            <Progress
              style={{ width: '100%' }}
              strokeWidth={12}
              percent={maxNum ? (analysisData.RenweiHour / maxNum).toFixed(2) * 100 : 0}
              steps={40}
              showInfo={false}
              strokeColor={'#00FFFC'}
              trailColor="#0F255D"
            />
          </div>
          <span className={styles.num}>{analysisData.RenweiHour}</span>
        </div>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DataQualityAnalysis);
