import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Empty, Row, Col } from 'antd';
// import styles from '../styles.less';

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
  s01: 8, // O2
};

const rightImagesOrder = {
  s02: 3, // 流速
  s03: 5, // 温度
  s05: 7, // 湿度
  s08: 9, // 静压，压力
};

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const Index = props => {
  const { title, images, visible, onCancel } = props;
  const [topImages, setTopImages] = useState([]);
  const [leftImages, setLeftImages] = useState([]);
  const [rightImages, setRightImages] = useState([]);

  useEffect(() => {
    let leftImages = [];
    let rightImages = [];
    for (const key in images) {
      if (leftImagesOrder[key]) {
        leftImages.push({
          src: images[key],
          order: leftImagesOrder[key],
          pollutantCode: key,
        });
      }
      if (rightImagesOrder[key]) {
        rightImages.push({
          src: images[key],
          order: rightImagesOrder[key],
          pollutantCode: key,
        });
      }
      // console.log('images', images);
    }

    if (images['b02']) {
      setTopImages([
        {
          src: images['b02'],
        },
        // { src: undefined },
      ]);
    } else {
      setTopImages([]);
    }
    // console.log('topImages', topImages);
    // console.log('leftImages', leftImages);
    // console.log('rightImages', rightImages);

    setLeftImages(leftImages.sort((a, b) => a.order - b.order));
    setRightImages(rightImages.sort((a, b) => a.order - b.order));
  }, [images]);

  const renderImages = data => {
    return data.map(item => {
      return <img style={{ width: '86%' }} src={item.src} />;
    });
  };

  const getPageContent = () => {
    if (!Object.keys(images).length) {
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
        <div style={{ overflowY: 'auto', height: ' calc(100vh - 205px)' }}>{getPageContent()}</div>
      )}
    </>
  );
};

export default connect(dvaPropsData)(Index);
