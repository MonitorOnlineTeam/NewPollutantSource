/*
 * @Author: JiaQi 
 * @Date: 2025-04-16 11:39:06 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-04-16 11:40:36
 * @Description: 设备维护检修记录
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Empty, message } from 'antd';
import styles from './Patrol/styles.less';
import moment from 'moment';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';

const dvaPropsData = ({ loading, task }) => ({
  repairRecordLoading: loading.effects['task/GetPatrolAllRecord'],
});

const ZbDeviceRepair = props => {
  const { dispatch, TaskID, TypeID, repairRecordLoading } = props;
  const [formInfo, setFormInfo] = useState({});
  const [recordList, setRecordList] = useState([]);

  useEffect(() => {
    loadData();
  }, [TaskID, TypeID]);

  // 加载实际数据
  const loadData = () => {
    if (!TaskID || !TypeID) {
      message.error('任务ID或类型ID不能为空');
      return;
    }

    dispatch({
      actionType: 'GetRepairRecordZB',
      type: 'task/GetPatrolAllRecord',
      payload: {
        TaskID,
        TypeID,
      },
      callback: res => {
        console.log('GetRepairRecordZB返回数据:', res);
        if (res && res.length > 0) {
          const mainData = res[0]?.Main || {};
          const records = res[0]?.RecordList || [];
          
          setFormInfo(mainData);
          setRecordList(records);
        }
      },
    });
  };

  // 渲染表头信息（企业名称和巡检日期）
  const renderHeaderInfo = () => {
    const entName = formInfo?.Content?.EntName || '';
    const inspectionDate = formInfo?.Content?.InspectionDate ? 
      moment(formInfo.Content.InspectionDate).format('YYYY-MM-DD HH:mm:ss') : '';

    return (
      <div className={styles.header}>
        <div className={styles.title}>设备维护检修记录</div>
        <div className={styles.info}>
          <span>企业名称：{entName}</span>
          <span>巡检日期：{inspectionDate}</span>
        </div>
      </div>
    );
  };

  // 渲染任务信息表格 - 左右布局
  const renderTaskInfo = () => {
    const content = formInfo?.Content || {};
    
    const taskName = content.TaskName || '';
    const taskType = content.TaskType || '';
    const taskSource = content.TaskSource || '';
    const maintenanceUnit = content.MaintenanceManagementUnit || '';
    const maintenancePerson = content.BDSB || '';
    
    const workingTimeBegin = content.WorkingDateBegin ? 
      moment(content.WorkingDateBegin).format('YYYY-MM-DD HH:mm:ss') : '';
    const workingTimeEnd = content.WorkingDateEnd ? 
      moment(content.WorkingDateEnd).format('YYYY-MM-DD HH:mm:ss') : '';
    
    const faultTimeBegin = content.CheckBTime ? 
      moment(content.CheckBTime).format('YYYY-MM-DD HH:mm:ss') : '';
    const faultTimeEnd = content.CheckETime ? 
      moment(content.CheckETime).format('YYYY-MM-DD HH:mm:ss') : '';
    
    const maintenanceTimeBegin = content.MaintenanceBeginTime ? 
      moment(content.MaintenanceBeginTime).format('YYYY-MM-DD HH:mm:ss') : '';
    const maintenanceTimeEnd = content.MaintenanceEndTime ? 
      moment(content.MaintenanceEndTime).format('YYYY-MM-DD HH:mm:ss') : '';
    
    const stopTime = content.InspectionDate ? 
      moment(content.InspectionDate).format('YYYY-MM-DD HH:mm:ss') : '';

    return (
      <div className={styles.taskSection}>
        <table className={styles.headerTable} style={{ borderCollapse: 'collapse', border: '1px solid #453f3f', marginBottom: '20px' }}>
          <tbody>
            <tr>
              <td style={{ width: '15%', backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}>任务项名称：</td>
              <td style={{ width: '35%', padding: '8px', border: '1px solid #453f3f' }}>{taskName}</td>
              <td style={{ width: '15%', backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}>任务项类型：</td>
              <td style={{ width: '35%', padding: '8px', border: '1px solid #453f3f' }}>{taskType}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}>来源：</td>
              <td style={{ padding: '8px', border: '1px solid #453f3f' }}>{taskSource}</td>
              <td style={{ backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}>运维管理单位：</td>
              <td style={{ padding: '8px', border: '1px solid #453f3f' }}>{maintenanceUnit}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}>运维人：</td>
              <td style={{ padding: '8px', border: '1px solid #453f3f' }}>{maintenancePerson}</td>
              <td style={{ backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}>工作时间：</td>
              <td style={{ padding: '8px', border: '1px solid #453f3f' }}>{`${workingTimeBegin} ～ ${workingTimeEnd}`}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}>故障时间：</td>
              <td style={{ padding: '8px', border: '1px solid #453f3f' }}>{`${faultTimeBegin} ～ ${faultTimeEnd}`}</td>
              <td style={{ backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}>维修时间：</td>
              <td style={{ padding: '8px', border: '1px solid #453f3f' }}>{`${maintenanceTimeBegin} ～ ${maintenanceTimeEnd}`}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}>停机时间：</td>
              <td style={{ padding: '8px', border: '1px solid #453f3f' }}>{stopTime}</td>
              <td style={{ backgroundColor: '#fafafa', padding: '8px', border: '1px solid #453f3f', fontWeight: 'bold' }}></td>
              <td style={{ padding: '8px', border: '1px solid #453f3f' }}></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // 渲染设备详情
  const renderDeviceDetails = () => {
    if (!recordList || recordList.length === 0) {
      return <Empty description="暂无维修详情数据" />;
    }

    return recordList.map((record, index) => (
      <div key={record.ID || index}>
        <div className={styles.subtitle}>{record.ReplaceComponents}</div>
        <table className={styles.mainTable} style={{ borderCollapse: 'collapse', border: '1px solid #453f3f' }}>
          <thead>
            <tr>
              <th style={{ width: '12%', backgroundColor: '#fafafa' }}>更换部件</th>
              <th style={{ width: '20%', backgroundColor: '#fafafa' }}>检修情况描述</th>
              <th style={{ width: '15%', backgroundColor: '#fafafa' }}>维修后系统运行情况</th>
              <th style={{ width: '10%', backgroundColor: '#fafafa' }}>站房清理</th>
              <th style={{ width: '10%', backgroundColor: '#fafafa' }}>停机检修情况</th>
              <th style={{ width: '18%', backgroundColor: '#fafafa' }}>备注</th>
              <th style={{ width: '15%', backgroundColor: '#fafafa' }}>离开时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #453f3f', padding: '8px' }}>{record.ReplaceComponents || '-'}</td>
              <td style={{ border: '1px solid #453f3f', padding: '8px' }}>{record.RepairDescribe || '-'}</td>
              <td style={{ border: '1px solid #453f3f', padding: '8px' }}>{record.RepairAfterRun || '-'}</td>
              <td style={{ border: '1px solid #453f3f', padding: '8px' }}>{record.StationClean || '-'}</td>
              <td style={{ border: '1px solid #453f3f', padding: '8px' }}>{record.ShutdownSituation || '-'}</td>
              <td style={{ border: '1px solid #453f3f', padding: '8px' }}>{record.Remark || '-'}</td>
              <td style={{ border: '1px solid #453f3f', padding: '8px' }}>{record.LeaveTime ? moment(record.LeaveTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ));
  };

  // 渲染维修前图片（故障体现、报警等）
  const renderBeforeRepairImages = () => {
    const bdjgPic = formInfo?.Content?.BDJGPic;
    if (!bdjgPic || !bdjgPic.ImgList || bdjgPic.ImgList.length === 0) {
      return null;
    }

    // 将图片数据转换成SdlUpload需要的格式
    const fileList = bdjgPic.ImgList.map((item, index) => ({
      uid: bdjgPic.AttachID || `bdjg-${index}`,
      name: bdjgPic.ImgNameList?.[index] || `图片${index + 1}`,
      status: 'done',
      url: `/${item}`
    }));

    return (
      <div className={styles.uploadSection}>
        <div className={styles.uploadTitle}>维修前（故障体现、报警等）</div>
        <SdlUpload
          cuid={bdjgPic.AttachID}
          fileList={fileList}
          accept="image/*"
          isView={true}
        />
      </div>
    );
  };

  // 渲染维修后图片（正常表现）
  const renderAfterRepairImages = () => {
    const bdryPic = formInfo?.Content?.BDRYPic;
    if (!bdryPic || !bdryPic.ImgList || bdryPic.ImgList.length === 0) {
      return null;
    }

    // 将图片数据转换成SdlUpload需要的格式
    const fileList = bdryPic.ImgList.map((item, index) => ({
      uid: bdryPic.AttachID || `bdry-${index}`,
      name: bdryPic.ImgNameList?.[index] || `图片${index + 1}`,
      status: 'done',
      url: `/${item}`
    }));

    return (
      <div className={styles.uploadSection}>
        <div className={styles.uploadTitle}>维修后（正常表现）</div>
        <SdlUpload
          cuid={bdryPic.AttachID}
          fileList={fileList}
          accept="image/*"
          isView={true}
        />
      </div>
    );
  };

  // 渲染签名
  const renderSignature = () => {
    if (!formInfo.SignContent) {
      return null;
    }

    return (
      <div className={styles.signatureSection}>
        <div className={styles.signatureTitle}>巡检人员签字：</div>
        <img src={formInfo.SignContent} alt="签名" className={styles.signatureImage} />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {repairRecordLoading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>数据加载中...</div>
      ) : (
        <>
          {renderHeaderInfo()}
          {renderTaskInfo()}
          {renderDeviceDetails()}
          {renderBeforeRepairImages()}
          {renderAfterRepairImages()}
          {renderSignature()}
        </>
      )}
    </div>
  );
};

export default connect(dvaPropsData)(ZbDeviceRepair);
