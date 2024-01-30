import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';
import styles from '../../styles.less';

const COLOR = ['#FFC611', '#DBDEE1', '#FF942B'];

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  loading: loading.effects['AbnormalIdentifyModelHome/GetEntSuspectedRanking'],
});

const RankingContent = props => {
  const { dispatch, entRequestParams, modelType, modelBaseType, loading } = props;
  const [rankDataList, setRankDataList] = useState([]);

  useEffect(() => {
    GetSuspectedRanking();
  }, [entRequestParams, modelType, modelBaseType]);

  // 获取排名情况
  const GetSuspectedRanking = () => {
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetEntSuspectedRanking',
      payload: { modelType, modelBaseType },
      callback: res => {
        setRankDataList(res);
      },
    });
  };

  return (
    <div className={styles.RankingContent}>
      <Spin spinning={!!loading}>
        {rankDataList.length ? (
          rankDataList.map((item, index) => {
            return (
              <Row key={index} className={styles.RankListContent}>
                <Col flex="100px">
                  <span
                    className={styles.number}
                    style={{
                      backgroundImage: `url(/AbnormalIdentifyModel/rank/ent-${
                        index < 3 ? index + 1 : 'number'
                      }.png)`,
                      width: 46,
                      backgroundPosition: 'center 8px',
                      backgroundSize: 'contain',
                      color: COLOR[index] || '#FFFFFF',
                    }}
                  >
                    {index < 9 ? '0' + (index + 1) : index + 1}
                  </span>
                </Col>
                <Col flex="auto">{item.key}</Col>
                <Col flex="100px">{item.val}次</Col>
              </Row>
            );
          })
        ) : (
          <div className="notData">
            <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
            <p style={{ color: '#d5d9e2', fontSize: 16, fontWeight: 500 }}>暂无数据</p>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default connect(dvaPropsData)(RankingContent);
