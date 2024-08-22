import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Steps, Result, message } from 'antd';
import GenerateModal from '@/pages/AbnormalIdentifyModel/ClueAnalysis/GenerateVerificationTake/GenerateModal.js';
const { Step } = Steps;

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const UpdateDataFlag = props => {
  const { dispatch, DGIMN, open, onCancel, warningId, pointInfo } = props;
  const [stepsList, setStepsList] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getRealWarningList();
  }, []);

  const getRealWarningList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetRelaWarningList',
      payload: {
        warningCode: warningId,
      },
      callback: res => {
        setStepsList(res);
        let currentIndex = res.findIndex(item => item.StatusName === '');
        setCurrent(currentIndex > -1 ? currentIndex : 0);
      },
    });
  };

  // 获取核实详情
  const GetCheckedView = (id) => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetCheckedView',
      payload: { id, type: 1 },
    });
  };

  // 更新线索列表标识
  const updateCluesListTag = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        cluesListTag: Math.random()
          .toString(36)
          .slice(-6),
      },
    });
  };

  return (
    <Modal
      title={`修改数据标记（${pointInfo.EntName} - ${pointInfo.PointName}）`}
      open={open}
      destroyOnClose
      wrapClassName="fullScreenModal"
      mask={false}
      onCancel={onCancel}
      footer={false}
    >
      <Steps
        type="navigation"
        className="site-navigation-steps"
        current={current}
        onChange={value => {
          setCurrent(value);
        }}
        style={{ marginBottom: 20 }}
      >
        {stepsList.map(item => {
          return <Step title={item.warningType} />;
        })}
      </Steps>
      {stepsList.map((item, index) => {
        return (
          <>
            {current === index && (
              <>
                {item.StatusName ? (
                  <Result status="success" title={`${item.StatusName}!`} />
                ) : (
                  <GenerateModal
                    visible={current === index}
                    isShowModal={true}
                    selectedRowKeys={item.warningGuidList}
                    selectedRow={pointInfo}
                    onFinish={(id) => {
                      getRealWarningList();
                      GetCheckedView(id);  // 刷新核实信息
                      updateCluesListTag(); // 刷新线索列表标识
                      // message.success('操作成功！');
                    }}
                  />
                )}
              </>
            )}
          </>
        );
      })}
    </Modal>
  );
};

export default connect(dvaPropsData)(UpdateDataFlag);
