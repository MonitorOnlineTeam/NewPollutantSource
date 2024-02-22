import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Modal, Tooltip } from 'antd';
import styles from '../../styles.less';
import ReactSeamlessScroll from 'rc-seamless-scroll';
import CluesList from '@/pages/AbnormalIdentifyModel/CluesList';

const COLOR = ['#FFC611', '#DBDEE1', '#FF942B'];

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome, AbnormalIdentifyModel }) => ({
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  warningForm: AbnormalIdentifyModel.warningForm,
  loading: loading.effects['AbnormalIdentifyModelHome/GetEntSuspectedRanking'],
});

const RankingContent = props => {
  const {
    dispatch,
    entRequestParams,
    modelType,
    modelBaseType,
    loading,
    warningForm,
    limitScrollNum,
  } = props;
  const [rankDataList, setRankDataList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className={styles.RankingContent}>
      <Spin spinning={!!loading}>
        {rankDataList.length ? (
          <ReactSeamlessScroll
            list={rankDataList}
            wrapperClassName={styles.RankingSeamlessScrollContent}
            hover={true}
            step={0.5}
            limitScrollNum={limitScrollNum}
            // speed={20} style={{ width: '100%', height: '100%' }}
          >
            {rankDataList.map((item, index) => {
              return (
                <Tooltip title={'点击查看线索'}>
                  <Row key={index} className={styles.RankListContent}>
                    <Col flex="100px">
                      <span
                        className={styles.number}
                        style={{
                          backgroundImage: `url(/AbnormalIdentifyModel/rank/ent-${
                            index < 3 ? index + 1 : 'number_bg'
                          }.png)`,
                          width: 46,
                          backgroundPosition: index < 3 ? 'center 8px' : 'center 1px',
                          backgroundSize: 'contain',
                          color: COLOR[index] || '#FFFFFF',
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
                        // // 线索
                        // updateCluesListFormState({
                        //   warningTypeCode: item.code,
                        //   EntCode: entRequestParams.entCode,
                        // });

                        let requestParams_temp = _.cloneDeep(entRequestParams);
                        // 进入线索列表，传入时间、场景类型、企业、污染物
                        updateCluesListFormState({
                          date: [],
                          date1: [
                            requestParams_temp.btime.add(-20, 'month'),
                            requestParams_temp.etime.add(-1, 'day').add(-20, 'month'),
                          ],
                          warningTypeCode: item.code,
                          EntCode: entRequestParams.entCode,
                          PollutantCode:
                            requestParams_temp.pollutantCode === '01,02,03'
                              ? ''
                              : requestParams_temp.pollutantCode,
                          pageSize: 20,
                          pageIndex: 1,
                        });
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
      </Spin>

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
