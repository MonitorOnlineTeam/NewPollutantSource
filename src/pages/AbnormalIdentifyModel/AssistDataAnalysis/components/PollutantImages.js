import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Empty,
  Row,
  Col,
  DatePicker,
  Collapse,
  Button,
  Space,
  Spin,
  Divider,
  Progress,
  message,
} from 'antd';
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from '../../styles.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import PointParams from '@/pages/DataAnalyticalWarningModel/Warning/PointParams';
// import styles from '../styles.less';
const { Panel } = Collapse;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const pollutantOrder = {
  b02: 1, // 流量
  '01': 2, // 实测烟尘、颗粒物
  s02: 3, // 流速
  '02': 4, // 实测so2
  s03: 5, // 温度
  '03': 6, // 实测NOx
  s05: 7, // 湿度
  s01: 8, // O2
  s08: 9, // 静压，压力
};

const leftImagesOrder = {
  '01': 2, // 实测烟尘、颗粒物
  '02': 4, // 实测so2
  '03': 6, // 实测NOx
  s01: 8, // O2,
};

const rightImagesOrder = {
  s02: 3, // 流速
  s03: 5, // 温度
  s05: 7, // 湿度
  s08: 9, // 静压，压力
};

let timer;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  loading: loading.effects['AbnormalIdentifyModel/GetPointParamsRange'],
  reloadLoading: loading.effects['AbnormalIdentifyModel/RegenerateNomalRangeTime'],
});

