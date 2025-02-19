import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Spin, Space, Button, DatePicker, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from '../styles.less';
import 'animate.css';
import moment from 'moment';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, sysDashboard }) => ({
  time: sysDashboard.time,
});
const CustomTimeModal = props => {
  const { time, open, onCancel, onDateChange } = props;
  const [date, setDate] = useState();

  useEffect(() => {
    setDate(time)
  }, [time]);

  const renderContent = () => {
    return (
      <div>
        <p style={{ marginBottom: '.625rem', fontWeight: 'bold' }}>请选择时间：</p>
        <Space style={{ width: '100%', marginLeft: '.625rem' }}>
          <RangePicker
            style={{ width: 'calc(100%)' }}
            allowClear={false}
            // picker={'year'}
            value={date}
            onChange={date => {
              setDate(date);
            }}
            popupClassName={styles.datePickerPopup}
          />
          <Button
            type="primary"
            size="small"
            onClick={() => {
              if (date) {
                onDateChange({ key: '自定义', value: date });
              } else {
                message.warning('请选择时间！');
              }
            }}
          >
            确认
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <>
      {open && (
        <div
          className={`${styles.textDescModal} animate__animated animate__fadeIn`}
          style={{ alignItems: 'start' }}
        >
          <div
            className={styles.modalContent}
            style={{ width: 400, marginTop: '20vh', height: 146, paddingTop: 30 }}
          >
            <img
              src="/close_icon.png"
              style={{ position: 'absolute', top: -26, right: -26, cursor: 'pointer' }}
              onClick={() => {
                onCancel();
              }}
            />
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default connect(dvaPropsData)(CustomTimeModal);
