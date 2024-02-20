import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Empty, Row, Col, DatePicker, Collapse, Button, Space, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from '../../styles.less';
// import styles from '../styles.less';
const { Panel } = Collapse;
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

  useEffect(() => {
    getImages();
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
          setRangeTime(res.rangeTime);
          let tempUpdateDate = {};
          for (const key in res.rangeTime) {
            tempUpdateDate[key] = [
              moment(res.rangeTime[key].BeginTime),
              moment(res.rangeTime[key].EndTime),
            ];
          }
          setUpdateDate(tempUpdateDate);
        },
      });
    }
  };

  // 重新生成正常范围
  const RegenerateNomalRangeTime = pollutantCode => {
    debugger;
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
    console.log('data', data);
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

  const getPageContent = () => {
    if (!Object.keys(images).length || checkNullValues(images)) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    return (
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
  };

  return (
    <>
      {visible !== undefined ? (
        <Modal
          centered
          // title="超标报警核实率"
          visible={visible}
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
    </>
  );
};

export default connect(dvaPropsData)(Index);
