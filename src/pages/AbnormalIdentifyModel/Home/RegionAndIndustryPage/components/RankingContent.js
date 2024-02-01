import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Card } from 'antd';
import styles from '../../styles.less';
import ReactSeamlessScroll from 'react-seamless-scroll';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  requestParams: AbnormalIdentifyModelHome.requestParams,
  // loading: loading.effects['AbnormalIdentifyModelHome/GetSuspectedRanking'],
});

const RankingContent = props => {
  const { dispatch, requestParams, modelType, modelBaseType } = props;
  const [rankDataList, setRankDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetSuspectedRanking();
  }, [requestParams, modelType, modelBaseType]);

  // 获取排名情况
  const GetSuspectedRanking = () => {
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetSuspectedRanking',
      payload: { modelType, modelBaseType },
      callback: res => {
        setRankDataList(res);
        setLoading(false);
      },
    });
  };

  return (
    <div className={styles.RankingContent}>
      {!!loading ? (
        // {true ? (
        <Spin
          spinning={true}
          // style={{
          //   width: '100%',
          //   height: '100%',
          //   display: 'flex',
          //   position: 'absolute',
          //   top: 0,
          //   left: 0,
          //   zIndex: 4,
          //   opacity: 1,
          // }}
        >
          <ReactSeamlessScroll
            speed={20}
            style={{ width: '100%', height: '100%' }}
          ></ReactSeamlessScroll>
        </Spin>
      ) : (
        <>
          {rankDataList.length ? (
            <ReactSeamlessScroll speed={20} style={{ width: '100%', height: '100%' }}>
              {rankDataList.map((item, index) => {
                return (
                  <Row className={styles.RankListContent}>
                    <Col flex="100px">
                      <span
                        className={styles.number}
                        style={{
                          backgroundImage: `url(/AbnormalIdentifyModel/rank/${
                            index < 3 ? index + 1 : 'number'
                          }.png)`,
                        }}
                      >
                        {index < 9 ? '0' + (index + 1) : index + 1}
                      </span>
                    </Col>
                    <Col
                      flex="auto"
                      style={{
                        maxWidth: 'calc(100% - 200px)',
                        // width: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.key}
                    </Col>
                    <Col flex="100px">{item.val}次</Col>
                  </Row>
                );
              })}
            </ReactSeamlessScroll>
          ) : (
            <div className="notData">
              <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
              <p style={{ color: '#d5d9e2', fontSize: 16, fontWeight: 500 }}>暂无数据</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default connect(dvaPropsData)(RankingContent);
