/*
 * @Author: JiaQi
 * @Date: 2025-04-07 15:52:04
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-04-17 15:24:07
 * @Description:  标准物质更换记录表
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Empty, Button, message } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
import styles from './ConsumableReplace.less';
import ImageLightboxView from '@/components/ImageLightboxView';
import moment from 'moment';
const dvaPropsData = ({ loading, task }) => ({});

const RMR = props => {
  const { dispatch, typeID, taskID } = props;
  const [formData, setFormData] = useState([]);
  const [formInfo, setFormInfo] = useState({});

  useEffect(() => {
    loadData();
  }, [typeID, taskID]);

  const loadData = () => {
    dispatch({
      type: 'task/GetPatrolAllRecord',
      actionType: 'GetStandardGasRepalceRecordZB',
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
          <td>{data.StandardGasName || item.StandardGasCodeName}</td>
          <td>{data.StandardGasDensity}</td>
          <td>{data.Unit}</td>
          <td>{data.Num}</td>
          <td>{data.Volume}</td>
          <td>{data.Supplier}</td>
          <td>{moment(data.LastDate).format('YYYY-MM-DD')}</td>
          <td>{moment(data.ReplaceDate).format('YYYY-MM-DD')}</td>
          <td>{data.ChangeBTime}</td>
          <td>{data.ChangeETime}</td>
          <td>{moment(data.ExpirationDate).format('YYYY-MM-DD')}</td>
          <td>{data.ChangeDescribe}</td>
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
        <div className={styles.title}>标准物质更换记录表</div>
        <div className={styles.info}>
          <div>企业名称：{formInfo?.Content?.EntName}</div>
        </div>
      </div>

      <table className={styles.headerTable}>
        <tbody>
          <tr>
            <td style={{ width: '13%' }}>维护管理单位：</td>
            <td style={{ width: '20%' }}>{formInfo?.Content?.MaintenanceManagementUnit}</td>
            <td style={{ width: '13%' }}>安装地点：</td>
            <td style={{ width: '20%' }}>{formInfo?.Content?.PoingName}</td>
            <td style={{ width: '14%' }}>运维仪器：</td>
            <td style={{ width: '20%' }}>{formInfo?.Content?.OperationMachine}</td>
          </tr>
          <tr>
            <td style={{ width: '13%' }}>实际填写时间：</td>
            <td style={{ width: '20%' }}>{formInfo?.CreateTime}</td>
            <td style={{ width: '13%' }}>工作时间：</td>
            <td colSpan="7">
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
            <th style={{ width: '6%' }}>标准物质名称</th>
            <th style={{ width: '6%' }}>浓度</th>
            <th style={{ width: '5%' }}>单位</th>
            <th style={{ width: '5%' }}>数量</th>
            <th style={{ width: '5%' }}>体积</th>
            <th style={{ width: '8%' }}>供应商</th>
            <th style={{ width: '8%' }}>上次更换日期</th>
            <th style={{ width: '8%' }}>本次更换日期</th>
            <th style={{ width: '8%' }}>开始时间</th>
            <th style={{ width: '8%' }}>结束时间</th>
            <th style={{ width: '8%' }}>有效期至</th>
            <th style={{ width: '10%' }}>更换情况说明</th>
            <th style={{ width: '8%' }}>标准物质更换前</th>
            <th style={{ width: '8%' }}>标准物质更换后</th>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={{ backgroundColor: '#fafafa', textAlign: 'left' }}>
              运行维护人员：
            </td>
            <td colSpan="5">{formInfo?.CreateUserID}</td>
            <td colSpan="2" style={{ backgroundColor: '#fafafa', textAlign: 'left' }}>
              时间：
            </td>
            <td colSpan="6">{formInfo?.CreateTime}</td>
          </tr>
          <tr>
            <td colSpan="15" className={styles.signatureCell}>
              巡检人员签字：
              <img src={`${formInfo.SignContent}`} alt="签名" className={styles.signatureImage} />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default connect(dvaPropsData)(RMR);
