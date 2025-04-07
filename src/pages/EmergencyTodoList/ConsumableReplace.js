import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Empty, Button, message } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
import styles from './ConsumableReplace.less';
import ImageLightboxView from '@/components/ImageLightboxView';

const dvaPropsData = ({ loading, task }) => ({});

const ConsumableReplace = props => {
  const { dispatch, typeID, taskID } = props;
  const [formData, setFormData] = useState([]);
  const [formInfo, setFormInfo] = useState({});

  useEffect(() => {
    loadData();
  }, [typeID, taskID]);

  const loadData = () => {
    dispatch({
      type: 'task/GetPatrolAllRecord',
      actionType: 'GetConsumablesReplaceRecordZB',
      payload: {
        taskID,
        typeID,
      },
      callback: result => {
        let data = result?.[0] || {};
        setFormData(data?.RecordList || []);
        setFormInfo({
          ...data.Main,
        });
      },
    });
  };

  // 渲染表体
  const renderTableBody = () => {
    return formData?.map((item, index) => {
      let data = item.Data || {};
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{data.ConsumablesName}</td>
          <td>{data.ReplaceDate}</td>
          <td>{data.LastDate}</td>
          <td>{data.Model}</td>
          <td>{data.Num}</td>
          <td>{data.Unit}</td>
          <td>{data.SuggestionDate}</td>
          <td>{data.ReplaceSuggestion}</td>
          <td>
            {item.BeforeChange_PIC.ImgList.length > 0 ? (
              <ImageLightboxView images={item.BeforeChange_PIC.ImgList} />
            ) : (
              '-'
            )}
          </td>
          <td>
            {item.AfterChange_PIC.ImgList.length > 0 ? (
              <ImageLightboxView images={item.AfterChange_PIC.ImgList} />
            ) : (
              '-'
            )}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>易耗品更换记录表</div>
        <div className={styles.info}>
          <div>企业名称：{formInfo?.Content?.EntName}</div>
        </div>
      </div>

      <table className={styles.headerTable}>
        <tbody>
          <tr>
            <td>运维仪器：</td>
            <td>{formInfo?.Content?.OperationMachine}</td>
            <td>实际填写时间：</td>
            <td>{formInfo?.CreateTime}</td>
          </tr>
          <tr>
            <td>工作时间：</td>
            <td colSpan="3">
              {formInfo?.Content?.WorkingDateBegin} ~ {formInfo?.Content?.WorkingDateEnd}
            </td>
          </tr>
        </tbody>
      </table>
      {/* 易耗品更换记录 */}
      <table className={styles.mainTable}>
        <thead>
          <tr>
            <th style={{ width: '5%' }}>序号</th>
            <th style={{ width: '10%' }}>易耗品名称</th>
            <th style={{ width: '10%' }}>本次更换日期</th>
            <th style={{ width: '10%' }}>上次更换日期</th>
            <th style={{ width: '8%' }}>规格型号</th>
            <th style={{ width: '7%' }}>数量</th>
            <th style={{ width: '7%' }}>单位</th>
            <th style={{ width: '10%' }}>说明书建议周期</th>
            <th style={{ width: '13%' }}>更换情况说明</th>
            <th style={{ width: '10%' }}>易耗品更换前</th>
            <th style={{ width: '10%' }}>易耗品更换后</th>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
        <tfoot>
          <tr>
            <td colSpan="11" className={styles.signatureCell}>
              巡检人员签字：
              <img src={`${formInfo.SignContent}`} alt="签名" className={styles.signatureImage} />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default connect(dvaPropsData)(ConsumableReplace);
