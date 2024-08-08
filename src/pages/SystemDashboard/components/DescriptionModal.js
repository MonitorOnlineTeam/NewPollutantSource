import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Spin, Modal, Row, Col } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from '../styles.less';
import 'animate.css';

const dvaPropsData = ({ loading, sysDashboard, AbnormalIdentifyModel }) => ({
  modelLevelList: AbnormalIdentifyModel.modelLevelList,
  modelTypeList: AbnormalIdentifyModel.modelTypeList,
});
const DescriptionModal = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { dispatch, modelLevelList, modelTypeList, type, style, contentStyle } = props;

  useEffect(() => {
    GetMoldTypeLevelList();
  }, []);

  // 获取级别和分类
  const GetMoldTypeLevelList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetMoldTypeLevelList',
      payload: {
        type: 1, // 过滤掉打标记和数据现象
      },
      callback: res => {},
    });
  };

  // 渲染分级内容
  const renderLevelContent = () => {
    return (
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <div className={styles.itemContent}>
            <p className={styles.descTitle}>严重异常</p>
            <p className={styles.desc}>* 严重影响数据质量，动机定义明确，影响恶劣的</p>
            <div style={{ marginLeft: 20 }}>
              {modelLevelList
                ?.find(model => model.ModelTypeCode === '4')
                ?.ModelList.map((item, i) => {
                  return (
                    <p key={i}>
                      {i + 1}. {item.ModelName}
                    </p>
                  );
                })}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.itemContent}>
            <p className={styles.descTitle}>重点异常</p>
            <p className={styles.desc}>* 影响数据质量，无法判断明显动机，非正常运行的</p>
            <div style={{ marginLeft: 20 }}>
              {modelLevelList
                ?.find(model => model.ModelTypeCode === '3')
                ?.ModelList.map((item, i) => {
                  return (
                    <p key={i}>
                      {i + 1}. {item.ModelName}
                    </p>
                  );
                })}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.itemContent}>
            <p className={styles.descTitle}>一般异常</p>
            <p className={styles.desc}>* 对数据质量影响较小，但仍需要解决的</p>
            <div style={{ marginLeft: 20 }}>
              {modelLevelList
                ?.find(model => model.ModelTypeCode === '2')
                ?.ModelList.map((item, i) => {
                  return (
                    <p key={i}>
                      {i + 1}. {item.ModelName}
                    </p>
                  );
                })}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.itemContent}>
            <p className={styles.descTitle}>轻微异常</p>
            <p className={styles.desc}>* 不影响数据质量，属于管理不规范的</p>
            <div style={{ marginLeft: 20 }}>
              {modelLevelList
                ?.find(model => model.ModelTypeCode === '1')
                ?.ModelList.map((item, i) => {
                  return (
                    <p key={i}>
                      {i + 1}. {item.ModelName}
                    </p>
                  );
                })}
            </div>
          </div>
        </Col>
      </Row>
    );
  };

  // 渲染分类内容
  const renderTypeContent = () => {
    return (
      <Row gutter={[8, 8]}>
        {modelTypeList.map((item, i) => {
          return (
            <Col span={8} key={i}>
              <div className={styles.itemContent}>
                <p className={styles.descTitle} style={{ marginBottom: 10 }}>
                  {item.ModelTypeName}
                </p>
                <div style={{ marginLeft: 20 }}>
                  {item.ModelList.map((model, index) => {
                    return (
                      <p key={index}>
                        {index + 1}. {model.ModelName}
                      </p>
                    );
                  })}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'level':
        return renderLevelContent();
      case 'type':
        return renderTypeContent();
    }
  };

  return (
    <>
      <QuestionCircleOutlined
        style={{ marginLeft: 6, color: '#fff', ...style }}
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <div className={`${styles.textDescModal} animate__animated animate__fadeIn`}>
          <div className={styles.modalContent} style={{ ...contentStyle }}>
            <img
              src="/close_icon.png"
              style={{ position: 'absolute', top: -24, right: -24, cursor: 'pointer' }}
              onClick={() => {
                setIsModalOpen(false);
              }}
            />
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};

DescriptionModal.defaultProps = {
  style: {},
  contentStyle: {},
};
export default connect(dvaPropsData)(DescriptionModal);
