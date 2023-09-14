import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './styles.less';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const Index = props => {
  const { children, style, title } = props;
  // const [visible, setVisible] = useState([]);

  useEffect(() => {}, []);

  //

  // const onCancel = () => {
  //   setVisible(false);
  // };

  return (
    <div className={styles.boxItem} style={style}>
      <div className={styles.title}>{title}</div>
      <div className={styles.boxItemContent}>{children}</div>
    </div>
  );
};

export default connect(dvaPropsData)(Index);