const Index = props => {
  const { dispatch, title, DGIMN, visible, onCancel, height, loading, reloadLoading, type } = props;
  const [topImages, setTopImages] = useState([]);
  const [leftImages, setLeftImages] = useState([]);
  const [rightImages, setRightImages] = useState([]);
  const [otherImages, setOtherImages] = useState([]);
  const [images, setImages] = useState([]);
  const [rangeTime, setRangeTime] = useState([]);
  const [updateDate, setUpdateDate] = useState({});
  const [runState, setRunState] = useState(false);
  const [progressNum, setProgressNum] = useState(0);
  const [rerunDate, setRerunDate] = useState([moment().subtract('year', 1), moment()]);
  const [paramsModalVisible, setParamsModalVisible] = useState(false);
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    clearTimeout(timer);
    getRunStatus();
  }, [DGIMN]);

  useEffect(() => {
    let leftImages = [];
    let rightImages = [];
    let topImages = [];
    let otherImages = [];
    for (const key in images) {
      if (leftImagesOrder[key]) {
        leftImages.push({
          src: images[key],
          order: leftImagesOrder[key],
          pollutantCode: key,
          updateTime: rangeTime[key] ? rangeTime[key].UpdateTime : '-',
        });
      } else if (rightImagesOrder[key]) {
        rightImages.push({
          src: images[key],
          order: rightImagesOrder[key],
          pollutantCode: key,
          updateTime: rangeTime[key] ? rangeTime[key].UpdateTime : '-',
        });
      } else if (key === 'b02') {
        topImages.push(
          {
            src: images['b02'],
            pollutantCode: 'b02',
            updateTime: rangeTime['b02'] ? rangeTime['b02'].UpdateTime : '-',
          },
          // { src: undefined },
        );
      } else {
        otherImages.push({
          src: images[key],
          // order: rightImagesOrder[key],
          pollutantCode: key,
          updateTime: rangeTime[key] ? rangeTime[key].UpdateTime : '-',
        });
      }
    }

    // if (images['b02']) {
    //   debugger;
    // } else {
    //   setTopImages([]);
    // }
    // console.log('topImages', topImages);
    // console.log('leftImages', leftImages);
    // console.log('rightImages', rightImages);
    setTopImages(topImages);
    setLeftImages(leftImages.sort((a, b) => a.order - b.order));
    setRightImages(rightImages.sort((a, b) => a.order - b.order));
    setOtherImages(otherImages);
  }, [images, rangeTime]);

  // 获取波动范围图表
  const getImages = () => {
    if (DGIMN) {
      dispatch({
        type: 'AbnormalIdentifyModel/GetPointParamsRange',
        payload: {
          DGIMN,
        },
        callback: res => {
          setImages(type === 'stop' ? res.stopImage || [] : res.image);
          let rangeTime = type === 'stop' ? res.stopRangeTime : res.rangeTime;

          setRangeTime(rangeTime);
          let tempUpdateDate = {};
          for (const key in rangeTime) {
            tempUpdateDate[key] = [
              moment(rangeTime[key].BeginTime),
              moment(rangeTime[key].endTime),
            ];
          }
          setUpdateDate(tempUpdateDate);
        },
      });
    }
  };

  // 重新生成正常范围
  const RegenerateNomalRangeTime = pollutantCode => {
    dispatch({
      type: 'AbnormalIdentifyModel/RegenerateNomalRangeTime',
      payload: {
        dgimn: DGIMN,
        pollutantCode: pollutantCode,
        beginTime: moment(updateDate[pollutantCode][0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(updateDate[pollutantCode][1]).format('YYYY-MM-DD 23:59:59'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        isStop: type === 'stop' ? 1 : 0,
      },
      callback: () => {
        getImages();
      },
    });
  };

  const renderImages = (data, flag) => {
    return data.map(item => {
      let element = (
        <div
          style={{
            width: '100%',
            position: 'relative',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            padding: '10px 7%',
          }}
        >
          <img style={{ width: '100%' }} src={item.src} />
          <div className={styles.dataRangeUpdateTimeBox}>
            <div style={{ flex: 1, paddingLeft: 10 }}>
              <RangePicker
                allowClear={false}
                // showTime
                value={updateDate[item.pollutantCode]}
                style={{ width: '100%' }}
                onChange={(date, strDate) => {
                  setUpdateDate({
                    ...updateDate,
                    [item.pollutantCode]: date,
                  });
                }}
              />
            </div>
            <div style={{ width: 80, marginLeft: 10 }}>
              <Button
                type="primary"
                style={{}}
                onClick={() => {
                  debugger;
                  RegenerateNomalRangeTime(item.pollutantCode);
                }}
              >
                重新生成
              </Button>
            </div>
          </div>
          <div className={styles.dataRangeUpdateTimeBox}>
            <span className={styles.updateTime}>
              <ExclamationCircleOutlined style={{ marginRight: 4 }} />
              更新时间：{item.updateTime}
            </span>
          </div>
        </div>
      );
      if (flag) {
        return <Col span={12}>{element}</Col>;
      }
      if (item.src) {
        return element;
      }
      return '';
    });
  };

  const checkNullValues = obj => {
    for (let key in obj) {
      if (obj[key] !== null) {
        return false;
      }
    }
    return true;
  };

  // 获取运行状态
  const getRunStatus = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelRunStatus',
      payload: {
        ModelGuid: 'AutoOpeModel',
        DGIMN: DGIMN,
      },
      callback: res => {
        let isLoading = res !== 100;
        setRunState(isLoading);
        setProgressNum(res);
        if (isLoading) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            getRunStatus();
          }, 30000);
        } else {
          getImages();
        }
      },
    });
  };

  // 重新运行
  const onRerun = () => {
    let start = moment(rerunDate[0]);
    let end = moment(rerunDate[1]);
    // 检查时间差，使用 months 和 years 方法
    const diffInMonths = end.diff(start, 'months');
    const diffInYears = end.diff(start, 'years');

    // 检查是否符合条件：不能大于5年且不能小于3个月
    if (diffInMonths < 3) {
      message.error('时间间隔不能小于3个月，请重新选择！');
      return;
    }
    if (diffInYears > 5) {
      message.error('时间间隔不能大于5年，请重新选择！');
      return;
    }
    dispatch({
      type: 'AbnormalIdentifyModel/AutoOpeModel',
      payload: {
        beginTime: start.format('YYYY-MM-DD 00:00:00'),
        endTime: end.format('YYYY-MM-DD 00:00:00'),
        DGIMN: DGIMN,
      },
      callback: () => {
        setProgressNum(0);
        setRunState(true);
        setTimeout(() => {
          getRunStatus();
        }, 10000);
      },
    });
  };

  const getPageContent = () => {
    let content = '';
    if (!Object.keys(images).length || checkNullValues(images)) {
      content = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    } else {
      content = (
        <Row>
          <Col span={24}>
            <Row>
              <Col span={12}>{renderImages(topImages)}</Col>
              <Col span={12}></Col>
            </Row>
          </Col>
          <Col span={12}>{renderImages(leftImages)}</Col>
          <Col span={12}>{renderImages(rightImages)}</Col>
          {renderImages(otherImages, true)}
        </Row>
      );
    }

    return (
      <Spin
        spinning={runState}
        style={{ position: 'fixed', top: '20%', left: 200 }}
        indicator={
          <div style={{ width: 400, marginLeft: -200 }}>
            <div>重新运行中，请耐心等候...</div>
            <div>
              <Progress percent={progressNum} status="active" style={{ width: '80%' }} />
            </div>
          </div>
        }
      >
        <Row>
          <RangePicker
            style={{ width: 300 }}
            defaultValue={rerunDate}
            onChange={(date, dateString) => {
              setRerunDate(date);
            }}
          />
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={() => {
              confirm({
                icon: <ExclamationCircleOutlined />,
                title: '确认是否重新运行',
                content: '请注意，是否确认删除所有的异常数据识别线索和时间段内的标记！',
                onOk() {
                  onRerun();
                },
                onCancel() {},
              });
            }}
          >
            重新运行
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={() => {
              setParamsModalVisible(true);
            }}
          >
            参数调整
          </Button>
          <Divider style={{ margin: '18px 0' }} />
        </Row>
        {content}
      </Spin>
    );
  };

  return (
    <>
      {visible !== undefined ? (
        <Modal
          centered
          open={visible}
          footer={null}
          wrapClassName="spreadOverModal"
          destroyOnClose
          bodyStyle={{ maxHeight: '100%', overflowY: 'auto' }}
          onCancel={onCancel}
        >
          <h1 style={{ textAlign: 'center' }}>{title}</h1>
          {getPageContent()}
        </Modal>
      ) : (
        <div style={{ overflowY: 'auto', height: height || 'calc(100vh - 205px)' }}>
          <Spin spinning={loading || !!reloadLoading}>{getPageContent()}</Spin>
        </div>
      )}

      <Modal
        title="参数调整"
        centered
        open={paramsModalVisible}
        footer={null}
        wrapClassName="spreadOverModal"
        destroyOnClose
        bodyStyle={{ padding: 0 }}
        onCancel={() => setParamsModalVisible(false)}
      >
        {/* location.query.v */}
        <PointParams
          DGIMN={DGIMN}
          location={{ query: { v: '2' } }}
          onOK={() => setParamsModalVisible(false)}
        />
      </Modal>
    </>
  );
};

export default connect(dvaPropsData)(Index);
