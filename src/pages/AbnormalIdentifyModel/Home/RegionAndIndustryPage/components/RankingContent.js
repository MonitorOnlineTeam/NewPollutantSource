import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Modal, Tooltip } from 'antd';
import styles from '../../styles.less';
import ReactSeamlessScroll from 'rc-seamless-scroll';
import CluesList from '@/pages/AbnormalIdentifyModel/CluesList';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome, AbnormalIdentifyModel }) => ({
  warningForm: AbnormalIdentifyModel.warningForm,
  requestParams: AbnormalIdentifyModelHome.requestParams,
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  // loading: loading.effects['AbnormalIdentifyModelHome/GetSuspectedRanking'],
});

const RankingContent = props => {
  const {
    dispatch,
    requestParams,
    modelType,
    modelBaseType,
    warningForm,
    entRequestParams,
  } = props;
  const [rankDataList, setRankDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        let rankList = res.map(item => {
          return {
            title: item.key,
            date: Date.now(),
            ...item,
          };
        });
        setRankDataList(rankList);
        setLoading(false);
      },
    });
  };

  // 更新异常线索清单model状态
  const updateCluesListFormState = params => {
    dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        warningForm: {
          ...warningForm,
          all: {
            ...warningForm['all'],
            rowKey: undefined,
            scrollTop: 0,
            ...params,
          },
        },
      },
    });
    setTimeout(() => {
      setIsModalOpen(true);
    }, 0);
  };

  // 进入企业
  const onEntList = data => {
    console.log('data', data);
    dispatch({
      type: 'AbnormalIdentifyModelHome/updateState',
      payload: {
        entHomeIsOpen: true,
        entRequestParams: {
          ...entRequestParams,
          entCode: data.entCode,
        },
        currentEntName: data.entName,
      },
    });
  };

  console.log('rankDataList', rankDataList);
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
          <ReactSeamlessScroll style={{ width: '100%', height: '100%' }}></ReactSeamlessScroll>
        </Spin>
      ) : (
        <>
          {rankDataList.length ? (
            <ReactSeamlessScroll
              list={rankDataList}
              style={{ width: '100%', height: '100%' }}
              wrapperClassName={styles.RankingSeamlessScrollContent}
              hover={true}
              step={0.5}
              limitScrollNum={6}
            >
              {rankDataList.map((item, index) => {
                return (
                  <Tooltip title={modelType === 1 ? '点击进入企业' : '点击查看线索'}>
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
                        onClick={() => {
                          if (modelType === 1) {
                            // 企业
                            onEntList({
                              entCode: item.code,
                              entName: item.key,
                            });
                          } else {
                            let requestParams_temp = _.cloneDeep(requestParams);
                            // 进入线索列表，传入时间、场景类型、企业、污染物
                            updateCluesListFormState({
                              date: [],
                              date1: [
                                requestParams_temp.btime.add(-20, 'month'),
                                requestParams_temp.etime.add(-1, 'day').add(-20, 'month'),
                              ],
                              regionCode: requestParams_temp.regionCode || undefined,
                              warningTypeCode: item.code,
                              PollutantCode:
                                requestParams_temp.pollutantCode === '01,02,03'
                                  ? ''
                                  : requestParams_temp.pollutantCode,
                              pageSize: 20,
                              pageIndex: 1,
                            });
                          }
                        }}
                      >
                        {item.key}
                      </Col>
                      <Col flex="100px">{item.val}次</Col>
                    </Row>
                  </Tooltip>
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

      <Modal
        title="异常线索清单"
        wrapClassName="fullScreenModal"
        open={isModalOpen}
        destroyOnClose
        // open={false}
        footer={[]}
        onCancel={() => {
          setIsModalOpen(false);
          // 重置表单
          dispatch({
            type: 'AbnormalIdentifyModel/onReset',
            payload: {
              modelNumber: 'all',
            },
          });
        }}
      >
        <CluesList
          history={props.history}
          showMode="modal"
          tableProps={{
            scroll: { y: 'calc(100vh - 320px)' },
          }}
          match={{
            params: {
              modelNumber: 'all',
            },
          }}
        />
      </Modal>
    </div>
  );
};

export default connect(dvaPropsData)(RankingContent);
